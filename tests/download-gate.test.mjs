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
