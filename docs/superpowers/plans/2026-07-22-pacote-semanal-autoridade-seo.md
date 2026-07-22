# Weekly SEO Authority Package Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and activate one weekly Codex automation that publishes a complete bilingual authority package containing a deep guide, reproducible original research, and a protected lead-generation template.

**Architecture:** The automation runs locally against the canonical Blog_de_IA project every Monday at 08:00 in the machine's São Paulo timezone. It performs opportunity selection, content and asset creation, validation, GitHub publication, deployment through the existing release script, and public smoke verification as one fail-closed workflow.

**Tech Stack:** Codex cron automations, Astro content collections, Markdown, JSON download catalog, Node.js validation, Git/GitHub over SSH, Docker deployment through `scripts/deploy.sh`, Cloudflare, Resend, Google Search Console.

---

## File and state map

- Existing specification: `docs/superpowers/specs/2026-07-22-pacote-semanal-autoridade-seo-design.md`
- This implementation plan: `docs/superpowers/plans/2026-07-22-pacote-semanal-autoridade-seo.md`
- Automation state created by Codex: `$CODEX_HOME/automations/publicar-pacote-semanal-de-autoridade-seo-e-ia/automation.toml`
- Canonical repository used by the automation: `/Users/rodrigodiastozato/Desktop/Blog_de_IA`
- Guide content: `src/content/guides/*.md`
- Newsletter content consulted for internal links: `src/content/newsletters/*.md` and `src/content/newsletters-en/*.md`
- Download allowlist: `config/downloads.json`
- Private downloadable assets: `private-downloads/`
- Full validation command: `npm run validate`
- Only allowed production entrypoint: `scripts/deploy.sh`

No new application source file is required to create the automation. Future weekly runs may modify content, catalog, private assets, tests, and tightly related cluster metadata, but only within the constraints encoded in the automation prompt.

### Task 1: Resolve the project and prevent duplicate automation

**Files:**
- Inspect: `$CODEX_HOME/automations/*/automation.toml`
- Inspect: `/Users/rodrigodiastozato/Desktop/Blog_de_IA/.git`

- [ ] **Step 1: List saved Codex projects**

Use the Codex project-listing capability and find the project whose canonical repository is `/Users/rodrigodiastozato/Desktop/Blog_de_IA` or the existing project used by the daily newsletter automation.

Expected project identifier:

```text
local-705265e40081b1ed949bef921ced32d1
```

- [ ] **Step 2: Inspect existing automations**

Run:

```bash
for file in "$CODEX_HOME"/automations/*/automation.toml; do
  rg -n '^(id|name|status|rrule) =' "$file"
done
```

Expected:

- the daily bilingual newsletter automation remains active;
- the separate English newsletter automation remains paused;
- no active automation named `Publicar pacote semanal de autoridade SEO e IA` exists.

If an automation with that exact purpose exists, update it instead of creating a duplicate.

- [ ] **Step 3: Confirm the daily production window**

Verify that the daily newsletter remains scheduled at 11:30. The weekly automation must use Monday at 08:00 so the jobs do not intentionally overlap.

### Task 2: Create the weekly automation

**Files:**
- Create through Codex automation state: `$CODEX_HOME/automations/publicar-pacote-semanal-de-autoridade-seo-e-ia/automation.toml`

- [ ] **Step 1: Create an active local cron automation with the exact fields**

Use the automation management capability with:

```text
mode: create
kind: cron
name: Publicar pacote semanal de autoridade SEO e IA
status: ACTIVE
rrule: RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=8;BYMINUTE=0
executionEnvironment: local
destination: local
model: gpt-5.6-terra
reasoningEffort: high
projectId: local-705265e40081b1ed949bef921ced32d1
```

Use this complete prompt:

