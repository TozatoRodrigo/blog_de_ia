---
title: "Step 5 Preview: 1 million tokens for about US$1"
date: "2026-09-21"
seoSlug: "step-5-inference-cost"
excerpt: "StepFun's Step 5 Preview combines a 1-million-token context window, 27 billion active parameters and about US$1 per million input tokens. For product teams, that changes which long-running automations fit the economics."
tags: ["inteligencia-artificial", "modelos-de-ia", "finops-de-ia", "fintech", "produto"]
featured: true
draft: false
---

StepFun's Step 5 Preview combines a 1-million-token context window, 27 billion active parameters and a price of about US$1 per million input tokens. For product teams, the point is not the technical hype: it is how AI inference cost changes the economics of which long-running automations can make sense in production.

This week has turned into a race of one model launch after another, and it is easy to miss what actually changes the product equation. Today I picked the launch that made me stop and calculate the cost, plus five more stories worth the next few minutes of reading.

## What Step 5 Preview changes in the product equation

Every week brings a new model promising to be cheaper and more capable than the last. I have lost count of how many price-per-million-token comparisons I have seen just this month.

But one launch this week caught my attention for a specific reason. StepFun presented Step 5 Preview with software engineering and finance as primary use cases, not as a footnote.

It has 600 billion total parameters, with only 27 billion active at a time, a 1-million-token context window and open weights expected in October. The price is around US$1 per million input tokens, a fraction of what many Western models charge today.

For people working in product, this matters less because of the launch itself and more because of the decision space it creates. Every new model that is cheaper and capable of handling long tasks reliably changes the calculation of which automations belong in production and which are still too expensive to scale.

If you want to read the full story, [read the coverage of the Step 5 Preview launch](https://www.marktechpost.com/2026/09/20/stepfun-launches-step-5-preview/).

## Long context can make previously expensive automations viable

I work with products in receivables and structured credit, and much of the challenge there is exactly this: long processes with many steps and dependencies that still rely on rigid automation or people reviewing cases one by one.

An agent that can maintain a 1-million-token context at low cost starts to make workflows viable that previously only paid off for very large operations. That puts [AI agent cost management](/en/guides/ai-agent-cost-management/) at the center of the conversation: it is not enough to ask whether the model can perform the task; we also need to know what each execution costs, how consumption grows and where automation actually creates value.

This is a [AI product management](/en/guides/ai-product-management/) question. Inference pricing is not an infrastructure detail when it determines whether a journey can be offered to a few customers or to an entire customer base.

## A cheaper model does not remove human judgment

This does not replace human judgment in sensitive decisions — far from it. A larger context window and a lower price expand what can be tested, but they do not solve security, quality, explainability or accountability on their own.

As a product professional, I like following launches like this because they redraw what is economically viable to build month after month. The better next question is not “which model won the benchmark?” but “which workflow starts to make sense now that the economics have changed?”

To answer that more clearly, it helps to combine an understanding of [AI agents](/en/guides/ai-agents/) with the [artificial intelligence for Product Managers guide](/en/guides/artificial-intelligence-for-product-managers/): understand the task, measure cost per outcome and define boundaries before scaling.

## In brief

- Step 5 Preview has 600 billion total parameters, 27 billion active at a time and a 1-million-token context window.
- Pricing of about US$1 per million input tokens lowers the economic barrier for long-running tasks.
- In receivables and credit products, that can reopen automations that previously only paid off at very large operations.
- Lower cost expands the decision space, but it does not replace human judgment, security or governance in sensitive workflows.

## The rest of the radar

**Qwen-Image-2.1 (Alibaba)** — An open 7B model that generates and edits images in the same workflow, reducing cost and complexity for visual features in AI products. [Read more](https://technode.com/2026/09/21/alibabas-qwen-open-sources-qwen-image-2-1-for-unified-image-generation-and-editing/)

**CUA-S1, an open computer-use model** — Small, task-specialized models instead of a general-purpose LLM can make products that automate interfaces and forms cheaper and more reliable. [View it on GitHub](https://github.com/trycua/cua)

**ChatGPT tracking activity through an “ad collector”** — Signals OpenAI moving toward ad monetization through cross-site data collection, something AI PMs need to anticipate in terms of privacy and trust. [Read the discussion](https://news.ycombinator.com/item?id=49776729)

**Mistral becomes Firefox’s AI engine** — The Mozilla partnership shows a path to mass distribution through the browser for privacy-focused AI, relevant to anyone thinking about go-to-market and differentiation. [Read the announcement](https://mistral.ai/news/mistral-x-mozilla/)

**Perplexity launches hybrid cloud-plus-local AI on Mac** — An architecture that combines cloud and local processing, with an open-source PII classifier, is a practical example of privacy by design that could become a competitive differentiator. [Read more](https://9to5mac.com/2026/09/01/perplexity-launches-privacy-minded-hybrid-compute-ai-feature-for-mac/)

That is all for today. More tomorrow.
