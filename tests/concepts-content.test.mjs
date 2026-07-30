import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

import * as cheerio from 'cheerio';

test('every concept page has at least 200 meaningful words', async () => {
  for (const root of ['dist/conceitos', 'dist/en/concepts']) {
    for (const name of await readdir(root)) {
      if (name === 'index.html') continue;
      const $ = cheerio.load(await readFile(`${root}/${name}/index.html`, 'utf8'));
      const words = $('main').text().trim().split(/\s+/).filter(Boolean);
      assert.ok(words.length >= 200, `${root}/${name}: ${words.length} words`);
      assert.equal($('[data-product-impact]').length, 1);
    }
  }
});
