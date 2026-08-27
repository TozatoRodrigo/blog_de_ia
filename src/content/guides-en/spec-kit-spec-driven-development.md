---
title: "Spec Kit in Practice: an SDD Tutorial for Product Managers and Tech Leads"
seoTitle: "Spec Kit: an SDD Tutorial for PMs and Tech Leads"
description: "Learn how to use GitHub Spec Kit to turn a product idea into a specification, plan, tasks and verifiable code with a Product Manager, Tech Lead and AI coding agents."
datePublished: "2026-08-27"
dateModified: "2026-08-27"
tags: ["Spec Kit", "Spec-Driven Development", "SDD", "Product Management", "Tech Leadership", "Cursor", "Codex", "Claude Code"]
alternateSlug: "spec-kit-desenvolvimento-orientado-especificacoes"
cluster: product
isHub: false
sources:
  - name: "GitHub Spec Kit — Quick Start"
    url: "https://github.github.com/spec-kit/quickstart.html"
  - name: "GitHub Spec Kit — What is Spec-Driven Development?"
    url: "https://github.github.com/spec-kit/concepts/sdd.html"
  - name: "GitHub Spec Kit — Agentic SDD"
    url: "https://github.github.com/spec-kit/reference/agentic-sdd.html"
  - name: "GitHub Spec Kit — Integrations"
    url: "https://github.github.com/spec-kit/reference/integrations.html"
  - name: "GitHub Spec Kit — Existing Projects"
    url: "https://github.github.com/spec-kit/guides/existing-projects.html"
  - name: "Microsoft Learn — Spec-driven development with GitHub Spec Kit"
    url: "https://learn.microsoft.com/en-us/training/modules/spec-driven-development-github-spec-kit-greenfield-intro/"
  - name: "Cursor — Rules for AI"
    url: "https://docs.cursor.com/context/rules-for-ai"
  - name: "OpenAI Codex — Codex CLI reference"
    url: "https://help.openai.com/en/articles/11096431"
  - name: "Anthropic — Claude Code getting started"
    url: "https://docs.anthropic.com/en/docs/claude-code/getting-started"
  - name: "Google Search Central — AI features and your website"
    url: "https://developers.google.com/search/docs/appearance/ai-features"
howToSteps:
  - name: "Constitution"
    text: "Record the product and team principles and durable constraints before detailing the feature."
  - name: "Specify"
    text: "Describe what will be built, why it matters, for whom, and where the boundaries are, without deciding implementation yet."
  - name: "Clarify"
    text: "Resolve relevant ambiguities with targeted questions before they become implicit decisions."
  - name: "Plan"
    text: "Turn the approved specification into a technical approach covering architecture, stack, interfaces, data, risks, and tests."
  - name: "Checklist"
    text: "Review requirement quality, completeness, and traceability, separating planned coverage from test evidence."
  - name: "Tasks"
    text: "Break the plan into small, dependency-ordered tasks associated with the artifacts that need to change."
  - name: "Analyze"
    text: "Read for consistency across the constitution, specification, plan, checklist, and tasks before writing code."
  - name: "Implement"
    text: "Execute approved tasks and record validation results produced during implementation separately."
  - name: "Converge"
    text: "Compare code and artifacts, record divergences, and open follow-ups when the delivery has not converged."
