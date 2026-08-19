---
title: "80% cheaper tokens: the backlog of shelved ideas can move again"
date: "2026-08-06"
seoSlug: "ai-cost-backlog"
excerpt: "With GPT-5.6 Luna's input price down 80% and open models competing on cost, previously unviable AI use cases can return to the roadmap. For product teams, lower inference cost changes the math—and shifts value toward workflows, data and business rules."
tags: ["inteligencia-artificial", "produto", "fintech", "finops-de-ia"]
featured: true
draft: false
---

Today was a day for opening two different drawers. One was price, with OpenAI cutting Luna's entry cost by 80%. The other was people, with Jeff Dean and three other strong names leaving Google on the same day. I started with a cost spreadsheet and ended up looking at a supplier's org chart.

I have an old list of product ideas that never made it past the drawing board for one reason: the math did not work.

It was not a lack of willingness or technology. It was cost per operation. When you multiply a few cents by millions of documents, the math kills the idea before it even reaches the committee.

That is why this week's news made me open that list again. OpenAI cut the price of GPT-5.6 Luna by 80%, from one dollar to twenty cents per million input tokens, and from six dollars to one dollar and twenty cents on output. The same announcement cited more than one billion active users and two million enterprise customers.

## In brief

AI inference cost has fallen enough to put previously uneconomical use cases back on the roadmap: document-by-document classification, review beyond sampling and high-volume contract summaries. The competition has moved from capability to price. For product teams, the second look needs to compare cost per task, quality and outcome—not just the model's rate.

And it is not an isolated case. An open 4-billion-parameter model also came out that, after being post-trained for a specific search task, matched a frontier model at one hundredth of the cost. The competition has moved from capability to price.

For anyone working in product, the consequence is very practical: much of what you discarded over the last two years deserves a second look. Document-by-document classification that was too expensive. Review that only made sense through sampling. Contract summarization that stayed out of scope because of volume.

That re-evaluation is part of [AI product management](/en/guides/ai-product-management/): when the economic constraint changes, the team needs to revisit value, quality, risk and cost per task before putting the idea back on the roadmap.

In my day-to-day work with credit products, that is the part I find most exciting. Receivables are a high-volume, low-ticket world, and that is exactly where inference cost decides what can and cannot be automated. Every price drop reopens a whole queue of shelved use cases.

There is another side, and it is worth saying. If your product makes money by reselling tokens with a thin layer on top, that margin is shrinking quickly. Value is moving toward whoever understands the workflow, the data and the business rules—not whoever has access to the model.

For deciding what comes back first, the material on [AI for Product Managers](/en/guides/artificial-intelligence-for-product-managers/) helps put cost, quality, outcome and risk into the same conversation.

Too cheap also calls for judgment. When running a model stops hurting the budget, the temptation is to throw AI at everything without measuring whether it improved anything. But I admit I prefer this problem to the previous one.

For anyone curious and interested in seeing the full numbers, here is the link: https://venturebeat.com/technology/ai-price-wars-openai-cuts-gpt-5-6-luna-prices-by-80-as-model-competition-shifts-toward-cost

## The rest of the radar

**Open 4B model matches GPT-5.6 Sol on retrieval for 100x less** — changes the unit-economics math: a narrow task can move off a frontier model without losing quality. https://neon.com/blog/how-castform-neon-beats-frontier-models-on-price-and-efficiency

**Jeff Dean and Google veterans found Discovery Loop** — points to the next product frontier: agents that close entire experimental cycles, not just generate text or code. https://www.discoveryloop.com/

**Demis Hassabis becomes DeepMind Chair and Jeff Dean leaves Google** — a reorganization in Google's AI leadership affects roadmaps, release cadence and supplier-dependence risk for anyone building on Gemini. https://blog.google/company-news/inside-google/message-ceo/next-chapter-ai-momentum/

**Meta launches Muse Code (beta) and the Muse Spark 1.2 model** — another strong player in coding agents, expanding supplier options and putting pressure on price and quality. https://research.meta.ai/blog/introducing-muse-code-and-muse-spark-1-2

**Prime Agent: a self-improving, open-source agent harness** — an open harness outperforming proprietary ones shows that much of the performance gain lies in orchestration, not just the model. The design of [AI agents](/en/guides/ai-agents/) is also part of this cost-and-quality competition. https://www.primeintellect.ai/blog/prime-agent

**Cloudflare OS: an open platform for agents, apps and work** — redefines the product unit, from a closed app to a conversational workspace that becomes a document, app or continuous workflow. https://blog.cloudflare.com/cloudflare-os/

**Atlassian Rovo exfiltrates data by bypassing security controls** — a concrete case showing that permissions and human-in-the-loop are not enough when an agent has access to network tools. https://www.promptarmor.com/resources/atlassian-rovo-exfiltrates-data

**HyperProbe (YC S26): read-only debugging agents in production** — restricting an agent's scope becomes the product differentiator itself and unlocks adoption in critical environments. https://www.hyperprobe.co

**Goodhart's Law catches up with every benchmark you trust** — choosing a model by public leaderboard is a fragile decision; evaluation needs to reflect the real tasks in your product. https://cacm.acm.org/blogcacm/goodharts-law-comes-for-every-benchmark-you-trust/

That is it for today. More tomorrow.
