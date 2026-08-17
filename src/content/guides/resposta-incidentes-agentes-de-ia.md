---
title: "Resposta a incidentes de agentes de IA: contenção, recuperação e rollback"
seoTitle: "Resposta a incidentes de agentes de IA: runbook prático"
description: "Aprenda a detectar, conter, recuperar e aprender com incidentes de agentes de IA sem confundir rollback de configuração com reversão de efeitos externos."
datePublished: "2026-08-17"
dateModified: "2026-08-17"
tags: ["agentes de IA", "incidentes", "rollback", "operações", "SRE"]
alternateSlug: "ai-agent-incident-response"
cluster: agents
downloads:
  - label: "Baixar runbook de incidentes de agente"
    href: "/downloads/runbook-incidentes-agente-de-ia.csv"
    format: "CSV"
faq:
  - question: "Rollback de um agente desfaz tudo o que ele fez?"
    answer: "Não. Rollback pode restaurar uma versão de prompt, modelo, ferramenta, política ou tráfego. Um efeito externo já executado exige compensação, reconciliação, idempotência ou intervenção humana; voltar a configuração não apaga automaticamente esse efeito."
  - question: "Qual é a primeira ação em um incidente de agente?"
    answer: "Preserve a evidência mínima e contenha o efeito: pause a ferramenta, reduza o tráfego, mude para modo de sugestão ou exija aprovação, conforme o risco. Depois classifique o incidente e escolha uma recuperação verificável."
  - question: "Todo agente precisa de um kill switch?"
    answer: "Todo agente com impacto relevante precisa de uma forma testada de interromper ou reduzir sua capacidade, mas isso pode ser um bloqueio de ferramenta, uma chave de tráfego, um modo seguro ou uma fila humana, não necessariamente desligar o sistema inteiro."
sources:
  - name: "AWS Agentic AI Lens — behavior versioning and rollback"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops02-bp03.html"
  - name: "AWS Agentic AI Lens — validation and approval workflows"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops06-bp03.html"
  - name: "AWS Agentic AI Lens — checkpoint-based recovery"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel03-bp03.html"
  - name: "AWS Prescriptive Guidance — incident response and business continuity"
    url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-incident-response.html"
  - name: "OpenAI Agents SDK — human-in-the-loop"
    url: "https://openai.github.io/openai-agents-python/human_in_the_loop/"
  - name: "Microsoft Foundry — agent tracing"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept"
  - name: "Google Cloud — Agent Runtime monitoring"
    url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/monitoring"
  - name: "NIST AI Risk Management Framework Playbook"
    url: "https://airc.nist.gov/airmf-resources/playbook/"
draft: false
---

Um incidente de agente de IA exige duas decisões diferentes: **como interromper ou reduzir o próximo efeito** e **como tratar o que já aconteceu**. Pause a ferramenta ou a versão, preserve run IDs e evidências, classifique o impacto e só então escolha entre retomar por checkpoint, degradar, fazer rollback ou abrir uma compensação. Voltar o prompt anterior não desfaz uma mensagem enviada, uma alteração de registro ou uma transação concluída.

Este é um guia de resposta operacional. Ele complementa o [guia pilar sobre operação de agentes de IA](/guias/operacao-de-agentes-de-ia/), não substitui um plano de continuidade, uma análise de segurança, uma obrigação regulatória ou um procedimento específico do seu setor. A [pesquisa original sobre recuperação de agentes](/guias/pesquisa-resposta-incidentes-agentes-de-ia/) mostra quais controles aparecem explicitamente em oito documentos oficiais; o [runbook privado em CSV](/downloads/runbook-incidentes-agente-de-ia.csv) transforma esses controles em campos de reunião e execução.

## Neste guia

- o que torna um incidente de agente diferente de um erro comum;
- como separar rollback, retomada e compensação;
- um ciclo de cinco fases para detectar, conter, recuperar e aprender;
- critérios de severidade e decisão;
- como testar o runbook antes de precisar dele;
- quais sinais e evidências devem entrar no template protegido.

