---
title: "Lovable spent $85K in tokens to multiply PRs by 5x"
date: "2026-07-05"
excerpt: "How Lovable scaled from 20-30 to over 150 pull requests per week using multiple coding agents in parallel — and what it means for those automating product processes."
tags: ["agentes-de-ia", "coding-agents", "finops-de-ia", "automação", "produto"]
featured: true
draft: false
---

Today's radar came packed with contradictory signals: on one side, real data on the cost of scaling coding agents; on the other, reports of regression in the very tools we use every day. It paints a picture of a moment where technology moves fast, but not always forward.

Every week someone asks me whether it's worth putting AI to work for real inside a product team, or if it's all just hype.

A case I saw this week helps answer that with numbers, not opinion.

Lovable, an AI development startup, shared how they scaled from 20 to 30 pull requests per week to over 150, using multiple coding agents simultaneously. The cost since January: $85K in tokens.

What caught my attention wasn't the amount spent. It was the structure behind it. They classified changes by risk level, layered automated review, and built reusable "skills" for the agents.

This is exactly what we discuss when the topic is scaling automation in financial products. There's no point in turning on a bot and stepping aside. The real work is in designing the governance, deciding where the human steps in and where the machine handles it on its own.

I work on the product side in credit and receivables, and the logic is the same. Automating without a risk framework becomes a headache fast. Automating with layered review and impact classification is what turns speed into real gains.

The takeaway: even with dozens of agents running in parallel, human attention remains the scarcest resource in the process.

For those curious to see the details of how they pulled off this scale, the link is here: https://lovable.dev/blog/85000-in-tokens-later-scaling-agentic-coding-at-lovable

## The rest of the radar

**GPT-5.5 Codex with reasoning regression** — reveals a reliability flaw in a widely used coding agent; worth monitoring before shipping features that depend on it. [Read more](https://github.com/openai/codex/issues/30364)

**Better models, worse tools** — Opus 4.8 and Sonnet 5 hallucinate fields when calling tools outside the Claude Code standard, posing integration risks for those building on the Anthropic API. [Read more](https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/)

**Possible session leak in Claude Code** — an issue with nearly 300 upvotes flags a risk of account isolation failure, relevant for vendor due diligence. [Read more](https://github.com/anthropics/claude-code/issues/74066)

**sqlite-utils 4.0rc2, mostly written by AI** — Simon Willison spent $149.25 in tokens on Claude Fable; a real data point on the cost of agentic coding in a mid-sized project. [Read more](https://simonwillison.net/2026/Jul/5/sqlite-utils-fable/)

**In-memory layers to reduce LLM overhead** — RidgeText's pattern cuts context usage from ~125K to ~150 tokens per interaction; a reusable architecture for products that orchestrate multiple sources. [Read more](https://ridgetext.com/blog/mapbox-llm-composition)

**Z.ai's GLM-5.2 pressures Anthropic** — Chinese open-weight model targets long-horizon coding and safety, broadening cost and self-hosting options. [Read more](https://techmymoney.com/2026/07/05/zai-glm-52-open-weight-ai-security-coding/)

**US now also limits OpenAI models** — after restricting Anthropic, the US government is limiting access to OpenAI's new models on national security grounds; a real availability risk for those depending on frontier models in the US. [Read more](https://openthemagazine.com/technology/uncle-sam-says-no-after-anthropic-the-us-now-limits-access-to-openais-new-ai-models)

**Meta promises parity with GPT-5.5 (without proving it yet)** — Chief AI Officer claims they'll match it with 10x more compute, but with no public benchmarks; treat as directional, not as a basis for decisions. [Read more](https://www.techtimes.com/articles/319723/20260704/meta-watermelon-ai-claims-gpt-55-parity-benchmarks-remain-unnamed-unverified.htm)

**Is it worth chasing every new model?** — article argues that migrating at every release rarely pays off; better to evaluate stability and real gains before switching models in production. [Read more](https://www.pcmag.com/opinions/stop-chasing-the-latest-ai-models-theyre-rarely-worth-your-time-or-money)

---

That's all for today's radar. I'll keep an eye on what's coming and bring you more tomorrow.
