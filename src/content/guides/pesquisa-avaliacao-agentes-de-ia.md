---
title: "Pesquisa: quais controles oficiais aparecem na avaliação de agentes de IA?"
seoTitle: "Pesquisa sobre avaliação de agentes de IA"
description: "Auditoria reproduzível de oito documentos oficiais sobre casos, resultados, trajetórias, gates, produção e revisão humana de agentes."
datePublished: "2026-08-31"
dateModified: "2026-08-31"
tags: ["agentes de IA", "pesquisa", "avaliação", "evals", "governança"]
alternateSlug: "research-ai-agent-evaluation"
cluster: agents
isHub: false
downloads:
  - label: "Baixar checklist de gate de avaliação"
    href: "/downloads/checklist-gate-avaliacao-agente.csv"
    format: "CSV"
sources:
  - name: "OpenAI — Evaluate agent workflows"
    url: "https://developers.openai.com/api/docs/guides/agent-evals"
  - name: "OpenAI Agents SDK — Testing"
    url: "https://openai.github.io/openai-agents-python/testing/"
  - name: "OpenAI — Evaluation best practices"
    url: "https://developers.openai.com/api/docs/guides/evaluation-best-practices"
  - name: "Anthropic — Demystifying evals for AI agents"
    url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
  - name: "Microsoft Foundry — Evaluate your AI agents"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent"
  - name: "Microsoft Foundry — Test a hosted agent"
    url: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent"
  - name: "Google Cloud — Evaluate agents using the GenAI Client"
    url: "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/evaluate"
  - name: "NIST AI RMF Playbook — Measure"
    url: "https://airc.nist.gov/airmf-resources/playbook/measure/"
draft: false
---

Esta pesquisa auditou oito páginas oficiais e encontrou uma base comum: os oito documentos mencionaram tarefas ou conjuntos de teste e critérios de sucesso. A cobertura ficou menos uniforme quando a avaliação exigiu trajetória, comparação, produção e pessoas. Sete documentos mencionaram evidência de trajetória e comparação ou regressão; seis mencionaram múltiplos avaliadores ou sinais; cinco explicitaram um gate pré-release e um ciclo pós-release; apenas três mencionaram calibração ou revisão humana.

O resultado é um diagnóstico do corpus selecionado, não uma taxa de mercado. A [pesquisa em inglês](/en/guides/research-ai-agent-evaluation/) contém a mesma matriz e o [guia de avaliação de agentes de IA](/guias/avaliacao-agentes-de-ia/) traduz os achados em decisões de produto. O [checklist privado de gate](/downloads/checklist-gate-avaliacao-agente.csv) transforma cada controle em campo de trabalho.

## Pergunta e objetivo

**Pergunta:** quais controles aparecem explicitamente em documentos oficiais atuais quando eles orientam a avaliação ou o teste de agentes e sistemas de IA?

**Objetivo:** identificar a cobertura documental de oito controles que uma equipe pode usar para desenhar um gate de avaliação:

1. conjunto de tarefas ou dados de teste;
2. resultado ou critério de sucesso;
3. trajetória, trace, ferramentas ou processo observável;
4. múltiplos avaliadores ou sinais de qualidade;
5. repetição, comparação de versões ou regressão;
6. gate pré-release ou integração com CI;
7. acompanhamento em produção ou feedback pós-release;
8. revisão humana, especialista ou calibração independente.

O objetivo não foi ranquear fornecedores. Uma página pode mencionar um controle sem oferecer uma implementação completa; “sim” significa apenas presença explícita no texto.

## Universo e data da coleta

O universo foi definido antes da leitura: páginas públicas, em inglês, mantidas por OpenAI, Anthropic, Microsoft, Google Cloud ou NIST, acessíveis em 31 de agosto de 2026, com orientação direta sobre avaliação, teste, medição ou operação avaliável de modelos, workflows ou agentes.

Foram incluídas duas páginas da OpenAI, uma da Anthropic, duas da Microsoft Foundry, uma do Google Cloud e uma página do NIST, além de outra orientação da OpenAI. A unidade é a página, não o fornecedor. Por isso, a matriz não deve ser lida como “sete fornecedores de oito”; ela mede a presença dos controles no conjunto de documentos escolhido.