```text
Você é responsável por produzir e publicar o pacote semanal de autoridade do Produto com IA. Cada execução deve criar um conjunto bilíngue coerente formado por um guia profundo, uma pesquisa original verificável e um template útil protegido por captura de lead.

OBJETIVO

Fortalecer a autoridade do domínio em mecanismos de pesquisa e sistemas de resposta por IA, gerar ativos que mereçam links e menções e converter visitantes em leads qualificados. Qualidade, precisão, originalidade e segurança têm prioridade sobre a obrigação de publicar.

CONTEXTO FIXO

- Timezone: America/Sao_Paulo.
- Execução: segunda-feira às 08:00.
- Repositório canônico: /Users/rodrigodiastozato/Desktop/Blog_de_IA
- GitHub: git@github.com:TozatoRodrigo/blog_de_ia.git
- Domínio: https://produtocomia.com.br
- Autor: Rodrigo Tozato.
- E-mail de leads: rodrigo.tozato@icloud.com.
- Idiomas: português sem prefixo e inglês em /en/.
- Guias: src/content/guides/ e a arquitetura bilíngue existente.
- Newsletters: src/content/newsletters/ e src/content/newsletters-en/.
- Catálogo de downloads protegidos: config/downloads.json.
- Arquivos privados: private-downloads/.
- Validação integral: npm run validate.
- Único deploy autorizado: ./scripts/deploy.sh.
- Especificação de referência: docs/superpowers/specs/2026-07-22-pacote-semanal-autoridade-seo-design.md.

REGRA DE SUCESSO

Uma execução só é bem-sucedida quando guia PT/EN, pesquisa e template formam um pacote integrado, todas as evidências são verificáveis, o GitHub recebe somente alterações pertinentes, o deploy oficial conclui com sucesso e as páginas e o download protegido funcionam em produção. Publicar três peças rasas ou desconectadas não conta como sucesso.

1. PREPARAÇÃO SEGURA

- Entre no repositório canônico.
- Leia integralmente a especificação de referência antes de agir.
- Inspecione git status --short.
- Não apague, esconda, sobrescreva nem inclua alterações locais preexistentes.
- Se houver mudança conflitante, outra automação trabalhando ou estado incompreensível, interrompa sem publicar.
- Confirme a branch main.
- Execute git fetch git@github.com:TozatoRodrigo/blog_de_ia.git main.
- Integre somente com git merge --ff-only FETCH_HEAD.
- Se não for possível avançar por fast-forward, interrompa. Nunca use reset, clean, rebase automático, stash de alterações de terceiros ou push forçado.

2. INVENTÁRIO E PREVENÇÃO DE CANIBALIZAÇÃO

- Leia títulos, slugs, descrições, headings e intenção dos guias, conceitos, tópicos e newsletters existentes.
- Construa um mapa da cobertura atual e das páginas pilares.
- Identifique sobreposição de intenção, conteúdos curtos, páginas sem fontes e oportunidades de atualização.
- Não crie uma URL nova quando a melhor solução for aprofundar uma página existente.
- Não transforme uma newsletter em concorrente da página pilar. A newsletter deve apoiar o guia.

3. DADOS DE OPORTUNIDADE

- Consulte Search Console quando estiver acessível e com dados processados.
- Use Ubersuggest somente quando o conector estiver realmente disponível.
- Se o Ubersuggest estiver indisponível, registre isso e nunca invente volume, CPC, dificuldade ou posição.
- Pesquise resultados atuais e concorrentes relevantes.
- Para assuntos técnicos, científicos, jurídicos ou regulatórios, priorize documentação oficial, normas, estudos e fontes primárias.
- Considere as prioridades já conhecidas: agentes de IA; como criar agentes de IA; agentes de IA com n8n; exemplos de agentes; governança de IA; gestão de produto; IA para Product Managers; avaliação, custos, risco e operação de agentes.

4. ESCOLHA DO PACOTE

- Use uma estratégia de 70% conteúdo estrutural/perene e 30% oportunidade recente dentro dos clusters prioritários.
- Pontue relevância, intenção, lacuna competitiva, possibilidade de evidência original, utilidade do template, potencial de links, potencial de citação por IA e alinhamento com a experiência do autor.
- Escolha um único tema central.
- Registre antes de escrever: tema, palavra-chave principal, duas a seis secundárias, intenção, público, página pilar, concorrentes, lacuna, pergunta de pesquisa, método, fontes candidatas e template proposto.
- Se não houver oportunidade confiável que comporte as três entregas, interrompa sem alterar o projeto.

5. GUIA PROFUNDO

- Produza português e inglês editorialmente equivalentes.
- Use aproximadamente 1.800 a 3.000 palavras por idioma quando essa profundidade for necessária. Não use texto de preenchimento.
- Abra com uma resposta direta e citável.
- Use título, excerpt, H2/H3, sumário, definições, exemplos, etapas, comparações, riscos e limitações conforme a intenção.
- Inclua FAQ apenas para perguntas realmente respondidas no conteúdo visível.
- Use de cinco a dez fontes confiáveis e priorize fontes primárias.
- Preserve cada URL externa próxima da afirmação que sustenta.
- Inclua de três a oito links internos contextuais, incluindo a página pilar.
- Conecte o guia à pesquisa e ao template.
- Confirme canonical próprio, hreflang pt-BR/en/x-default, lang, Open Graph, Twitter e dados estruturados coerentes.
- Não traduza mecanicamente palavras-chave para o inglês.
- Não invente fatos, citações, experiência do autor ou resultados.

6. PESQUISA ORIGINAL VERIFICÁVEL

- Pesquisa própria significa análise realizada pelo Produto com IA a partir de dados reais e método reproduzível.
- Formatos aceitos: análise de dados públicos, benchmark reproduzível, levantamento sistemático de documentação oficial, auditoria quantitativa de conjunto definido, análise não pessoal do acervo do site ou pesquisa com base real autorizada.
- É proibido fabricar entrevistas, respondentes, amostras, avaliações, testes, números ou conclusões.
- Declare pergunta, objetivo ou hipótese, universo, período, critérios de inclusão/exclusão, fontes, método de coleta, método de cálculo, resultados, limitações e data.
- Disponibilize tabela ou dados suficientes para reprodução quando direitos e licenças permitirem.
- Diferencie resultado observado de inferência editorial.
- Se os dados não sustentarem pesquisa original, escolha outro tema ou interrompa. Não rebatize uma compilação genérica como pesquisa.

7. TEMPLATE ÚTIL

- Crie CSV, planilha, checklist ou documento editável que resolva uma tarefa diretamente relacionada ao guia e à pesquisa.
- Inclua instruções, campos claros, critérios derivados da pesquisa e pelo menos um exemplo preenchido.
- Crie versões PT e EN quando necessárias.
- Não inclua macros, scripts, fórmulas perigosas, segredos ou dados pessoais reais.
- Adicione o arquivo em private-downloads/ e declare-o em config/downloads.json conforme o padrão existente.
- Crie ou atualize a apresentação pública do recurso.
- Garanta que o download use o formulário leve existente e envie a notificação de lead para rodrigo.tozato@icloud.com.
- Não exponha o arquivo em public/ nem permita acesso direto sem autorização.

8. ARQUITETURA E DISTRIBUIÇÃO INTERNA

- Jornada obrigatória: consulta ou resposta de IA → guia → evidência original → template → lead.
- Ligue o guia à página pilar e atualize a página pilar para apontar ao guia quando editorialmente adequado.
- Adicione links de conteúdos relacionados sem alteração artificial.
- Use âncoras descritivas.
- Preserve rotas bilíngues e reciprocidade.
- Garanta que sitemap, RSS aplicável, llms.txt e llms-full.txt continuem coerentes.

9. VALIDAÇÃO ANTES DO GIT

- Revise todos os arquivos e o diff.
- Verifique factualidade, fontes, metodologia, licenças, consistência PT/EN e links.
- Confirme que nenhuma informação pessoal, segredo, banco, log ou arquivo privado indevido aparece no diff.
- Execute git diff --check.
- Execute npm run validate.
- Exija sucesso de schemas, build, testes do site, testes do serviço de leads e auditoria SEO.
- Confirme as páginas PT/EN em dist, sua presença no sitemap e em llms-full.txt, os dados estruturados e o download protegido.
- Se qualquer validação falhar, não faça commit, push ou deploy.

10. GITHUB

- Adicione somente arquivos pertencentes ao pacote semanal e testes estritamente necessários.
- Nunca adicione dist, node_modules, .env, bancos, logs ou artefatos não relacionados.
- Use commit no formato: content: publish weekly authority package YYYY-MM-DD.
- Confirme novamente o remoto e aceite somente avanço seguro.
- Envie por SSH com git push git@github.com:TozatoRodrigo/blog_de_ia.git HEAD:main.
- Se o push falhar, não publique na VPS.

11. PUBLICAÇÃO

- Após push bem-sucedido, execute exatamente ./scripts/deploy.sh na raiz do projeto.
- Não replique manualmente nenhuma etapa interna.
- Nunca edite ou copie HTML diretamente na VPS.
- Nunca limpe diretórios de produção.
- Nunca pare, remova ou recrie containers manualmente.
- Preserve .env.download-leads, lead-data, private-downloads e produtocomia-download-leads.
- Se o deploy falhar, respeite o rollback do script e reporte. Não tente caminho alternativo.

12. VERIFICAÇÃO PÚBLICA

- Confirme HTTP 200 nas novas páginas PT e EN.
- Confirme canonical, hreflang, lang, title, description, Open Graph e dados estruturados.
- Confirme URLs em sitemap e llms-full.txt.
- Confirme os links internos e externos essenciais.
- Confirme /api/download-leads/health saudável.
- Confirme que o caminho público do template retorna o formulário protegido como HTML e cache-control: no-store antes da autorização.
- Confirme que páginas públicas essenciais permanecem disponíveis.

13. RELATÓRIO

Informe: decisão de publicar ou interromper; tema; justificativa; palavra-chave principal e secundárias; intenção; público; concorrentes; lacuna; página pilar; URLs PT/EN; contagem aproximada de palavras; fontes; pergunta, método, resultados e limitações da pesquisa; template; links internos; arquivos alterados; resultado completo da validação; commit; push; release; verificação pública; saúde dos leads; riscos e acompanhamentos.

Registre que o pacote deverá ser avaliado novamente em 30, 60 e 90 dias por indexação, impressões, consultas, posição, CTR, cliques, downloads, leads, backlinks, menções e aparições observáveis em respostas de IA.

BARREIRAS INEGOCIÁVEIS

- Não publicar conteúdo raso para cumprir calendário.
- Não inventar dados ou métricas.
- Não duplicar intenção.
- Não alterar produção fora do script oficial.
- Não ignorar falha de teste, GitHub, leads ou deploy.
- Não criar conteúdo oculto para crawlers.
- Não bloquear Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot ou Google-Extended.
- Não alterar Cloudflare rotineiramente.
- Na dúvida factual, metodológica, legal, de segurança ou de licenciamento, interromper e explicar.
```

