---
title: "Research: which official controls appear in AI agent recovery?"
seoTitle: "Research on AI agent incident response"
description: "A reproducible audit of eight official documents on detection, containment, resumption, fallback and approval in AI agent recovery."
datePublished: "2026-08-17"
dateModified: "2026-08-17"
tags: ["research", "AI agents", "incidents", "rollback", "operations"]
alternateSlug: "pesquisa-resposta-incidentes-agentes-de-ia"
cluster: agents
sources:
  - name: "AWS Agentic AI Lens — behavior versioning and rollback"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops02-bp03.html"
  - name: "AWS Agentic AI Lens — validation and approval workflows"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops06-bp03.html"
  - name: "AWS Agentic AI Lens — checkpoint-based recovery"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel03-bp03.html"
  - name: "AWS Agentic AI Lens — fallback and graceful degradation"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel04-bp03.html"
  - name: "AWS Prescriptive Guidance — incident response and business continuity"
    url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-incident-response.html"
  - name: "OpenAI Agents SDK — human-in-the-loop"
    url: "https://openai.github.io/openai-agents-python/human_in_the_loop/"
  - name: "Microsoft Foundry — agent tracing"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept"
  - name: "Google Cloud — Agent Runtime monitoring"
    url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/monitoring"
draft: false
---

This research found five explicit controls across eight official documents: detection/telemetry in **6/8**, containment or capability reduction in **5/8**, state or behavior recovery in **5/8**, fallback/degradation in **2/8**, and validation, approval or rollback in **5/8**. The figures describe the selected documentation; they are not a vendor ranking, incident rate or maturity score.

## Question and objective

**Question:** which recovery mechanisms appear explicitly in official technical guidance for AI agents?

**Objective:** turn the gap observed in the first agent-operations study — limited joint coverage of incidents, change and rollback — into a narrower matrix about recovery. The result supplies criteria for the [AI agent incident response guide](/en/guides/ai-agent-incident-response/) and the [private runbook](/downloads/ai-agent-incident-runbook.csv).

## Universe and collection date

The universe contains eight public pages collected and manually coded on **August 17, 2026**. It includes four pages from the AWS Agentic AI Lens, one AWS prescriptive guidance page, one OpenAI Agents SDK page, one Microsoft Foundry page and one Google Agent Runtime page. The unit of analysis is the page, not the provider.

### Inclusion criteria

- an official publication from the responsible vendor, agency or project;
- publicly accessible on the collection date;
- an explicit reference to agents, tool execution, operations, observability, approval, recovery, fallback or rollback;
- enough specificity to code at least one of the five categories.

### Exclusion criteria

- third-party blog posts, news, community discussions and marketing pages without operational guidance;
- duplicate URLs or translated copies of the same page;
- claims that a control would be desirable when the page did not describe the mechanism;
- inferences based only on the fact that a platform has a related product.

## Coding protocol

Each page received `1` when it explicitly mentioned the control or an operational equivalent. It received `0` when the control did not appear in the reviewed text. The conservative rules were:

1. **Detection/telemetry:** metrics, traces, logs, alerts or observability to detect behavior outside a boundary.
2. **Containment:** pause, rejection, shutdown, traffic reduction, safe mode, blocking or limitation that reduces the next effect.
3. **Recovery:** checkpoint, resume, idempotency, behavioral rollback, service recovery or state restoration.
4. **Fallback/degradation:** an ordered alternative, partial response, manual team or continuity path explicitly used when the primary path fails.
5. **Validation/approval/rollback:** human approval, evaluation, failure testing, controlled promotion or rollback defined as a change gate.

A page could receive `1` in more than one column. “Not mentioned” does not mean the provider lacks the control elsewhere. The coding measures textual presence, not implementation quality.

## Observed data matrix

| Document | Detection | Containment | Recovery | Fallback | Validation/approval/rollback |
| --- | ---: | ---: | ---: | ---: | ---: |
| AWS — behavior versioning and rollback | 1 | 1 | 1 | 0 | 1 |
| AWS — validation and approval workflows | 1 | 1 | 1 | 0 | 1 |
| AWS — checkpoint-based recovery | 0 | 0 | 1 | 0 | 0 |
| AWS — fallback and graceful degradation | 1 | 1 | 0 | 1 | 1 |
| AWS — incident response and business continuity | 1 | 1 | 1 | 1 | 0 |
| OpenAI Agents SDK — human-in-the-loop | 0 | 1 | 1 | 0 | 1 |
| Microsoft Foundry — agent tracing | 1 | 0 | 0 | 0 | 1 |
| Google Agent Runtime — monitoring | 1 | 0 | 0 | 0 | 0 |
| **Pages with a mention** | **6/8** | **5/8** | **5/8** | **2/8** | **5/8** |

