---
title: "Pesquisa: quais controles oficiais aparecem na gestão de custo de agentes de IA?"
seoTitle: "Pesquisa sobre custo de agentes de IA e controles de orçamento"
description: "Auditoria reproduzível de oito páginas oficiais sobre medição, atribuição, limites e reconciliação de custos em sistemas de agentes."
datePublished: "2026-09-10"
dateModified: "2026-09-10"
tags: ["agentes de IA", "pesquisa", "FinOps", "custo de IA", "observabilidade"]
alternateSlug: "research-ai-agent-cost-management"
cluster: agents
isHub: false
downloads:
  - label: "Baixar ledger de orçamento por tarefa"
    href: "/downloads/orcamento-custo-agente-ia.csv"
    format: "CSV"
sources:
  - name: "S1 — OpenAI Production best practices"
    url: "https://developers.openai.com/api/docs/guides/production-best-practices"
  - name: "S2 — OpenAI Usage and Costs API reference"
    url: "https://developers.openai.com/api/reference/python/resources/admin/subresources/organization/subresources/usage"
  - name: "S3 — Anthropic Prompt caching"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
  - name: "S4 — Google Gemini Enterprise Agent Platform pricing"
    url: "https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing"
  - name: "S5 — AWS Amazon Bedrock pricing"
    url: "https://aws.amazon.com/bedrock/pricing/"
  - name: "S6 — Microsoft Foundry Plan and manage costs"
    url: "https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs"
  - name: "S7 — Microsoft Foundry Agent Service FAQ"
    url: "https://learn.microsoft.com/en-us/azure/foundry-classic/agents/faq"
  - name: "S8 — OpenTelemetry GenAI attributes"
    url: "https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/"
draft: false
---

Esta pesquisa auditou oito páginas oficiais para responder uma pergunta operacional: **quais controles de custo uma equipe consegue encontrar explicitamente na documentação de plataformas e padrões usados por agentes de IA?** O resultado não é uma taxa de mercado, uma comparação de fornecedores ou uma medição de eficiência. É um diagnóstico do corpus selecionado, coletado em 10 de setembro de 2026.

A principal assimetria foi clara: todas as páginas mencionam algum sinal de uso ou cobrança, mas apenas duas descrevem controle de orçamento/alerta no próprio material auditado e apenas duas explicam reconciliação com uma fonte financeira. Para uma equipe, isso significa que observar tokens não é o mesmo que controlar custo; a camada de atribuição e decisão precisa existir no produto.

O [guia sobre custo de agentes de IA](/guias/custo-agentes-de-ia/) transforma o resultado em método. O [ledger protegido de orçamento por tarefa](/downloads/orcamento-custo-agente-ia.csv) transforma os controles em campos preenchíveis.

## Pergunta e objetivo

**Pergunta:** quais controles de medição, atribuição, limite, otimização e reconciliação aparecem explicitamente em páginas oficiais sobre custo, uso, agentes e instrumentação?

**Objetivo:** identificar a superfície mínima que uma equipe precisa completar por conta própria quando a documentação do provedor mostra uso, mas não mostra custo por tarefa concluída.

## Universo e data da coleta

O universo foi composto por oito URLs públicas oficiais, escolhidas porque cobrem quatro ângulos: operação e custo de API, cobrança de plataformas de agentes, componentes de infraestrutura e convenções de telemetria. A unidade de análise foi a página ou referência indicada, não o fornecedor.

