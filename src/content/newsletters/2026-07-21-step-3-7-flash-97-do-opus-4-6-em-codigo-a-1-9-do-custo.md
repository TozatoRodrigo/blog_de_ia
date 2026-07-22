---
title: "Step 3.7 Flash: 97% do Opus 4.6 em código a 1/9 do custo"
date: "2026-07-21"
excerpt: "O Step 3.7 Flash propõe usar um modelo menor para conduzir o trabalho e escalar para inteligência mais cara só nos pontos críticos. Para produtos com IA, o ganho está em desenhar o roteamento certo para cada etapa."
tags: ["inteligencia-artificial", "produto", "automacao", "fintech"]
featured: true
draft: false
---

Hoje o radar veio recheado de lançamento de modelo — Kimi K3, LM Studio Bionic e o Step 3.7 Flash, que puxou o fio do destaque de hoje. No meio disso tudo, separei também um estudo sobre dark patterns em chatbot e um relato sobre a fadiga de quem revisa trabalho de agente. Vale o tempo de ler o radar inteiro lá embaixo.

Uma conta que todo mundo que constrói produto com IA acaba fazendo cedo ou tarde: quanto custa cada decisão que o agente toma sozinho, e onde vale a pena pagar mais caro por uma inteligência maior.

A StepFun lançou esta semana o Step 3.7 Flash, um modelo pensado justamente para essa conta. Ele roda um "modo assessor", onde o próprio modelo menor conduz o loop de trabalho sozinho e só aciona um modelo maior e mais caro nos pontos realmente críticos da tarefa. O resultado divulgado é forte: cerca de 97% da qualidade do Claude Opus 4.6 em tarefas de código, a um nono do custo por tarefa.

O que me chama atenção aqui não é o benchmark em si. É a lógica por trás dele.

Durante muito tempo a discussão de IA em produto foi só "qual modelo é o melhor". Agora a pergunta que interessa é outra: onde a inteligência de ponta realmente muda o resultado, e onde ela é desperdício caro rodando em tarefa repetitiva.

Isso conversa direto com o que vivo do lado de produto em crédito. Automatizar esteira de recebíveis, conciliação, triagem de documento, tudo isso tem um monte de passo repetitivo que não precisa do modelo mais caro do mercado. O que precisa é de critério para saber quando escalar para uma inteligência maior, e quando deixar o trabalho pesado para um modelo mais barato e mais rápido.

Arquitetura híbrida assim é o tipo de coisa que muda a viabilidade econômica de colocar IA em escala dentro de operação financeira. Não é sobre ter o modelo mais forte. É sobre ter o modelo certo em cada etapa.

Para quem ficou curioso e quer ver os detalhes técnicos, deixo o link [aqui](https://static.stepfun.com/blog/step-3.7-flash/).

## O resto do radar

**Kimi K3** — Modelo aberto de fronteira muda o cálculo de custo/performance para quem constrói produtos sobre LLMs. [Ler mais](https://www.kimi.com/blog/kimi-k3)

**LM Studio Bionic** — Agentes locais com modelos abertos avançam em tarefas reais e pressionam produtos cloud como Copilot e Claude Code. [Ler mais](https://lmstudio.ai/blog/introducing-lm-studio-bionic)

**NotebookLM virou Gemini Notebook** — Rebrand e integração ao Gemini mudam a distribuição do produto, um case de risco de naming e consolidação de marca. [Ler mais](https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/)

**Dynamic Workflows no Claude Code** — Nova forma de orquestrar dezenas de subagentes por tarefa, referência direta para quem constrói produtos agênticos. [Ler mais](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)

**Robinhood libera agentes de IA para operar ações** — Caso real de produto financeiro dando autonomia a agentes com controles de risco, bom benchmark de UX e governança agêntica. [Ler mais](https://techcrunch.com/2026/05/27/robinhood-now-lets-your-ai-agents-trade-stocks/)

**Avaliadores de LLM ruidosos ainda ajudam** — Mesmo avaliação imperfeita de LLM gera ganho real de qualidade em agentes, argumento contra esperar o avaliador perfeito. [Ler mais](https://www.tensorzero.com/blog/even-very-noisy-llm-evaluators-are-useful-for-improving-ai-agents/)

**Promptloop, evals de prompt via terminal** — CLI open-source que baixa a barreira para testar qualidade de prompts, útil para times pequenos. [Ler mais](https://github.com/Bella3202019/promptloop)

**A fadiga do human-in-the-loop** — Times relatam revisar dezenas de PRs de agentes por noite, alerta sobre supervisão mal desenhada em produtos com IA. [Ler mais](https://pydantic.dev/articles/the-human-in-the-loop-is-tired)

**Dark patterns em chatbots de IA** — Estudo mapeia 37 padrões manipulativos em ChatGPT, Gemini, Claude e apps de companhia, insumo para design responsável. [Ler mais](https://www.404media.co/new-study-reveals-the-manipulative-dark-patterns-of-ai-chatbots/)

---

Por hoje é isso. Nos vemos na próxima edição.
