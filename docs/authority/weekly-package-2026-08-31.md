# Pacote semanal de autoridade — 2026-08-31

## Decisão editorial

**Decisão:** publicar, condicionada à validação integral, ao push SSH e ao deploy oficial.

**Tema central:** avaliação de agentes de IA: como transformar casos, trajetória, resultado e risco em um gate de lançamento.

**Palavra-chave principal (PT):** avaliação de agentes de IA.

**Palavras-chave secundárias (PT):** como avaliar agentes de IA; avaliação de agentes em produção; métricas de agentes de IA; testes de agentes de IA; prontidão de agente de IA.

**Primary keyword (EN):** AI agent evaluation.

**Secondary keywords (EN):** how to evaluate AI agents; agent evaluation in production; AI agent evaluation metrics; AI agent testing; AI agent release gate.

**Intenção:** informacional e operacional. A pessoa quer entender o que avaliar, reunir evidência e decidir se uma mudança de modelo, instrução, ferramenta ou política pode avançar.

**Público:** Product Managers, Tech Leads, engenharia, QA, SRE, segurança e responsáveis por governança que precisam avaliar um agente antes ou depois de uma mudança relevante.

**Página pilar:** [Agentes de IA: o que são, como funcionam e quando usar](/guias/agentes-de-ia/) e sua versão [AI Agents](/en/guides/ai-agents/).

**Concorrentes analisados:** MAKINAI, Currai, sinc-LLM, LangChain, Snowflake e Data AI Hub. Os resultados atuais cobrem checklists, ferramentas e guias gerais; a lacuna explorada é uma orientação bilíngue, orientada a Product Managers, que separa resultado verificável, trajetória, ações de ferramenta, segurança e decisão de release e publica uma auditoria documental reproduzível.

**Lacuna competitiva:** transformar “o agente parece funcionar” em uma decisão auditável, sem vender uma métrica universal ou depender de uma plataforma específica. O acervo próprio já tinha um template de avaliação, mas não tinha um guia dedicado nem uma pesquisa documental sobre a frequência dos controles recomendados.

**Pergunta da pesquisa:** quais controles aparecem explicitamente em documentos oficiais atuais quando eles orientam a avaliação ou o teste de agentes e sistemas de IA?

**Método planejado:** auditoria manual binária de oito páginas oficiais coletadas em 2026-08-31. A unidade é a página, não o fornecedor. Cada controle recebe “sim” apenas quando há menção explícita ao mecanismo ou a um equivalente operacional. A matriz completa, os critérios e as limitações serão publicados na pesquisa.

**Fontes candidatas:** OpenAI Agent Evals, OpenAI Agents SDK Testing, OpenAI Evaluation Best Practices, Anthropic Demystifying Evals for AI Agents, Microsoft Foundry Evaluate your AI agents, Microsoft Foundry Test a hosted agent, Google Vertex AI Agent Engine Evaluate agents e NIST AI RMF Playbook Measure.

**Template proposto:** dois CSVs privados, em português e inglês, para um gate de avaliação. Campos para identificação da mudança, caso, resultado verificável, trajetória e ferramentas, segurança, orçamento operacional, avaliadores, evidência, decisão, responsável e reteste. Inclui instruções na primeira linha e um exemplo fictício `EXAMPLE-001`.

**Dados de oportunidade:** Search Console e Ubersuggest não estão disponíveis como conectores nesta execução; nenhuma métrica de volume, CPC, dificuldade, posição ou tráfego será usada ou inferida.

**Regra de canibalização:** o novo guia será a página explicativa sobre método de avaliação; o template existente continuará sendo o material de campos amplos. O novo recurso tratará especificamente do gate de release, e a pesquisa será a evidência do pacote. O guia pilar receberá apenas um link contextual para o novo material.
