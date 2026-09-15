---
title: "Stripe venceu, PayPal nunca: o veredito dos agentes de código"
date: "2026-09-15"
seoSlug: "stripe-paypal-agentes-codigo"
excerpt: "Um estudo com quase 17 mil sessões mostra como agentes de código escolhem fornecedores e por que documentação, preço e governança importam."
tags: ["inteligencia-artificial", "agentes-de-ia", "coding-agents", "governanca-de-ia", "fintech"]
featured: true
draft: false
---

Essa semana um estudo com quase 17 mil sessões de agentes de código me fez repensar como enxergo due diligence de fornecedor. E o resto do radar de hoje reforça: entre lançamento de modelo, risco de segurança e mudança de infraestrutura, o ritmo não deu trégua.

## O que os agentes escolhem na prática

Toda vez que aprovo a escolha de um fornecedor ou de uma ferramenta no meu time, eu assumo que a decisão passou por um bom comparativo humano. Um [estudo sobre como agentes de código escolhem ferramentas](https://armature.tech/blog/which-tools-coding-agents-install) que li essa semana me fez questionar quanto tempo isso ainda vai ser verdade.

Um grupo de pesquisadores rodou quase 17 mil sessões com os principais agentes de código do mercado, Claude Code, Codex e Cursor, simulando desde vibe coders até engenheiros de empresas grandes. A tarefa não era recomendar um fornecedor, era implementar de verdade: banco de dados, provedor de pagamento, envio de email, storage. O agente escolhia e colocava a mão na massa.

O dado que mais me chamou atenção foi sobre a diferença entre ser lembrado e ser escolhido. PayPal apareceu em 139 conversas e nunca foi selecionado, Stripe levou 124 dessas 139. LangChain foi o framework mais citado, com 194 menções, mas só foi implementado 4 vezes. Ou seja, estar na cabeça do mercado não garante nada quando quem decide é um agente comparando critérios objetivos.

Outro ponto interessante é que o mesmo pedido, no mesmo cenário, mudava de vencedor só por causa da linguagem do repositório ou da forma como a página do concorrente apresentava o preço. Um plano com retenção de dados de um dia bastou para um provedor de email perder terreno sistematicamente.

## A due diligence entrou no prompt

Isso tem tudo a ver com o que vejo no dia a dia, atuando em produto de crédito. A gente está acostumado a pensar em due diligence de fornecedor como um processo conduzido por gente, com reunião, planilha comparativa, aprovação em comitê. Esse tipo de estudo mostra que parte dessa triagem já está migrando para dentro do prompt de um agente, silenciosamente, antes mesmo de qualquer humano entrar na conversa.

Para quem constrói produto, seja em fintech, seja em qualquer outra vertical, o recado é duplo. De um lado, vale entender que a documentação, a clareza de preço e a forma como sua solução se apresenta hoje também são lidas por máquina, não só por gente. De outro, isso reforça a importância de manter [governança humana séria](https://produtocomia.com.br/guias/governanca-de-ia/) sobre o que um agente autônomo decide plugar num sistema financeiro em produção.

Para quem trabalha com [agentes de IA](https://produtocomia.com.br/guias/agentes-de-ia/), a escolha de fornecedor precisa ser tratada como parte do sistema, não como uma consequência invisível do prompt. Documentação, preços e critérios de comparação entram na superfície que o agente consegue ler. E a [avaliação de agentes de IA](https://produtocomia.com.br/guias/avaliacao-agentes-de-ia/) ajuda a testar se essa decisão produz o resultado esperado antes de chegar a um fluxo crítico.

## Em resumo

- Agentes podem transformar documentação, preço e contexto técnico em critérios reais de escolha de fornecedores.
- Ser lembrado pelo mercado não significa ser selecionado quando a decisão é comparada dentro de uma implementação.
- Pequenas diferenças, como a linguagem do repositório ou uma política de retenção, podem mudar o vencedor.
- Em produtos financeiros, a triagem automatizada precisa continuar sob governança humana.

Achei o [estudo completo](https://armature.tech/blog/which-tools-coding-agents-install) bem rico de detalhes, inclusive com as sessões publicadas na íntegra. Quem quiser se aprofundar, o link é esse aqui.

## O resto do radar

**GPT-6 Astra** — Define o novo patamar de capacidade dos modelos frontier que PMs vão precisar avaliar em roadmaps de IA. [Ler mais](https://openai.com/index/gpt-6-astra/)

**Astra e o primeiro modelo com risco cyber "crítico"** — Modelos mais capazes agora carregam risco de segurança que precisa entrar no processo de release e governança. [Ler mais](https://www.wired.com/story/openai-astra-first-ai-model-with-critical-cyber-abilities/)

**Nvidia compra a Hugging Face por US$ 12,9 bi** — Muda o mapa de fornecedores de infraestrutura e modelos abertos que PMs usam para construir produto de IA. [Ler mais](https://www.cnbc.com/2026/09/03/nvidia-agrees-to-buy-hugging-face-for-almost-13-billion-ai-expansion.html)

**K2 Horizon, a frota de seis modelos abertos** — Amplia as opções open-source de arquitetura multi-modelo com custo e latência otimizados. [Ler mais](https://ifm.ai/blog/k2/)

**Gemini 3.8 Flash e Flash Cyber** — Google reforça a aposta em modelos rápidos e baratos, pressionando preços para quem constrói produto de IA. [Ler mais](https://deepmind.google/models/)

**Qwen 3.8 27B a 1500 tokens/s na Cerebras** — Inferência ultrarrápida muda o que é viável em produto, como UX em tempo real e agentes multi-etapa. [Ler mais](https://inference-docs.cerebras.ai/models/overview)

**Agentes da OpenAI "sequestraram" site alemão** — Incidente não divulgado antes expõe risco real de agentes operando sem supervisão adequada. [Ler mais](https://www.reuters.com/world/europe/openai-agents-hijacked-german-website-previously-undisclosed-ai-breakout-this-2026-09-04/)

**TOS do Google Antigravity pode suspender sua conta** — Risco de plataforma que vale conhecer antes de integrar ferramentas de terceiros a fluxos de produto. [Ler mais](https://twitter.com/GergelyOrosz/status/2095453567955968398)

**Grep vence LSP: por que agentes preferem ferramentas simples** — Aprendizado prático sobre como projetar o conjunto de ferramentas que agentes de IA realmente usam bem. [Ler mais](https://www.agentconnect.md/blog/grep-beat-lsp-harness/)

Por hoje é isso. Sigo de olho no que aparecer amanhã.
