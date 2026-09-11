---
title: "Custo de agentes de IA: custo por tarefa, orçamento e escala"
seoTitle: "Custo de agentes de IA: guia de FinOps e orçamento"
description: "Aprenda a medir custo por tarefa, criar limites de orçamento e decidir quando um agente de IA está pronto para escalar."
datePublished: "2026-09-10"
dateModified: "2026-09-10"
tags: ["agentes de IA", "FinOps", "custo de IA", "observabilidade", "gestão de produto"]
alternateSlug: "ai-agent-cost-management"
cluster: agents
isHub: false
downloads:
  - label: "Baixar ledger de orçamento por tarefa"
    href: "/downloads/orcamento-custo-agente-ia.csv"
    format: "CSV"
faq:
  - question: "Qual é a unidade certa para medir o custo de um agente de IA?"
    answer: "Comece pelo custo por tarefa concluída corretamente. Mantenha também o custo por execução para investigar loops, retries e tarefas que terminam sem resultado."
  - question: "Devo controlar custo por token ou por tarefa?"
    answer: "Use tokens para explicar e otimizar a fatura, mas use tarefa concluída para decidir se o agente é economicamente viável. Tokens sozinhos não mostram qualidade, retrabalho ou revisão humana."
  - question: "Como criar um limite de orçamento para um agente?"
    answer: "Defina limites em camadas: chamada, execução, fluxo, agente e período. Em cada camada, determine se o limite interrompe, pede aprovação ou escala para uma pessoa."
  - question: "Um modelo mais barato sempre reduz o custo?"
    answer: "Não. Um modelo barato pode aumentar retries, chamadas de ferramentas, revisões e tarefas não concluídas. Compare custo por tarefa correta junto com qualidade, latência e risco."
sources:
  - name: "OpenAI — Production best practices"
    url: "https://developers.openai.com/api/docs/guides/production-best-practices"
  - name: "OpenAI API — Usage and Costs reference"
    url: "https://developers.openai.com/api/reference/python/resources/admin/subresources/organization/subresources/usage"
  - name: "Anthropic — Prompt caching"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
  - name: "Google Cloud — Gemini Enterprise Agent Platform pricing"
    url: "https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing"
  - name: "AWS — Amazon Bedrock pricing"
    url: "https://aws.amazon.com/bedrock/pricing/"
  - name: "Microsoft Foundry — Plan and manage costs"
    url: "https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs"
  - name: "OpenTelemetry — GenAI attributes"
    url: "https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/"
draft: false
---

O custo sustentável de um agente de IA não é o preço de um milhão de tokens. É o custo de concluir uma tarefa correta, segura e útil, incluindo as chamadas de modelo, ferramentas, retries, armazenamento, observabilidade e revisão humana que essa tarefa exige. Tokens explicam parte da fatura; custo por tarefa decide se o produto pode crescer.

Este guia mostra como criar essa unidade econômica sem transformar uma estimativa em promessa. O método serve para Product Managers, engenharia, SRE, FinOps e governança que precisam comparar modelos, definir limites e decidir se um agente deve continuar em piloto, entrar em modo de sugestão ou receber mais tráfego. O [guia de operação de agentes de IA](/guias/operacao-de-agentes-de-ia/) continua sendo o pilar operacional; aqui o foco é tornar custo uma decisão mensurável.

## A resposta curta: meça três números

Uma equipe precisa de três números diferentes:

1. **Custo por execução:** quanto uma tentativa custou, mesmo quando falhou ou escalou.
2. **Custo por tarefa concluída:** custo total das tentativas dividido pelo número de tarefas que atingiram o resultado aceito.
3. **Custo do período:** quanto o fluxo consumiu em uma janela, separado por agente, versão, cliente, ambiente e tipo de tarefa.

Se um run custa US$ 0,012 e 85% dos runs concluem corretamente, o custo de uma tarefa concluída é aproximadamente US$ 0,0141 antes de custos fixos. O número é apenas uma ilustração: o ledger deve substituir o exemplo por dados do seu sistema. Um agente que parece barato por chamada pode ficar caro quando repete ações, exige revisão ou falha no resultado.

## O que entra no custo de um agente

O cálculo mínimo é:

```text
custo do run = modelo + ferramentas + recuperação + armazenamento
               + observabilidade + revisão humana + retries
```

Não é necessário cobrar cada componente com a mesma precisão no primeiro dia. É necessário declarar a fronteira. Se a decisão é “posso liberar este agente?”, inclua tudo que muda com a liberação. Se a decisão é “qual modelo é mais barato?”, isole o que permanece constante para não atribuir ao modelo um custo de infraestrutura que não varia.

### Modelo não é a mesma coisa que agente

