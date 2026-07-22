export type Lang = 'pt-BR' | 'en';

export type LStr = { 'pt-BR': string; 'en': string };
export type LArr = { 'pt-BR': string[]; 'en': string[] };

export function t(field: LStr, lang: Lang): string {
  return field[lang];
}

export function ta(field: LArr, lang: Lang): string[] {
  return field[lang];
}

export function pick<T>(field: { 'pt-BR': T; 'en': T }, lang: Lang): T {
  return field[lang];
}

export const alternateLang: Lang[] = ['pt-BR', 'en'];

export function langPrefix(lang: Lang): string {
  return lang === 'pt-BR' ? '' : '/en';
}

export function langPath(path: string, lang: Lang): string {
  const prefix = langPrefix(lang);
  return `${prefix}${path}`;
}
