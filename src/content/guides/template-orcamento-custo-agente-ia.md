---
title: "Template de orçamento e custo por tarefa de agente de IA"
seoTitle: "Template de orçamento para agentes de IA"
description: "Registre uso, custo por tarefa, limites, revisão humana e decisão de escala de um agente de IA em um ledger simples."
datePublished: "2026-09-10"
dateModified: "2026-09-10"
tags: ["agentes de IA", "FinOps", "template", "custo de IA"]
alternateSlug: "ai-agent-cost-budget-template"
cluster: agents
isHub: false
downloads:
  - label: "Baixar template de orçamento"
    href: "/downloads/orcamento-custo-agente-ia.csv"
    format: "CSV"
sources:
  - name: "Pesquisa do Produto com IA — controles de custo"
    url: "https://produtocomia.com.br/guias/pesquisa-custo-agentes-de-ia/"
  - name: "OpenTelemetry — GenAI attributes"
    url: "https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/"
draft: false
---

Este template organiza o custo de um agente no nível em que a decisão acontece: a tarefa. Ele separa uso observado, tarifas, ferramentas, retries, revisão humana, custo por sucesso e limite do período. Não é uma calculadora automática e não substitui a fatura do provedor.

## Como usar

1. Copie uma versão para um ambiente autorizado e mantenha o arquivo original como modelo.
2. Preencha uma linha por agente e fluxo no período escolhido; use um identificador de tarefa ou agregação que outra pessoa consiga consultar.
3. Registre números observados e hipóteses em campos diferentes; não transforme estimativa em resultado real.
4. Compare custo por execução com custo por tarefa concluída e registre a taxa de sucesso.
5. Defina a decisão: manter, calibrar, limitar, escalar ou bloquear.

## Campos essenciais

- **Uso:** tarefas esperadas, concluídas, chamadas, tokens e retries.
- **Custo variável:** modelo, ferramentas, revisão e observabilidade.
- **Decisão:** orçamento do período, custo por sucesso, evidência, responsável e próxima revisão.

A linha `EXAMPLE-001` é fictícia e serve apenas para mostrar o formato. Não coloque prompts completos, e-mails, tokens, segredos ou dados pessoais reais. Para a metodologia, leia a [pesquisa sobre controles oficiais de custo](/guias/pesquisa-custo-agentes-de-ia/). Para interpretar os números, use o [guia de custo por tarefa](/guias/custo-agentes-de-ia/).
