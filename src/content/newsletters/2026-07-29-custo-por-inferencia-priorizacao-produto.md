---
title: "Custo por inferência: a régua de priorização que ficou velha"
date: "2026-07-29"
excerpt: "Em produto com IA, estimar só o desenvolvimento não basta: inferência em escala, retreino e ajuste mudam a conta de uma feature. A nova régua é impacto por chamada de inferência."
tags: ["inteligencia-artificial", "produto", "fintech", "finops-de-ia"]
featured: true
draft: false
---

Dez itens no radar de hoje, e um deles mexeu numa premissa que eu carregava sem questionar. O resto da lista puxa para o mesmo lado: menos anúncio de modelo, mais conversa sobre como sustentar o que já foi para produção.

## Em resumo

Toda feature de IA tem três camadas de custo: desenvolvimento, inferência em escala e retreino ou ajuste quando o modelo começa a derivar. Priorizar apenas por impacto e esforço deixa uma parte relevante da conta de fora. Para produto com IA, a régua precisa incluir o impacto por chamada de inferência, a escolha de modelo por etapa e controles de qualidade, feedback e governança.

Tem uma pergunta que virou rotina nas minhas discussões de roadmap: quanto custa rodar essa funcionalidade mil vezes por dia?

Li hoje um [guia de estratégia de produto de IA para 2026](https://www.mindtheproduct.com/the-2026-ai-product-strategy-huide-how-to-plan-budget-and-build-without-buying-into-the-hype/) que colocou o dedo exatamente nessa ferida. O ponto central é simples: toda feature de IA tem três camadas de custo, e a maioria dos times só enxerga uma.

A primeira é o desenvolvimento, que todo mundo estima. A segunda é a inferência em escala, que quase ninguém coloca na conta na hora de priorizar. A terceira é o retreino e o ajuste quando o modelo começa a derivar, e essa geralmente aparece só depois que a feature já está em produção.

Isso quebra uma premissa que carregamos há anos. Software tradicional tem custo marginal perto de zero: se dobrar o uso, o custo quase não se mexe. Com IA, não. Cada chamada tem preço.

Eu atuo do lado de produto em crédito estruturado, e essa lógica muda bastante a forma de olhar para um fluxo. Automatizar a leitura de um documento de lastro ou a conferência de uma duplicata pode fazer todo sentido no piloto e não fechar a conta quando o volume multiplica. O inverso também acontece: tem processo com pouca visibilidade que, no volume certo, paga a operação inteira sozinho.

Por isso a régua de priorização precisa mudar. Não é só impacto pelo esforço, é impacto por chamada de inferência. Essa é uma decisão de [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/): modelar o custo junto do resultado esperado, em vez de descobrir a restrição depois de colocar a feature no ar.

Também vale escolher o modelo por etapa, porque boa parte das tarefas não precisa do topo de linha. Em fluxos compostos, a escolha entra no desenho de [agentes de IA](/guias/agentes-de-ia/): cada etapa precisa de um modelo compatível com seu volume, risco e tipo de decisão.

O guia fecha com uma frase que ficou na minha cabeça: o desafio de 2026 não é mais adoção, é execução. Sem métrica de qualidade, ciclo de feedback e [governança de IA](/guias/governanca-de-ia/), a feature sai da demo bonita e chega na produção com resultado instável e custo subindo. A [matriz de risco de IA](/guias/matriz-risco-ia/) ajuda a calibrar controles, confirmação humana e evidências quando a automação entra em fluxos mais sensíveis.

Nada disso me deixa menos animado com IA. Só deixa a conversa mais madura, e é assim que essas coisas viram produto de verdade.

Para quem quiser ler o guia completo, vale o tempo: [The 2026 AI Product Strategy Guide](https://www.mindtheproduct.com/the-2026-ai-product-strategy-huide-how-to-plan-budget-and-build-without-buying-into-the-hype/).

## O resto do radar

**Kimi-K3 no HuggingFace** — modelo aberto multimodal de fronteira com 1M de contexto muda a conta de build vs. buy e o custo unitário de features de IA. [Ler mais](https://huggingface.co/moonshotai/Kimi-K3)

**Dynamic Workflows no Claude Code** — orquestração automática de subagentes em paralelo encurta discovery técnico e refactors, mas explode o custo de inferência. [Ler mais](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)

**Step 3.7 Flash** — mais um modelo rápido e barato na fila: latência e preço por token seguem em queda, vale renegociar as premissas de custo do roadmap. [Ler mais](https://static.stepfun.com/blog/step-3.7-flash/)

**Anthropic lança o Opus 5** — performance quase de fronteira pela metade do preço, mas com incidentes de erro elevado registrados no mesmo dia; dependência de fornecedor é risco de produto. [Ler mais](https://www.axios.com/2026/07/24/anthropic-releases-new-model-opus-5)

**Robinhood permite que agentes de IA operem ações** — caso real de agente com permissão de ação irreversível; referência de até onde dar autonomia a agentes no seu produto. [Ler mais](https://techcrunch.com/2026/05/27/robinhood-now-lets-your-ai-agents-trade-stocks/)

**Avaliadores LLM ruidosos ainda melhoram agentes** — derruba a desculpa de "não temos eval bom o suficiente": mesmo métrica ruidosa já orienta decisão de roadmap. [Ler mais](https://www.tensorzero.com/blog/even-very-noisy-llm-evaluators-are-useful-for-improving-ai-agents/)

**AISlop, CLI para detectar code smells de IA** — com features escritas por IA em escala, qualidade de código vira risco de velocidade futura, e agora é mensurável. [Ler mais](https://github.com/scanaislop/aislop)

**Estudo mapeia dark patterns em chatbots de IA** — engajamento otimizado em produto conversacional escorrega fácil para manipulação: risco de marca, de confiança e regulatório. [Ler mais](https://www.404media.co/new-study-reveals-the-manipulative-dark-patterns-of-ai-chatbots/)

**Spec final do MCP, LangGraph 1.0 e Bedrock AgentCore em GA** — a camada de infraestrutura de agentes está padronizando, e decisões de arquitetura tomadas agora ficam mais fáceis de reverter depois. [Ler mais](https://aiagentstore.ai/ai-agent-news/this-week)

---

Fecho por aqui. Se for mexer na priorização hoje, leve a conta da inferência junto.
