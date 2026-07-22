# Autoridade Temática de IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar núcleos bilíngues e conectados sobre agentes de IA, governança e gestão de produto, acompanhados de materiais autorais citáveis, downloads, validações e preparação para aquisição de autoridade e Search Console.

**Architecture:** Manter o Astro Content Collections como fonte editorial e ampliar o schema de guias com campos opcionais para cluster, FAQ, passos e downloads. Uma camada central de dados conecta hubs e spokes; os layouts geram conteúdo visível e JSON-LD coerente. Guias, arquivos para download, `llms-full.txt`, testes e documentação externa são entregues em commits pequenos e validados antes do deploy.

**Tech Stack:** Astro 5, TypeScript, Markdown Content Collections, Node test runner, Cheerio, Sharp, JSON-LD, nginx estático e Cloudflare.

---

## Mapa de arquivos

**Criar**

- `src/data/guideClusters.ts`: relações PT/EN entre hubs, spokes e recursos.
- `src/components/GuideConnections.astro`: navegação visível do núcleo editorial.
- `src/components/GuideResources.astro`: links para downloads versionados.
- 10 guias PT em `src/content/guides/` e 10 equivalentes EN em `src/content/guides-en/`.
- `public/downloads/`: CSVs, checklists Markdown, questionário e relatório PDF.
- `docs/authority/outreach-kit.md`: posicionamento, pautas e mensagens de contato ainda não enviadas.
- `docs/authority/search-console-runbook.md`: configuração e rotina de acompanhamento.
- `tests/guide-clusters.test.mjs`: integridade dos clusters e reciprocidade de idiomas.
- `tests/resources.test.mjs`: presença e conteúdo mínimo dos downloads.

**Modificar**

- `src/content.config.ts`: campos opcionais de FAQ, HowTo, cluster e downloads.
- `src/utils/schema.ts`: geradores `faqPageSchema` e `howToSchema`.
- `src/pages/guias/[slug].astro`: schemas adicionais, conexões e downloads PT.
- `src/pages/en/guides/[slug].astro`: schemas adicionais, conexões e downloads EN.
- `src/pages/guias/index.astro` e `src/pages/en/guides/index.astro`: apresentação por núcleo.
- `src/data/guideLinks.ts`: newsletters sobre agentes apontam para o novo hub.
- `src/pages/llms.txt.ts` e `src/pages/llms-full.txt.ts`: descoberta de guias e materiais.
- `scripts/audit-dist.mjs`: incluir arquivos de descoberta e downloads essenciais na auditoria.
- `tests/schema.test.mjs` e `tests/generated-seo.test.mjs`: validar schema e páginas geradas.
- `src/content/guides/governanca-de-ia.md`, `src/content/guides-en/ai-governance.md`, `src/content/guides/gestao-de-produtos-com-ia.md` e equivalente EN: links e contexto dos hubs.

## Task 1: Isolar a implementação

**Files:**
- Preserve: `src/content/newsletters/2026-07-22-custo-15x-menor-mesmo-resultado-o-que-isso-ensina-sobre-agentes.md`
- Preserve: `src/content/newsletters-en/2026-07-22-custo-15x-menor-mesmo-resultado-o-que-isso-ensina-sobre-agentes.md`

- [ ] **Step 1: Confirmar o estado da árvore principal**

Run: `git status --short --branch`

Expected: branch `main` sincronizada e somente as duas newsletters locais não versionadas.

- [ ] **Step 2: Criar worktree dedicado**

Run: `git worktree add .worktrees/topical-authority -b codex/topical-authority-clusters main`

Expected: worktree em `.worktrees/topical-authority` sem copiar os dois arquivos não versionados.

- [ ] **Step 3: Confirmar isolamento**

Run: `git -C .worktrees/topical-authority status --short --branch`

Expected: branch `codex/topical-authority-clusters` limpa.

