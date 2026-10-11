---
title: "Rampart masks personal data before prompts leave the browser"
date: "2026-10-11"
seoSlug: "rampart-prompt-privacy"
excerpt: "Rampart masks personal data on-device before a message reaches a chatbot, showing how privacy by design can reduce friction with security and compliance."
tags: ["inteligencia-artificial", "produto", "governanca-de-ia", "seguranca-de-ia", "fintech"]
featured: true
draft: false
---

The question I keep coming across in my reading and product meetings is simple: what happens to the data when someone pastes something into a chatbot? I found a tool that tackles that directly, along with six items for the radar.

Many conversations about AI inside companies end with the same question: “what about the data?” A team wants to save time with a chatbot, while security and compliance need to understand what will go into the prompt: a customer's name, tax ID, card number, or address. Sometimes all it takes is one distracted copy and paste.

## Protecting personal data in AI prompts starts before sending

That is why Rampart caught my attention. It is an open-source tool, still in alpha, that masks personal data in a message before it leaves the browser. Everything happens on the device, in milliseconds. Structured data such as card and identity-document details are detected by rules; names and addresses are handled by a small model that also runs locally. [Read Rampart's introduction](https://ndstudio.gov/posts/say-hello-to-rampart).

What I find most interesting is the reasoning behind it. Instead of asking people to “be careful,” protection is built into the natural path of use. They write as they always have, and the product takes care of the rest before sending the message.

## Privacy by design can unlock adoption

This is the kind of decision that belongs with product teams. When privacy is left until the end of a project, it can become a legal barrier. When it is part of the experience from the start, it can reduce friction with compliance, build user trust, and help adoption move beyond the committee.

In regulated sectors such as finance, that can be the difference between an AI feature that stays in a pilot and one that reaches scale. I am optimistic about this path: the more protection is built in, the more room there is to explore what AI can do well. The decision connects to [AI governance](/en/guides/ai-governance/), [AI product management](/en/guides/ai-product-management/), and risk assessment with the [AI risk matrix](/en/guides/ai-risk-matrix/).

### The rest of the radar

- **Microsoft MXC 1.0.0** — agent isolation is becoming a platform requirement and changing what teams can promise about security and trust. [Read the announcement](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/).
- **Talorys, a self-hosted personal agent on Cloudflare** — a minimal architecture for an assistant with memory and routines, at almost no cost to prototype. [See it on GitHub](https://github.com/rociiu/talorys).
- **Epoch AI: InnovationEval** — calibrates expectations about agent autonomy in R&D and the need for human review in workflows. [Read the study](https://epoch.ai/publications/innovationeval).
- **Nvidia in talks to acquire Reflection AI** — consolidation around open models changes the build-versus-buy equation and supplier-dependence risk. [Read the report](https://www.ft.com/content/052610c5-22b4-4dd4-932e-b7f9f0628b6a).
- **How to monetize AI features** — variable inference costs call for a rethink of pricing, bundling, and margin before launch. [Read Lenny's analysis](https://lennysnewsletter.com/p/how-should-you-monetize-your-ai-features).
- **Pricing AI products, by Stripe** — compares subscription, usage-based, and outcome-based pricing with real cases to inform the decision. [Read the guide](https://stripe.com/fr-ca/guides/pricing-ai-products-lessons-from-leading-ai-companies).

That’s all for today. Tomorrow, I’ll be back with another look at what deserves the attention of people building products.
