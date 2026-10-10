---
title: "Before an agent goes live: where will its code run?"
date: "2026-10-10"
seoSlug: "ai-agent-sandbox"
excerpt: "AI agent security also depends on where generated code runs: isolation, permissions, and action limits can help contain failures."
tags: ["inteligencia-artificial", "produto", "agentes-de-ia", "governanca-de-ia"]
featured: true
draft: false
---

When an agent runs code it has just generated, the security question is not only “what if it gets something wrong?” It also matters where that error happens and what the code can reach.

Agents that analyze spreadsheets, build reports, or automate routine work may write and run small pieces of code as they go. If that code runs freely inside a company's environment, a failure could reach resources beyond the task. In an isolated sandbox with clear access limits, the impact stays contained and the team can move forward with more confidence.

## Sandboxing code for AI agents

That is what caught my attention about [MXC, an open-source project published by Microsoft](https://github.com/microsoft/mxc). It provides a sandbox system for running untrusted code, such as model outputs, plugins, and tools. The project works on Windows, Linux, and macOS, and offers different levels of isolation, from the operating system's native sandbox to virtual machines.

## Security is part of the agent experience

From a product perspective, I read this as a sign of maturity. The conversation about agents is moving from “what can we do?” to “how can we do it safely and at scale?”

That changes how features are designed. Permissions, audit trails, and action limits become part of the experience instead of an afterthought at the end of a project. The [AI agents guide](/en/guides/ai-agents/) helps teams think about autonomy; [AI governance](/en/guides/ai-governance/) connects responsibility and controls to the product. The [AI risk matrix](/en/guides/ai-risk-matrix/) can also support the assessment of each use case.

## One question for the roadmap

I see this progress with optimism. The easier it becomes to create a containment layer, the more conservative fields such as finance can put intelligent automation to work without giving up control. This decision is also part of [AI product management](/en/guides/ai-product-management/).

If you are considering agents for your roadmap, it is worth starting with one concrete question: where will the code run?

To explore the project behind this reflection, [see MXC on GitHub](https://github.com/microsoft/mxc).

### The rest of the radar

- **DeepSeek 4.1 Flash** — inexpensive, “good enough” models can change the cost equation and pricing of AI features. [Read the analysis](https://www.dgt.is/blog/2026-10-07-deepseek-freek-out/).
- **Step 5 Preview (StepFun)** — an agent-oriented model with a 1-million-token context window and aggressive pricing expands provider and cost options. [See it on OpenRouter](https://openrouter.ai/stepfun/step-5-preview).
- **Whistle (Cactus)** — fully on-device voice in 16.9 MB opens the door to offline, more private features with no per-use API cost. [Learn about Whistle](https://cactuscompute.com/blog/whistle).
- **Deno joins Cloudflare** — teams using Deno Deploy need to plan a migration; Cloudflare is reinforcing its bet on infrastructure for agents. [Read the announcement](https://deno.com/blog/cloudflare).
- **bigarrow** — an example of agent UX that guides people through steps requiring human input without taking control of the screen. [See it on GitHub](https://github.com/franzenzenhofer/big-arrow-on-the-screen).
- **A planet discovered with Claude Code** — a non-expert using a coding assistant may point to new segments and jobs to be done (unverified claim). [See the Reddit post](https://www.reddit.com/r/ClaudeAI/s/mbe5IY2LF9).

That’s all for today. More tomorrow.
