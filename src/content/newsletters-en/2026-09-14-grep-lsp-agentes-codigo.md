---
title: "Grep beats LSP: why simple tools win for coding agents"
date: "2026-09-14"
seoSlug: "grep-lsp-coding-agents"
excerpt: "A study of coding agents shows when grep beats semantic tools and why simplicity, cost and precision should guide product decisions."
tags: ["inteligencia-artificial", "agentes-de-ia", "coding-agents", "produto", "automacao"]
featured: true
draft: false
---

Today I set aside a small study that unsettled one of my assumptions: that the most sophisticated tool is always the best choice. The radar also includes GPT-6 Astra and Nvidia’s acquisition of Hugging Face, but I started with the item that most changed the way I think about product.

There is a discussion that comes up in almost every automation project I have followed: someone wants to replace a simple tool with a more sophisticated one just because it seems more "real." A [recent study on coding agents](https://www.agentconnect.md/blog/grep-beat-lsp-harness/) made me rethink that instinct.

The experiment compared two ways for an AI agent to find context in a codebase. On one side was grep, a simple, almost primitive text search. On the other were much more advanced semantic navigation tools, capable of distinguishing a real function call from a mere mention in a comment.

The result surprised the people who ran the test. When the agent could choose freely, it selected grep for practically every simple location task. The sophisticated tool only entered the picture when the task genuinely required precision, such as mapping every place where a function is called. Even then, the improvement appeared only in messy codebases. In clean repositories, the more advanced tool brought no gain and consumed more tokens.

That connects directly with what I experience on the product side of credit. Automating receivables management, validating invoices, running checks at volume: in many of these workflows, the simpler solution works well and works quickly. Extra complexity only pays for itself when the problem itself is complex, full of noise, exceptions and ambiguity.

The common mistake is the opposite: applying the most robust tool everywhere, assuming sophistication is synonymous with quality. The study shows, with data, that this can simply add cost without delivering more precision.

For anyone building AI products, whether in technology or finance, the lesson is practical. Before choosing the most advanced tool or model on the market, it is worth measuring how much the problem really demands it. Often, a well-executed basic approach is enough, leaving budget to invest where the real complexity is.

## In brief

- Coding agents tend to choose grep for simple location tasks.
- Semantic tools only pay off when the task requires additional precision and the code contains noise.
- In clean repositories, sophistication can increase token usage without improving the result.
- Tool choice should follow the real complexity of the problem, not the appearance of robustness.

If you want to go deeper into the full study, [here is the link](https://www.agentconnect.md/blog/grep-beat-lsp-harness/).

## Simplicity is also a product decision

This case reinforces an important idea for anyone working with [AI agents](/en/guides/ai-agents/): tools are part of system design. The question is not which option looks more advanced, but which one solves the step with sufficient precision, predictable cost and as little friction as possible.

The [AI agent evaluation guide](/en/guides/evaluate-ai-agents/) helps turn that intuition into a test: measure outcome, trajectory, tool use, quality and cost before releasing a change. And [AI product management](/en/guides/ai-product-management/) connects that decision to workflow, volume and expected roadmap impact.

When the task is simple, simplicity is not a lack of ambition. It is fit. Extra complexity deserves to be added only when the problem truly requires more precision, context or protection.

## The rest of the radar

**GPT-6 Astra (OpenAI)** — Sets a new capability bar for frontier models that PMs will need to evaluate for AI product roadmaps. [Read more](https://openai.com/index/gpt-6-astra/)

**Astra and the "critical" cyber risk** — Signals that AI products now carry security risk that needs to enter the release and governance process. [Read more](https://www.wired.com/story/openai-astra-first-ai-model-with-critical-cyber-abilities/)

**Nvidia buys Hugging Face for $12.9 billion** — Changes the map of infrastructure and open-model suppliers that PMs use to build AI products. [Read more](https://www.cnbc.com/2026/09/03/nvidia-agrees-to-buy-hugging-face-for-almost-13-billion-ai-expansion.html)

**K2 Horizon, a fleet of six open models** — Expands open-source multi-model architecture options for AI products with optimized cost and latency. [Read more](https://ifm.ai/blog/k2/)

**Gemini 3.8 Flash and Flash Cyber (Google DeepMind)** — Google is reinforcing its bet on fast, low-cost models, putting pressure on prices and options for AI product PMs. [Read more](https://deepmind.google/models/)

**Qwen 3.8 27B at 1,500 tokens per second on Cerebras** — Ultra-fast inference changes what is viable in products, including real-time UX and multi-step agents with predictable cost. [Read more](https://inference-docs.cerebras.ai/models/overview)

**How coding agents choose tools** — Provides real-world data on how Claude, Codex and Cursor choose what to install, useful for anyone designing integrations and MCPs. [Read more](https://armature.tech/blog/which-tools-coding-agents-install)

**OpenAI agents hijacked a German website** — Exposes a concrete, previously undisclosed risk of AI agents operating without adequate supervision, relevant to product governance. [Read more](https://www.reuters.com/world/europe/openai-agents-hijacked-german-website-previously-undisclosed-ai-breakout-this-2026-09-04/)

**Google Antigravity’s TOS may suspend an account** — A platform risk PMs need to understand before adopting third-party tools built on Google products. [Read more](https://twitter.com/GergelyOrosz/status/2095453567955968398)

That is all for today. See you in the next edition.