### Coded evidence by document

- **AWS behavior versioning and rollback:** explicitly covers versioning prompts, permissions and decision boundaries, a known-good baseline, staged rollout, impact metrics and tested rollback.
- **AWS validation and approval workflows:** explicitly covers risk-based validation, approval, evaluation gates, rollback for changes and periodic testing.
- **AWS checkpoint-based recovery:** explicitly covers persisted state, checkpoints, idempotency and resume; monitoring and fallback are not the page’s focus.
- **AWS fallback and graceful degradation:** explicitly covers health checks, ordered alternatives, degradation events and chaos testing; it does not describe undoing external effects.
- **AWS incident response and business continuity:** explicitly covers observability, emergency shutdown, manual/fallback continuity and recovery methods.
- **OpenAI Agents SDK human-in-the-loop:** explicitly covers pause, approval/rejection, state serialization and run resumption, plus a version marker for pending tasks.
- **Microsoft Foundry agent tracing:** explicitly covers inputs, outputs, tools, tokens, latency, errors and evaluation events; this page does not describe containment or rollback.
- **Google Agent Runtime monitoring:** explicitly covers metrics, response codes, queries and alerts; the audited page does not describe recovery or containment.

## How the numbers were calculated

For each column, I summed the `1` values and divided by eight. Detection was `6 ÷ 8 = 75%`; containment was `5 ÷ 8 = 62.5%`; recovery was `5 ÷ 8 = 62.5%`; fallback was `2 ÷ 8 = 25%`; and validation/approval/rollback was `5 ÷ 8 = 62.5%`. Percentages are another display of the same counts and are rounded to one decimal place when needed.

## Observed results

### Detection is more common than operational recovery

Six pages describe metrics, traces, logs or alerts. That helps locate a failure, but observing does not mean being able to stop the next effect or recover an already changed record. The Microsoft Foundry page, for example, documents traces with tools, latency, cost and evaluation; the Google page documents Agent Runtime metrics and alerts. Under this protocol, neither received `1` for recovery.

### Fallback is the least frequent control

Only two pages mention fallback/degradation within the reviewed text: the AWS guidance specific to collaborative workflows and the continuity guidance for agentic systems. This does not prove that the other documents lack alternatives. It shows that a team should not assume that retry or monitoring equals a continuity path.

### Recovery has more than one form

The five pages with recovery do not describe the same thing. They include behavioral rollback, checkpoint and idempotency, state resumption, service recovery and shutdown with continuity. That difference supports separating configuration restoration, execution continuation and compensation for external effects.

### Approval is not proof of reversibility

The OpenAI Agents SDK page shows how to pause a tool call and resume it after approval. That is an authorization control, not an undo. Likewise, release validation can reduce regression risk without proving that an external action can be reversed. The runbook therefore combines approval with effect evidence and a compensation path.

## Observed versus inferred

### Observed result

In the sample, detection/telemetry had the highest coverage, with 6 of 8 pages. Fallback/degradation had the lowest, with 2 of 8. Five of eight pages mentioned containment, recovery or validation/approval/rollback under the definitions above.

### Editorial inference

A team that starts with dashboards will likely find it easier to locate an incident than to decide whether to pause a tool, resume a checkpoint, restore a baseline or reconcile an external effect. That is why this package’s template uses separate fields for evidence, containment, recovery and compensation. This is a Produto com IA recommendation derived from the matrix, not a result measured in real incidents.

## Limitations

The universe is small, intentional and non-probabilistic. Four pages come from the same AWS collection, so it is inappropriate to compare vendors or generalize to the entire market. The selection also favors English documentation and pages discoverable through public search; another page could change the distribution.

This is a document audit, not executed-code research. We did not measure recovery time, failure rate, fallback quality, cost, availability, incidents or customer outcomes. Pages can change after collection. Reproducing the research means accessing the same URLs, recording the date, applying the definitions and rebuilding the matrix; it does not mean expecting the same numbers if official text changes.

## Conclusion

The most useful result is not an isolated percentage. It is the asymmetry: observability guidance is more common than explicit continuity guidance, and fallback appears infrequently. For an agent that acts on external systems, readiness must be tested in layers: detect, contain, recover state, handle the effect and validate restoration. The [full guide](/en/guides/ai-agent-incident-response/) applies that sequence; the [runbook](/downloads/ai-agent-incident-runbook.csv) makes the evidence ready for a readiness review.
