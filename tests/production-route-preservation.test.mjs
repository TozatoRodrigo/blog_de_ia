import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(testsDirectory, '../dist');

async function assertBuiltRoute(route) {
  const pathname = new URL(route, 'https://produtocomia.com.br').pathname;
  const relativeFile = `${pathname.slice(1)}index.html`;
  await access(path.join(distDirectory, relativeFile));
}

test('the release retains every route from the production baseline', async () => {
  const baseline = JSON.parse(await readFile(
    path.join(testsDirectory, 'fixtures/production-route-baseline-2026-09-29.json'),
    'utf8',
  ));
  const sitemap = await readFile(path.join(distDirectory, 'sitemap-0.xml'), 'utf8');
  const emittedUrls = new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]),
  );

  for (const url of baseline.sitemapUrls) {
    assert.ok(emittedUrls.has(url), `production URL disappeared from sitemap: ${url}`);
    await assertBuiltRoute(url);
  }

  for (const route of baseline.additionalPublicRoutes) {
    await assertBuiltRoute(route);
  }
});
