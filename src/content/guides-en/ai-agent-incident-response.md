---
title: "AI agent incident response: containment, recovery and rollback"
seoTitle: "AI agent incident response: a practical runbook"
description: "Learn how to detect, contain, recover from and learn from AI agent incidents without confusing configuration rollback with reversal of external effects."
datePublished: "2026-08-17"
dateModified: "2026-08-17"
tags: ["AI agents", "incidents", "rollback", "operations", "SRE"]
alternateSlug: "resposta-incidentes-agentes-de-ia"
cluster: agents
downloads:
  - label: "Download the AI agent incident runbook"
    href: "/downloads/ai-agent-incident-runbook.csv"
    format: "CSV"
faq:
  - question: "Does rolling back an agent undo everything it did?"
    answer: "No. A rollback can restore a prompt, model, tool, policy or traffic version. An external effect that already happened needs compensation, reconciliation, idempotency or human intervention; restoring configuration does not erase that effect automatically."
  - question: "What is the first action in an agent incident?"
    answer: "Preserve the minimum evidence and contain the effect: pause the tool, reduce traffic, switch to suggestion mode or require approval, depending on risk. Then classify the incident and choose a verifiable recovery path."
  - question: "Does every agent need a kill switch?"
    answer: "Every agent with meaningful impact needs a tested way to stop or reduce its ability to act, but that can be a tool block, traffic switch, safe mode or human queue rather than shutting down the whole system."
sources:
  - name: "AWS Agentic AI Lens — behavior versioning and rollback"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops02-bp03.html"
  - name: "AWS Agentic AI Lens — validation and approval workflows"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops06-bp03.html"
  - name: "AWS Agentic AI Lens — checkpoint-based recovery"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel03-bp03.html"
  - name: "AWS Prescriptive Guidance — incident response and business continuity"
    url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-incident-response.html"
  - name: "OpenAI Agents SDK — human-in-the-loop"
    url: "https://openai.github.io/openai-agents-python/human_in_the_loop/"
  - name: "Microsoft Foundry — agent tracing"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept"
  - name: "Google Cloud — Agent Runtime monitoring"
    url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/monitoring"
  - name: "NIST AI Risk Management Framework Playbook"
    url: "https://airc.nist.gov/airmf-resources/playbook/"
draft: false
---

An AI agent incident requires two different decisions: **how to stop or reduce the next effect** and **how to handle what already happened**. Pause the tool or version, preserve run IDs and evidence, classify the impact, and only then choose between checkpoint resume, degradation, rollback or compensation. Restoring the previous prompt does not unsend a message, restore a changed record or reverse a completed transaction.

This is an operational response guide. It complements the [pillar guide to operating AI agents](/en/guides/ai-agent-operations/); it does not replace a business-continuity plan, security investigation, legal obligation or sector-specific procedure. The [original research on agent recovery](/en/guides/research-ai-agent-incident-response/) shows which controls appear explicitly in eight official documents. The [private CSV runbook](/downloads/ai-agent-incident-runbook.csv) turns those controls into fields for incident meetings and execution.

## In this guide

- what makes an agent incident different from an ordinary service error;
- how rollback, resume and compensation differ;
- a five-phase cycle for detection, containment, recovery and learning;
- severity and decision criteria;
- how to test the runbook before you need it;
- which signals and evidence belong in the protected template.

## What counts as an AI agent incident

An incident is a deviation that can compromise availability, quality, security, privacy, cost, compliance or an external action. The cause may be the model, instructions, retrieved context, a tool, a permission, a dependency, a deployment or the workflow’s failure handling. A plausible answer is still an incident if the agent selected the wrong recipient or executed outside its granted authority.

Keep four moments separate:

1. **Intent:** the model suggested a plan or tool call.
2. **Authorization:** a system, policy or person allowed the call.
3. **Effect:** a tool changed an external system.
4. **Outcome:** someone confirmed that the task ended correctly and safely.

The runbook must record these states separately. A trace that proves intent does not prove execution; HTTP 200 does not prove task completion; approval does not prove reversibility.

## Rollback, resume and compensation are different

Identify the recovery object before taking action.

