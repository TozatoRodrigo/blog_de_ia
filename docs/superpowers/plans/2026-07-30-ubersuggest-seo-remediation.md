# Ubersuggest SEO Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar os alertas reproduzíveis do Ubersuggest, migrar newsletters para URLs curtas com 301 e reduzir CLS/INP sem perder conteúdo, idioma ou recuperabilidade do deploy.

**Architecture:** O auditor do `dist` será a barreira de regressão. Metadados continuarão centralizados em `SEO.astro`; conceitos receberão conteúdo bilíngue estruturado; newsletters ganharão `seoSlug` e um mapa Nginx gerado no build; fontes e scripts de terceiros serão reduzidos na camada base.

**Tech Stack:** Astro 7, TypeScript, Node.js test runner, Cheerio, Nginx, Docker, Playwright CLI.

**Design:** `docs/superpowers/specs/2026-07-30-ubersuggest-seo-remediation-design.md`

---

## Estrutura de arquivos

- `scripts/lib/audit-dist.mjs`: regras puras de auditoria por HTML.
- `scripts/audit-dist.mjs`: agregação de títulos/descriptions e grafo de links do build.
- `src/utils/newsletter-routes.ts`: única regra para paths canônicos e redirects legados.
- `src/pages/_newsletter-redirects.map.ts`: artefato de build consumido pelo Nginx.
- `src/content.config.ts`: contrato obrigatório de `seoSlug`.
- `src/data/concepts.ts`: conteúdo editorial adicional dos conceitos.
- `src/components/SEO.astro`: títulos localizados e fontes locais.
- `src/layouts/BaseLayout.astro`: scripts globais e interação de rolagem.
- `deploy/nginx.conf`: redirects, normalização de barra e CSP.
- `tests/*.test.mjs`: contratos de SEO, rotas, conteúdo, performance e deploy.

## Task 1: Reproduzir os alertas na auditoria automática

**Files:**
- Modify: `tests/audit-dist.test.mjs`
- Modify: `scripts/lib/audit-dist.mjs`
- Modify: `scripts/audit-dist.mjs`

- [ ] **Step 1: escrever testes que falham para os novos alertas**

Adicionar a `tests/audit-dist.test.mjs` casos que chamam `auditHtml` com `minWords: 200` e verificam:

```js
test('auditHtml rejects missing descriptions, thin content and crawler-blocked anchors', () => {
  const html = validHtml
    .replace(/<meta name="description"[^>]+>/, '')
    .replace('<h1>Gestão de produtos com IA</h1>', '<main><h1>Gestão de produtos com IA</h1><p>curto</p><a href="https://www.linkedin.com/in/rodrigo-tozato/">LinkedIn</a></main>');
  const result = auditHtml({
    html,
    expectedUrl: 'https://produtocomia.com.br/conceitos/teste/',
    minWords: 200,
  });
  assert.ok(result.errors.includes('missing-description'));
  assert.ok(result.errors.includes('content-under-200'));
  assert.ok(result.errors.includes('crawler-blocked-anchor-linkedin'));
});

test('duplicateValues returns every duplicated non-empty metadata value', () => {
  assert.deepEqual(
    duplicateValues([
      { url: '/pt/', value: 'Coding Agents — Produto com IA' },
      { url: '/en/', value: 'Coding Agents — Produto com IA' },
      { url: '/x/', value: 'Único' },
    ]),
    [{ value: 'Coding Agents — Produto com IA', urls: ['/pt/', '/en/'] }],
  );
});
```

- [ ] **Step 2: executar RED**

Run:

```bash
node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/audit-dist.test.mjs
```

Expected: FAIL porque `minWords`, `duplicateValues`, `missing-description` e `crawler-blocked-anchor-linkedin` ainda não existem.

- [ ] **Step 3: implementar as regras puras**

Em `scripts/lib/audit-dist.mjs`:

```js
export function duplicateValues(rows) {
  const groups = new Map();
  for (const row of rows.filter((item) => item.value)) {
    groups.set(row.value, [...(groups.get(row.value) || []), row.url]);
  }
  return [...groups.entries()]
    .filter(([, urls]) => urls.length > 1)
    .map(([value, urls]) => ({ value, urls }));
}

export function auditHtml({
  html,
  expectedUrl,
  requireCanonical = true,
  requireHreflang = true,
  minWords = 0,
}) {
  const $ = cheerio.load(html);
  const errors = [];
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim() || '';
  if (!description) errors.push('missing-description');
  const words = $('main').text().trim().split(/\s+/).filter(Boolean).length;
  if (minWords > 0 && words < minWords) errors.push(`content-under-${minWords}`);
  if ($('a[href*="linkedin.com"]').length > 0) errors.push('crawler-blocked-anchor-linkedin');
  return { errors, warnings: metadataWarnings(title, description), metrics: { title, description, words } };
}
```

