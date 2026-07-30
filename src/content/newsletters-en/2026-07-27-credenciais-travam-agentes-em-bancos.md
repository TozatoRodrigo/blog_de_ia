---
title: "What holds AI agents back in banks is not the model — it is the credential"
date: "2026-07-27"
seoSlug: "credentials-ai-agents-banks"
excerpt: "In banks, AI agents only move beyond pilots when they can act with granular permissions, limited scope and audit trails — without exposing credentials to the model."
tags: ["inteligencia-artificial", "agentes-de-ia", "governanca-de-ia", "produto"]
featured: true
draft: false
---

It is Monday and the radar is already full: ten items filtered, most of them about plumbing rather than capability. New models have become routine. What really changed this week was the layer that determines whether an agent leaves the pilot stage.

## In brief

In a bank, an AI agent needs to execute actions without receiving the secret that authorizes access. Granular permissions, limited scope, audit trails and easy revocation are the infrastructure that turns a pilot into a product capable of passing compliance.

Every conversation about an AI agent inside a bank ends in the same place: access.

The idea is great until someone asks how the agent will enter the system. To truly automate a receivables, reconciliation or collections workflow, the agent needs to access something. And handing a credential to a model is a line no security team wants to cross. For good reason.

This week I came across an open-source project that tackles that exact issue. It is a credential gateway: the agent requests the action, the gateway authenticates and executes it, and the key never goes near the model. The agent acts without ever seeing the secret.

It sounds like an infrastructure detail. It is not. It determines whether an automation pilot becomes a product or dies in committee.

Anyone who works in product knows that most good automation ideas are not blocked by a lack of technology. They are blocked because no one can answer who accessed what, with which scope and how to audit it later. Until that answer exists, the roadmap remains stuck.

That is why I find this layer more interesting than the next model release. The capability race is already solved for most use cases. What is missing is the plumbing: granular permissions, limited scope, audit trails and easy revocation. That is what turns an [AI agent](/en/guides/ai-agents/) into something that can pass compliance.

To put this into practice, [AI governance](/en/guides/ai-governance/) stops being an abstract conversation: it helps define identity, accountability and controls for every action. The [AI risk matrix](/en/guides/ai-risk-matrix/) is a useful starting point for sizing human confirmation, authority limits and audit evidence before enabling an automation in production.

That is where it gets interesting. Each of these pieces that matures unlocks a use case that has been stuck for months. On the product side of credit, that means being able to think about automation at the points that truly hurt, rather than only at the edges where the risk was low enough that no one cared. This is central work in [AI product management](/en/guides/ai-product-management/), not a layer added afterwards.

If you want to look at the project, here is the link: [OneCLI](https://github.com/onecli/onecli).

## The rest of the radar

**Screenpipe (YC S26), 24/7 screen recording for agents** — continuous screen and audio memory changes the raw material of agent context, and puts consent and privacy at the center of design. [Read more](https://news.ycombinator.com/item?id=49024620)

**Dynamic Workflows in Claude Code** — agent orchestration moves out of code and into configuration, shortening the experimentation cycle for AI features. [Read more](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)

**Robinhood enables AI agents to trade stocks** — a concrete case of an agent with permission to take irreversible action in a regulated domain; a required reference for designing guardrails and human confirmation. [Read more](https://techcrunch.com/2026/05/27/robinhood-now-lets-your-ai-agents-trade-stocks/)

**Why Software Factories Fail** — explains why productivity gains from coding agents do not automatically become product delivery. [Read more](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md)

**Noisy LLM evaluators are still useful** — challenges the excuse that “we do not have a good enough eval” and unlocks quality measurement early. [Read more](https://www.tensorzero.com/blog/even-very-noisy-llm-evaluators-are-useful-for-improving-ai-agents/)

**From evaluation to guardrails (Mozilla.ai at FAccT 2026)** — connects evaluation metrics to executable production guardrails: the bridge between measuring and controlling. [Read more](https://blog.mozilla.ai/from-evaluation-to-guardrails-what-we-brought-to-acm-facct-2026/)

**Dark patterns in AI chatbots** — applying engagement metrics to chatbots can create manipulation without anyone deciding to do so, with direct reputational and regulatory risk. [Read more](https://www.404media.co/new-study-reveals-the-manipulative-dark-patterns-of-ai-chatbots/)

**Step 3.7 Flash** — another fast, low-cost model on the shelf, putting pressure on unit cost and opening room for features that were previously unviable. [Read more](https://static.stepfun.com/blog/step-3.7-flash/)

**A wave of open weights and ChatGPT Work** — DeepSeek V4, Kimi K3 and enterprise agentic workspaces change the build-vs-buy equation and the strategy for cost and data sovereignty. [Read more](https://www.buildfastwithai.com/blogs/ai-news-today-july-20-2026-16-biggest-stories)

---

That is it for today. The week is starting with plenty to digest.
