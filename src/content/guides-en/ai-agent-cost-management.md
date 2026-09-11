---
title: "AI agent cost management: cost per task, budgets and scale"
seoTitle: "AI agent cost management: FinOps and budget guide"
description: "Learn how to measure cost per task, set budget limits and decide when an AI agent is ready to scale."
datePublished: "2026-09-10"
dateModified: "2026-09-10"
tags: ["AI agents", "AI FinOps", "AI cost", "observability", "product management"]
alternateSlug: "custo-agentes-de-ia"
cluster: agents
isHub: false
downloads:
  - label: "Download the task budget ledger"
    href: "/downloads/ai-agent-cost-budget.csv"
    format: "CSV"
faq:
  - question: "What is the right unit for measuring an AI agent's cost?"
    answer: "Start with cost per correctly completed task. Keep cost per run as well so you can investigate loops, retries and runs that end without an outcome."
  - question: "Should I control cost per token or per task?"
    answer: "Use tokens to explain and optimize the bill, but use completed tasks to decide whether the agent is economically viable. Tokens alone do not show quality, rework or human review."
  - question: "How do I set a budget limit for an AI agent?"
    answer: "Set layered limits for a call, run, workflow, agent and period. For each layer, decide whether the limit stops execution, requests approval or escalates to a person."
  - question: "Does a cheaper model always reduce cost?"
    answer: "No. A cheaper model can increase retries, tool calls, reviews and incomplete tasks. Compare cost per correct task with quality, latency and risk."
sources:
  - name: "OpenAI — Production best practices"
    url: "https://developers.openai.com/api/docs/guides/production-best-practices"
  - name: "OpenAI API — Usage and Costs reference"
    url: "https://developers.openai.com/api/reference/python/resources/admin/subresources/organization/subresources/usage"
  - name: "Anthropic — Prompt caching"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
  - name: "Google Cloud — Gemini Enterprise Agent Platform pricing"
    url: "https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing"
  - name: "AWS — Amazon Bedrock pricing"
    url: "https://aws.amazon.com/bedrock/pricing/"
  - name: "Microsoft Foundry — Plan and manage costs"
    url: "https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs"
  - name: "OpenTelemetry — GenAI attributes"
    url: "https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/"
draft: false
---

Sustainable AI agent economics are not defined by the price of one million tokens. They are defined by the cost of completing a correct, safe and useful task, including the model calls, tools, retries, storage, observability and human review that task requires. Tokens explain part of the bill; cost per task determines whether the product can scale.

This guide shows Product Managers, engineers, SREs, FinOps and governance teams how to create that unit without turning an estimate into a promise. The [AI agent operations guide](/en/guides/ai-agent-operations/) remains the operational pillar; this guide focuses on making cost measurable enough for model choices, limits and scale decisions.

## The short answer: track three numbers

Track three different numbers:

1. **Cost per run:** what one attempt cost, even when it failed or escalated.
2. **Cost per completed task:** total run cost divided by the number of tasks that reached the accepted outcome.
3. **Period cost:** what the workflow consumed in a window, split by agent, version, customer, environment and task type.

If a run costs US$0.012 and 85% of runs complete correctly, cost per completed task is about US$0.0141 before fixed costs. That is an illustration, not a market benchmark. Replace it with system data in the ledger. An agent that looks cheap per call can become expensive when it repeats actions, requires review or fails the outcome.

## What belongs in an agent's cost

The minimum model is:

```text
run cost = model + tools + retrieval + storage
           + observability + human review + retries
```

You do not need equal precision for every component on day one. You do need to declare the boundary. If the decision is “can we launch this agent?”, include every cost that changes with launch. If the decision is “which model is cheaper?”, isolate costs that remain constant so infrastructure is not incorrectly attributed to the model.

### A model is not an agent

