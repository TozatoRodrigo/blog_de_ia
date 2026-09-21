import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const files = {
  pt: '../src/content/contributions/evals-infraestrutura-produto.md',
  en: '../src/content/contributions-en/evals-as-product-infrastructure.md',
};

function parseFrontmatter(source, file) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, `${file} must have YAML frontmatter`);
  const data = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (value.startsWith('[')) data[key] = JSON.parse(value);
    else if (value === 'true' || value === 'false') data[key] = value === 'true';
    else data[key] = value.replace(/^['"]|['"]$/g, '');
  }
  return { data, body: match[2] };
}

test('both contribution files keep the published bilingual content contract', async () => {
  const parsed = {};
  for (const [language, relativePath] of Object.entries(files)) {
    const file = new URL(relativePath, import.meta.url);
    parsed[language] = parseFrontmatter(await readFile(file, 'utf8'), relativePath);
    assert.equal(parsed[language].data.translationKey, 'ricardo-evals');
    assert.equal(parsed[language].data.authorId, 'ricardo-guia');
    assert.equal(parsed[language].data.date, '2026-09-21');
    assert.deepEqual(parsed[language].data.tags, language === 'en'
      ? ['product', 'ai-agents', 'ai-governance']
      : ['produto', 'agentes-de-ia', 'governanca-de-ia']);
    assert.equal(parsed[language].data.featured, true);
    assert.equal(parsed[language].data.draft, false);
    assert.ok(parsed[language].body.split(/\n\n+/).length >= 12, `${language} contribution body is unexpectedly short`);
    assert.match(parsed[language].body, /https:\/\/iabrasileira\.com/);
    assert.match(parsed[language].body, /https:\/\/ricardoguia\.com/);
  }

  assert.equal(parsed.pt.data.title, 'Seu produto de IA precisa lembrar dos próprios erros');
  assert.equal(parsed.pt.data.seoSlug, 'evals-infraestrutura-produto');
  assert.equal(parsed.pt.data.excerpt, 'Evals transformam falhas reais em uma infraestrutura que acompanha cada mudança de modelo, prompt ou fluxo.');
  assert.equal(parsed.en.data.seoSlug, 'evals-as-product-infrastructure');
  assert.equal(parsed.en.data.translationNote, 'Translated from the original Portuguese contribution.');
  assert.match(parsed.pt.body, /Um produto com IA pode continuar rápido, disponível e tecnicamente saudável/);
  assert.match(parsed.en.body, /An AI product can remain fast, available, and technically healthy/);
  for (const heading of ['The same system can change without a single line breaking', 'The specification needs to become executable', 'Code first, AI for what remains', 'Every failure becomes product memory', 'Evals change the product conversation']) {
    assert.match(parsed.en.body, new RegExp(heading));
  }
});
