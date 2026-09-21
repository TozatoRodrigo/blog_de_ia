import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import * as cheerio from 'cheerio';

const dist = new URL('../dist/', import.meta.url);

async function loadPage(pathname) {
  const file = join(dist.pathname, pathname);
  await access(file);
  return cheerio.load(await readFile(file, 'utf8'));
}

const fields = ['name', 'email', 'role', 'siteUrl', 'title', 'excerpt', 'content', 'links', 'bio', 'consent'];

test('Portuguese contribution page renders a complete accessible progressive form', async () => {
  const $ = await loadPage('contribua/index.html');
  const form = $('form[action="/api/contributions/submit"][method="post"]');
  assert.equal(form.length, 1);
  assert.equal(form.find('input[name="lang"]').attr('value'), 'pt-BR');
  assert.equal(form.find('input[name="sourcePath"]').attr('value'), '/contribua/');
  assert.equal(form.find('input[name="privacyVersion"]').attr('value'), '2026-09-21');
  assert.equal(form.find('[data-action="contribution_submit"]').length, 1);
  assert.equal(form.find('input[name="company"]').length, 1);
  assert.equal(form.find('input[name="consent"][required]').length, 1);
  assert.equal($('.contribution-form [data-contribution-success]').attr('tabindex'), '-1');
  assert.equal($('.contribution-form [data-contribution-success]').attr('role'), 'status');
  assert.equal($('.contribution-form [data-contribution-success]').attr('aria-live'), 'polite');
  assert.equal(form.find('[data-contribution-status]').attr('tabindex'), '-1');
  assert.equal(form.find('[data-contribution-status]').attr('role'), 'alert');
  assert.equal(form.find('[data-contribution-status]').attr('aria-live'), 'assertive');
  for (const field of fields) {
    const input = form.find(`[name="${field}"]`);
    assert.equal(input.length, 1, `missing ${field}`);
    assert.equal(form.find(`label[for="${input.attr('id')}"]`).length, 1, `missing label for ${field}`);
    const error = form.find(`[data-field-error="${field}"]`);
    assert.equal(error.length, 1, `missing error target for ${field}`);
    assert.equal(error.attr('id'), `${input.attr('id')}-error`);
  }
  assert.match($('main').text(), /não .*publicada automaticamente/i);
  assert.equal(form.find('a[href="/privacidade/"]').length, 1);
  assert.equal($('.contribution-form [data-contact-email]').length, 1);
  assert.equal($('noscript').length, 1);
  assert.match($('noscript').text(), /JavaScript.*Turnstile.*não pode verificar/i);
  assert.match($('noscript').html(), /data-contact-direct="true" href="mailto:rodrigo\.tozato@icloud\.com"/);
  assert.match($('noscript').html(), /href="\/sobre#contato"/);
  assert.match($('noscript').html(), /href="\/privacidade\/"/);
});

test('enhanced contribution form uses its dedicated public privacy version', async () => {
  const source = await readFile(new URL('../src/components/ContributionForm.astro', import.meta.url), 'utf8');
  assert.match(source, /config\.contributionPrivacyVersion/);
  assert.doesNotMatch(source, /privacyInput\.value = config\.privacyVersion/);
  assert.ok(source.indexOf('await prepare();') < source.indexOf('new FormData(form)'));
  assert.match(source, /aria-invalid/);
  assert.match(source, /aria-describedby/);
  assert.match(source, /status\.focus\(\)/);
  assert.match(source, /data-field-error/);
});

test('English contribution page preserves its localized submission contract', async () => {
  const $ = await loadPage('en/contribute/index.html');
  const form = $('form[action="/api/contributions/submit"][method="post"]');
  assert.equal($('html').attr('lang'), 'en');
  assert.equal(form.find('input[name="lang"]').attr('value'), 'en');
  assert.equal(form.find('input[name="sourcePath"]').attr('value'), '/en/contribute/');
  assert.equal(form.find('a[href="/en/privacy/"]').length, 1);
  assert.equal($('.contribution-form [data-contact-email]').length, 1);
  assert.match($('main').text(), /not automatically published/i);
  assert.equal($('noscript').length, 1);
  assert.match($('noscript').text(), /JavaScript.*Turnstile.*cannot verify/i);
  assert.match($('noscript').html(), /data-contact-direct="true" href="mailto:rodrigo\.tozato@icloud\.com"/);
  assert.match($('noscript').html(), /href="\/en\/about#contact"/);
  assert.match($('noscript').html(), /href="\/en\/privacy\/"/);
  assert.doesNotMatch(await readFile(new URL('../src/components/ContributionForm.astro', import.meta.url), 'utf8'), /umami|track\s*\(/i);
});

test('generated contribution and privacy contact paths remain actionable after email-obfuscation checks', async () => {
  const pages = [
    ['contribua/index.html', 'mailto:', '/sobre#contato'],
    ['en/contribute/index.html', 'mailto:', '/en/about#contact'],
    ['privacidade/index.html', 'mailto:', '/sobre#contato'],
    ['en/privacy/index.html', 'mailto:', '/en/about#contact'],
  ];
  for (const [pathname, contactMarker, route] of pages) {
    const html = await readFile(join(dist.pathname, pathname), 'utf8');
    assert.match(html, new RegExp(contactMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(html, new RegExp(`href="${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.doesNotMatch(html, /\/cdn-cgi\/l\/email-protection/);
  }
});
