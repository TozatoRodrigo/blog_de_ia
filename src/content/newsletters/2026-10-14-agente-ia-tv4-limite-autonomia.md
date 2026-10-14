---
title: "Agente de IA e o material apagado da TV4: qual o limite de autonomia?"
date: "2026-10-14"
seoSlug: "tv4-autonomia-agente-ia"
excerpt: "O caso da TV4 expõe uma pergunta de produto: como limitar a autonomia de agentes sem abrir mão do valor que eles podem entregar?"
tags: ["inteligencia-artificial", "agentes-de-ia", "governanca-de-ia", "produto"]
featured: true
draft: false
---

Hoje o radar veio curto, mas o caso da TV4 mexe direto com quem desenha produto. Um erro ainda sem causa confirmada custou meses de trabalho a uma emissora e coloca uma pergunta importante sobre quanta autonomia a gente entrega a uma automação.

Uma regra que levo para qualquer produto que mexe com dinheiro ou com dado importante: nunca dê a uma automação mais poder do que você aceitaria perder.

## O que sabemos — e o que ainda não sabemos — sobre a TV4

A TV4, na Suécia, adiou para 2027 a estreia de um programa depois que meses de material já editado foram apagados. O [Aftonbladet apontou um agente de IA como responsável](https://swedenherald.com/article/tv4-postpones-the-challenge-until-2027-after-technical-failure-erases-edited-footage). A emissora confirma apenas uma “falha técnica” e não fala em IA, então essa atribuição precisa ser tratada com cautela.

Mesmo sem causa confirmada, o caso é um exercício útil porque o cenário é plausível: um agente com permissão para editar, organizar e limpar arquivos faz essas tarefas, mas o comando de limpar acaba alcançando o trabalho de meses.

## Defina os limites antes de delegar

Do lado de produto, enxergo isso como uma decisão de desenho, não como motivo para ter medo de agentes. Qual é o menor acesso de que o agente precisa para entregar valor? Existe um backup que ele não consegue alterar? Ações irreversíveis precisam de confirmação humana? E, quando algo dá errado, como a empresa comunica o que sabe sem atribuir a causa à tecnologia antes de entender o ocorrido?

Essas perguntas são parte do trabalho de produto. O modelo mais esperto do mercado não ajuda se o escopo de autonomia foi definido no improviso. A [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/) inclui decidir onde agentes podem atuar; os guias de [operação de agentes de IA](/guias/operacao-de-agentes-de-ia/) e de [governança de IA](/guias/governanca-de-ia/) ajudam a estruturar limites e controles. Se houver um incidente, a [resposta a incidentes com agentes](/guias/resposta-incidentes-agentes-de-ia/) também precisa fazer parte da conversa.

Sou otimista com agentes e acho que eles vão tirar muito trabalho repetitivo das nossas costas, em qualquer área. Justamente por isso, vale aprender com os tropeços dos outros — que saem mais baratos para quem lê — em vez de aprender com os nossos.

## O resto do radar

- **Gemini 4 Argon** — o novo modelo de fronteira do Google pode mudar a relação entre custo e qualidade, mas o acesso ainda é restrito. [Google DeepMind](https://deepmind.google/models/gemini/).
- **Panorama de modelos: GPT-6 Sol/Astra, Claude Opus 5.5 e Gemini 3.8 Flash** — 23 modelos de 15 provedores em setembro pedem estratégia de roteamento e avaliação, não uma aposta em um modelo só. [Mean CEO](https://blog.mean.ceo/?p=10962).
- **pg_vectorsearch** — um índice vetorial para Postgres que, se amadurecer, pode reduzir custo e complexidade de RAG ao manter a busca no banco que você já usa. [Timescale](https://github.com/timescale/pg_vectorsearch).

Fico por aqui. Amanhã tem mais.
