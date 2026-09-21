---
title: "Step 5 Preview: o modelo de 1 milhão de tokens por US$1"
date: "2026-09-21"
seoSlug: "step-5-custo-inferencia"
excerpt: "O Step 5 Preview combina contexto de 1 milhão de tokens, 27 bilhões de parâmetros ativos e cerca de US$1 por milhão de tokens de entrada. Para produto, isso muda quais automações longas cabem na conta."
tags: ["inteligencia-artificial", "modelos-de-ia", "finops-de-ia", "fintech", "produto"]
featured: true
draft: false
---

O Step 5 Preview, da StepFun, combina contexto de 1 milhão de tokens, 27 bilhões de parâmetros ativos e preço de cerca de US$1 por milhão de tokens de entrada. Para produto, o ponto não é o hype técnico: é a mudança no custo de inferência de IA e na conta de quais automações longas podem fazer sentido em produção.

Essa semana virou uma corrida de lançamentos de modelo atrás de modelo, e é fácil deixar passar o que realmente muda a conta de produto. Separei hoje o lançamento que me fez parar para calcular custo e mais cinco notícias que valem os próximos minutos de leitura.

## O que o Step 5 Preview muda na conta do produto

Toda semana aparece um modelo novo prometendo ser mais barato e mais capaz que o anterior. Já perdi a conta de quantos comparativos de preço por milhão de tokens vi só neste mês.

Mas um lançamento desta semana me chamou atenção por um motivo específico. A StepFun apresentou o Step 5 Preview já mirando engenharia de software e finanças como casos de uso principais, não como nota de rodapé.

São 600 bilhões de parâmetros totais, mas só 27 bilhões ativos por vez, contexto de 1 milhão de tokens e peso aberto previsto para outubro. O preço gira em torno de US$1 por milhão de tokens de entrada, uma fração do que muitos modelos ocidentais cobram hoje.

Para quem trabalha com produto, isso importa menos pelo lançamento em si e mais pelo espaço de decisão que ele abre. Cada modelo novo, mais barato e capaz de sustentar tarefas longas de forma confiável, muda a conta de quais automações fazem sentido colocar em produção e quais ainda são caras demais para escalar.

Para quem ficou curioso e quer ver a matéria completa, [leia a cobertura do lançamento do Step 5 Preview](https://www.marktechpost.com/2026/09/20/stepfun-launches-step-5-preview/).

## Contexto longo pode viabilizar automações antes caras

Eu atuo com produtos na área de recebíveis e crédito estruturado, e boa parte do desafio por lá é justamente esse: processos longos, com muitas etapas e dependências, que hoje ainda se apoiam em automações rígidas ou em gente revisando caso a caso.

Um agente que mantém contexto de 1 milhão de tokens com custo baixo começa a viabilizar fluxos que antes só compensavam para operações gigantes. Isso coloca o [custo de agentes de IA](/guias/custo-agentes-de-ia/) no centro da conversa: não basta perguntar se o modelo consegue executar a tarefa; é preciso saber quanto custa cada execução, como o consumo cresce e onde a automação realmente gera valor.

Essa é uma discussão de [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/). O preço de inferência não é detalhe de infraestrutura quando ele define se uma jornada pode ser oferecida a poucos clientes ou a uma base inteira.

## Um modelo mais barato não elimina o julgamento humano

Isso não substitui julgamento humano em decisões sensíveis, longe disso. Um contexto maior e um preço menor ampliam o que pode ser testado, mas não resolvem sozinhos segurança, qualidade, explicabilidade ou responsabilidade.

Como profissional de produto, gosto de acompanhar esse tipo de lançamento porque ele redesenha, mês a mês, o que é economicamente viável construir. A melhor próxima pergunta não é “qual modelo venceu o benchmark?”, mas “qual fluxo passa a fazer sentido quando a conta mudou?”.

Para responder isso com mais clareza, vale combinar uma visão de [agentes de IA](/guias/agentes-de-ia/) com o olhar de [IA para Product Managers](/guias/inteligencia-artificial-para-product-managers/): entender a tarefa, medir o custo por resultado e definir os limites antes de escalar.

## Em resumo

- O Step 5 Preview tem 600 bilhões de parâmetros totais, 27 bilhões ativos por vez e contexto de 1 milhão de tokens.
- O preço de cerca de US$1 por milhão de tokens de entrada reduz a barreira econômica para tarefas longas.
- Em produtos de crédito e recebíveis, isso pode reabrir automações que antes só compensavam em operações muito grandes.
- Custo menor amplia o espaço de decisão, mas não substitui julgamento humano, segurança e governança em fluxos sensíveis.

## O resto do radar

**Qwen-Image-2.1 (Alibaba)** — Modelo aberto de 7B que gera e edita imagens no mesmo fluxo, reduzindo custo e complexidade para features visuais em produtos de IA. [Ler mais](https://technode.com/2026/09/21/alibabas-qwen-open-sources-qwen-image-2-1-for-unified-image-generation-and-editing/)

**CUA-S1, modelo aberto para computer use** — Modelos pequenos e especializados por tarefa, em vez de um LLM genérico, podem baratear e tornar mais confiáveis produtos que automatizam interfaces e formulários. [Ver no GitHub](https://github.com/trycua/cua)

**ChatGPT rastreando atividade via “ad collector”** — Sinaliza a OpenAI avançando para monetização via anúncios com coleta de dados entre sites, algo que PMs de IA precisam antecipar em termos de privacidade e confiança. [Ler a discussão](https://news.ycombinator.com/item?id=49776729)

**Mistral vira o motor de IA do Firefox** — Parceria com a Mozilla mostra um caminho de distribuição em massa via navegador para IA com foco em privacidade, relevante para quem pensa em GTM e diferenciação. [Ler o anúncio](https://mistral.ai/news/mistral-x-mozilla/)

**Perplexity lança IA híbrida nuvem+local no Mac** — Arquitetura que combina nuvem e processamento local, com classificador de PII open-source, é um exemplo prático de privacy by design que pode virar diferencial competitivo. [Ler mais](https://9to5mac.com/2026/09/01/perplexity-launches-privacy-minded-hybrid-compute-ai-feature-for-mac/)

Por hoje fico por aqui. Amanhã tem mais.
