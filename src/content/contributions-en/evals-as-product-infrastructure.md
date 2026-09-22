---
title: "Your AI product needs to remember its own mistakes"
date: "2026-09-21"
seoSlug: "evals-as-product-infrastructure"
excerpt: "Evals turn real failures into infrastructure that keeps up with every change to the model, prompt, or flow."
tags: ["product", "ai-agents", "ai-governance"]
authorId: "ricardo-guia"
translationKey: "ricardo-evals"
featured: true
draft: false
translationNote: "Translated from the original Portuguese contribution."
---

Evals turn real failures into infrastructure that keeps up with every change to the model, prompt, or flow

An AI product can remain fast, available, and technically healthy while delivering worse answers. The deployment goes through, the dashboard stays green, and the problem shows up in the result: a decision without context, a plausible answer with the wrong data, or an agent that hands work back instead of completing the task.

That is an important difference for people who build products with generative models. Traditional tests are still necessary to know whether the API responded, the database wrote, and the tool was called. They cannot tell you on their own whether the answer was good.

In the agents I build, I learned to treat this layer as product infrastructure. The technical name is eval: a set of cases, criteria, and evaluators that runs the product specification against the AI's behavior.

## The same system can change without a single line breaking

In one of my experiments, I kept an agent's entire configuration and changed only the model. The tools, memory, and instructions stayed the same. One model received the task, chose a path, and executed it. The other returned options, comparisons, and clarifying questions.

Both worked. Neither produced a technical error. The product experience was completely different.

This kind of change happens when the team switches models, rewrites the prompt, adds a tool, or changes the data source. It also happens without your own deployment because the provider updates the model behind the API. The output remains grammatically correct and the JSON remains valid. The product simply starts making worse decisions in silence.

An eval suite creates a stable reference for this unstable environment. It answers questions that technical monitoring cannot reach: did the agent use the right source? Did it follow the policy? Did it ask for confirmation before a critical action? Did it complete the task? Did the answer help someone decide, or did it merely sound convincing?

## The specification needs to become executable

Every product has an idea of what “good” means. In many teams, that idea is scattered across the PRD, the head of the product leader, examples in documents, and fixes made in Slack. The model receives a reduced version of it in the prompt, and the rest becomes manual judgment after something goes wrong.

The eval organizes this knowledge into a rubric that can run every time.

The starting point is real situations. A common user question, a task the agent completed well, a failure observed in production, and an edge case that could cause harm. Each example needs to carry the necessary context, the expected output, and the criteria used to judge the result.

In an agent that researches information for a decision, for example, the rubric can check five things: whether it used permitted sources, separated fact from inference, preserved the numbers, cited the evidence, and stopped when information was missing. “Good answer” stops being a feeling and becomes observable behavior.

This definition does not belong only to engineering. Product knows the promise made to the user. Operations knows the exceptions. Domain experts know where an apparently correct answer can cause a problem. Engineering turns that standard into a repeatable system.

## Code first, AI for what remains

Not every criterion needs another model judging the answer. The more objective the rule, the simpler the evaluator should be.

Code checks format, required fields, valid URLs, preserved numbers, use of permitted tools, and the presence of evidence. This layer costs little, runs quickly, and delivers a reproducible result.

An evaluator model enters when the criterion depends on context: whether the recommendation answers the request, the justification is supported by the sources, or the tone fits the situation. In that case the rubric needs to be specific, and the examples need to show what passes and what fails.

Human review belongs on ambiguous, new, or high-risk cases. It also calibrates the other evaluators. When code, model, and person disagree, the conflict often reveals an incomplete specification.

The most useful design combines the three layers: a deterministic rule for what can be proved, model judgment for what depends on language, and human review where the cost of error justifies attention.

## Every failure becomes product memory

Creating a rubric once helps with the launch. The accumulated gain comes later.

When a failure appears in production, the team opens the execution trace and locates the step that changed the result. The case is anonymized, given the expected behavior, and added to the regression suite. The next change to the model, prompt, or tool has to pass it.

This process turns an incident into memory. The product stops depending on the recollection of whoever saw the problem and starts carrying the correction alongside the code.

The overall average matters less than the cases that failed. A 90% score can hide a recurring error precisely in the flow that moves money or publishes something in the user's name. That is why I track results by task, severity, and flow stage. When a case breaks, I look at the trace before changing the system. The score points to the problem. The trace shows where to fix it.

I also avoid calculating agent reliability by multiplying the success rate of each step. The failures in a flow are not independent. A bad context decision at the beginning contaminates search, synthesis, and action. Evaluating the final result and inspecting the path produces a more faithful reading of the product.

## Evals change the product conversation

Without an evaluation suite, the discussion about models tends to revolve around benchmarks, personal preference, or demos. With its own cases, the team can compare changes using the work the product needs to perform.

The question stops being “which model seems better?” and becomes concrete: which configuration completes more important tasks, follows the rules, and costs enough to operate at scale?

This rubric also creates freedom. Switching providers becomes less risky. A prompt can be rewritten without relying on random manual testing. A new tool enters the flow with clear criteria. The team can move forward because it knows what cannot regress.

Start with the errors that have already hurt and the behaviors that support the product promise. Version the cases alongside the system, run the suite at every relevant change, and turn every new failure into a permanent regression.

Models change all the time. The product needs its own memory to keep knowing what it means to deliver well.

## About the author

Ricardo Guia is a product executive and author of Inteligência à Brasileira, where he writes about AI from the perspective of someone who builds systems and products with it. More at https://iabrasileira.com and https://ricardoguia.com.