## Task 2: Modelar clusters, FAQ, HowTo e downloads

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/data/guideClusters.ts`
- Test: `tests/guide-clusters.test.mjs`

- [ ] **Step 1: Escrever o teste de integridade dos clusters**

O teste deve importar `guideClusters`, verificar slugs únicos, um hub por cluster e reciprocidade dos pares PT/EN. A existência física de todos os conteúdos será verificada quando o cluster estiver completo na Task 6.

```js
test('guide clusters have unique bilingual entries', () => {
  const allPt = guideClusters.flatMap((cluster) => cluster.items.map((item) => item.pt));
  const allEn = guideClusters.flatMap((cluster) => cluster.items.map((item) => item.en));
  assert.equal(new Set(allPt).size, allPt.length);
  assert.equal(new Set(allEn).size, allEn.length);
  assert.ok(guideClusters.every((cluster) => cluster.items.some((item) => item.pt === cluster.hub.pt && item.en === cluster.hub.en)));
});
```

- [ ] **Step 2: Rodar o teste e confirmar falha**

Run: `node --test tests/guide-clusters.test.mjs`

Expected: FAIL porque `guideClusters.ts` ainda não existe.

- [ ] **Step 3: Ampliar o schema da coleção**

Adicionar campos opcionais ao `guideSchema`:

```ts
cluster: z.enum(['agents', 'governance', 'product']).optional(),
isHub: z.boolean().default(false),
faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
howToSteps: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
downloads: z.array(z.object({ label: z.string(), href: z.string(), format: z.string() })).default([]),
```

- [ ] **Step 4: Criar o mapa bilíngue de clusters**

`guideClusters.ts` deve exportar três clusters com estes pares:

```ts
export const guideClusters = [
  { id: 'agents', hub: { pt: 'agentes-de-ia', en: 'ai-agents' }, items: [
    { pt: 'agentes-de-ia', en: 'ai-agents' },
    { pt: 'como-criar-agentes-de-ia', en: 'how-to-build-ai-agents' },
    { pt: 'agentes-de-ia-com-n8n', en: 'ai-agents-with-n8n' },
    { pt: 'exemplos-de-agentes-de-ia', en: 'ai-agent-examples' },
    { pt: 'template-avaliacao-agente-de-ia', en: 'ai-agent-evaluation-template' },
  ]},
  { id: 'governance', hub: { pt: 'governanca-de-ia', en: 'ai-governance' }, items: [
    { pt: 'governanca-de-ia', en: 'ai-governance' },
    { pt: 'checklist-governanca-de-ia', en: 'ai-governance-checklist' },
    { pt: 'matriz-risco-ia', en: 'ai-risk-matrix' },
    { pt: 'inventario-sistemas-de-ia', en: 'ai-system-inventory' },
  ]},
  { id: 'product', hub: { pt: 'gestao-de-produto', en: 'product-management' }, items: [
    { pt: 'gestao-de-produto', en: 'product-management' },
    { pt: 'gestao-de-produtos-com-ia', en: 'ai-product-management' },
    { pt: 'inteligencia-artificial-para-product-managers', en: 'artificial-intelligence-for-product-managers' },
    { pt: 'estado-ia-gestao-de-produto-2026', en: 'state-of-ai-in-product-management-2026' },
  ]},
] as const;
```

Também exportar funções `clusterForGuide(slug, lang)` e `guidePair(slug, lang)`.

- [ ] **Step 5: Rodar checagem de tipos e teste**

Run: `npm run check && node --test tests/guide-clusters.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

Run: `git add src/content.config.ts src/data/guideClusters.ts tests/guide-clusters.test.mjs && git commit -m "feat: model bilingual guide clusters"`

## Task 3: Gerar schemas visíveis e conexões entre guias

**Files:**
- Modify: `src/utils/schema.ts`
- Modify: `tests/schema.test.mjs`
- Create: `src/components/GuideConnections.astro`
- Create: `src/components/GuideResources.astro`
- Modify: `src/pages/guias/[slug].astro`
- Modify: `src/pages/en/guides/[slug].astro`

- [ ] **Step 1: Escrever testes para FAQPage e HowTo**

```js
test('FAQ schema mirrors visible questions and answers', () => {
  const schema = faqPageSchema([{ question: 'O que é um agente?', answer: 'Um sistema que usa ferramentas para concluir uma tarefa.' }]);
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, 'Um sistema que usa ferramentas para concluir uma tarefa.');
});

test('HowTo schema exposes ordered visible steps', () => {
  const schema = howToSchema({ name: 'Como criar um agente', description: 'Método prático', steps: [{ name: 'Defina o objetivo', text: 'Escolha uma tarefa mensurável.' }] });
  assert.equal(schema.step[0].position, 1);
});
```

