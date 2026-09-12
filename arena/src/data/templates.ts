export interface PracticalTemplate {
  id: string;
  title: string;
  category: 'prd' | 'evals' | 'finops' | 'governanca';
  description: string;
  badge: string;
  markdownContent: string;
}

export const PRACTICAL_TEMPLATES: PracticalTemplate[] = [
  {
    id: 'template-prd-agente-ia',
    title: 'Template de PRD para Agentes de IA & LLM Apps',
    category: 'prd',
    badge: 'SPEC & PRD',
    description: 'Estrutura formal de especificação de produto de IA contendo definição de autonomia, ferramentas, invariantes e tolerância de erro.',
    markdownContent: `# ESPECIFICAÇÃO DE PRODUTO (PRD) — AGENTE DE IA
**Produto:** [Nome do Agente]
**Autor:** [Nome do AI PM] | **Squad:** [Nome da Squad]
**Versão da Spec:** 1.0 (SDD) | **Data:** [Data]

---

### 1. Declaração do Problema & Job-to-be-Done
- **Dor do Usuário:** [Qual dor específica o agente resolve?]
- **Por que IA e não código determinístico?** [Ex: Lida com linguagem natural desestruturada, raciocínio em múltiplos documentos, etc.]
- **Métrica de Sucesso (Outcome):** [Ex: Resolução direta sem intervenção humana > 80%]

---

### 2. Fronteira de Autonomia & Nível de Alçada
| Nível | Tipo de Ação | Exemplo | Governança / Supervisão |
|---|---|---|---|
| **Tier 1** | Leitura e Consulta | Buscar extrato, verificar saldo | 100% Autônomo |
| **Tier 2** | Ação reversível de baixo impacto | Reagendar envio, aplicar cupom < R$ 20 | Autônomo com notificação |
| **Tier 3** | Ação irreversível ou alto impacto | Cancelar conta, emitir reembolso > R$ 100 | Human-in-the-Loop (Aprovação de 1 clique) |

---

### 3. Contrato de Ferramentas (Tool Calling Schema)
\`\`\`json
{
  "tools": [
    {
      "name": "consultar_extrato",
      "description": "Consulta movimentações financeiras dos últimos 30 dias",
      "parameters": {
        "type": "object",
        "properties": {
          "user_id": { "type": "string" },
          "dias": { "type": "integer", "maximum": 90 }
        },
        "required": ["user_id"]
      }
    }
  ]
}
\`\`\`

---

### 4. Orçamento de FinOps & Latência (SLOs)
- **Custo Teto por Tarefa Concluída:** $0.05 USD
- **Latência p95 Alvo:** < 3.5 segundos
- **Estratégia de Modelos:** Roteador leve (Small Model) para 70% das intenções + Frontier apenas sob gatilho de complexidade.
- **Limite de Passos do Agente (Max Iterations):** 3 iterações de ferramentas.

---

### 5. Critérios Inegociáveis de Release Gate (Evals)
- [ ] Taxa de precisão factual > 98% no Golden Dataset (500 casos)
- [ ] 0 violações de segurança (Prompt Injection / Jailbreak)
- [ ] Mecanismo de Kill-Switch de ferramentas testado e operacional
`
  },
  {
    id: 'template-evals-release-gate',
    title: 'Template de Matriz de Evals e Gate de Lançamento',
    category: 'evals',
    badge: 'QUALIDADE & TESTES',
    description: 'Quadro completo para definir métricas de corte, Golden Dataset estratificado e critérios de Go / No-Go para IA em produção.',
    markdownContent: `# MATRIZ DE EVALS & GATE DE LANÇAMENTO (RELEASE GATE)
**Sistema Sob Teste:** [Nome do Modelo / Agente]
**Data da Avaliação:** [Data] | **Avaliador:** [AI PM & Tech Lead]

---

### 1. Estratificação do Golden Dataset
- **Total de Casos:** 500 prompts curados com ground truth comprovado.
- **60% Casos Representativos:** Dúvidas e fluxos comuns de produção real.
- **25% Edge Cases:** Entradas truncadas, documentos com formatação anômala, dados ambíguos.
- **15% Ataques Adversariais:** Tentativas deliberadas de prompt injection, jailbreak e vazamento de dados.

---

### 2. Tabela de Métricas e Hard Gates (Critérios de Corte)
| Dimensão | Métrica | Alvo Mínimo | Status | Tipo de Gate |
|---|---|---|---|---|
| **Precisão Factual** | Validação exata de dados contra DB | 100% | Em Avaliação | **HARD GATE (Sem concessão)** |
| **Comportamento Seguro** | Bloqueio de injeção de prompt | 99.5% | Em Avaliação | **HARD GATE (Sem concessão)** |
| **Cobertura da Tarefa** | Resolução correta da intenção | > 85% | Em Avaliação | Soft Gate |
| **Latência p95** | Tempo de resposta fim-a-fim | < 3000ms | Em Avaliação | Soft Gate |
| **Custo Médio/Task** | Consumo de tokens por resolução | < $0.06 | Em Avaliação | Soft Gate |

---

### 3. Regra de Decisão Go / No-Go
> **REGRA DE OURO:** Nenhuma melhora em métricas agregadas (soft gates) pode compensar a violação de um Hard Gate de segurança ou precisão crítica. Em caso de regressão em Hard Gate, a release é cancelada imediatamente.
`
  },
  {
    id: 'template-ledger-finops',
    title: 'Template de Ledger de FinOps e Custo por Tarefa',
    category: 'finops',
    badge: 'UNIT ECONOMICS',
    description: 'Planilha/Modelo para registrar tokens de entrada, saída, chamadas de ferramentas e custo unitário por usuário ativo.',
    markdownContent: `# LEDGER DE FINOPS DE IA & UNIT ECONOMICS
**Produto:** [Nome do Produto com IA]
**Período:** Mensal / Semanal

---

### 1. Fórmulas Fundamentais de Unit Economics
- **Custo por Inferência:** \`(Tokens Entrada * Preço Entrada) + (Tokens Saída * Preço Saída)\`
- **Custo por Tarefa Concluída:** \`Custo Total de Inferência / Número de Tarefas com Resolução Confirmada\`
- **Margem de Contribuição com IA:** \`Receita da Feature - (Custo de IA + Custo de Infraestrutura)\`

---

### 2. Matriz de Roteamento de Modelos por Tier Econômico
| Tier | Tipo de Modelo | Custo / 1M Tokens | Quando Usar |
|---|---|---|---|
| **Tier 0 (Zero Cost)** | Cache Semântico | $0.00 | Perguntas frequentes com similaridade > 0.92 |
| **Tier 1 (Small Model)** | 3B a 8B (ex: Gemini Flash / Haiku) | ~$0.10 - $0.25 | Triagem, classificação, extração de JSON e suporte trivial |
| **Tier 2 (Frontier)** | 70B+ (ex: Claude Sonnet / GPT-4o) | ~$3.00 - $15.00 | Disputas jurídicas, análise de balanço, raciocínio multi-passo |

---

### 3. Circuit Breakers (Disjuntores Orçamentários)
- **Limite por Sessão:** Máximo de $0.25 por usuário em uma única conversa.
- **Limite Horário Global:** $500/hora. Se atingido, ativação automática de fallback para modo econômico.
`
  },
  {
    id: 'template-incident-response',
    title: 'Checklist de Incident Response para Agentes de IA',
    category: 'governanca',
    badge: 'INCIDENT RESPONSE',
    description: 'Protocolo de ação em 4 passos para conter falhas de agentes autônomos com efeito externo no mundo real.',
    markdownContent: `# PROTOCOLO DE RESPOSTA A INCIDENTES — AGENTES DE IA (AI IR)
**Classificação:** Severidade 1 (Crítico) / Severidade 2 (Alto)

---

### PASSO 1: Contenção Imediata (Meta: < 3 minutos)
- [ ] **Desligar ferramentas de escrita:** Acionar o kill-switch específico da ferramenta com anomalia nas variáveis de ambiente.
- [ ] **Isolar o agente:** O agente deve continuar operando em modo somente leitura (read-only) ou direcionar para fila humana.
- [ ] **Congelar o estado:** Preservar todos os traces de execução, logs de tool calling e payloads de requisição para auditoria forense.

---

### PASSO 2: Distinção Vital (Rollback vs Efeitos Externos)
- [ ] **Rollback de Software:** Reverter versão de prompt, modelo ou orquestrador.
- [ ] **Reversão de Efeitos Externos:**
  - Identificar exatamente quais chamadas de API externas foram executadas no mundo real (ex: estornos bancários, e-mails disparados, registros alterados no CRM).
  - Acionar time de operações e financeiro para protocolo de reconciliação reversa.

---

### PASSO 3: Comunicação & Transparência
- [ ] Enviar notificação aos clientes ou parceiros afetados com clareza e empatia.
- [ ] Evitar culpar "a inteligência artificial" — a responsabilidade corporativa é do produto e da empresa.

---

### PASSO 4: Post-Mortem & Proteção contra Regressão
- [ ] Adicionar o caso que gerou o incidente ao Golden Dataset de Evals.
- [ ] Implementar chave de idempotência obrigatória na ferramenta afetada.
- [ ] Reavaliar a matriz de autonomia e alçadas humanas.
`
  }
];
