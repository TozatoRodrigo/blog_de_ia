import assert from 'node:assert/strict';
import test from 'node:test';

import {
  IDS,
  blogPostingSchema,
  breadcrumbSchema,
  faqPageSchema,
  howToSchema,
  organizationSchema,
  personSchema,
  websiteSchema,
} from '../src/utils/schema.ts';

test('core entities use stable connected identifiers', () => {
  assert.equal(organizationSchema()['@id'], IDS.organization);
  assert.equal(personSchema()['@id'], IDS.person);
  assert.equal(websiteSchema('en').publisher['@id'], IDS.organization);
});

test('blog posting connects author, publisher, image and canonical page', () => {
  const schema = blogPostingSchema({
    url: '/newsletter/teste/', title: 'Teste de IA', description: 'Descrição',
    datePublished: '2026-07-22', dateModified: '2026-07-22',
    image: '/og/newsletter/teste.png', lang: 'pt-BR', tags: ['produto'],
  });
  assert.equal(schema.mainEntityOfPage['@id'], 'https://produtocomia.com.br/newsletter/teste/');
  assert.equal(schema.author['@id'], IDS.person);
  assert.equal(schema.publisher['@id'], IDS.organization);
  assert.equal(schema.image.url, 'https://produtocomia.com.br/og/newsletter/teste.png');
});

test('breadcrumbs expose canonical absolute item URLs', () => {
  const schema = breadcrumbSchema([['Início', '/'], ['Guia', '/guias/exemplo/']]);
  assert.equal(schema.itemListElement[1].item, 'https://produtocomia.com.br/guias/exemplo/');
});

test('FAQ schema mirrors visible questions and answers', () => {
  const schema = faqPageSchema([
    { question: 'O que é um agente?', answer: 'Um sistema que usa ferramentas para concluir uma tarefa.' },
  ]);
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema.mainEntity[0].name, 'O que é um agente?');
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, 'Um sistema que usa ferramentas para concluir uma tarefa.');
});

test('HowTo schema exposes ordered visible steps', () => {
  const schema = howToSchema({
    name: 'Como criar um agente', description: 'Método prático',
    steps: [
      { name: 'Defina o objetivo', text: 'Escolha uma tarefa mensurável.' },
      { name: 'Avalie', text: 'Teste casos de sucesso e falha.' },
    ],
  });
  assert.equal(schema['@type'], 'HowTo');
  assert.equal(schema.step[0].position, 1);
  assert.equal(schema.step[1].position, 2);
});
