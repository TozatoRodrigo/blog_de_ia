import assert from 'node:assert/strict';
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