- [ ] **Step 2: Confirmar falha**

Run: `node --test tests/schema.test.mjs`

Expected: FAIL por funções não exportadas.

- [ ] **Step 3: Implementar funções puras em `schema.ts`**

`faqPageSchema(items)` deve produzir `Question` e `Answer`; `howToSchema(input)` deve produzir `HowToStep` com posição, nome e texto. Não incluir markup quando os arrays estiverem vazios.

- [ ] **Step 4: Criar componentes de conexão e recursos**

`GuideConnections.astro` recebe `slug` e `lang`, identifica o cluster, mostra o hub primeiro e os demais itens com títulos vindos das collections. `GuideResources.astro` recebe `downloads` e renderiza links com atributo `download` quando o destino começa por `/downloads/`.

- [ ] **Step 5: Integrar componentes e schemas nos layouts PT/EN**

Os layouts devem:

1. adicionar `FAQPage` somente quando `entry.data.faq.length > 0`;
2. adicionar `HowTo` somente quando `entry.data.howToSteps.length > 0`;
3. renderizar as mesmas FAQs e etapas de forma visível;
4. renderizar recursos antes das fontes;
5. renderizar conexões após o corpo.

- [ ] **Step 6: Rodar testes**

Run: `npm run check && node --test tests/schema.test.mjs`

Expected: PASS.

- [ ] **Step 7: Commit**

Run: `git add src/utils/schema.ts tests/schema.test.mjs src/components/GuideConnections.astro src/components/GuideResources.astro 'src/pages/guias/[slug].astro' 'src/pages/en/guides/[slug].astro' && git commit -m "feat: connect guide content and structured data"`

## Task 4: Publicar o núcleo de Agentes de IA

**Files:**
- Create: `src/content/guides/agentes-de-ia.md`
- Create: `src/content/guides/como-criar-agentes-de-ia.md`
- Create: `src/content/guides/agentes-de-ia-com-n8n.md`
- Create: `src/content/guides/exemplos-de-agentes-de-ia.md`
- Create: `src/content/guides/template-avaliacao-agente-de-ia.md`
- Create: equivalentes EN conforme Task 2

- [ ] **Step 1: Pesquisar somente fontes primárias atuais**

Usar documentação oficial de NIST, n8n, Anthropic, OpenAI e Google Cloud quando pertinente. Registrar em cada frontmatter somente fontes realmente utilizadas. Não copiar textos longos nem afirmar que um padrão é universal.

- [ ] **Step 2: Escrever o hub PT e EN**

Frontmatter obrigatório:

```yaml
cluster: agents
isHub: true
tags: ["agentes de IA", "automação", "gestão de produtos"]
```

Seções mínimas: definição direta; componentes; ciclo observar-planejar-agir-avaliar; tipos; agentes versus chatbot versus automação; casos de uso; arquitetura; avaliação; custo; segurança; quando não usar; plano de adoção; FAQ.

- [ ] **Step 3: Escrever “Como criar agentes de IA” PT e EN**

Incluir `howToSteps` com: definir resultado; escolher ferramentas; desenhar contexto e estado; implementar guardrails; criar conjunto de avaliação; testar falhas; lançar gradualmente; monitorar e versionar. O corpo visível deve explicar cada passo.

- [ ] **Step 4: Escrever tutorial n8n PT e EN**

Usar a documentação oficial vigente. Incluir arquitetura simples, credenciais, gatilho, nó de agente/modelo, ferramentas, memória apenas quando necessária, tratamento de erros, avaliação e checklist de produção. Não prometer que qualquer versão ou nó existe sem confirmação na documentação atual.

- [ ] **Step 5: Escrever exemplos e template PT/EN**

Os exemplos devem ser padrões verificáveis — triagem, pesquisa, suporte com escalonamento, operação, análise e engenharia — com entrada, ferramentas, saída, risco e métrica. O template deve coincidir com o arquivo para download criado na Task 7.

- [ ] **Step 6: Confirmar integridade**

Run: `node --test tests/guide-clusters.test.mjs && npm run check`

