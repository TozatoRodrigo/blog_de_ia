---
title: "Research: which controls do official documents recommend for operating AI agents?"
seoTitle: "Research on AI agent operations in production"
description: "A reproducible audit of seven official documents covering observability, evaluation, metrics, human control and incidents in AI agents."
datePublished: "2026-08-10"
dateModified: "2026-08-10"
tags: ["research", "AI agents", "observability", "operations"]
alternateSlug: "pesquisa-operacao-agentes-de-ia"
cluster: agents
isHub: false
sources:
  - name: "OpenAI Agents SDK — Tracing"
    url: "https://openai.github.io/openai-agents-python/tracing/"
  - name: "AWS DevOps Agent — Production operations"
    url: "https://docs.aws.amazon.com/devopsagent/latest/userguide/working-with-devops-agent-production-operations-index.html"
  - name: "Google Cloud — Vertex AI Agent Engine overview"
    url: "https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview"
  - name: "Microsoft Foundry — Agent Monitoring Dashboard"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard"
  - name: "Microsoft Foundry — Tracing and data handling"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-data"
  - name: "NIST AI RMF Playbook"
    url: "https://airc.nist.gov/airmf-resources/playbook/"
  - name: "OpenTelemetry — GenAI semantic conventions"
    url: "https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/"
draft: false
---

In an audit of seven official documents, execution visibility appeared in every document; operational metrics in six; access control or human participation in six; quality evaluation in five; explicit tool telemetry in three; and an explicit connection between incidents, change and rollback in only two. This is a documentation snapshot, not a platform ranking or a measurement of real agent behavior.

This page describes Produto com IA’s original research. The [guide to operating agents in production](/en/guides/ai-agent-operations/) turns the findings into decisions and steps. The [private operations checklist](/downloads/ai-agent-operations-checklist.csv) turns the six controls into a review that teams can execute.

## Question and objective

**Question:** which operational controls appear explicitly and repeatedly in official documentation for platforms and standards that support agents in production?

**Objective:** identify a baseline that a team can verify before expanding an agent’s autonomy, separating controls that recur in the documentation from decisions that remain use-case specific.

We did not test a platform, run agents or collect people’s responses. The unit is a documentation page. That makes the study reproducible from public sources, but limits what can be concluded about effectiveness.

## Universe and collection date

The collection took place on **August 10, 2026**, using seven official documents maintained by six organizations. Microsoft appears twice because the dashboard and the trace-data page describe different operational controls. Including two pages from one vendor was intentional and is a declared limitation, not an attempt to balance vendors.

