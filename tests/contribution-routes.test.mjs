import assert from 'node:assert/strict';
import test from 'node:test';

import {
  assertUniqueContributionSlugs,
  assertUniqueContributionTranslationKeys,
  contributionIndexPath,
  contributionPath,
  findContributionTranslation,
} from '../src/utils/contribution-routes.ts';
import { contributorFor } from '../src/data/contributors.ts';

test('contribution route helpers keep localized paths stable', () => {
  assert.equal(contributionIndexPath('pt-BR'), '/contribuicoes/');
  assert.equal(contributionIndexPath('en'), '/en/contributions/');
  assert.equal(
    contributionPath('pt-BR', 'evals-infraestrutura-produto'),
    '/contribuicoes/evals-infraestrutura-produto/',
  );
  assert.equal(
    contributionPath('en', 'evals-as-product-infrastructure'),
    '/en/contributions/evals-as-product-infrastructure/',
  );
});

test('contributorFor returns Ricardo Guia and rejects unknown contributors', () => {
  assert.deepEqual(contributorFor('ricardo-guia'), {
    id: 'ricardo-guia',
    name: 'Ricardo Guia',
    role: 'Executivo de produto e autor da Inteligência à Brasileira',
    bio: 'Ricardo Guia é executivo de produto e autor da Inteligência à Brasileira, onde escreve sobre IA a partir do olhar de quem constrói sistemas e produtos com ela.',
    roleEn: 'Product executive and author of Inteligência à Brasileira',
    bioEn: 'Ricardo Guia is a product executive and author of Inteligência à Brasileira, where he writes about AI from the perspective of someone who builds systems and products with it.',
    site: 'https://ricardoguia.com/',
    links: [
      { label: 'Inteligência à Brasileira', href: 'https://iabrasileira.com/' },
      { label: 'ricardoguia.com', href: 'https://ricardoguia.com/' },
    ],
  });
  assert.throws(() => contributorFor('missing'), /unknown-contributor:missing/);
});

test('contribution SEO slugs must be unique within a localized collection', () => {
  assert.throws(
    () => assertUniqueContributionSlugs('en', [
      { data: { seoSlug: 'repeated' } },
      { data: { seoSlug: 'repeated' } },
    ]),
    /duplicate-contribution-seo-slug:en:repeated/,
  );
});

test('contribution translation keys must be unique within a localized collection', () => {
  assert.throws(
    () => assertUniqueContributionTranslationKeys('en', [
      { data: { translationKey: 'ricardo-evals' } },
      { data: { translationKey: 'ricardo-evals' } },
    ]),
    /duplicate-contribution-translation-key:en:ricardo-evals/,
  );
});

test('contribution translations require exactly one counterpart', () => {
  const entries = [
    { data: { seoSlug: 'evals-as-product-infrastructure', translationKey: 'ricardo-evals' } },
  ];

  assert.throws(
    () => findContributionTranslation(entries, 'missing-key', 'en'),
    /missing-contribution-translation:en:missing-key/,
  );
  assert.throws(
    () => findContributionTranslation([
      ...entries,
      { data: { seoSlug: 'evals-as-product-infrastructure-2', translationKey: 'ricardo-evals' } },
    ], 'ricardo-evals', 'en'),
    /duplicate-contribution-translation:en:ricardo-evals/,
  );
  assert.deepEqual(findContributionTranslation(entries, 'ricardo-evals', 'en'), entries[0]);
});
