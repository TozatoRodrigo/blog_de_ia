import type { Lang } from '../i18n/lang';

export function contributionIndexPath(lang: Lang): string {
  return lang === 'pt-BR' ? '/contribuicoes/' : '/en/contributions/';
}

export function contributionPath(lang: Lang, seoSlug: string): string {
  return `${contributionIndexPath(lang)}${seoSlug}/`;
}