### Critérios de inclusão

- página oficial do domínio institucional ou documentação oficial do produto;
- conteúdo acessível sem depender de uma conta durante a coleta;
- referência explícita a avaliação, teste, métricas, traces, datasets, graders ou qualidade do sistema;
- página disponível em 31/08/2026.

### Critérios de exclusão

- posts de terceiros, resultados de busca e discussões de comunidade;
- páginas de marketing sem instrução operacional verificável;
- documentação apenas sobre preço, arquitetura ou segurança sem avaliação/teste;
- duplicatas da mesma página em outro idioma ou URL de impressão.

## Fontes auditadas

| ID | Documento |
|---|---|
| O1 | [OpenAI — Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals) |
| O2 | [OpenAI Agents SDK — Testing](https://openai.github.io/openai-agents-python/testing/) |
| O3 | [OpenAI — Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) |
| A1 | [Anthropic — Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) |
| M1 | [Microsoft Foundry — Evaluate your AI agents](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent) |
| M2 | [Microsoft Foundry — Test a hosted agent](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent) |
| G1 | [Google Cloud — Evaluate agents using the GenAI Client](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/evaluate) |
| N1 | [NIST AI RMF Playbook — Measure](https://airc.nist.gov/airmf-resources/playbook/measure/) |

## Método de coleta e cálculo

Li cada página na data indicada e marquei `1` quando encontrei uma instrução explícita correspondente ao controle. Marquei `0` quando a página não trazia essa instrução de forma clara, mesmo que o controle pudesse ser inferido a partir da arquitetura do produto.

O cálculo de cada linha é a soma dos oito controles daquela página. O cálculo de cada coluna é a soma dos `1` na coluna, dividido por oito para formar a proporção descritiva. Não houve amostragem de usuários, entrevistas, execução de agentes, chamadas pagas ou coleta de dados pessoais. A pesquisa é uma auditoria documental, não um benchmark de desempenho.

Para reduzir interpretação, usei estas definições:

| Código | Controle contado como “sim” |
|---|---|
| T | A página define tarefas, casos, dataset ou suite de teste. |
| R | A página define resultado, qualidade, aderência, estado final ou critério de sucesso. |
| X | A página menciona trace, trajetória, chamadas de ferramenta, etapas intermediárias ou logs de processo como objeto de avaliação. |
| G | A página combina avaliadores, métricas, rubricas ou sinais independentes. |
| C | A página orienta repetir, comparar versões, medir drift ou proteger regressões. |
| P | A página recomenda teste antes do release, gate de pré-produção ou CI. |
| L | A página descreve monitoramento, avaliação contínua, traces reais ou feedback depois do release. |
| H | A página menciona revisão humana, especialistas, calibração ou avaliação independente. |

## Dados para reprodução

`1` significa presença explícita; `0` significa ausência explícita no recorte auditado.

| Fonte | T | R | X | G | C | P | L | H | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| O1 | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 4 |
| O2 | 1 | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 4 |
| O3 | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 1 | 7 |
| A1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 8 |
| M1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 7 |
| M2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 7 |
| G1 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 4 |
| N1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 8 |
| **Total** | **8** | **8** | **7** | **6** | **7** | **5** | **5** | **3** | **—** |

## Resultados observados

### 1. Casos e resultado aparecem em todo o corpus

Os oito documentos falam de tarefas, casos, conjuntos ou critérios para decidir se o sistema funciona. Isso não significa que todos usem o mesmo desenho. O [OpenAI Agent Evals](https://developers.openai.com/api/docs/guides/agent-evals) separa traces e datasets conforme a equipe sai da depuração e precisa de repetibilidade. A [Microsoft](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent) descreve um dataset e resultados por linha e por avaliador. O [Google Cloud](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/evaluate) mostra dataset, inferência, execução e métricas específicas de agentes.

O achado sustenta um requisito mínimo: uma avaliação sem caso e sem critério de sucesso não é reproduzível. Ele não sustenta um tamanho universal de dataset nem uma taxa de aprovação universal.

### 2. A trajetória é quase tão presente quanto o resultado

Sete páginas mencionam trace, ferramentas, etapas, chamadas, logs de processo ou evidência intermediária. A exceção foi a página de boas práticas gerais da OpenAI, que recomenda logs e avaliação por arquitetura, mas não apresenta a trajetória de agente como objeto explícito naquele recorte.

Essa diferença é importante para o produto. O resultado informa se a tarefa acabou; a trajetória ajuda a explicar se o sistema usou uma ferramenta permitida, passou por uma aprovação ou chegou ao estado final por uma sequência inesperada.

### 3. Comparação é mais frequente que gate

Sete páginas orientam algum tipo de comparação, repetição, versionamento, regressão ou manutenção. Apenas cinco falam explicitamente em gate pré-release, CI ou teste antes de implantar. A presença de uma avaliação não garante que ela bloqueie uma mudança.

O [teste de agentes hospedados da Microsoft](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent) é explícito sobre versionar a receita e usá-la como gate de qualidade em CI. O [NIST](https://airc.nist.gov/airmf-resources/playbook/measure/) amplia o enquadramento para testes antes da implantação, documentação de validade e monitoramento em operação.

### 4. O ciclo pós-release aparece em metade das páginas

Cinco das oito páginas mencionam monitoramento, avaliação contínua, produção, traces reais ou feedback posterior. Isso é coerente com a diferença entre avaliar uma mudança em cenário controlado e descobrir falhas na distribuição real. O guia da Anthropic coloca avaliação automatizada ao lado de monitoramento de produção, testes A/B, feedback e revisão de transcripts; a OpenAI recomenda avaliação contínua e crescimento do conjunto a partir de novos casos.

O número não diz que as outras três páginas negam monitoramento. Apenas não o contaram explicitamente segundo o critério definido.

### 5. Calibração humana é a camada menos frequente

Só três páginas mencionam revisão humana, especialistas ou calibração de maneira explícita: OpenAI Evaluation Best Practices, Anthropic Evals e NIST Measure. Isso não torna um avaliador automático inválido; mostra que a documentação do corpus fala menos sobre como verificar o próprio avaliador.

O [guia da Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) descreve graders baseados em código, modelo e humanos e recomenda ler transcripts. O [NIST](https://airc.nist.gov/airmf-resources/playbook/measure/) inclui documentação, especialistas e avaliação independente como parte da medição de características confiáveis.

## Inferência editorial

A partir dos dados, recomendo um gate em camadas: primeiro resultado e ações proibidas, depois trajetória e operação, e por fim revisão humana calibrada para o que não puder ser verificado de forma determinística. Essa é uma inferência do Produto com IA, não uma regra que os oito documentos tenham publicado em conjunto.

Também recomendo separar duas decisões: **capacidade**, que pergunta o que o agente consegue fazer, e **regressão**, que protege o que já funcionava. Uma média única pode esconder a falha crítica de um caso proibido; por isso, segurança e integridade de estado devem ser gates obrigatórios, não apenas componentes de uma nota.

## Limitações

- O corpus tem oito páginas e foi escolhido por relevância operacional, não por amostragem aleatória.
- A unidade é uma página; páginas do mesmo fornecedor não são independentes.
- A leitura foi feita em inglês, e mudanças posteriores nas páginas podem alterar a matriz.
- “Presença explícita” não mede profundidade, qualidade, adoção ou eficácia do controle.
- O estudo não executou agentes, não mediu latência, custo, precisão, segurança ou correlação entre avaliação offline e produção.
- Não foram usadas métricas do Search Console, Ubersuggest, clientes ou leads.

## Como usar o resultado

Comece pelo [guia de avaliação de agentes](/guias/avaliacao-agentes-de-ia/), escolha um fluxo e registre o caso no [checklist privado de gate](/downloads/checklist-gate-avaliacao-agente.csv). Use `T` e `R` como base; adicione `X`, `G`, `C`, `P`, `L` e `H` conforme o risco. Para arquitetura e limites, consulte o [guia pilar de agentes de IA](/guias/agentes-de-ia/). Para o que acontece depois do lançamento, continue no [guia de operação de agentes](/guias/operacao-de-agentes-de-ia/).
