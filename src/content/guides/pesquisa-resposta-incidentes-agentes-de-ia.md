---
title: "Pesquisa: quais controles oficiais aparecem na recuperação de agentes de IA?"
seoTitle: "Pesquisa sobre resposta a incidentes de agentes de IA"
description: "Auditoria reproduzível de oito documentos oficiais sobre detecção, contenção, retomada, fallback e aprovação na recuperação de agentes de IA."
datePublished: "2026-08-17"
dateModified: "2026-08-17"
tags: ["pesquisa", "agentes de IA", "incidentes", "rollback", "operações"]
alternateSlug: "research-ai-agent-incident-response"
cluster: agents
sources:
  - name: "AWS Agentic AI Lens — behavior versioning and rollback"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops02-bp03.html"
  - name: "AWS Agentic AI Lens — validation and approval workflows"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops06-bp03.html"
  - name: "AWS Agentic AI Lens — checkpoint-based recovery"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel03-bp03.html"
  - name: "AWS Agentic AI Lens — fallback and graceful degradation"
    url: "https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel04-bp03.html"
  - name: "AWS Prescriptive Guidance — incident response and business continuity"
    url: "https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-incident-response.html"
  - name: "OpenAI Agents SDK — human-in-the-loop"
    url: "https://openai.github.io/openai-agents-python/human_in_the_loop/"
  - name: "Microsoft Foundry — agent tracing"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept"
  - name: "Google Cloud — Agent Runtime monitoring"
    url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/monitoring"
draft: false
---

Esta pesquisa encontrou cinco controles explícitos em oito documentos oficiais de orientação: detecção/telemetria em **6/8**, contenção ou redução de capacidade em **5/8**, recuperação de estado ou comportamento em **5/8**, fallback/degradação em **2/8** e validação, aprovação ou rollback em **5/8**. Os números descrevem a documentação selecionada; não são um ranking de fornecedores, uma taxa de incidentes ou uma medida de maturidade.

## Pergunta e objetivo

**Pergunta:** quais mecanismos de recuperação aparecem explicitamente em documentos oficiais de orientação técnica para agentes de IA?

**Objetivo:** transformar a lacuna observada no primeiro estudo de operação de agentes — a baixa menção conjunta a incidentes, mudanças e rollback — em uma matriz mais estreita sobre recuperação. O resultado serve de critério para o [guia de resposta a incidentes](/guias/resposta-incidentes-agentes-de-ia/) e para o [runbook privado](/downloads/runbook-incidentes-agente-de-ia.csv).

## Universo e data da coleta

O universo tem oito páginas públicas, coletadas e codificadas manualmente em **17 de agosto de 2026**. Foram incluídos quatro documentos do AWS Agentic AI Lens, uma orientação prescritiva da AWS, uma página do OpenAI Agents SDK, uma página do Microsoft Foundry e uma página do Google Agent Runtime. A unidade de análise é a página, não o fornecedor.

### Critérios de inclusão

- publicação oficial do fornecedor, órgão ou projeto responsável pela documentação;
- página acessível publicamente na data da coleta;
- referência explícita a agentes, execução de ferramentas, operação, observabilidade, aprovação, recuperação, fallback ou rollback;
- conteúdo suficientemente específico para codificar pelo menos uma das cinco categorias.

### Critérios de exclusão

- posts de blog de terceiros, notícias, páginas de marketing sem orientação operacional e discussões de comunidade;
- páginas duplicadas da mesma URL ou versões traduzidas;
- afirmações de que um controle seria desejável quando a página não descrevesse o mecanismo;
- inferências baseadas somente no fato de uma plataforma possuir um produto relacionado.

## Protocolo de codificação

Cada página recebeu `1` quando mencionou explicitamente o controle ou um equivalente operacional. Recebeu `0` quando o controle não apareceu no texto analisado. A regra conservadora foi aplicada desta forma:

1. **Detecção/telemetria:** métricas, traces, logs, alertas ou observabilidade para perceber comportamento fora do limite.
2. **Contenção:** pausa, rejeição, desligamento, redução de tráfego, modo seguro, bloqueio ou limitação que reduza o próximo efeito.
3. **Recuperação:** checkpoint, retomada, idempotência, rollback de comportamento, recuperação de serviço ou restauração de estado.
4. **Fallback/degradação:** alternativa ordenada, resposta parcial, equipe manual ou continuidade explicitamente usada quando o caminho principal falha.
5. **Validação/aprovação/rollback:** aprovação humana, avaliação, teste de falha, promoção controlada ou rollback definido como gate de mudança.

Uma mesma página pode receber `1` em mais de uma coluna. “Não mencionado” não significa que o fornecedor não tenha o controle em outra página. A codificação avalia presença textual, não a qualidade da implementação.

## Matriz de dados observados

| Documento | Detecção | Contenção | Recuperação | Fallback | Validação/aprovação/rollback |
| --- | ---: | ---: | ---: | ---: | ---: |
| AWS — behavior versioning and rollback | 1 | 1 | 1 | 0 | 1 |
| AWS — validation and approval workflows | 1 | 1 | 1 | 0 | 1 |
| AWS — checkpoint-based recovery | 0 | 0 | 1 | 0 | 0 |
| AWS — fallback and graceful degradation | 1 | 1 | 0 | 1 | 1 |
| AWS — incident response and business continuity | 1 | 1 | 1 | 1 | 0 |
| OpenAI Agents SDK — human-in-the-loop | 0 | 1 | 1 | 0 | 1 |
| Microsoft Foundry — agent tracing | 1 | 0 | 0 | 0 | 1 |
| Google Agent Runtime — monitoring | 1 | 0 | 0 | 0 | 0 |
| **Total de páginas com menção** | **6/8** | **5/8** | **5/8** | **2/8** | **5/8** |