| ID | Included document | Why it entered |
|---|---|---|
| OAI | [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/) | Documents traces, tool calls, handoffs, guardrails and events within a run. |
| AWS | [AWS DevOps Agent — Production operations](https://docs.aws.amazon.com/devopsagent/latest/userguide/working-with-devops-agent-production-operations-index.html) | Describes detection, investigation, recovery, prevention and the relationship with changes. |
| GCP | [Vertex AI Agent Engine overview](https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview) | Documents production deployment, tracing, monitoring, logging, IAM and evaluation. |
| MS-M | [Microsoft Foundry Agent Monitoring Dashboard](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard) | Explicitly covers operational metrics, continuous evaluation, traces and access control. |
| MS-T | [Microsoft Foundry Tracing and Data Handling](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-data) | Explicitly covers trace content, tool calls, metadata and data protection. |
| NIST | [NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/) | Provides suggested actions for measurement, monitoring, incidents, human factors and improvement. |
| OTel | [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/) | Defines names and attributes for agents, operations, tools and token usage. |

### Inclusion criteria

We included an official document with an explicit reference to production, observability, tracing, evaluation, telemetry, access control, supervision, incident response or operational change. The document had to be publicly available at collection time.

### Exclusion criteria

We excluded third-party articles, opinion posts, pages without a named operational mechanism, duplicate pages for the same document and search results that could not be confirmed on the official page. Page age was not an exclusion criterion; the collection date is the reference point for repetition.

## Coding protocol

Each document received `yes` or `no` for six controls. “Yes” means the page names the control or an operational equivalent. “No” means the control did not appear explicitly in that document; it does not mean the platform lacks the capability.

1. **Execution visibility:** tracing, logs, steps or signals that reconstruct a run.
2. **Tool and action telemetry:** a tool call, action operation or attribute connecting the agent to an external effect.
3. **Quality evaluation:** evaluation, testing, quality metrics or outcome-based continuous improvement.
4. **Operational metrics:** latency, errors, usage, cost, success rate or equivalent production signals.
5. **Access and human control:** IAM/RBAC, guardrails, approval, human participation or governed access to telemetry.
6. **Incident, change and rollback:** incident response, recovery, prevention, versioning, deployment or reversal connected to operations.

The protocol was applied by manual reading on the same day. There was no statistical sampling, page-size weighting or subjective quality score. The result can be reproduced by opening the seven URLs, looking for the corresponding concepts and applying these definitions.

## Observed data matrix

| Document | Execution | Tools/actions | Evaluation | Metrics | Access/human | Incident/change/rollback |
|---|---|---|---|---|---|---|
| OAI | yes | yes | yes | no | yes | no |
| AWS | yes | no | yes | yes | yes | yes |
| GCP | yes | no | yes | yes | yes | no |
| MS-M | yes | no | yes | yes | yes | no |
| MS-T | yes | yes | no | yes | yes | no |
| NIST | yes | no | yes | yes | yes | yes |
| OTel | yes | yes | no | yes | no | no |
| **Total** | **7/7** | **3/7** | **5/7** | **6/7** | **6/7** | **2/7** |

### How the numbers were calculated

For each column, we counted the `yes` cells and divided by seven documents. For example, `3/7` for tools means three documents named tool or action telemetry in a way that met the criterion. The corresponding descriptive proportion is 42.9%, rounded to one decimal place. It is not an agent success rate.

## Observed results

The first result is the recurrence of execution visibility: all seven documents address traces, logs, monitoring or conventions as part of diagnosis. That supports a simple operational priority: without a run identity and version context, the team loses the ability to explain what happened.

The second is the difference between observing an execution and observing an action. Only three documents explicitly describe the bridge to tools or actions. This matters because an agent can produce plausible text and still change a system incorrectly. Tool telemetry should include authorization, outcome and error, with data minimization.

Evaluation and metrics appear in five and six documents. This shows that “monitoring” and “evaluation” recur, but it does not define what a correct task means for each product. An SLO needs a denominator, window, treatment of escalations, included latency and relevant cost.

Access or human control appears in six documents. This does not mean every action has human approval; the criterion also accepts IAM, RBAC, guardrails and control over who can read telemetry. The editorial inference is that autonomy needs both a technical boundary and a responsibility boundary.

Finally, only two documents explicitly connect operations with incidents, change and rollback. This is the main warning from the audit: adding tracing does not close the loop if the team lacks containment, versioning, rollback and post-incident learning.

## Observed versus inferred

### Observed result

- All seven documents mentioned a mechanism for execution visibility.
- Three named tool or action telemetry or conventions.
- Five named evaluations or outcome-based improvement.
- Six mentioned operational metrics.
- Six mentioned access control, guardrails or human participation.
- Two explicitly connected production to incidents, prevention, changes or recovery.

### Editorial inference

Produto com IA recommends this implementation order: reconstruct the run; record tools and effects; connect quality, latency and cost to the task outcome; then close the loop with control, incidents and reversible change. The matrix did not measure this order. It is an editorial recommendation derived from the combination of controls and the risk of acting without evidence.

## Limitations

The corpus is small and deliberate. It represents selected official documentation, not the whole market. Two documents are from Microsoft, some products have different scopes and pages may change after the collection date. The binary coding loses nuance: a “yes” does not measure depth, availability, price or ease of use.

We also did not assess whether a real implementation meets what the documentation describes. There is no benchmark, latency test, cost measurement, interview, respondent sample or incident dataset. It is not valid to conclude that one provider is better, that a control guarantees safety or that the percentages represent industry adoption.

To repeat the study, save the version or date of the seven pages, reopen the URLs, apply the six definitions without changing the universe and compare the matrices. If a source changes, record the change before recalculating. The private CSV uses the same six controls so a team can produce its own evidence for its agent.

## Conclusion

The research found a clear but incomplete baseline: visibility and metrics are common; tools, evaluation and control require local design; incidents, change and rollback are the least explicit connection. The opportunity is not another dashboard. It is connecting run evidence to decisions about quality, risk, cost and reversal.
