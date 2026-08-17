---
title: "Como operar agentes de IA em produção: observabilidade, SLOs e incidentes"
seoTitle: "Operação de agentes de IA em produção: guia prático"
description: "Aprenda a operar agentes de IA com observabilidade, SLOs proporcionais, controle de custos, resposta a incidentes e mudanças reversíveis."
datePublished: "2026-08-10"
dateModified: "2026-08-17"
tags: ["agentes de IA", "observabilidade", "operações", "SRE", "gestão de produto"]
alternateSlug: "ai-agent-operations"
cluster: agents
isHub: false
downloads:
  - label: "Baixar checklist de operação de agente"
    href: "/downloads/checklist-operacao-agente-de-ia.csv"
    format: "CSV"
faq:
  - question: "O que é operar um agente de IA em produção?"
    answer: "É manter um agente observável, mensurável, autorizado e reversível depois do lançamento, acompanhando execuções, ferramentas, qualidade, custo, incidentes e mudanças."
  - question: "Qual SLO devo usar para um agente de IA?"
    answer: "Não existe um SLO universal. Defina indicadores e metas a partir do resultado da tarefa, do impacto da falha, da latência aceitável, do custo e da necessidade de escalonamento do seu caso."
  - question: "O que deve aparecer no trace de um agente?"
    answer: "No mínimo, uma execução correlacionável com versão, etapas, chamadas de ferramentas, duração, erros, uso, resultado e decisão de escalonamento, com dados sensíveis minimizados."
  - question: "Como reduzir o risco de um incidente causado por um agente?"
    answer: "Limite permissões e execução, exija aprovação para ações sensíveis, detecte anomalias, tenha contenção e rollback e transforme cada incidente em um caso de avaliação e melhoria."
sources:
  - name: "OpenAI Agents SDK"
    url: "https://openai.github.io/openai-agents-python/"
  - name: "OpenAI Agents SDK — Configuration and tracing"
    url: "https://openai.github.io/openai-agents-python/config/"
  - name: "AWS DevOps Agent — Production operations"
    url: "https://docs.aws.amazon.com/devopsagent/latest/userguide/working-with-devops-agent-production-operations-index.html"
  - name: "Google Cloud — Vertex AI Agent Engine overview"
    url: "https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview"
  - name: "Microsoft Foundry — Agent Monitoring Dashboard"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard"
  - name: "Microsoft Foundry — Tracing and data handling"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-data"
  - name: "NIST AI RMF Playbook"
    url: "https://airc.nist.gov/airmf-resources/playbook/"
  - name: "OpenTelemetry — GenAI semantic conventions"
    url: "https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/"
draft: false
---

Operar um agente de IA em produção significa conseguir responder, para cada execução: **o que o agente tentou fazer, com qual versão, usando quais ferramentas, com qual resultado, custo e risco — e como interromper ou reverter a operação**. Logs de erro e uma média de latência não bastam, porque o comportamento depende de contexto, modelo, ferramentas, permissões e decisões que podem variar entre execuções.

Este guia organiza uma baseline prática para Product Managers, engenharia, SRE e governança. Ele não prescreve um SLO universal nem promete que uma plataforma gerenciada resolva o problema por você. A recomendação é começar com uma superfície operacional pequena, verificável e proporcional ao impacto do agente.

Quando uma execução já falhou ou produziu um efeito indevido, use o [guia de resposta a incidentes de agentes de IA](/guias/resposta-incidentes-agentes-de-ia/) para separar detecção, contenção, recuperação de estado, compensação e rollback. Este guia continua sendo a página pilar da operação; o novo material aprofunda o momento de crise.

## Neste guia