As validações atuais de URL, idioma, H1, canonical, hreflang e JSON-LD permanecem no corpo da função entre a leitura de metadados e o `return`; apenas o retorno passa a expor `metrics`.

- [ ] **Step 4: agregar unicidade e escopo no build**

Em `scripts/audit-dist.mjs`, guardar `title` e `description` de cada página indexável; chamar `auditHtml` com `minWords: 200` somente para paths `/conceitos/` e `/en/concepts/`; transformar duplicatas de title ou description em erros `duplicate-title` e `duplicate-description`.

- [ ] **Step 5: executar GREEN unitário e confirmar que a auditoria atual falha pelos motivos do relatório**

Run:

```bash
node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/audit-dist.test.mjs
npm run build
npm run audit:dist
```

Expected: teste PASS; auditor FAIL listando páginas de conceito abaixo de 200 palavras, âncoras do LinkedIn e o title duplicado de Coding Agents.

- [ ] **Step 6: commit**

```bash
git add tests/audit-dist.test.mjs scripts/lib/audit-dist.mjs scripts/audit-dist.mjs
git commit -m "test: reproduce Ubersuggest SEO findings"
```

## Task 2: Corrigir títulos, descriptions e o falso link quebrado do LinkedIn

**Files:**
- Modify: `tests/generated-seo.test.mjs`
- Modify: `tests/schema.test.mjs`
- Modify: `src/components/SEO.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/pages/sobre.astro`
- Modify: `src/pages/en/about.astro`
- Modify: `src/pages/newsletter/[slug].astro`
- Modify: `src/pages/en/newsletter/[slug].astro`
- Modify: `src/utils/schema.ts`

- [ ] **Step 1: escrever testes de build que falham**

Adicionar a `tests/generated-seo.test.mjs`:

```js
async function walkHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const url = new URL(entry.name, directory);
    if (entry.isDirectory()) return walkHtml(new URL(`${entry.name}/`, directory));
    return entry.isFile() && entry.name.endsWith('.html') ? [url] : [];
  }));
  return nested.flat();
}

test('every indexable page has unique bounded metadata and no LinkedIn anchor', async () => {
  const files = await walkHtml(new URL('../dist/', import.meta.url));
  const rows = await Promise.all(files.map(async (file) => {
    const $ = cheerio.load(await readFile(file, 'utf8'));
    return {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content')?.trim() || '',
      noindex: /noindex/.test($('meta[name="robots"]').attr('content') || ''),
      linkedinAnchors: $('a[href*="linkedin.com"]').length,
    };
  }));
  const indexable = rows.filter((row) => !row.noindex);
  assert.equal(new Set(indexable.map((row) => row.title)).size, indexable.length);
  assert.ok(indexable.every((row) => row.title.length >= 35 && row.title.length <= 60));
  assert.ok(indexable.every((row) => row.description.length >= 70 && row.description.length <= 160));
  assert.ok(rows.every((row) => row.linkedinAnchors === 0));
});
```

Adicionar `readdir` ao import já existente de `node:fs/promises`.

Em `tests/schema.test.mjs`, exigir `personSchema().url === 'https://produtocomia.com.br/sobre/'` e `sameAs` contendo o LinkedIn.

- [ ] **Step 2: executar RED**

Run:

```bash
npm run build
node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/generated-seo.test.mjs tests/schema.test.mjs
```

Expected: FAIL por title duplicado/curto, âncoras do LinkedIn e URL externa da entidade Person.

- [ ] **Step 3: localizar títulos curtos de forma bilíngue**

Em `SEO.astro`, substituir o limite e complemento atuais por:

```ts
const titleQualifier = lang === 'pt-BR' ? 'IA para PMs' : 'AI for PMs';
const qualifiedTitle = titleWithBrand.length < 40
  ? `${titleWithBrand} | ${titleQualifier}`
  : titleWithBrand;
const compactTitle = qualifiedTitle.length > 60
  ? (title || `${localizedSite.tagline} — ${SITE.name}`)
  : qualifiedTitle;
```

- [ ] **Step 4: substituir todos os CTAs rastreáveis do LinkedIn**

Usar os seguintes destinos e rótulos:

```text
Rodapé PT: /sobre/ — Sobre o editor
Rodapé EN: /en/about/ — About the editor
Home PT: /sobre/ — CONHECER O EDITOR →
Home EN: /en/about/ — MEET THE EDITOR →
Newsletter PT: /sobre/ — SOBRE O AUTOR →
Newsletter EN: /en/about/ — ABOUT THE AUTHOR →
Sobre PT: mailto e /newsletter/
About EN: mailto e /en/newsletter/
```

Não remover `SITE.linkedin`; ele permanece reservado para `sameAs`.

