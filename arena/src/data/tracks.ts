import type { CareerTrack } from '../types';

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'pm_tradicional',
    title: 'De PM Tradicional para AI-First PM',
    badge: 'TRANSIÇÃO MAIS PROCURADA',
    tagline: 'Do pensamento determinístico (se X então Y) para o pensamento probabilístico, métricas de inferência e governança de agentes.',
    fromRole: 'Product Manager / Product Owner Tradicional (Scrum, Jira, Features SaaS)',
    keyMindsetShift: 'No software tradicional, se o teste passou, o código funciona para sempre. Em IA generativa, a resposta é uma distribuição probabilística: ela pode variar por temperatura, drift do modelo ou ambiguidade do input. Você deixa de gerenciar sprints de botões para gerenciar dados de avaliação (Evals), custo por inferência (FinOps) e limites de autonomia de ferramentas.',
    blindSpots: [
      'Achar que prompt engineering básico substitui arquitetura de produto com IA',
      'Confiar em testes manuais de "olhômetro" (3 exemplos que deram certo) em vez de Golden Datasets quantitativos',
      'Ignorar o custo marginal por usuário: em SaaS tradicional o custo de mais uma requisição é quase zero; em IA, cada chamada de LLM consome dólares em inferência',
      'Cometer Agent Washing forçando chats em interfaces onde botões e formulários são 10x melhores'
    ],
    recommendedCases: ['case-discovery-sdd-spec-kit', 'case-evals-gate-lancamento', 'case-finops-latencia'],
    actionPlan: [
      {
        step: '01. Desaprender o Determinismo',
        action: 'Estudar distribuições estatísticas, temperatura de amostragem, janelas de contexto e por que LLMs nunca devem ser tratados como bancos de dados relacionais.',
        outcome: 'Capacidade de desenhar produtos que toleram incerteza de forma elegante (graceful degradation).'
      },
      {
        step: '02. Dominar Evals e Golden Datasets',
        action: 'Montar suítes de avaliação automatizada com LLM-as-a-judge e validações determinísticas de schema.',
        outcome: 'Criar Gates de Lançamento quantitativos antes de qualquer deploy em produção.'
      },
      {
        step: '03. Liderar com Spec-Driven Development (SDD)',
        action: 'Substituir histórias de usuário vagas por especificações formais com schemas JSON para guiar Coding Agents.',
        outcome: 'Aumentar a velocidade da squad em 3x com zero alucinação arquitetural.'
      }
    ]
  },
  {
    id: 'engenharia',
    title: 'De Engenharia / Tech Lead para AI PM',
    badge: 'ALTA EFICIÊNCIA TÉCNICA',
    tagline: 'Da obsessão pelo modelo mais recente para a viabilidade econômica, resolução do Job-to-be-Done e valor para o cliente.',
    fromRole: 'Tech Lead / Engenheiro de Software / Desenvolvedor Fullstack',
    keyMindsetShift: 'A tentação do engenheiro que migra para PM de IA é escolher o modelo mais recente de bilhões de parâmetros pelo fascínio técnico. O AI PM descobre a dor real do cliente, valida se IA é necessária e desenha a viabilidade de negócio com unit economics sustentáveis.',
    blindSpots: [
      'Gastar semanas fazendo fine-tuning caro de modelos quando um bom RAG ou prompt estruturado resolveria',
      'Subestimar a experiência do usuário (UX): latência percebida, feedback states e tratamento de erro conversacional',
      'Esquecer a governança jurídica e risco regulatório de dados de clientes trafegando em APIs externas'
    ],
    recommendedCases: ['case-agent-washing-oportunidades', 'case-finops-latencia', 'case-governanca-incident-response'],
    actionPlan: [
      {
        step: '01. Discovery & Jobs-to-be-Done',
        action: 'Aprender técnicas de entrevista com clientes e identificação de dores reais onde a IA gera alavancagem assimétrica.',
        outcome: 'Dizer não para 80% das ideias de "IA cosmética" e focar em problemas com alto ROI.'
      },
      {
        step: '02. FinOps e Unit Economics de IA',
        action: 'Calcular custo por tarefa resolvida e projetar margem de contribuição em escala de milhões de chamadas.',
        outcome: 'Apresentar roadmaps com comprovação financeira incontestável para a diretoria.'
      },
      {
        step: '03. Governança e Matrizes de Risco',
        action: 'Desenhar matrizes de risco, esteiras de aprovação humana e protocolos de contenção de incidentes.',
        outcome: 'Garantir que produtos de IA ganhem escala sem expor a empresa a riscos catastróficos.'
      }
    ]
  },
  {
    id: 'dados',
    title: 'De Dados / Analytics / ML para AI PM',
    badge: 'FORTE RIGOR QUANTITATIVO',
    tagline: 'Do modelo isolado no Jupyter Notebook para o produto interativo em produção na mão de clientes.',
    fromRole: 'Data Scientist / ML Engineer / Analista de BI',
    keyMindsetShift: 'Cientistas de dados são treinados para otimizar métricas técnicas isoladas (F1-score, ROC-AUC, Perplexity). Como AI PM, seu foco é o impacto no negócio: adoção, retenção, satisfação do usuário e velocidade de iteração no ciclo de vida do produto.',
    blindSpots: [
      'Achar que uma melhoria de 2% de acurácia justifica atrasar o lançamento em 4 meses',
      'Dificuldade de simplificar conceitos complexos para stakeholders comerciais e executivos',
      'Desconhecimento de design de interação de produto (UI/UX) e fluxo conversacional intuitivo'
    ],
    recommendedCases: ['case-evals-gate-lancamento', 'case-discovery-sdd-spec-kit', 'case-agent-washing-oportunidades'],
    actionPlan: [
      {
        step: '01. Da Métrica de ML para o Resultado de Negócio',
        action: 'Conectar métricas estatísticas a indicadores de negócio (LTV, CAC, NPS e churn reduction).',
        outcome: 'Construir business cases sólidos para investimentos em infraestrutura de IA.'
      },
      {
        step: '02. AI UX & Human-AI Interaction',
        action: 'Estudar os princípios de design para inteligência artificial: streaming tokens, estados de incerteza e contestabilidade.',
        outcome: 'Desenhar experiências que transmitem confiança e reduzem a ansiedade do usuário.'
      },
      {
        step: '03. Orquestração de Agentes e Ferramentas',
        action: 'Mapear a transição de modelos preditivos estáticos para agentes dinâmicos com chamadas de API e raciocínio multi-passo.',
        outcome: 'Liderar a squad na construção de agentes seguros e auditáveis.'
      }
    ]
  },
  {
    id: 'operacoes_negocios',
    title: 'De Operações / Negócios para AI-First PM',
    badge: 'VISÃO DE DOMÍNIO E PROCESSO',
    tagline: 'Do conhecimento profundo das dores da operação para a automação cognitiva de processos complexos.',
    fromRole: 'Analista de Operações / Especialista de Negócios / Consultor de Processos',
    keyMindsetShift: 'Quem vem de Operações tem a maior vantagem de todas: conhece onde a empresa perde dinheiro e onde os clientes sentem dor real. O desafio ao virar AI PM é adquirir a fluência técnica para desenhar arquiteturas de agentes, entender limites computacionais e dialogar de igual para igual com a engenharia.',
    blindSpots: [
      'Tratar IA generativa como mágica ("ela vai resolver tudo sozinha sem regras")',
      'Falta de critérios técnicos para avaliar propostas da engenharia sobre modelos e fornecedores',
      'Dificuldade em especificar requisitos técnicos não-funcionais (latência, concorrência, idempotência)'
    ],
    recommendedCases: ['case-finops-latencia', 'case-governanca-incident-response', 'case-discovery-sdd-spec-kit'],
    actionPlan: [
      {
        step: '01. Alfabetização Técnica de IA Generativa',
        action: 'Compreender a diferença prática entre LLMs, RAG, Embeddings, Function Calling e Agentes Autônomos.',
        outcome: 'Ganhar respeito técnico imediato nas discussões de arquitetura da squad.'
      },
      {
        step: '02. Mapeamento de Automação com Agentes',
        action: 'Identificar gargalos operacionais manuais e desenhar fluxos com agentes de IA com alçadas humanas proporcionais.',
        outcome: 'Multiplicar a produtividade operacional de processos-chave da empresa.'
      },
      {
        step: '03. Governança e Mitigação de Incidentes',
        action: 'Estruturar planos de contingência, auditoria de decisões de IA e reversibilidade de efeitos externos.',
        outcome: 'Implantar automações de larga escala com risco corporativo rigidamente controlado.'
      }
    ]
  }
];
