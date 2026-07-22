import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

export async function GET(context) {
  const newsletters = await getCollection('newsletters', ({ data }) => !data.draft);
  newsletters.sort((a, b) => b.data.date.localeCompare(a.data.date));

  return rss({
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    site: context.site,
    items: newsletters.map((entry) => ({
      title: entry.data.title,
      pubDate: new Date(entry.data.date + 'T00:00:00'),
      description: entry.data.excerpt,
      link: `/newsletter/${entry.id}/`,
      categories: entry.data.tags,
      author: SITE.email,
    })),
    customData: `<language>pt-BR</language>`,
  });
}