| Object | Possible action | Limit | Evidence needed |
| --- | --- | --- | --- |
| Prompt, model, policy or tool | Roll back to a known version | Does not address effects already executed | Current version, baseline and change history |
| Paused execution | Resume from a checkpoint | Can repeat effects if the step is not idempotent | Persisted state, completed step and idempotency key |
| Unavailable service or agent | Fallback or degraded mode | Quality may fall and must be communicated | Alternative, trade-off and degradation signal |
| Changed record, payment, message or file | Compensation or reconciliation | Some effects cannot be undone | Receipt, before/after state and authority to correct |
| Exposed sensitive data or credentials | Access containment and security response | Notification duties may apply | Scope, time window, identity and data retention |

The [AWS Agentic AI Lens on behavior versioning and rollback](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops02-bp03.html) recommends versioning instructions, permissions and decision boundaries, designating a known-good baseline and testing rollback. The [AWS guidance on checkpoints](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel03-bp03.html) adds that resume paths need idempotent steps to avoid duplication or corruption. These controls complement each other: one restores behavior; the other makes execution continuity safer.

## A five-phase response cycle

### 1. Detect and preserve evidence

The first signal may be an error rate, latency, cost, evaluation failure, abnormal tool, complaint, exposure or unexpected change. Record the time, environment, agent version, model, tool set, run ID, trace, minimized caller identity and last relevant change. Do not copy secrets or the full prompt by reflex.

Tracing and metrics serve different purposes. [Microsoft Foundry tracing](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept) documents inputs, outputs, tools, tokens, duration, latency and evaluation events, and recommends redacting sensitive data. [Google Agent Runtime monitoring](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/monitoring) exposes operational metrics and alerts for latency, counts and response codes. Use these signals to locate the window and surface; do not treat either one alone as a confirmed cause.

Take a minimum operational snapshot:

- current agent version and known-good baseline;
- recent changes to prompt, model, tool, schema, retriever, policy and traffic;
- affected runs and control runs;
- tools called, validated arguments and results;
- permissions, approvals, retries, fallbacks and checkpoints;
- observed impact and still-unconfirmed hypothesis.

### 2. Triage by impact and reversibility

A short classification helps the team decide without debating the cause for hours. Use impact and reversibility, not how dramatic the text looks.

| Level | Example | First decision |
| --- | --- | --- |
| Critical | payment, deletion, unauthorized access, data exposure or scaled action | stop the ability to act, preserve evidence and escalate immediately |
| High | wrong tool, broad degradation, cost loop or approval failure | pause the version/tool, reduce traffic and assign an incident owner |
| Moderate | limited quality failure, delay or frequent fallback without external effect | stop expansion, investigate a sample and set a correction deadline |
| Low | isolated error caught before an effect or easily corrected output | log it, add an evaluation case and watch the trend |

Ask: did an external effect occur? can new runs still happen? is the action reversible? is there a legal or contractual duty? how many people or records could be affected? Risk rises when the effect is fast, broad, hard to contest or impossible to undo.

### 3. Contain the next action

Containment reduces future harm without destroying evidence. Choose the smallest intervention that interrupts the risk vector:

1. block the specific tool;
2. suspend traffic to the version;
3. reduce the agent to suggestion mode;
4. require human approval for every sensitive action;
5. switch to a deterministic flow or known fallback;
6. shut down the agent when smaller interventions are insufficient.

