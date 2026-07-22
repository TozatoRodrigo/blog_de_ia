import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const newsletters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletters' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const newslettersEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/newsletters-en' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const guideSchema = z.object({
  title: z.string(), seoTitle: z.string(), description: z.string(),
  datePublished: z.string(), dateModified: z.string(),
  tags: z.array(z.string()).default([]), alternateSlug: z.string(),
  sources: z.array(z.object({ name: z.string(), url: z.string().url() })).default([]),
  cluster: z.enum(['agents', 'governance', 'product']).optional(),
  isHub: z.boolean().default(false),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  howToSteps: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
  downloads: z.array(z.object({ label: z.string(), href: z.string(), format: z.string() })).default([]),
  draft: z.boolean().default(false),
});

const guides = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/guides' }), schema: guideSchema });
const guidesEn = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/guides-en' }), schema: guideSchema });

export const collections = { newsletters, 'newsletters-en': newslettersEn, guides, 'guides-en': guidesEn };
