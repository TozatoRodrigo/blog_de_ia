import type { CompetencyDimension } from '../types';

export const COMPETENCY_DIMENSIONS: CompetencyDimension[] = [
  {
    id: 'arquitetura_modelos',
    title: 'Arquitetura de Modelos & IA',
    description: 'Compreensão profunda de LLMs, SLMs, RAG, Function Calling, janelas de contexto e trade-offs entre modelos.',
    weight: 20,
    questions: [
      {
        id: 'q1',
        question: 'Como você decide entre usar Prompt Engineering, RAG ou Fine-Tuning em um novo produto?',
        options: [
          { text: 'Acho que Fine-Tuning é sempre o melhor caminho porque customiza o modelo por completo.', points: 1 },
          { text: 'Costumo tentar apenas prompts mais longos com todas as informações possíveis.', points: 2 },
          { text: 'Entendo que RAG adiciona contexto externo dinâmico e Fine-Tuning ajusta estilo ou formato específico, priorizando sempre a solução mais simples primeiro.', points: 5 }
        ]
      },
      {
        id: 'q2',
        question: 'O que você faz quando a janela de contexto de um modelo atinge o limite ou fica cara demais?',
        options: [
          { text: 'Corto arbitrariamente as mensagens antigas da conversa.', points: 2 },
          { text: 'Estruturo técnicas de sumarização dinâmica, embeddings semânticos para recuperação seletiva e separação de contexto por módulo.', points: 5 },
          { text: 'Apenas migro para o modelo com maior janela de contexto do mercado sem me importar com custo.', points: 1 }
        ]
      }
    ]
  },
  {
    id: 'evals_qualidade',
    title: 'Evals & Gates de Qualidade',
    description: 'Criação de Golden Datasets, métricas automatizadas (LLM-as-a-judge + determinísticas), detecção de alucinação e gates de release.',
    weight: 20,
    questions: [
      {
        id: 'q3',
        question: 'Como você valida uma alteração de prompt ou modelo antes de colocar em produção?',
        options: [
          { text: 'Testo 5 a 10 exemplos manualmente no playground e vejo se ficou bom.', points: 1 },
          { text: 'Peço para o time de suporte testar durante alguns dias de forma informal.', points: 2 },
          { text: 'Rodo uma suíte automatizada de Evals contra um Golden Dataset curado com casos de borda e meço a taxa de regressão contra critérios de corte estritos.', points: 5 }
        ]
      },
      {
        id: 'q4',
        question: 'Como você mede se o seu produto de IA está alucinando em dados factuais?',
        options: [
          { text: 'Uso apenas avaliações determinísticas de código (schema/regex/verificação contra banco de dados) para fatos e rubricas cegas com juízes múltiplos para texto livre.', points: 5 },
          { text: 'Confio no feedback espontâneo dos usuários que clicam em "não gostei".', points: 2 },
          { text: 'Acho que alucinação é inevitável e basta colocar um aviso legal no rodapé.', points: 1 }
        ]
      }
    ]
  },
  {
    id: 'finops_unit_economics',
    title: 'FinOps de IA & Custos',
    description: 'Cálculo de custo por tarefa resolvida, token economics, roteamento inteligente de modelos e controle de budget em tempo real.',
    weight: 15,
    questions: [
      {
        id: 'q5',
        question: 'Qual é a principal métrica financeira que você acompanha em uma funcionalidade de IA generativa?',
        options: [
          { text: 'Apenas o valor total da fatura mensal da OpenAI / Anthropic.', points: 1 },
          { text: 'Custo por milhão de tokens (input/output).', points: 3 },
          { text: 'Custo por Tarefa Concluída com Sucesso (Unit Economics do Job-to-be-Done).', points: 5 }
        ]
      },
      {
        id: 'q6',
        question: 'Que técnica você prioriza para baratear a operação de IA sem perder capacidade cognitiva?',
        options: [
          { text: 'Roteamento hierárquico (Small Models para tarefas simples, Frontier apenas para casos complexos) somado a Cache Semântico.', points: 5 },
          { text: 'Diminuir o número de usuários que podem usar a ferramenta.', points: 1 },
          { text: 'Reduzir a temperatura do modelo para economizar processamento.', points: 2 }
        ]
      }
    ]
  },
  {
    id: 'governanca_risco',
    title: 'Governança, Risco & Incidentes',
    description: 'Matrizes de risco de IA, resposta a incidentes, kill-switches de ferramentas, contestabilidade e reversibilidade de efeitos externos.',
    weight: 15,
    questions: [
      {
        id: 'q7',
        question: 'O que você faz se um agente autônomo com permissão de alterar dados começar a apresentar comportamento anômalo em produção?',
        options: [
          { text: 'Espero a sprint de bugs da semana que vem para corrigir o prompt.', points: 1 },
          { text: 'Aciono imediatamente o Kill-Switch específico das ferramentas de escrita/efeito externo via feature flag e inicio contenção.', points: 5 },
          { text: 'Desligo todos os servidores da empresa.', points: 2 }
        ]
      },
      {
        id: 'q8',
        question: 'Qual a diferença entre fazer um rollback de software e conter um incidente de agente de IA?',
        options: [
          { text: 'É a mesma coisa: se você reverte a versão do código, o incidente está 100% resolvido.', points: 1 },
          { text: 'O rollback de código apenas para novos erros; os efeitos externos já causados no mundo real (dinheiro enviado, dados alterados) exigem reconciliação ativa.', points: 5 },
          { text: 'Não há como fazer rollback de sistemas de IA.', points: 2 }
        ]
      }
    ]
  },
  {
    id: 'spec_driven_dev',
    title: 'Spec-Driven Development (SDD)',
    description: 'Escrita de especificações formais com schemas executáveis e contratos de dados para guiar Coding Agents com máxima precisão.',
    weight: 15,
    questions: [
      {
        id: 'q9',
        question: 'Como você documenta uma nova feature que será implementada com apoio de Coding Agents (Cursor, Claude Code)?',
        options: [
          { text: 'Escrevo um card no Jira: "Como usuário quero exportar dados".', points: 1 },
          { text: 'Faço uma chamada de vídeo explicando o que quero para o programador.', points: 2 },
          { text: 'Escrevo uma especificação formal (Spec Kit) com schemas JSON de entrada/saída, invariantes de negócio e casos de teste executáveis.', points: 5 }
        ]
      }
    ]
  },
  {
    id: 'discovery_ai_first',
    title: 'Discovery & Anti-Hype',
    description: 'Identificação de problemas adequados para IA vs determinismo, fuga do Agent Washing e desenho de experiências sem fricção inútil.',
    weight: 15,
    questions: [
      {
        id: 'q10',
        question: 'Quando um stakeholder executivo pede para "colocar um agente de IA conversacional" no fluxo de onboarding da empresa, você:',
        options: [
          { text: 'Implementa imediatamente um chatbot com avatar falante para agradar a diretoria.', points: 1 },
          { text: 'Avalia a fricção do usuário: se um formulário simples resolve em 1 minuto e a conversa leva 10 minutos, defende UX determinística e usa IA apenas no backend.', points: 5 },
          { text: 'Diz apenas que IA não funciona e se recusa a conversar.', points: 2 }
        ]
      }
    ]
  }
];
