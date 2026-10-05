---
title: "n8n: agente ou workflow no roadmap de produto?"
date: "2026-10-05"
seoSlug: "n8n-agente-ou-workflow"
excerpt: "Decida quando um workflow previsível basta e quando a ambiguidade justifica um agente, considerando custo, controle e risco no roadmap."
tags: ["inteligencia-artificial", "agentes-de-ia", "governanca-de-ia", "produto"]
featured: true
draft: false
---

A semana começou com três modelos de fronteira disputando preço. Mas o que mais me fez pensar foi uma ferramenta de automação. Abro a edição por ela e deixo os modelos no radar, logo abaixo.

Quem trabalha com produto aprende cedo que a pergunta mais cara não é “dá para fazer com IA?”. É “precisa ser IA aqui?”.

Essa dúvida voltou com a nova experiência de Agents do n8n, ainda em Preview. A [apresentação oficial do n8n](https://blog.n8n.io/introducing-n8n-agents/) descreve uma distinção que muita gente trata como sinônimo: workflow e agente.

## Workflow ou agente: qual problema cada um resolve?

Workflow é um caminho fixo. Você desenha cada passo, sabe o que entra e o que sai e consegue explicar o resultado para qualquer auditor. Agente trabalha de outro jeito: recebe um pedido aberto, escolhe quais ferramentas usar, pode chamar workflows, mantém memória e pode rodar por agenda ou pelo Slack.

O que me chamou atenção foi o cuidado com custo e controle. Um turno do agente conta como uma execução, e ferramentas sensíveis podem exigir aprovação humana antes de uma ação importante acontecer. Isso é produto bem pensado: autonomia com freio de mão. Esses limites também fazem parte da [governança de IA](/guias/governanca-de-ia/) e da [operação de agentes em produção](/guias/operacao-de-agentes-de-ia/).

Na prática, a conversa de roadmap fica mais madura. Tarefa repetitiva e previsível continua sendo workflow: é barato e fácil de monitorar. Agente entra onde existe ambiguidade de verdade, o pedido muda a cada vez e o valor está em decidir o caminho.

Para quem está em produto, essa distinção vira critério de priorização. Cada agente a mais traz custo de modelo, risco de comportamento inesperado e mais uma coisa para explicar ao time de compliance. Por isso, acompanhar [custos de agentes de IA](/guias/custo-agentes-de-ia/) é parte da decisão. Cada workflow bem feito é ganho de escala sem drama. É uma escolha de produto que cabe na [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/).

Sou muito otimista com agentes e acredito que vão ocupar um espaço enorme nos próximos anos. Mas o PM que sabe quando não usar um agente vai entregar mais valor do que quem coloca um em tudo.

Para ver os detalhes de custo e controle do lançamento, deixo a [leitura completa](https://kingy.ai/news/n8n-agents-2026-what-changed-cost-controls/).

## O resto do radar

- **GPT-6.1 Sol** — quase no nível do Astra por um quinto do preço, o que muda a conta de custo por feature e a escolha de modelo no roadmap. [Veja a notícia](https://digg.com/tech/mz36yngf).
- **Claude Sonnet 5.5** — mais rápido e eficiente em tokens pelo mesmo preço, o que amplia o que cabe em features interativas e agentes. [Leia a cobertura](https://iphonesoft.fr/2026/09/29/anthropic-claude-sonnet-5-5-ia-plus-rapide-moins-chere).
- **Gemini 4 Argon** — rollout fechado e preço promocional indicam que acesso e custo ainda podem mudar; vale planejar sem depender dele. [Leia a notícia](https://www.thestack.technology/google-finally-eases-open-the-lid-on-gemini-4-argon/).
- **Strata** — inferência local compatível com APIs da OpenAI e da Anthropic abre opções de privacidade e custo zero por token em protótipos e dados sensíveis. [Acesse o projeto](https://github.com/Niko1221/Strata).
- **SCM** — busca multimodal em fotos e vídeos sem nuvem nem conta, boa referência de UX e de posicionamento com privacidade como diferencial. [Acesse o projeto](https://github.com/allenv0/SCM).

Fico por aqui. Amanhã tem mais.
