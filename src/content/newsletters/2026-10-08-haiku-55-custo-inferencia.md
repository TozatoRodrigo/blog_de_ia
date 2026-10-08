---
title: "Haiku 5.5 custa 75% menos: quais features voltam ao roadmap"
date: "2026-10-08"
seoSlug: "haiku-55-custo-inferencia"
excerpt: "A queda no custo médio do Haiku 5.5 reabre discussões de roadmap. Veja como escolher o modelo certo para cada etapa sem abrir mão de qualidade e controle."
tags: ["inteligencia-artificial", "produto", "agentes-de-ia", "governanca-de-ia"]
featured: true
draft: false
---

Hoje a edição gira em torno de preço, não de capacidade. No mesmo dia, apareceu um modelo mais barato, o GPT-6 com interface dentro do chat e um agente configurado em YAML.

Todo produto de IA que eu já vi nascer teve a mesma conversa no meio do caminho: a ideia é ótima, o protótipo funciona, e aí alguém abre a planilha de custo.

Foi isso que me fez parar na notícia do Claude Haiku 5.5. A Anthropic lançou um modelo pequeno com preço de US$ 0,10 por milhão de tokens de entrada e US$ 0,50 de saída para prompts de até 100 mil tokens. Considerando o custo médio de execução, a empresa diz que ele fica cerca de 75% mais barato que o Haiku 4.5. O modelo também tem nível de esforço ajustável e suporte beta a computer use e browser use nos SDKs de Python e TypeScript. [Veja o anúncio completo](https://www.anthropic.com/claude-haiku-5-5).

## Quais features voltam ao roadmap quando o custo cai

Para quem trabalha com produto, o ponto não é o modelo em si. É o que acontece com a conta. Muita feature que ficava no backlog com o carimbo de “não fecha financeiramente” volta para a mesa quando o custo por chamada cai desse jeito.

Pense em tarefas de alto volume: classificar documentos, resumir interações, atender em tempo real ou dividir um trabalho maior entre vários subagentes. São casos em que a conta multiplica rápido e nos quais um modelo leve pode fazer sentido.

É aí que a pergunta muda. Deixa de ser “dá para usar IA aqui?” e passa a ser “qual é o tamanho certo de modelo para cada etapa?”. Usar o modelo mais potente em tudo vira desperdício. Entender essa escolha faz parte da [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/), e medir o [custo de agentes por tarefa](/guias/custo-agentes-de-ia/) ajuda a saber se uma feature realmente fecha a conta.

## Barato não dispensa critério

Vale medir qualidade por etapa, definir onde uma pessoa revisa e colocar limites claros no que o agente pode fazer sozinho. O [guia de agentes de IA](/guias/agentes-de-ia/) ajuda a pensar no uso de ferramentas e na autonomia; a [governança de IA](/guias/governanca-de-ia/) conecta esses limites à responsabilidade do produto.

Com a conta mais leve, dá para testar mais, errar mais barato e aprender mais rápido. Eu gosto desse movimento. Quando a tecnologia fica acessível, quem constrói produto tem mais espaço para experimentar.

### O resto do radar

- **GPT-6 e “Intelligent UI” no ChatGPT** — respostas com gráficos, botões e formulários gerados dentro do chat redefinem a expectativa de UX em produtos conversacionais. [Veja o anúncio](https://openai.com/index/gpt-6-for-everyone/).
- **Docker Agent** — agentes declarativos em YAML podem ser compartilhados por registries OCI, reduzindo o esforço para prototipar e padronizar agentes. [Veja o projeto](https://github.com/docker/docker-agent).
- **Google Playground** — uma plataforma experimental para criar jogos por prompt, compartilhar criações e publicá-las em uma galeria. O acesso à criação está sendo liberado por níveis, de acordo com a assinatura de IA do Google. [Leia o anúncio](https://blog.google/innovation-and-ai/technology/ai/playground-experimental-gaming-platform/).
- **Meta e Microsoft reduzem o uso interno de Claude** — a manchete relata uma redução no uso pelos funcionários, um sinal relevante para custo e estratégia de fornecedores. Só a manchete foi verificada; os motivos ainda não. [Leia a notícia](https://www.rswebsols.com/news/meta-and-microsoft-take-steps-to-reduce-employee-usage-of-claude-ai/).

Fico por aqui. Amanhã tem mais.
