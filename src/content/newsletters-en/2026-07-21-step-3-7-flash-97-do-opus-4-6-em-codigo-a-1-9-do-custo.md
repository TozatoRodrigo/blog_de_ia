---
title: "Step 3.7 Flash: 97% of Opus 4.6's coding quality at one-ninth of the cost"
date: "2026-07-21"
excerpt: "Step 3.7 Flash proposes using a smaller model to drive the work and escalating to more expensive intelligence only at critical points. For AI products, the gain comes from designing the right routing for every step."
tags: ["inteligencia-artificial", "produto", "automacao", "fintech"]
featured: true
draft: false
---

Today's radar is packed with model launches — Kimi K3, LM Studio Bionic, and Step 3.7 Flash, which sparked today's main story. Alongside them, I also picked out a study on dark patterns in chatbots and an account of the fatigue felt by people reviewing agent work. The full radar is worth your time below.

There is a calculation that everyone building AI products ends up making sooner or later: what does each decision an agent makes on its own cost, and where is it worth paying more for greater intelligence?

StepFun launched Step 3.7 Flash this week, a model designed for precisely that calculation. It runs an "advisor mode," in which the smaller model drives the work loop itself and calls a larger, more expensive model only at the task's truly critical points. The reported result is striking: roughly 97% of Claude Opus 4.6's quality on coding tasks at one-ninth of the cost per task.

What catches my attention here is not the benchmark itself. It is the logic behind it.

For a long time, the AI-in-product conversation was simply "which model is best?" Now the question that matters is different: where does frontier intelligence actually change the outcome, and where is it costly waste running on repetitive work?

That connects directly to what I see from the product side of credit. Automating receivables workflows, reconciliation, and document triage all involves plenty of repetitive steps that do not need the market's most expensive model. What they need is a criterion for knowing when to escalate to greater intelligence and when to leave the heavy lifting to a cheaper, faster model.

This kind of hybrid architecture can change the economics of putting AI to work at scale inside a financial operation. It is not about having the strongest model. It is about having the right model at every stage.

For anyone curious about the technical details, the link is [here](https://static.stepfun.com/blog/step-3.7-flash/).

## The rest of the radar

**Kimi K3** — A frontier open model changes the cost-performance equation for teams building products on top of LLMs. [Read more](https://www.kimi.com/blog/kimi-k3)

**LM Studio Bionic** — Local agents running on open models are advancing on real tasks and putting pressure on cloud products such as Copilot and Claude Code. [Read more](https://lmstudio.ai/blog/introducing-lm-studio-bionic)

**NotebookLM became Gemini Notebook** — The rebrand and Gemini integration change the product's distribution, a case study in naming risk and brand consolidation. [Read more](https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/)

**Dynamic Workflows in Claude Code** — A new way to orchestrate dozens of subagents per task, directly relevant to teams building agentic products. [Read more](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)

**Robinhood lets AI agents trade stocks** — A real financial-product case that grants agents autonomy with risk controls, a useful benchmark for agentic UX and governance. [Read more](https://techcrunch.com/2026/05/27/robinhood-now-lets-your-ai-agents-trade-stocks/)

**Noisy LLM evaluators can still help** — Even imperfect LLM evaluation delivers real quality gains for agents, an argument against waiting for the perfect evaluator. [Read more](https://www.tensorzero.com/blog/even-very-noisy-llm-evaluators-are-useful-for-improving-ai-agents/)

**Promptloop, prompt evaluations from the terminal** — An open-source CLI that lowers the barrier to testing prompt quality, useful for small teams. [Read more](https://github.com/Bella3202019/promptloop)

**Human-in-the-loop fatigue** — Teams report reviewing dozens of agent-generated pull requests every night, a warning about poorly designed oversight in AI products. [Read more](https://pydantic.dev/articles/the-human-in-the-loop-is-tired)

**Dark patterns in AI chatbots** — A study maps 37 manipulative patterns in ChatGPT, Gemini, Claude, and companion apps, useful input for responsible design. [Read more](https://www.404media.co/new-study-reveals-the-manipulative-dark-patterns-of-ai-chatbots/)

---

That is all for today. See you in the next edition.
