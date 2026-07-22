---
title: "AI agent evaluation template"
seoTitle: "AI agent evaluation template"
description: "Evaluate AI agents for task completion, tools, safety, cost, latency, oversight and readiness to launch."
datePublished: "2026-07-22"
dateModified: "2026-07-22"
tags: ["AI agents", "evals", "template"]
alternateSlug: "template-avaliacao-agente-de-ia"
cluster: agents
isHub: false
downloads:
  - label: "Download the evaluation template"
    href: "/downloads/ai-agent-evaluation-template.csv"
    format: "CSV"
sources:
  - name: "OpenAI Agents SDK — Tracing and evaluations"
    url: "https://openai.github.io/openai-agents-python/"
  - name: "NIST Generative AI Profile"
    url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence"
draft: false
---

Agent evaluation must test the complete system: model, instructions, context, tools, permissions and failure handling. This template organizes evidence before autonomy expands.

## Identification

Record name, version, owner, outcome, users, environments, model, instructions, tools, data sources and date. A relevant change should trigger a new evaluation run.

## Test cases

Include case ID, type, input, expected outcome, expected tool, prohibited actions, approval requirement and failure severity. Maintain normal, ambiguous, incomplete, adversarial and unavailable-tool cases.

## Metrics

Measure correct completion, tool and parameter accuracy, valid evidence, permission compliance, steps, cost, latency, escalation and error recovery.

## Decision

Set thresholds before running the evaluation. Classify failures by impact and record correction, owner and retest. Outcomes may be block, experiment, suggestion mode, approval-gated launch or bounded execution.

The download uses stable columns and an explicitly marked example row. Adapt thresholds to the use case and connect the decision to the [AI governance guide](/en/guides/ai-governance/).
