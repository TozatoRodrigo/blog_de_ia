---
title: "AI agent evaluation: test cases, metrics and release gates"
seoTitle: "AI agent evaluation: a practical method for release gates"
description: "Learn how to evaluate AI agents for outcomes, trajectories, tools, safety, cost and readiness before releasing a change."
datePublished: "2026-08-31"
dateModified: "2026-08-31"
tags: ["AI agents", "evaluation", "evals", "quality", "product management"]
alternateSlug: "avaliacao-agentes-de-ia"
cluster: agents
isHub: false
downloads:
  - label: "Download the evaluation gate checklist"
    href: "/downloads/ai-agent-evaluation-gate-checklist.csv"
    format: "CSV"
faq:
  - question: "What is AI agent evaluation?"
    answer: "It is the process of running representative tasks and checking the outcome, trajectory, tool use, safety, operations and release criteria of an agent. It is not only a comparison between a final answer and a reference answer."
  - question: "Which metrics should I use to evaluate an AI agent?"
    answer: "Start with correct task completion, tool and parameter accuracy, safety and policy adherence, evidence or groundedness, latency, cost, repetition and escalation quality. The limits depend on the use case, its risk and the outcome the product must deliver."
  - question: "How do I test an agent before production?"
    answer: "Build a versioned set of normal, ambiguous, incomplete, adversarial and prohibited cases; run the agent in a controlled environment; check outcome and trajectory; compare it with the prior version; and release only when mandatory criteria and risk limits are met."
  - question: "Does LLM-as-a-judge replace human evaluation?"
    answer: "No. A model-based evaluator can scale review, but it needs clear criteria and periodic calibration against human review. Deterministic checks remain preferable when code can verify the outcome or action."
sources:
  - name: "OpenAI — Evaluate agent workflows"
    url: "https://developers.openai.com/api/docs/guides/agent-evals"
  - name: "OpenAI Agents SDK — Testing"
    url: "https://openai.github.io/openai-agents-python/testing/"
  - name: "OpenAI — Evaluation best practices"
    url: "https://developers.openai.com/api/docs/guides/evaluation-best-practices"
  - name: "Anthropic — Demystifying evals for AI agents"
    url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
  - name: "Microsoft Foundry — Evaluate your AI agents"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent"
  - name: "Microsoft Foundry — Test a hosted agent"
    url: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent"
  - name: "Google Cloud — Evaluate agents using the GenAI Client"
    url: "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/evaluate"
  - name: "NIST AI RMF Playbook — Measure"
    url: "https://airc.nist.gov/airmf-resources/playbook/measure/"
draft: false
---

Evaluating an AI agent means checking whether it completes a useful task, reaches the correct state and stays within acceptable safety, cost and operational limits — while also examining whether the path it took was acceptable. The final answer is only one piece of evidence. An agent can produce a convincing sentence after choosing the wrong tool, sending an invalid parameter or leaving an external system in the wrong state.

This guide presents a provider-neutral method for Product Managers, Tech Leads, QA, SRE and governance teams. It connects the [pillar guide to AI agents](/en/guides/ai-agents/) to [reproducible documentary research on evaluation](/en/guides/research-ai-agent-evaluation/) and a [private evaluation gate checklist](/downloads/ai-agent-evaluation-gate-checklist.csv). The goal is not a universal score for every agent. It is a way to turn a change into an auditable decision.

## What an evaluation must answer

A useful evaluation starts with a task, not a model. Describe the input, initial state, available tools, permitted actions, verifiable outcome and failure condition. Then inspect at least five surfaces:

| Surface | Question it answers |
|---|---|
| Outcome | Did the task end in the expected state? |
| Trajectory | Were the intermediate decisions coherent? |
| Tools | Did the agent choose the right tool and send valid parameters? |
| Safety | Did it follow policy, permissions, approvals and prohibited-action rules? |
| Operations | Did it stay within acceptable latency, cost, step, retry and escalation limits? |

