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

Hashnode should be used as a distribution channel, not the primary identity source.

Recommended policy:

1. Publish full canonical articles on the Astro site first.
2. Cross-post to Hashnode only after the canonical page exists.
3. Set the Hashnode canonical URL to the matching Astro post when publishing the same article.
4. If an article remains Hashnode-only, include a strong author bio and links back to the About page, case studies, GitHub, and portfolio.
5. Avoid duplicate full articles without canonical linking.

## Recommended Publishing Workflow

Use an Astro-first publishing workflow.

1. Write the full post as MDX in `src/content/blog`.
2. Push the post to GitHub and let Vercel publish the canonical page.
3. After the canonical URL exists, syndicate the article to Hashnode.
4. On Hashnode, set the canonical URL to the Astro post URL.
5. Store the Hashnode URL or post ID in frontmatter or a sync manifest so updates can target the same syndicated copy.

This keeps entity authority on `ker102blog.vercel.app` while still using Hashnode for discovery.

## Automation Options

### Option A: Astro-first + GitHub Action

Recommended default.

- Trigger when a new MDX post is merged.
- Build the canonical Astro URL from the post slug.
- Call the Hashnode GraphQL API from a server-side script using `HASHNODE_TOKEN` and `HASHNODE_PUBLICATION_ID`.
- Create a Hashnode draft first, then publish after checking formatting.
- Update a sync manifest with the Hashnode post ID and URL.

Important constraint: Hashnode's API is currently documented as a GraphQL API at `https://gql.hashnode.com`, and Hashnode announced API access as a Pro publication feature on May 13, 2026. The exact mutation fields should be verified against the live schema with the publication token before implementation.

Primary references:

- Hashnode GraphQL API docs: <https://docs.hashnode.com/quickstart/introduction>
- Hashnode changelog entry for paid API access: <https://hashnode.com/changelog>

### Option B: Codex/N8n Syndication Command

Useful before building a full CI workflow.

- Keep writing posts in this repo.
- Run a local command or n8n workflow to syndicate one selected post.
- The automation converts MDX to Hashnode-compatible Markdown, attaches the canonical URL, and creates or updates the Hashnode post.
- This is lower risk because each post can be reviewed before publication.

### Option C: Hashnode-first Import

Use only if the writing experience on Hashnode becomes the main workflow.

- Publish on Hashnode first.
- Pull the post into Astro through the API or RSS.
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
