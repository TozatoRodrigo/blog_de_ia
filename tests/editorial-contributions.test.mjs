import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import * as cheerio from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const publicPrivacyVersion = '2026-09-21';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

async function loadPage(route) {
  const file = path.join(dist, route.replace(/^\//, ''), 'index.html');
  return cheerio.load(await readFile(file, 'utf8'));
}

function assertLocalizedAlternates($, { canonical, portuguese, english }) {
  assert.equal($('link[rel="canonical"]').attr('href'), `https://produtocomia.com.br${canonical}`);
  assert.equal($('link[rel="alternate"][hreflang="pt-BR"]').attr('href'), `https://produtocomia.com.br${portuguese}`);
  assert.equal($('link[rel="alternate"][hreflang="en"]').attr('href'), `https://produtocomia.com.br${english}`);
  assert.equal($('link[rel="alternate"][hreflang="x-default"]').attr('href'), `https://produtocomia.com.br${portuguese}`);
  assert.doesNotMatch($('meta[name="robots"]').attr('content') || '', /noindex/i);
}

function assertContributionForm($, { lang, sourcePath, privacyPath }) {
  const form = $('form[action="/api/contributions/submit"]');
  assert.equal(form.length, 1);
  assert.equal(form.attr('method'), 'post');
  assert.equal(form.attr('enctype'), 'application/x-www-form-urlencoded');

  const names = new Set(form.find('[name]').toArray().map((element) => $(element).attr('name')));
  assert.deepEqual([...names].sort(), [
    'bio', 'company', 'consent', 'content', 'email', 'excerpt', 'lang', 'links', 'name',
    'privacyVersion', 'role', 'siteUrl', 'sourcePath', 'title',
  ]);
  for (const field of ['name', 'email', 'title', 'excerpt', 'content', 'bio', 'consent']) {
    assert.equal(form.find(`[name="${field}"][required]`).length, 1, `required ${field}`);
  }
  assert.equal(form.find('input[name="lang"]').attr('value'), lang);
  assert.equal(form.find('input[name="sourcePath"]').attr('value'), sourcePath);
  assert.equal(form.find('input[name="privacyVersion"]').attr('value'), publicPrivacyVersion);
  assert.equal(form.find(`a[href="${privacyPath}"]`).length, 1);
  assert.match($('main').text(), /não é publicad[ao] automaticamente|nothing is published automatically/i);
  assert.doesNotMatch(form.html(), /notification_state|notification_attempts|submission_id|submissionId|status="pending"/i);
}

test('dist contains only public files and no accidental private endpoint pages', async () => {
  const files = await walk(dist);
  const relativeFiles = files.map((file) => path.relative(dist, file).split(path.sep).join('/'));
  assert.ok(!relativeFiles.some((file) => file === 'api' || file.startsWith('api/')));
  assert.ok(!relativeFiles.some((file) => /(?:^|\/)api(?:\/|\.)/.test(file)));
});

test('Portuguese and English contribution indexes expose the published Ricardo article', async () => {
  const portuguese = await loadPage('/contribuicoes/');
  const english = await loadPage('/en/contributions/');

  assertLocalizedAlternates(portuguese, {
    canonical: '/contribuicoes/',
    portuguese: '/contribuicoes/',
    english: '/en/contributions/',
  });
  assertLocalizedAlternates(english, {
    canonical: '/en/contributions/',
    portuguese: '/contribuicoes/',
    english: '/en/contributions/',
  });
  assert.equal(portuguese('a[href="/contribuicoes/evals-infraestrutura-produto/"]').length, 2);
  assert.equal(english('a[href="/en/contributions/evals-as-product-infrastructure/"]').length, 2);
  assert.equal(portuguese('a[href="/contribua/"]').length >= 1, true);
  assert.equal(english('a[href="/en/contribute/"]').length >= 1, true);
});

test('Portuguese and English Ricardo articles preserve authorship, backlinks, and alternates', async () => {
  const portuguese = await loadPage('/contribuicoes/evals-infraestrutura-produto/');
  const english = await loadPage('/en/contributions/evals-as-product-infrastructure/');

  assertLocalizedAlternates(portuguese, {
    canonical: '/contribuicoes/evals-infraestrutura-produto/',
    portuguese: '/contribuicoes/evals-infraestrutura-produto/',
    english: '/en/contributions/evals-as-product-infrastructure/',
  });
  assertLocalizedAlternates(english, {
    canonical: '/en/contributions/evals-as-product-infrastructure/',
    portuguese: '/contribuicoes/evals-infraestrutura-produto/',
    english: '/en/contributions/evals-as-product-infrastructure/',
  });
  for (const [$, language, guidePath, indexPath] of [
    [portuguese, 'pt', '/guias/gestao-de-produtos-com-ia/', '/contribuicoes/'],
    [english, 'en', '/en/guides/ai-product-management/', '/en/contributions/'],
  ]) {
    assert.match($('main').text(), /Ricardo Guia/);
    assert.match($('main').text(), language === 'pt' ? /Seu produto de IA precisa lembrar/ : /Your AI product needs to remember/);
    assert.equal($(`a[href="${guidePath}"]`).length, 1);
    assert.ok($(`a[href="${indexPath}"]`).length >= 2);
    assert.equal($('a[href="https://iabrasileira.com/"]').length >= 1, true);
    assert.equal($('a[href="https://ricardoguia.com/"]').length >= 1, true);
  }
});

test('public contribution forms keep the pending-submission contract and static contact fallback', async () => {
  const portuguese = await loadPage('/contribua/');
  const english = await loadPage('/en/contribute/');

  assertLocalizedAlternates(portuguese, {
    canonical: '/contribua/',
    portuguese: '/contribua/',
    english: '/en/contribute/',
  });
  assertLocalizedAlternates(english, {
    canonical: '/en/contribute/',
    portuguese: '/contribua/',
    english: '/en/contribute/',
  });
  assertContributionForm(portuguese, { lang: 'pt-BR', sourcePath: '/contribua/', privacyPath: '/privacidade/' });
  assertContributionForm(english, { lang: 'en', sourcePath: '/en/contribute/', privacyPath: '/en/privacy/' });

  for (const [$, contactPath, privacyPath, languageMarker] of [
    [portuguese, '/sobre#contato', '/privacidade/', 'JavaScript é necessário'],
    [english, '/en/about#contact', '/en/privacy/', 'JavaScript is required'],
  ]) {
    assert.match($('noscript').html() || '', /data-contact-direct="true" href="mailto:/);
    assert.equal($(`a[href="${contactPath}"]`).length >= 1, true);
    assert.equal($(`a[href="${privacyPath}"]`).length >= 1, true);
    assert.match($('noscript').text(), new RegExp(languageMarker));
    assert.doesNotMatch($.html(), /\/cdn-cgi\/l\/email-protection/);
  }
});

test('privacy pages preserve localized alternates and actionable static mailto fallback', async () => {
  const portuguese = await loadPage('/privacidade/');
  const english = await loadPage('/en/privacy/');

  assertLocalizedAlternates(portuguese, {
    canonical: '/privacidade/',
    portuguese: '/privacidade/',
    english: '/en/privacy/',
  });
  assertLocalizedAlternates(english, {
    canonical: '/en/privacy/',
    portuguese: '/privacidade/',
    english: '/en/privacy/',
  });
  for (const [$, contactPath] of [[portuguese, '/sobre#contato'], [english, '/en/about#contact']]) {
    assert.match($('main').text(), new RegExp(publicPrivacyVersion));
    assert.ok($('[data-contact-direct="true"][href^="mailto:"]').length >= 1);
    assert.equal($(`a[href="${contactPath}"]`).length >= 1, true);
    assert.doesNotMatch($.html(), /\/cdn-cgi\/l\/email-protection/);
  }
});

test('service contribution fallback remains noindex and excludes private pending fields', async () => {
  const source = await readFile(path.join(root, 'services/download-leads/src/http.mjs'), 'utf8');
  const start = source.indexOf('function contributionFallbackPage');
  const end = source.indexOf('export function createLeadHandler');
  assert.ok(start >= 0 && end > start);
  const fallback = source.slice(start, end);

  assert.match(fallback, /<meta name="robots" content="noindex, nofollow, noarchive">/);
  assert.match(source, /contributionFallbackPage\([\s\S]*?x-robots-tag['"]?: ['"]noindex, nofollow, noarchive/);
  assert.match(fallback, /hidden\(['"]privacyVersion['"]/);
  assert.doesNotMatch(fallback, /notification_state|notification_attempts|notification_last_error|submission_id|submissionId|status.*pending/i);
  for (const field of ['lang', 'sourcePath', 'privacyVersion']) {
    assert.match(fallback, new RegExp(`hidden\\(['"]${field}['"]`));
  }
});

test('smoke test covers the final public contribution routes and safe contact checks', async () => {
  const smoke = await readFile(path.join(root, 'scripts/smoke-test.mjs'), 'utf8');
  for (const route of [
    '/contribua/', '/en/contribute/', '/contribuicoes/',
    '/contribuicoes/evals-infraestrutura-produto/', '/en/contributions/',
    '/en/contributions/evals-as-product-infrastructure/',
  ]) {
    assert.match(smoke, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(smoke, /data-contact-direct="true"/);
  assert.match(smoke, /href="mailto:/);
  assert.match(smoke, /cdn-cgi\/l\/email-protection/);
  assert.match(smoke, /Date\.now\(\)/);
});
