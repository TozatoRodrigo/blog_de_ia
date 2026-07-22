---
title: "Governança de IA: guia prático para produtos e empresas"
seoTitle: "Governança de IA: guia prático para produtos"
description: "Implemente governança de IA com inventário, classificação de risco, avaliações, supervisão humana, monitoramento e resposta a incidentes."
datePublished: "2026-07-22"
dateModified: "2026-07-22"
tags: ["governança de IA", "risco", "NIST AI RMF"]
alternateSlug: "ai-governance"
cluster: governance
isHub: true
sources:
  - name: "NIST AI Risk Management Framework"
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
  - name: "NIST Generative AI Profile"
    url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf"
  - name: "Comissão Europeia — AI Act"
    url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"
draft: false
---

Governança de IA é o sistema de decisões, controles e responsabilidades usado para obter valor de inteligência artificial dentro do risco aceito pela organização. Não é um comitê que aprova tudo no fim. Ela começa no discovery e continua durante operação, mudança de modelo e desativação.

O NIST AI RMF organiza o trabalho em quatro funções: governar, mapear, medir e gerenciar. Elas não formam uma fila; acontecem continuamente. Para times de produto, isso se traduz em saber quais sistemas existem, por que existem, como são avaliados e quem responde quando falham.

## 1. Inventário de sistemas de IA

Registre produtos, recursos internos, fornecedores e modelos. Para cada uso, documente proprietário, finalidade, usuários, dados, fornecedor, integrações, versão, impacto e data da última revisão. Inclua experimentos e ferramentas compradas por áreas de negócio; risco invisível não pode ser gerenciado.

## 2. Classificação de risco

Classifique pela consequência, não pelo tamanho do modelo. Considere impacto sobre direitos, dinheiro, emprego, crédito, saúde, segurança, privacidade e reputação. Avalie também escala, reversibilidade e capacidade do usuário de contestar.

Uma matriz simples usa probabilidade e severidade. Baixo risco pode ter aprovação do time e monitoramento básico. Risco médio exige avaliação documentada, revisão de privacidade e plano de supervisão. Alto risco demanda especialistas, liderança responsável, testes independentes e controles mais fortes.

## 3. Evidências antes do lançamento

Defina condições de aprovação e bloqueio. O pacote mínimo inclui:

- finalidade e uso proibido;
- conjunto de avaliação representativo;
- desempenho por grupo e caso crítico;
- testes de segurança e abuso;
- privacidade, direitos sobre dados e retenção;
- custo, latência e resiliência;
- instruções ao usuário e supervisão humana;
- plano de rollback e resposta a incidente.

O perfil de IA generativa do NIST destaca riscos como confabulação, conteúdo perigoso, privacidade, propriedade intelectual e dependência excessiva. Cada risco relevante deve ter medida, limite e responsável.

## 4. Operação e mudança

Modelos e fornecedores mudam. Trate troca de modelo, prompt relevante, fonte de dados e política de segurança como mudanças versionadas. Reexecute avaliações antes de promover uma alteração e monitore qualidade real depois.

Registre incidentes e quase-incidentes. Um processo útil informa severidade, contenção, pessoas afetadas, causa, comunicação e ação preventiva. O objetivo não é punir quem reporta, mas reduzir repetição.

## 5. Transparência e direitos do usuário

Informe quando uma pessoa interage com IA quando isso for material para sua decisão. Explique finalidade e limitações em linguagem clara. Ofereça correção, contestação ou atendimento humano para decisões importantes.

O AI Act europeu aplica obrigações conforme o risco e estabelece exigências de transparência para determinados sistemas e conteúdos gerados. Mesmo quando uma empresa não está diretamente sujeita à norma, transparência, registro e supervisão são práticas úteis de produto. Requisitos legais devem ser confirmados com assessoria qualificada na jurisdição aplicável.

## Papéis e responsabilidades

O PM responde por finalidade, experiência, métricas e decisão de lançamento. Engenharia responde por implementação, segurança e observabilidade. Dados/ML cuidam de avaliação e comportamento do modelo. Jurídico e privacidade interpretam obrigações. Segurança testa abuso. Operações mantém supervisão e resposta. A liderança define apetite de risco e aceita exceções.

## Perguntas frequentes

### Governança deixa o time lento?

Governança proporcional reduz retrabalho. Checklists claros e caminhos diferentes por risco tornam a aprovação previsível. O oposto — discutir tudo do zero após construir — é mais lento.

### Toda IA precisa de humano no loop?

Não. O nível depende do impacto e da confiança demonstrada. Sistemas de baixo risco podem usar monitoramento por amostra; decisões de alto impacto geralmente precisam de revisão ou recurso humano.

### Qual documento criar primeiro?

Comece pelo inventário. Depois escolha um caso real e crie sua ficha de risco e evidências. A política deve nascer do fluxo operacional, não de um texto genérico.

Governança eficaz torna a inovação repetível: o time sabe quais provas precisa produzir, quem decide e como agir quando a realidade diverge do plano.

Para transformar o guia em operação, use o [checklist de governança](/guias/checklist-governanca-de-ia/), a [matriz de risco](/guias/matriz-risco-ia/) e o [inventário de sistemas de IA](/guias/inventario-sistemas-de-ia/). A ISO/IEC 42001 oferece uma referência de sistema de gestão; ela não substitui a análise das obrigações legais aplicáveis ao caso.
