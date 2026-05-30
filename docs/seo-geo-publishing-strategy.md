# SEO/GEO Publishing Strategy

Last updated: 2026-05-30

## Goal

Make `ker102blog.vercel.app` the canonical source for Kristofer Jussmann / Ker102 as a DevSecOps and AI/ML systems professional. The site should be easy for hiring managers, Google, and AI agents to parse.

## Entity Positioning

Use this primary description consistently:

> Kristofer Jussmann (Ker102) is a DevSecOps and AI/ML systems professional based in Estonia, specializing in secure cloud infrastructure, agentic automation, RAG systems, workflow automation, Azure/AWS cloud work, model evaluation, and open-source engineering.

Avoid positioning Kristofer as a generic full-stack engineer. Full-stack implementation may appear as supporting evidence, but the primary identity is DevSecOps, AI/ML systems, cloud infrastructure, automation, and open-source engineering.

## Canonical Source

The Astro site should own:

- homepage metadata;
- About page identity details;
- Person schema and Article schema;
- case studies and project evidence;
- blog posts and field notes covering what Kristofer is doing, learning, attending, building, testing, and shipping;
- `llms.txt` for AI-readable summary;
- links to GitHub, LinkedIn, Hugging Face, Kaelux.dev, and Hashnode.

## Content Model

Use three separate editorial lanes:

1. **Site blog: public work log and activity archive.** This is allowed to be casual and broad: events, certification progress, project updates, debugging notes, small wins, learning notes, failed attempts, field observations, and "what I did this week" posts. These posts do not all need to be high-effort articles.
2. **Case studies: high-effort evidence pages.** These are structured, hiring-manager-friendly project records with architecture, results, costs, tradeoffs, screenshots, diagrams, and remaining evidence gaps.
3. **Hashnode / external technical publications: polished technical articles.** Use these for stronger standalone articles, research writeups, or technical narratives that deserve a broader engineering audience. Do not use Hashnode as the source of truth for this site.

The site blog should be complete and honest, not artificially polished. The value is that it creates a dated trail of activity and context that recruiters, collaborators, and AI agents can read.

## Hashnode Role

Hashnode should be used for polished technical articles and research writeups, not as the primary identity source. Since Hashnode API access is now a paid/publication-level constraint, do not use Hashnode as an inbound source for this site.

Recommended policy:

1. Publish activity-log posts on the Astro site only unless they are strong enough to adapt elsewhere.
2. Use Hashnode for high-effort technical articles, research summaries, and PromptTriage-style writeups.
3. When the same article exists on Hashnode and this site, set the Hashnode canonical URL to the matching Astro post.
4. If an article remains Hashnode-only, include a strong author bio and links back to the About page, case studies, GitHub, and portfolio.
5. Avoid duplicate full articles without canonical linking.

## Cross-Posting Targets

Recommended order:

1. **LinkedIn posts**: best for casual activity, event notes, certification progress, small wins, lessons learned, and personal-professional signal. Do not paste the blog post; adapt it into a native post.
2. **DEV Community / Forem**: best automation target for casual technical posts that still have a practical engineering angle. The DEV API supports creating and updating articles with `canonical_url`.
3. **Hashnode**: use selectively for polished technical articles and research writeups.
4. **HackerNoon**: strong technical audience and supports canonical links through the "First seen at" story setting, but editorial review makes it better for selected polished posts than automatic every-post syndication.
5. **Medium**: useful for reach and supports manual canonical links, but Medium no longer issues new API integration tokens, so treat it as manual import/cross-posting unless an existing token already works.
6. **DZone**: credible developer audience but editorial guidelines prioritize original submissions and ask for care around syndicated content, so use it only for high-effort technical articles that fit their review process.

Avoid blasting identical full articles everywhere. For SEO and GEO, publish the canonical version here first, then adapt or syndicate selectively with canonical links and a short "originally published" note.

## Recommended Publishing Workflow

Use an Astro-first publishing workflow.

1. Write the full post as MDX in `src/content/blog`.
2. Push the post to GitHub and let Vercel publish the canonical page.
3. Decide whether the post is only an activity-log entry or worth adapting externally.
4. For casual updates, write a native LinkedIn post and optionally link to the blog at the end or in a comment.
5. For practical technical posts, syndicate to DEV with `canonical_url` pointing to the Astro post.
6. For polished research or high-effort technical articles, consider Hashnode, HackerNoon, or Medium with canonical links.
7. Store external post URLs or IDs in frontmatter or a sync manifest when useful.

