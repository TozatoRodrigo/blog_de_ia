---
title: "Research: which official controls appear in AI agent cost management?"
seoTitle: "Research on AI agent cost and budget controls"
description: "A reproducible audit of eight official pages covering measurement, attribution, limits and financial reconciliation for agent systems."
datePublished: "2026-09-10"
dateModified: "2026-09-10"
tags: ["AI agents", "research", "AI FinOps", "AI cost", "observability"]
alternateSlug: "pesquisa-custo-agentes-de-ia"
cluster: agents
isHub: false
downloads:
  - label: "Download the task budget ledger"
    href: "/downloads/ai-agent-cost-budget.csv"
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

This research audited eight official pages to answer an operational question: **which cost controls can a team find explicitly in documentation for platforms and standards used by AI agents?** The result is not a market rate, a vendor ranking or an efficiency benchmark. It is a diagnosis of the selected corpus, collected on September 10, 2026.

The main asymmetry was clear: every page mentions some usage or billing signal, but only two describe a budget or alert control in the audited material and only two explain reconciliation with a financial source. For a team, that means observing tokens is not the same as controlling cost; attribution and decision layers still need to exist in the product.

The [AI agent cost management guide](/en/guides/ai-agent-cost-management/) turns the finding into a method. The protected [task budget ledger](/downloads/ai-agent-cost-budget.csv) turns the controls into fields a team can fill in.

## Question and objective

**Question:** which measurement, attribution, limit, optimization and reconciliation controls appear explicitly in official pages about cost, usage, agents and instrumentation?

**Objective:** identify the minimum surface a team must complete itself when provider documentation shows usage but not cost per completed task.

## Universe and collection date

The universe contained eight public official URLs covering four angles: API cost and operations, agent-platform billing, infrastructure components and telemetry conventions. The unit of analysis was the page or referenced document, not the vendor.

