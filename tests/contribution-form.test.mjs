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

const fields = ['name', 'email', 'role', 'siteUrl', 'title', 'excerpt', 'content', 'links', 'bio'];

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
  }
  assert.match($('main').text(), /não .*publicada automaticamente/i);
  assert.equal(form.find('a[href="/privacidade/"]').length, 1);
  assert.equal($('.contribution-form [data-contact-email]').length, 1);
});

test('enhanced contribution form uses its dedicated public privacy version', async () => {
  const source = await readFile(new URL('../src/components/ContributionForm.astro', import.meta.url), 'utf8');
  assert.match(source, /config\.contributionPrivacyVersion/);
  assert.doesNotMatch(source, /privacyInput\.value = config\.privacyVersion/);
  assert.ok(source.indexOf('await prepare();') < source.indexOf('new FormData(form)'));
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
  assert.doesNotMatch(await readFile(new URL('../src/components/ContributionForm.astro', import.meta.url), 'utf8'), /umami|track\s*\(/i);
});
