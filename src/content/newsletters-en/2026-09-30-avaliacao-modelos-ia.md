---
title: "63 models in September: how to evaluate and switch without rewriting"
date: "2026-09-30"
seoSlug: "ai-model-evaluation"
excerpt: "With 63 models released in September, product teams need flexible architecture and their own evaluations to compare quality, cost per task, and latency."
tags: ["inteligencia-artificial", "modelos-de-ia", "produto"]
featured: true
draft: false
---

With 63 models released in September, the product decision is no longer which model to choose once and for all. It is to build architecture that lets you switch without rewriting the feature, and evaluations that show whether a new model improves your workflow.

September closed with a wave of releases few people could follow end to end. I pulled out what matters to people working in product, and today’s main story is what that pace changes about the job.

One question I hear more often in AI product work is: “Which model are we going to use?” The honest answer has shifted. It is now “the one that fits this task—and we switch when it makes sense.”

An aggregated changelog, [LLM Reference](https://www.llmreference.com/changelog/2026-09), lists 63 models released in September alone. They include new Claude versions, GPT-6 variants, Grok, Gemini, and smaller models from other labs. Nearly all focus on reasoning and understanding images alongside text.

I’m optimistic about this pace. Competition lowers costs, improves quality, and opens up use cases that did not make economic sense yesterday.

## The decision has moved from the model to the architecture

For product teams, choosing one model and sticking with it is no longer a good decision. What matters now is the layer underneath: architecture that lets you switch models without rewriting the feature, plus your own evaluations to tell, with data, whether a new release performs better in your workflow.

That capability is part of [AI product management](/en/guides/ai-product-management/): treating architecture and evaluation as product decisions, not details to leave for later.

## Evaluate models on your own cases

Public benchmarks are a starting point. What decides is testing with your documents, prompts, and hard cases, measuring quality, cost per task, and latency. The practices in [AI agent evaluation](/en/guides/evaluate-ai-agents/) can help organize cases and evaluation criteria; to track costs over time, see the guide to [AI agent cost management](/en/guides/ai-agent-cost-management/).

## Route each task to the right model

Another idea gaining traction is routing. A simple task goes to a fast, low-cost model; a task that needs more reasoning goes to a more capable one. In practice, this is product management applied to intelligence: deciding where it is worth paying more.

For people working in business, technology, or product, the skill that may pay off most now is knowing how to measure well. Teams with good evaluations can take advantage of each release in days. Teams without them stay at the mercy of each week’s hype.

## The rest of the radar

**GPT-6.1 Sol (OpenAI)** — A new reasoning and vision model could change the cost, quality, and internal benchmarks for your AI features. [The month’s release list](https://www.llmreference.com/changelog/2026-09).

**Claude Sonnet 5.5 (Anthropic)** — A candidate default for features that need a strong balance of cost and quality; run your evaluations before switching. [The month’s release list](https://www.llmreference.com/changelog/2026-09).

**Gemini 3.1 Pro and the Gemini 3.x family (Google)** — Gemini 3.1 Pro’s context window of up to 1 million tokens, together with multimodal and agentic capabilities, expands use cases involving long documents. [Read the overview](https://blog.mean.ceo/?p=10324).

**Amazon Bedrock and Microsoft’s specialized models** — Managed platforms reduce security and procurement friction and speed up enterprise AI adoption. [Read the overview](https://blog.mean.ceo/?p=10324).

More tomorrow with another slice of what surfaced.