A provider may charge for model input and output, while the agent also creates sessions, uses memory, calls code, searches documents, invokes paid APIs and runs several attempts. [Microsoft Foundry's agent service FAQ](https://learn.microsoft.com/en-us/azure/foundry-classic/agents/faq) separates inference, Code Interpreter sessions and vector storage. The current [Google Gemini Enterprise Agent Platform pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) also lists compute, memory, sessions, agent memory and operations as distinct components.

That decomposition changes the question. Instead of asking “what does the model cost?”, ask “which resources does one task consume, and who can attribute them to that task?”.

### Cost per run versus cost per success

Record the final run status with a small taxonomy: completed, completed with review, escalated, blocked, system failure, quality failure and stopped by limit. Do not treat HTTP 200 as business success. The task needs a verifiable outcome, such as an authorized record created, a correct classification or an answer delivered with evidence.

If the workflow has several agents, keep a shared task ID and a step ID for each stage. The [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/) define attributes for operations, workflows, tools and input/output tokens. They do not calculate your invoice, but they make it easier to sum cost per run without depending on one vendor dashboard.

## 1. Define the economic unit before the dashboard

Write a sentence another person can audit:

> A task is complete when [observable outcome] happens within [quality, safety and time boundaries] without [prohibited actions].

Then declare:

- what event starts the task;
- which calls belong to it;
- whether human review is a normal cost or an exception;
- which tools have their own charges;
- which retries belong to the original attempt;
- how partial completion is classified;
- which period is used for budget and reconciliation.

Without this definition, a team can reduce tokens while increasing failures. The [AI agent evaluation guide](/en/guides/evaluate-ai-agents/) helps define the expected outcome and pass criteria; the cost ledger turns the same case into a financial unit.

## 2. Record enough signals to attribute cost

The minimum model-call record should include agent, version, task, model, timestamp, input tokens, output tokens, status, duration and run ID. For tools, record name, type, duration, status, quantity and external rate when available. For review, record duration and an approved internal rate; do not put emails, full prompts or customer data in the CSV.

Providers expose different signals. [OpenAI's production documentation recommends estimating token use, monitoring usage and setting a notification threshold](https://developers.openai.com/api/docs/guides/production-best-practices). The [OpenAI Usage API reference](https://developers.openai.com/api/reference/python/resources/admin/subresources/organization/subresources/usage) separates usage and cost endpoints. [Anthropic's prompt-caching documentation](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) shows that normal input, cache creation and cache reads must be combined correctly to interpret total input.

Keep three concepts separate:

1. **Observed usage:** tokens, calls, seconds or operations returned by the provider.
2. **Applied rate:** the current price, tier, region, discount or commitment.
3. **Attributed cost:** the calculation connected to a task, agent or customer.

When your calculation differs from the invoice, treat the provider's financial record as the reconciliation source. [Microsoft Foundry advises using Cost Management meter data and service metrics to reconcile billing and treating invoice and meter records as the source of truth](https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs). Your ledger is an operational layer, not a replacement for the invoice.

## 3. Estimate with scenarios

Before releasing traffic, calculate three scenarios against the same task set:

| Scenario | What changes | Decision question |
| --- | --- | --- |
| Expected | volume, tokens, tools and median success | Does cost fit the value delivered by the task? |
| Operational P95 | larger context, more steps and plausible retries | Does the agent stay inside its limit when the path is difficult? |
| Controlled failure | unavailable tool, escalation and review | Is there a safe path without an open-ended loop or spend? |

Use real pilot data when available. Until there is traffic, label numbers as hypotheses rather than benchmarks. The protected ledger includes fields for volume, tokens, calls, rates, retries and review; it has no formulas so each assumption can be checked before being automated.

## 4. Set layered limits

A single monthly budget detects the problem too late. Prefer graduated limits.

### Call limit

Set maximum tokens, time and tool budget for one call. When the limit is reached, reduce context, stop or request an explicit decision. The goal is to prevent an abnormal step from becoming an endless run.

### Run limit

Set maximum steps, retries and estimated cost for one task. The agent should stop trying when the budget no longer justifies another action. For external actions, the safe behavior may be escalation rather than repetition.

### Workflow and agent limit

Set a ceiling per workflow, agent, environment and period. Separate development, staging and production; an exploratory test should not consume the same budget as a consequential operation.

### Period limit

Use alerts and budgets to detect a trend, but do not assume that an alert interrupts the current request. The provider's official documentation should tell you whether a control is observation, quota, budget, hard cap or notification. Record the expected action in the ledger: alert, block, approval, traffic reduction or tool disablement.

## 5. Reduce cost without destroying the outcome

Optimization comes after a minimum evaluation. The most useful levers are:

- **Task-based routing:** use a stronger model for high-risk cases and a smaller one for simple tasks, comparing cost per success rather than token price alone. [OpenAI's production guidance](https://developers.openai.com/api/docs/guides/production-best-practices) describes this trade-off.
- **Smaller context:** remove redundant instructions and documents, compact history and limit retrieval to what the task needs.
- **Caching:** cache repeated prefixes and record cache creation and reads separately. Caching can lower input cost, but it has windows, minimums and its own rates.
- **Batch or commitment:** use asynchronous processing, batch or committed capacity only when volume and latency allow it. The [Google pricing page](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) shows that batch and provisioned throughput are different billing choices; this is not universal.
- **Cause-based retries:** define which errors can retry, how many times and with what backoff. Retrying a non-idempotent action is both cost and risk.
- **Bounded tools:** do not make the model choose among dozens of indistinct tools. Clear contracts reduce unnecessary calls and improve attribution.

Do not optimize one metric in isolation. The gate should compare correct task outcome, safe action, latency, cost per success, escalation and incidents. For a material implementation change, use the [AI agent evaluation template](/en/guides/ai-agent-evaluation-template/) before increasing traffic.

## 6. Reconcile the ledger with the invoice

Once per period:

1. freeze the rate table used in the calculation;
2. sum usage by provider, project, agent, model and environment;
3. compare it with the invoice and official meters;
4. explain rounding, discount, region, storage and fixed-charge differences;
5. update attributed cost per task without deleting observed values;
6. record who reviewed the result and when.

The ledger should not pretend to have precision that the invoice does not provide. Round for presentation, retain the original unit and label estimates. If a component cannot be attributed reliably, classify it as shared cost and document the allocation method.

## What this package's research found

The original research audited eight official pages and found an important asymmetry: usage signals appear often, while budget controls and financial reconciliation appear on fewer pages. Read the [full matrix and coding protocol](/en/guides/research-ai-agent-cost-management/) before generalizing the result. The practical conclusion is to start with a ledger and a limit, not with a model switch based only on a price table.

## Frequently asked questions

### Which metric belongs in the roadmap?

Use cost per correctly completed task with quality and volume. Cost per token is an engineering metric; cost per success is a product metric. Keep both so decisions are not blind.

### When should fixed cost enter cost per task?

Include fixed cost when it changes because of the decision or when you need total economics. Keep it separate in the ledger: variable cost per task, period fixed cost and allocated total cost. That makes the calculation reusable when volume changes.

### How should human review be handled?

Include review when it is a normal part of the flow. If it only happens for exceptions, record the escalation rate and expected cost. Do not hide review to make the agent look autonomous.

### Is the template a calculator?

No. It is a budget and attribution ledger without macros, scripts or dangerous formulas. Its purpose is to make assumptions and evidence visible; a team can later import the fields into an approved spreadsheet.

The protected [AI agent cost budget ledger](/downloads/ai-agent-cost-budget.csv) closes the loop between this guide, the research and the scale decision. For risk, connect it to the [AI risk matrix](/en/guides/ai-risk-matrix/) and [AI governance guide](/en/guides/ai-governance/). For cost incidents or loops, use the [AI agent incident response runbook](/en/guides/ai-agent-incident-response/).
