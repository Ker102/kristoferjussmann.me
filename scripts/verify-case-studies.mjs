import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

const checks = [
	{
		name: 'case studies route exists',
		pass: () => exists('src/pages/case-studies.astro'),
	},
	{
		name: 'PromptTriage has a dedicated case study detail route and exportable architecture asset',
		pass: () =>
			exists('src/pages/case-studies/prompttriage.astro') &&
			exists('public/images/case-studies/prompttriage/prompttriage-architecture.svg'),
	},
	{
		name: 'case studies page follows required template sections',
		pass: () => {
			const page = read('src/pages/case-studies/prompttriage.astro');
			return [
				'Executive summary',
				'Problem',
				'Context and constraints',
				'Requirements',
				'Architecture',
				'Security model',
				'Deployment pipeline',
				'Operations',
				'Cost analysis',
				'Results',
				'Tradeoffs',
				'Failure modes and lessons learned',
				'What I would improve next',
				'Repository and demo links',
				'Interview explanation',
				'Resume bullets',
			].every((section) => page.includes(section));
		},
	},
	{
		name: 'PromptTriage case study reflects current architecture and evidence assets',
		pass: () => {
			const page = read('src/pages/case-studies/prompttriage.astro');
			return [
				'Supabase Auth',
				'Stripe',
				'Azure Container Apps',
				'Azure Container Registry',
				'PromptTriageArchitecture',
				'Research evidence gallery',
				'Bar_chart_anti-pattern_202603241606.jpeg',
				'Heatmap_chart_with_202603222343.jpeg',
				'AI Format Wars',
				'Research program summary',
				'publicly leaked system prompts',
				'Anthropic, OpenAI, Google, Perplexity',
				'1,080',
				'three-judge LLM panel',
				'28,000 Production AI System Prompts',
				'EUR 178.12',
				'38.19 hours',
				'prompttriagsgortened.mp4',
				'Google Cloud Run',
				'Unsloth',
				'QLoRA',
				'resumed with the next job',
				'Remaining template gaps',
				'openImageModal',
				'Dual-color_bar_chart_202603222343.jpeg',
				'Pie_chart_with_202603222343.jpeg',
				'Evidence still needed',
				'Benchmark impact',
				'Edge cases where PromptTriage mattered most',
				'Format and documentation status',
				'href="/downloads/prompttriage-case-study.pdf"',
				'+13.9%',
				'86.7%',
			].every((token) => page.includes(token)) && !page.includes('NextAuth');
		},
	},
	{
		name: 'PromptTriage PDF download is generated and linked',
		pass: () =>
			exists('public/downloads/prompttriage-case-study.pdf') &&
			exists('scripts/generate-prompttriage-case-study-pdf.py') &&
			read('src/pages/case-studies/prompttriage.astro').includes('/downloads/prompttriage-case-study.pdf'),
	},
	{
		name: 'PromptTriage architecture SVG keeps diagram labels readable',
		pass: () => {
			const svg = read('public/images/case-studies/prompttriage/prompttriage-architecture.svg');
			return [
				'smallDark',
				'Azure Registry',
				'Azure Apps',
				'Prompt output',
				'width="258"',
			].every((token) => svg.includes(token)) && !svg.includes('Azure Container Registry</text>');
		},
	},
	{
		name: 'site has chrome theme tokens and a persistent light/dark toggle',
		pass: () => {
			const globalCss = read('src/styles/global.css');
			const head = read('src/components/BaseHead.astro');
			const header = read('src/components/Header.astro');
			const caseIndex = read('src/pages/case-studies.astro');
			const detailPage = read('src/pages/case-studies/prompttriage.astro');
			return [
				'data-mode',
				'site-theme',
				'chrome-gradient',
				'--chrome-silver',
				'data-theme-toggle',
				'theme-toggle',
				'Kristofer Jussmann',
			].every((token) => `${globalCss}\n${head}\n${header}`.includes(token)) &&
				!`${caseIndex}\n${detailPage}`.includes('0, 113, 227') &&
				!`${caseIndex}\n${detailPage}`.includes('#0071e3') &&
				!`${caseIndex}\n${detailPage}`.includes('#0066cc');
		},
	},
	{
		name: 'case studies page has evidence statuses and mobile-first CSS',
		pass: () => {
			const page = `${read('src/pages/case-studies.astro')}\n${read('src/pages/case-studies/prompttriage.astro')}`;
			return [
				'Complete case study',
				'Source verified',
				'Case study in progress',
				'href="/case-studies/prompttriage"',
				'@media (min-width:',
				'grid-template-columns',
			].every((token) => page.includes(token));
		},
	},
	{
		name: 'shared header links to case studies',
		pass: () => read('src/components/Header.astro').includes('href="/case-studies"'),
	},
	{
		name: 'shared header has smoother mobile navigation affordances',
		pass: () => {
			const header = read('src/components/Header.astro');
			return ['scroll-snap-type', 'scroll-padding-inline', 'touch-action: pan-x', 'will-change: transform'].every((token) =>
				header.includes(token),
			);
		},
	},
	{
		name: 'homepage links to case studies',
		pass: () => {
			const source = `${read('src/pages/index.astro')}\n${read('src/components/HomeFolders.jsx')}`;
			return source.includes("href: '/case-studies'") || source.includes('href="/case-studies"');
		},
	},
	{
		name: 'blog index has scrollable recent-post navigation with active state',
		pass: () => {
			const page = read('src/pages/blog/index.astro');
			return [
				'max-height: calc(100vh - 8.5rem)',
				'overflow-y: auto',
				'data-post-link',
				'recent-date',
				'IntersectionObserver',
				'aria-current',
				'is-active',
			].every((token) => page.includes(token));
		},
	},
	{
		name: 'public site source uses corrected LinkedIn destinations and solid light-mode brand text',
		pass: () => {
			const source = [
				'src/components/Header.astro',
				'src/components/Footer.astro',
				'src/pages/portfolio.astro',
				'src/content/blog/introducing-kaelux.mdx',
				'src/pages/case-studies/prompttriage.astro',
			].map(read).join('\n');
			const kaeluxPost = read('src/content/blog/introducing-kaelux.mdx');
			const header = read('src/components/Header.astro');
			return source.includes('https://www.linkedin.com/in/kristofer-jussmann-ker102/') &&
				source.includes('https://www.linkedin.com/company/kaelux-dev/') &&
				kaeluxPost.includes('/images/kaelux-banner.jpeg') &&
				!kaeluxPost.includes('/images/kaelux-banner.jpg') &&
				!source.includes('https://www.linkedin.com/company/kaelux)') &&
				!source.includes('https://www.linkedin.com/in/kristofer-jussmann/') &&
				header.includes('color: #050505') &&
				header.includes('-webkit-text-fill-color: currentColor');
		},
	},
	{
		name: 'mobile-first pass touched all page surfaces',
		pass: () => {
			const files = [
				'src/pages/index.astro',
				'src/pages/portfolio.astro',
				'src/pages/blog/index.astro',
				'src/layouts/BlogPost.astro',
				'src/components/Header.astro',
				'src/components/Footer.astro',
				'src/styles/global.css',
			];
			return files.every((file) => read(file).includes('@media'));
		},
	},
];

const failures = checks.filter((check) => {
	try {
		return !check.pass();
	} catch {
		return true;
	}
});

if (failures.length > 0) {
	console.error('Case studies verification failed:');
	for (const failure of failures) console.error(`- ${failure.name}`);
	process.exit(1);
}

console.log(`Case studies verification passed: ${checks.length}/${checks.length} checks`);
