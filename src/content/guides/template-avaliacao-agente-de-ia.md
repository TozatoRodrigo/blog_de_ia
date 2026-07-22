---
title: "Template de avaliação de agente de IA"
seoTitle: "Template para avaliar agentes de IA"
description: "Avalie agentes de IA por conclusão, ferramentas, segurança, custo, latência, supervisão e prontidão para lançamento."
datePublished: "2026-07-22"
dateModified: "2026-07-22"
tags: ["agentes de IA", "evals", "template"]
alternateSlug: "ai-agent-evaluation-template"
cluster: agents
isHub: false
downloads:
  - label: "Baixar template de avaliação"
    href: "/downloads/template-avaliacao-agente-de-ia.csv"
    format: "CSV"
sources:
  - name: "OpenAI Agents SDK — Tracing and evaluations"
    url: "https://openai.github.io/openai-agents-python/"
  - name: "NIST Generative AI Profile"
    url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence"
draft: false
---

Avaliar um agente exige testar o sistema completo: modelo, instruções, contexto, ferramentas, permissões e tratamento de falhas. O template organiza evidências antes de ampliar autonomia.

## Identificação

Registre nome, versão, proprietário, objetivo, usuários, ambientes, modelo, instruções, ferramentas, fontes de dados e data. Qualquer mudança relevante deve produzir uma nova rodada de avaliação.

## Casos de teste

Inclua identificador, tipo de caso, entrada, resultado esperado, ferramenta esperada, ações proibidas, necessidade de aprovação e gravidade da falha. Mantenha casos normais, ambíguos, incompletos, adversariais e de indisponibilidade.

## Métricas

- tarefa concluída corretamente;
- ferramenta e parâmetros corretos;
- evidência ou citação válida;
- respeito a permissão e aprovação;
- número de passos e repetições;
- custo e latência;
- escalonamento correto;
- recuperação de erro.

## Decisão

Defina limites antes de executar. Classifique cada falha por impacto e registre correção, responsável e reteste. A decisão final pode ser: bloquear, manter em experimento, lançar em modo de sugestão, lançar com aprovação ou permitir execução delimitada.

O arquivo para download contém colunas estáveis e uma linha marcada como exemplo. Adapte os limites ao risco do caso e conecte a decisão ao [guia de governança de IA](/guias/governanca-de-ia/).
