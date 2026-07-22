import { SITE } from '../config.ts';

export type AlternateUrls = {
  'pt-BR': string;
  en: string;
  'x-default': string;
};

export type MetadataWarning =
  | 'title-under-30'
  | 'title-over-60'
  | 'description-under-70'
  | 'description-over-160';

export function canonicalPath(input: string): string {
  const url = new URL(input, SITE.url);
  const path = url.pathname || '/';
  const isFile = /\/[^/]+\.[a-z0-9]{2,8}$/i.test(path);

  if (path === '/' || isFile || path.endsWith('/')) return path;
  return `${path}/`;
}

export function absoluteUrl(input: string): string {
  return new URL(canonicalPath(input), SITE.url).toString();
}

export function buildAlternates(ptPath: string, enPath: string): AlternateUrls {
  const ptUrl = absoluteUrl(ptPath);

  return {
    'pt-BR': ptUrl,
    en: absoluteUrl(enPath),
    'x-default': ptUrl,
  };
}

export function metadataWarnings(title: string, description: string): MetadataWarning[] {
  const warnings: MetadataWarning[] = [];

  if (title.length < 30) warnings.push('title-under-30');
  if (title.length > 60) warnings.push('title-over-60');
  if (description.length < 70) warnings.push('description-under-70');
  if (description.length > 160) warnings.push('description-over-160');

  return warnings;
}
