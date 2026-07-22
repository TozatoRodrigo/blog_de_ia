---
title: "Checklist de governança de IA para produtos e empresas"
seoTitle: "Checklist de governança de IA"
description: "Checklist de governança de IA para discovery, dados, avaliação, aprovação, lançamento, monitoramento, incidentes e desativação."
datePublished: "2026-07-22"
dateModified: "2026-07-22"
tags: ["governança de IA", "checklist", "risco"]
alternateSlug: "ai-governance-checklist"
cluster: governance
isHub: false
downloads:
  - label: "Baixar checklist de governança"
    href: "/downloads/checklist-governanca-de-ia.md"
    format: "Markdown"
sources:
  - name: "NIST AI RMF Core"
    url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/"
  - name: "NIST AI RMF Playbook"
    url: "https://airc.nist.gov/airmf-resources/playbook/"
  - name: "ISO/IEC 42001:2023"
    url: "https://www.iso.org/standard/42001"
draft: false
---

Este checklist converte governança de IA em evidências de trabalho. Ele não é certificação nem parecer jurídico. Adapte a profundidade ao impacto, à jurisdição e ao papel da organização como desenvolvedora, fornecedora ou usuária.

## Discovery e finalidade

- problema, usuário e resultado esperado estão documentados;
- alternativas sem IA foram consideradas;
- usos proibidos e fora de escopo estão claros;
- pessoas potencialmente afetadas participaram da análise;
- existe proprietário de produto e responsável pela decisão.

## Dados, modelo e fornecedor

- origem, direito de uso, qualidade e retenção dos dados foram verificados;
- dados pessoais e confidenciais foram minimizados;
- modelo, versão, fornecedor e região estão registrados;
- treinamento com dados da organização e suboperadores foram avaliados;
- troca, indisponibilidade e encerramento do fornecedor têm plano.

## Risco e avaliação

- o sistema está no [inventário de IA](/guias/inventario-sistemas-de-ia/);
- impacto, probabilidade, escala e reversibilidade foram classificados;
- o conjunto de testes representa usos normais, críticos e adversariais;
- limites de qualidade, segurança, custo e latência foram definidos antes do teste;
- riscos não medidos estão explicitamente registrados.

## Lançamento e operação

- aprovação corresponde ao nível de risco;
- usuários recebem informação e instruções adequadas;
- supervisão humana tem autoridade, contexto e tempo para agir;
- logs, alertas, rollback e resposta a incidente foram testados;
- mudanças de modelo, prompt, ferramenta e dados são versionadas;
- revisão periódica e critérios de desativação têm data e responsável.

Use o [guia de governança de IA](/guias/governanca-de-ia/) para entender o sistema completo e a [matriz de risco](/guias/matriz-risco-ia/) para a triagem inicial.
