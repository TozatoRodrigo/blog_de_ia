import assert from 'node:assert/strict';
import test from 'node:test';

import {
  contributionIndexPath,
  contributionPath,
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
    site: 'https://ricardoguia.com/',
    links: [
      { label: 'Inteligência à Brasileira', href: 'https://iabrasileira.com/' },
      { label: 'ricardoguia.com', href: 'https://ricardoguia.com/' },
    ],
  });
  assert.throws(() => contributorFor('missing'), /unknown-contributor:missing/);
});
