import fs from 'node:fs/promises';
import path from 'node:path';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const SITE_URL = (process.env.SITE_URL || 'https://ker102blog.vercel.app').replace(/\/$/, '');
const DEVTO_API_URL = 'https://dev.to/api/articles';
const DEVTO_API_KEY = process.env.DEVTO_API_KEY;
const SELECTED_SLUG = process.env.DEVTO_POST_SLUG;
const SHOULD_PUBLISH = process.env.DEVTO_PUBLISH === 'true';

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function parseScalar(value) {
	const trimmed = value.trim();
	if (trimmed === 'true') return true;
	if (trimmed === 'false') return false;
	if (
		(trimmed.startsWith("'") && trimmed.endsWith("'")) ||
		(trimmed.startsWith('"') && trimmed.endsWith('"'))
	) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}

function parseInlineArray(value) {
	const trimmed = value.trim();
	if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null;
	const inner = trimmed.slice(1, -1).trim();
	if (!inner) return [];
	return inner.split(',').map((item) => parseScalar(item));
}

function parseFrontmatter(source, filePath) {
	const match = source.match(frontmatterPattern);
	if (!match) {
		throw new Error(`${filePath} is missing YAML frontmatter`);
	}

	const data = {};
	const lines = match[1].split(/\r?\n/);
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		if (!line.trim() || line.trim().startsWith('#')) continue;
		const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
		if (!keyMatch) continue;

		const [, key, rawValue] = keyMatch;
		if (rawValue.trim() === '') {
			const values = [];
			while (lines[index + 1]?.match(/^\s*-\s+/)) {
				index += 1;
				values.push(parseScalar(lines[index].replace(/^\s*-\s+/, '')));
			}
			data[key] = values;
			continue;
		}

		data[key] = parseInlineArray(rawValue) ?? parseScalar(rawValue);
	}

	return {
		data,
		body: source.slice(match[0].length).trim(),
	};
}

function slugFromFile(fileName) {
	return fileName.replace(/\.(md|mdx)$/i, '');
}

function shouldSendToDevto(data) {
	const syndicate = Array.isArray(data.syndicate) ? data.syndicate : [];
	const tags = Array.isArray(data.tags) ? data.tags : [];
	return [...syndicate, ...tags].some((value) => String(value).toLowerCase() === 'devto');
}

function devtoTagsFor(data) {
	if (Array.isArray(data.devtoTags) && data.devtoTags.length > 0) {
		return data.devtoTags.slice(0, 4).map((tag) => String(tag).replace(/^#/, ''));
	}

	if (Array.isArray(data.tags)) {
		return data.tags
			.filter((tag) => String(tag).toLowerCase() !== 'devto')
			.slice(0, 4)
			.map((tag) => String(tag).replace(/^#/, ''));
	}

	return ['devsecops', 'ai', 'cloud'];
}

function canonicalUrlFor(slug) {
	return `${SITE_URL}/blog/${slug}/`;
}

function buildBodyMarkdown({ body, canonicalUrl }) {
	return `${body}

---

Originally published on [Kristofer Jussmann / Ker102](${canonicalUrl}).`;
}

async function loadCandidates() {
	const files = (await fs.readdir(BLOG_DIR)).filter((file) => /\.(md|mdx)$/i.test(file));
	const posts = [];

	for (const file of files) {
		const slug = slugFromFile(file);
		if (SELECTED_SLUG && slug !== SELECTED_SLUG) continue;

		const filePath = path.join(BLOG_DIR, file);
		const source = await fs.readFile(filePath, 'utf8');
		const { data, body } = parseFrontmatter(source, filePath);
		if (!shouldSendToDevto(data)) continue;

		posts.push({ filePath, slug, data, body });
	}

	return posts;
}

async function devtoRequest(endpoint, options = {}) {
	const response = await fetch(`${DEVTO_API_URL}${endpoint}`, {
		...options,
		headers: {
			'api-key': DEVTO_API_KEY,
			'content-type': 'application/json',
			'user-agent': 'ker102blog-devto-sync',
			...(options.headers || {}),
		},
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`DEV API ${response.status} ${response.statusText}: ${text}`);
	}

	return response.json();
}

async function findExistingArticle(canonicalUrl) {
	const articles = await devtoRequest('/me/all?per_page=1000');
	return articles.find((article) => article.canonical_url === canonicalUrl);
}

async function upsertArticle(post) {
	const canonicalUrl = canonicalUrlFor(post.slug);
	const article = {
		title: post.data.title,
		description: post.data.description,
		body_markdown: buildBodyMarkdown({ body: post.body, canonicalUrl }),
		published: SHOULD_PUBLISH && post.data.devtoPublished === true,
		canonical_url: canonicalUrl,
		tags: devtoTagsFor(post.data),
		series: post.data.devtoSeries,
	};

	const existing = await findExistingArticle(canonicalUrl);
	if (existing) {
		const updated = await devtoRequest(`/${existing.id}`, {
			method: 'PUT',
			body: JSON.stringify({ article }),
		});
		console.log(`Updated DEV draft/article for ${post.slug}: ${updated.url}`);
		return;
	}

	const created = await devtoRequest('', {
		method: 'POST',
		body: JSON.stringify({ article }),
	});
	console.log(`Created DEV draft/article for ${post.slug}: ${created.url}`);
}

const posts = await loadCandidates();
if (posts.length === 0) {
	console.log('No blog posts opted into DEV syndication.');
	process.exit(0);
}

console.log(`Found ${posts.length} DEV syndication candidate(s):`);
for (const post of posts) {
	console.log(`- ${post.slug} -> ${canonicalUrlFor(post.slug)}`);
}

if (!DEVTO_API_KEY) {
	console.log('DEVTO_API_KEY is not set, so this was a dry run.');
	process.exit(0);
}

for (const post of posts) {
	await upsertArticle(post);
}
