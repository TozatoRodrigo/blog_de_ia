---
title: "OpenAI's Dots act on their own: PMs now design for trust"
date: "2026-10-04"
seoSlug: "dots-proactive-agents"
excerpt: "Proactive agents change the product question: what can run in the background, when should it ask for approval, and how does the user regain control?"
tags: ["inteligencia-artificial", "agentes-de-ia", "governanca-de-ia", "produto"]
featured: true
draft: false
---

Five stories made it through my filter today. For product teams, the biggest one is OpenAI's Dots agent. The important shift is not only what it can do; it is what changes in product design when an assistant stops waiting for a command at every step.

The rest of the radar covers prototyping inside ChatGPT, more precise image editing, local models, and real-world data on cost and monetization.

## When proactive AI agents stop waiting for a prompt

OpenAI introduced Dots at DevDay as an agent that can take on ongoing tasks and act proactively. The official product page says it is powered by GPT-6 Astra and has its own cloud computer. At the same event, the company also announced GPT-6.1 Sol and the Ultrafast speed tier. [LA NACION's coverage compared Dots with Meta's Muse](https://www.lanacion.com.ar/usa/openai-ceo-announces-new-ai-agent-and-avoids-mention-of-security-concerns-at-developer-conference-nid29092026/).

People in product spend a lot of time designing screens for users to click: buttons, menus, filters, confirmations. Now imagine a product where users do not need to start every step because the assistant is already working on an assigned task.

To me, that changes the product manager's question from “what screen should I design?” to “what can this agent do on its own, and when should it ask me?”. The answer defines permissions, approval points, how to show what happened, and how to undo or compensate for an action. This brings [AI governance](/en/guides/ai-governance/) together with [operating agents in production](/en/guides/ai-agent-operations/).

The news report noted that Sam Altman did not address security concerns on stage. That describes what was said during the announcement; [OpenAI's product page for Dots details its safeguards](https://openai.com/index/introducing-dots/), including read-only proactive research, safety monitoring, access boundaries, and review of actions that may require approval. Those measures do not remove the need to assess the risks in each workflow. They show why designing for trust belongs in [AI product management](/en/guides/ai-product-management/).

There is a cost to always-on availability, too. An agent working in the background is likely to consume more than a short chat exchange; frequency, duration, and speed all matter. The product itself organizes deeper work around usage allowances and plans to offer ways to increase speed or monthly workload. That makes tracking [AI agent costs](/en/guides/ai-agent-cost-management/) a product concern, not just an engineering detail.

I am optimistic about this shift. Automation that once depended on rigid workflows can become more flexible, making room for useful products across many fields, including finance. The challenge is to start with clear permission boundaries, an audit trail, and a simple way for people to take back control—with the same care we have always put into usability.

## The rest of the radar

- **ChatGPT Sites** — OpenAI brings site, app, and game creation into ChatGPT, shortening the path from idea to a published prototype. [Explore the feature](https://chatgpt.com/features/sites/).
- **FLUX 3 Image (Black Forest Labs)** — bounding-box editing opens up fine-grained control for creative products, with an API and a commercial license. [Explore the model](https://bfl.ai/models/flux-3-image).
- **DwarfStar 4, from Redis's creator** — local inference compatible with OpenAI and Anthropic APIs could make private, lower-cost prototypes viable. [Visit the project](https://dwarfstar.sh/).
- **A month coding with GLM 5.3 Flash (Wagtail)** — shares real cost figures and a model-selection strategy for teams building with AI. [Read the post](https://wagtail.org/blog/one-month-on-glm-53-flash/).
- **How to monetize AI features (Lenny's Newsletter)** — variable usage costs make teams choose between bundling AI, selling it as an add-on, or charging by usage. [Read the issue](https://www.lennysnewsletter.com/p/how-should-you-monetize-your-ai-features).

I'll be back tomorrow with another slice of what caught my eye.
