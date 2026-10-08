---
title: "Haiku 5.5 costs 75% less: which features return to the roadmap"
date: "2026-10-08"
seoSlug: "haiku-55-inference-cost"
excerpt: "Haiku 5.5’s lower average cost puts roadmap features back on the table. Learn how to choose the right model for each step while keeping quality and control."
tags: ["inteligencia-artificial", "produto", "agentes-de-ia", "governanca-de-ia"]
featured: true
draft: false
---

Today's edition is about price, not capability. On the same day, a cheaper model arrived alongside GPT-6 with an interface inside the chat and an agent configured in YAML.

Every AI product I've seen come to life has had the same conversation somewhere along the way: the idea is great, the prototype works, and then someone opens the cost spreadsheet.

That's what made me stop at the Claude Haiku 5.5 announcement. Anthropic launched a small model priced at $0.10 per million input tokens and $0.50 per million output tokens for prompts up to 100,000 tokens. The company says its average cost to run is about 75% lower than Haiku 4.5. The model also has an adjustable effort setting and beta support for computer use and browser use in the Python and TypeScript SDKs. [Read the full announcement](https://www.anthropic.com/claude-haiku-5-5).

## Which features return to the roadmap when costs fall

For product teams, the point isn't the model itself. It's what happens to the bill. Many features that sat in the backlog with a “doesn't make financial sense” label return to the table when the cost per call drops this much.

Think about high-volume tasks: classifying documents, summarizing interactions, providing real-time support, or splitting a larger job among several subagents. These are cases where costs multiply quickly and a lightweight model can make sense.

That's when the question changes. It stops being “can we use AI here?” and becomes “what is the right model size for each step?” Using the most capable model for everything becomes wasteful. Understanding that choice is part of [AI product management](/en/guides/ai-product-management/), and measuring [AI agent cost per task](/en/guides/ai-agent-cost-management/) helps show whether a feature actually makes financial sense.

## Lower cost still needs clear criteria

It's worth measuring quality at each step, defining where a person reviews the result, and setting clear limits on what an agent can do by itself. The [AI agents guide](/en/guides/ai-agents/) helps teams think through tool use and autonomy; [AI governance](/en/guides/ai-governance/) connects those boundaries to product accountability.

With a lighter bill, teams can test more, make cheaper mistakes, and learn faster. I like this shift. When the technology becomes more accessible, product builders have more room to experiment.

### The rest of the radar

- **GPT-6 and “Intelligent UI” in ChatGPT** — responses with charts, buttons, and forms generated inside the chat reset expectations for UX in conversational products. [Read the announcement](https://openai.com/index/gpt-6-for-everyone/).
- **Docker Agent** — declarative agents in YAML can be shared through OCI registries, reducing the effort required to prototype and standardize agents. [See the project](https://github.com/docker/docker-agent).
- **Google Playground** — an experimental platform for creating games with prompts, sharing them, and publishing them to a gallery. Creation access is rolling out in tiers based on a Google AI subscription. [Read the announcement](https://blog.google/innovation-and-ai/technology/ai/playground-experimental-gaming-platform/).
- **Meta and Microsoft reduce internal use of Claude** — the headline reports a reduction in employee use, a signal worth watching for vendor cost and strategy. Only the headline was checked; the reasons have not been verified. [Read the report](https://www.rswebsols.com/news/meta-and-microsoft-take-steps-to-reduce-employee-usage-of-claude-ai/).

That's it for today. I'll be back tomorrow.
