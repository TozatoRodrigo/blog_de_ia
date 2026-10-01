---
title: "Gemini 3.1 Pro and 1M context: what changes for document workflows"
date: "2026-10-01"
seoSlug: "gemini-long-context-documents"
excerpt: "A context window of up to 1 million tokens can help teams work across long documents; its value depends on quality, cost, and latency in the real workflow."
tags: ["inteligencia-artificial", "modelos-de-ia", "produto"]
featured: true
draft: false
---

A context window of up to 1 million tokens could change workflows built around contracts, statements, policies, and reports. Long context only pays off when it improves the work without making cost and latency impractical.

October began with the afterglow of a September full of model launches. I filtered the news and chose a detail that often gets lost in a spec sheet for today’s main story: how much context a model can handle at once.

When I think about AI in a product, one simple question stays with me: how much context can the tool hold at a time?

## What changes when a model reads long documents

It may sound like a technical detail, but it changes what we can build. Much of the work in finance and business lives in long documents: contracts, statements, policies, spreadsheets, and reports. When a model can only see one piece at a time, the team spends its time splitting files and stitching answers back together.

A roundup of September launches mentions the Gemini 3.x family. In the [official Gemini 3.1 Pro model card](https://deepmind.google/models/model-cards/gemini-3-1-pro), Google DeepMind describes text, image, audio, and video inputs, the ability to understand code repositories, and a context window of up to 1 million tokens. The card also evaluates reasoning and agentic tool use. The launch roundup does not confirm dates or pricing; check official documentation before making a purchasing decision.

Even so, the direction is promising. Long context and multiple modalities open up workflows that did not work before: reading a whole package of documents, cross-checking information, and returning something that helps people decide. The [model launch overview](https://blog.mean.ceo/?p=10324) has more on the models mentioned.

## Long context also has a cost and latency

From a product perspective, my sense is that the challenge shifts from “can we do it?” to “does it make sense to do it this way?” Long context costs more and can be slower. Not every task needs it. In some cases, a smaller model—or a retrieval step first—delivers better value for the price.

Start with the workflow: which documents go in, what answer helps someone decide, and where a person needs to review because an error is costly. That is part of [AI product management](/en/guides/ai-product-management/). Then test with your own documents, not just a launch demo; the practices in [AI agent evaluation](/en/guides/evaluate-ai-agents/) can help define cases and criteria. Track cost over time with the guide to [AI agent cost management](/en/guides/ai-agent-cost-management/).

I like this moment because it gives PMs a clear role again: design the workflow, decide what the AI receives, measure the result, and keep a person in the loop where mistakes are costly.

People working in business, technology, or product gain a lot by testing this with their own documents, not only with a launch demo.

## The rest of the radar

**GPT-6.1 Sol (OpenAI)** — A new reasoning and vision model could change the cost, quality, and internal benchmarks for your AI features. [Read OpenAI’s announcement](https://openai.com/index/introducing-gpt-6-1-sol/) and the [month’s release list](https://www.llmreference.com/changelog/2026-09).

**Claude Sonnet 5.5 (Anthropic)** — A candidate default for features that need a strong balance of cost and quality. [Read Anthropic’s announcement](https://www.anthropic.com/claude-sonnet-5-5) and run your evaluations before switching.

**The late-September release wave** — With so many launches, a model abstraction layer and continuous evaluations can help you avoid lock-in. The [month’s release list](https://www.llmreference.com/changelog/2026-09) helps track the pace.

**Amazon Bedrock and Microsoft’s specialized models** — Managed platforms reduce security and procurement friction and speed up enterprise AI adoption. [Read the overview](https://blog.mean.ceo/?p=10324).

More tomorrow. Have a good Thursday.
