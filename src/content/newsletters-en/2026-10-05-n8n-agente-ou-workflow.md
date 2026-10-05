---
title: "n8n: AI agent or workflow for your product roadmap?"
date: "2026-10-05"
seoSlug: "n8n-agent-or-workflow"
excerpt: "Choose when a predictable workflow is enough and when ambiguity justifies an agent, weighing cost, control, and risk on the roadmap."
tags: ["inteligencia-artificial", "agentes-de-ia", "governanca-de-ia", "produto"]
featured: true
draft: false
---

The week began with three frontier models competing on price. But the thing that made me think most was an automation tool. I’ll start there and leave the models for the roundup below.

People who work in product learn early that the most expensive question is not “Can we do this with AI?” It is “Does this need to be AI?”

That question came back with n8n’s new Agents experience, which is still in Preview. The [official n8n announcement](https://blog.n8n.io/introducing-n8n-agents/) describes a distinction many people treat as interchangeable: workflows and agents.

## Workflow or agent: which problem does each solve?

A workflow is a fixed path. You design every step, know what goes in and what comes out, and can explain the result to an auditor. An agent works differently: it receives an open-ended request, chooses which tools to use, can call workflows, keeps memory, and can run on a schedule or through Slack.

What caught my attention was the care around cost and control. One agent turn counts as one execution, and sensitive tools can require human approval before an important action happens. That is thoughtful product design: autonomy with a handbrake. Those boundaries also belong in [AI governance](/en/guides/ai-governance/) and [operating agents in production](/en/guides/ai-agent-operations/).

In practice, this makes the roadmap conversation more mature. Repetitive, predictable tasks should stay workflows: they are cheap and easy to monitor. Agents fit when there is real ambiguity, the request changes each time, and the value lies in deciding which path to take.

For product teams, that distinction becomes a prioritization criterion. Every additional agent brings model cost, the risk of unexpected behavior, and another thing to explain to compliance. That is why tracking [AI agent costs](/en/guides/ai-agent-cost-management/) belongs in the decision. Every well-built workflow is scale without drama. It is a product choice within [AI product management](/en/guides/ai-product-management/).

I am very optimistic about agents and believe they will take up a huge space in the coming years. But a product manager who knows when not to use an agent will deliver more value than one who puts an agent in everything.

For the launch details on cost and control, here is the [full article](https://kingy.ai/news/n8n-agents-2026-what-changed-cost-controls/).

## The rest of the roundup

- **GPT-6.1 Sol** — nearly at Astra’s level for one-fifth of the price, changing the cost-per-feature math and model choice on the roadmap. [Read the report](https://digg.com/tech/mz36yngf).
- **Claude Sonnet 5.5** — faster and more token-efficient at the same price, expanding what fits into interactive features and agents. [Read the coverage](https://iphonesoft.fr/2026/09/29/anthropic-claude-sonnet-5-5-ia-plus-rapide-moins-chere).
- **Gemini 4 Argon** — a closed rollout and promotional pricing suggest access and cost may still change; plan without depending on it. [Read the report](https://www.thestack.technology/google-finally-eases-open-the-lid-on-gemini-4-argon/).
- **Strata** — local inference compatible with OpenAI and Anthropic APIs opens privacy options and zero per-token cost for prototypes and sensitive data. [Visit the project](https://github.com/Niko1221/Strata).
- **SCM** — multimodal photo and video search without a cloud service or account, a useful UX reference and example of privacy as a differentiator. [Visit the project](https://github.com/allenv0/SCM).

That’s all from me. More tomorrow.
