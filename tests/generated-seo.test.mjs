import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

import * as cheerio from 'cheerio';

async function loadPage(pathname) {
  const html = await readFile(new URL(`../dist/${pathname}`, import.meta.url), 'utf8');
  return cheerio.load(html);
}

async function walkHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const url = new URL(entry.name, directory);
    if (entry.isDirectory()) return walkHtml(new URL(`${entry.name}/`, directory));
    return entry.isFile() && entry.name.endsWith('.html') ? [url] : [];
  }));
  return nested.flat();
}

function alternates($) {
  return Object.fromEntries(
    $('link[rel="alternate"][hreflang]')
      .toArray()
      .map((element) => [$(element).attr('hreflang'), $(element).attr('href')]),
  );
}

test('English home emits localized metadata and a complete hreflang set', async () => {
  const $ = await loadPage('en/index.html');

  assert.match($('title').text(), /Artificial Intelligence for Product Managers/);
  assert.match($('meta[name="description"]').attr('content'), /^Daily analysis/);
  assert.deepEqual(alternates($), {
    'pt-BR': 'https://produtocomia.com.br/',
    en: 'https://produtocomia.com.br/en/',
    'x-default': 'https://produtocomia.com.br/',
  });
  assert.equal($('meta[name="keywords"]').length, 0);
});

test('Portuguese topic emits self, English and x-default alternates', async () => {
  const $ = await loadPage('topicos/produto/index.html');

  assert.equal(
    $('link[rel="canonical"]').attr('href'),
    'https://produtocomia.com.br/topicos/produto/',
  );
  assert.deepEqual(alternates($), {
    'pt-BR': 'https://produtocomia.com.br/topicos/produto/',
    en: 'https://produtocomia.com.br/en/topics/product/',
    'x-default': 'https://produtocomia.com.br/topicos/produto/',
  });
  assert.equal($('meta[property="og:locale:alternate"]').attr('content'), 'en_US');
});

test('English newsletter links every tag to its translated topic route', async () => {
  const $ = await loadPage('en/newsletter/bonsai-27b-local-ai/index.html');
  const topicLinks = $('a[href^="/en/topics/"]')
    .toArray()
    .map((element) => $(element).attr('href'));

  assert.ok(topicLinks.includes('/en/topics/artificial-intelligence/'));
  assert.ok(topicLinks.includes('/en/topics/product/'));
  assert.ok(!topicLinks.includes('/en/topics/inteligencia-artificial'));
  assert.ok(!topicLinks.includes('/en/topics/produto'));
});

test('guide indexes expose the three topical clusters', async () => {
  for (const pathname of ['guias/index.html', 'en/guides/index.html']) {
    const $ = await loadPage(pathname);
    const clusters = $('[data-guide-cluster]').toArray().map((element) => $(element).attr('data-guide-cluster'));
    assert.deepEqual(clusters, ['agents', 'governance', 'product']);
  }
});

test('pillar guides expose reciprocal metadata, schemas and spokes', async () => {
  const cases = [
    ['guias/agentes-de-ia/index.html', '/guias/como-criar-agentes-de-ia/', 'FAQPage'],
    ['guias/governanca-de-ia/index.html', '/guias/matriz-risco-ia/', 'BlogPosting'],
    ['guias/gestao-de-produto/index.html', '/guias/gestao-de-produtos-com-ia/', 'FAQPage'],
  ];
  for (const [pathname, relatedHref, schemaType] of cases) {
    const $ = await loadPage(pathname);
    assert.ok($(`a[href="${relatedHref}"]`).length > 0);
    assert.ok($('link[rel="alternate"][hreflang="en"]').length > 0);
    assert.match($('script[type="application/ld+json"]').text(), new RegExp(schemaType));
  }
});

test('Spec Kit guides expose bilingual SEO metadata and HowTo/FAQ schemas', async () => {
  const cases = [
    [
      'guias/spec-kit-desenvolvimento-orientado-especificacoes/index.html',
      'pt-BR',
      'https://produtocomia.com.br/guias/spec-kit-desenvolvimento-orientado-especificacoes/',
    ],
    [
      'en/guides/spec-kit-spec-driven-development/index.html',
      'en',
      'https://produtocomia.com.br/en/guides/spec-kit-spec-driven-development/',
    ],
  ];

  for (const [pathname, language, canonical] of cases) {
    const $ = await loadPage(pathname);
    const schemas = $('script[type="application/ld+json"]')
      .toArray()
      .map((element) => $(element).text());

    assert.match($('title').text(), /Spec Kit/i);
    assert.ok(($('meta[name="description"]').attr('content') || '').length >= 70);
    assert.equal($('link[rel="canonical"]').attr('href'), canonical);
    assert.ok(schemas.some((schema) => /"@type"\s*:\s*"HowTo"/.test(schema)));
    assert.ok(schemas.some((schema) => /"@type"\s*:\s*"FAQPage"/.test(schema)));
    assert.match($('main').text(), /Product Manager|Tech Lead/i);
    assert.equal($('html').attr('lang'), language);
  }
});

