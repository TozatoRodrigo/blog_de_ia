# Pacote semanal de autoridade — 2026-08-17

## Decisão editorial

Publicar um pacote bilíngue sobre resposta a incidentes e recuperação de agentes de IA em produção. O tema aprofunda uma lacuna explícita identificada no pacote de 2026-08-10: incidente, mudança e rollback apareceram em apenas 2 de 7 documentos auditados naquela pesquisa. O novo conteúdo não substitui o guia pilar de operação; ele trata da pergunta mais estreita “o que fazer quando o agente falha ou precisa ser contido?”.

## Oportunidade registrada antes da redação

- **Tema central:** resposta a incidentes e recuperação de agentes de IA.
- **Palavra-chave principal:** resposta a incidentes de agentes de IA.
- **Secundárias:** runbook de agente de IA; rollback de agente de IA; incident response for AI agents; AI agent recovery; contenção de agente de IA.
- **Intenção:** informacional e operacional; o leitor quer estruturar detecção, triagem, contenção, recuperação e pós-incidente antes ou durante uma falha.
- **Público:** Product Managers, engenharia, SRE/DevOps, segurança, governança e donos de operações que já têm ou planejam agentes com ferramentas e efeitos externos.
- **Página pilar:** `/guias/operacao-de-agentes-de-ia/` e `/en/guides/ai-agent-operations/`.
- **Concorrentes observados:** AgentCenter, Brightlume AI, AgentModeAI, OpenClaw e AegisPlane publicam playbooks genéricos de incidente/rollback; resultados de busca atuais mostram oportunidade para uma peça com método explícito, fontes primárias e distinção entre rollback de comportamento e compensação de efeitos externos.
- **Lacuna competitiva:** separar o que pode ser revertido (versão, tráfego, ferramenta, configuração) do que exige compensação/reconciliação (efeito externo já executado), com critérios de severidade e evidência reproduzível.
- **Pergunta de pesquisa:** quais mecanismos de recuperação aparecem explicitamente em oito documentos oficiais de orientação técnica para agentes de IA?
- **Método planejado:** auditoria manual reproduzível de oito páginas oficiais coletadas em 2026-08-17. Cada documento será codificado com cinco controles binários: detecção/telemetria, contenção ou desligamento seguro, recuperação de estado/efeitos, fallback/degradação e validação/aprovação/rollback. “Sim” exige menção explícita do mecanismo ou equivalente operacional; ausência não será tratada como prova de inexistência.
- **Fontes candidatas:** AWS Agentic AI Lens (versionamento/rollback, checkpoints, fallback, incident response), OpenAI Agents SDK (human-in-the-loop), Microsoft Foundry (tracing) e Google Agent Runtime (monitoramento e alertas).
- **Template proposto:** dois CSVs privados, PT e EN, para registrar incidente, evidência, contenção, recuperação, compensação, aprovação e ação preventiva, com exemplo fictício e critérios derivados da pesquisa.
- **Dados de oportunidade:** Search Console e Ubersuggest não estão acessíveis nesta execução; não serão inventados volume, CPC, dificuldade, posição ou tráfego.

## Fontes da pesquisa

1. https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops02-bp03.html
2. https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentops06-bp03.html
3. https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel03-bp03.html
4. https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel04-bp03.html
5. https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-security/best-practices-incident-response.html
6. https://openai.github.io/openai-agents-python/human_in_the_loop/
7. https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept
8. https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/monitoring

## Resultado esperado do pacote

- Guia PT: `/guias/resposta-incidentes-agentes-de-ia/`.
- Guia EN: `/en/guides/ai-agent-incident-response/`.
- Pesquisa PT: `/guias/pesquisa-resposta-incidentes-agentes-de-ia/`.
- Pesquisa EN: `/en/guides/research-ai-agent-incident-response/`.
- Template PT protegido: `/downloads/runbook-incidentes-agente-de-ia.csv`.
- Template EN protegido: `/downloads/ai-agent-incident-runbook.csv`.
