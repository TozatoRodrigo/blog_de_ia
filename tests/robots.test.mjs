import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('robots lets crawlers inspect protected download pages', async () => {
  const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8');

  assert.doesNotMatch(robots, /^Disallow:\s*\/downloads\//m);
  assert.match(robots, /^Disallow:\s*\/api\/download-leads\//m);
});
