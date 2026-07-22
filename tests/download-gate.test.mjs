import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import * as cheerio from 'cheerio';

async function loadPage(pathname) {
  const html = await readFile(new URL(`../dist/${pathname}`, import.meta.url), 'utf8');
  return cheerio.load(html);
}

test('download pages expose one accessible, localized lead gate', async () => {
  const cases = [
    ['guias/checklist-governanca-de-ia/index.html', 'Receba o material'],
    ['en/guides/ai-governance-checklist/index.html', 'Get the free resource'],
  ];

  for (const [pathname, heading] of cases) {
    const $ = await loadPage(pathname);
    const dialog = $('#download-lead-dialog');

    assert.equal($('[data-download-gate]').length, 1);
    assert.equal(dialog.length, 1);
    assert.equal(dialog.attr('aria-labelledby'), 'download-lead-title');
    assert.match($('#download-lead-title').text(), new RegExp(heading));
    assert.equal(dialog.find('input[name="email"][type="email"]').length, 1);
    assert.equal(dialog.find('input[name="marketingOptIn"]').is(':checked'), false);

    const protectedLinks = $('a[href^="/downloads/"]');
    assert.ok(protectedLinks.length > 0);
    assert.ok(protectedLinks.toArray().every((link) => Boolean($(link).attr('data-download-id'))));
    assert.ok(protectedLinks.toArray().every((link) => !$(link).attr('download')));
  }
});

test('download analytics declare the approved PII-free event vocabulary', async () => {
  const source = await readFile(
    new URL('../src/components/DownloadLeadGate.astro', import.meta.url),
    'utf8',
  );

  for (const eventName of [
    'download_gate_opened',
    'download_lead_submitted',
    'download_authorized_returning_lead',
    'download_started',
    'download_failed',
    'download_marketing_opt_in',
  ]) {
    assert.match(source, new RegExp(eventName));
  }

  const analyticsSection = source.slice(source.indexOf('function trackDownload'));
  assert.doesNotMatch(analyticsSection, /email\s*:/);
  assert.doesNotMatch(analyticsSection, /name\s*:/);
  assert.doesNotMatch(analyticsSection, /turnstileToken\s*:/);
});

test('privacy pages disclose the complete lead lifecycle in both languages', async () => {
  const cases = [
    ['privacidade/index.html', '/privacidade/', '/en/privacy/', 'Política de privacidade'],
    ['en/privacy/index.html', '/en/privacy/', '/privacidade/', 'Privacy policy'],
  ];

  for (const [pathname, canonicalPath, alternatePath, heading] of cases) {
    const $ = await loadPage(pathname);
    const text = $('main').text();
    assert.equal($('main h1').length, 1);
    assert.match($('main h1').text(), new RegExp(heading));
    assert.equal($('link[rel="canonical"]').attr('href'), `https://produtocomia.com.br${canonicalPath}`);
    assert.ok($('link[rel="alternate"][hreflang]').filter((_, element) => $(element).attr('href') === `https://produtocomia.com.br${alternatePath}`).length > 0);
    assert.match(text, /rodrigo\.tozato@icloud\.com/);
    assert.match(text, /Resend/);
    assert.match(text, /Cloudflare Turnstile/);
    assert.match(text, /730/);
    assert.match(text, /2026-07-22/);
    assert.match(text, /(acesso|access)/i);
    assert.match(text, /(correção|correction)/i);
    assert.match(text, /(exclusão|deletion)/i);
  }
});

test('footer and styles expose privacy, accessible dialog and reduced motion support', async () => {
  const pt = await loadPage('index.html');
  const en = await loadPage('en/index.html');
  assert.equal(pt('footer a[href="/privacidade/"]').length, 1);
  assert.equal(en('footer a[href="/en/privacy/"]').length, 1);

  const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  assert.match(css, /\.download-gate::backdrop/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)[\s\S]*?\.download-gate/);
});
