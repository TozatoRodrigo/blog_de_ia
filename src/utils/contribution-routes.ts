import type { Lang } from '../i18n/lang';

type ContributionEntry = {
  data: {
    seoSlug: string;
    translationKey: string;
  };
};

export function contributionIndexPath(lang: Lang): string {
  return lang === 'pt-BR' ? '/contribuicoes/' : '/en/contributions/';
}

export function contributionPath(lang: Lang, seoSlug: string): string {
  return `${contributionIndexPath(lang)}${seoSlug}/`;
}

export function assertUniqueContributionSlugs(
  lang: Lang,
  entries: Array<{ data: { seoSlug: string } }>,
) {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.data.seoSlug)) {
      throw new Error(`duplicate-contribution-seo-slug:${lang}:${entry.data.seoSlug}`);
    }
    seen.add(entry.data.seoSlug);
  }
}

export function findContributionTranslation<T extends ContributionEntry>(
  entries: T[],
  translationKey: string,
  lang: Lang,
): T {
  const matches = entries.filter((entry) => entry.data.translationKey === translationKey);
  if (matches.length === 0) {
    throw new Error(`missing-contribution-translation:${lang}:${translationKey}`);
  }
  if (matches.length > 1) {
    throw new Error(`duplicate-contribution-translation:${lang}:${translationKey}`);
  }
  return matches[0];
}
