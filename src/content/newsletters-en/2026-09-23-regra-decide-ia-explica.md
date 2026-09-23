---
title: "Rules decide, AI explains: the middle path for AI in finance"
date: "2026-09-23"
seoSlug: "rules-decide-ai-explains"
excerpt: "In financial products, a rules engine can make predictable decisions while generative AI explains why with traceable source documents."
tags: ["inteligencia-artificial", "governanca-de-ia", "seguranca-de-ia", "fintech", "produto"]
featured: true
draft: false
---

There was a lot on today’s radar: a new Anthropic model, Grok inside Tesla cars and two serious cases showing what happens when we trust AI too much. In the middle of it all, the story that stayed with me was a small project that speaks directly to people building products in regulated industries.

Anyone who works on financial products has heard this question many times: “okay, but why did the system decide that?”

And, honestly, “the model did it” has never been an acceptable answer. Not to the customer, not to compliance and not to the regulator.

## When rules decide and AI explains

Today I came across a project I found especially smart for that reason. It is called AI·rete·RAG, and the idea is simple: a deterministic, predictable rules engine makes the decision. Generative AI comes afterward to explain why, citing the company’s actual documents that support the decision.

In other words, each part does what it does best. Rules provide consistency. AI translates the decision into language a person can understand, with sources.

If you want to understand the implementation, [take a look at the AI·rete·RAG project](https://ai-rete-rag.com/).

## Explainability is part of the financial product

From a product perspective, this changes the conversation quite a bit. Many teams still see AI in regulated sectors as an all-or-nothing choice: either let the model decide and accept the black box, or do not use AI at all. This kind of architecture shows a middle path, and I think that is where most of the value will be in the coming years.

Think of any journey involving a denial, a limit, a term or a different condition. The customer receives a clear, traceable explanation, the support team no longer has to hunt through manuals for a justification and audits become much easier.

To me, that is the good news: explainability has stopped being a brake on AI in finance and is becoming a product feature. Teams that design this layer well will earn trust, and trust is what makes any financial product scale.

This is a question of [AI governance](/en/guides/ai-governance/) and [AI product management](/en/guides/ai-product-management/). It is not enough to ask whether the model can perform the task. Teams also need to define which rules make the decision, which documents support the answer and how the explanation will be monitored and audited.

## The middle path for regulated industries

The value of this architecture comes from separating two responsibilities that do not need to live in the same component. Rules can remain predictable, consistent and auditable. AI can handle translation, summarization and the conversation with the person — always grounded in the company’s actual documents.

It is a middle path between automating sensitive decisions through a black box and giving up on AI in regulated products. To put the principle into practice, combine an [AI risk matrix](/en/guides/ai-risk-matrix/) with an [AI system inventory](/en/guides/ai-system-inventory/). That gives the team a way to relate each workflow to the type of decision, the evidence that must be cited and the level of oversight it requires.

## In brief

- A deterministic rules engine can make financial decisions consistently and predictably.
- Generative AI can explain the reason in natural language, citing the documents that support it.
- Separating decision and explanation reduces reliance on a black box in regulated journeys.
- Explainability is no longer only a compliance requirement; it is part of the product experience.

## The rest of the radar

**Claude Opus 5.5 (Anthropic)** — A new flagship with 40% lower cost and agentic gains, making previously expensive features more viable. [Read more](https://www.anthropic.com/claude-opus-5-5)

**MiMo v2.6 (Xiaomi)** — Xiaomi joins the race for open multimodal frontier models, expanding the options beyond Western APIs. [Read more](https://mimo.xiaomi.com/mimo-v2-6)

**Grok in Tesla cars** — A layered monetization model for AI agents embedded in hardware, beyond traditional chat. [Read more](https://dataconomy.com/2026/09/23/tesla-grok-bot-voice-errands-email-management/)

**Serious failure in Meta’s Muse** — A warning about exfiltration guardrails in agents with broad access to files and tools. [Read more](https://arstechnica.com/security/2026/09/muse-metas-extraordinarily-privileged-ai-assistant-has-a-serious-0-day/)

**The Pentagon and Palantir’s AI** — An extreme but instructive case about automating high-risk decisions without robust human control. [Read more](https://gizmodo.com/pentagon-investigators-say-overreliance-on-palantir-ai-tech-contributed-to-u-s-strike-that-killed-123-iranian-children-2000814477)

**AI became Linear’s CI bottleneck** — Coding agents shift the bottleneck from writing code to validating code. [Read more](https://linear.app/now/ci-bottleneck-reworked)

**The economics of open-weight inference** — Concrete cost data for build-versus-buy decisions and infrastructure choices. [Read more](https://data.ornn.com/publications/the-economics-of-open-weight-inference)

**The “expert” cited by Forbes and Vice was AI-generated** — A real reputational risk for products that generate content or AI expert personas. [Read more](https://pressgazette.co.uk/news/prominent-art-therapist-quoted-by-vice-forbes-and-others-is-ai-generated/)

**Muse comes to Meta’s glasses at Meta Connect** — AI assistants moving out of the app and becoming the hardware’s interface itself. [Read more](https://www.engadget.com/2262932/what-to-expect-at-meta-connect-2026-new-ai-glasses-a-mixed-reality-headset-and-more/)

That is all for today’s radar. More tomorrow.
