import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const text = (relative) => readFile(new URL(relative, root), 'utf8');

test('cost authority package has reciprocal bilingual guide, research and template pages', async () => {
  const [ptGuide, enGuide, ptResearch, enResearch, ptTemplate, enTemplate] = await Promise.all([
    text('src/content/guides/custo-agentes-de-ia.md'),
    text('src/content/guides-en/ai-agent-cost-management.md'),
    text('src/content/guides/pesquisa-custo-agentes-de-ia.md'),
    text('src/content/guides-en/research-ai-agent-cost-management.md'),
    text('src/content/guides/template-orcamento-custo-agente-ia.md'),
    text('src/content/guides-en/ai-agent-cost-budget-template.md'),
  ]);

  assert.match(ptGuide, /alternateSlug: "ai-agent-cost-management"/);
  assert.match(enGuide, /alternateSlug: "custo-agentes-de-ia"/);
  assert.match(ptResearch, /alternateSlug: "research-ai-agent-cost-management"/);
  assert.match(enResearch, /alternateSlug: "pesquisa-custo-agentes-de-ia"/);
  assert.match(ptTemplate, /alternateSlug: "ai-agent-cost-budget-template"/);
  assert.match(enTemplate, /alternateSlug: "template-orcamento-custo-agente-ia"/);

  for (const page of [ptGuide, enGuide, ptResearch, enResearch, ptTemplate, enTemplate]) {
    assert.match(page, /\/downloads\/(?:orcamento-custo-agente-ia|ai-agent-cost-budget)\.(?:csv)/);
    assert.match(page, /custo|cost/i);
  }
});

test('cost budget files are private catalog assets and never static public files', async () => {
  const catalog = await text('config/downloads.json');
  for (const [id, filename] of [
    ['orcamento-custo-agente-ia', 'orcamento-custo-agente-ia.csv'],
    ['ai-agent-cost-budget', 'ai-agent-cost-budget.csv'],
  ]) {
    assert.match(catalog, new RegExp(`"id":"${id}"`));
    assert.equal(existsSync(new URL(`private-downloads/${filename}`, root)), true);
    assert.equal(existsSync(new URL(`public/downloads/${filename}`, root)), false);
  }
});
