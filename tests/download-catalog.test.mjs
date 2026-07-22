import assert from 'node:assert/strict';
import { glob, readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const rootPath = fileURLToPath(root);
const catalog = JSON.parse(
  await readFile(new URL('../config/downloads.json', import.meta.url), 'utf8'),
);

test('download catalog has unique ids and files', async () => {
  assert.equal(catalog.length, 12);
  assert.equal(new Set(catalog.map((item) => item.id)).size, catalog.length);
  assert.equal(new Set(catalog.map((item) => item.filename)).size, catalog.length);

  for (const item of catalog) {
    assert.match(item.id, /^[a-z0-9-]+$/);
    assert.equal(item.filename.includes('/'), false);
    assert.ok(item.labels['pt-BR']);
    assert.ok(item.labels.en);
    assert.match(item.contentType, /^(application|text)\//);
    const bytes = await readFile(new URL(`../public/downloads/${item.filename}`, import.meta.url));
    assert.ok(bytes.length > 80);
  }
});

test('every editorial download link is allowlisted', async () => {
  const filenames = new Set(catalog.map((item) => item.filename));

  for await (const relative of glob('src/content/{guides,guides-en}/*.md', { cwd: rootPath })) {
    const markdown = await readFile(new URL(`../${relative}`, import.meta.url), 'utf8');
    for (const match of markdown.matchAll(/href: "\/downloads\/([^"?]+)"/g)) {
      assert.ok(filenames.has(match[1]), `${relative}: ${match[1]} is missing from catalog`);
    }
  }
});
