---
title: "Sonnet 5.5 cortou o custo por tarefa sem mexer no preço do token"
date: "2026-09-29"
seoSlug: "sonnet-custo-tarefa"
excerpt: "Com o mesmo preço por token, o Sonnet 5.5 usa menos tokens e reduz em até 30% o custo da mesma tarefa — uma mudança para o backlog de produto."
tags: ["inteligencia-artificial", "modelos-de-ia", "finops-de-ia", "produto", "fintech"]
featured: true
draft: false
---

O Sonnet 5.5 mantém o preço por token do Sonnet 5, mas usa menos tokens para concluir a mesma tarefa: segundo a Anthropic, isso reduz o custo por tarefa em até 30%. O modelo também gera respostas mais de 30% rápido e chega perto do Opus 5.5 em várias tarefas de trabalho intelectual. Para times de produto, a mudança pode reabrir automações que antes não fechavam a conta.

Quem trabalha com produto aprende cedo que o custo de uma funcionalidade não termina no lançamento. Ele aparece a cada uso.

Foi por isso que o lançamento do Sonnet 5.5, da Anthropic, me chamou a atenção. À primeira vista, parece mais uma atualização de modelo. O detalhe decisivo está no que acontece com o custo de cada tarefa.

## O custo que importa aparece em cada tarefa

O preço por token continua igual ao do Sonnet 5. A redução vem da eficiência: o Sonnet 5.5 precisa de menos tokens para resolver o mesmo trabalho. Na página do [anúncio da Anthropic](https://www.anthropic.com/claude-sonnet-5-5), a empresa estima uma queda de até 30% no custo por tarefa e uma geração de respostas mais de 30% rápida.

Para produto, isso muda conversas bem concretas: quais casos de uso antes eram caros demais para valer a pena, quanta automação cabe no mesmo orçamento e quanto tempo o usuário espera por uma resposta.

Costumo pensar que boa parte do trabalho em produto é decidir o que vale automatizar. Em áreas como finanças, recebíveis e crédito, vejo muitas tarefas repetitivas, cheias de documentos e conferências, que sempre pareceram boas candidatas à automação, mas esbarravam no custo. Quando o custo por tarefa cai e a velocidade aumenta, essa lista de candidatas cresce.

Para estimar a conta com mais clareza, vale mapear os componentes de [custo de agentes de IA](/guias/custo-agentes-de-ia/) e conectar essa análise às decisões de [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/).

Um modelo mais eficiente ainda exige medir qualidade, definir limites e testar com dados reais antes de chegar ao cliente. A [avaliação de agentes de IA](/guias/avaliacao-agentes-de-ia/) ajuda a estruturar esse tipo de verificação. Também é um bom momento para revisitar o backlog de ideias que foi para a gaveta por causa do custo.

## O resto do radar

**Cf, a CLI da Cloudflare feita para agentes** — Mostra a tendência de projetar interfaces de produto primeiro para agentes, além das pessoas. [Leia o anúncio](https://blog.cloudflare.com/cloudflare-cf-cli-launch/).

**Vespper e o MCP para arquivos Word** — A edição confiável de documentos Word é um gargalo para agentes verticais em jurídico, saúde e finanças. [Veja o lançamento](https://www.vespper.com/blog/launching-vespper-docx-mcp).

**What would a serious AI product look like?** — Lista lacunas concretas de UX — verificação, citações e contexto — que podem virar oportunidades de diferenciação. [Leia a análise](https://blog.glyph.im/2026/09/serious-ai-product.html).

**Nvidia quer um chip vigia ao lado de cada agente** — Governança e segurança de agentes se tornam requisito de produto e argumento de venda para empresas. [Leia a cobertura](https://www.cnbc.com/2026/09/28/nvidia-releases.html).

**Jeff, modelos de decisão de 0,8B com cerca de 30 ms** — Modelos pequenos e rápidos podem substituir chamadas mais caras a LLMs em decisões simples do produto. [Explore o projeto](https://github.com/firelex/jeff).

**Coding is not solved** — Ajuda a calibrar expectativas de roadmap e prazos ao apostar em agentes de código. [Leia o artigo](https://blog.alexewerlof.com/p/coding-is-not-solved).

**Pac-Bench, o teste do Pac-Man em uma tentativa** — Benchmarks práticos e visuais ajudam a comparar modelos para casos de uso reais. [Explore o benchmark](https://jonclegg.github.io/pacman-bakeoff/).

Por hoje é isso. Amanhã tem mais um filtro do que realmente importa para quem trabalha com produto.
