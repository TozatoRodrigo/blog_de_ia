---
title: "How to operate AI agents in production: observability, SLOs and incidents"
seoTitle: "AI agent operations in production: a practical guide"
description: "Learn how to operate AI agents with observability, proportionate SLOs, cost controls, incident response and reversible changes."
datePublished: "2026-08-10"
dateModified: "2026-08-17"
tags: ["AI agents", "observability", "operations", "SRE", "product management"]
alternateSlug: "operacao-de-agentes-de-ia"
cluster: agents
isHub: false
downloads:
  - label: "Download the agent operations checklist"
    href: "/downloads/ai-agent-operations-checklist.csv"
    format: "CSV"
faq:
  - question: "What does it mean to operate an AI agent in production?"
    answer: "It means keeping an agent observable, measurable, authorized and reversible after launch while tracking runs, tools, quality, cost, incidents and changes."
  - question: "Which SLO should I use for an AI agent?"
    answer: "There is no universal SLO. Define indicators and targets from the task outcome, failure impact, acceptable latency, cost and escalation needs of your use case."
  - question: "What should appear in an agent trace?"
    answer: "At minimum, a correlatable run with version, steps, tool calls, duration, errors, usage, outcome and escalation decision, with sensitive data minimized."
  - question: "How can I reduce the risk of an agent incident?"
    answer: "Limit permissions and execution, require approval for sensitive actions, detect anomalies, prepare containment and rollback, and turn each incident into an evaluation case and improvement."
sources:
  - name: "OpenAI Agents SDK"
    url: "https://openai.github.io/openai-agents-python/"
  - name: "OpenAI Agents SDK — Configuration and tracing"
    url: "https://openai.github.io/openai-agents-python/config/"
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

Operating an AI agent in production means being able to answer, for every run: **what the agent tried to do, with which version, using which tools, with what outcome, cost and risk — and how to stop or reverse it**. Error logs and an average latency number are not enough because behavior depends on context, model, tools, permissions and decisions that can vary from run to run.

This guide gives Product Managers, engineers, SREs and governance teams a practical baseline. It does not prescribe a universal SLO or suggest that a managed platform solves operations by itself. Start with a small, verifiable operational surface that is proportional to the agent’s impact.

When an execution has already failed or produced an unwanted effect, use the [AI agent incident response guide](/en/guides/ai-agent-incident-response/) to separate detection, containment, state recovery, compensation and rollback. This remains the pillar page for agent operations; the new guide goes deeper on the moment of crisis.

## In this guide