| ID | Documento auditado | Ângulo | Data consultada |
| --- | --- | --- | --- |
| S1 | [OpenAI Production best practices](https://developers.openai.com/api/docs/guides/production-best-practices) | estimativa, monitoramento e redução de custo | 2026-09-10 |
| S2 | [OpenAI Usage and Costs API](https://developers.openai.com/api/reference/python/resources/admin/subresources/organization/subresources/usage) | uso por categoria e custos | 2026-09-10 |
| S3 | [Anthropic Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | decomposição de tokens e cache | 2026-09-10 |
| S4 | [Google Agent Platform pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) | modelos, compute, memória e operações | 2026-09-10 |
| S5 | [AWS Bedrock pricing](https://aws.amazon.com/bedrock/pricing/) | tokens, ferramentas e opções de cobrança | 2026-09-10 |
| S6 | [Microsoft Foundry — manage costs](https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs) | custo, orçamento, estimativa e fatura | 2026-09-10 |
| S7 | [Microsoft Foundry Agent Service FAQ](https://learn.microsoft.com/en-us/azure/foundry-classic/agents/faq) | cobrança por agente e ferramentas | 2026-09-10 |
| S8 | [OpenTelemetry GenAI attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/) | convenções de tokens, workflow e ferramentas | 2026-09-10 |

## Critérios de inclusão e exclusão

Incluí páginas oficiais disponíveis sem autenticação que descreviam preços, uso, custos, agentes, ferramentas, telemetria ou reconciliação financeira. Incluí uma convenção técnica quando ela definia atributos diretamente úteis para atribuição de custo.

Excluí artigos de fornecedores de observabilidade, calculadoras comerciais, posts de consultoria, discussões comunitárias, páginas de resultados de busca e documentos cujo foco principal fosse apenas marketing. Não usei Search Console, Ubersuggest, dados de clientes, faturas ou telemetria privada.

## Protocolo de codificação

Cada controle recebeu `1` somente quando havia uma menção explícita na página auditada ou um mecanismo diretamente descrito nela. Recebeu `0` quando o controle não apareceu no texto consultado. `0` não significa que o produto não possua a capacidade; significa apenas que ela não foi encontrada sob este protocolo.

Os seis controles foram:

- **U — uso:** tokens, requests, segundos, operações ou outra unidade de consumo.
- **C — componentes:** dois ou mais componentes cobrados além do modelo, como compute, memória, sessão, ferramenta ou armazenamento.
- **A — atribuição:** projeto, recurso, agente, workflow, trace ou identificador que permite separar consumo.
- **B — budget:** orçamento, quota, alerta, threshold, forecast ou ação de contenção descrita na mesma fonte.
- **O — otimização:** cache, batch, troca de modelo, throughput ou outra alavanca de custo explicitamente documentada.
- **R — reconciliação:** instrução para comparar uso/estimativa com medidor, fatura ou fonte financeira oficial.

## Dados para reprodução

| ID | U | C | A | B | O | R | Evidência resumida |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | --- |
| S1 | 1 | 0 | 0 | 1 | 1 | 0 | tokens, dashboard e threshold de notificação; modelos menores e menos tokens como alavancas |
| S2 | 1 | 1 | 1 | 0 | 0 | 1 | endpoints de uso/custos, categorias e project IDs; Costs para reconciliação de invoice |
| S3 | 1 | 0 | 0 | 0 | 1 | 0 | input, cache creation e cache read; cálculo de total de input e prompt caching |
| S4 | 1 | 1 | 0 | 0 | 1 | 0 | tokens, compute, memória, sessões e operações; batch e throughput provisionado |
| S5 | 1 | 1 | 0 | 0 | 1 | 0 | input/output tokens, prompt optimization e modelos/tier de cobrança |
| S6 | 1 | 1 | 1 | 1 | 1 | 1 | meters, projects/agents, budgets/forecast, troca de modelo e invoice source of truth |
| S7 | 1 | 1 | 1 | 0 | 0 | 0 | inferência por agente, Code Interpreter por sessão e file search por storage |
| S8 | 1 | 1 | 1 | 0 | 0 | 0 | atributos de tokens, workflow, operation e tool; correlação por trace é responsabilidade da instrumentação |

O método de cálculo foi soma simples por coluna: `controles com 1 / 8 documentos`. Os resultados observados são:

| Controle | Resultado observado |
| --- | ---: |
| Uso (U) | 8/8 |
| Componentes (C) | 6/8 |
| Atribuição (A) | 4/8 |
| Budget (B) | 2/8 |
| Otimização (O) | 5/8 |
| Reconciliação (R) | 2/8 |

## Resultados observados

### Uso é universal no corpus

Os oito documentos mostram alguma unidade de consumo. Isso inclui tokens, requests, sessões, operações, compute ou armazenamento. A consequência é positiva e limitada: uma equipe normalmente consegue começar com sinais de uso. O sinal não resolve como ligar duas chamadas e uma ferramenta à mesma tarefa, nem como classificar a tarefa como sucesso.

### Componentes aparecem, mas não com o mesmo vocabulário

Seis documentos descrevem dois ou mais componentes. A [página do Google](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing), por exemplo, separa compute, memória, sessões e operações. A FAQ do [Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry-classic/agents/faq) separa inferência, Code Interpreter e armazenamento vetorial. A [página da AWS](https://aws.amazon.com/bedrock/pricing/) organiza tarifas por modelo e modalidade, mas a decomposição varia por serviço.

O resultado sustenta uma regra de modelagem: não crie uma coluna única chamada `token_cost` e trate-a como custo total. Mantenha parcelas para modelo, ferramenta, recuperação, armazenamento, observabilidade e revisão quando elas forem relevantes.

### Atribuição exige uma camada adicional

Quatro fontes oferecem algum ponto de atribuição ou correlação: Usage/Costs da OpenAI, recursos e agentes no Foundry, cobrança por agente na FAQ do Foundry e atributos de workflow/operation/tool no OpenTelemetry. Mesmo nesses casos, a documentação não define um ledger universal de custo por tarefa concluída.

Essa é a lacuna que o template deste pacote cobre. Ele não tenta substituir a instrumentação do provedor; cria uma superfície comum para juntar uso, tarifa, resultado, orçamento e decisão.

### Budget foi menos frequente que otimização

Somente S1 e S6 receberam `1` para budget. A documentação de produção da OpenAI descreve threshold de notificação e monitoramento. O [Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs) descreve análise, budgets, forecasts e permissões de Cost Management. O restante do corpus explica preços ou alavancas, mas não apresenta na mesma página um orçamento operacional com ação de contenção.

Isso não prova ausência de quota ou hard cap. Prova que uma equipe não deve presumir a existência de um limite por run só porque consegue ver preço por token.

### Reconciliação apareceu em duas fontes

S2 e S6 explicitam a ponte entre uso e finanças. A Usage API da OpenAI separa custos e observa que o endpoint de custos é a referência para reconciliação. O Foundry diz para usar medidores e fatura como fonte de verdade. Para o restante do corpus, a pesquisa não encontrou uma instrução equivalente na página auditada.

## Observado versus inferido

**Observado:** o corpus menciona sinais de uso em 8/8; seis páginas descrevem múltiplos componentes; budget e reconciliação aparecem em 2/8 cada.

**Inferência editorial:** a equipe deveria construir o ledger e os limites no nível da aplicação mesmo quando o provedor oferece dashboard. Essa recomendação não é um resultado estatístico; é uma implicação prática da diferença entre uso documentado e decisão de tarefa.

## Limitações

O corpus é pequeno, selecionado e dependente da data. Páginas oficiais mudam, podem apontar para documentação complementar e podem oferecer controles em produtos ou contratos que não aparecem na página auditada. A codificação binária perde nuance e não mede facilidade, preço, qualidade, disponibilidade ou segurança. Não auditamos contas reais, faturas, latência, volume de agentes ou retorno financeiro.

Não compare os percentuais como ranking de fornecedores. Use-os para perguntar quais campos ainda faltam no seu sistema. Para aplicar a leitura, volte ao [guia de custo de agentes de IA](/guias/custo-agentes-de-ia/) e preencha o [ledger bilíngue protegido](/downloads/orcamento-custo-agente-ia.csv) com dados autorizados e sem PII.