Expected: cluster de agentes passa; os demais falham apenas até os arquivos das Tasks 5 e 6 existirem.

- [ ] **Step 7: Commit**

Run: `git add src/content/guides src/content/guides-en && git commit -m "content: publish bilingual AI agent cluster"`

## Task 5: Expandir Governança de IA

**Files:**
- Modify: `src/content/guides/governanca-de-ia.md`
- Modify: `src/content/guides-en/ai-governance.md`
- Create: três spokes PT e três EN conforme Task 2

- [ ] **Step 1: Atualizar o hub existente**

Adicionar `cluster: governance` e `isHub: true`. Integrar links conceituais aos três artefatos e fontes primárias atuais: NIST AI RMF, NIST GenAI Profile, ISO/IEC 42001 em página oficial e Comissão Europeia para AI Act. Manter ressalva jurídica.

- [ ] **Step 2: Criar checklist PT/EN**

Cobrir discovery, dados, fornecedor/modelo, avaliação, aprovação, lançamento, monitoramento, incidente, mudança e desativação. Cada item deve ter evidência esperada e responsável sugerido.

- [ ] **Step 3: Criar matriz de risco PT/EN**

Explicar severidade, probabilidade, escala, reversibilidade e capacidade de contestação. Oferecer faixas de triagem, não um parecer legal ou fórmula universal.

- [ ] **Step 4: Criar inventário PT/EN**

Explicar campos: sistema, dono, finalidade, usuários, impacto, dados, fornecedor, modelo/versão, integrações, retenção, avaliações, supervisão, incidentes e revisão.

- [ ] **Step 5: Validar e commit**

Run: `npm run check`

Run: `git add src/content/guides src/content/guides-en && git commit -m "content: expand bilingual AI governance cluster"`

## Task 6: Criar o núcleo de Gestão de Produto e o relatório

**Files:**
- Create: `src/content/guides/gestao-de-produto.md`
- Create: `src/content/guides-en/product-management.md`
- Create: `src/content/guides/estado-ia-gestao-de-produto-2026.md`
- Create: `src/content/guides-en/state-of-ai-in-product-management-2026.md`
- Modify: guias existentes de produto PT/EN

- [ ] **Step 1: Escrever o hub de Gestão de Produto PT/EN**

Cobrir definição, papel do PM, estratégia, discovery, priorização, roadmap, entrega, métricas, operação, competências e relação responsável com IA. Distinguir gestão de produto de gestão de projetos. Usar linguagem introdutória e links para os guias especializados.

- [ ] **Step 2: Pesquisar o relatório em fontes públicas**

Usar fontes públicas com metodologia disponível e registrar data de acesso. Priorizar relatórios primários de organizações reconhecidas e documentação oficial. Não combinar métricas incompatíveis e não generalizar amostras para toda a profissão.

- [ ] **Step 3: Escrever o relatório PT/EN**

Seções: escopo; metodologia; limitações; sinais observados; implicações para discovery, entrega, governança e competências; recomendações do autor; agenda de pesquisa; fontes. Exibir claramente “análise autoral de fontes públicas — não é pesquisa de campo”.

- [ ] **Step 4: Conectar guias existentes**

Adicionar `cluster: product` aos dois guias já publicados e `isHub: false`. Preservar URLs e significado; incluir links contextuais para o novo hub e relatório.

- [ ] **Step 5: Validar clusters completos**

Ampliar `tests/guide-clusters.test.mjs` com a verificação de existência de cada Markdown PT/EN e então executar:

Run: `node --test tests/guide-clusters.test.mjs && npm run check`

Expected: PASS.

- [ ] **Step 6: Commit**

Run: `git add src/content/guides src/content/guides-en && git commit -m "content: publish product management hub and 2026 report"`

## Task 7: Criar materiais originais para download

