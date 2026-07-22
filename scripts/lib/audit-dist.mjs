import * as cheerio from 'cheerio';

const ORIGIN = 'https://produtocomia.com.br';

function metadataWarnings(title, description) {
  const warnings = [];
  if (title.length < 30) warnings.push('title-under-30');
  if (title.length > 60) warnings.push('title-over-60');
  if (description.length < 70) warnings.push('description-under-70');
  if (description.length > 160) warnings.push('description-over-160');
  return warnings;
}

export function normalizePageUrl(input) {
  const url = new URL(input, ORIGIN);
  url.hash = '';
  url.search = '';

  if (url.origin !== ORIGIN) return null;
  if (url.pathname === '/' || /\/[^/]+\.[a-z0-9]{2,8}$/i.test(url.pathname)) return url.href;
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}

export function auditHtml({ html, expectedUrl, requireCanonical = true, requireHreflang = true }) {
  const $ = cheerio.load(html);
  const errors = [];
  const title = $('title').first().text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim() || '';
  const canonical = $('link[rel="canonical"]').attr('href');
  const lang = $('html').attr('lang');

  if (!lang) errors.push('missing-html-lang');
  if ($('h1').length !== 1) errors.push('expected-one-h1');
  if (requireCanonical && (!canonical || normalizePageUrl(canonical) !== normalizePageUrl(expectedUrl))) {
    errors.push('canonical-mismatch');
  }

  if (requireHreflang) {
    const hreflangs = new Set(
      $('link[rel="alternate"][hreflang]')
        .toArray()
        .map((element) => $(element).attr('hreflang')),
    );
    for (const code of ['pt-BR', 'en', 'x-default']) {
      if (!hreflangs.has(code)) errors.push(`missing-hreflang-${code}`);
    }
  }

  for (const element of $('script[type="application/ld+json"]').toArray()) {
    try {
      JSON.parse($(element).text());
    } catch {
      errors.push('invalid-json-ld');
      break;
    }
  }

  return {
    errors,
    warnings: metadataWarnings(title, description),
  };
}
