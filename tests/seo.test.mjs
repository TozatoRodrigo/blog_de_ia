import assert from 'node:assert/strict';
import test from 'node:test';

import {
  absoluteUrl,
  buildAlternates,
  canonicalPath,
  metadataWarnings,
} from '../src/utils/seo.ts';
import { SITE_LOCALE } from '../src/config.ts';

test('canonicalPath adds a trailing slash to page routes', () => {
  assert.equal(canonicalPath('/newsletter'), '/newsletter/');
  assert.equal(canonicalPath('/topicos/produto/'), '/topicos/produto/');
});

test('canonicalPath preserves files and removes query or hash fragments', () => {
  assert.equal(canonicalPath('/rss.xml?utm_source=test'), '/rss.xml');
  assert.equal(canonicalPath('/llms.txt#content'), '/llms.txt');
});

test('absoluteUrl returns canonical URLs on the production origin', () => {
  assert.equal(
    absoluteUrl('/en/topics/product'),
    'https://produtocomia.com.br/en/topics/product/',
  );
});

test('buildAlternates returns complete reciprocal language annotations', () => {
  assert.deepEqual(
    buildAlternates('/topicos/produto/', '/en/topics/product/'),
    {
      'pt-BR': 'https://produtocomia.com.br/topicos/produto/',
      en: 'https://produtocomia.com.br/en/topics/product/',
      'x-default': 'https://produtocomia.com.br/topicos/produto/',
    },
  );
});

test('metadataWarnings reports editorial length issues without rejecting metadata', () => {
  assert.deepEqual(metadataWarnings('Curto', 'Breve'), [
    'title-under-30',
    'description-under-70',
  ]);
  assert.deepEqual(metadataWarnings('T'.repeat(61), 'D'.repeat(161)), [
    'title-over-60',
    'description-over-160',
  ]);
});

test('site metadata is localized for English pages', () => {
  assert.equal(SITE_LOCALE.en.tagline, 'Artificial Intelligence for Product Managers');
  assert.match(SITE_LOCALE.en.description, /^Daily analysis of artificial intelligence/);
  assert.doesNotMatch(SITE_LOCALE.en.description, /Curadoria|inteligência/);
});
