---
title: "Research: which official controls appear in AI agent evaluation?"
seoTitle: "Research on AI agent evaluation controls"
description: "A reproducible audit of eight official documents on tasks, outcomes, trajectories, gates, production and human review for agents."
datePublished: "2026-08-31"
dateModified: "2026-08-31"
tags: ["AI agents", "research", "evaluation", "evals", "governance"]
alternateSlug: "pesquisa-avaliacao-agentes-de-ia"
cluster: agents
isHub: false
downloads:
  - label: "Download the evaluation gate checklist"
    href: "/downloads/ai-agent-evaluation-gate-checklist.csv"
    format: "CSV"
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

This research audited eight official pages and found a common base: all eight documents mentioned test tasks or sets and success criteria. Coverage became less consistent when evaluation required trajectories, comparisons, production evidence and people. Seven documents mentioned trajectory evidence and comparison or regression; six mentioned multiple evaluators or signals; five explicitly described a pre-release gate and a post-release loop; only three mentioned human calibration or review.

This is a diagnosis of the selected corpus, not a market rate. The [Portuguese research](/guias/pesquisa-avaliacao-agentes-de-ia/) contains the same matrix, while the [AI agent evaluation guide](/en/guides/evaluate-ai-agents/) turns the findings into product decisions. The [private gate checklist](/downloads/ai-agent-evaluation-gate-checklist.csv) turns each control into a working field.

## Question and objective

**Question:** which controls appear explicitly in current official documents when they explain how to evaluate or test AI agents and AI systems?

**Objective:** identify coverage of eight controls a team can use to design an evaluation gate:

1. a test task or data set;
2. an outcome or success criterion;
3. an observable trajectory, trace, tool or process;
4. multiple evaluators or quality signals;
5. repeated trials, version comparison or regression;
6. a pre-release gate or CI integration;
7. production follow-up or post-release feedback;
8. human review, expertise or independent calibration.

The study did not rank vendors. A page may mention a control without providing a complete implementation; “yes” means only that the text mentions the control explicitly.

## Universe and collection date

The universe was defined before reading: public English-language pages maintained by OpenAI, Anthropic, Microsoft, Google Cloud or NIST, accessible on August 31, 2026, with direct guidance on evaluation, testing, measurement or evaluable operation of models, workflows or agents.

The set contains two OpenAI pages, one Anthropic page, two Microsoft Foundry pages, one Google Cloud page and one NIST page, plus another OpenAI evaluation guide. The unit is the page, not the vendor. The matrix therefore must not be read as “seven vendors out of eight”; it measures control presence in the selected documents.

### Inclusion criteria

- official product documentation or an official institutional domain;
- content accessible without an account during collection;
- explicit reference to evaluation, testing, metrics, traces, datasets, graders or system quality;
- page available on 2026-08-31.

### Exclusion criteria

- third-party posts, search results and community discussions;
- marketing pages without verifiable operational guidance;
- pages only about price, architecture or security without evaluation/testing guidance;
- duplicate versions of the same page in another language or print URL.

## Audited sources

