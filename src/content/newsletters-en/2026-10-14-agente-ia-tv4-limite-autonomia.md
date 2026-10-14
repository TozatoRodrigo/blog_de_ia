---
title: "AI agent and TV4’s erased footage: how much autonomy is too much?"
date: "2026-10-14"
seoSlug: "tv4-ai-agent-autonomy"
excerpt: "The TV4 case raises a product question: how should teams limit agent autonomy while preserving the value agents can deliver?"
tags: ["inteligencia-artificial", "agentes-de-ia", "governanca-de-ia", "produto"]
featured: true
draft: false
---

Today’s radar is short, but the TV4 case speaks directly to anyone designing products. An incident whose cause has not been confirmed cost a broadcaster months of work and raises an important question about how much autonomy we give automation.

One rule I carry into any product that handles money or important data: never give automation more power than you would be willing to lose.

## What we know — and still do not know — about TV4

TV4 in Sweden postponed a programme’s premiere until 2027 after months of edited footage were erased. [Aftonbladet pointed to an AI agent as responsible](https://swedenherald.com/article/tv4-postpones-the-challenge-until-2027-after-technical-failure-erases-edited-footage). The broadcaster has confirmed only a “technical failure” and has not mentioned AI, so that attribution should be treated with caution.

Even without a confirmed cause, the case is a useful exercise because the scenario is plausible: an agent with permission to edit, organize, and clean up files does those tasks, but its cleanup reaches months of work.

## Set boundaries before delegating

From a product perspective, I see this as a design decision, not a reason to fear agents. What is the least access an agent needs to deliver value? Is there a backup it cannot change? Do irreversible actions require human confirmation? And when something goes wrong, how does the company communicate what it knows without blaming the technology before it understands what happened?

These questions are part of the real product work. The smartest model on the market will not help if the scope of its autonomy was improvised. [AI product management](/en/guides/ai-product-management/) includes deciding where agents can act; the guides to [AI agent operations](/en/guides/ai-agent-operations/) and [AI governance](/en/guides/ai-governance/) can help structure boundaries and controls. If an incident occurs, [AI agent incident response](/en/guides/ai-agent-incident-response/) belongs in the discussion too.

I am optimistic about agents and believe they will take a lot of repetitive work off our hands, in every field. That is exactly why we should learn from other people’s setbacks — which cost less to learn from as a reader — instead of learning from our own.

## The rest of the radar

- **Gemini 4 Argon** — Google’s new frontier model could change the cost-quality equation, but access is still restricted. [Google DeepMind](https://deepmind.google/models/gemini/).
- **Model landscape: GPT-6 Sol/Astra, Claude Opus 5.5, and Gemini 3.8 Flash** — 23 models from 15 providers in September call for a routing and evaluation strategy, not a bet on a single model. [Mean CEO](https://blog.mean.ceo/?p=10962).
- **pg_vectorsearch** — a vector index for Postgres that, if it matures, could reduce RAG cost and complexity by keeping search in the database you already use. [Timescale](https://github.com/timescale/pg_vectorsearch).

That’s it for today. See you tomorrow.
