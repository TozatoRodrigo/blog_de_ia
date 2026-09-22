---
title: "Perplexity Hybrid Compute: privacy by design"
date: "2026-09-22"
seoSlug: "perplexity-hybrid-compute"
excerpt: "Perplexity’s Hybrid Compute moves personal data to the user’s computer when needed. For fintechs, it is a lesson in privacy by design and hybrid architecture."
tags: ["inteligencia-artificial", "governanca-de-ia", "seguranca-de-ia", "fintech", "produto"]
featured: true
draft: false
---

Perplexity’s Hybrid Compute adapts where processing happens to the sensitivity of the information. A task starts in the cloud but can move to the user’s computer when it touches personal data. For teams building financial products, it is a direct example of privacy by design and hybrid AI architecture.

Today’s radar brought an open image model, another low-cost agentic model coming from China and a browser-based distribution partnership. But the main story is different: a product decision that speaks directly to the daily work of people building credit and receivables products.

## What Hybrid Compute changes in practice

There is a phrase I hear constantly in product work: “this is sensitive; it cannot leave here.” Whenever a project involves financial data, that sentence comes before any discussion of the feature itself.

That is why Perplexity’s announcement caught my attention. The company launched a feature called Hybrid Compute that changes where processing happens based on how sensitive the information is. A task starts in the cloud, but when it touches something personal, processing moves to the user’s own computer. A local classifier identifies personal data and prevents it from leaving the machine unnecessarily.

If you want to understand how it works, [read the story about Perplexity’s Hybrid Compute](https://9to5mac.com/2026/09/01/perplexity-launches-privacy-minded-hybrid-compute-ai-feature-for-mac/).

## Privacy is part of product design

What interests me most is not the technology itself, but the product decision behind it. Instead of choosing between everything in the cloud or everything locally, Perplexity designed an architecture that adapts to context. That is exactly the kind of trade-off teams in regulated sectors such as credit and receivables face all the time.

When you build a product on financial data, privacy is not a compliance checkbox. It is part of the experience design. Every screen, automation and AI integration carries the question of who can see what and where that data is processed.

This is a question of [AI governance](/en/guides/ai-governance/) and [AI product management](/en/guides/ai-product-management/). It is not enough to ask whether the model can perform the task. Teams also need to define which data can be processed in the cloud, which data must stay local and how that decision will be explained, monitored and audited.

## The hybrid boundary may become a market standard

This story shows that this kind of care is moving beyond banks and becoming a market practice even in consumer products. I think that is a good sign. The more it becomes standard, the easier it is to argue internally that AI can increase speed without giving up security.

I still believe the future of finance will be hybrid in this sense as well: part artificial intelligence, part strict control over where and how data moves. It is not about choosing one side. It is about designing the boundary well.

To take that principle from abstraction to operations, combine an [AI risk matrix](/en/guides/ai-risk-matrix/) with an [AI system inventory](/en/guides/ai-system-inventory/). That gives the team a way to relate each workflow to the data it handles, where processing occurs and what level of oversight it requires.

## In brief

- Hybrid Compute starts processing in the cloud and can move it to the user’s computer when it identifies personal data.
- A local classifier helps prevent sensitive information from leaving the machine unnecessarily.
- For fintechs, privacy is not only a compliance step: it shapes architecture, experience and governance.
- The lesson is not to choose between cloud and local processing, but to design the boundary around context.

## The rest of the radar

**Qwen-Image-2.1 (Alibaba)** — An open 7B model generates and edits images in the same workflow, reducing cost and complexity for teams building a visual AI feature. [Read more](https://technode.com/2026/09/21/alibabas-qwen-open-sources-qwen-image-2-1-for-unified-image-generation-and-editing/)

**StepFun Step 5 Preview** — Another low-cost agentic model, with a 1-million-token context window and open weights expected in October, expands the options beyond Western players. [Read more](https://www.marktechpost.com/2026/09/20/stepfun-launches-step-5-preview/)

**CUA-S1 (Show HN)** — A small model specialized in form automation points to niche models replacing general-purpose LLMs for UI subtasks. [View it on GitHub](https://github.com/trycua/cua)

**ChatGPT and the “ad collector”** — An independent analysis reports that an identifier associated with ChatGPT was sent to OpenAI by websites using its ad pixel. The report notes that it did not observe the final server-side association of those events with an account. [Read the analysis](https://www.buchodi.com/chatgpt-now-knows-what-you-do-on-other-websites-via-ad-collector/) and [follow the discussion](https://news.ycombinator.com/item?id=49776729).

**Mistral in Firefox** — The partnership with Mozilla to power Firefox’s browsing assistant shows a path to mass distribution through the browser with a focus on privacy. [Read the announcement](https://mistral.ai/news/mistral-x-mozilla/)

That is all for today’s radar. I will keep following it and return tomorrow with more.
