---
title: "DeepSeek 4.1 Flash at $0.003 per task: the AI cost equation has changed"
date: "2026-10-09"
seoSlug: "deepseek-cost-per-task"
excerpt: "An individual account of DeepSeek 4.1 Flash puts AI cost per task in perspective and shows how lightweight models can reopen roadmap options—with measurement and control."
tags: ["inteligencia-artificial", "produto", "agentes-de-ia", "governanca-de-ia"]
featured: true
draft: false
---

Today, what held my attention most was cost per task, not capability. The same radar also brought on-device voice that runs without the cloud and a serious discussion about sandboxing code written by agents.

Anyone working in product knows that every polished feature eventually faces the same question: how much does this cost to run per customer, per month?

That is why an [account of using DeepSeek 4.1 Flash](https://www.dgt.is/blog/2026-10-07-deepseek-freek-out/) caught my attention. A developer says they used the model for a month across about 12 projects. A task that would have cost close to $1 with a frontier model reportedly came out to around $0.003. This is one person’s experience, not a benchmark, so the order of magnitude is worth considering with that caveat in mind.

## Different models for different steps

The strategy they describe is simple: use a low-cost model to plan and do the heavy lifting, then bring in a stronger model only for the final review. It makes sense from a product perspective. Not every task needs to go through the senior engineer.

To me, the main point is that “good enough” has become much cheaper. That changes the roadmap conversation. Features that were previously dropped because the margins did not work—such as analyzing documents at scale, reconciling information, or classifying thousands of items a day—can come back to the table. Measuring [AI agent cost per task](/en/guides/ai-agent-cost-management/) helps teams evaluate the economics with data from their own product.

## Model choice is now part of product design

Choosing a model is no longer a one-time technical decision; it becomes part of designing the solution: where maximum quality is worth paying for, where a lightweight model will do, and how to measure the result with real data before deciding. That is part of [AI product management](/en/guides/ai-product-management/).

I see this with a lot of optimism. As each call gets cheaper, more teams can put AI into real production, including in high-volume, low-margin areas such as finance. Quality and control still matter. The [AI agents guide](/en/guides/ai-agents/) helps teams think through autonomy; [AI governance](/en/guides/ai-governance/) connects limits and accountability to the product. But the economic barrier is falling quickly.

### The rest of the radar

- **Step 5 Preview (StepFun) on OpenRouter** — another agent-oriented model option with a 1-million-token context window and aggressive pricing ($1.00 per million input tokens and $2.70 per million output tokens), for benchmarking and fallback. [See it on OpenRouter](https://openrouter.ai/stepfun/step-5-preview).
- **Whistle, speech-to-text in 16.9 MB** — on-device voice offers privacy and zero cloud inference cost, but it still has no Portuguese support. [Learn about Whistle](https://cactuscompute.com/blog/whistle).
- **Deno joins Cloudflare** — teams using Deno Deploy need to plan a migration. The move also highlights platform risk and the view that the market is converging on Cloudflare as a foundation for agents. [Read the announcement](https://deno.com/blog/cloudflare).
- **MXC, Microsoft’s code sandbox** — running LLM-generated code with isolation is a prerequisite for trust in agent products. [See the project](https://github.com/microsoft/mxc).
- **bigarrow, on-screen arrows for agents** — a practical example of human-in-the-loop: the agent points, and a person decides when an action is sensitive. [See it on GitHub](https://github.com/franzenzenhofer/big-arrow-on-the-screen).

That’s all for today. I’ll be back tomorrow.
