---
title: "15x lower cost, same result: what it teaches us about agents"
date: "2026-07-22"
excerpt: "A Cursor experiment showed that an agent team's architecture can change cost by 15x without changing the result. For AI products, deciding how agents work together matters as much as choosing the model."
tags: ["inteligencia-artificial", "produto", "agentes-de-ia", "fintech"]
featured: true
draft: false
---

I am opening today's edition with a number that matters to any team considering putting AI agents to work for real. Then I cover the rest of what crossed the radar: new models, desktop agents, and a study on chatbot manipulation that is worth reading.

Whenever someone asks me whether it is worth putting generative AI inside a product, my answer starts with a question in return: have you calculated the cost of the architecture, not just the cost of the model?

This week I saw a case that captures this point well. Cursor tested teams of AI agents rebuilding SQLite from scratch in Rust, using only the documentation and without looking at the original source code. They passed 100% of the tests. That alone would be newsworthy.

What caught my attention was the cost. The cheapest configuration of this agent "swarm" came in at $1,339. The most expensive one, reaching exactly the same result, cost more than $20,000. That is a fifteen-fold difference for the same final product.

That changes the conversation. It is not about which model is the smartest. It is about how you organize agents working together, who plans, who executes, and where every dollar is spent on the path to delivery.

In my day-to-day work, I work on credit products, so I think a lot about scale and efficiency. Every automated process has a cost per operation, and whoever decides the architecture also decides the margin. Agentic AI is no different: how you design the agent workflow matters as much as the model you choose.

I think that is great, because it moves the decision out of the realm of hype and into product engineering, where it can be measured, tested, and compared properly. It still requires sound judgment and risk control, of course, but now there are concrete numbers to support the choice.

For anyone who wants to understand the full test and the numbers behind it, the link is [here](https://cursor.com/blog/agent-swarm-model-economics).

## The rest of the radar

**Qwen-Image-3.0** — Alibaba's new image-generation model competes directly with tools used to create visual product assets. [Read more](https://qwen.ai/blog?id=qwen-image-3.0)

**Kimi Work** — Moonshot AI's persistent desktop agent points toward deep automation that can replace manual work flows. [Read more](https://www.kimi.com/products/kimi-work)

**GPT-5.6 and ChatGPT Work** — A new model family segmented by use case forces a reassessment of cost and vendor choice. [Read more](https://techcrunch.com/2026/07/09/openai-launches-its-new-family-of-models-with-gpt-5-6/)

**Dynamic Workflows in Claude Code** — Orchestrating dozens of subagents in parallel changes what is feasible to deliver in a sprint. [Read more](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)

**NemoClaw Deep Agents (LangChain + NVIDIA)** — A ready-made blueprint reduces inference cost and implementation time for enterprise agents. [Read more](https://www.hpcwire.com/aiwire/2026/07/08/langchain-and-nvidia-launch-nemoclaw-deep-agents-blueprint-for-enterprise-agents/)

**Noisy LLM evaluators can still help** — A practical path to improving agents in production without relying on expensive human review. [Read more](https://www.tensorzero.com/blog/even-very-noisy-llm-evaluators-are-useful-for-improving-ai-agents/)

**Robinhood lets agents trade stocks** — A real financial-product case that gives agents transactional autonomy with limits and prior approval. [Read more](https://techcrunch.com/2026/05/27/robinhood-now-lets-your-ai-agents-trade-stocks/)

**Frigade launches Skills** — It gives any product an assistant that can take real actions in the app without requiring custom integrations. [Read more](https://www.prnewswire.com/news-releases/frigade-launches-skills-giving-any-product-an-ai-assistant-that-takes-action-for-users-no-code-required-302824744.html)

**Dark patterns in AI chatbots** — A study maps 37 manipulative engagement tactics, offering a UX and ethics risk checklist for people building AI products. [Read more](https://www.404media.co/new-study-reveals-the-manipulative-dark-patterns-of-ai-chatbots/)

---

That is all for today. The pace of launches shows no sign of slowing, so see you in the next edition.