This separation prevents two premature conclusions. “The answer looks good” does not prove that the system state changed correctly. “The task finished” does not prove that the agent acted safely. [OpenAI’s Agent Evals guide](https://developers.openai.com/api/docs/guides/agent-evals) describes combining traces, graders, datasets and evaluation runs to investigate workflow behavior; [Anthropic’s evaluation guide](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) distinguishes a transcript, a trial, a grader and the environment’s final outcome.

## 1. Define the outcome before defining the score

An evaluation case needs an observable success condition. For a support agent, “answer well” is vague; “classify the request correctly, do not invent a policy and escalate when information is missing” is testable. For an agent that updates a CRM, the final state may be the correct change in a test environment together with a record of authorization.

Write each case with these fields:

- **Input:** the request and the minimum context the agent receives.
- **Initial state:** records, permissions, documents or session state available at the start.
- **Expected outcome:** the state that should exist after the run.
- **Permitted actions:** tools, parameters and effects that may occur.
- **Prohibited actions:** effects that fail the case even if the final answer is fluent.
- **Evidence:** query, assertion, snapshot or event that proves the outcome.
- **Severity:** the impact of failure and the blocking rule.

The [OpenAI evaluation best-practices guide](https://developers.openai.com/api/docs/guides/evaluation-best-practices) recommends defining the objective, collecting data, defining metrics, comparing runs and evaluating continuously. That recommendation applies to agents, but verification must follow the architecture: a text check may be enough for classification; it is not enough for an action that changes another system’s state.

### Outcome is not the same as output

Separate `output` from `outcome`. Output is what the user sees; outcome is the state the task should produce. An agent may say “the order was canceled” even though the cancellation never happened. A strong case verifies the record, simulated transaction or business event in an isolated environment.

When there is no single reference answer, use a rubric with explicit dimensions such as completeness, source fidelity, instruction adherence and communication. Still record the evidence behind each grade. A scale without examples only turns opinion into a number.

## 2. Build a set that represents the risk

Do not begin by trying to cover every possible conversation. Start with the tasks that define product value and the failures that would be expensive or dangerous. An initial set can combine expert-authored cases, sanitized real failures, permitted historical data and reviewed synthetic scenarios.

A practical set includes:

1. **Normal:** the expected path with sufficient context.
2. **Ambiguous:** a request with two plausible interpretations.
3. **Incomplete:** missing information, an empty document or an unavailable tool.
4. **Adversarial:** conflicting instructions, malicious content or an attempt to bypass policy.
5. **Prohibited:** an action that must be refused, escalated or held for approval.
6. **Regression:** a case that failed in an earlier version and must remain protected.

Give every case a stable identifier and a version. Do not put secrets, complete customer prompts or real personal data in an evaluation CSV. Store only the minimum context and, when needed, a reference to the authorized system. If production data is used, define retention, redaction and access rules before copying it into the set.

The [NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/measure/) links trustworthy measurement to documenting test sets, metrics, tools and test conditions. That practice also exposes when the set does not resemble the real environment: a collection of easy questions can produce a high rate and little information about risk.

## 3. Evaluate the trajectory, not only the text

For an agent, the trajectory is the observable sequence of model calls, decisions, tools, intermediate results, handoffs, approvals and termination. It distinguishes a correct outcome reached through an allowed path from a correct outcome reached by chance.

Record, with data minimization:

- run ID, agent, version and environment;
- sanitized input and initial state;
- considered and executed tools;
- validated parameters, result and error code for each tool call;
- approvals, blocks, retries and handoffs;
- final outcome and evidence of the environment state;
- steps, tokens when available, duration and estimated cost.

The [OpenAI Agents SDK tracing documentation](https://openai.github.io/openai-agents-python/tracing/) describes traces for generations, tool calls, handoffs, guardrails and custom events. Its [testing documentation](https://openai.github.io/openai-agents-python/testing/) shows deterministic utilities for exercising workflows in memory and checking that expected steps were consumed. The important idea is independent of any library: capture the decisions your system owns, and do not attribute an action to the agent if it was only suggested, blocked or never executed.

Do not turn evaluation into indiscriminate retention of sensitive content. A useful trace can keep IDs, versions, event types and redacted summaries. Access to a log should not automatically grant permission to repeat a tool call.

## 4. Combine evaluators with different jobs

Use the simplest evaluator that answers the question:

| Type | Good use | Limitation |
|---|---|---|
| Deterministic | Final state, schema, enum, permission, prohibited tool, step limit | Poor at open-ended quality or nuance |
| Model-based | Rubrics for relevance, clarity, faithfulness or interaction | Can agree with a wrong answer and needs calibration |
| Human | Subjective cases, high-risk cases and automated-grader review | Takes time and needs consistent criteria |

An evaluation can contain several checks: outcome, safety, tool behavior, quality and operations. Do not collapse everything into an average that lets a critical violation be offset by good writing. Make safety and state integrity mandatory gates; use a score or rubric only for graded dimensions afterward.

The [Microsoft Foundry guide to evaluating agents](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent) separates evaluator-level aggregates from row-level outputs containing the response, version, usage and reasoning. Its [hosted-agent testing guide](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent) also distinguishes unit, integration and structured evaluation. These levels are not interchangeable: a test can show that a handler works, while an end-to-end evaluation checks whether the agent selects that handler in the right context.

If you use LLM-as-a-judge, keep a small set of human-reviewed cases to calibrate the rubric. Compare disagreements, record false-positive and false-negative examples, and revise the evaluator when the definition of success changes. The recommendation to combine metrics with human judgment also appears in [OpenAI’s evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices).

## 5. Repeat, compare and protect against regressions

Generative models can vary between runs. A single run is a point, not a distribution. For critical cases, repeat execution under controlled conditions and record the number of trials. For deterministic cases, verify that the harness consumed every expected step; an early stop should not be counted as success.

Compare versions while preserving context:

| Comparison | What to inspect |
|---|---|
| New model vs. current model | Outcome, safety, cost and latency by case type |
| New prompt vs. current prompt | Adherence, tools, escalation and regressions |
| New tool vs. old tool | Schema, parameters, effects and errors |
| New policy vs. old policy | Correct blocks and permitted cases that still work |

The [Google Cloud Agent Engine evaluation guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/evaluate) shows a flow with a dataset, inference, an evaluation run and metrics for final response quality, tool use, hallucination and safety. The decision-critical detail is keeping the dataset, agent and metrics identifiable; without that, two scores are not comparable.

Capability evaluations ask, “What can the agent do?” and may begin with a low pass rate. Regression evaluations ask, “What does it still do after the change?” and protect what has already been accepted. A healthy suite keeps the two questions distinct.

## 6. Turn evaluation into a release gate

A gate does not need to be a single score. It is an explicit rule that connects evidence to a decision. A simple shape is:

- **Blockers:** any prohibited action, authorization failure, data exposure, high-severity incorrect state or missing evidence.
- **Graded limits:** quality, cost, latency, steps and escalation remain within the range defined for the case.
- **Comparison:** no material regression in protected cases without a recorded decision.
- **Approval:** named owner, date, dataset version, agent version and test environment.
- **Return plan:** suggestion mode, previous version, tool disablement or another tested containment option.

For an illustrative example, a team tests a change to a triage agent. Correct completion and latency improve, but a prohibited case calls an editing tool. The decision is to block the change. The quality gain does not offset a safety violation. This is a decision pattern, not a result measured by Produto com IA.

The [Microsoft hosted-agent testing guide](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent) recommends versioning the evaluation recipe and running it as a CI quality gate when possible. NIST recommends testing before deployment, documenting the validity range and monitoring after deployment. The resulting practice is layered: offline evaluation reduces release risk; monitoring and trace review find failures the set did not predict.

## 7. Keep evaluating after release

Production is not only a place to measure latency. It is a source of new cases, distribution shifts and outcomes that were absent from the initial set. Build a loop with four inputs:

1. select traces or feedback with signs of failure, unusual cost, repetition, escalation or low confidence;
2. remove sensitive data and review the case with someone who understands the domain;
3. add it to the regression or capability suite with a success criterion;
4. run the next change against the suite and record the decision.

Continuous evaluation does not replace user research, manual review, A/B testing or observability. Each method answers a different question. Automated evaluation is fast and repeatable; a production trace shows real behavior; human review can reveal that the criterion itself was wrong.

## What this package’s research found

The [original research on evaluation controls](/en/guides/research-ai-agent-evaluation/) audited eight official pages collected on August 31, 2026. The unit was the page, not the vendor, and “yes” was counted only when a control appeared explicitly. All eight documents mentioned tasks or datasets and success criteria. Seven mentioned trajectory evidence and comparison or regression; six combined multiple evaluators or signals; five described a pre-release gate and a post-release loop; only three explicitly mentioned human calibration or review.

These numbers are not a market standard or a representative sample of every vendor. They support an editorial recommendation: a dependable gate should combine the most common elements — cases and outcome — with the less frequent layers, especially production evidence and calibrated human judgment.

## A 30-day checklist

### Days 1–7: task and risk

Choose one flow, describe the observable outcome, list prohibited actions and define the severity of each failure. Do not evaluate “the agent” as an abstraction; evaluate a task in an environment.

### Days 8–14: dataset and evidence

Write normal, ambiguous, incomplete, adversarial, prohibited and regression cases. Define how to verify the final state and which minimum events must appear in the trace.

### Days 15–21: comparable run

Run the current version and the candidate change against the same set. Combine deterministic checks with a reviewed rubric. Repeat variable cases and read trajectory samples, not only the average.

### Days 22–30: gate and live loop

Record the decision, owner and return plan. Release in stages when the impact justifies it. Then turn sanitized real failures into new cases and schedule the next evaluation.

## Download the evaluation gate checklist

The [private AI agent evaluation gate checklist](/downloads/ai-agent-evaluation-gate-checklist.csv) is a bilingual CSV with instructions in its first row and the fictional `EXAMPLE-001`. It organizes change identity, case, outcome, trajectory, tools, safety, evaluators, budget, evidence, decision and retest. Its fields come from the research: dataset and outcome, trajectory, multiple signals, comparison, pre-release gate, post-release follow-up and human calibration.

Fill one row per case and keep real personal data out of the file. Use the broader [AI agent evaluation template](/en/guides/ai-agent-evaluation-template/) for a general evaluation record; use this checklist when the question is whether a specific change is ready to move forward. To connect the decision to risk, consult the [AI risk matrix](/en/guides/ai-risk-matrix/) and the [AI agent operations guide](/en/guides/ai-agent-operations/).