| ID | Audited document | Angle | Collected |
| --- | --- | --- | --- |
| S1 | [OpenAI Production best practices](https://developers.openai.com/api/docs/guides/production-best-practices) | estimation, monitoring and cost reduction | 2026-09-10 |
| S2 | [OpenAI Usage and Costs API](https://developers.openai.com/api/reference/python/resources/admin/subresources/organization/subresources/usage) | usage categories and costs | 2026-09-10 |
| S3 | [Anthropic Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | token decomposition and caching | 2026-09-10 |
| S4 | [Google Agent Platform pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) | models, compute, memory and operations | 2026-09-10 |
| S5 | [AWS Bedrock pricing](https://aws.amazon.com/bedrock/pricing/) | tokens, tools and billing options | 2026-09-10 |
| S6 | [Microsoft Foundry — manage costs](https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs) | cost, budget, estimates and invoice | 2026-09-10 |
| S7 | [Microsoft Foundry Agent Service FAQ](https://learn.microsoft.com/en-us/azure/foundry-classic/agents/faq) | agent and tool billing | 2026-09-10 |
| S8 | [OpenTelemetry GenAI attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/) | token, workflow and tool telemetry | 2026-09-10 |

## Inclusion and exclusion criteria

We included public official pages without authentication that described prices, usage, costs, agents, tools, telemetry or financial reconciliation. We included a technical convention when it defined attributes directly useful for cost attribution.

We excluded observability vendors, commercial calculators, consulting posts, community discussions, search-result pages and material whose primary purpose was marketing. No Search Console, Ubersuggest, customer data, invoices or private telemetry were used.

## Coding protocol

Each control received `1` only when the audited page explicitly mentioned the control or a directly described operational equivalent. It received `0` when the control was not found in the consulted text. `0` does not mean the product lacks the capability; it means the capability was not found under this protocol.

The six controls were:

- **U — usage:** tokens, requests, seconds, operations or another consumption unit.
- **C — components:** two or more billable components beyond the model, such as compute, memory, session, tool or storage.
- **A — attribution:** a project, resource, agent, workflow, trace or identifier that separates consumption.
- **B — budget:** a budget, quota, alert, threshold, forecast or containment action described in the same source.
- **O — optimization:** caching, batching, model switching, throughput or another cost lever explicitly documented.
- **R — reconciliation:** an instruction to compare usage or estimates with a meter, invoice or official financial source.

## Reproducible data

| ID | U | C | A | B | O | R | Evidence summary |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | --- |
| S1 | 1 | 0 | 0 | 1 | 1 | 0 | tokens, dashboard and notification threshold; smaller models and fewer tokens as levers |
| S2 | 1 | 1 | 1 | 0 | 0 | 1 | usage/cost endpoints, categories and project IDs; Costs for invoice reconciliation |
| S3 | 1 | 0 | 0 | 0 | 1 | 0 | input, cache creation and cache reads; total-input calculation and prompt caching |
| S4 | 1 | 1 | 0 | 0 | 1 | 0 | tokens, compute, memory, sessions and operations; batch and provisioned throughput |
| S5 | 1 | 1 | 0 | 0 | 1 | 0 | input/output tokens, prompt optimization and model/tier billing |
| S6 | 1 | 1 | 1 | 1 | 1 | 1 | meters, projects/agents, budgets/forecast, model switching and invoice source of truth |
| S7 | 1 | 1 | 1 | 0 | 0 | 0 | inference per agent, Code Interpreter per session and file-search storage |
| S8 | 1 | 1 | 1 | 0 | 0 | 0 | token, workflow, operation and tool attributes; trace correlation is left to instrumentation |

The calculation was a simple column sum: `controls with 1 / 8 documents`. Observed results:

| Control | Observed result |
| --- | ---: |
| Usage (U) | 8/8 |
| Components (C) | 6/8 |
| Attribution (A) | 4/8 |
| Budget (B) | 2/8 |
| Optimization (O) | 5/8 |
| Reconciliation (R) | 2/8 |

## Observed results

### Usage is universal in the corpus

All eight documents expose some consumption unit. This includes tokens, requests, sessions, operations, compute or storage. The implication is useful but limited: a team can usually start with usage signals. Usage does not explain how two model calls and one tool belong to the same task, or whether that task succeeded.

### Components appear with different vocabularies

Six documents describe two or more components. The [Google page](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing), for example, separates compute, memory, sessions and operations. The [Microsoft Foundry FAQ](https://learn.microsoft.com/en-us/azure/foundry-classic/agents/faq) separates inference, Code Interpreter and vector storage. The [AWS pricing page](https://aws.amazon.com/bedrock/pricing/) organizes rates by model and mode, but the decomposition varies by service.

The modeling rule is straightforward: do not create one `token_cost` column and treat it as total cost. Keep separate parcels for model, tool, retrieval, storage, observability and review when they matter to the decision.

### Attribution needs another layer

Four sources expose an attribution or correlation point: OpenAI Usage/Costs, Foundry resources and agents, Foundry's agent billing FAQ and OpenTelemetry workflow/operation/tool attributes. Even those sources do not define a universal ledger for cost per completed task.

That is the gap covered by this package's template. It does not replace provider instrumentation; it creates a common surface for joining usage, rate, outcome, budget and decision.

### Budgets were less frequent than optimization

Only S1 and S6 received `1` for budget. OpenAI's production documentation describes a notification threshold and usage monitoring. [Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs) describes analysis, budgets, forecasts and Cost Management permissions. The rest of the corpus explains prices or levers, but does not present an operational budget with a containment action on the audited page.

This does not prove that a quota or hard cap is absent. It proves that a team should not assume a per-run limit exists merely because it can see a per-token price.

### Reconciliation appeared in two sources

S2 and S6 make the bridge between usage and finance explicit. OpenAI's Usage API separates costs and identifies the Costs endpoint as the reconciliation reference. Foundry says to use meters and invoice data as the source of truth. For the rest of the corpus, the research did not find an equivalent instruction on the audited page.

## Observed versus inferred

**Observed:** the corpus mentions usage signals in 8/8; six pages describe multiple components; budgets and reconciliation each appear in 2/8.

**Editorial inference:** teams should build the ledger and limits at the application layer even when the provider offers a dashboard. This recommendation is not a statistical result; it is a practical implication of the difference between documented usage and task-level decisions.

## Limitations

The corpus is small, selected and date-dependent. Official pages change, link to complementary documentation and may offer controls in products or contracts that are absent from the audited page. Binary coding loses nuance and does not measure ease, price, quality, availability or security. We did not audit real accounts, invoices, latency, agent volume or financial return.

Do not read the percentages as a vendor ranking. Use them to ask which fields are missing from your system. Apply the finding with the [AI agent cost management guide](/en/guides/ai-agent-cost-management/) and fill the protected [bilingual ledger](/downloads/ai-agent-cost-budget.csv) with authorized data and no PII.
