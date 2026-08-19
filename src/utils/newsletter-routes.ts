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
  if (slugs.some((slug) => /^\d{4}-\d{2}-\d{2}-/.test(slug))) throw new Error('dated-newsletter-seo-slug');
  if (new Set(slugs).size !== slugs.length) throw new Error('duplicate-newsletter-seo-slug');
}

export function buildNewsletterRedirectMap(
  lang: Lang,
  entries: Array<{ id: string; data: { seoSlug: string } }>,
) {
  return entries.flatMap((entry) => {
    if (entry.id === entry.data.seoSlug) return [];
    const legacy = legacyNewsletterPath(lang, entry.id);
    const target = newsletterPath(lang, entry.data.seoSlug);
    return [`"${legacy.slice(0, -1)}" "${target}";`, `"${legacy}" "${target}";`];
  });
}