- [ ] **Step 5: corrigir entidades estruturadas**

Em `src/utils/schema.ts` e JSON-LD inline das homes/about, usar URL interna para Person e `sameAs: [SITE.linkedin]`:

```ts
url: `${SITE.url}/sobre/`,
sameAs: [SITE.linkedin],
```

- [ ] **Step 6: executar GREEN**

Run:

```bash
npm run build
node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/generated-seo.test.mjs tests/schema.test.mjs
```

Expected: PASS.

- [ ] **Step 7: commit**

```bash
git add src/components src/pages src/utils/schema.ts tests/generated-seo.test.mjs tests/schema.test.mjs
git commit -m "fix: make metadata unique and internalize author links"
```

## Task 3: Aumentar a utilidade das 20 páginas de conceitos

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/concepts.ts`
- Modify: `src/pages/conceitos/[concept].astro`
- Modify: `src/pages/en/concepts/[concept].astro`
- Create: `tests/concepts-content.test.mjs`

- [ ] **Step 1: escrever o teste de conteúdo que falha**

Criar `tests/concepts-content.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import * as cheerio from 'cheerio';

test('every concept page has at least 200 meaningful words', async () => {
  for (const root of ['dist/conceitos', 'dist/en/concepts']) {
    for (const name of await readdir(root)) {
      if (name === 'index.html') continue;
      const $ = cheerio.load(await readFile(`${root}/${name}/index.html`, 'utf8'));
      const words = $('main').text().trim().split(/\s+/).filter(Boolean);
      assert.ok(words.length >= 200, `${root}/${name}: ${words.length} words`);
      assert.equal($('[data-product-impact]').length, 1);
    }
  }
});
```

- [ ] **Step 2: executar RED**

Run:

```bash
npm run build
node --test tests/concepts-content.test.mjs
```

Expected: FAIL com as páginas entre 129 e 197 palavras e ausência de `data-product-impact`.

- [ ] **Step 3: ampliar o tipo e os templates**

Adicionar `productImpact: LStr` a `Concept`. Nos dois templates, depois de `longDescription`:

```astro
<section data-product-impact>
  <h2>{lang === 'pt-BR' ? 'Como usar na decisão de produto' : 'How to use it in product decisions'}</h2>
  <p>{t(concept.productImpact, lang)}</p>
</section>
```

- [ ] **Step 4: adicionar conteúdo específico a cada conceito**

Adicionar estes valores bilíngues em `src/data/concepts.ts`:

```text
Agent Washing — PT: Na decisão de produto, use agent washing como teste de honestidade da proposta. Peça evidência de autonomia, memória, uso de ferramentas e recuperação após erro. Compare o fluxo declarado com logs reais e identifique onde regras determinísticas fazem o trabalho. A métrica não é quantas vezes a palavra agente aparece, mas quantas etapas o sistema conclui com qualidade, limites claros e intervenção humana conhecida. Se o produto não sustenta essa evidência, descreva-o como automação assistida.
Agent Washing — EN: In product decisions, use agent washing as an honesty test for the proposition. Ask for evidence of autonomy, memory, tool use, and recovery after failure. Compare the claimed workflow with real logs and identify where deterministic rules do the work. The metric is not how often the word agent appears, but how many steps the system completes with quality, clear limits, and known human intervention. If the product cannot support that evidence, describe it as assisted automation.

AI FinOps — PT: Trate FinOps de IA como uma decisão de margem por funcionalidade. Registre custo de input, output, ferramentas, armazenamento e revisão humana para cada tarefa concluída corretamente. Separe custo médio de cauda e picos, porque poucos fluxos longos podem dominar a fatura. Defina orçamento, alerta e fallback antes do lançamento. A métrica central deve combinar custo por tarefa válida com valor entregue; reduzir tokens sem preservar qualidade apenas transfere custo para suporte, retrabalho ou risco.
AI FinOps — EN: Treat AI FinOps as a margin decision for each feature. Record input, output, tools, storage, and human review costs for every correctly completed task. Separate average cost from tail and peak behavior because a few long workflows can dominate the bill. Define budgets, alerts, and fallbacks before launch. The central metric should combine cost per valid task with value delivered; reducing tokens without preserving quality merely transfers cost to support, rework, or risk.

Model Distillation — PT: Use destilação quando a tarefa é estável, repetitiva e possui exemplos de qualidade suficientes. Antes de trocar o modelo geral por um menor, crie um conjunto de avaliação com casos comuns, cauda e falhas caras. Compare qualidade, latência, custo e manutenção, não apenas acurácia média. Mantenha rota de fallback para o modelo maior e monitore mudança de distribuição. O ganho só é real quando o modelo destilado preserva o resultado que o usuário percebe e reduz o custo total de operação.
Model Distillation — EN: Use distillation when the task is stable, repetitive, and supported by enough quality examples. Before replacing a general model with a smaller one, create an evaluation set with common cases, tail cases, and expensive failures. Compare quality, latency, cost, and maintenance, not only average accuracy. Keep a fallback route to the larger model and monitor distribution shifts. The gain is real only when the distilled model preserves the outcome users perceive and reduces total operating cost.