- [ ] **Step 2: Capture the returned automation identifier**

Expected result:

```text
Automation created successfully with a generated id.
```

Record that identifier for Tasks 3 and 4.

### Task 3: Verify persisted automation state

**Files:**
- Inspect: `$CODEX_HOME/automations/publicar-pacote-semanal-de-autoridade-seo-e-ia/automation.toml`

- [ ] **Step 1: View the automation through the Codex automation capability**

Use view mode with the generated identifier.

Expected:

- name is `Publicar pacote semanal de autoridade SEO e IA`;
- status is `ACTIVE`;
- schedule is weekly on Monday at 08:00;
- execution is local against the Blog_de_IA project.

- [ ] **Step 2: Verify the persisted TOML**

Run:

```bash
rg -n '^(id|name|status|rrule|model|reasoning_effort|execution_environment) =' \
  "$CODEX_HOME/automations/publicar-pacote-semanal-de-autoridade-seo-e-ia/automation.toml"
```

Expected values:

```text
name = "Publicar pacote semanal de autoridade SEO e IA"
status = "ACTIVE"
rrule = "RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=8;BYMINUTE=0"
model = "gpt-5.6-terra"
reasoning_effort = "high"
execution_environment = "local"
```

- [ ] **Step 3: Verify critical prompt contracts**

