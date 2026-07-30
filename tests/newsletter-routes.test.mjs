import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertUniqueNewsletterSlugs,
  legacyNewsletterPath,
  newsletterPath,
} from '../src/utils/newsletter-routes.ts';

test('newsletterPath builds localized canonical paths', () => {
  assert.equal(newsletterPath('pt-BR', 'custo-inferencia-priorizacao'), '/newsletter/custo-inferencia-priorizacao/');
  assert.equal(newsletterPath('en', 'inference-cost-prioritization'), '/en/newsletter/inference-cost-prioritization/');
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
