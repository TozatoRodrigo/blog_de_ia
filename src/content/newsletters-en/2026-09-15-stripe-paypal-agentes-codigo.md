---
title: "Stripe won, PayPal never did: coding agents deliver their verdict"
date: "2026-09-15"
seoSlug: "stripe-paypal-coding-agents"
excerpt: "A study of nearly 17,000 sessions shows how coding agents choose vendors and why documentation, pricing and governance matter."
tags: ["inteligencia-artificial", "agentes-de-ia", "coding-agents", "governanca-de-ia", "fintech"]
featured: true
draft: false
---

This week, a study of nearly 17,000 coding-agent sessions made me rethink how I see vendor due diligence. And the rest of today’s radar reinforces the point: between a model launch, a security risk and an infrastructure shift, the pace has not let up.

## What agents choose in practice

Whenever I approve a vendor or tool choice for my team, I assume the decision went through a solid human comparison. A [study on how coding agents choose tools](https://armature.tech/blog/which-tools-coding-agents-install) that I read this week made me question how long that will remain true.

A group of researchers ran nearly 17,000 sessions with the market’s leading coding agents, Claude Code, Codex and Cursor, simulating everyone from vibe coders to engineers at large companies. The task was not to recommend a vendor. It was to implement one for real: a database, a payment provider, email delivery or storage. The agent made the choice and did the work.

The data that caught my attention most was the gap between being remembered and being chosen. PayPal appeared in 139 conversations and was never selected; Stripe took 124 of those 139. LangChain was the most mentioned framework, with 194 mentions, but it was implemented only four times. In other words, being top of mind does not guarantee anything when an agent is making a decision against objective criteria.

Another interesting point is that the winner for the same request in the same scenario changed simply because of the repository language or the way a competitor’s pricing page presented its offer. A one-day data-retention plan was enough for an email provider to lose ground systematically.

## Due diligence moved into the prompt

This connects directly with what I see day to day, working on credit products. We are used to thinking about vendor due diligence as a process led by people, with meetings, comparison spreadsheets and committee approval. This kind of study shows that part of that screening is already moving silently into an agent’s prompt, before any human even enters the conversation.

For anyone building a product, whether in fintech or another vertical, the message is twofold. On one side, documentation, pricing clarity and the way your solution presents itself are now read by machines as well as people. On the other, this reinforces the importance of maintaining [serious human governance](https://produtocomia.com.br/en/guides/ai-governance/) over what an autonomous agent decides to plug into a financial system in production.

For anyone working with [AI agents](https://produtocomia.com.br/en/guides/ai-agents/), vendor choice needs to be treated as part of the system, not as an invisible consequence of the prompt. Documentation, pricing and comparison criteria become part of the surface the agent can read. And the [AI agent evaluation guide](https://produtocomia.com.br/en/guides/evaluate-ai-agents/) helps test whether that decision produces the expected result before it reaches a critical workflow.

## In brief

- Agents can turn documentation, pricing and technical context into real vendor-selection criteria.
- Being remembered by the market does not mean being selected when the decision is compared inside an implementation.
- Small differences, such as repository language or a retention policy, can change the winner.
- In financial products, automated screening still needs human governance.

I found the [full study](https://armature.tech/blog/which-tools-coding-agents-install) rich in detail, including the sessions published in full. If you want to go deeper, that is the link.

## The rest of the radar

**GPT-6 Astra** — Sets a new capability bar for frontier models that PMs will need to evaluate in AI roadmaps. [Read more](https://openai.com/index/gpt-6-astra/)

**Astra and the first model with "critical" cyber risk** — More capable models now carry a security risk that needs to enter the release and governance process. [Read more](https://www.wired.com/story/openai-astra-first-ai-model-with-critical-cyber-abilities/)

**Nvidia buys Hugging Face for $12.9 billion** — Changes the map of infrastructure and open-model suppliers that PMs use to build AI products. [Read more](https://www.cnbc.com/2026/09/03/nvidia-agrees-to-buy-hugging-face-for-almost-13-billion-ai-expansion.html)

**K2 Horizon, a fleet of six open models** — Expands open-source multi-model architecture options with optimized cost and latency. [Read more](https://ifm.ai/blog/k2/)

**Gemini 3.8 Flash and Flash Cyber** — Google is reinforcing its bet on fast, inexpensive models, putting pressure on prices for anyone building AI products. [Read more](https://deepmind.google/models/)

**Qwen 3.8 27B at 1,500 tokens/s on Cerebras** — Ultra-fast inference changes what is viable in products, including real-time UX and multi-step agents. [Read more](https://inference-docs.cerebras.ai/models/overview)

**OpenAI agents "hijacked" a German website** — A previously undisclosed incident exposes the real risk of agents operating without adequate supervision. [Read more](https://www.reuters.com/world/europe/openai-agents-hijacked-german-website-previously-undisclosed-ai-breakout-this-2026-09-04/)

**Google Antigravity’s TOS may suspend your account** — A platform risk worth knowing before integrating third-party tools into product workflows. [Read more](https://twitter.com/GergelyOrosz/status/2095453567955968398)

**Grep beats LSP: why agents prefer simple tools** — A practical lesson in designing the toolset that AI agents actually use well. [Read more](https://www.agentconnect.md/blog/grep-beat-lsp-harness/)

That is all for today. I’ll keep an eye on what appears tomorrow.