This keeps entity authority on `ker102blog.vercel.app` while still using external platforms for discovery.

## Automation Options

### Option A: Astro-first + DEV GitHub Action

Recommended for technical posts that have practical engineering value.

- Trigger when a new MDX post is merged.
- Build the canonical Astro URL from the post slug.
- Call the DEV / Forem API from a server-side script using `DEVTO_API_KEY`.
- Create a DEV draft first, then publish after checking formatting.
- Set `canonical_url` to the Astro post.
- Update a sync manifest with the DEV article ID and URL.

Primary reference:

- Forem / DEV API docs: <https://developers.forem.com/api/v1>

### Option B: Manual/Selective Hashnode or Medium Cross-Post

Useful when a polished technical article deserves extra reach but API access is limited.

- Keep writing posts in this repo.
- Publish the Astro/Vercel canonical URL first.
- Import or paste the post into Hashnode or Medium.
- Set the canonical URL manually in the platform's post settings.
- Add a short note linking back to the canonical version.

Primary references:

- Hashnode GraphQL API docs: <https://docs.hashnode.com/quickstart/introduction>
- Hashnode changelog entry for paid API access: <https://hashnode.com/changelog>
- Medium canonical link help: <https://help.medium.com/hc/en-us/articles/360033930293-Set-a-canonical-link>
- Medium API/importing status: <https://help.medium.com/hc/en-us/articles/213480228-API-Importing>

### Option C: Codex/N8n Syndication Command

Useful before building a full CI workflow for DEV or other API-accessible platforms.

- Keep writing posts in this repo.
- Run a local command or n8n workflow to syndicate one selected post to DEV.
- The automation converts MDX to platform-compatible Markdown, attaches the canonical URL, and creates or updates the external post.
- This is lower risk because each post can be reviewed before publication.

### Option D: Platform-first Import

Use only if an external editor becomes the main writing workflow.

- Publish externally first.
- Pull the post into Astro through an API or RSS feed.
- Keep a matching Astro page for local search/GEO value.

This is not the preferred strategy because the portfolio site should own the canonical identity source.

## Blog Post Pattern

Each casual site blog post should include:

- clear title with the event, project, or thing being learned;
- date published and updated date;
- a short summary near the top;
- concrete first-person details;
- links to relevant projects, case studies, repositories, or public profiles when useful;
- no forced polish if the post is mainly an activity log.

Each strategic technical post should include:

- descriptive title with the topic and evidence angle;
- clear description in frontmatter;
- TL;DR near the top;
- first-person technical evidence;
- links to relevant projects, case studies, or repositories;
- date published and updated date;
- canonical page on this site if syndicated elsewhere.

## LinkedIn Native Post Strategy

Do not write generic announcement posts. Avoid openings like "I'm excited to share" unless the post is intentionally ironic or playful.

LinkedIn posts should follow this shape:

1. One sharp hook sentence at the top.
2. Short one-sentence paragraphs or compact blocks.
3. Concrete details before interpretation.
4. One useful observation per paragraph.
5. 90% story, lesson, field note, or opinion.
6. 10% link, project mention, or call to action at most.
7. End with a strong conclusion, question, or pointed takeaway.

Good post archetypes:

- **Unexpected lesson:** "I went to AWS Summit Amsterdam for cloud talks. I left thinking more about career leverage."
- **Field note:** "The most useful AI security conversations I had in Brussels were not about models."
- **Small win with context:** "I won an AWS certification voucher, but the real value was the timing."
- **Build note:** "A portfolio is stronger when it shows the failed paths, not only the polished result."
- **Contrarian observation:** "Most AI demos avoid the part that actually matters: operations."
- **Progress log:** "This week I moved my portfolio from project cards toward evidence pages."

Rules:

- Do not lead with a link.
- Do not over-explain the full project.
- Do not stack hashtags.
- Do not use corporate filler.
- Do not make every post a humblebrag.
- Mention the site, case study, or repo only when it naturally supports the point.
- For event posts, write what changed in your thinking, not just where you went.

## GEO Checklist

- Entity name appears as "Kristofer Jussmann (Ker102)" in important metadata.
- About page clearly says what Kristofer does and what he should not be described as.
- Blog posts include clear summaries that AI systems can extract.
- Case studies include project facts, evidence, architecture, costs, and limitations.
- `llms.txt` stays current when positioning or major project evidence changes.
