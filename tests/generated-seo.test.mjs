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