- the difference between observability, evaluation and governance;
- the six controls found in this week’s documentation research;
- how to choose signals and SLOs without turning tokens into the goal;
- how to design incident response and reversible changes;
- how to start in four stages and use the [original research on agent operations](/en/guides/research-ai-agent-operations/);
- how to apply the [private operations checklist](#operations-checklist-template).

## Operations is more than monitoring

There are three different questions:

1. **Observability:** what happened during a run?
2. **Evaluation:** did the behavior meet the expected outcome and safety boundaries?
3. **Governance:** who authorized the use, which risk was accepted and what happens when the operation fails?

A dashboard may show rising latency without explaining that the agent selected the wrong tool. An evaluation may show that responses are correct on a test set without showing that the deployed version now consumes twice as many tokens. A policy may require human approval without recording where that approval happened. Operations connects all three layers.

The [AI agents pillar guide](/en/guides/ai-agents/) explains system components and when an agent makes sense. This guide starts once real traffic exists or the team has decided that the agent may act in a consequential environment.

## What the research found

Produto com IA reviewed seven official documents on August 10, 2026. The unit of analysis was the document, not the vendor. A control received “yes” only when the source explicitly named the mechanism or an operational equivalent. The result is not a product-quality score; it shows which controls appear most often in the selected documentation.

| Observed control | Documents with an explicit mention | Operational reading |
|---|---:|---|
| Execution visibility | 7/7 | Traces, steps, logs or signals that reconstruct a run are the most consistent baseline. |
| Tool and action telemetry | 3/7 | Observing the answer is not enough; the bridge between decision and external effect must be visible. |
| Quality evaluation | 5/7 | Evaluation and continuous improvement appear often, but teams still need their own cases and criteria. |
| Operational metrics | 6/7 | Latency, errors, usage and production signals are common; cost per task still requires local modeling. |
| Access and human control | 6/7 | Permissions, RBAC, guardrails or human participation counterbalance autonomy. |
| Incident, change and rollback | 2/7 | The explicit connection between operation, incidents and release is the clearest gap. |

Read the [method, full matrix and limitations](/en/guides/research-ai-agent-operations/) before treating these numbers as rules. They describe the selected documentation, not a recommendation to copy any implementation.

## 1. Give every run an operational identity

A run must be correlatable. Record a run ID, agent, instruction version, model, environment, session or conversation when applicable, timestamp, outcome and termination reason. In a multi-agent flow, record handoffs and responsibility for each step as well.

The trace does not need to retain every prompt or response. The [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) provides tracing to visualize, debug and monitor workflows and connect them with evaluations; the SDK configuration allows potentially sensitive inputs and outputs to be excluded from trace payloads ([configuration documentation](https://openai.github.io/openai-agents-python/config/)). This illustrates an important choice: visibility is not the same as indiscriminate retention.

If the team instruments its own runtime, use consistent names. [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/) define operations such as `invoke_agent` and `execute_tool`, as well as agent IDs, versions, conversations and token usage. The convention does not choose a backend or guarantee safety, but it lowers the cost of correlating signals across languages and services.

At minimum, an operational identity should answer:

- which version received the input;
- which tools were considered and called;
- which arguments were sent after validation;
- which permission or approval authorized the action;
- how many steps, tokens, calls and seconds were consumed;
- whether the outcome was delivered, escalated, blocked or reversed.

## 2. Observe tools and effects, not only text

Operational risk often lives in the external effect: changing a record, publishing a message, creating an order or running code. For every tool call, record the name, contract version, minimized arguments, result, error code, duration, authorization and relationship to the run. Minimize arguments and responses; telemetry should not become a permanent copy of personal data or secrets.

The record should help diagnosis without giving the observability system execution power. An operator may query an event, but should not be able to invoke a tool from a log. Authorization must be checked in the system that owns the action; a sentence in the prompt is not a sufficient boundary.

Separate four states: “the model suggested,” “the system validated,” “a person approved” and “the tool executed.” This prevents a planned action from being counted as a successful action and helps investigate gaps between intent, policy and effect.

## 3. Define SLOs around the task outcome

An agent SLO should not simply be “the model answered quickly.” Users pay for a task completed safely, not for a token count. Start with service-level indicators that connect behavior to impact:

| SLI | Question | Example decision |
|---|---|---|
| Correct completion | Did the task reach an accepted outcome? | If it drops, stop traffic expansion and review cases. |
| Safe action | Did the agent respect tools, parameters and permissions? | A critical violation blocks the version even with a strong completion rate. |
| Task latency | How long until a result or escalation? | Separate model, tool and human-wait time. |
| Operational failure | How many runs ended in timeout, error or repetition? | Investigate the cause instead of only increasing retries. |
| Cost per correct task | What does an accepted completion cost, including tools and review? | Compare models, context and escalation needs. |
| Appropriate escalation | Did the agent involve a person when it should? | Recalibrate confidence boundaries and stop rules. |

Define the window, denominator and exclusion rule before publishing an SLO. “Success” should exclude an HTTP 200 that did not complete the task. “Latency” should say whether approval wait time is included. “Cost” may include model, tools, storage, observability and human work when those items matter to the decision.

The [Microsoft Foundry Monitoring Dashboard](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard) documents metrics such as token usage, latency, success rate and evaluation results, but the right thresholds depend on the use case. Use the signal to make a decision; do not turn an example value into a product promise.

## 4. Treat cost as a boundary, not a quality proxy

Tokens are one cost component, not the outcome. A cheap agent that fails and sends the case to review can cost more than a slightly longer run that completes correctly. Track at least:

- model cost per run and per correct task;
- tool and paid-service calls;
- input and output tokens when available;
- execution time and retries;
- evaluation, trace storage and human-review cost;
- distribution by customer, flow, version and escalation reason.

Set limits before execution: maximum steps, time, action value, calls per tool and period budget. When a limit is reached, the safe behavior may be to stop, ask for confirmation or escalate. Avoid automatic retries that repeat a non-idempotent action.

## 5. Build incident response around containment

An agent incident can be an incorrect answer, an out-of-scope tool call, data exposure, a loop, anomalous cost, latency degradation or a missed escalation. The runbook should differentiate severity and provide a clear first action.

### Before an incident

- maintain an inventory of the agent, tools, versions, owners and environments;
- test block, timeout, approval and rollback paths;
- alert on impact-related SLIs rather than every text variation;
- have a way to disable a tool or reduce traffic;
- record what enters telemetry and who can access it.

### During an incident

1. **Contain:** disable the tool, reduce traffic, pause the version or switch to suggestion mode.
2. **Preserve evidence:** retain run IDs, version, minimized traces, authorization events and recent changes.
3. **Classify:** distinguish quality, security, availability, cost and data-impact failures.
4. **Decide:** choose rollback, configuration correction, flow block or human escalation.
5. **Communicate:** record impact, time, services and owners without exposing unnecessary content.

[AWS DevOps Agent Production Operations](https://docs.aws.amazon.com/devopsagent/latest/userguide/working-with-devops-agent-production-operations-index.html) describes a cycle connecting detection, investigation, recovery and prevention, correlating metrics, logs, traces, changes and deployment history. The product-level inference is straightforward: a model trace alone cannot explain an incident if the team cannot connect it to a deploy, tool or system state.

### After an incident

Record probable cause, confirmed cause, detection condition, impact, containment, correction and preventive action. Turn the case into a regression test. If the failure was an improper tool, add a permission case; if it was cost, add a boundary; if it was quality, update the evaluation set. The review ends only when an owner and verification date exist.

## 6. Make changes reversible

A meaningful change includes a model, prompt, tool, schema, retriever, policy, limit, memory or external service. Version each component with the run. Promote in stages:

1. validate against fixed cases and recent incidents;
2. run in a controlled environment or shadow mode;
3. release to a traffic fraction with metrics and rollback;
4. compare correct task, safe action, latency, cost and escalation;
5. expand only when outcome and risk are acceptable;
6. archive the decision, evidence and final configuration.

Rollback is not simply pointing at the previous model. If a tool contract changed, reverting the prompt may not be enough. Reversal must account for dependencies and be tested before launch.

## A 30-day starting plan

### Days 1–7: map operations

Choose one flow and describe outcome, impact and owner. List tools, data, permissions, versions and stop conditions. Define the six checklist controls and mark the evidence that already exists.

### Days 8–14: minimum telemetry

Add run ID, version, duration, error, tool calls, outcome, estimated cost and escalation. Redact sensitive inputs and set retention. Test whether another person can reconstruct a run without accessing credentials.

### Days 15–21: evaluation and incidents

Build normal, ambiguous, incomplete, adversarial and unavailable-tool cases. Alert on task failure, unsafe action, timeout and anomalous cost. Simulate containment and rollback.

### Days 22–30: controlled change

Set provisional SLI targets, publish a runbook, make a small canary change and record the decision. After observing behavior, adjust targets and gaps. Treat the first month as a baseline, not a certification.

## Operations checklist template

The [AI agent operations checklist](/downloads/ai-agent-operations-checklist.csv) is a CSV protected by the existing form. It contains instructions, a fictional example and six controls derived from the research: execution visibility, tool telemetry, evaluation, metrics, access/human control and incident/change/rollback.

Use it in a launch-readiness meeting or monthly review. For each control, record evidence, owner, severity, status and the next review date. Use “Compliant” only when a verifiable proof exists. The file contains no macros, formulas, scripts, credentials or real personal data.

Connect the checklist to product risk with the [AI risk matrix](/en/guides/ai-risk-matrix/) and the [AI governance guide](/en/guides/ai-governance/). For implementation changes, return to [how to build AI agents](/en/guides/how-to-build-ai-agents/) and use the [AI agent evaluation template](/en/guides/ai-agent-evaluation-template/) before expanding autonomy.

## Limitations and conclusion

This week’s research examined official documentation, not telemetry from a population of agents or customer outcomes. Documentation highlights capabilities and changes over time; “not mentioned” does not mean “does not exist.” The matrix does not define an SLO, maturity level or provider ranking. The checklist does not replace legal, security, privacy or sector-specific analysis.

The practical order is still clear: first make every run reconstructable; then observe tools and effects; next connect quality, cost and latency to an outcome; finally close the loop with access, incidents and reversible changes. This reduces the chance of scaling an agent that works in a demo but cannot be explained, contained or improved in production.