## O que é um incidente de agente de IA

Incidente é um desvio que pode comprometer disponibilidade, qualidade, segurança, privacidade, custo, conformidade ou uma ação externa. A causa pode estar no modelo, nas instruções, no contexto recuperado, numa ferramenta, numa permissão, numa dependência, num deploy ou na forma como o fluxo lida com falhas. O fato de a resposta parecer plausível não reduz o incidente se o agente escolheu o destinatário errado ou executou uma operação fora da autoridade concedida.

Há uma diferença útil entre quatro momentos:

1. **Intenção:** o modelo sugeriu um plano ou uma chamada.
2. **Autorização:** o sistema, uma política ou uma pessoa permitiu a chamada.
3. **Efeito:** a ferramenta alterou um sistema externo.
4. **Resultado:** alguém confirmou se a tarefa terminou de forma correta e segura.

O runbook precisa registrar esses estados separadamente. Um trace que prova a intenção não prova que a ferramenta executou; um HTTP 200 não prova que o objetivo foi concluído; uma aprovação não prova que o efeito foi reversível.

## Rollback, retomada e compensação não são sinônimos

Antes de agir, identifique o objeto que será recuperado.

| Objeto | Ação possível | Limite | Evidência necessária |
| --- | --- | --- | --- |
| Prompt, modelo, política ou ferramenta | Rollback para uma versão conhecida | Não trata efeitos já executados | Versão atual, baseline e histórico de mudança |
| Execução pausada | Retomada a partir de checkpoint | Pode repetir efeitos se a etapa não for idempotente | Estado persistido, etapa concluída e chave de idempotência |
| Serviço ou agente indisponível | Fallback ou modo degradado | A qualidade pode cair e precisa ser comunicada | Alternativa, trade-off e sinal de degradação |
| Registro, pagamento, mensagem ou arquivo alterado | Compensação ou reconciliação | Alguns efeitos não podem ser desfeitos | Recibo, estado antes/depois e autoridade para corrigir |
| Dados sensíveis ou credenciais expostos | Contenção de acesso e resposta de segurança | Pode haver obrigação de notificação | Escopo, janela, identidade e retenção dos dados |

O [AWS Agentic AI Lens sobre versionamento e rollback](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops02-bp03.html) recomenda versionar instruções, permissões e limites de decisão, designar uma baseline conhecida e testar o rollback. A [orientação da AWS sobre checkpoints](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel03-bp03.html) acrescenta que retomadas precisam de etapas idempotentes para evitar duplicidade ou corrupção. São controles complementares: um restaura comportamento; o outro torna a continuidade da execução mais segura.

## O ciclo de resposta em cinco fases

### 1. Detecte e preserve a evidência

O sinal inicial pode ser uma taxa de erro, latência, custo, falha de avaliação, ferramenta fora do padrão, reclamação, vazamento ou alteração inesperada. Registre a hora, o ambiente, a versão do agente, o modelo, o conjunto de ferramentas, o run ID, o trace, o usuário ou sistema chamador minimizado e a última mudança relevante. Não copie segredos ou todo o prompt por reflexo.

Tracing e métricas têm funções diferentes. O [Microsoft Foundry tracing](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept) documenta entradas, saídas, ferramentas, tokens, duração, latência e eventos de avaliação, além de recomendar redação de dados sensíveis. O [monitoramento do Google Agent Runtime](https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/monitoring) expõe métricas operacionais e alertas por latência, contagem e códigos de resposta. Use esses sinais para localizar a janela e a superfície; não trate nenhum deles sozinho como causa confirmada.

Faça um “snapshot” operacional mínimo:

- versão do agente e baseline conhecida;
- mudanças recentes em prompt, modelo, ferramenta, schema, retriever, política e tráfego;
- runs afetados e runs de controle;
- ferramentas chamadas, argumentos validados e resultados;
- permissões, aprovações, retries, fallbacks e checkpoints;
- impacto observado e hipótese ainda não confirmada.

### 2. Faça a triagem por impacto e reversibilidade

