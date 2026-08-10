---
title: "Pesquisa: quais controles a documentação oficial recomenda para operar agentes de IA"
seoTitle: "Pesquisa sobre operação de agentes de IA em produção"
description: "Auditoria reproduzível de sete documentos oficiais sobre observabilidade, avaliação, métricas, controle humano e incidentes em agentes de IA."
datePublished: "2026-08-10"
dateModified: "2026-08-10"
tags: ["pesquisa", "agentes de IA", "observabilidade", "operações"]
alternateSlug: "research-ai-agent-operations"
cluster: agents
isHub: false
sources:
  - name: "OpenAI Agents SDK — Tracing"
    url: "https://openai.github.io/openai-agents-python/tracing/"
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

Em uma auditoria de sete documentos oficiais, a visibilidade da execução apareceu em todos os documentos; métricas operacionais em seis; controle de acesso ou participação humana em seis; avaliação de qualidade em cinco; telemetria específica de ferramentas em três; e a conexão explícita entre incidente, mudança e rollback em apenas dois. O resultado é uma fotografia documental, não um ranking de plataformas nem uma medição do comportamento de agentes reais.

Esta página descreve a pesquisa original do Produto com IA. O [guia sobre operação de agentes em produção](/guias/operacao-de-agentes-de-ia/) transforma os achados em decisões e etapas. A [checklist privada de operação](/downloads/checklist-operacao-agente-de-ia.csv) transforma os seis controles em uma revisão executável.

## Pergunta e objetivo

**Pergunta:** quais controles operacionais aparecem explicitamente, de forma recorrente, nas documentações oficiais de plataformas e padrões que suportam agentes em produção?

**Objetivo:** identificar uma baseline de operação que uma equipe possa verificar antes de ampliar a autonomia de um agente, separando o que é recorrente na documentação do que ainda depende do contexto do produto.

Não testamos uma plataforma, não executamos agentes e não coletamos respostas de pessoas. A unidade é uma página de documentação. Isso permite reprodução com fontes públicas, mas limita o que pode ser concluído sobre eficácia.

## Universo e data da coleta

A coleta foi feita em **10 de agosto de 2026**, usando sete documentos oficiais mantidos por seis organizações. Microsoft aparece em dois documentos porque o dashboard e a política de tratamento de traces descrevem controles diferentes. A inclusão de duas páginas do mesmo fornecedor foi intencional e é uma limitação declarada, não uma tentativa de equilibrar fornecedores.

