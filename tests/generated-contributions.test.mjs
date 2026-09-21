import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import * as cheerio from 'cheerio';
import test from 'node:test';

const dist = new URL('../dist/', import.meta.url);

async function loadPage(pathname) {
  const file = join(dist.pathname, pathname);
  await access(file);
  return cheerio.load(await (await import('node:fs/promises')).readFile(file, 'utf8'));
}

test('build generates both contribution indexes and both localized articles', async () => {
  const paths = [
    'contribuicoes/index.html',
    'contribua/index.html',
    'contribuicoes/evals-infraestrutura-produto/index.html',
    'en/contributions/index.html',
    'en/contribute/index.html',
    'en/contributions/evals-as-product-infrastructure/index.html',
  ];

  for (const pathname of paths) {
    const $ = await loadPage(pathname);
    assert.equal($('html').attr('lang'), pathname.startsWith('en/') ? 'en' : 'pt-BR');
    assert.ok($('main').text().trim().length > 500, `${pathname} should have meaningful public content`);
    const schemas = $('script[type="application/ld+json"]').map((_, element) => $(element).text()).get().join('\n');
    if (pathname.includes('contribua') || pathname.includes('contribute')) assert.match(schemas, /WebSite/);
    else if (pathname.includes('/index.html') && !pathname.includes('/evals-')) assert.match(schemas, /ItemList/);
    else assert.match(schemas, /BlogPosting/);
  }

  const article = await loadPage('contribuicoes/evals-infraestrutura-produto/index.html');
  assert.match(article('main').text(), /Ricardo Guia/);
  assert.equal(article('a[href="https://iabrasileira.com/"]').attr('rel'), 'noopener noreferrer');
  assert.equal(article('a[href="https://ricardoguia.com/"]').attr('rel'), 'noopener noreferrer');
  assert.equal(article('link[rel="alternate"][hreflang="en"]').attr('href'), 'https://produtocomia.com.br/en/contributions/evals-as-product-infrastructure/');

  const english = await loadPage('en/contributions/evals-as-product-infrastructure/index.html');
  assert.equal(english('link[rel="alternate"][hreflang="pt-BR"]').attr('href'), 'https://produtocomia.com.br/contribuicoes/evals-infraestrutura-produto/');
  assert.match(english('main').text(), /Translated from the original Portuguese contribution/);
  assert.match(english('main').text(), /Product executive and author/);
  assert.match(english('main').text(), /#product/);
  assert.match(english('script[type="application/ld+json"]').text(), /Product executive and author/);
});

test('contribution indexes link to usable localized intake pages', async () => {
  const portuguese = await loadPage('contribuicoes/index.html');
  const english = await loadPage('en/contributions/index.html');
  assert.equal(portuguese('a[href="/contribua/"]').length, 1);
  assert.equal(english('a[href="/en/contribute/"]').length, 1);
  assert.match((await loadPage('contribua/index.html'))('main').text(), /e-mail/i);
  assert.match((await loadPage('en/contribute/index.html'))('main').text(), /send/i);
});

test('generated contribution forms keep success and error announcements focusable and live', async () => {
  for (const pathname of ['contribua/index.html', 'en/contribute/index.html']) {
    const $ = await loadPage(pathname);
    const success = $('[data-contribution-success]');
    const status = $('[data-contribution-status]');
    assert.equal(success.attr('tabindex'), '-1', `${pathname} success should be focusable`);
    assert.equal(success.attr('role'), 'status');
    assert.equal(success.attr('aria-live'), 'polite');
    assert.equal(status.attr('tabindex'), '-1', `${pathname} error should be focusable`);
    assert.equal(status.attr('role'), 'alert');
    assert.equal(status.attr('aria-live'), 'assertive');
  }
});
