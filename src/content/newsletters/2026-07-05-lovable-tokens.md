---
title: "Lovable gastou US$85 mil em tokens para multiplicar PRs por 5x"
date: "2026-07-05"
excerpt: "Como a Lovable escalou de 20-30 para mais de 150 pull requests por semana usando múltiplos agentes de codificação em paralelo — e o que isso significa para quem automatiza processos de produto."
tags: ["agentes-de-ia", "coding-agents", "finops-de-ia", "automação", "produto"]
featured: true
draft: false
---

Hoje o radar veio cheio de sinais contraditórios: de um lado, dados reais sobre o custo de escalar agentes de codificação; do outro, relatos de regressão nas próprias ferramentas que usamos todo dia. Fica o retrato de um momento em que a tecnologia anda rápido, mas nem sempre para frente.

Toda semana alguém me pergunta se vale a pena colocar IA pra rodar de verdade dentro do time de produto, ou se é só hype.

Um caso que vi essa semana ajuda a responder isso com números, não com opinião.

A Lovable, startup de desenvolvimento com IA, contou como escalou de 20 a 30 pull requests por semana para mais de 150, usando vários agentes de codificação ao mesmo tempo. O custo desde janeiro: US$ 85 mil em tokens.

O que me chamou atenção não foi o valor gasto. Foi a estrutura por trás dele. Eles classificaram as mudanças por nível de risco, colocaram revisão automatizada em camadas e criaram "skills" reutilizáveis para os agentes.

É exatamente o que a gente discute quando o assunto é escalar automação em produtos financeiros. Não adianta ligar um robô e sair do caminho. O trabalho de verdade está em desenhar a governança, decidir onde o humano entra e onde a máquina resolve sozinha.

Atuo do lado de produto em crédito e recebíveis, e a lógica é a mesma. Automatizar sem critério de risco vira dor de cabeça rápido. Automatizar com camadas de revisão e classificação de impacto é o que transforma velocidade em ganho real.

Fica o aprendizado: mesmo com dezenas de agentes rodando em paralelo, a atenção humana continua sendo o recurso mais escasso do processo.

Para quem ficou curioso e quer ver os detalhes de como eles fizeram essa escala, o link está aqui: https://lovable.dev/blog/85000-in-tokens-later-scaling-agentic-coding-at-lovable

## O resto do radar

**Codex do GPT-5.5 com regressão de raciocínio** — mostra falha de confiabilidade num agente de codificação amplamente usado; vale monitorar antes de shippar features que dependam dele. [Ler mais](https://github.com/openai/codex/issues/30364)

**Modelos melhores, ferramentas piores** — Opus 4.8 e Sonnet 5 inventam campos ao chamar tools fora do padrão do Claude Code, risco de integração para quem constrói sobre a API da Anthropic. [Ler mais](https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/)

**Possível vazamento de sessão no Claude Code** — issue com quase 300 pontos aponta risco de isolamento entre contas, relevante para due diligence de fornecedores. [Ler mais](https://github.com/anthropics/claude-code/issues/74066)

**sqlite-utils 4.0rc2, escrito majoritariamente por IA** — Simon Willison gastou US$149,25 em tokens com Claude Fable; dado real de custo de codificação agêntica em projeto de porte médio. [Ler mais](https://simonwillison.net/2026/Jul/5/sqlite-utils-fable/)

**Camadas em memória para reduzir sobrecarga de LLM** — padrão da RidgeText reduz uso de contexto de ~125 mil para ~150 tokens por interação; arquitetura reaproveitável para produtos que orquestram várias fontes. [Ler mais](https://ridgetext.com/blog/mapbox-llm-composition)

**GLM-5.2 da Z.ai pressiona a Anthropic** — modelo chinês de peso aberto mira codificação de longo horizonte e segurança, ampliando opções de custo e self-hosting. [Ler mais](https://techmymoney.com/2026/07/05/zai-glm-52-open-weight-ai-security-coding/)

**EUA agora também limitam modelos da OpenAI** — depois de restringir a Anthropic, governo americano limita acesso aos novos modelos da OpenAI por segurança nacional; risco real de disponibilidade para quem depende de fronteira nos EUA. [Ler mais](https://openthemagazine.com/technology/uncle-sam-says-no-after-anthropic-the-us-now-limits-access-to-openais-new-ai-models)

**Meta promete paridade com GPT-5.5 (sem provar ainda)** — Chief AI Officer fala em empatar com 10x mais computação, mas sem benchmark público; tratar como direcional, não como base de decisão. [Ler mais](https://www.techtimes.com/articles/319723/20260704/meta-watermelon-ai-claims-gpt-55-parity-benchmarks-remain-unnamed-unverified.htm)

**Vale a pena perseguir todo modelo novo?** — artigo argumenta que migrar a cada lançamento raramente compensa; melhor avaliar estabilidade e ganho real antes de trocar de modelo em produção. [Ler mais](https://www.pcmag.com/opinions/stop-chasing-the-latest-ai-models-theyre-rarely-worth-your-time-or-money)

---

É isso pro radar de hoje. Sigo de olho no que vem por aí e trago mais amanhã.