**Files:**
- Create: `public/downloads/checklist-governanca-de-ia.md`
- Create: `public/downloads/ai-governance-checklist.md`
- Create: `public/downloads/matriz-risco-ia.csv`
- Create: `public/downloads/ai-risk-matrix.csv`
- Create: `public/downloads/inventario-sistemas-de-ia.csv`
- Create: `public/downloads/ai-system-inventory.csv`
- Create: `public/downloads/template-avaliacao-agente-de-ia.csv`
- Create: `public/downloads/ai-agent-evaluation-template.csv`
- Create: `public/downloads/questionario-ia-gestao-de-produto.md`
- Create: `public/downloads/ai-product-management-survey.md`
- Create: `public/downloads/estado-ia-gestao-de-produto-2026.pdf`
- Create: `public/downloads/state-of-ai-in-product-management-2026.pdf`
- Test: `tests/resources.test.mjs`

- [ ] **Step 1: Escrever teste de presença e conteúdo mínimo**

O teste deve verificar os 12 arquivos, tamanho maior que zero, cabeçalhos CSV esperados e `%PDF-` nos PDFs.

- [ ] **Step 2: Confirmar falha**

Run: `node --test tests/resources.test.mjs`

Expected: FAIL por arquivos ausentes.

- [ ] **Step 3: Criar templates textuais e CSV**

Cada arquivo deve declarar autor, versão 1.0, data 2026-07-22, licença de reutilização com atribuição e URL canônica. Os CSVs devem usar UTF-8, cabeçalhos estáveis e uma linha de exemplo explicitamente marcada como exemplo.

- [ ] **Step 4: Gerar PDFs do relatório**

Usar a habilidade de PDF para gerar documentos acessíveis a partir do conteúdo web aprovado. Incluir capa, autoria, metodologia, limitações, fontes com URLs, paginação e URL canônica. Renderizar e revisar visualmente todas as páginas antes de salvar em `public/downloads/`.

- [ ] **Step 5: Associar downloads aos guias**

Preencher `downloads` no frontmatter dos guias correspondentes, garantindo que PT aponte para material PT e EN para EN.

- [ ] **Step 6: Rodar teste e commit**

Run: `node --test tests/resources.test.mjs && npm run check`

Run: `git add public/downloads src/content/guides src/content/guides-en tests/resources.test.mjs && git commit -m "feat: add citable AI governance and product resources"`

## Task 8: Organizar índices, newsletters e descoberta para LLMs

**Files:**
- Modify: `src/pages/guias/index.astro`
- Modify: `src/pages/en/guides/index.astro`
- Modify: `src/data/guideLinks.ts`
- Modify: `src/pages/llms.txt.ts`
- Modify: `src/pages/llms-full.txt.ts`
- Modify: `scripts/audit-dist.mjs`
- Modify: `tests/generated-seo.test.mjs`

- [ ] **Step 1: Criar teste gerado para os três hubs**

Depois do build, verificar canonical, hreflang, H1, Article, BreadcrumbList, links para spokes e downloads. Verificar que `llms-full.txt` contém guias PT/EN e que `llms.txt` aponta para os três hubs.

- [ ] **Step 2: Confirmar falha**

Run: `npm run build && node --test tests/generated-seo.test.mjs`

Expected: FAIL até os índices e arquivos LLM serem atualizados.

- [ ] **Step 3: Agrupar índices por núcleo**

Exibir Agentes de IA, Governança de IA e Gestão de Produto como seções com hub em destaque e spokes. Manter todos os guias descobertos pelas collections.

- [ ] **Step 4: Atualizar regra de newsletters**

Em `guideLinks.ts`, mapear `agentes-de-ia`, `coding-agents` e automações orientadas a agentes para `/guias/agentes-de-ia/` e equivalente EN; manter governança e produto nas rotas existentes.

- [ ] **Step 5: Incluir guias no corpus LLM**

`llms-full.txt` deve listar título, URL, descrição, data de atualização, tópicos e corpo textual resumido de cada guia PT/EN, além das newsletters. `llms.txt` deve destacar os hubs e recursos principais.

- [ ] **Step 6: Fortalecer auditoria**

Adicionar `llms.txt`, `llms-full.txt` e downloads essenciais a `requiredFiles`. Manter sitemap e RSS obrigatórios.

- [ ] **Step 7: Rodar testes e commit**

Run: `npm run validate`

Expected: check, OG, build, testes e auditoria sem erros.

Run: `git add src scripts tests public/og && git commit -m "feat: surface topical clusters to search and AI systems"`

## Task 9: Preparar autoridade externa e Search Console

