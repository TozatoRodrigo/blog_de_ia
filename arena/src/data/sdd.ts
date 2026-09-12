export interface SDDPhase {
  phaseNumber: number;
  id: string;
  name: string;
  shortDescription: string;
  primaryOwner: 'PM' | 'Tech Lead' | 'Ambos' | 'Coding Agent';
  objective: string;
  whatItIs: string;
  whatItIsNot: string;
  approvalQuestion: string;
  promptTemplate: string;
  expectedArtifact: string;
  keyCheckpoints: string[];
}

export interface SDDRole {
  role: string;
  title: string;
  ownership: string;
  does: string[];
  doesNot: string[];
}

export const SDD_ROLES: SDDRole[] = [
  {
    role: 'pm',
    title: 'Product Manager (PM)',
    ownership: 'Dono do "WHAT" e "WHY"',
    does: [
      'Define o problema real, jobs-to-be-done e métricas de resultado',
      'Escreve critérios de aceitação e comportamentos observáveis',
      'Delimita o escopo e define explicitamente o que está FORA de escopo',
      'Resolve ambiguidades de negócio levantadas na fase de Clarify',
      'Valida a conformidade da entrega com os critérios de sucesso na fase de Converge'
    ],
    doesNot: [
      'Não escolhe banco de dados, frameworks ou endpoints técnicos na Spec',
      'Não aceita suposições não comprovadas feitas pelo agente de código',
      'Não permite que reuniões verbais substituam documentação formal versionada'
    ]
  },
  {
    role: 'tech_lead',
    title: 'Tech Lead / Engenharia',
    ownership: 'Dono do "HOW"',
    does: [
      'Inspeciona o repositório existente para reaproveitar componentes e contratos',
      'Define a arquitetura técnica, esquemas de banco, segurança e observabilidade',
      'Valida os riscos técnicos e dependências no Plan',
      'Ordena a decomposição em Tasks atômicas com rastreabilidade direta',
      'Supervisiona a execução dos Coding Agents e audita Pull Requests'
    ],
    doesNot: [
      'Não altera requisitos de negócio ou escopo sem alinhamento com o PM',
      'Não delega decisões de arquitetura crítica para alucinação de LLMs',
      'Não permite deploy sem cobertura de testes e checagem de invariantes'
    ]
  },
  {
    role: 'agent',
    title: 'Coding Agent (Antigravity / Claude Code / Cursor)',
    ownership: 'Acelerador de Leitura, Síntese e Execução',
    does: [
      'Gera rascunhos de especificações, planos e checklists a partir de diretrizes',
      'Aponta lacunas, ambiguidades e perguntas não respondidas no Clarify',
      'Implementa tarefas atômicas seguindo estritamente a checklist de aceitação',
      'Executa suítes de testes automatizados e gera evidências de cobertura'
    ],
    doesNot: [
      'Não é um terceiro aprovador — a decisão final é SEMPRE humana',
      'Não deve preencher lacunas de produto com suposições próprias',
      'Não cria funcionalidades que não estavam explicitamente no escopo'
    ]
  }
];

