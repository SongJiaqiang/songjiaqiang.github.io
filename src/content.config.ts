import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const lang = z.enum(['zh-cn', 'en']);

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		cover: z.string().optional(),
		draft: z.boolean().default(false),
		lang,
	}),
});

const travel = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/travel' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		location: z.string(),
		date: z.coerce.date(),
		cover: z.string(),
		photos: z.array(z.string()).default([]),
		videos: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		lang,
	}),
});

const apps = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
	schema: z.object({
		name: z.string(),
		tagline: z.string(),
		summary: z.string(),
		status: z.enum(['active', 'archived']),
		order: z.number(),
		lang,
		hero: z.string().optional(),
		icon: z.string().optional(),
		screenshots: z.array(z.string()).default([]),
		docs: z.string(),
		links: z
			.object({
				github: z.string().optional(),
				appStore: z.string().optional(),
				play: z.string().optional(),
				website: z.string().optional(),
			})
			.default({}),
	}),
});

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	blog,
	apps,
	travel,
};