| ID | Document |
|---|---|
| O1 | [OpenAI — Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals) |
| O2 | [OpenAI Agents SDK — Testing](https://openai.github.io/openai-agents-python/testing/) |
| O3 | [OpenAI — Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) |
| A1 | [Anthropic — Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) |
| M1 | [Microsoft Foundry — Evaluate your AI agents](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent) |
| M2 | [Microsoft Foundry — Test a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent) |
| G1 | [Google Cloud — Evaluate agents using the GenAI Client](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/evaluate) |
| N1 | [NIST AI RMF Playbook — Measure](https://airc.nist.gov/airmf-resources/playbook/measure/) |

## Collection and calculation method

I read each page on the stated date and marked `1` when I found an explicit instruction matching the control. I marked `0` when the page did not state that instruction clearly, even if the control could be inferred from the product architecture.

The row total is the sum of the eight controls for that page. The column total is the number of `1` values in that column, divided by eight for a descriptive proportion. There was no user sampling, interview, agent execution, paid API call or personal-data collection. This is a documentary audit, not a performance benchmark.

To reduce interpretation, I used these definitions:

| Code | Control counted as “yes” |
|---|---|
| T | The page defines test tasks, cases, a dataset or a suite. |
| R | The page defines an outcome, quality, adherence, final state or success criterion. |
| X | The page mentions a trace, trajectory, tool call, intermediate step or process log as an evaluation object. |
| G | The page combines evaluators, metrics, rubrics or independent signals. |
| C | The page advises repetition, version comparison, drift measurement or regression protection. |
| P | The page recommends testing before release, a pre-production gate or CI. |
| L | The page describes monitoring, continuous evaluation, real traces or feedback after release. |
| H | The page mentions human review, experts, calibration or independent assessment. |

## Reproducible data

`1` means explicit presence; `0` means absence in the audited excerpt.

| Source | T | R | X | G | C | P | L | H | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| O1 | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 4 |
| O2 | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 4 |
| O3 | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 1 | 7 |
| A1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 8 |
| M1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 7 |
| M2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 7 |
| G1 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 4 |
| N1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 8 |
| **Total** | **8** | **8** | **7** | **6** | **7** | **5** | **5** | **3** | **—** |

## Observed results

### 1. Cases and outcomes appear across the corpus

All eight documents discuss tasks, cases, sets or criteria for deciding whether a system works. They do not use the same design. [OpenAI Agent Evals](https://developers.openai.com/api/docs/guides/agent-evals) separates traces and datasets as a team moves from debugging to repeatability. [Microsoft](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent) describes a dataset and results by row and evaluator. [Google Cloud](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/evaluate) shows a dataset, inference, evaluation run and agent-specific metrics.

The finding supports a minimum requirement: evaluation without a case and success criterion is not reproducible. It does not support a universal dataset size or pass rate.

### 2. Trajectory is nearly as common as outcome

Seven pages mention traces, tools, steps, calls, process logs or intermediate evidence. The exception is OpenAI’s general best-practices page, which recommends logging and architecture-aware evaluation but does not present an agent trajectory as an explicit object in the audited excerpt.

That difference matters for product teams. Outcome tells you whether a task ended; trajectory helps explain whether the system used an allowed tool, passed through approval or reached the final state through an unexpected sequence.

### 3. Comparison is more common than gating

Seven pages recommend some form of comparison, repetition, versioning, regression or maintenance. Only five explicitly mention a pre-release gate, CI or testing before deployment. The presence of an evaluation does not guarantee that it blocks a change.

The [Microsoft hosted-agent testing guide](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent) explicitly describes versioning the recipe and using it as a CI quality gate. [NIST](https://airc.nist.gov/airmf-resources/playbook/measure/) broadens the frame to testing before deployment, documenting validity and monitoring in operation.

### 4. The post-release loop appears in half of the pages

Five of eight pages mention monitoring, continuous evaluation, production, real traces or later feedback. That fits the difference between testing a change in a controlled scenario and finding failures in the real distribution. Anthropic places automated evaluation beside production monitoring, A/B tests, feedback and transcript review; OpenAI recommends continuous evaluation and growing the set from new cases.

The number does not mean the other three pages reject monitoring. It means they did not count explicitly under the stated criterion.

### 5. Human calibration is the least common layer

Only three pages explicitly mention human review, experts or calibration: OpenAI Evaluation Best Practices, Anthropic Evals and NIST Measure. That does not make automated evaluation invalid; it shows that the corpus says less about how to verify the evaluator itself.

The [Anthropic guide](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) describes code-based, model-based and human graders and recommends reading transcripts. [NIST](https://airc.nist.gov/airmf-resources/playbook/measure/) includes documentation, experts and independent assessment as part of measuring trustworthy characteristics.

## Editorial inference

Based on the data, I recommend a layered gate: first outcomes and prohibited actions, then trajectory and operations, and finally calibrated human review for what cannot be checked deterministically. This is Produto com IA’s inference, not a rule jointly published by the eight documents.

I also recommend separating two decisions: **capability**, which asks what the agent can do, and **regression**, which protects what already worked. A single average can hide a critical prohibited-case failure; safety and state integrity should therefore be mandatory gates, not just components of a score.

## Limitations

- The corpus has eight pages selected for operational relevance, not random sampling.
- The unit is a page; pages from the same vendor are not independent.
- The reading was done in English, and later page changes may alter the matrix.
- “Explicit presence” does not measure depth, quality, adoption or control effectiveness.
- The study did not execute agents or measure latency, cost, accuracy, safety or the relationship between offline evaluation and production.
- No Search Console, Ubersuggest, customer or lead metrics were used.

## How to use the result

Start with the [AI agent evaluation guide](/en/guides/evaluate-ai-agents/), choose one flow and record the case in the [private evaluation gate checklist](/downloads/ai-agent-evaluation-gate-checklist.csv). Use `T` and `R` as the base; add `X`, `G`, `C`, `P`, `L` and `H` according to risk. For architecture and limits, consult the [AI agent pillar guide](/en/guides/ai-agents/). For what happens after launch, continue with the [AI agent operations guide](/en/guides/ai-agent-operations/).