RAG — PT: Para decidir por RAG, confirme primeiro que a resposta depende de conhecimento privado, atualizado ou citável. Meça recuperação antes de geração: se o documento correto não chega ao contexto, um modelo melhor apenas produz uma resposta mais convincente sobre evidência errada. Versione fontes, registre trechos usados e defina comportamento quando não houver evidência suficiente. Acompanhe recall, precisão, custo de contexto, latência e taxa de respostas sem suporte. RAG deve aumentar rastreabilidade, não esconder incerteza atrás de texto fluente.
RAG — EN: Before choosing RAG, confirm that the answer depends on private, current, or citable knowledge. Measure retrieval before generation: if the right document does not reach the context, a better model only produces a more convincing answer from the wrong evidence. Version sources, record the passages used, and define behavior when evidence is insufficient. Track recall, precision, context cost, latency, and unsupported-answer rate. RAG should improve traceability, not hide uncertainty behind fluent text.

MCP — PT: Avalie MCP como contrato de integração, não como benefício isolado para o usuário. Liste ferramentas, permissões, dados expostos e efeitos colaterais antes de conectar um agente. Cada servidor precisa de autenticação, escopo mínimo, timeout, observabilidade e revogação. Teste nomes e schemas de ferramentas com os modelos usados em produção, porque pequenas ambiguidades alteram a escolha do agente. O resultado esperado é reduzir custo de integração sem criar uma superfície invisível de acesso. A métrica útil combina sucesso de chamadas, falhas seguras e tempo de recuperação.
MCP — EN: Evaluate MCP as an integration contract, not as a standalone user benefit. List tools, permissions, exposed data, and side effects before connecting an agent. Every server needs authentication, minimum scope, timeouts, observability, and revocation. Test tool names and schemas with the production models because small ambiguities change agent selection. The expected outcome is lower integration cost without creating an invisible access surface. Useful metrics combine call success, safe failures, and recovery time.

Agent Gateway — PT: Um agent gateway passa a fazer sentido quando várias equipes, modelos ou ferramentas precisam compartilhar políticas. Centralize identidade, autorização, limites de gasto, roteamento e logs, mas preserve responsáveis claros por cada fluxo. Antes de comprar ou construir, estime o custo de manter essas regras espalhadas e compare com o risco de criar um ponto único de falha. Meça bloqueios corretos, falsos positivos, latência adicionada e tempo para investigar incidentes. O gateway deve reduzir variabilidade operacional sem esconder decisões críticas das equipes de produto.
Agent Gateway — EN: An agent gateway becomes useful when several teams, models, or tools must share policies. Centralize identity, authorization, spending limits, routing, and logs while preserving clear owners for every workflow. Before buying or building, estimate the cost of maintaining those rules separately and compare it with the risk of creating a single point of failure. Measure correct blocks, false positives, added latency, and incident investigation time. The gateway should reduce operational variability without hiding critical decisions from product teams.

SWE-Bench — PT: Use SWE-Bench para comparar capacidade geral de coding agents, nunca como previsão direta da produtividade da sua equipe. Verifique a versão do benchmark, tarefas excluídas, ambiente e taxa de contaminação antes de citar um ranking. Depois crie uma avaliação interna com repositórios, padrões e tipos de mudança reais. Meça solução correta, regressões, tempo de revisão, custo e severidade do erro. Uma pontuação pública alta só importa quando se traduz em mudanças confiáveis no seu contexto de engenharia e no seu processo de entrega.
SWE-Bench — EN: Use SWE-Bench to compare the general capability of coding agents, never as a direct forecast of your team’s productivity. Check the benchmark version, excluded tasks, environment, and contamination rate before citing a ranking. Then create an internal evaluation with real repositories, standards, and change types. Measure correct resolution, regressions, review time, cost, and failure severity. A high public score matters only when it translates into reliable changes in your engineering context and delivery process.

Evals — PT: Comece evals pela decisão que será tomada com o resultado. Colete exemplos reais, defina o que conta como sucesso e dê peso maior às falhas de alto impacto. Separe conjunto de desenvolvimento e teste para não otimizar o produto contra a própria prova. Combine avaliação automática com revisão humana calibrada e acompanhe desacordo entre avaliadores. Publique versões do dataset, prompt e modelo. A métrica útil não é uma nota única: é a distribuição de qualidade, risco e custo nos casos que representam o uso em produção.
Evals — EN: Start evals with the decision that will be made from the result. Collect real examples, define what counts as success, and assign greater weight to high-impact failures. Separate development and test sets so the product is not optimized against its own exam. Combine automated evaluation with calibrated human review and track evaluator disagreement. Version the dataset, prompt, and model. The useful metric is not one score but the distribution of quality, risk, and cost across cases that represent production use.