export const SDD_PHASES: SDDPhase[] = [
  {
    phaseNumber: 1,
    id: 'constitution',
    name: 'Constitution: Princípios e Limites Duráveis',
    shortDescription: 'Regras de produto e arquitetura que valem para múltiplas features.',
    primaryOwner: 'Ambos',
    objective: 'Registrar princípios permanentes: privacidade, segurança, observabilidade, FinOps de IA e critérios de qualidade da squad.',
    whatItIs: 'Um arquivo durável (`constitution.md`) que serve como bússola para o repositório.',
    whatItIsNot: 'Não é o local para descrever detalhes da funcionalidade específica que será construída.',
    approvalQuestion: '“Esses princípios representam como queremos construir e operar o produto, ou algum deles é apenas uma preferência local desta sprint?”',
    promptTemplate: `Ajude a criar ou revisar a constitution deste produto. Use apenas o contexto disponível no repositório e marque como hipótese qualquer ponto não comprovado. Sugira princípios duráveis para produto, acessibilidade, privacidade, segurança, observabilidade, qualidade e revisão. Não escolha a implementação da feature ainda. Separe fatos conhecidos, hipóteses, decisões que precisam de aprovação e evidências ausentes. Termine com as perguntas que PM e Tech Lead precisam responder.`,
    expectedArtifact: '`constitution.md` na raiz do repositório.',
    keyCheckpoints: [
      'Princípios de privacidade de dados e conformidade regulatória',
      'Tolerância máxima de latência e políticas de graceful degradation',
      'Padrões de observabilidade (logging de tokens, traces de tool calling)'
    ]
  },
  {
    phaseNumber: 2,
    id: 'specify',
    name: 'Specify: O Que e Por Que (Dono: PM)',
    shortDescription: 'Capturar problema, resultado, comportamento e critérios de aceitação.',
    primaryOwner: 'PM',
    objective: 'Definir rigorosamente a intenção de produto e o comportamento observável sem prescrever a stack técnica.',
    whatItIs: 'O contrato de negócio do PM: problema, usuário, histórias, critérios de aceitação e limites inegociáveis de fora de escopo.',
    whatItIsNot: 'Não é o lugar de escolher PostgreSQL, FastAPI, React ou rotas de API.',
    approvalQuestion: '“Se outra pessoa implementar apenas este documento, ela saberá qual comportamento entregar sem ter que adivinhar nenhuma decisão de produto?”',
    promptTemplate: `Crie uma especificação para [NOME DA FEATURE] no produto [NOME DO PRODUTO]. Descreva o usuário, o problema real, o resultado esperado, histórias de usuário com critérios de aceitação observáveis, itens estritamente FORA DE ESCOPO, estados vazios e casos de erro. Não escolha framework, banco, endpoints ou arquitetura técnica. Separe fatos fornecidos, hipóteses a validar e decisões que precisam de aprovação.`,
    expectedArtifact: '`spec.md` (ou pasta de especificação no repositório).',
    keyCheckpoints: [
      'Declaração explícita do Job-to-be-Done do usuário',
      'Critérios de aceitação com comportamento observável de sucesso e falha',
      'Lista rigorosa de tudo o que NÃO será feito nesta versão (Non-Goals)'
    ]
  },
  {
    phaseNumber: 3,
    id: 'clarify',
    name: 'Clarify: Eliminar Ambiguidades Críticas',
    shortDescription: 'Fazer perguntas direcionadas antes de escrever uma linha de código.',
    primaryOwner: 'Ambos',
    objective: 'Identificar lacunas que poderiam fazer duas pessoas implementarem comportamentos incompatíveis.',
    whatItIs: 'Uma rodada disciplinada de perguntas entre PM, Tech Lead e Agente para fechar brechas.',
    whatItIsNot: 'Não é uma entrevista infinita: foca apenas no que altera escopo, dados, risco ou UX.',
    approvalQuestion: '“Restou alguma ambiguidade capaz de fazer a engenharia criar uma regra que o PM reprovaria no teste?”',
    promptTemplate: `Leia a especificação e faça SOMENTE perguntas de clarificação que possam alterar comportamento, escopo, risco, dados ou critérios de aceitação. Organize cada pergunta por impacto e proponha opções sem escolher por nós. Inclua casos como usuário deslogado, falha de persistência, timeout de IA, concorrência e acessibilidade. Para cada resposta fornecida, atualize a especificação.`,
    expectedArtifact: 'Seção "Decisões Clarificadas" adicionada à `spec.md`.',
    keyCheckpoints: [
      'Tratamento de estados transitórios e lentidão de rede',
      'Comportamento quando a IA alucina ou retorna payload incompleto',
      'Regras de concorrência e idempotência'
    ]
  },
  {
    phaseNumber: 4,
    id: 'plan',
    name: 'Plan: Como Construir (Dono: Tech Lead)',
    shortDescription: 'Arquitetura técnica, modelo de dados, interfaces e estratégia de testes.',
    primaryOwner: 'Tech Lead',
    objective: 'Transformar a especificação aprovada em uma abordagem de engenharia viável dentro do sistema existente.',
    whatItIs: 'O plano do Tech Lead: componentes reutilizados, schemas de banco, endpoints, segurança e observabilidade.',
    whatItIsNot: 'Não implementa nada ainda; apenas mapeia os impactos e trade-offs.',
    approvalQuestion: '“Este plano é viável no sistema atual, preserva o comportamento aprovado pelo PM e explicita todos os riscos técnicos?”',
    promptTemplate: `Com base somente na especificação e nas decisões aprovadas, proponha um plano técnico. Inspecione o repositório antes de sugerir mudanças. Descreva componentes a reutilizar, modelo de dados, interfaces de API, tratamento de erros, observabilidade e estratégia de testes. Compare alternativas quando houver trade-off. Separe fatos do código, hipóteses técnicas e itens que exigem aprovação. Não implemente nada ainda.`,
    expectedArtifact: '`plan.md` versionado junto à especificação.',
    keyCheckpoints: [
      'Schemas JSON formais para contratos de API e tool calling',
      'Estratégia de observabilidade e registro de telemetria',
      'Matriz de riscos técnicos e dependências externas'
    ]
  },
  {
    phaseNumber: 5,
    id: 'checklist',
    name: 'Checklist: Rastreabilidade dos Requisitos',
    shortDescription: 'Garantir que 100% dos requisitos tenham uma forma de verificação.',
    primaryOwner: 'Ambos',
    objective: 'Mapear cada critério de aceitação aprovado a uma tarefa e a uma evidência verificável.',
    whatItIs: 'A ponte de auditoria entre o que o PM pediu e o que a engenharia vai testar.',
    whatItIsNot: 'Não é um teste de execução ainda; é a prova de cobertura teórica dos requisitos.',
    approvalQuestion: '“Cada critério importante tem uma forma clara de verificação, e a checklist não introduziu nenhum requisito não aprovado pelo PM?”',
    promptTemplate: `Converta a especificação em uma checklist de revisão de qualidade, completude e rastreabilidade. Cubra o caminho feliz, estados vazios, erros, acessibilidade, observabilidade e fora de escopo. Para cada item, aponte a seção da spec que o sustenta e a forma de validação esperada (teste automatizado ou revisão humana).`,
    expectedArtifact: 'Checklist de verificação estruturada dentro do Spec Kit.',
    keyCheckpoints: [
      'Rastreabilidade bidirecional (Requisito ↔ Teste ↔ Tarefa)',
      'Distinção clara entre validação automatizada e validação humana de negócio',
      'Zero requisitos "invisíveis" inventados sem aprovação'
    ]
  },
  {
    phaseNumber: 6,
    id: 'tasks',
    name: 'Tasks: Decomposição Atômica e Ordenação',
    shortDescription: 'Quebrar o plano em unidades pequenas ordenadas por dependência.',
    primaryOwner: 'Tech Lead',
    objective: 'Criar uma lista de tarefas pequenas e rastreáveis para serem executadas por engenheiros ou coding agents.',
    whatItIs: 'O backlog executável da feature (`tasks.md`) onde cada tarefa aponta os arquivos que serão alterados.',
    whatItIsNot: 'Não deve reabrir decisões de produto já aprovadas sem sinalizar o desvio.',
    approvalQuestion: '“Um desenvolvedor ou coding agent consegue implementar cada tarefa sem descobrir decisões de produto escondidas no meio do caminho?”',
    promptTemplate: `Quebre o plano aprovado em tarefas pequenas e ordenadas por dependência. Para cada tarefa, informe objetivo, pré-requisitos, arquivos prováveis a alterar, requisito coberto e evidência esperada. Não crie tarefas para itens fora de escopo. Se encontrar uma decisão nova, pare e sinalize para PM e Tech Lead em vez de assumi-la.`,
    expectedArtifact: '`tasks.md` pronto para alimentação dos Coding Agents.',
    keyCheckpoints: [
      'Tarefas pequenas com limite de escopo cirúrgico',
      'Ordem estrita de precedência (pre-requisites)',
      'Identificação dos arquivos de teste e arquivos de produção'
    ]
  },
  {
    phaseNumber: 7,
    id: 'analyze',
    name: 'Analyze: Auditoria de Consistência Prévia',
    shortDescription: 'Verificar se spec, plan e tasks continuam em perfeito alinhamento.',
    primaryOwner: 'Coding Agent',
    objective: 'Rodar uma verificação estática para garantir que o plano não esqueceu nenhum requisito e que as tasks cobrem 100% do plano.',
    whatItIs: 'O "lint" conceitual da especificação antes do início da codificação.',
    whatItIsNot: 'Não gera código de produção; apenas valida a integridade dos artefatos.',
    approvalQuestion: '“Há alguma contradição ou requisito órfão entre a spec, o plano e a lista de tarefas?”',
    promptTemplate: `Analise a consistência cruzada entre spec.md, plan.md e tasks.md. Identifique: 1) Requisitos da spec que não possuem tarefas correspondentes; 2) Tarefas que implementam escopo não solicitado na spec; 3) Conflitos técnicos entre o plano e as diretrizes da constitution. Emita um relatório objetivo com Go ou No-Go.`,
    expectedArtifact: 'Relatório de consistência e alinhamento do Spec Kit.',
    keyCheckpoints: [
      'Zero requisitos órfãos',
      'Zero escopo fantasma (gold plating)',
      'Aprovação formal conjunta de PM e Tech Lead para o início da implementação'
    ]
  },
  {
    phaseNumber: 8,
    id: 'implement',
    name: 'Implement: Execução Orientada por Tarefas',
    shortDescription: 'Coding agents e desenvolvedores implementam tarefa por tarefa.',
    primaryOwner: 'Coding Agent',
    objective: 'Implementar o código estritamente contra as tasks ordenadas, gerando testes e código verificável.',
    whatItIs: 'O ciclo ágil onde o Antigravity, Claude Code ou Cursor recebe uma task de cada vez com seu contexto limpo.',
    whatItIsNot: 'Não é um prompt único de "construa a feature inteira de uma vez no vácuo".',
    approvalQuestion: '“O código gerado atende à evidência exigida na tarefa e passa nos testes automatizados sem alterar regras da constitution?”',
    promptTemplate: `Implemente exclusivamente a tarefa [TASK-ID] descrita em tasks.md. Consulte spec.md e plan.md para contexto de regras e contratos. Ao concluir, execute os testes relacionados e apresente a evidência de sucesso. Não avance para a próxima tarefa antes de validar a atual.`,
    expectedArtifact: 'Código-fonte e suíte de testes correspondente no repositório.',
    keyCheckpoints: [
      'Execução atômica e incremental',
      'Testes unitários e de integração gerados em conjunto',
      'Respeito às regras de governança do repositório'
    ]
  },
  {
    phaseNumber: 9,
    id: 'converge',
    name: 'Converge: Verificação Final e Fechamento',
    shortDescription: 'Auditoria de evidências e aprovação final de lançamento.',
    primaryOwner: 'Ambos',
    objective: 'Confrontar o código entregue contra a checklist inicial de aceitação, garantindo que o produto atende ao objetivo inicial do PM.',
    whatItIs: 'O ritual final de fechamento onde PM valida o comportamento observável e Tech Lead valida a estabilidade operacional.',
    whatItIsNot: 'Não é apenas "o build passou no CI"; é a verificação de que o problema de negócio foi resolvido com segurança.',
    approvalQuestion: '“Todas as evidências da checklist foram produzidas e o comportamento em produção resolve a dor do usuário delimitada na fase 1?”',
    promptTemplate: `Execute a verificação final de convergência contra checklist.md. Produza a matriz de rastreabilidade final indicando para cada requisito: status (Aprovado / Rejeitado), arquivo de teste que comprova e evidência observada. Liste eventuais débitos técnicos ou decisões postergadas para a próxima sprint.`,
    expectedArtifact: 'Relatório final de convergência e fechamento do Spec Kit.',
    keyCheckpoints: [
      '100% da checklist verificada com evidências',
      'Revisão humana do PM no ambiente de homologação',
      'Merge da branch e atualização da documentação viva no repositório'
    ]
  }
];