- a diferença entre observabilidade, avaliação e governança;
- os seis controles que apareceram na pesquisa documental desta semana;
- como escolher sinais e SLOs sem transformar tokens em objetivo;
- como desenhar resposta a incidentes e mudanças reversíveis;
- como começar em quatro etapas e usar a [pesquisa original sobre operação de agentes](/guias/pesquisa-operacao-agentes-de-ia/);
- como aplicar o [checklist privado de operação](#template-de-checklist-de-operacao).

## Operação não é apenas monitoramento

Há três perguntas diferentes:

1. **Observabilidade:** o que aconteceu durante uma execução?
2. **Avaliação:** esse comportamento atende ao resultado esperado e aos limites de segurança?
3. **Governança:** quem autorizou o uso, qual risco foi aceito e o que acontece quando a operação falha?

Um dashboard pode mostrar que a latência subiu sem explicar se o agente escolheu uma ferramenta errada. Uma avaliação pode mostrar que a resposta está correta em um conjunto de casos sem indicar que a versão implantada passou a consumir o dobro de tokens. Uma política pode exigir aprovação humana sem registrar em que ponto a aprovação ocorreu. Operação conecta as três camadas.

O [guia pilar sobre agentes de IA](/guias/agentes-de-ia/) explica os componentes do sistema e quando usar um agente. O foco aqui começa depois que existe tráfego real ou quando a equipe decidiu que o agente poderá agir em um ambiente relevante.

## O que a pesquisa documental encontrou

A pesquisa do Produto com IA examinou sete documentos oficiais em 10 de agosto de 2026. A unidade de análise foi o documento, não o fornecedor. Um controle recebeu “sim” somente quando a fonte mencionou explicitamente o mecanismo ou um equivalente operacional. O resultado não mede qualidade de produto; indica quais controles aparecem com mais frequência na documentação disponível.

| Controle observado | Documentos com menção explícita | Leitura operacional |
|---|---:|---|
| Visibilidade da execução | 7/7 | Trace, etapas, logs ou sinais para reconstruir o que ocorreu são a base mais recorrente. |
| Telemetria de ferramentas e ações | 3/7 | Não basta observar a resposta; é preciso registrar a ponte entre decisão e efeito externo. |
| Avaliação de qualidade | 5/7 | Avaliações e melhoria contínua aparecem, mas precisam de casos e critérios definidos pela equipe. |
| Métricas operacionais | 6/7 | Latência, erros, uso e sinais de produção são comuns; custo por tarefa ainda exige modelagem local. |
| Controle de acesso e humano | 6/7 | Permissões, RBAC, guardrails ou participação humana aparecem como contrapeso à autonomia. |
| Incidente, mudança e rollback | 2/7 | A ligação explícita entre operação, incidentes e release é a lacuna mais visível. |

Leia a [metodologia, a matriz completa e as limitações da pesquisa](/guias/pesquisa-operacao-agentes-de-ia/) antes de tratar esses números como regra. Eles são um diagnóstico da documentação selecionada, não uma recomendação para copiar qualquer implementação.

## 1. Crie uma identidade operacional para cada execução

Uma execução precisa ser correlacionável. Registre um identificador de run, o agente, a versão das instruções, o modelo, o ambiente, a sessão ou conversa quando aplicável, o horário, o resultado e o motivo de encerramento. Em um fluxo multiagente, registre também handoffs e a responsabilidade por cada etapa.

O trace não precisa armazenar todo prompt ou resposta. O [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) oferece tracing para visualizar, depurar e monitorar fluxos, além de integrar avaliações; a configuração do SDK permite excluir entradas e saídas potencialmente sensíveis do payload do trace ([documentação de configuração](https://openai.github.io/openai-agents-python/config/)). Isso ilustra uma decisão importante: visibilidade não é sinônimo de retenção indiscriminada.

Se a equipe usa instrumentação própria, adote nomes consistentes. As [convenções GenAI do OpenTelemetry](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/) definem operações como `invoke_agent` e `execute_tool`, identificadores de agente, versões, conversas e uso de tokens. A convenção não escolhe o seu backend nem garante segurança, mas reduz o custo de correlacionar sinais de linguagens e serviços diferentes.

Uma identidade mínima deve permitir responder:

- qual versão recebeu a entrada;
- quais ferramentas foram consideradas e chamadas;
- quais argumentos foram enviados depois da validação;
- qual permissão ou aprovação autorizou a ação;
- quantos passos, tokens, chamadas e segundos foram consumidos;
- qual resultado foi entregue, escalado, bloqueado ou revertido.

## 2. Observe ferramentas e efeitos, não apenas texto

O risco operacional está frequentemente no efeito externo: alterar um registro, publicar uma mensagem, criar um pedido ou executar código. Para cada chamada de ferramenta, registre nome, versão do contrato, resultado, código de erro, duração, autorização e relação com o run. Minimize argumentos e respostas; não transforme telemetria em uma cópia permanente de dados pessoais ou segredos.

O registro deve ser útil para diagnóstico sem conceder poder ao sistema de observabilidade. Um operador pode consultar o evento, mas não deveria conseguir executar a ferramenta a partir de um log. A autorização deve ser verificada no sistema que controla a ação; uma frase no prompt não é uma barreira suficiente.

Separe quatro estados: “o modelo sugeriu”, “o sistema validou”, “uma pessoa aprovou” e “a ferramenta executou”. Essa separação evita atribuir sucesso a uma ação que foi apenas planejada e ajuda a investigar divergências entre intenção, política e efeito.

## 3. Defina SLOs pelo resultado da tarefa

SLO para agente não deve ser “o modelo respondeu rápido”. O usuário compra uma tarefa concluída de forma segura, não uma quantidade de tokens. Comece pelos indicadores (SLIs) que conectam comportamento e impacto:

| SLI | Pergunta | Exemplo de decisão |
|---|---|---|
| Conclusão correta | A tarefa chegou ao resultado aceito? | Se cair, interromper expansão de tráfego e revisar casos. |
| Ação segura | O agente respeitou ferramentas, parâmetros e permissões? | Uma violação crítica bloqueia a versão mesmo com boa taxa de conclusão. |
| Latência de tarefa | Quanto tempo até resultado ou escalonamento? | Separar tempo de modelo, ferramenta e espera humana. |
| Falha operacional | Quantas execuções terminaram por timeout, erro ou repetição? | Abrir investigação por causa, não apenas aumentar retry. |
| Custo por tarefa correta | Quanto custa uma conclusão aceita, incluindo chamadas e revisão? | Comparar modelos, contexto e necessidade de escalonamento. |
| Escalonamento adequado | O agente chamou uma pessoa quando deveria? | Recalibrar limites de confiança e regras de parada. |

Defina a janela, o denominador e a regra de exclusão antes de publicar o SLO. “Sucesso” precisa excluir uma execução que retornou HTTP 200 mas não concluiu a tarefa. “Latência” deve dizer se inclui a espera por aprovação. “Custo” pode incluir modelo, ferramentas, armazenamento, observabilidade e trabalho humano quando esses itens forem relevantes para a decisão.

Não copie números de uma plataforma. A documentação do [Microsoft Foundry Monitoring Dashboard](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard) mostra métricas como uso de tokens, latência, taxa de sucesso e avaliações, mas os limites adequados dependem do caso. Use o sinal para decidir; não transforme um valor de exemplo em promessa de produto.

## 4. Trate custo como limite e não como proxy de qualidade

Tokens são um componente do custo, não o resultado. Um agente barato que falha e envia o caso para revisão pode ser mais caro do que uma execução um pouco mais longa que conclui corretamente. Meça pelo menos:

- custo de modelo por run e por tarefa correta;
- número de chamadas de ferramentas e serviços pagos;
- tokens de entrada e saída, quando disponíveis;
- tempo de execução e retries;
- custo de avaliação, armazenamento de traces e revisão humana;
- distribuição por cliente, fluxo, versão e motivo de escalonamento.

Imponha limites antes da execução: máximo de passos, tempo, valor de ação, chamadas por ferramenta e orçamento por período. Quando um limite for atingido, o comportamento seguro pode ser parar, pedir confirmação ou escalar. Evite retries automáticos que repetem uma ação não idempotente.

## 5. Construa resposta a incidentes com contenção

Um incidente de agente pode ser uma resposta incorreta, uma ferramenta fora do escopo, vazamento de dados, loop, custo anômalo, degradação de latência ou falha de escalonamento. O runbook precisa diferenciar severidade e ter uma primeira ação clara.

### Antes do incidente

- mantenha inventário do agente, ferramentas, versões, proprietários e ambientes;
- teste caminhos de bloqueio, timeout, aprovação e rollback;
- crie alertas para os SLIs que indicam impacto, não para toda variação de texto;
- tenha uma forma de desligar uma ferramenta ou reduzir o tráfego;
- registre quais dados entram na telemetria e quem pode acessá-los.

### Durante o incidente

1. **Conter:** desative a ferramenta, reduza tráfego, pause a versão ou troque para modo de sugestão.
2. **Preservar evidência:** guarde run IDs, versão, traces minimizados, eventos de autorização e mudanças recentes.
3. **Classificar:** diferencie falha de qualidade, segurança, disponibilidade, custo e impacto de dados.
4. **Decidir:** escolha rollback, correção de configuração, bloqueio de fluxo ou escalonamento humano.
5. **Comunicar:** registre impacto, horário, serviços e responsáveis sem expor conteúdo desnecessário.

O [AWS DevOps Agent Production Operations](https://docs.aws.amazon.com/devopsagent/latest/userguide/working-with-devops-agent-production-operations-index.html) descreve um ciclo que conecta detecção, investigação, recuperação e prevenção, correlacionando métricas, logs, traces, mudanças e histórico de implantação. A inferência para um agente de produto é simples: o trace do modelo isolado não explica o incidente se a equipe não consegue relacioná-lo ao deploy, à ferramenta e ao estado do sistema.

### Depois do incidente

Registre causa provável, causa confirmada, condição de detecção, impacto, contenção, correção e ação preventiva. Converta o caso em um teste de regressão. Se a falha foi uma ferramenta indevida, adicione um caso de permissão; se foi custo, adicione um limite; se foi qualidade, atualize o conjunto de avaliação. A revisão só termina quando existe responsável e data para verificar a eficácia.

## 6. Faça mudanças reversíveis

Uma mudança relevante inclui modelo, prompt, ferramenta, schema, retriever, política, limite, memória ou serviço externo. Versione cada componente com o run. Faça a promoção em etapas:

1. validar em casos fixos e nos últimos incidentes;
2. executar em ambiente controlado ou modo sombra;
3. liberar para uma fração de tráfego com métricas e rollback;
4. comparar tarefa correta, ação segura, latência, custo e escalonamento;
5. expandir somente se o resultado e o risco forem aceitáveis;
6. arquivar a decisão, a evidência e a configuração final.

Rollback não significa apenas apontar para o modelo anterior. Se o contrato de uma ferramenta mudou, voltar o prompt pode não ser suficiente. A reversão deve considerar as dependências e ser testada antes do lançamento.

## Um plano de 30 dias para começar

### Dias 1–7: mapa de operação

Escolha um único fluxo, descreva resultado, impacto e proprietário. Liste ferramentas, dados, permissões, versões e condições de parada. Defina os seis controles da checklist e marque a evidência que já existe.

### Dias 8–14: telemetria mínima

Adicione run ID, versão, duração, erro, chamadas de ferramenta, resultado, custo estimado e escalonamento. Redija entradas sensíveis e estabeleça retenção. Teste se outra pessoa consegue reconstruir uma execução sem acessar credenciais.

### Dias 15–21: avaliação e incidentes

Monte casos normais, ambíguos, incompletos, adversariais e de indisponibilidade. Crie alertas para falhas de tarefa, ação insegura, timeout e custo anômalo. Simule uma contenção e um rollback.

### Dias 22–30: mudança controlada

Escolha metas provisórias para os SLIs, publique um runbook, faça uma mudança pequena em canário e registre a decisão. Depois de observar o comportamento, ajuste metas e lacunas. Não trate o primeiro mês como certificação; trate-o como a primeira linha de base.

## Template de checklist de operação

O [checklist de operação de agente de IA](/downloads/checklist-operacao-agente-de-ia.csv) é um arquivo CSV protegido por formulário. Ele contém uma linha de instruções, um exemplo fictício e seis controles derivados da pesquisa: visibilidade de execução, telemetria de ferramentas, avaliação, métricas, acesso/humano e incidente/mudança/rollback.

Use-o em uma reunião de prontidão ou revisão mensal. Para cada controle, registre a evidência, o responsável, a severidade, o status e a próxima data de revisão. A palavra “Conforme” só deve aparecer quando houver uma prova consultável. O arquivo não contém macros, fórmulas, scripts, credenciais ou dados pessoais reais.

Para conectar a checklist à decisão de risco, compare o resultado com a [matriz de risco de IA](/guias/matriz-risco-ia/) e com o [guia de governança de IA](/guias/governanca-de-ia/). Para mudanças na implementação, volte ao [método para criar agentes de IA](/guias/como-criar-agentes-de-ia/) e use o [template de avaliação de agente](/guias/template-avaliacao-agente-de-ia/) antes de ampliar a autonomia.

## Limitações e conclusão

A pesquisa desta semana analisou documentação oficial, não telemetria de uma população de agentes nem resultados de clientes. Documentação destaca capacidades e pode mudar; “não mencionado” não significa “inexistente”. Os números da matriz não definem SLO, maturidade ou superioridade entre plataformas. A checklist também não substitui análise jurídica, segurança, privacidade ou requisitos específicos do setor.

Ainda assim, existe uma ordem prática de prioridade: primeiro torne cada execução reconstruível; depois observe ferramentas e efeitos; em seguida conecte qualidade, custo e latência a um resultado; por fim, feche o ciclo com acesso, incidentes e mudanças reversíveis. Essa sequência reduz a chance de escalar um agente que funciona em demonstração, mas não pode ser explicado, contido ou melhorado em produção.