faq:
  - question: "What is GitHub Spec Kit?"
    answer: "It is GitHub's open-source toolkit for working with Spec-Driven Development. It organizes development into artifacts such as a constitution, specification, plan, checklist, and tasks that guide a coding agent without transferring decisions to AI."
  - question: "How do I install Spec Kit?"
    answer: "With Git, Python 3.11 or later, and uv available, install the CLI with `uv tool install specify-cli` and initialize the project with `specify init . --integration <key>`, replacing `<key>` with `cursor-agent`, `codex`, or `claude`."
  - question: "How do I use Spec Kit in Cursor?"
    answer: "Initialize the project with `specify init . --integration cursor-agent` and use the agent integrated with the repository. Rules in `.cursor/rules/` can complement project context, but they do not replace the specification or human approval."
  - question: "How do I use Spec Kit with Codex?"
    answer: "Initialize with `specify init . --integration codex` and drive the phases through Codex in the repository. Keep general project instructions in `AGENTS.md` when useful, without confusing them with product requirements."
  - question: "How do I use Spec Kit with Claude Code?"
    answer: "Initialize with `specify init . --integration claude` and run the workflow through Claude Code. A `CLAUDE.md` file can hold project context and conventions, while the specification remains the source of decisions for that change."
  - question: "What is the Product Manager's responsibility in an SDD workflow?"
    answer: "The Product Manager owns the problem, user, expected outcome, priorities, scope boundaries, and approval of product decisions. The agent can help explore and draft, but it cannot turn a hypothesis into evidence."
  - question: "Does SDD replace discovery, TDD, or Product Management?"
    answer: "No. SDD structures intent and execution; it does not automate discovery, replace TDD or other tests, or replace Product Management. These practices can complement one another in the same cycle."
  - question: "How do I avoid specification drift during the full cycle?"
    answer: "Use analyze before implementation and converge afterward to compare code, specification, plan, checklist, and tasks. Record changes, request approval for new decisions, and open follow-ups when code or artifacts do not converge."
draft: false
---

A feature can look simple in a chat and still hide important decisions: who can use it, what happens when something fails, which data will be persisted, what is out of scope, and how we will know whether the result worked. That is why a single prompt is rarely a good product specification.

This tutorial shows **how to use Spec Kit** in a Spec-Driven Development (SDD) workflow between a Product Manager, Tech Lead, and coding agent. The example is deliberately concrete: a favorites list for articles in a web product. The thesis is simple: the PM and Tech Lead remain the owners of decisions; Cursor, Codex, or Claude Code accelerates exploration, documentation, and execution.

## Direct answer: what are Spec Kit and SDD?

