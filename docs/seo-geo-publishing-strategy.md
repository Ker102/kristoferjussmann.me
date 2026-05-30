# SEO/GEO Publishing Strategy

Last updated: 2026-05-29

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
- long-form technical blog posts;
- `llms.txt` for AI-readable summary;
- links to GitHub, LinkedIn, Hugging Face, Kaelux.dev, and Hashnode.

## Hashnode Role

Hashnode should be used as a distribution channel, not the primary identity source. Since Hashnode API access is now a paid/publication-level constraint, do not use Hashnode as an inbound source for this site.

Recommended policy:

1. Publish full canonical articles on the Astro site first.
2. Cross-post to Hashnode only after the canonical page exists.
3. Set the Hashnode canonical URL to the matching Astro post when publishing the same article.
4. If an article remains Hashnode-only, include a strong author bio and links back to the About page, case studies, GitHub, and portfolio.
5. Avoid duplicate full articles without canonical linking.

## Cross-Posting Targets

Recommended order:

1. **DEV Community / Forem**: best automation target. The DEV API supports creating and updating articles with `canonical_url`, so this is the strongest candidate for "write once in Astro, syndicate automatically".
2. **HackerNoon**: strong technical audience and supports canonical links through the "First seen at" story setting, but editorial review makes it better for selected polished posts than automatic every-post syndication.
3. **Medium**: useful for reach and supports manual canonical links, but Medium no longer issues new API integration tokens, so it should be treated as manual import/cross-posting unless an existing token already works.
4. **LinkedIn Articles / Newsletter**: useful for recruiter and professional visibility, but treat it as a short adapted version or announcement because it is not a reliable canonical syndication target.
5. **DZone**: credible developer audience but editorial guidelines prioritize original submissions and ask for care around syndicated content, so use it only for high-effort technical articles that fit their review process.

Avoid blasting identical full articles everywhere. For SEO and GEO, publish the canonical version here first, then syndicate selectively with canonical links and a short "originally published" note.

## Recommended Publishing Workflow

Use an Astro-first publishing workflow.

1. Write the full post as MDX in `src/content/blog`.
2. Push the post to GitHub and let Vercel publish the canonical page.
3. After the canonical URL exists, syndicate the article to DEV first, and optionally to Hashnode, HackerNoon, Medium, or LinkedIn depending on the post.
4. On each external platform that supports it, set the canonical URL to the Astro post URL.
5. Store the external post URL or post ID in frontmatter or a sync manifest so updates can target the same syndicated copy.

This keeps entity authority on `ker102blog.vercel.app` while still using external platforms for discovery.

## Automation Options

### Option A: Astro-first + DEV GitHub Action

Recommended default.

- Trigger when a new MDX post is merged.
- Build the canonical Astro URL from the post slug.
- Call the DEV / Forem API from a server-side script using `DEVTO_API_KEY`.
- Create a DEV draft first, then publish after checking formatting.
- Set `canonical_url` to the Astro post.
- Update a sync manifest with the DEV article ID and URL.

Primary reference:

- Forem / DEV API docs: <https://developers.forem.com/api/v1>

### Option B: Manual/Selective Hashnode or Medium Cross-Post

Useful when a post deserves extra reach but API access is limited.

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

Useful before building a full CI workflow.

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

Each strategic blog post should include:

- descriptive title with the topic and evidence angle;
- clear description in frontmatter;
- TL;DR near the top;
- first-person technical evidence;
- links to relevant projects, case studies, or repositories;
- date published and updated date;
- canonical page on this site if syndicated elsewhere.

## GEO Checklist

- Entity name appears as "Kristofer Jussmann (Ker102)" in important metadata.
- About page clearly says what Kristofer does and what he should not be described as.
- Blog posts include clear summaries that AI systems can extract.
- Case studies include project facts, evidence, architecture, costs, and limitations.
- `llms.txt` stays current when positioning or major project evidence changes.
