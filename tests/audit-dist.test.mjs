import assert from 'node:assert/strict';
import test from 'node:test';

import { auditHtml } from '../scripts/lib/audit-dist.mjs';

const validHtml = `<!doctype html>
<html lang="pt-BR"><head>
  <title>Gestão de produtos com inteligência artificial</title>
  <meta name="description" content="Guia prático para aplicar inteligência artificial à gestão de produtos, com métricas, riscos, experimentos e decisões de roadmap." />
  <link rel="canonical" href="https://produtocomia.com.br/guias/gestao-de-produtos-com-ia/" />
  <link rel="alternate" hreflang="pt-BR" href="https://produtocomia.com.br/guias/gestao-de-produtos-com-ia/" />
  <link rel="alternate" hreflang="en" href="https://produtocomia.com.br/en/guides/ai-product-management/" />
  <link rel="alternate" hreflang="x-default" href="https://produtocomia.com.br/guias/gestao-de-produtos-com-ia/" />
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article"}</script>
</head><body><h1>Gestão de produtos com IA</h1><a href="/">Início</a></body></html>`;

test('auditHtml accepts a canonical, localized and structured page', () => {
  const result = auditHtml({
    html: validHtml,
    expectedUrl: 'https://produtocomia.com.br/guias/gestao-de-produtos-com-ia/',
  });

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
});

test('auditHtml reports missing H1 and incomplete hreflang', () => {
  const html = validHtml
    .replace('<h1>Gestão de produtos com IA</h1>', '')
    .replace(/\s*<link rel="alternate" hreflang="en"[^>]+>/, '');

  const result = auditHtml({
    html,
    expectedUrl: 'https://produtocomia.com.br/guias/gestao-de-produtos-com-ia/',
  });

  assert.ok(result.errors.includes('expected-one-h1'));
  assert.ok(result.errors.includes('missing-hreflang-en'));
});

test('auditHtml reports canonical mismatch and invalid JSON-LD', () => {
  const html = validHtml
    .replace('/guias/gestao-de-produtos-com-ia/', '/rota-incorreta/')
    .replace('{"@context":"https://schema.org","@type":"Article"}', '{invalid');

  const result = auditHtml({
    html,
    expectedUrl: 'https://produtocomia.com.br/guias/gestao-de-produtos-com-ia/',
  });

  assert.ok(result.errors.includes('canonical-mismatch'));
  assert.ok(result.errors.includes('invalid-json-ld'));
});

test('auditHtml emits editorial warnings for long metadata', () => {
  const html = validHtml
    .replace(/<title>[^<]+<\/title>/, `<title>${'T'.repeat(61)}</title>`)
    .replace(/content="Guia prático[^"]+"/, `content="${'D'.repeat(161)}"`);

  const result = auditHtml({
    html,
    expectedUrl: 'https://produtocomia.com.br/guias/gestao-de-produtos-com-ia/',
  });

  assert.ok(result.warnings.includes('title-over-60'));
  assert.ok(result.warnings.includes('description-over-160'));
});

test('auditHtml can skip canonical and hreflang checks for noindex pages', () => {
  const html = '<html lang="pt-BR"><head><title>Página de erro não encontrada</title><meta name="description" content="Esta página não existe ou foi movida; volte ao início para continuar navegando pelo site." /></head><body><h1>404</h1></body></html>';
  const result = auditHtml({
    html,
    expectedUrl: 'https://produtocomia.com.br/404.html',
    requireCanonical: false,
    requireHreflang: false,
  });

  assert.deepEqual(result.errors, []);
});
