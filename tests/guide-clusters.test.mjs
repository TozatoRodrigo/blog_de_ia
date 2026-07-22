import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

import { clusterForGuide, guideClusters, guidePair } from '../src/data/guideClusters.ts';

test('guide clusters have unique bilingual entries and include their hubs', () => {
  const allPt = guideClusters.flatMap((cluster) => cluster.items.map((item) => item.pt));
  const allEn = guideClusters.flatMap((cluster) => cluster.items.map((item) => item.en));

  assert.equal(new Set(allPt).size, allPt.length);
  assert.equal(new Set(allEn).size, allEn.length);
  assert.ok(guideClusters.every((cluster) => (
    cluster.items.some((item) => item.pt === cluster.hub.pt && item.en === cluster.hub.en)
  )));
});

test('cluster lookup and language pairing are reciprocal', () => {
  assert.equal(clusterForGuide('agentes-de-ia', 'pt-BR')?.id, 'agents');
  assert.equal(clusterForGuide('ai-governance', 'en')?.id, 'governance');
  assert.deepEqual(guidePair('gestao-de-produto', 'pt-BR'), {
    current: 'gestao-de-produto', alternate: 'product-management',
  });
  assert.deepEqual(guidePair('product-management', 'en'), {
    current: 'product-management', alternate: 'gestao-de-produto',
  });
});

test('every cluster entry has reciprocal Markdown content', async () => {
  for (const cluster of guideClusters) {
    for (const item of cluster.items) {
      const ptUrl = new URL(`../src/content/guides/${item.pt}.md`, import.meta.url);
      const enUrl = new URL(`../src/content/guides-en/${item.en}.md`, import.meta.url);
      await access(ptUrl);
      await access(enUrl);
      const [pt, en] = await Promise.all([readFile(ptUrl, 'utf8'), readFile(enUrl, 'utf8')]);
      assert.match(pt, new RegExp(`alternateSlug: ["']${item.en}["']`));
      assert.match(en, new RegExp(`alternateSlug: ["']${item.pt}["']`));
    }
  }
});
