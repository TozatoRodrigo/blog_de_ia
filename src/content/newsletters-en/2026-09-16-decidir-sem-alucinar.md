---
title: "Decide without hallucinating: why not every AI system needs to generate text"
date: "2026-09-16"
seoSlug: "decide-without-hallucinating"
excerpt: "In credit products, structured decisions can be faster, cheaper and more predictable than text generation — and they need their own architecture."
tags: ["inteligencia-artificial", "modelos-de-ia", "governanca-de-ia", "fintech", "automacao"]
featured: true
draft: false
---

Structured decision models can be a better fit than LLMs for approving applications, setting limits, flagging risk and triggering automations in credit products. The distinction matters because deciding at scale requires speed, predictable cost and no hallucinations.

What held my attention most today was a story about a type of model that does not generate text — it only decides. And the rest of the radar brought everything from a private AI browser and generative 3D modeling to another chapter in the AI startup graveyard.

## Deciding is a different problem from generating text

Whenever someone asks me whether generative AI will solve everything in credit, I think the same thing: it depends on what you are trying to decide.

A large part of what we do every day in credit products is not generating text. It is deciding: approve or decline, release a limit, flag risk, trigger an automation. Fast, inexpensive decisions without hallucinations are a very different problem from writing a polished paragraph.

That is what caught my attention in a story this week. TypeSafe AI, founded by a former OpenAI researcher, launched Jev, which they are calling a "System One Model." Instead of generating text like the LLMs we know, the model produces structured, probabilistic decisions directly from a system's state. No hallucinations. And much faster and cheaper than a traditional LLM for this kind of task.

If you are curious and want to understand the idea of [System One Models](https://typesafe.ai/blog/introducing-system-one-models-and-jev), that is the story I am linking here.

## What this changes in credit products

This connects directly with what we see in structured credit and receivables products. Decision automation cannot be expensive, slow or — above all — inventive. A generative model is excellent at explaining, summarizing and assisting. But for decisions at scale, with governance, the right path may be another type of model, closer to what they are calling a "System One."

I think this distinction will become clearer over the next few months. Not every automation in finance needs a giant LLM running behind it. Sometimes what solves the problem is a lean model built to decide, not to converse.

This changes how I have been thinking about product architecture: clearly separating where language generation belongs from where structured decision-making belongs. They are different problems, and they will probably continue to be solved by different tools. That separation fits a [product management approach for AI](/en/guides/ai-product-management/) that treats capability, cost and accountability as product decisions.

In credit workflows, it also requires [AI governance](/en/guides/ai-governance/). The model may be lean, but the impact of the decision remains high: teams need to define evidence, oversight, limits and what happens when the output differs from expectations. An [AI risk matrix](/en/guides/ai-risk-matrix/) helps calibrate that control without assuming every case needs the same level of review.

## In brief

- Not every AI task in credit is a text-generation task.
- Structured, probabilistic decisions can prioritize speed, cost and predictability.
- LLMs remain useful for explaining, summarizing and assisting, but may not be the best layer for decisions at scale.
- Separating language generation from structured decision-making makes product architecture clearer and more governable.

## The rest of the radar

**Mistral x Mozilla** — Validates the browser as a new AI distribution surface and the demand for "privacy-first" alternatives to big-tech assistants. [Read more](https://mistral.ai/news/mistral-x-mozilla/)

**Gemini 3.8 Live** — Sets a new UX and latency/quality bar for real-time multimodal conversational AI products. [Read more](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/)

**Datamimic** — Reduces the risk of silent regressions in agent products by giving teams control over the test data they use. [Read more](https://github.com/rapiddweller/datamimic)

**Cartesian by Formas** — Shows generative AI moving from 2D images to structured 3D models ready for professional use. [Read more](https://www.formas.ai/cartesian)

**Pizza Bot** — Takes on a central UX problem in agentic products: how to maintain human oversight over asynchronous agents. [Read more](https://github.com/pizza-bot-app/pizza-bot)

**Cloudflare and AI crawlers** — Separates "being found by AI" from "feeding AI for free," a strategic decision for search and content products. [Read more](https://blog.cloudflare.com/accountable-mixed-use-ai-crawlers/)

**OpenAI launches Astra** — Expands what agents can automate through computer use, but brings security risks that call for extra attention. [Read more](https://techcrunch.com/2026/09/03/openai-launches-astra-its-powerful-and-controversial-new-model/)

**The AI graveyard** — Warns about commoditization by large platforms and reinforces why real differentiation beyond an "LLM wrapper" is essential. [Read more](https://techcrunch.com/2026/09/15/the-ai-graveyard-a-running-list-of-projects-and-startups-that-didnt-make-it/)

That is all for today. I’ll keep an eye on what appears tomorrow.
