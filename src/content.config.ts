import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			tags: z.array(z.string()).optional(),
			syndicate: z.array(z.string()).optional(),
			devtoTags: z.array(z.string()).max(4).optional(),
			devtoSeries: z.string().optional(),
			devtoPublished: z.boolean().optional(),
			// External article link (for Hashnode-synced posts)
			externalUrl: z.string().url().optional(),
			// Source badge label (e.g. "hashnode")
			source: z.string().optional(),
		}),
});

export const collections = { blog };