Run:

```bash
rg -n 'pacote semanal|pesquisa original|private-downloads|npm run validate|./scripts/deploy.sh|git push|no-store|30, 60 e 90 dias' \
  "$CODEX_HOME/automations/publicar-pacote-semanal-de-autoridade-seo-e-ia/automation.toml"
```

Expected: every required contract is present in the persisted prompt.

- [ ] **Step 4: Confirm no duplicate was created**

Run:

```bash
rg -l 'name = "Publicar pacote semanal de autoridade SEO e IA"' \
  "$CODEX_HOME"/automations/*/automation.toml | wc -l
```

Expected:

```text
1
```

### Task 4: Publish the automation documentation and hand off

**Files:**
- Existing: `docs/superpowers/specs/2026-07-22-pacote-semanal-autoridade-seo-design.md`
- Existing: `docs/superpowers/plans/2026-07-22-pacote-semanal-autoridade-seo.md`

- [ ] **Step 1: Inspect repository state**

Run:

```bash
git status --short
git diff --check
```

Expected: only the plan document and known generated untracked Open Graph artifacts are visible; generated artifacts are not staged.

- [ ] **Step 2: Commit only the implementation plan**

Run:

```bash
git add docs/superpowers/plans/2026-07-22-pacote-semanal-autoridade-seo.md
git diff --cached --check
git commit -m "docs: plan weekly authority package automation"
```

Expected: one documentation file committed and no generated artifact staged.

- [ ] **Step 3: Push documentation safely**

Run:

```bash
git push git@github.com:TozatoRodrigo/blog_de_ia.git HEAD:codex/download-lead-capture
git push git@github.com:TozatoRodrigo/blog_de_ia.git HEAD:main
```

Expected: both refs point to the documentation commit. This documentation-only change does not require a production website deploy.

- [ ] **Step 4: Synchronize the canonical checkout**

In `/Users/rodrigodiastozato/Desktop/Blog_de_IA`, verify that no user changes will be overwritten, then fast-forward `main` to the same commit. Never reset or clean the checkout.

Expected:

- canonical checkout is clean apart from explicitly preserved user artifacts;
- canonical `main` equals remote `main`;
- future weekly runs can read the specification from the canonical checkout.

- [ ] **Step 5: Final report**

Report:

- automation name and identifier;
- active status;
- Monday 08:00 São Paulo schedule;
- complete weekly package scope;
- fail-closed behavior;
- production method;
- relationship with the daily newsletter task;
- documentation commit and GitHub synchronization;
- next expected execution date and time.