| ID | Documento incluído | Por que entrou |
|---|---|---|
| OAI | [OpenAI Agents SDK — Tracing](https://openai.github.io/openai-agents-python/tracing/) | Documenta traces, chamadas de ferramentas, handoffs, guardrails e eventos de uma execução. |
| AWS | [AWS DevOps Agent — Production operations](https://docs.aws.amazon.com/devopsagent/latest/userguide/working-with-devops-agent-production-operations-index.html) | Descreve detecção, investigação, recuperação, prevenção e relação com mudanças. |
| GCP | [Vertex AI Agent Engine overview](https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview) | Documenta deploy em produção, tracing, monitoramento, logging, IAM e avaliação. |
| MS-M | [Microsoft Foundry Agent Monitoring Dashboard](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/how-to-monitor-agents-dashboard) | Explicita métricas operacionais, avaliações contínuas, traces e controle de acesso. |
| MS-T | [Microsoft Foundry Tracing and Data Handling](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-data) | Explicita conteúdo de traces, chamadas de ferramentas, metadados e proteção de dados. |
| NIST | [NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/) | Traz ações sugeridas para medição, monitoramento, incidentes, fatores humanos e melhoria. |
| OTel | [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/) | Define nomes e atributos para agentes, operações, ferramentas e uso de tokens. |

### Critérios de inclusão

Entrou um documento oficial com menção explícita a pelo menos um aspecto de produção, observabilidade, tracing, avaliação, telemetria, controle de acesso, supervisão, incidente ou mudança operacional. O documento precisava ser público no momento da coleta.

### Critérios de exclusão

Foram excluídos artigos de terceiros, posts de opinião, páginas sem um mecanismo operacional nomeado, duplicatas do mesmo documento e resultados de busca que não pudessem ser confirmados na página oficial. A idade da página não foi critério de exclusão; a data de coleta é a referência para permitir repetição.

## Protocolo de codificação

Cada documento recebeu `sim` ou `não` para seis controles. “Sim” significa que a página nomeia o controle ou um mecanismo operacional equivalente. “Não” significa que o controle não apareceu explicitamente naquele documento; não significa que a plataforma não possua a capacidade.

1. **Visibilidade da execução:** tracing, logs, etapas ou sinais que permitam reconstruir a execução.
2. **Telemetria de ferramentas e ações:** chamada de ferramenta, operação de ação ou atributo que conecte o agente a um efeito externo.
3. **Avaliação de qualidade:** avaliação, testes, métricas de qualidade ou melhoria contínua baseada em resultados.
4. **Métricas operacionais:** latência, erro, uso, custo, taxa de sucesso ou sinais equivalentes de produção.
5. **Controle de acesso e humano:** IAM/RBAC, guardrails, aprovação, participação humana ou acesso governado à telemetria.
6. **Incidente, mudança e rollback:** resposta a incidentes, recuperação, prevenção, versionamento, implantação ou reversão conectados à operação.

O protocolo foi aplicado por leitura manual no mesmo dia. Não houve amostragem estatística, pesos por tamanho de página ou pontuação subjetiva de qualidade. O resultado pode ser reproduzido abrindo os sete URLs, procurando os conceitos correspondentes e aplicando essas definições.

## Matriz de dados observados

| Documento | Execução | Ferramentas/ações | Avaliação | Métricas | Acesso/humano | Incidente/mudança/rollback |
|---|---|---|---|---|---|---|
| OAI | sim | sim | sim | não | sim | não |
| AWS | sim | não | sim | sim | sim | sim |
| GCP | sim | não | sim | sim | sim | não |
| MS-M | sim | não | sim | sim | sim | não |
| MS-T | sim | sim | não | sim | sim | não |
| NIST | sim | não | sim | sim | sim | sim |
| OTel | sim | sim | não | sim | não | não |
| **Total** | **7/7** | **3/7** | **5/7** | **6/7** | **6/7** | **2/7** |

### Como os números foram calculados

Para cada coluna, contamos as células `sim` e dividimos pelo total de sete documentos. Assim, por exemplo, `3/7` para ferramentas significa que três documentos nomearam telemetria ou atributos de ações de maneira suficiente para o critério. A proporção descritiva correspondente é 42,9%, arredondada para uma casa decimal. Ela não é uma taxa de sucesso de agentes.

## Resultados observados

O primeiro resultado é a recorrência da visibilidade de execução: todos os documentos tratam traces, logs, monitoramento ou convenções como parte do diagnóstico. Isso sustenta uma prioridade operacional simples: sem identidade de run e contexto de versão, a equipe perde a capacidade de explicar o que aconteceu.

O segundo é a diferença entre observar a execução e observar a ação. Apenas três documentos descrevem explicitamente a ponte com ferramentas ou ações. Essa diferença importa porque um agente pode produzir texto plausível e ainda alterar um sistema de forma indevida. A telemetria de ferramenta deve incluir autorização, resultado e erro, com minimização de dados.

Avaliação e métricas aparecem em cinco e seis documentos, respectivamente. Isso indica que “monitorar” e “avaliar” são conceitos recorrentes, mas não define o que uma tarefa correta significa para cada produto. Um SLO precisa declarar denominador, janela, latência incluída, tratamento de escalonamento e custo relevante.

Controle de acesso ou humano aparece em seis documentos. O resultado não significa que exista aprovação humana para toda ação; o critério também aceita IAM, RBAC, guardrails e controle sobre quem lê telemetria. A inferência editorial é que autonomia precisa de uma fronteira técnica e de uma fronteira de responsabilidade.

Por fim, só dois documentos conectaram de forma explícita operação a incidentes, mudança e rollback. Isso é o principal alerta da análise: implantar tracing não fecha o ciclo se a equipe não tem contenção, versão, rollback e aprendizado pós-incidente.

## Observado versus inferido

### Resultado observado

- Os sete documentos mencionaram algum mecanismo de visibilidade da execução.
- Três nomearam telemetria ou convenções de ferramentas/ações.
- Cinco nomearam avaliações ou melhoria orientada por resultados.
- Seis mencionaram métricas operacionais.
- Seis mencionaram controle de acesso, guardrails ou participação humana.
- Dois conectaram explicitamente produção a incidentes, prevenção, mudanças ou recuperação.

### Inferência editorial

O Produto com IA recomenda uma ordem de implementação: reconstruir a execução; registrar ferramentas e efeitos; ligar qualidade, latência e custo ao resultado da tarefa; e fechar com controle, incidentes e mudanças reversíveis. Essa ordem não foi “medida” pela matriz. É uma recomendação editorial derivada da combinação dos controles e do risco de agir sem evidência.

## Limitações

O corpus é pequeno e deliberado. Ele representa documentação oficial selecionada, não todo o mercado. Dois documentos são da Microsoft, alguns produtos têm escopos diferentes e as páginas podem mudar após a data da coleta. A análise é binária e perde nuances: um “sim” não mede profundidade, disponibilidade, preço ou facilidade de uso.

Também não avaliamos se uma implementação real cumpre o que a documentação descreve. Não há benchmark, teste de latência, medição de custo, entrevistas, respondentes ou amostra de incidentes. Não é válido concluir que um fornecedor é melhor, que um controle garante segurança ou que as porcentagens representam a adoção da indústria.

Para repetir o estudo, salve a versão ou data das sete páginas, reabra os URLs, aplique as seis definições sem alterar o universo e compare as matrizes. Se uma fonte mudar, registre a mudança antes de recalcular. O CSV privado usa os mesmos seis controles para que uma equipe possa produzir evidência própria em seu agente.

## Conclusão

A pesquisa encontrou uma baseline clara, mas incompleta: visibilidade e métricas são frequentes; ferramentas, avaliação e controle exigem desenho local; incidentes, mudança e rollback são a conexão menos explícita. A oportunidade não é adicionar mais um dashboard. É conectar evidência de execução a decisões de qualidade, risco, custo e reversão.
