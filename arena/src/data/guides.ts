export interface OfficialGuide {
  id: string;
  category: 'agentes' | 'governanca' | 'gestao' | 'finops';
  title: string;
  badge: string;
  description: string;
  url: string;
  highlights: string[];
}

export const OFFICIAL_GUIDES: OfficialGuide[] = [
  {
    id: 'agentes-de-ia',
    category: 'agentes',
    badge: 'GUIA PRINCIPAL',
    title: 'Agentes de IA: o que são, como funcionam e quando usar',
    description: 'Entenda o que são agentes de IA, como usam ferramentas, memória e avaliações, e quando fazem sentido em produtos e operações.',
    url: 'https://www.produtocomia.com.br/guias/agentes-de-ia/',
    highlights: [
      'Diferença entre prompt simples, RAG e loops de decisão autônomos',
      'Padrão ReAct, chamadas de ferramentas (Tool Calling) e estados de memória',
      'Quando NÃO usar um agente: problemas determinísticos vs estocásticos'
    ]
  },
  {
    id: 'como-criar-agentes-de-ia',
    category: 'agentes',
    badge: 'METODOLOGIA',
    title: 'Como criar agentes de IA: do objetivo à operação',
    description: 'Crie agentes de IA com um método prático para objetivo, ferramentas, contexto, segurança, avaliações, lançamento e monitoramento.',
    url: 'https://www.produtocomia.com.br/guias/como-criar-agentes-de-ia/',
    highlights: [
      'Definição da fronteira do problema e escopo de ferramentas',
      'Engenharia de contexto e injeção de esquemas de dados limpos',
      'Critérios de monitoramento contínuo e telemetria de produção'
    ]
  },
  {
    id: 'avaliacao-agentes-de-ia',
    category: 'agentes',
    badge: 'EVALS & QUALIDADE',
    title: 'Avaliação de agentes de IA: casos, métricas e gate de lançamento',
    description: 'Aprenda a avaliar agentes de IA por resultado, trajetória, ferramentas, segurança, custo e prontidão antes de liberar uma mudança.',
    url: 'https://www.produtocomia.com.br/guias/avaliacao-agentes-de-ia/',
    highlights: [
      'Avaliação de resultado final vs avaliação da trajetória das ferramentas',
      'Golden Datasets com edge cases e LLM-as-a-Judge com rubricas cegas',
      'Definição de Launch Gates inegociáveis para deploy seguro'
    ]
  },
  {
    id: 'custo-agentes-de-ia',
    category: 'finops',
    badge: 'FINOPS DE IA',
    title: 'Custo de agentes de IA: custo por tarefa, orçamento e escala',
    description: 'Aprenda a medir custo por tarefa, criar limites de orçamento e decidir quando um agente de IA está pronto para escalar.',
    url: 'https://www.produtocomia.com.br/guias/custo-agentes-de-ia/',
    highlights: [
      'Métrica de Custo por Tarefa Concluída com Sucesso (Unit Economics)',
      'Estratégias de roteamento de modelos: Frontier vs Small Models vs Cache',
      'Ledger de consumo de tokens e circuitos de corte (Circuit Breakers)'
    ]
  },
  {
    id: 'resposta-incidentes-agentes-de-ia',
    category: 'governanca',
    badge: 'INCIDENT RESPONSE',
    title: 'Resposta a incidentes de agentes de IA: contenção, recuperação e rollback',
    description: 'Aprenda a detectar, conter, recuperar e aprender com incidentes de agentes de IA sem confundir rollback de configuração com reversão de efeitos externos.',
    url: 'https://www.produtocomia.com.br/guias/resposta-incidentes-agentes-de-ia/',
    highlights: [
      'Rollback de código vs Reversão contábil/jurídica de efeitos externos',
      'Protocolos de contenção imediata e isolamento de ferramentas com risco',
      'Post-mortem de incidentes de autonomia de IA e mitigação de regressão'
    ]
  },
  {
    id: 'governanca-de-ia',
    category: 'governanca',
    badge: 'GUIA PRINCIPAL',
    title: 'Governança de IA: guia prático para produtos e empresas',
    description: 'Implemente governança de IA com inventário, classificação de risco, avaliações, supervisão humana, monitoramento e resposta a incidentes.',
    url: 'https://www.produtocomia.com.br/guias/governanca-de-ia/',
    highlights: [
      'Inventário corporativo de modelos e dependências de terceiros',
      'Matriz de impacto, probabilidade, escala e contestabilidade',
      'Níveis de supervisão humana: Human-in-the-loop vs on-the-loop'
    ]
  },
  {
    id: 'spec-kit-sdd',
    category: 'gestao',
    badge: 'SPEC-DRIVEN DEV',
    title: 'Spec Kit na prática: tutorial de SDD para Product Managers',
    description: 'Aprenda a usar o GitHub Spec Kit em SDD para transformar uma ideia em especificação, plano, tarefas e código verificável com PM, Tech Lead e agentes de IA.',
    url: 'https://www.produtocomia.com.br/guias/spec-kit-desenvolvimento-orientado-especificacoes/',
    highlights: [
      'O novo papel do PM na era dos Coding Agents: especificador rigoroso',
      'Especificações formais com schemas executáveis em vez de cards vagos no Jira',
      'Desenvolvimento orientado a especificações e ciclos curtos de verificação'
    ]
  },
  {
    id: 'gestao-de-produtos-com-ia',
    category: 'gestao',
    badge: 'DISCOVERY AI-FIRST',
    title: 'Gestão de produtos com IA: estratégia, discovery e métricas',
    description: 'Use inteligência artificial no discovery, roadmap e operação de produto com um método que preserva contexto, evidência e responsabilidade.',
    url: 'https://www.produtocomia.com.br/guias/gestao-de-produtos-com-ia/',
    highlights: [
      'Fuga do "Agent Washing": quando o hype mascara problemas banais',
      'Discovery de problemas probabilísticos vs soluções determinísticas',
      'Métricas de adoção, confiança do usuário e fricção residual'
    ]
  }
];