### Evidência codificada por documento

- **AWS behavior versioning and rollback:** explicita versionamento de prompts, permissões e limites, baseline conhecida, rollout gradual, métricas de impacto e rollback testado.
- **AWS validation and approval workflows:** explicita validação por risco, aprovação, gates de avaliação, rollback para mudanças e testes periódicos.
- **AWS checkpoint-based recovery:** explicita estado persistido, checkpoints, idempotência e retomada; não descreve monitoramento ou fallback como foco da página.
- **AWS fallback and graceful degradation:** explicita health checks, alternativas ordenadas, evento de degradação e chaos testing; não descreve undo de efeitos externos.
- **AWS incident response and business continuity:** explicita observabilidade, shutdown de emergência, continuidade manual/fallback e métodos de recuperação.
- **OpenAI Agents SDK human-in-the-loop:** explicita pausa, aprovação/rejeição, serialização e retomada do estado de execução, além de marcador de versão para tarefas pendentes.
- **Microsoft Foundry agent tracing:** explicita inputs, outputs, ferramentas, tokens, latência, erros e eventos de avaliação; não descreve contenção ou rollback nessa página.
- **Google Agent Runtime monitoring:** explicita métricas, códigos de resposta, consultas e alertas; não descreve recuperação ou contenção na página auditada.

## Como os números foram calculados

Para cada coluna, somei os `1` e dividi por oito. Assim, detecção foi `6 ÷ 8 = 75%`; contenção foi `5 ÷ 8 = 62,5%`; recuperação foi `5 ÷ 8 = 62,5%`; fallback foi `2 ÷ 8 = 25%`; e validação/aprovação/rollback foi `5 ÷ 8 = 62,5%`. As porcentagens são apenas outra forma de exibir a mesma contagem e foram arredondadas para uma casa decimal quando necessário.

## Resultados observados

### Detecção aparece mais que recuperação operacional

Seis páginas descrevem métricas, traces, logs ou alertas. Isso é importante para localizar uma falha, mas observar não significa conseguir interromper o próximo efeito ou recuperar um registro já alterado. A página do Microsoft Foundry, por exemplo, documenta traces com ferramentas, latência, custo e avaliação; a página do Google documenta métricas e alertas de Agent Runtime. Sob o protocolo, nenhuma das duas recebeu `1` em recuperação.

### Fallback é o controle menos frequente

Apenas duas páginas mencionam fallback/degradação dentro do texto auditado: a orientação específica da AWS para workflows colaborativos e a orientação de continuidade para sistemas agentic. Isso não prova que os outros documentos não ofereçam alternativas; mostra que uma equipe não deve presumir que “retry” ou “monitoramento” equivalem a uma rota de continuidade.

### Recuperação tem mais de uma forma

As cinco páginas com recuperação não descrevem a mesma coisa. Há rollback de comportamento, checkpoint e idempotência, retomada de estado, recuperação de serviço e shutdown com continuidade. Essa diferença sustenta a separação editorial entre restaurar configuração, continuar uma execução e compensar um efeito externo.

### Aprovação não substitui prova de reversibilidade

O documento do OpenAI Agents SDK mostra como pausar uma chamada de ferramenta e retomá-la depois de aprovação. Isso é um controle de autorização, não um undo. Da mesma forma, uma validação de release pode reduzir a chance de regressão sem garantir que uma ação externa possa ser revertida. O runbook combina aprovação com evidência de efeito e caminho de compensação.

## Observado versus inferido

### Resultado observado

Na amostra, detecção/telemetria teve a maior cobertura, com 6 de 8 páginas. Fallback/degradação teve a menor, com 2 de 8. Cinco de oito páginas mencionaram contenção, recuperação ou validação/aprovação/rollback conforme as definições acima.

### Inferência editorial

Uma equipe que começa apenas com dashboards provavelmente terá mais facilidade para localizar o incidente do que para decidir se deve pausar uma ferramenta, retomar um checkpoint, restaurar uma baseline ou reconciliar um efeito externo. Por isso, o template deste pacote exige campos separados para evidência, contenção, recuperação e compensação. Essa é uma recomendação do Produto com IA derivada da matriz; não é um resultado medido em incidentes reais.

## Limitações

O universo é pequeno, intencional e não probabilístico. Quatro páginas são do mesmo conjunto AWS, o que torna inadequado comparar fornecedores ou generalizar para todo o mercado. A seleção também privilegia documentação em inglês e páginas encontradas por busca pública; uma página não incluída pode alterar a distribuição.

A auditoria é de conteúdo documental, não de código executado. Não medimos tempo de recuperação, taxa de falha, qualidade de fallback, custo, disponibilidade, incidentes ou resultados de clientes. As páginas podem mudar depois da coleta. Reproduzir a pesquisa significa acessar as mesmas URLs, registrar a data, aplicar as definições e refazer a matriz; não significa esperar os mesmos números se o texto oficial for atualizado.

## Conclusão

O resultado mais útil não é a porcentagem isolada. É a assimetria: documentação de observabilidade é mais comum que uma instrução explícita sobre continuidade, e fallback aparece pouco. Para um agente que age em sistemas externos, a prontidão precisa ser testada em camadas: detectar, conter, recuperar o estado, tratar o efeito e validar o retorno. O [guia completo](/guias/resposta-incidentes-agentes-de-ia/) aplica essa sequência; o [runbook](/downloads/runbook-incidentes-agente-de-ia.csv) deixa a evidência pronta para uma revisão de prontidão.