Uma classificação curta ajuda a decidir sem discutir a causa por horas. Use impacto e reversibilidade, não a aparência dramática do texto.

| Nível | Exemplo | Primeira decisão |
| --- | --- | --- |
| Crítico | pagamento, exclusão, acesso indevido, exposição de dados ou ação em escala | interromper a capacidade de agir, preservar evidência e escalar imediatamente |
| Alto | ferramenta errada, degradação ampla, loop de custo ou falha de aprovação | pausar a versão/ferramenta, reduzir tráfego e abrir incidente com proprietário |
| Moderado | falha de qualidade limitada, atraso ou fallback frequente sem efeito externo | limitar expansão, investigar amostra e definir correção com prazo |
| Baixo | erro isolado detectado antes do efeito ou saída facilmente corrigível | registrar, adicionar caso de avaliação e acompanhar tendência |

Pergunte: houve efeito externo? ainda pode haver novas execuções? a ação é reversível? existe obrigação legal ou contratual? quantas pessoas ou registros podem ser afetados? O risco aumenta quando o efeito é rápido, amplo, difícil de contestar ou impossível de desfazer.

### 3. Contenha a próxima ação

Contenção é reduzir dano futuro sem destruir a evidência. Escolha a menor intervenção que interrompa o vetor de risco:

1. bloquear a ferramenta específica;
2. suspender o tráfego da versão;
3. reduzir o agente a modo de sugestão;
4. exigir aprovação humana para toda ação sensível;
5. trocar para um fluxo determinístico ou fallback conhecido;
6. desligar o agente quando as opções menores não forem suficientes.

O [OpenAI Agents SDK human-in-the-loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) exemplifica uma pausa antes de uma ferramenta sensível, com aprovação ou rejeição por chamada e retomada de um `RunState` serializável. Isso não significa que toda aprovação seja segura: a pessoa precisa ver escopo, argumentos, impacto e alternativa, e a aplicação deve impor a autorização no sistema que executa a ação.

Quando o agente opera em fluxo colaborativo, fallback não pode ser uma degradação silenciosa. A orientação da [AWS sobre fallback e graceful degradation](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel04-bp03.html) recomenda alternativas ordenadas, eventos de degradação e testes de falha. Uma resposta parcial pode preservar continuidade, mas deve carregar o sinal de que a capacidade ou a confiança mudou.

### 4. Recupere o estado e trate efeitos externos

Depois da contenção, escolha uma rota de recuperação:

- **Retomar:** somente se o checkpoint representar um estado confiável e cada etapa posterior for idempotente.
- **Reprocessar:** somente com chave de idempotência, fila controlada e confirmação do estado atual.
- **Fallback:** quando a dependência principal falhou e a alternativa tem risco e qualidade conhecidos.
- **Rollback comportamental:** restaurar uma baseline versionada, com tráfego limitado e métricas de confirmação.
- **Compensar:** corrigir um efeito externo por uma operação autorizada e auditável.
- **Não reexecutar:** quando não houver segurança para inferir o estado; encaminhe para reconciliação humana.

O [guia de resposta a incidentes da AWS](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-incident-response.html) recomenda capacidades de desligamento de emergência, planos de continuidade e métodos de recuperação dentro de prazos aceitáveis. Em produto, isso se traduz em manter uma rota manual ou determinística para a operação essencial enquanto o agente está contido.

Para cada efeito externo, responda antes de reexecutar: a chamada foi aceita? o resultado foi perdido? existe recibo? o sistema de destino oferece consulta por idempotency key? a compensação tem autorização? Se a resposta for desconhecida, tratar “tentar novamente” como recuperação é perigoso.

### 5. Valide, restaure e aprenda

Rollback é uma mudança de produção e precisa de critério de saída. Valide a baseline com casos de sucesso, casos ambíguos, falhas de dependência, ações proibidas, aprovações e o próprio incidente. Libere primeiro em modo sombra, ambiente controlado ou pequena fração de tráfego. Confirme conclusão correta, ação segura, latência, custo, escalonamento e ausência de repetição.

