import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const resources = [
  'checklist-governanca-de-ia.md', 'ai-governance-checklist.md',
  'matriz-risco-ia.csv', 'ai-risk-matrix.csv',
  'inventario-sistemas-de-ia.csv', 'ai-system-inventory.csv',
  'template-avaliacao-agente-de-ia.csv', 'ai-agent-evaluation-template.csv',
  'questionario-ia-gestao-de-produto.md', 'ai-product-management-survey.md',
  'estado-ia-gestao-de-produto-2026.pdf', 'state-of-ai-in-product-management-2026.pdf',
];

test('all public resources are present and non-empty', async () => {
  for (const filename of resources) {
    const contents = await readFile(new URL(`../public/downloads/${filename}`, import.meta.url));
    assert.ok(contents.length > 80, `${filename} should contain a useful resource`);
    if (filename.endsWith('.pdf')) assert.equal(contents.subarray(0, 5).toString(), '%PDF-');
  }
});

test('CSV resources expose stable headers and an example row', async () => {
  for (const filename of resources.filter((name) => name.endsWith('.csv'))) {
    const contents = await readFile(new URL(`../public/downloads/${filename}`, import.meta.url), 'utf8');
    assert.match(contents.split('\n')[0], /id|identificador|system_id|sistema_id/);
    assert.match(contents, /EXAMPLE|EXEMPLO/);
  }
});
