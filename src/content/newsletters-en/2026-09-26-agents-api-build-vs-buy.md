---
title: "OpenAI’s Agents API: what changes in build versus buy"
date: "2026-09-26"
seoSlug: "openai-agents-api-build-vs-buy"
excerpt: "Announced in public beta on September 10, the Agents API offers durable sessions, tools, and subagents. For product teams, the decision is what to buy off the shelf and what still needs to stay under their control."
tags: ["inteligencia-artificial", "agentes-de-ia", "governanca-de-ia", "automacao", "produto"]
featured: true
draft: false
---

Today’s radar is heavy on architecture decisions. There’s a cheaper model, fresh warnings about agent security, and a new option from OpenAI for teams building AI products. That’s the thread I want to pull.

One decision always comes up when I’m designing a new product: build the infrastructure from scratch or use what’s already available in the market.

On September 10, OpenAI announced the Agents API in **public beta** — it has not reached general availability. It brings together durable sessions, tool use, subagents, and the option to run agents in environments hosted by OpenAI or on other infrastructure. [OpenAI’s technical announcement](https://openai.com/index/introducing-the-agents-api/) describes the offering and its current limits.

## What changes in the build-versus-buy decision

This offering changes the build-versus-buy conversation around agent infrastructure. Teams may be able to avoid implementing some orchestration themselves and focus effort on the layers they need to control. A platform provides components; it does not decide which actions an agent can take, which systems it can access, or how the process should be governed.

From a product perspective — especially for automation and receivables — I like to think of a platform like this as a foundation. It does not replace the care required to design the process, action limits, and governance around an agent. But it can reduce the work for teams that want to validate business value before investing in their own infrastructure.

Start by asking whether the problem actually calls for an [AI agent](/en/guides/ai-agents/) and which parts of the workflow make sense to automate. It is also an [AI product management](/en/guides/ai-product-management/) decision: what differentiates the product and needs to stay under the team’s control, and what can be consumed as a service? The answer has to include [AI governance](/en/guides/ai-governance/), because autonomy and access to tools and data have business consequences.

What I find most interesting is how quickly this layer is maturing. Agent-based products are beginning to move beyond exceptions, and the infrastructure around them is taking shape. But maturity matters: the Agents API is still in public beta, so adoption decisions need to account for the current stage and limits of the offering.

Teams that understand early where to use ready-made platforms and where it is worth building something of their own will have an advantage. That is the product decision that really matters here.

For the technical details of the launch, here is the link: https://openai.com/index/introducing-the-agents-api/

## The rest of the radar

**Claude Opus 5.5 costs less** — Anthropic says typical workloads cost about 40% less than Opus 5. Input and output token prices are 20% lower, while cache reads are 60% lower. It is a reminder that model economics depend on usage patterns, not just the price per token. [Anthropic’s details](https://www.anthropic.com/claude-opus-5-5).

**Cybersecurity becomes a restricted-access layer** — Google, Anthropic, and OpenAI announced models and access programs for sensitive cybersecurity work. For regulated AI products, it is another sign that capability, safeguards, and access criteria are being handled together. [Read the coverage](https://thehackernews.com/2026/09/google-anthropic-and-openai-unveil.html).

**Meta Muse gains traction and exposes security flaws** — Interest in the consumer agent has come with questions about privacy and security. A researcher also reported a serious vulnerability in the app. For agent product teams, permissions and connections to external services are part of the product, not an implementation detail. [Security analysis](https://mouse.dev/blog/muse-special/).

**Dataiku takes on agent sprawl** — Agent Management promises to inventory agents from different providers, track business and technical performance, and classify them by risk. Agent observability is beginning to emerge as a category of its own. [Dataiku’s announcement](https://www.dataiku.com/company/news/dataiku-agent-management-general-availability) and [the weekly radar context](https://aiagentstore.ai/ai-agent-news/this-week).

**HubSpot shows real agent adoption** — 19% of Pro Plus customers were already using CRM agents in August, and monthly agent actions grew 3.5 times. These are useful product adoption metrics to watch alongside feature availability. [September 19 summary](https://aiagentstore.ai/ai-agent-news/daily/2026-09-19) and [the original weekly radar](https://aiagentstore.ai/ai-agent-news/this-week).

**Salesforce bets on optional interfaces** — Salesforce announced AIforce, a layer that brings data, workflows, and business logic to different interfaces, including agent experiences. The company also rebranded Headless 360 as AIforce. This changes how teams design products that depend on traditional interfaces. [Official announcement](https://www.salesforce.com/news/stories/aiforce-announcement/?bc=OTH) and [the weekly radar context](https://aiagentstore.ai/ai-agent-news/this-week).

**Loopjacking exposes flaws in human approval** — Research shows how a workflow can present one action for approval and then execute another, breaking the link between what a person saw and what they authorized. This risk deserves attention in multi-agent and approval flows. [Research on the attack](https://adithyanak.com/loopjacking-in-a2a-implementations/) and [the academic paper](https://arxiv.org/abs/2609.21081).

**The UN warns about risks from autonomous agents** — A brief from the Independent International Scientific Panel on AI describes agents that bypassed restrictions, crossed testing environments, and tried to hide actions. It is evidence for taking boundaries, observability, and safeguards seriously as systems gain autonomy. [The UN panel’s brief](https://www.un.org/independent-international-scientific-panel-ai/en/thematic-briefs/ai-agents-misalignment-risks) and [the weekly radar context](https://aiagentstore.ai/ai-agent-news/this-week).

**Ando launches an AI-native team chat** — The startup emerged from stealth with agents as conversation participants and their own inbox, alongside a $20 million raise. It is another attempt to make agent collaboration a native part of the product. [Weekly radar context](https://aiagentstore.ai/ai-agent-news/this-week).

---

That’s it for today. Tomorrow brings more news and more architecture decisions to unpack.
