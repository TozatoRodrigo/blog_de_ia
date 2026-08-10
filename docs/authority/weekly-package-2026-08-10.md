# Registro editorial — pacote semanal de autoridade

**Data da decisão:** 2026-08-10
**Automação:** `publicar-pacote-semanal-de-autoridade-seo-e-ia`
**Status inicial:** oportunidade aprovada para desenvolvimento; publicar somente após validação integral.

## Seleção antes da escrita

- **Tema central:** operação de agentes de IA em produção: observabilidade, SLOs, custos, incidentes e mudança.
- **Palavra-chave principal PT:** operação de agentes de IA.
- **Palavras-chave secundárias PT:** observabilidade de agentes de IA; monitoramento de agentes de IA; SLO para agentes de IA; incidentes em agentes de IA; custo de agentes de IA.
- **Palavra-chave principal EN:** AI agent operations.
- **Palavras-chave secundárias EN:** AI agent observability; monitoring AI agents in production; SLOs for AI agents; AI agent incident response; AI agent cost control.
- **Intenção:** informacional e prática, com decisão de implementação: transformar um agente que funciona em um sistema operável, mensurável e reversível.
- **Público:** Product Managers, líderes de engenharia, SRE/DevOps, responsáveis por governança e equipes que colocam agentes com ferramentas em produção.
- **Página pilar:** `/guias/agentes-de-ia/` e `/en/guides/ai-agents/`.
- **Estratégia:** 70% conteúdo estrutural/perene (modelo operacional, sinais, SLOs, incidentes e mudança) e 30% oportunidade recente (documentações de plataformas que passaram a tratar agentes como sistemas operacionais observáveis).

## Cobertura e canibalização

O acervo atual já cobre a definição e os padrões de agentes, como criá-los, n8n, exemplos, avaliação, governança e gestão de produto. A nova página não responde “o que são agentes” nem “como construir um agente”; responde “como operar depois que ele recebe tráfego e pode agir”. A pesquisa terá uma intenção ainda mais específica: auditoria sistemática de documentação oficial sobre controles operacionais. O template converterá esse resultado em uma checklist executável. Assim, guia, pesquisa e recurso têm papéis distintos na jornada `pilar → operação → evidência → checklist → lead`.

## Concorrentes e lacuna

Resultados atuais de busca consultados:

- documentação oficial de AWS DevOps Agent, Google Vertex AI Agent Engine e Microsoft Foundry;
- [Novamente — Agent Observability Guide](https://www.novamente.net/guides/agent-observability-guide/);
- [Momentum — Agent Operations Playbook](https://www.mmntm.net/articles/agent-operations-playbook);
- [Zylos Research — SRE for AI Agent Systems](https://zylos.ai/research/2026-03-22-sre-ai-agent-systems-observability-incident-response/);
- [Thales Gomes — Observabilidade de agentes de IA em produção](https://thalesgomes.com/blog/observabilidade-agentes-ia-producao/).

Esses resultados validam o interesse por observabilidade e operações, mas não oferecem, em uma única jornada bilíngue, um diagnóstico baseado em conjunto fechado de documentos oficiais, uma tradução de resultados em critérios de operação e um template privado com exemplo preenchido. A lacuna escolhida é unir método, decisão e execução sem prometer SLO universal ou inventar métricas de mercado.

## Pesquisa proposta

- **Pergunta:** quais controles operacionais aparecem explicitamente, de forma recorrente, nas documentações oficiais de plataformas e padrões que suportam agentes em produção?
- **Objetivo:** separar o que é recorrente o suficiente para entrar numa baseline de operação do que continua sendo uma decisão contextual.
- **Universo:** sete documentos oficiais, publicados ou mantidos por OpenAI, AWS, Google Cloud, Microsoft, NIST e OpenTelemetry, coletados em 2026-08-10.
- **Inclusão:** documento oficial com menção explícita a produção, observabilidade, tracing, avaliação, segurança/controle, custos/telemetria, incidentes ou mudança operacional.
- **Exclusão:** posts de opinião, conteúdo de terceiros, páginas sem contrato operacional explícito e duplicatas do mesmo documento.
- **Método:** leitura sistemática; cada documento recebe `sim` ou `não` para seis controles predefinidos: visibilidade de execução, telemetria de ferramentas/ações, avaliação de qualidade, métricas operacionais, controle de acesso/humano e incidentes/mudança/rollback. Um `sim` só é marcado quando o documento nomeia o controle ou um mecanismo equivalente; ausência de menção não significa ausência do recurso na plataforma.
- **Cálculo:** contagem de documentos com `sim` por controle, dividida por sete apenas para a proporção descritiva. Não é benchmark de qualidade nem comparação entre fornecedores.
- **Fontes candidatas:** OpenAI Agents SDK Tracing, AWS DevOps Agent Production Operations, Google Cloud Vertex AI Agent Engine, Microsoft Foundry Agent Monitoring Dashboard, Microsoft Foundry Tracing and Data Handling, NIST AI RMF Playbook e OpenTelemetry GenAI semantic conventions.

## Template proposto

Dois CSVs privados, em português e inglês: checklist de operação de agente. Cada arquivo terá instruções, os seis controles da auditoria, critérios de evidência, severidade, responsável, status, data de revisão e uma linha `EXAMPLE` preenchida com valores fictícios. Não terá macros, fórmulas, scripts, segredos ou dados pessoais reais. A apresentação pública será integrada ao guia, e a autorização continuará passando pelo endpoint de captura de lead existente.

## Dados de oportunidade

Search Console não estava acessível nesta execução. O conector Ubersuggest também não ficou disponível após a autenticação solicitada; portanto, nenhum volume, CPC, dificuldade, posição ou tráfego foi usado ou inferido. A escolha se apoia na cobertura real do acervo, na intenção observada nos resultados atuais, na verificabilidade das fontes e na capacidade de produzir evidência própria.