The [OpenAI Agents SDK human-in-the-loop flow](https://openai.github.io/openai-agents-python/human_in_the_loop/) demonstrates pausing before a sensitive tool, approving or rejecting a specific call, and resuming a serializable `RunState`. This does not make every approval safe: the reviewer needs scope, arguments, impact and alternatives, and the application must enforce authorization in the system that executes the action.

When the agent runs in a collaborative workflow, fallback must not be silent degradation. [AWS guidance on fallback and graceful degradation](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel04-bp03.html) recommends ordered alternatives, degradation events and failure testing. A partial answer can preserve continuity, but it must carry a signal that capability or confidence changed.

### 4. Recover state and handle external effects

After containment, choose a recovery path:

- **Resume:** only when the checkpoint is trustworthy and every later step is idempotent.
- **Replay:** only with an idempotency key, controlled queue and current-state confirmation.
- **Fallback:** when the primary dependency failed and the alternative has known risk and quality.
- **Behavior rollback:** restore a versioned baseline with limited traffic and confirmation metrics.
- **Compensate:** correct an external effect through an authorized, auditable operation.
- **Do not replay:** when the state cannot be inferred safely; send it to human reconciliation.

[AWS incident-response guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-incident-response.html) recommends emergency shutdown capabilities, continuity plans and recovery methods within acceptable timeframes. For product teams, that means maintaining a manual or deterministic path for essential operations while the agent is contained.

For every external effect, ask before replaying: was the call accepted? was the result lost? is there a receipt? does the destination support an idempotency key? is compensation authorized? If the answer is unknown, treating “try again” as recovery is dangerous.

### 5. Validate, restore and learn

Rollback is a production change and needs an exit criterion. Validate the baseline with success cases, ambiguous cases, dependency failures, forbidden actions, approvals and the incident itself. Start in shadow mode, a controlled environment or a small traffic fraction. Confirm correct completion, safe action, latency, cost, escalation and no repetition.

[AWS guidance on validation and approval](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops06-bp03.html) proposes that rigor should scale with change risk and that rollback should be defined and tested for each change type. The runbook should store who approved, which evidence was reviewed, which version was restored and when traffic was reopened.

After the incident, record probable cause and confirmed cause separately. Capture impact, detection, containment, recovery, preserved data, decisions and gaps. Turn the case into a regression test or technical limit: wrong tool becomes an authorization test; a loop becomes a step budget; abnormal cost becomes an alert; quality failure becomes an evaluation case; an effect without undo becomes a compensation requirement.

## The runbook to prepare before the first incident

Use a readiness meeting to fill the [private AI agent incident runbook](/downloads/ai-agent-incident-runbook.csv). It is organized around the five controls counted in the research and includes a fictional `EXAMPLE-001`. For each agent, record:

1. owner and backup;
2. current version and known-good baseline;
3. tools and external effects;
4. detection signals and alert window;
5. containment action and authority to execute it;
6. checkpoint, idempotency key or replay limit;
7. fallback and quality impact;
8. restoration criterion and validation cases;
9. reconciliation for effects that cannot be rolled back;
10. prevention owner, due date and effectiveness test.

Do not put real emails, tokens, complete prompts or customer data in the file. Store links to authorized systems and minimum execution IDs. The [AI risk matrix](/en/guides/ai-risk-matrix/) helps set severity, approval and contestability; the [AI agent evaluation template](/en/guides/ai-agent-evaluation-template/) helps turn the incident into a testable regression.

## A 30-day plan

### Days 1–7: draw the boundaries

Choose one agent and list tools, permissions, effects, baseline, owner and safe mode. Execute each containment action in a non-production environment and document its time and dependencies.

### Days 8–14: create correlatable evidence

Add run ID, version, tool, result, authorization, duration, termination reason and checkpoint state. Minimize and protect sensitive content. Confirm that an authorized person can reconstruct a case without gaining execution power.

### Days 15–21: simulate failures

Test tool unavailability, invalid output, timeout, loop, approval failure, bad change and duplicate effect. Verify that fallback is communicated, that the human queue receives context and that replay does not duplicate effects.

### Days 22–30: rehearse recovery

Perform a controlled rollback and an external-effect reconciliation in a safe environment. Measure detection time, containment time, restoration time, explainable-run percentage and the number of actions without a compensation path. Do not turn these first numbers into universal SLOs; use them as a local baseline.

## Limitations

The associated research audited official documentation available on August 17, 2026, not real incidents, customer telemetry or platform performance. A control may exist on another page; “no” means only that it was not found under the stated protocol. Documentation describes capabilities and recommended practices, not a guarantee of security or availability.

Rollback, trace retention, financial compensation, incident notification and data access depend on the system and jurisdiction. Involve security, privacy, legal and the process owner when an incident involves people, money, health, credit, access or a regulatory duty.

The runbook is not meant to make an agent appear deterministic. It makes its authority explicit, reduces the next effect, preserves enough evidence and gives the team a recovery path that can be tested before the crisis.