**Files:**
- Create: `docs/authority/outreach-kit.md`
- Create: `docs/authority/search-console-runbook.md`

- [ ] **Step 1: Pesquisar alvos atuais**

Identificar comunidades, newsletters, podcasts e sites brasileiros de produto e IA com atividade recente, público alinhado e formas legítimas de contato. Registrar URL, tipo, relevância, pauta adequada e evidência de atividade. Não coletar nem usar contatos privados.

- [ ] **Step 2: Criar kit de divulgação**

Incluir uma proposta de valor por ativo, três pautas de participação, mensagem curta para comunidade, proposta para newsletter/site e proposta para podcast. Todas devem oferecer um dado, framework ou material útil antes de pedir citação. Marcar claramente “não enviado”.

- [ ] **Step 3: Criar runbook do Search Console**

Documentar: adicionar propriedade de domínio; verificar por DNS no Cloudflare; enviar `https://produtocomia.com.br/sitemap-index.xml`; inspecionar hubs; solicitar indexação; conferir Pages e Enhancements; registrar consultas e páginas semanalmente. Incluir tabela de linha de base com campos, não dados inventados.

- [ ] **Step 4: Commit**

Run: `git add docs/authority && git commit -m "docs: prepare outreach and search console monitoring"`

## Task 10: Revisão editorial, técnica e visual

**Files:**
- Review: todos os arquivos alterados
- Modify: apenas correções encontradas

- [ ] **Step 1: Revisar conteúdo PT/EN**

Verificar fatos, atribuições, links, consistência entre idiomas, distinção entre fato e análise, ausência de afirmações não sustentadas, clareza e ausência de keyword stuffing.

- [ ] **Step 2: Rodar validação completa**

Run: `npm run validate`

Expected: exit code 0 e `SEO audit` com zero erros.

- [ ] **Step 3: Inspecionar páginas essenciais localmente**

Run: `npm run dev -- --host 127.0.0.1`

Inspecionar desktop e mobile: índice de guias, três hubs, tutorial n8n, relatório, downloads e alternância PT/EN. Confirmar foco, contraste, headings, tabelas, listas, overflow e links.

- [ ] **Step 4: Confirmar que newsletters do usuário permanecem intactas**

Run na árvore principal: `git status --short`

Expected: as duas newsletters locais continuam presentes e não foram incluídas nos commits do worktree.

- [ ] **Step 5: Commit de correções, se necessário**

Listar os caminhos com `git diff --name-only`, adicionar cada caminho corrigido explicitamente — nunca diretórios inteiros — e executar `git commit -m "fix: polish topical authority release"`. Se não houver correções, não criar commit vazio.

## Task 11: Preparar e executar publicação segura

**Files:**
- Deploy: `dist/`
- Preserve: árvore principal e newsletters locais

- [ ] **Step 1: Revisar histórico e diff**

Run: `git log --oneline main..codex/topical-authority-clusters && git diff --stat main...codex/topical-authority-clusters`

Expected: apenas escopo previsto, sem newsletters locais.

- [ ] **Step 2: Integrar a branch na main**

Na árvore principal, confirmar que os arquivos não versionados não colidem; fazer merge não destrutivo da branch e rodar `npm run validate` novamente.

- [ ] **Step 3: Publicar no GitHub**

Run: `git push origin main`

Expected: push concluído para `TozatoRodrigo/blog_de_ia`.

- [ ] **Step 4: Fazer backup e deploy**

Criar backup timestampado em `/home/rodrigo/backups/produtocomia/`, preservar o diretório do bind mount, copiar `dist/`, recriar somente o container `produtocomia` e não tocar em outros projetos ou serviços.

- [ ] **Step 5: Validar produção**

Confirmar HTTP 200 em home PT/EN, índices de guias, três hubs PT/EN, downloads, `robots.txt`, `llms.txt`, `llms-full.txt`, RSS e sitemap. Confirmar CSS como `text/css`, canonical/hreflang e presença das URLs no sitemap.

- [ ] **Step 6: Entregar ações externas ao usuário**

Fornecer somente os passos que exigem conta ou representação do Rodrigo: verificação do Search Console, aprovação da lista de contatos e envio de abordagens. Não afirmar que menções foram obtidas antes de resposta dos terceiros.