[GitHub Spec Kit](https://github.github.com/spec-kit/) is an open-source toolkit for organizing specification-driven development. Instead of asking an agent to jump directly from an idea to code, the workflow builds and relates artifacts for intent, requirements, technical approach, and tasks.

**Spec-Driven Development (SDD)** is the practice of treating a rich specification as a working contract before and during implementation. Spec Kit documentation summarizes the core as **Spec → Plan → Tasks → Implement** and expands the path with clarification, analysis, and convergence. The goal is not to create bureaucracy: it is to make decisions explicit and reduce the space for the agent to fill gaps with assumptions.

The official guide describes a refinement progression: `what` and `why` come before `how`; implementation should move forward only when relevant decisions are clear. [Microsoft Learn](https://learn.microsoft.com/en-us/training/modules/spec-driven-development-github-spec-kit-greenfield-intro/) presents the same idea as a way to turn intent into a specification, plan, tasks, and code with human checkpoints.

## What SDD is not

SDD helps organize the work, but it does not solve everything a product team needs to solve.

- **It is not discovery automation.** An agent can summarize supplied interviews, group signals, and suggest questions. It does not replace talking to users, checking evidence, or deciding whether a problem deserves investment.
- **It is not a TDD replacement.** A requirements checklist checks coverage of the specified behavior. Unit, integration, contract, interface, and other tests remain part of the technical strategy.
- **It is not a Product Management replacement.** The PM still defines the problem, outcome, priority, trade-offs, and boundaries. SDD gives decisions a structure; it does not create market evidence.
- **It is not automatic permission to change the product.** If the agent finds a new decision, it must return to the PM and Tech Lead before becoming permanent behavior.

## The workflow between PM, Tech Lead, and coding agent

The workflow works best when each participant has a clear responsibility:

| Moment | Product Manager | Tech Lead | Coding agent |
| --- | --- | --- | --- |
| Intent | Explains the problem, user, outcome, and priority | Surfaces known technical constraints and risks | Organizes context and points out gaps |
| Specification | Approves behavior, scope, and criteria | Questions ambiguity, security, data, and operations | Drafts alternatives and questions |
| Plan | Confirms the solution still serves the outcome | Decides the technical approach and dependencies | Explores the repository and proposes a plan |
| Execution | Validates decisions that change the product | Reviews changes and execution evidence | Implements tasks and updates artifacts |
| Convergence | Accepts or rejects behavior divergences | Accepts or rejects technical divergences | Compares code with artifacts and opens follow-ups |

The agent is not a third approver. It is an accelerator with the ability to read, write, and execute according to the integration and permissions adopted by the team. Approval remains human.

## Prerequisites

To follow the current Spec Kit quick start, have:

- a Git repository;
- Python 3.11 or later;
- [uv](https://docs.astral.sh/uv/) installed;
- a configured compatible agent — in this tutorial, Cursor, Codex, or Claude Code.

In an existing project, choose a branch or restore point and start with a bounded change. The [existing projects guide](https://github.github.com/spec-kit/guides/existing-projects.html) recommends establishing a baseline and avoiding a full system rewrite simply to adopt the workflow.

## Installation and initialization

Install the Spec Kit CLI with:

```bash
uv tool install specify-cli
```

From the project directory, initialize the integration you chose:

```bash
specify init . --integration <key>
```

Replace `<key>` with one of the keys documented for this tutorial. These are the three ready-to-copy commands; choose and run only the one corresponding to the agent your pair adopted:

```bash
specify init . --integration cursor-agent
specify init . --integration codex
specify init . --integration claude
```

The keys select the agent integration; they do not promise that all three products have the same interface, permissions, or execution model. Check the [official integrations reference](https://github.github.com/spec-kit/reference/integrations.html) for the current state. In a new project, the quick start also shows initialization in a named directory, such as `specify init taskify`; here we use `.` to work in the current repository.

After that, the chosen agent can drive the phases through the instruction mechanism it supports. The Spec Kit integration and optional project context files are different layers. Depending on the integration, Spec Kit skills may be available in directories such as `.cursor/skills/`, `.agents/skills/`, or `.claude/skills/`; check what the CLI generated for the selected agent. Some agents use Spec Kit commands or skills; others can receive the prompts below in their interface. The important thing is to preserve artifacts and approvals, not to memorize a specific agent syntax.

## The nine SDD phases in practice

The current full path is:

`constitution → specify → clarify → plan → checklist → tasks → analyze → implement → converge`

There is also a short path — `specify → plan → tasks → implement → converge` — for situations where principles are already recorded, context is known, and ambiguity risk is low. The short path is a team decision, not permission to skip review. For the first favorites feature, use the full path.

### 1. Constitution: durable principles and boundaries

**Objective.** Record product and team principles that should apply to multiple changes: privacy, accessibility, observability, security, compatibility, review practices, and quality criteria. The constitution is not the place to describe every detail of favorites.

**Primary human owner.** Both: the PM brings product and experience principles; the Tech Lead brings technical and operational principles.

**Copyable prompt.**

```text
Help create or review this product's constitution. Use only the context available in the repository and mark any unproven point as a hypothesis. Suggest durable principles for product, accessibility, privacy, security, observability, quality, and review. Do not choose the implementation for the favorites list yet. Separate known facts, hypotheses, decisions requiring approval, and missing evidence. End with the questions the PM and Tech Lead need to answer.
```

**Expected artifact.** A short, versioned constitution that applies to future features, with explicit principles and constraints.

**Approval question.** “Do these principles represent how we want to build and operate the product, or is any of them only a preference for this feature?”

**Correction path.** Remove local details, add missing principles, and flag conflicts for a joint decision. If the team cannot yet explain why a principle is durable, do not treat it as an approved rule.

### 2. Specify: what and why

**Objective.** Capture the problem, users, expected outcome, observable behavior, scope, out of scope, and acceptance criteria without starting with the stack. The [Agentic SDD](https://github.github.com/spec-kit/reference/agentic-sdd.html) documentation emphasizes that specify should answer what and why, not prescribe how.

**Primary human owner.** Product Manager, with Tech Lead review.

**Copyable prompt.**

```text
Create a specification for a favorites list in a web product for articles. The user must be able to mark an article as a favorite and view their favorites list. Describe the user, problem, expected outcome, user stories, acceptance criteria, out of scope, error cases, and open questions. Do not choose a framework, database, endpoint, or architecture. Separate supplied facts, hypotheses to validate, proposed decisions, and needed evidence. Do not invent that anything has been implemented or tested.
```

**Expected artifact.** A readable product specification with testable requirements and scope boundaries; no technical detail is mandatory at this phase.

**Approval question.** “If someone implemented only this document, would they know which behavior to deliver and how to recognize success without guessing a product decision?”

**Correction path.** Return to the problem and ask for examples of success, failure, empty state, authentication, duplication, and removal. If the agent suggests a technology, move it to a technical hypothesis section or wait for plan.

### 3. Clarify: resolve relevant ambiguities

**Objective.** Ask targeted questions about gaps that could change scope, risk, UX, or architecture. Clarify should not become an endless interview: prioritize ambiguities with real consequences.

**Primary human owner.** Both.

**Copyable prompt.**

```text
Read the favorites specification and ask only clarification questions that could change behavior, scope, risk, data, or acceptance criteria. Organize each question by impact and propose options without choosing for us. Include cases such as anonymous users, removed articles, cross-device synchronization, ordering, pagination, persistence errors, accessibility, and telemetry. For each answer received, record whether it is a fact, a validated hypothesis, or an approved decision. Do not write the technical plan yet.
```

**Expected artifact.** Answered questions, decisions added to the specification, and a record of what remains unknown.

**Approval question.** “Is there any remaining ambiguity that could make two people implement incompatible behavior?”

**Correction path.** Do not move forward for convenience. Run a smaller question round, consult product evidence when needed, and update the specification with the answer and its owner. An unanswered hypothesis should remain marked as a hypothesis.

### 4. Plan: how to build it

**Objective.** Turn approved behavior into a technical approach: components, data, interfaces, dependencies, migration, security, observability, tests, and risks. Plan is where how and the stack belong.

**Primary human owner.** Tech Lead, with PM approval for product, timeline, risk, or operational impacts.

**Copyable prompt.**

```text
Based only on the specification and approved decisions for the favorites list, propose a technical plan. Inspect the repository before suggesting changes. Describe the architecture and existing components to reuse, data model, interfaces, error states, authorization, accessibility, observability, test strategy, migrations, and risks. Compare alternatives when there is a trade-off. Separate facts observed in the code, technical hypotheses, recommended decisions, inspection evidence, and items requiring approval. Do not implement anything.
```

**Expected artifact.** A technical plan linked to requirements, with affected files or areas, dependencies, risks, and a validation strategy.

**Approval question.** “Is this plan feasible in the current system, does it preserve the approved behavior, and does it make the risks we are accepting explicit?”

**Correction path.** Request inspection of specific repository areas, require alternatives for irreversible decisions, and return behavior conflicts to specify. A stack chosen without evidence should be downgraded to a hypothesis or justified by the Tech Lead.

### 5. Checklist: review the requirements

**Objective.** Review requirement quality, completeness, and traceability. The checklist verifies that each approved requirement is represented and can be followed to a task or validation method; it is not an implementation test or proof that code was executed.

**Primary human owner.** Both.

**Copyable prompt.**

```text
Turn the favorites specification into a quality, completeness, and traceability review checklist. Cover the happy path, empty states, marking and unmarking, persistence, authorization, unavailable articles, errors, accessibility, responsiveness, privacy, observability, and out of scope. For each item, point to the supporting specification section, related task, and expected validation method. Flag gaps, contradictions, and items requiring automated testing or human review, without recording execution results at this phase.
```

**Expected artifact.** A review checklist with complete, traceable, non-contradictory requirements that distinguishes planned coverage from test evidence to be produced later.

**Approval question.** “Does every important criterion have a clear verification method, and did the checklist avoid introducing a requirement the PM did not approve?”

**Correction path.** Link each item to the specification or task, or remove it. When a requirement is not observable, rewrite it as verifiable behavior or outcome. When validation is visual or business-oriented, state that it requires human review and do not treat it as completed before execution.

### 6. Tasks: order the execution

**Objective.** Break the plan into small, implementable, dependency-ordered tasks. Tasks should point to the artifacts that change, but they should not silently reopen approved decisions.

**Primary human owner.** Tech Lead, with PM review for tasks that change behavior or scope.

**Copyable prompt.**

```text
Break the approved favorites-list plan into small, dependency-ordered tasks. Include interface, domain, persistence, authorization, error-state, testing, and documentation changes when applicable. For each task, state its objective, prerequisites, likely files or areas, covered requirement, and expected evidence. Do not create tasks for out-of-scope features. If you find a new decision, stop and flag it to the PM and Tech Lead instead of assuming it.
```

**Expected artifact.** A dependency-ordered task list with traceability to requirements and the plan.

**Approval question.** “Could another person execute each task without discovering a hidden product decision in the middle of implementation?”

**Correction path.** Split large tasks, fix dependencies, add the requirement reference, and remove unapproved work. If a task depends on missing information, create a decision task or return to clarify.

### 7. Analyze: consistency before code

**Objective.** Read for consistency across the constitution, specification, clarify answers, plan, checklist, and tasks. [Spec Kit's Agentic SDD](https://github.github.com/spec-kit/reference/agentic-sdd.html) treats analyze as a reading stage, not permission to silently change everything.

**Primary human owner.** Tech Lead, with PM participation in product consistency.

**Copyable prompt.**

```text
Perform a read-only analysis of the favorites artifacts. Look for conflicts, requirements without tasks, tasks without requirements, technical decisions that contradict behavior, hypotheses presented as facts, criteria without evidence, and risks without owners. List each finding with severity, affected artifacts, and suggested correction. Do not edit files or mark the implementation as valid.
```

**Expected artifact.** An inconsistency report and an explicit decision about what to correct before implementation.

**Approval question.** “Do the artifacts tell the same story, and do we know which risks are still accepted?”

**Correction path.** Correct the source of the conflict, not merely the most convenient copy. Update the specification if behavior changed; update plan or tasks if only the approach changed; run analyze again until no relevant conflicts remain.

### 8. Implement: execute with evidence

**Objective.** Execute approved tasks while maintaining the link to requirements and the checklist. The agent can read, edit, and execute commands according to its permissions, but every output must be distinguished from a human decision.

**Primary human owner.** Tech Lead during execution; PM approves behavior changes.

**Copyable prompt.**

```text
Implement only the approved favorites-list tasks, in dependency order. Before each change, consult the specification, plan, and corresponding task. Preserve existing repository patterns. Do not invent behavior for gaps: stop and flag the decision. At the end of each task, record changed files, commands executed, observed results, tests not run, and covered checklist items. Distinguish execution facts, hypotheses, and decisions that still need approval. Do not declare success without evidence.
```

**Expected artifact.** The planned code and tests/documentation, together with a separate record of validation results actually produced. The previous phase's checklist indicates coverage and traceability; it is not proof of execution.

**Approval question.** “Does the delivered implementation match the specification, and do we have enough evidence to review behavior, quality, and risk?”

**Correction path.** Stop at test failures or new decisions, investigate the cause, and record the result. If the code reveals that the specification is not feasible, return to plan or specify according to the nature of the change; do not silently alter requirements.

### 9. Converge: verify and close the cycle

**Objective.** Compare code and evidence with the specification, plan, checklist, and tasks. Converge identifies divergences that were not found earlier and creates follow-ups when the delivery is not aligned yet.

**Primary human owner.** Both: the Tech Lead evaluates technical convergence; the PM evaluates product behavior and outcome.

**Copyable prompt.**

```text
Compare the current favorites-list code with the constitution, specification, clarify decisions, plan, checklist, and tasks. Classify each requirement as covered, partially covered, not covered, or not verifiable, citing the available evidence. Look for specification-to-code drift, out-of-scope behavior, stale documentation, missing tests, and technical divergences. Propose risk-ordered follow-ups. Do not close the work as complete if a relevant divergence or missing evidence remains.
```

**Expected artifact.** A convergence matrix, an honest final checklist, acceptance decisions, and versioned follow-ups when needed.

**Approval question.** “Do the PM and Tech Lead accept the relationship between intent, code, and evidence, or is there a divergence that must return to the workflow?”

**Correction path.** Open a follow-up for code, testing, or documentation; reopen specify when the product changed; reopen plan when the technical solution changed. Then repeat analyze and converge for the affected scope.

## Complete example: favorites list for articles

The example below shows how to turn a short idea into concrete requirements. It does not claim that code was written or executed; it is a specification sample for the workflow.

### User stories

1. **Mark an article.** As an authenticated person who found an article useful, I want to mark it as a favorite so I can find it again later.
2. **Unmark an article.** As an authenticated person, I want to remove an article from my favorites when it is no longer relevant.
3. **View favorites.** As an authenticated person, I want to open a list of my favorite articles so I can continue reading.
4. **Have an understandable empty state.** As an authenticated person with no favorites, I want to know that the list is empty and how to add the first item.

### Acceptance criteria

- Given that the person is authenticated and the article exists, when they mark the article, then the visual state changes to favorite and the association is persisted for that account.
- Given that the article is already a favorite, when the person unmarks it, then it disappears from the favorites list after the operation is confirmed.
- Given that the person opens the list, then they see only articles they favorited and can distinguish loading, empty-list, and error states.
- Given that the person has no favorites, then they see an empty-state message with an action to return to exploring articles.
- Given that the same mark command is repeated, then duplicate associations are not created.
- Given that an article was removed or is unavailable, then the list communicates the state clearly and does not expose content the person cannot access.
- Given that persistence fails, then the interface says the action was not confirmed and does not present the item as saved without evidence.
- The favorite control has an accessible name, a state that does not rely on color alone, and keyboard-usable behavior.

### Separating fact, hypothesis, decision, and evidence

To prevent an agent from filling gaps, each artifact can use four labels:

| Label | Example for the favorites case |
| --- | --- |
| **Fact** | The repository already has authentication and an article page — only if inspection confirms this. |
| **Hypothesis** | Authenticated users probably expect favorites to sync across devices — needs validation. |
| **Decision** | The first version will include articles only, with no folders or sharing — PM approval. |
| **Execution evidence** | A test, command, or visual review produced an observable result — record what actually happened. |

This vocabulary improves clarity and traceability: the text makes the status of each statement explicit instead of mixing intent with outcome. It can make content easier for people and systems to read, but it does not guarantee ranking, citations, or inclusion in generative answers.

## How to make the content clear and citable

For technical content that needs to be found and understood, use a verifiable structure. [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features) recommends maintaining SEO fundamentals, visible text, crawlable links, and structured data consistent with the page; there is no special markup that guarantees inclusion in AI features.

- **Give the direct answer first:** define Spec Kit and SDD in language that works without additional context.
- **Use primary sources:** link to official documentation and say when behavior depends on the tool's current version.
- **Show verifiable examples:** copyable commands, acceptance criteria, and a distinction between facts, hypotheses, decisions, and evidence.
- **Be explicit about limits:** clarity and sources help evaluation, but they do not guarantee ranking, citation, or inclusion in a generative answer.

## Cursor, Codex, and Claude Code in the same method

Spec Kit documents integrations by key, including `cursor-agent`, `codex`, and `claude`. The integration installs or makes Spec Kit instructions and skills available through the mechanism expected by the agent; it is not the same as a general project context file and does not change the team's responsibility. [Cursor](https://docs.cursor.com/context/rules-for-ai) also offers versioned rules in `.cursor/rules/`; [Codex CLI](https://help.openai.com/en/articles/11096431) can work locally in a repository by reading, editing, and executing according to the environment; and [Claude Code](https://docs.anthropic.com/en/docs/claude-code/getting-started) is a coding agent operated from the project.

Optional context files help explain repository conventions, commands, and boundaries, but they are a separate layer from the Spec Kit integration. `specify init` does not necessarily create `.cursor/rules/`, `AGENTS.md`, or `CLAUDE.md`, and these files do not activate Spec Kit by themselves. They also do not replace approved requirements, acceptance criteria, or evidence:

| Integration | Initialization | Complementary context | Recommended use in the workflow |
| --- | --- | --- | --- |
| Cursor | `specify init . --integration cursor-agent` | `.cursor/rules/` | Project rules, editing patterns, and context the agent should consider. |
| Codex | `specify init . --integration codex` | `AGENTS.md` | Repository work instructions, safe commands, and review conventions. |
| Claude Code | `specify init . --integration claude` | `CLAUDE.md` | Persistent instructions and project conventions for Claude Code. |

Do not treat `.cursor/rules/`, `AGENTS.md`, or `CLAUDE.md` as the primary source of product decisions. A rule can say “how to work in this repository”; the specification should say “what this change needs to do and why.” If they conflict, pause and return the decision to the PM and Tech Lead.

## Spec Kit, Kiro, OpenSpec, and BMAD: differences in fit

These approaches share the intention of adding more structure to agent-assisted work, but their workflows and organizational units are not identical. The comparison below is factual and does not declare a winner.

| Approach | Structure highlighted in the official docs | May fit better when |
| --- | --- | --- |
| [Spec Kit](https://github.github.com/spec-kit/) | SDD refinement through `constitution`, `specify`, `clarify`, `plan`, `checklist`, `tasks`, `analyze`, `implement`, and `converge`. Integrates different agents. | The PM + Tech Lead pair wants an explicit path from intent to implementation, with versioned artifacts and human approval points. |
| [Kiro Specs](https://kiro.dev/docs/specs/) | Specs organized into requirements, design, and tasks; the documentation also distinguishes Feature, Bug, and Quick Spec. | The team wants an integrated IDE/web experience and a spec format that adapts to types of change. |
| [OpenSpec](https://openspec.dev/docs/schemas/spec-driven) | A change schema that separates proposal, specs, design, and tasks; the quick start presents Explore, Propose, Review, Apply, and Archive. | The team prefers to treat each change as a reviewable proposal, apply it after review, and archive the change history. |
| [BMAD](https://docs.bmad-method.org/reference/workflow-map/) | A modular method with agents, modules, and workflows for planning, architecture, stories, and implementation. | The work requires a broader methodology of roles and workflows, not only an SDD artifact pipeline for one change. |

The choice depends on the operational problem: team maturity, project type, agents used, need for history, level of formality, and review cost. It is also possible to adopt compatible ideas — such as an explicit human review — without mixing files and commands from different methodologies before understanding their contracts.

## Failure checklist before approval

Use this list in `analyze` and again in `converge`:

- [ ] **Ambiguous decision:** could two people still implement different behavior?
- [ ] **Large scope:** should the change be split into smaller increments?
- [ ] **Premature stack:** was technology chosen before the problem and constraints were clear?
- [ ] **Missing criteria:** is an important requirement missing an acceptance condition or expected evidence?
- [ ] **Artifact conflict:** do the specification, plan, checklist, and tasks describe different things?
- [ ] **Spec drift:** have the code, current decisions, and documentation stopped converging?
- [ ] **Execution without human validation:** is someone treating a plausible agent output as product acceptance or test evidence?

When an item fails, do not only ask the agent to “try again.” Identify the artifact that must change, the decision owner, and the evidence needed. This small protocol is what turns SDD into a working system rather than a sequence of long prompts.

## Conclusion

Spec Kit is most useful when the PM and Tech Lead treat it as a shared language for decisions: the PM protects the problem, user, and outcome; the Tech Lead protects feasibility, risk, and quality; the agent accelerates exploration, documentation, and execution. The favorites list is small, but it already shows the principle: an initial sentence must become behavior, criteria, a plan, tasks, and evidence before it can be considered delivered.

To deepen the practice, see the [product management guide](/en/guides/product-management/), [AI product management guide](/en/guides/ai-product-management/), [AI agents guide](/en/guides/ai-agents/), and [AI governance guide](/en/guides/ai-governance/). To follow new product and AI workflows, [subscribe to the newsletter](/en/newsletter/).
