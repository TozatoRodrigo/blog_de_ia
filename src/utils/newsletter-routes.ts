import type { Lang } from '../i18n/lang';

export function newsletterPath(lang: Lang, seoSlug: string) {
  const prefix = lang === 'pt-BR' ? '/newsletter/' : '/en/newsletter/';
  return `${prefix}${seoSlug}/`;
}

export function legacyNewsletterPath(lang: Lang, id: string) {
  return newsletterPath(lang, id);
}

export function assertUniqueNewsletterSlugs(entries: Array<{ data: { seoSlug: string } }>) {
  const slugs = entries.map((entry) => entry.data.seoSlug);
  if (new Set(slugs).size !== slugs.length) throw new Error('duplicate-newsletter-seo-slug');
}
