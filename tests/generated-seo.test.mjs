import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import * as cheerio from 'cheerio';

async function loadPage(pathname) {
  const html = await readFile(new URL(`../dist/${pathname}`, import.meta.url), 'utf8');
  return cheerio.load(html);
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
  const $ = await loadPage('en/newsletter/2026-07-15-bonsai-27b-ia-que-cabe-no-bolso-sem-depender-da-nuvem/index.html');
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