export const SDD_SAMPLE_SPEC = {
  title: 'Exemplo Real de Spec Kit: Agente de Reconciliação de Disputas',
  specMd: `# SPEC: Agente de Reconciliação de Disputas de Pagamento
**Versão:** 1.0 (SDD) | **Autor:** PM de Pagamentos | **Status:** Aprovado

## 1. Problema & Job-to-be-Done
Quando um lojista sofre uma contestação de compra (chargeback), ele gasta em média 45 minutos reunindo comprovantes fiscais e de logística. 62% das disputas são perdidas por atraso no envio das evidências para a bandeira do cartão.
**Resultado Esperado:** Agente autônomo que reúne automaticamente os comprovantes internos e monta o dossiê de defesa em menos de 3 minutos com taxa de ganho > 45%.

## 2. Comportamento Observável & Histórias de Usuário
- **US.01 (Caminho Feliz):** Ao receber notificação de chargeback via webhook, o agente deve consultar a API de notas fiscais e o tracking dos correios, compor a contestação padronizada e registrar no ledger.
- **US.02 (Dados Incompletos):** Se o comprovante de entrega não for localizado, o agente NÃO deve enviar defesa incompleta; deve criar uma tarefa na fila do operador humano com alerta de SLA de 24h.
- **US.03 (Teto Orçamentário):** O custo de inferência por disputa montada não pode exceder $0.08 USD.

## 3. Fora de Escopo (Non-Goals)
- O agente NÃO contestará transações fraudulentas confirmadas por biometria.
- O agente NÃO fará contato direto por WhatsApp com o comprador nesta versão v1.

## 4. Critérios de Aceitação (Checklist de Negócio)
- [ ] Dossiê gerado no formato PDF exigido pelas bandeiras Visa/Mastercard.
- [ ] Latência máxima de montagem do dossiê: < 60 segundos.
- [ ] Alçadas: Disputas > R$ 5.000 exigem aprovação de 1 clique do supervisor de risco.`,
  planMd: `# PLAN: Arquitetura Técnica do Agente de Disputas
**Autor:** Tech Lead | **Baseada em:** spec.md v1.0

## 1. Arquitetura & Componentes
- **Orquestrador:** Python com LangGraph / Antigravity Agent Runtime.
- **Modelo:** Gemini 1.5 Flash para extração e sumarização de comprovantes; Claude 3.5 Sonnet reservado apenas para disputas jurídicas Tier 3 (> R$ 5.000).
- **Cache Semântico:** Redis com embeddings locais para evitar consultas repetidas à mesma nota fiscal.

## 2. Contrato de Ferramentas (Tool Calling Schema)
\`\`\`json
{
  "tools": [
    {
      "name": "obter_comprovante_entrega",
      "parameters": { "tracking_code": "string" },
      "required": ["tracking_code"]
    },
    {
      "name": "gerar_pdf_defesa",
      "parameters": { "transacao_id": "string", "evidencias": "array" }
    }
  ]
}
\`\`\`

## 3. Invariantes de Sistema (Hard Gates)
1. **Idempotência estrita:** O webhook de chargeback nunca pode processar o mesmo ID de disputa duas vezes.
2. **Circuit Breaker:** Se o provedor de LLM falhar ou demorar > 10s, fallback imediato para fila humana.`,
  tasksMd: `# TASKS: Decomposição Ordenada por Dependência

- [ ] **TASK-01:** Implementar validação de idempotência e schema do webhook no endpoint \`/webhooks/chargeback\`. *(Requisito US.01 | Arquivos: \`src/api/webhooks.py\`)*
- [ ] **TASK-02:** Criar conector de API para o serviço de notas fiscais com tratamento de timeout gracioso. *(Requisito US.01 | Arquivos: \`src/integrations/fiscal.py\`)*
- [ ] **TASK-03:** Implementar prompt estruturado com saída em schema Pydantic para sintetizar as evidências. *(Requisito US.01, US.03 | Arquivos: \`src/agents/dispute_agent.py\`)*
- [ ] **TASK-04:** Configurar fallback para fila humana quando faltar comprovante ou quando valor for > R$ 5.000. *(Requisito US.02 | Arquivos: \`src/services/human_queue.py\`)*
- [ ] **TASK-05:** Criar suíte de Evals contra Golden Dataset de 50 disputas históricas. *(Requisito US.01, US.03 | Arquivos: \`tests/evals/test_disputes.py\`)*`
};