O provedor pode cobrar entrada e saída do modelo, mas o agente também pode criar sessões, usar memória, chamar código, buscar documentos, acionar APIs pagas e executar várias tentativas. A documentação do [Microsoft Foundry sobre o serviço de agentes](https://learn.microsoft.com/en-us/azure/foundry-classic/agents/faq) separa inferência, sessões do Code Interpreter e armazenamento vetorial. A página atual de preços do [Google Gemini Enterprise Agent Platform](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) também lista compute, memória, sessões, memória de agente e operações como componentes distintos.

Essa decomposição muda a pergunta. Em vez de perguntar “quanto custa o modelo?”, pergunte “quais recursos uma tarefa realmente consome e quem consegue atribuí-los à tarefa?”.

### Custo por run e custo por sucesso

Registre o status final do run com uma taxonomia pequena: concluído, concluído com revisão, escalado, bloqueado, falho por sistema, falho por qualidade e cancelado por limite. Não trate HTTP 200 como sucesso de negócio. A tarefa deve ter um resultado verificável, como registro criado com autorização, classificação correta ou resposta entregue com evidência.

Se o fluxo tem vários agentes, mantenha um identificador comum de tarefa e um identificador por etapa. O [OpenTelemetry GenAI semantic convention](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/) define atributos para operação, workflow, ferramenta e tokens de entrada e saída. Ele não calcula sua fatura, mas ajuda a manter uma estrutura comum para somar custo por execução sem depender de um dashboard isolado.

## 1. Defina a unidade econômica antes do dashboard

Escreva uma frase que outra pessoa consiga auditar:

> Uma tarefa é concluída quando [resultado observável] acontece, dentro de [limites de qualidade, segurança e tempo], sem [ações proibidas].

Depois declare:

- qual evento inicia a tarefa;
- quais chamadas pertencem a ela;
- se revisão humana entra como custo obrigatório ou exceção;
- quais ferramentas têm cobrança própria;
- quais retries pertencem à tentativa original;
- como tarefas parcialmente concluídas são classificadas;
- qual período será usado para orçamento e reconciliação.

Sem essa definição, a equipe pode reduzir tokens e aumentar falhas sem perceber. O [guia de avaliação de agentes de IA](/guias/avaliacao-agentes-de-ia/) ajuda a escrever o resultado esperado e os critérios de passagem; o ledger de custo transforma o mesmo caso em uma unidade financeira.

## 2. Registre sinais suficientes para atribuir custo

O registro mínimo por chamada de modelo deve conter agente, versão, tarefa, modelo, timestamp, tokens de entrada, tokens de saída, status, duração e identificador de execução. Para ferramentas, registre nome, tipo, duração, status, quantidade e tarifa externa quando existir. Para revisão, registre apenas duração e uma taxa interna aprovada; não coloque e-mails, prompts completos ou dados de clientes no CSV.

Os provedores expõem sinais diferentes. A documentação de produção da [OpenAI recomenda estimar uso de tokens, acompanhar o uso e definir um limite de notificação](https://developers.openai.com/api/docs/guides/production-best-practices). A referência da [Usage API da OpenAI](https://developers.openai.com/api/reference/python/resources/admin/subresources/organization/subresources/usage) separa endpoints de uso e custos. A documentação de [prompt caching da Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) mostra que tokens comuns, criação de cache e leitura de cache precisam ser somados corretamente para interpretar o total de entrada.

Não misture três coisas:

1. **Uso observado:** tokens, chamadas, segundos ou operações retornados pelo provedor.
2. **Tarifa aplicada:** preço vigente, tier, região, desconto ou compromisso.
3. **Custo atribuído:** resultado do cálculo que você liga à tarefa, ao agente ou ao cliente.

Quando houver diferença entre seu cálculo e a fatura, trate o registro financeiro do provedor como fonte de reconciliação. O [Microsoft Foundry orienta usar dados de Cost Management e registros de medição para reconciliar a cobrança e considerar a fatura como fonte de verdade](https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs). Seu ledger é uma camada operacional, não substituto da fatura.

## 3. Faça uma estimativa por cenários

Antes de liberar tráfego, calcule três cenários com o mesmo conjunto de tarefas:

| Cenário | O que muda | Pergunta de decisão |
| --- | --- | --- |
| Esperado | volume, tokens, ferramentas e sucesso medianos | O custo cabe no valor que a tarefa entrega? |
| P95 operacional | contexto maior, mais passos e retries plausíveis | O agente continua dentro do limite quando o fluxo fica difícil? |
| Falha controlada | ferramenta indisponível, escalonamento e revisão | Existe um caminho seguro sem loop ou gasto aberto? |

Use dados reais do seu piloto quando disponíveis. Enquanto não houver tráfego, marque números como hipótese e não como benchmark. A planilha protegida inclui campos para volume, tokens, chamadas, tarifas, retries e revisão; ela não contém fórmulas para que a equipe possa conferir cada parcela antes de automatizar o cálculo.

## 4. Crie limites em camadas

Um único orçamento mensal detecta o problema tarde. Prefira limites graduais:

### Limite de chamada

Defina máximo de tokens, tempo e ferramenta para uma chamada. Se o limite for atingido, reduza contexto, pare ou solicite uma decisão explícita. O objetivo é impedir que uma etapa anormal vire um run interminável.

### Limite de execução

Defina máximo de passos, retries e custo estimado para uma tarefa. O agente deve parar de tentar quando o orçamento não justificar mais uma ação. Para ações externas, o comportamento seguro pode ser escalar para uma pessoa em vez de repetir.

### Limite de fluxo e agente

Defina um teto por workflow, agente, ambiente e período. Separe desenvolvimento, staging e produção; um teste exploratório não deve consumir o mesmo orçamento que uma operação crítica.

### Limite de período

Use alertas e orçamentos para detectar tendência, mas não presuma que um alerta interrompe o request atual. A documentação oficial de cada provedor deve dizer o que é observação, quota, budget, hard cap ou apenas notificação. Registre a ação esperada no ledger: avisar, bloquear, pedir aprovação, reduzir tráfego ou desativar uma ferramenta.

## 5. Reduza custo sem destruir o resultado

Otimização vem depois de uma avaliação mínima. As alavancas mais úteis são:

- **Roteamento por tarefa:** use um modelo mais capaz para casos de alto risco e um modelo menor para tarefas simples, comparando custo por sucesso e não somente preço por token. A [documentação de produção da OpenAI](https://developers.openai.com/api/docs/guides/production-best-practices) explicita essa troca.
- **Contexto menor:** remova instruções e documentos redundantes, compacte histórico e limite recuperação ao que a tarefa precisa.
- **Cache:** use cache quando o mesmo prefixo reaparece e registre criação e leitura separadamente. O cache pode reduzir custo de entrada, mas também tem janela, requisito mínimo e tarifa própria.
- **Batch ou compromisso:** use processamento assíncrono, batch ou capacidade comprometida apenas quando o padrão de volume e a latência permitirem. A [página de preços do Google](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) mostra que batch e throughput provisionado são escolhas de cobrança diferentes; isso não é universal.
- **Retries com causa:** defina quais erros podem ser repetidos, quantas vezes e com qual backoff. Retry de ação não idempotente é custo e risco ao mesmo tempo.
- **Ferramentas delimitadas:** evite que o modelo escolha entre dezenas de ferramentas indistintas. Um contrato de ferramenta claro reduz chamadas inúteis e facilita atribuição.

Não aplique redução de custo em uma métrica isolada. O gate deve comparar tarefa correta, ação segura, latência, custo por sucesso, escalonamento e incidentes. Se a mudança for relevante, use o [template de avaliação de agente](/guias/template-avaliacao-agente-de-ia/) antes de ampliar tráfego.

## 6. Concilie o ledger com a fatura

Uma vez por período:

1. congele a tabela de tarifas usada no cálculo;
2. some uso por provedor, projeto, agente, modelo e ambiente;
3. compare com a fatura e os medidores oficiais;
4. explique diferença de arredondamento, desconto, região, armazenamento e cobrança fixa;
5. atualize o custo atribuído por tarefa sem apagar o valor observado;
6. registre quem revisou e quando.

O ledger não deve fingir precisão que a fatura não oferece. Arredonde na apresentação, conserve a unidade original e marque estimativas. Se não for possível atribuir um componente com segurança, classifique-o como custo compartilhado e declare o método de rateio.

## O que a pesquisa deste pacote encontrou

A pesquisa original auditou oito páginas oficiais e encontrou uma assimetria importante: sinais de uso aparecem com frequência, mas limites de orçamento e reconciliação financeira aparecem em menos fontes. Leia a [matriz completa e o protocolo de codificação](/guias/pesquisa-custo-agentes-de-ia/) antes de generalizar o resultado. A conclusão prática é começar pelo ledger e pelo limite, não por uma troca de modelo feita apenas pela tabela de preços.

## Perguntas frequentes

### Qual métrica vai para o roadmap?

Use custo por tarefa concluída junto com qualidade e volume. Custo por token é uma métrica de engenharia; custo por sucesso é uma métrica de produto. Mantenha ambos para evitar decisões cegas.

### Quando custo fixo entra no custo por tarefa?

Quando o custo fixo varia com a decisão ou quando você quer calcular economia total. Mostre separado no ledger: custo variável por tarefa, custo fixo do período e custo total alocado. Isso permite refazer a conta quando o volume muda.

### Como tratar revisão humana?

Inclua a revisão quando ela é parte normal do fluxo. Se só acontece em exceções, registre a taxa de escalonamento e o custo esperado. Nunca oculte revisão para fazer o agente parecer autônomo.

### O template é uma calculadora?

Não. É um ledger de orçamento e atribuição sem macros, scripts ou fórmulas perigosas. A intenção é deixar premissas e evidências visíveis; a equipe pode depois importar os campos em uma planilha aprovada.

O [ledger protegido de orçamento por tarefa](/downloads/orcamento-custo-agente-ia.csv) fecha o ciclo entre este guia, a pesquisa e a decisão de escala. Para riscos, conecte-o à [matriz de risco de IA](/guias/matriz-risco-ia/) e ao [guia de governança de IA](/guias/governanca-de-ia/). Para incidentes de custo ou loops, use o [runbook de resposta a incidentes](/guias/resposta-incidentes-agentes-de-ia/).