test('LLM discovery files include pillar guides and the expanded corpus', async () => {
  const [summary, full] = await Promise.all([
    readFile(new URL('../dist/llms.txt', import.meta.url), 'utf8'),
    readFile(new URL('../dist/llms-full.txt', import.meta.url), 'utf8'),
  ]);
  assert.match(summary, /guias\/agentes-de-ia/);
  assert.match(summary, /guias\/gestao-de-produto/);
  assert.match(full, /Como um agente de IA funciona/);
  assert.match(full, /State of AI in Product Management 2026/);
});

test('every indexable page has unique bounded metadata and no LinkedIn anchor', async () => {
  const files = await walkHtml(new URL('../dist/', import.meta.url));
  const rows = await Promise.all(files.map(async (file) => {
    const $ = cheerio.load(await readFile(file, 'utf8'));
    return {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content')?.trim() || '',
      noindex: /noindex/.test($('meta[name="robots"]').attr('content') || ''),
      linkedinAnchors: $('a[href*="linkedin.com"]').length,
    };
  }));
  const indexable = rows.filter((row) => !row.noindex);
  assert.equal(new Set(indexable.map((row) => row.title)).size, indexable.length);
  assert.equal(new Set(indexable.map((row) => row.description)).size, indexable.length);
  assert.ok(indexable.every((row) => row.title.length >= 35 && row.title.length <= 60));
  assert.ok(indexable.every((row) => row.description.length >= 70 && row.description.length <= 160));
  assert.ok(rows.every((row) => row.linkedinAnchors === 0));
});

test('internal download links never expose language query parameters', async () => {
  const files = await walkHtml(new URL('../dist/', import.meta.url));
  const queryLinks = [];
  for (const file of files) {
    const $ = cheerio.load(await readFile(file, 'utf8'));
    $('a[href^="/downloads/"]').each((_, element) => {
      const href = $(element).attr('href') || '';
      if (href.includes('?')) queryLinks.push(`${file.pathname}: ${href}`);
    });
  }
  assert.deepEqual(queryLinks, []);
});

test('contact links stay on owned routes and avoid Cloudflare email wrappers', async () => {
  const files = await walkHtml(new URL('../dist/', import.meta.url));
  const violations = [];
  for (const file of files) {
    const $ = cheerio.load(await readFile(file, 'utf8'));
    if ($('a[href^="mailto:"]').length > 0) violations.push(`${file.pathname}: mailto`);
    if ($('a[href*="/cdn-cgi/"]').length > 0) violations.push(`${file.pathname}: Cloudflare email wrapper`);
  }
  assert.deepEqual(violations, []);
});

test('editorial index pages provide enough context beyond navigation and cards', async () => {
  const pages = [
    'conceitos/index.html',
    'correcoes/index.html',
    'en/concepts/index.html',
    'en/corrections/index.html',
    'guias/index.html',
    'en/guides/index.html',
    'topicos/index.html',
    'en/topics/index.html',
  ];
  for (const pathname of pages) {
    const $ = await loadPage(pathname);
    $('.topic-card, script, style, nav, footer, header').remove();
    const words = $('main').text().replace(/\s+/g, ' ').trim().split(/\s+/).filter(Boolean);
    assert.ok(words.length >= 180, `${pathname}: ${words.length} editorial words`);
  }
});

test('collection pages expose structured lists and glossary terms for discovery', async () => {
  const cases = [
    ['conceitos/index.html', 'DefinedTermSet'],
    ['en/concepts/index.html', 'DefinedTermSet'],
    ['topicos/index.html', 'ItemList'],
    ['en/topics/index.html', 'ItemList'],
    ['guias/index.html', 'ItemList'],
    ['en/guides/index.html', 'ItemList'],
  ];
  for (const [pathname, type] of cases) {
    const $ = await loadPage(pathname);
    const schemas = $('script[type="application/ld+json"]').toArray().map((element) => $(element).text());
    assert.ok(schemas.some((schema) => schema.includes(`"@type":"${type}"`)), `${pathname}: missing ${type}`);
  }
});