Tool Calling — PT: Trate cada tool call como uma operação de software sujeita a entrada inválida, repetição e efeito colateral. Use schemas estreitos, validação no servidor, idempotência e confirmação explícita para ações irreversíveis. Não confie na escolha de ferramenta ou nos argumentos apenas porque o JSON é válido. Registre intenção, parâmetros validados, resultado e erro de forma auditável. Meça chamadas corretas, retries, recusas seguras e impacto de falhas. O modelo propõe a ação; a aplicação continua responsável por autorização e execução.
Tool Calling — EN: Treat every tool call as a software operation exposed to invalid input, repetition, and side effects. Use narrow schemas, server-side validation, idempotency, and explicit confirmation for irreversible actions. Do not trust tool selection or arguments merely because the JSON is valid. Record intent, validated parameters, result, and error in an auditable form. Measure correct calls, retries, safe refusals, and failure impact. The model proposes the action; the application remains responsible for authorization and execution.

AI Inference — PT: Gerencie inferência como uma cadeia de serviço, não apenas uma tarifa por milhão de tokens. Inclua fila, cache, rede, ferramentas, retries e revisão humana na latência e no custo percebidos pelo usuário. Defina SLO por caso de uso e roteie tarefas simples para modelos menores quando a avaliação permitir. Monitore tokens, tempo até primeiro token, duração total, erro e custo por tarefa concluída. A melhor otimização é a que preserva qualidade e previsibilidade, especialmente nos picos e nos casos longos.
AI Inference — EN: Manage inference as a service chain, not merely a price per million tokens. Include queues, cache, network, tools, retries, and human review in the latency and cost users perceive. Define an SLO for each use case and route simple tasks to smaller models when evaluations allow it. Monitor tokens, time to first token, total duration, errors, and cost per completed task. The best optimization preserves quality and predictability, especially during peaks and long-tail cases.
```

- [ ] **Step 5: executar GREEN e auditor**

Run:

```bash
npm run build
node --test tests/concepts-content.test.mjs
npm run audit:dist
```

Expected: conceitos PASS; auditor deixa de listar `content-under-200`.

- [ ] **Step 6: commit**

```bash
git add src/types.ts src/data/concepts.ts src/pages/conceitos src/pages/en/concepts tests/concepts-content.test.mjs
git commit -m "content: deepen bilingual AI concept pages"
```

## Task 4: Criar slugs canônicos bilíngues para newsletters

**Files:**
- Create: `src/utils/newsletter-routes.ts`
- Create: `tests/newsletter-routes.test.mjs`
- Modify: `src/content.config.ts`
- Modify: `src/content/newsletters/*.md`
- Modify: `src/content/newsletters-en/*.md`
- Modify: `src/pages/newsletter/[slug].astro`
- Modify: `src/pages/en/newsletter/[slug].astro`
- Modify: `src/components/NewsletterCard.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/pages/rss.xml.js`
- Modify: `src/pages/llms.txt.ts`
- Modify: `src/pages/llms-full.txt.ts`
- Modify: scripts/tests that reference dated generated paths

- [ ] **Step 1: escrever testes que falham para helpers e unicidade**

Criar `tests/newsletter-routes.test.mjs` cobrindo:

```js
assert.equal(newsletterPath('pt-BR', 'custo-inferencia-priorizacao'), '/newsletter/custo-inferencia-priorizacao/');
assert.equal(newsletterPath('en', 'inference-cost-prioritization'), '/en/newsletter/inference-cost-prioritization/');
assert.equal(legacyNewsletterPath('en', '2026-07-29-custo-por-inferencia-priorizacao-produto'), '/en/newsletter/2026-07-29-custo-por-inferencia-priorizacao-produto/');
assert.throws(() => assertUniqueNewsletterSlugs([{ data: { seoSlug: 'repetido' } }, { data: { seoSlug: 'repetido' } }]));
```

- [ ] **Step 2: executar RED**

Run:

```bash
node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/newsletter-routes.test.mjs
```

Expected: FAIL porque `src/utils/newsletter-routes.ts` não existe.

- [ ] **Step 3: implementar os helpers mínimos**

```ts
import type { Lang } from '../i18n/lang';

export function newsletterPath(lang: Lang, seoSlug: string) {
  const prefix = lang === 'pt-BR' ? '/newsletter/' : '/en/newsletter/';
  return `${prefix}${seoSlug}/`;
}

export function legacyNewsletterPath(lang: Lang, id: string) {
  return newsletterPath(lang, id);
}

export function assertUniqueNewsletterSlugs(entries: Array<{ data: { seoSlug: string } }>) {
  const slugs = entries.map((entry) => entry.data.seoSlug);
  if (new Set(slugs).size !== slugs.length) throw new Error('duplicate-newsletter-seo-slug');
}
```

- [ ] **Step 4: executar GREEN do helper**

Run: comando do Step 2.  
Expected: PASS.

- [ ] **Step 5: tornar `seoSlug` obrigatório nas coleções**

Adicionar `seoSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)` aos dois schemas.

- [ ] **Step 6: adicionar os 26 pares de slugs**

Usar exatamente este mapa no frontmatter, sem renomear arquivos:

```text
2026-07-05  PT lovable-tokens-85-mil-prs                 EN lovable-85k-tokens-prs
2026-07-06  PT microsoft-gargalo-adocao-ia               EN microsoft-ai-adoption-bottleneck
2026-07-07  PT adocao-ia-contrata-mais                    EN heavy-ai-adoption-hires-more
2026-07-08  PT shopify-reduz-custo-ia-30x                 EN shopify-cuts-ai-costs-30x
2026-07-09  PT precificacao-ia-custo-valor                EN ai-pricing-cost-value
2026-07-10  PT glm-5-2-automacao-contabilidade            EN glm-5-2-accounting-automation
2026-07-11  PT gpt-5-6-custo-token-roadmap                EN gpt-5-6-token-cost-roadmap
2026-07-12  PT agente-google-dashboard                    EN google-agent-dashboard
2026-07-13  PT habilidade-agentes-ia-forrester            EN ai-agent-skills-forrester
2026-07-14  PT ask-ad-manager-relatorio-b2b               EN ask-ad-manager-b2b-reporting
2026-07-15  PT bonsai-27b-ia-local                         EN bonsai-27b-local-ai
2026-07-16  PT robinhood-agentes-ia-carteira              EN robinhood-ai-agents-portfolio
2026-07-17  PT pricing-ia-por-resultado                    EN outcome-based-ai-pricing
2026-07-18  PT dark-patterns-chatbots-ia                   EN dark-patterns-ai-chatbots
2026-07-19  PT claude-code-orquestra-agentes               EN claude-code-agent-orchestration
2026-07-20  PT humano-no-loop-supervisao-excecao           EN human-in-loop-exception-oversight
2026-07-21  PT step-3-7-flash-custo-codigo                 EN step-3-7-flash-coding-cost
2026-07-22  PT agentes-ia-custo-15x-menor                  EN ai-agents-15x-lower-cost
2026-07-23  PT gpt-5-6-versoes-fluxo                       EN gpt-5-6-versions-workflow
2026-07-24  PT custo-ia-caindo-roadmap                     EN falling-ai-costs-roadmap
2026-07-25  PT governanca-agentes-roadmap                  EN ai-agent-governance-roadmap
2026-07-26  PT agentes-codigo-entrega-trava                EN coding-agents-delivery-bottleneck
2026-07-27  PT credenciais-agentes-bancos                  EN credentials-ai-agents-banks
2026-07-28  PT kimi-k3-pesos-abertos-credito               EN kimi-k3-open-weights-credit
2026-07-29  PT custo-inferencia-priorizacao                EN inference-cost-prioritization
2026-07-30  PT agente-voz-openai-construir                 EN openai-voice-agent-build-buy
```

- [ ] **Step 7: migrar todos os consumidores de `entry.id` em URLs**

Usar `newsletterPath(lang, entry.data.seoSlug)` para href, canonical, schema, RSS e arquivos LLM. Em cada template dinâmico, `getStaticPaths()` deve usar `params.slug = entry.data.seoSlug`. Localizar o alternate pela mesma `data.date` na coleção do outro idioma e usar o `seoSlug` do par.

- [ ] **Step 8: atualizar testes e executar build**

Run:

```bash
rg -n '/newsletter/\$\{[^}]*\.id|/newsletter/2026-' src tests
npm run build
node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/newsletter-routes.test.mjs tests/generated-seo.test.mjs
```

Expected: `rg` sem consumidores de rota legada; build e testes PASS.

- [ ] **Step 9: commit**

```bash
git add src tests
git commit -m "feat: publish newsletters at concise localized URLs"
```

## Task 5: Gerar e servir redirects permanentes

**Files:**
- Create: `src/pages/_newsletter-redirects.map.ts`
- Modify: `src/utils/newsletter-routes.ts`
- Modify: `tests/newsletter-routes.test.mjs`
- Modify: `deploy/nginx.conf`
- Modify: `tests/deploy-contract.test.mjs`
- Modify: `scripts/audit-dist.mjs`

- [ ] **Step 1: escrever testes RED para o mapa e Nginx**

Testar que `buildNewsletterRedirectMap()` gera duas chaves legadas por item e destino canônico com barra. Em `tests/deploy-contract.test.mjs`, exigir:

```js
assert.match(nginx, /include \/usr\/share\/nginx\/html\/_newsletter-redirects\.map;/);
assert.match(nginx, /return 301 \$newsletter_redirect/);
assert.doesNotMatch(nginx, /\$uri\/index\.html/);
```

- [ ] **Step 2: executar RED**

Run:

```bash
node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/newsletter-routes.test.mjs tests/deploy-contract.test.mjs
```

Expected: FAIL por helper e regras ausentes.

- [ ] **Step 3: implementar serialização do mapa**

Adicionar a `newsletter-routes.ts`:

```ts
export function buildNewsletterRedirectMap(lang: Lang, entries: Array<{ id: string; data: { seoSlug: string } }>) {
  return entries.flatMap((entry) => {
    const legacy = legacyNewsletterPath(lang, entry.id);
    const target = newsletterPath(lang, entry.data.seoSlug);
    return [`"${legacy.slice(0, -1)}" "${target}";`, `"${legacy}" "${target}";`];
  });
}
```

O endpoint carregará as duas coleções, ordenará as linhas e responderá `text/plain; charset=utf-8`.

- [ ] **Step 4: integrar o mapa ao Nginx**

No topo de `deploy/nginx.conf`:

```nginx
map $uri $newsletter_redirect {
    default "";
    include /usr/share/nginx/html/_newsletter-redirects.map;
}
```

Dentro de `server` antes das locations:

```nginx
if ($newsletter_redirect != "") {
    return 301 $newsletter_redirect;
}
```

Trocar o `try_files` principal por:

```nginx
try_files $uri $uri/ $uri.html =404;
```

- [ ] **Step 5: exigir o artefato na auditoria e executar GREEN**

Adicionar `_newsletter-redirects.map` a `requiredFiles`. Run:

```bash
npm run build
test -s dist/_newsletter-redirects.map
node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/newsletter-routes.test.mjs tests/deploy-contract.test.mjs
npm run audit:dist
```

Expected: PASS e zero URLs legadas no sitemap.

- [ ] **Step 6: commit**

```bash
git add src/pages/_newsletter-redirects.map.ts src/utils/newsletter-routes.ts deploy/nginx.conf scripts/audit-dist.mjs tests
git commit -m "feat: preserve newsletter URLs with permanent redirects"
```

## Task 6: Reduzir CLS, trabalho de interação e terceiros globais

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `public/fonts/archivo-black-latin-400-normal.woff2`
- Create: `public/fonts/inter-latin-wght-normal.woff2`
- Create: `public/fonts/jetbrains-mono-latin-wght-normal.woff2`
- Create: `public/fonts/OFL.txt`
- Modify: `src/styles/global.css`
- Modify: `src/components/SEO.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `astro.config.mjs`
- Modify: `deploy/nginx.conf`
- Create: `tests/performance-contract.test.mjs`

- [ ] **Step 1: escrever o contrato de performance RED**

Criar teste que leia os arquivos-fonte e verifique:

```js
assert.doesNotMatch(baseLayout, /adsbygoogle|pagead2\.googlesyndication/);
assert.doesNotMatch(seo, /fonts\.googleapis|fonts\.gstatic/);
assert.match(seo, /rel="preload"[^>]+\/fonts\/archivo-black/);
assert.match(globalCss, /font-display:\s*optional/);
assert.match(globalCss, /transform:\s*scaleX/);
assert.match(baseLayout, /requestAnimationFrame/);
assert.match(astroConfig, /prefetchAll:\s*false/);
assert.doesNotMatch(nginx, /googlesyndication|fonts\.googleapis|fonts\.gstatic/);
for (const font of fonts) assert.ok((await stat(font)).size > 1000);
```

- [ ] **Step 2: executar RED**

Run: `node --test tests/performance-contract.test.mjs`  
Expected: FAIL em todos os contratos novos.

- [ ] **Step 3: instalar fontes oficiais e copiar somente o subconjunto latino**

Run:

```bash
npm install --save-dev @fontsource/archivo-black @fontsource-variable/inter @fontsource-variable/jetbrains-mono
mkdir -p public/fonts
cp node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff2 public/fonts/
cp node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2 public/fonts/
cp node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2 public/fonts/
cp node_modules/@fontsource/archivo-black/LICENSE public/fonts/OFL.txt
```

- [ ] **Step 4: declarar e precarregar fontes locais**

No início de `global.css`, adicionar:

```css
@font-face {
  font-family: 'Archivo Black';
  src: url('/fonts/archivo-black-latin-400-normal.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: optional;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin-wght-normal.woff2') format('woff2-variations');
  font-style: normal;
  font-weight: 100 900;
  font-display: optional;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-latin-wght-normal.woff2') format('woff2-variations');
  font-style: normal;
  font-weight: 100 800;
  font-display: optional;
}
```

Em `SEO.astro`, remover preconnect/stylesheet do Google e adicionar os três preloads no formato:

```astro
<link rel="preload" href="/fonts/archivo-black-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
```

- [ ] **Step 5: remover Auto Ads e reduzir prefetch**

Remover o script `adsbygoogle` de `BaseLayout.astro`. Em `astro.config.mjs`:

```js
prefetch: {
  prefetchAll: false,
  defaultStrategy: 'hover',
},
```

Adicionar `data-astro-prefetch` somente às rotas primárias do header e ao CTA da edição mais recente.

- [ ] **Step 6: tornar o scroll handler compositado**

Alterar a barra para `width: 100%`, `transform-origin: left` e `transform: scaleX(0)`. No script, usar:

```js
let framePending = false;
function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  framePending = false;
}
window.addEventListener('scroll', () => {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateScrollProgress);
}, { passive: true });
updateScrollProgress();
```

- [ ] **Step 7: reduzir CSP**

Remover origens de AdSense e Google Fonts de `script-src`, `style-src`, `font-src`, `connect-src` e `frame-src`. Manter apenas `self`, analytics próprio e Cloudflare Turnstile necessários ao lead gate.

- [ ] **Step 8: executar GREEN e build**

Run:

```bash
node --test tests/performance-contract.test.mjs
npm run check
npm run build
```

Expected: testes PASS, build PASS, sem hints novos.

- [ ] **Step 9: commit**

```bash
git add package.json package-lock.json public/fonts src astro.config.mjs deploy/nginx.conf tests/performance-contract.test.mjs
git commit -m "perf: stabilize fonts and remove global auto ads"
```

## Task 7: Validar o pacote completo e a experiência renderizada

**Files:**
- Modify: source files only if a verification exposes a defect

- [ ] **Step 1: executar validação completa fora do sandbox de sockets**

Run: `npm run validate`  
Expected: Astro check 0 errors, 40+ testes do site PASS, 38 testes do serviço PASS e auditor SEO com 0 erros/avisos.

- [ ] **Step 2: iniciar preview e medir páginas representativas**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Medir `/`, `/conceitos/o-que-e-rag/`, `/en/concepts/what-is-rag/`, uma newsletter nova e uma rota antiga. Critérios: CLS < 0,1; console sem erros de AdSense; rota antiga 301; destino 200; canonical e hreflang finais.

- [ ] **Step 3: conferir o diff e os artefatos de migração**

Run:

```bash
git diff --check
git status --short
rg '2026-07-[0-9]{2}-' dist/sitemap-0.xml
rg 'linkedin\.com' dist --glob '*.html'
```

Expected: diff limpo; sitemap sem rotas legadas; HTML sem âncora LinkedIn.

- [ ] **Step 4: usar `superpowers:requesting-code-review`**

Revisar o diff contra a especificação, corrigir achados e repetir `npm run validate`.

- [ ] **Step 5: usar `superpowers:finishing-a-development-branch`**

Apresentar as opções de integração previstas pela skill e não publicar nem mesclar antes da escolha exigida.

## Task 8: Publicar com rollback e verificar produção

**Prerequisite:** branch integrada conforme a escolha do Task 7.

**Files:**
- Modify: source only if smoke test exposes a defect

- [ ] **Step 1: executar deploy existente**

Run: `./scripts/deploy.sh`  
Expected: backup remoto criado, containers saudáveis, smoke tests do script aprovados e rollback não acionado.

- [ ] **Step 2: verificar respostas HTTPS**

Checar home, sitemap, robots, uma URL PT nova, uma EN nova, duas legadas e uma inexistente. Expected: 200, 301 direto e 404 corretos; nenhuma cadeia.

- [ ] **Step 3: medir produção em navegador**

Usar Playwright CLI para console, rede, CLS desktop/mobile e interação do menu. Expected: CLS < 0,1; nenhuma chamada a Google Fonts/AdSense; CSP sem erros desses recursos.

- [ ] **Step 4: tratar Cloudflare Browser Insights**

Se credencial Cloudflare já configurada estiver disponível, desativar Browser Insights para impedir injeção de `static.cloudflareinsights.com`. Sem credencial, registrar a ação externa exata como pendência; não ampliar a CSP apenas para permitir o beacon.

- [ ] **Step 5: entregar relatório final**

Registrar contagens antes/depois, testes, branch/commit, URLs migradas, redirects, Core Web Vitals de laboratório e a ressalva de que INP de campo e ranking levam semanas para refletir a publicação.
