import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertUniqueNewsletterSlugs,
  buildNewsletterRedirectMap,
  legacyNewsletterPath,
  newsletterPath,
} from '../src/utils/newsletter-routes.ts';

test('newsletterPath builds localized canonical paths', () => {
  assert.equal(newsletterPath('pt-BR', 'custo-inferencia-priorizacao'), '/newsletter/custo-inferencia-priorizacao/');
  assert.equal(newsletterPath('en', 'inference-cost-prioritization'), '/en/newsletter/inference-cost-prioritization/');
});

test('redirect map covers legacy paths with and without trailing slash', () => {
  assert.deepEqual(
    buildNewsletterRedirectMap('pt-BR', [{
      id: '2026-07-29-custo-por-inferencia-priorizacao-produto',
      data: { seoSlug: 'custo-inferencia-priorizacao' },
    }]),
    [
      '"/newsletter/2026-07-29-custo-por-inferencia-priorizacao-produto" "/newsletter/custo-inferencia-priorizacao/";',
      '"/newsletter/2026-07-29-custo-por-inferencia-priorizacao-produto/" "/newsletter/custo-inferencia-priorizacao/";',
    ],
  );
});

test('redirect map omits entries whose identifier already is the SEO slug', () => {
  assert.deepEqual(
    buildNewsletterRedirectMap('pt-BR', [{
      id: '2026-08-01-modelo-ia-peca-trocavel',
      data: { seoSlug: '2026-08-01-modelo-ia-peca-trocavel' },
    }]),
    [],
  );
});

test('legacyNewsletterPath preserves the content entry identifier', () => {
  assert.equal(
    legacyNewsletterPath('en', '2026-07-29-custo-por-inferencia-priorizacao-produto'),
    '/en/newsletter/2026-07-29-custo-por-inferencia-priorizacao-produto/',
  );
});

test('newsletter SEO slugs must be unique within a collection', () => {
  assert.throws(
    () => assertUniqueNewsletterSlugs([
      { data: { seoSlug: 'repetido' } },
      { data: { seoSlug: 'repetido' } },
    ]),
    /duplicate-newsletter-seo-slug/,
  );
});

test('newsletter SEO slugs reject dated public identifiers', () => {
  assert.throws(
    () => assertUniqueNewsletterSlugs([{ data: { seoSlug: '2026-08-18-example' } }]),
    /dated-newsletter-seo-slug/,
  );
});