A [orientação da AWS sobre validação e aprovação](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops06-bp03.html) propõe que o rigor aumente com o risco da mudança e que o rollback seja definido e testado para cada tipo de alteração. O runbook deve guardar quem aprovou, qual evidência foi consultada, qual versão voltou e em que momento o tráfego foi restaurado.

No pós-incidente, registre causa provável e causa confirmada separadamente. Capture impacto, detecção, contenção, recuperação, dados preservados, decisões e lacunas. Transforme o caso em um teste de regressão ou um limite técnico: ferramenta indevida vira teste de autorização; loop vira orçamento de passos; custo anômalo vira alerta; falha de qualidade vira caso avaliado; efeito sem undo vira requisito de compensação.

## O runbook mínimo antes do primeiro incidente

Use uma reunião de prontidão para preencher o [runbook privado de incidentes de agente](/downloads/runbook-incidentes-agente-de-ia.csv). Ele foi organizado nos cinco controles contados na pesquisa e inclui um exemplo fictício `EXAMPLE-001`. Para cada agente, registre:

1. proprietário e substituto;
2. versão atual e baseline conhecida;
3. ferramentas e efeitos externos;
4. sinais de detecção e janela de alerta;
5. ação de contenção e autoridade para executá-la;
6. checkpoint, chave de idempotência ou limite de reprocessamento;
7. fallback e impacto de qualidade;
8. critério de restauração e casos de validação;
9. reconciliação de efeitos que não admitem rollback;
10. responsável por prevenção, prazo e teste de eficácia.

Não preencha o arquivo com e-mails reais, tokens, prompts completos ou dados de clientes. Guarde links para sistemas autorizados e IDs mínimos de execução. A [matriz de risco de IA](/guias/matriz-risco-ia/) ajuda a definir severidade, aprovação e contestabilidade; o [template de avaliação de agente](/guias/template-avaliacao-agente-de-ia/) ajuda a transformar o incidente em uma regressão verificável.

## Um plano de 30 dias

### Dias 1–7: desenhe as fronteiras

Escolha um agente e liste ferramentas, permissões, efeitos, baseline, proprietário e modo seguro. Execute cada ação de contenção em ambiente não produtivo e documente o tempo e as dependências.

### Dias 8–14: crie evidência correlacionável

Adicione run ID, versão, ferramenta, resultado, autorização, duração, motivo de encerramento e estado de checkpoint. Reduza e proteja o conteúdo sensível. Confirme que uma pessoa autorizada consegue reconstruir um caso sem ganhar poder de execução.

### Dias 15–21: simule falhas

Teste indisponibilidade de ferramenta, resposta inválida, timeout, loop, falha de aprovação, mudança ruim e efeito duplicado. Verifique se o fallback é comunicado, se a fila humana recebe contexto e se o reprocessamento não duplica efeitos.

### Dias 22–30: ensaie recuperação

Faça um rollback controlado e uma reconciliação de efeito externo em ambiente seguro. Meça tempo de detecção, tempo de contenção, tempo de restauração, percentual de runs explicáveis e quantidade de ações sem caminho de compensação. Não transforme esses primeiros números em SLO universal; use-os como baseline local.

## Limitações

A pesquisa associada auditou documentação oficial disponível em 17 de agosto de 2026, não incidentes reais, telemetria de clientes ou desempenho de plataformas. Um controle não mencionado pode existir em outra página; “não” significa apenas que não foi encontrado sob o protocolo definido. A documentação também descreve capacidades e práticas recomendadas, não garantia de segurança ou disponibilidade.

Rollback, retenção de traces, compensação financeira, notificação de incidente e acesso a dados dependem do sistema e da jurisdição. Envolva segurança, privacidade, jurídico e o proprietário do processo quando o incidente envolver pessoas, dinheiro, saúde, crédito, acesso ou obrigação regulatória.

O objetivo do runbook não é fazer o agente parecer determinístico. É tornar explícito o limite de sua autoridade, reduzir o próximo efeito, preservar evidência suficiente e dar à equipe uma recuperação que possa ser testada antes da crise.
