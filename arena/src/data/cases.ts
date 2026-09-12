import type { AICase } from '../types';

export const AI_CASES: AICase[] = [
  {
    id: 'case-finops-latencia',
    code: 'CASE.01',
    title: 'FinOps & Latência: O Agente de Suporte que Estourou o Budget',
    subtitle: 'Otimização de custos, roteamento de modelos e SLOs em um agente de atendimento em escala.',
    category: 'finops',
    difficulty: 'Intermediário',
    targetOrigins: ['pm_tradicional', 'engenharia', 'operacoes_negocios'],
    estimatedMinutes: 20,
    companyContext: {
      name: 'PayFlow B2B',
      sector: 'Fintech de Pagamentos e Adquirência',
      scale: '450.000 lojistas ativos, 35.000 chamados de suporte/dia',
      challenge: 'A equipe lançou um agente autônomo com Claude 3.5 Sonnet / GPT-4o para resolver disputas de chargeback e reconciliação. Em 48h, a fatura de tokens disparou de $0.03 para $0.82 por ticket e a latência média bateu 16 segundos, gerando abandono de clientes.'
    },
    baselineMetrics: {
      qualityScore: 78,
      costPerTask: 0.82,
      latencyMs: 16200,
      riskLevel: 'Médio',
      userTrust: 61
    },
    phases: [
      {
        id: 'phase-1-arquitetura',
        phaseNumber: 1,
        title: 'Fase 1: Triagem de Arquitetura e Roteamento de Modelos',
        scenario: 'O agente atualmente recebe todas as mensagens de usuários — desde "Qual meu saldo?" até disputas jurídicas complexas com 8 anexos — e chama o modelo frontier mais caro em um loop autônomo de ferramentas sem limite. O CTO exige um plano imediato para reduzir custos em pelo menos 70% sem despencar a resolução.',
        contextData: [
          { label: 'Custo Médio Atual', value: '$0.82 / ticket', subtext: 'Teto orçado original: $0.10' },
          { label: 'Volume Diário', value: '35.000 tickets', subtext: 'Fatura projetada: $28.700/dia' },
          { label: 'Distribuição de Dúvidas', value: '68% triviais, 22% médias, 10% complexas', subtext: 'Base de logs dos últimos 7 dias' }
        ],
        reflectionPrompt: 'Como você desenharia a matriz de roteamento para evitar pagar preço de modelo frontier em perguntas triviais?',
        options: [
          {
            id: 'opt-1a',
            title: 'Substituir tudo por um modelo ultra leve (Small Model) com Fine-Tuning estrito',
            description: 'Treinar um modelo SLM de 3B parâmetros com todos os manuais da empresa e desligar os modelos frontier por completo.',
            rationale: 'Reduz o custo imediatamente a quase zero ($0.01/ticket), mas perde a capacidade de raciocínio de disputas complexas e tool calling confiável.',
            isRecommended: false,
            impactDeltas: {
              quality: -24,
              cost: -0.76,
              latency: -12000,
              risk: 'Alto',
              userTrust: -22
            },
            feedback: {
              title: 'Corte cego de custo prejudicou a qualidade',
              analysis: 'Modelos de 3B são excelentes para classificação e tarefas determinísticas simples, mas alucinam gravemente em tool calling sequencial e leitura de disputas contratuais complexas. A taxa de resolução caiu para 54%, aumentando reaberturas manuais.',
              practicalLesson: 'Nunca resolva problemas de FinOps com "tamanho único". O segredo do AI PM está em casar a complexidade da intenção com o tier do modelo.'
            }
          },
          {
            id: 'opt-1b',
            title: 'Implementar Arquitetura Hierárquica: Roteador Leve + Cache Semântico + Modelo Frontier Sob Demanda',
            description: '1) Adicionar Cache Semântico para perguntas frequentes (custo zero e latência < 200ms); 2) Classificador leve (ex: Gemini Flash / Claude Haiku) para resolver 68% dos chamados triviais; 3) Escalar para Frontier apenas em 10% das disputas com evidências.',
            rationale: 'Distribui as requisições proporcionalmente ao valor econômico de cada chamado, cortando 75% dos tokens.',
            isRecommended: true,
            impactDeltas: {
              quality: 8,
              cost: -0.68,
              latency: -11500,
              risk: 'Baixo',
              userTrust: 18
            },
            feedback: {
              title: 'Arquitetura de Roteamento Equilibrada e Eficiente',
              analysis: 'Excelente decisão. 68% das consultas (consultas de saldo, status de liquidação) passaram a ser respondidas em 800ms por uma fração de centavo. O modelo potente ficou reservado para onde sua capacidade cognitiva realmente gera ROI defensável.',
              practicalLesson: 'No FinOps de IA, o roteamento semântico e o cache são a primeira linha de defesa antes de qualquer tentativa cara de fine-tuning.',
              referenceGuideSlug: 'custo-agentes-de-ia'
            }
          },
          {
            id: 'opt-1c',
            title: 'Manter modelo frontier único, mas limitar o tamanho do histórico de conversa a 2 mensagens',
            description: 'Reduzir drasticamente o contexto enviado para economizar tokens de entrada sem alterar o modelo ou fluxo.',
            rationale: 'Tentativa rápida sem alterar infraestrutura, mas amputa a memória conversacional do agente.',
            isRecommended: false,
            impactDeltas: {
              quality: -18,
              cost: -0.28,
              latency: -3000,
              risk: 'Médio',
              userTrust: -14
            },
            feedback: {
              title: 'Amnésia conversacional gera frustração',
              analysis: 'O agente perdeu o contexto em atendimentos que precisavam de mais de duas interações ("conforme o anexo que enviei antes..."). Os usuários foram forçados a repetir informações, derrubando o CSAT.',
              practicalLesson: 'Engenharia de contexto eficiente exige sumarização dinâmica ou recuperação seletiva, não truncamento arbitrário cego.'
            }
          }
        ]
      },
      {
        id: 'phase-2-tool-calling',
        phaseNumber: 2,
        title: 'Fase 2: Governança do Loop de Ferramentas (Tool Calling)',
        scenario: 'Analisando os logs de latência de 16 segundos, você descobriu que o agente estava entrando em ciclos viciosos: chamava a ferramenta de consulta de extrato, depois reconsultava o status bancário, depois validava com a adquirente em loop de até 9 chamadas antes de responder uma única mensagem.',
        contextData: [
          { label: 'Chamadas de Ferramenta Médias', value: '4.8 chamadas / prompt', subtext: 'Tempo gasto em I/O: 12.4s' },
          { label: 'Casos de Loop Infinito', value: '3.4% dos tickets', subtext: 'Timeout após 60 segundos' }
        ],
        reflectionPrompt: 'Como definir um limite de autonomia que preserve a precisão sem travar a experiência do usuário?',
        options: [
          {
            id: 'opt-2a',
            title: 'Definir limite estrito de 3 iterações de ferramentas + Circuit Breaker com fallback determinístico',
            description: 'Configurar `max_steps = 3` no orquestrador de agentes. Se o agente não chegar a uma conclusão na 3ª iteração, emitir fallback estruturado para fila humana com o log consolidado.',
            rationale: 'Elimina loops infinitos, garante teto determinístico de latência e custo por tarefa.',
            isRecommended: true,
            impactDeltas: {
              quality: 6,
              cost: -0.07,
              latency: -3200,
              risk: 'Baixo',
              userTrust: 12
            },
            feedback: {
              title: 'Controle de Trajetória e Falha Graciosa',
              analysis: 'Perfeito. Como ensina o guia oficial de Agentes de IA do Produto com IA, agentes em produção NUNCA devem ter autonomia ilimitada. Limitar a profundidade do loop e prever transição assistida para humanos é a chave da confiabilidade.',
              practicalLesson: 'Circuit breakers e fallbacks determinísticos são requisitos de engenharia de produto para IA probabilística.',
              referenceGuideSlug: 'avaliacao-agentes-de-ia'
            }
          },
          {
            id: 'opt-2b',
            title: 'Remover o acesso às ferramentas e pedir para o modelo apenas sugerir instruções de texto para o usuário',
            description: 'Transformar o agente autônomo em um mero chatbot informativo que diz ao cliente onde clicar.',
            rationale: 'Reduz latência e custo, mas elimina o valor essencial do produto (resolução automática).',
            isRecommended: false,
            impactDeltas: {
              quality: -15,
              cost: -0.05,
              latency: -2000,
              risk: 'Baixo',
              userTrust: -19
            },
            feedback: {
              title: 'Retrocesso na proposta de valor',
              analysis: 'Você eliminou o custo operacional de ferramentas, mas devolveu todo o trabalho braçal para o cliente. A métrica de resolução direta despencou.',
              practicalLesson: 'O papel do AI PM não é desarmar a IA por medo do custo, mas gerenciar a governança de suas ferramentas com métricas precisas.'
            }
          }
        ]
      },
      {
        id: 'phase-3-ledger-slo',
        phaseNumber: 3,
        title: 'Fase 3: Formalização do Ledger de FinOps e SLOs de Lançamento',
        scenario: 'Após os ajustes, o custo médio caiu para $0.06 por ticket e a latência p95 para 2.4s. O comitê executivo quer liberar a solução para 100% da base. Você precisa definir as métricas de guarda (guardrail metrics) permanentes no painel de observabilidade.',
        contextData: [
          { label: 'Custo Atual Alcançado', value: '$0.06 / ticket', subtext: 'Economia anual estimada: $9.5M' },
          { label: 'Latência p95', value: '2.4s', subtext: 'Dentro do benchmark conversacional' },
          { label: 'Resolução Direta', value: '84%', subtext: 'Superou a meta inicial de 80%' }
        ],
        reflectionPrompt: 'Quais SLOs inegociáveis você registraria no SLA do agente de IA?',
        options: [
          {
            id: 'opt-3a',
            title: 'Apenas monitorar o valor total da fatura mensal no fim do mês',
            description: 'Verificar a conta da OpenAI/Anthropic no fechamento do cartão de crédito corporativo.',
            rationale: 'Abordagem reativa clássica de software determinístico.',
            isRecommended: false,
            impactDeltas: {
              quality: 0,
              cost: 0.12,
              latency: 500,
              risk: 'Crítico',
              userTrust: -5
            },
            feedback: {
              title: 'Risco de "surpresa na fatura" em produção',
              analysis: 'Em sistemas estocásticos, um único bug de repetição ou pico de tráfego imprevisto pode queimar dezenas de milhares de dólares em um fim de semana antes de alguém notar.',
              practicalLesson: 'FinOps de IA exige monitoramento granular por tarefa em tempo real, não reconciliação retroativa contábil.'
            }
          },
          {
            id: 'opt-3b',
            title: 'Implementar Ledger de Custo por Tarefa em Tempo Real com Teto Orçamentário e Alerta de Desvio',
            description: 'Painel com: 1) Custo por tarefa concluída; 2) Limite de gasto horário ($300/hora); 3) Alerta automático se p95 > 4.0s ou se desvio de custo subir > 15% em janela de 10 min.',
            rationale: 'Controle contínuo de unit economics com gatilho automático de intervenção.',
            isRecommended: true,
            impactDeltas: {
              quality: 5,
              cost: -0.02,
              latency: -200,
              risk: 'Baixo',
              userTrust: 14
            },
            feedback: {
              title: 'Governança de FinOps de Padrão Internacional',
              analysis: 'Exatamente o que preconiza o template de orçamento e custo por tarefa do Produto com IA: medição por tarefa, atribuição direta, limites operacionais e reconciliação em tempo real.',
              practicalLesson: 'Um AI PM maduro não gerencia apenas backlog; gerencia o balanço contábil em tempo de execução dos modelos.',
              referenceGuideSlug: 'custo-agentes-de-ia'
            }
          }
        ]
      }
    ],
    technicalDebrief: {
      summary: 'Este case demonstra a transição de gerenciar features estáticas para gerenciar a economia de inferência e a latência de sistemas probabilísticos.',
      keyTakeaways: [
        'Roteamento Semântico: Nunca envie tarefas triviais para modelos frontier quando modelos pequenos ou caches resolvem a 1/20 do custo.',
        'Governança de Ferramentas: Agentes autônomos sem limites de profundidade (`max_steps`) geram explosão combinatória de latência e chamadas de API.',
        'Custo por Tarefa Concluída: O indicador real de FinOps de IA não é custo por token, mas o custo unitário da tarefa comercial resolvida com sucesso.'
      ],
      officialGuides: [
        {
          title: 'Custo de agentes de IA: custo por tarefa, orçamento e escala',
          url: 'https://www.produtocomia.com.br/guias/custo-agentes-de-ia/',
          description: 'Aprenda a medir custo por tarefa, criar limites de orçamento e decidir quando um agente de IA está pronto para escalar.'
        },
        {
          title: 'Template de orçamento e custo por tarefa de agente de IA',
          url: 'https://www.produtocomia.com.br/guias/template-orcamento-custo-agente-ia/',
          description: 'Registre uso, custo por tarefa, limites, revisão humana e decisão de escala de um agente de IA em um ledger simples.'
        }
      ]
    }
  },
  {
    id: 'case-evals-gate-lancamento',
    code: 'CASE.02',
    title: 'Evals & Gate de Lançamento: O Copiloto de Análise de Risco de Crédito',
    subtitle: 'Golden datasets, LLM-as-a-judge e critérios inegociáveis de lançamento para modelos em cenários de alto risco.',
    category: 'evals',
    difficulty: 'Avançado',
    targetOrigins: ['pm_tradicional', 'dados', 'engenharia'],
    estimatedMinutes: 25,
    companyContext: {
      name: 'CrediScore Enterprise',
      sector: 'Credit Intelligence B2B',
      scale: 'R$ 4.2 bilhões em esteira de concessão de crédito sob análise',
      challenge: 'O time desenvolveu um Copiloto com IA para analisar demonstrações financeiras de empresas e emitir um parecer preliminar de risco. A engenharia quer fazer o rollout na próxima sprint ("fizemos 20 prompts e ficou excelente"). Como AI PM, você sabe que 20 prompts manuais não são validação estatística.'
    },
    baselineMetrics: {
      qualityScore: 64,
      costPerTask: 0.15,
      latencyMs: 4200,
      riskLevel: 'Crítico',
      userTrust: 52
    },
    phases: [
      {
        id: 'phase-1-golden-dataset',
        phaseNumber: 1,
        title: 'Fase 1: Estruturação do Golden Dataset de Avaliação',
        scenario: 'O time técnico usou dados sintéticos fáceis e demonstrativos padrão para testar o copiloto. Você sabe que o mundo real do crédito inclui notas explicativas ambíguas, balanços com prejuízos contábeis camuflados e empresas com passivos trabalhistas em notas de rodapé.',
        contextData: [
          { label: 'Amostra Atual do Time', value: '25 balanços padrão', subtext: 'Sem casos de fraude ou edge cases' },
          { label: 'Volume Histórico Real', value: '120.000 pareceres emitidos', subtext: 'Com desfecho conhecido de inadimplência' }
        ],
        reflectionPrompt: 'Como você comporia a suíte de avaliação para capturar alucinações silenciosas de risco?',
        options: [
          {
            id: 'opt-2-1a',
            title: 'Aceitar os 25 testes do time técnico para acelerar o Time-to-Market',
            description: 'Lançar em beta fechado e confiar no feedback dos analistas para encontrar erros em produção.',
            rationale: 'Abordagem tradicional ágil ("move fast and break things"), catastrófica em crédito.',
            isRecommended: false,
            impactDeltas: {
              quality: -10,
              cost: 0,
              latency: 0,
              risk: 'Crítico',
              userTrust: -25
            },
            feedback: {
              title: 'Risco de Ruína Financeira e Jurídica',
              analysis: 'Em produtos de IA de alto impacto, o erro silencioso (o modelo não ver um passivo oculto) causa perdas milionárias de inadimplência. "Move fast and break things" em risco de crédito é imprudência.',
              practicalLesson: 'Em IA, a suíte de testes (Evals) substitui os testes unitários tradicionais. Sem Evals robustos, não há produto.'
            }
          },
          {
            id: 'opt-2-1b',
            title: 'Criar Golden Dataset curado de 500 casos estratificados (60% representativos, 25% edge cases, 15% ataques adversariais)',
            description: 'Reunir casos históricos com desfecho comprovado, incluindo balanços auditados com ressalvas, casos com passivos ocultos e tentativas intencionais de induzir o modelo ao erro via prompt injection.',
            rationale: 'Constrói a fundação científica verificável para qualquer alteração futura de prompt ou modelo.',
            isRecommended: true,
            impactDeltas: {
              quality: 18,
              cost: 0.02,
              latency: 300,
              risk: 'Médio',
              userTrust: 22
            },
            feedback: {
              title: 'Fundação de Avaliação Científica',
              analysis: 'Excelente. Como detalhado no guia de Avaliação de Agentes de IA do Produto com IA, a criação de um Golden Dataset com amostragem adversarial e estratificada é a única forma de medir regressão ao mudar prompts ou modelos.',
              practicalLesson: 'O Golden Dataset é o patrimônio mais valioso de uma squad de IA — ele sobrevive a qualquer mudança de fornecedor de LLM.',
              referenceGuideSlug: 'avaliacao-agentes-de-ia'
            }
          }
        ]
      },
      {
        id: 'phase-2-metrica-corte',
        phaseNumber: 2,
        title: 'Fase 2: Métricas de Avaliação e LLM-as-a-Judge vs Evals Determinísticos',
        scenario: 'A equipe propôs usar apenas um LLM-as-a-Judge (ex: GPT-4 avaliando o parecer do outro modelo com notas de 1 a 5). Você precisa definir o pipeline de medição exato.',
        contextData: [
          { label: 'Proposta do Tech Lead', value: 'Prompt único com nota 1 a 5', subtext: 'Susceptível a viés de concordância do juiz' }
        ],
        reflectionPrompt: 'Quais tipos de avaliação você combinaria para garantir precisão e ausência de viés?',
        options: [
          {
            id: 'opt-2-2a',
            title: 'Pipeline Híbrido: Evals Determinísticos para Fatos Contábeis + Rubrica Cega de LLM-as-a-Judge com Juízes Múltiplos',
            description: '1) Validação determinística de código (checar se os números citados no parecer batem exatamente com as tabelas do balanço); 2) Rubrica explícita com critérios objetivos (cobertura de risco, detecção de notas, neutralidade); 3) Painel cego com alternância de posição.',
            rationale: 'Combina rigor matemático onde há números e semântica estruturada onde há raciocínio qualitativo.',
            isRecommended: true,
            impactDeltas: {
              quality: 15,
              cost: 0.01,
              latency: 200,
              risk: 'Baixo',
              userTrust: 20
            },
            feedback: {
              title: 'Arquitetura de Evals de Classe Mundial',
              analysis: 'Perfeita síntese técnica. O LLM-as-a-Judge sozinho sofre de "positional bias" e viés de generosidade. Validar fatos determinísticos com código (schema validation e extração exata) elimina 90% das alucinações numéricas.',
              practicalLesson: 'Nunca use LLM para avaliar o que uma linha de Python/SQL pode calcular de forma determinística.',
              referenceGuideSlug: 'avaliacao-agentes-de-ia'
            }
          },
          {
            id: 'opt-2-2b',
            title: 'Substituir toda avaliação automatizada por revisão manual de 10 analistas seniores a cada release',
            description: 'Fazer com que analistas humanos revisem manualmente todas as saídas a cada alteração de prompt.',
            rationale: 'Garante precisão humana, mas torna o ciclo de desenvolvimento inviável (dias para cada ajuste simples).',
            isRecommended: false,
            impactDeltas: {
              quality: 4,
              cost: 0.45,
              latency: 0,
              risk: 'Médio',
              userTrust: 5
            },
            feedback: {
              title: 'Gargalo humano inviabilizou a agilidade',
              analysis: 'Embora o input humano seja vital para calibrar o Golden Dataset inicial, usar humanos como suíte de regressão diária custa caro, introduz fadiga e atrasa o roadmap em meses.',
              practicalLesson: 'Humanos definem o critério e o gabarito; a automação de Evals executa a escala.'
            }
          }
        ]
      },
      {
        id: 'phase-3-launch-gate',
        phaseNumber: 3,
        title: 'Fase 3: O Gate de Lançamento (Release Gate) Inegociável',
        scenario: 'Na véspera do lançamento, a nova versão do prompt subiu a nota geral de 72% para 89%, porém no subconjunto de "Detecção de Risco de Falência", a taxa de acerto caiu de 94% para 86%. O Diretor Comercial quer lançar porque "a nota média subiu muito". Como agir?',
        contextData: [
          { label: 'Nota Média Global', value: '89% (Subiu +17%)', subtext: 'Métrica agregada tentadora' },
          { label: 'Risco de Falência', value: '86% (Caiu -8%)', subtext: 'Métrica crítica de segurança' }
        ],
        reflectionPrompt: 'Como você sustenta a decisão perante os stakeholders comerciais?',
        options: [
          {
            id: 'opt-2-3a',
            title: 'Barrar o lançamento: Acionar o Gate de Segurança e manter a versão anterior até resolver a regressão',
            description: 'Demonstrar com dados que um erro em caso de falência gera prejuízo médio de R$ 850.000 por empresa, tornando o ganho na média uma ilusão perigosa. Definir a métrica de risco crítico como "Hard Gate" (inviolável).',
            rationale: 'Protege a empresa de perdas catastróficas e estabelece a cultura de maturidade de IA.',
            isRecommended: true,
            impactDeltas: {
              quality: 12,
              cost: -0.01,
              latency: 0,
              risk: 'Baixo',
              userTrust: 25
            },
            feedback: {
              title: 'Liderança de Produto Baseada em Evidência e Governança',
              analysis: 'Decisão impecável. Como preconiza o guia de Avaliação e Gate de Lançamento do Produto com IA, métricas críticas de segurança nunca devem ser compensadas por médias agregadas. Um "Hard Gate" violado é um "No-Go" imediato.',
              practicalLesson: 'Médias em IA escondem desastres. O AI PM analisa a cauda longa e os piores casos (worst-case scenario).',
              referenceGuideSlug: 'avaliacao-agentes-de-ia'
            }
          },
          {
            id: 'opt-2-3b',
            title: 'Aprovar o lançamento com um aviso em disclaimer no rodapé',
            description: 'Colocar um texto em cinza claro dizendo: "A IA pode errar em casos de insolvência; confirme com um analista".',
            rationale: 'Cede à pressão comercial e transfere a responsabilidade para o usuário final.',
            isRecommended: false,
            impactDeltas: {
              quality: -12,
              cost: 0,
              latency: 0,
              risk: 'Crítico',
              userTrust: -30
            },
            feedback: {
              title: 'O clássico fracasso do "Disclaimerismo"',
              analysis: 'Disclaimers genéricos não isentam a responsabilidade do produto nem evitam sinistros na carteira de crédito. Os analistas confiaram no parecer positivo e três empresas insolventes receberam empréstimos indevidos.',
              practicalLesson: 'Se o sistema não atinge a precisão mínima no núcleo de risco, o disclaimer é apenas negligência documentada.'
            }
          }
        ]
      }
    ],
    technicalDebrief: {
      summary: 'Este case solidifica o domínio de Evals: a transição de intuições subjetivas ("ficou legal") para métricas quantitativas com Golden Datasets, juízes múltiplos e Gates de Lançamento inegociáveis.',
      keyTakeaways: [
        'Evals são o novo Software Testing: Em IA generativa, quem não mede com Golden Datasets navega às cegas.',
        'Hard Gates vs Soft Metrics: Métricas vitais de segurança (ex: conformidade, insolvência, alucinações críticas) não podem ser mascaradas por notas médias altas.',
        'Validação Híbrida: Combine verificação de fatos por código determinístico com avaliação semântica por LLM-as-a-Judge.'
      ],
      officialGuides: [
        {
          title: 'Avaliação de agentes de IA: casos, métricas e gate de lançamento',
          url: 'https://www.produtocomia.com.br/guias/avaliacao-agentes-de-ia/',
          description: 'Aprenda a avaliar agentes de IA por resultado, trajetória, ferramentas, segurança, custo e prontidão antes de liberar uma mudança.'
        },
        {
          title: 'Template de avaliação de agente de IA',
          url: 'https://www.produtocomia.com.br/guias/template-avaliacao-agente-de-ia/',
          description: 'Avalie agentes de IA por conclusão, ferramentas, segurança, custo, latência, supervisão e prontidão para lançamento.'
        }
      ]
    }
  },
  {
    id: 'case-governanca-incident-response',
    code: 'CASE.03',
    title: 'Governança & Incident Response: Agente com Efeito Externo Irreversível',
    subtitle: 'Gestão de crise, distinção entre rollback de código e efeito externo, e desenho de esteiras de alçada humana.',
    category: 'governanca',
    difficulty: 'Avançado',
    targetOrigins: ['pm_tradicional', 'operacoes_negocios', 'engenharia'],
    estimatedMinutes: 25,
    companyContext: {
      name: 'OmniCommerce Global',
      sector: 'Marketplace & Logística de Varejo',
      scale: '2.8 milhões de pedidos/mês, 15.000 sellers cadastrados',
      challenge: 'Um agente autônomo com permissão de reembolso de pedidos ("RefundAgent") sofreu uma falha em cascata após uma instabilidade de webhook do gateway bancário. Em vez de registrar a falha e aguardar, o agente entrou em loop e emitiu reembolsos em duplicidade e triplicidade para 1.450 clientes, totalizando R$ 780.000 em 90 minutos.'
    },
    baselineMetrics: {
      qualityScore: 40,
      costPerTask: 0.35,
      latencyMs: 1800,
      riskLevel: 'Crítico',
      userTrust: 35
    },
    phases: [
      {
        id: 'phase-1-incident-containment',
        phaseNumber: 1,
        title: 'Fase 1: Contenção Imediata (Incident Containment)',
        scenario: 'O alerta do financeiro tocou às 14:15. A engenharia propõe fazer um `git revert` do deploy de sexta-feira. Como AI PM responsável pela operação do agente, você precisa conter o dano em menos de 5 minutos.',
        contextData: [
          { label: 'Dano Acumulado', value: 'R$ 780.000', subtext: 'Subindo R$ 12.000 a cada minuto' },
          { label: 'Proposta da Engenharia', value: 'Build e deploy de hotfix (25 min)', subtext: 'Tempo demais com sangramento ativo' }
        ],
        reflectionPrompt: 'Qual é o primeiro comando operacional inegociável diante de um agente autônomo fora de controle?',
        options: [
          {
            id: 'opt-3-1a',
            title: 'Acionar o Kill-Switch de Ferramenta Financeira no Orquestrador (Degradação Graciosa)',
            description: 'Desativar instantaneamente a ferramenta `issue_refund()` nas variáveis de ambiente do orquestrador via feature flag. O agente continua atendendo dúvidas de texto, mas qualquer solicitação de reembolso é direcionada para fila de retenção sem execução bancária.',
            rationale: 'Corta o sangramento em 10 segundos sem derrubar todo o suporte ao cliente.',
            isRecommended: true,
            impactDeltas: {
              quality: 10,
              cost: -0.15,
              latency: 0,
              risk: 'Médio',
              userTrust: 15
            },
            feedback: {
              title: 'Contenção Cirúrgica Imediata',
              analysis: 'Excelente. Como detalhado no guia oficial de Resposta a Incidentes de Agentes de IA do Produto com IA, a primeira regra é conter o vetor de dano externo com isolamento de ferramentas (Tool Isolation / Kill-Switch), não esperar deploy de código.',
              practicalLesson: 'Nunca confunda rollback de código (demorado) com desligamento de privilégios de ferramentas de IA (imediato).',
              referenceGuideSlug: 'resposta-incidentes-agentes-de-ia'
            }
          },
          {
            id: 'opt-3-1b',
            title: 'Aguardar a engenharia compilar e publicar o hotfix no GitHub',
            description: 'Esperar a pipeline de CI/CD rodar para corrigir o código do webhook.',
            rationale: 'Segue o processo padrão de desenvolvimento de software convencional.',
            isRecommended: false,
            impactDeltas: {
              quality: -25,
              cost: 0.85,
              latency: 0,
              risk: 'Crítico',
              userTrust: -30
            },
            feedback: {
              title: 'Sangramento de R$ 300.000 adicionais',
              analysis: 'Enquanto o build do GitHub Actions rodava e rodava testes, o agente executou mais 500 transações financeiras indevidas.',
              practicalLesson: 'Agentes com efeitos colaterais no mundo físico ou financeiro exigem disjuntores (circuit breakers) acessíveis em milissegundos.'
            }
          }
        ]
      },
      {
        id: 'phase-2-external-effects',
        phaseNumber: 2,
        title: 'Fase 2: Rollback de Configuração vs Reversão de Efeitos Externos',
        scenario: 'Com o kill-switch acionado, o sangramento parou. Agora o time de TI afirma: "Pronto, revertemos a versão do modelo no orquestrador, incidente resolvido!". Cabe a você esclarecer por que o incidente ainda NÃO acabou.',
        contextData: [
          { label: 'Status do Código', value: 'Revertido com sucesso', subtext: 'Versão v1.4 estável no ar' },
          { label: 'Efeitos no Mundo Real', value: '1.450 estornos bancários executados', subtext: 'Lojistas lesados, contas bancárias creditadas' }
        ],
        reflectionPrompt: 'Como estruturar o plano de reconciliação de efeitos externos com o time de operações?',
        options: [
          {
            id: 'opt-3-2a',
            title: 'Criar Task Force de Reconciliação Contábil, Comunicação Transparente e Notificação aos Sellers',
            description: '1) Mapear todas as transações com ID de idempotência violado; 2) Isolar quais clientes receberam Pix indevido e emitir comunicado empático; 3) Garantir que os lojistas do marketplace não sejam cobrados indevidamente; 4) Iniciar estorno amigável com adquirentes.',
            rationale: 'Reconhece que a autonomia da IA criou passivos jurídicos e financeiros que código nenhum conserta sozinho.',
            isRecommended: true,
            impactDeltas: {
              quality: 20,
              cost: -0.05,
              latency: 0,
              risk: 'Baixo',
              userTrust: 25
            },
            feedback: {
              title: 'Visão Holística de Produto com IA',
              analysis: 'Diferenciação crítica de um AI PM. Conforme o artigo do Produto com IA sobre resposta a incidentes, "reversão de configuração não desfaz efeitos externos". A responsabilidade do produto abrange todo o ciclo de reconciliação externa.',
              practicalLesson: 'O AI PM não gerencia apenas software; gerencia a interface entre a probabilidade do modelo e o mundo real auditável.',
              referenceGuideSlug: 'resposta-incidentes-agentes-de-ia'
            }
          },
          {
            id: 'opt-3-2b',
            title: 'Considerar o incidente encerrado tecnicamente e passar o problema para o SAC resolver',
            description: 'Focar na próxima sprint de produto e deixar o atendimento lidar com as reclamações conforme surgirem.',
            rationale: 'Postura silada tradicional de "isso é problema de operações".',
            isRecommended: false,
            impactDeltas: {
              quality: -15,
              cost: 0.15,
              latency: 0,
              risk: 'Crítico',
              userTrust: -35
            },
            feedback: {
              title: 'Crise de Relações Públicas e Processos no Procon',
              analysis: 'Os lojistas viram seu saldo sumir sem explicação, abrindo centenas de queixas jurídicas e expondo o marketplace nas redes sociais.',
              practicalLesson: 'A governança de IA é parte intrínseca do design do produto, não um anexo terceirizado.'
            }
          }
        ]
      },
      {
        id: 'phase-3-alçadas',
        phaseNumber: 3,
        title: 'Fase 3: Redesenho da Matriz de Autonomia e Alçadas Humanas (Guardrails)',
        scenario: 'No post-mortem, você precisa reestruturar o produto para que isso nunca mais aconteça. O time propõe voltar ao processo 100% manual e lento de antes.',
        contextData: [
          { label: 'Tempo Manual Anterior', value: '48 horas para estorno', subtext: 'Gerava atrito com clientes' },
          { label: 'Autonomia Cega Anterior', value: '100% autônomo sem teto', subtext: 'Gerou o desastre financeiro' }
        ],
        reflectionPrompt: 'Qual é o modelo de governança ideal para equilibrar velocidade e segurança?',
        options: [
          {
            id: 'opt-3-3a',
            title: 'Arquitetura de Alçadas Estratificadas (Tiered Autonomy Matrix)',
            description: '1) Tier 1 (Autônomo): Reembolsos < R$ 60 em pedidos extraviados com tracking comprovado + Chave de Idempotência estrita; 2) Tier 2 (Human-in-the-Loop 1-Click): Reembolsos entre R$ 60 e R$ 300 requerem aprovação de 1 clique do atendente; 3) Tier 3: Reembolsos > R$ 300 ou clientes com reincidência exigem dupla validação gerencial.',
            rationale: 'Mantém 70% dos pedidos resolvidos em segundos com segurança total contra perdas catastróficas.',
            isRecommended: true,
            impactDeltas: {
              quality: 18,
              cost: -0.05,
              latency: -200,
              risk: 'Baixo',
              userTrust: 30
            },
            feedback: {
              title: 'Governança e Design de Autonomia Perfeitos',
              analysis: 'A matriz de risco do Produto com IA baseia-se exatamente nisso: classificação por impacto financeiro, reversibilidade e contestabilidade. O agente atua onde o risco é baixo e empodera o humano onde há risco relevante.',
              practicalLesson: 'Autonomia em IA não é um botão binário (ligado/desligado); é um gradiente proporcional ao risco da ação.',
              referenceGuideSlug: 'governanca-de-ia'
            }
          },
          {
            id: 'opt-3-3b',
            title: 'Extinguir o uso de IA e proibir qualquer automação de pagamento na empresa',
            description: 'Voltar a 2015 com formulários em PDF e aprovação por e-mail para todos os reembolsos.',
            rationale: 'Medo institucional e aversão total ao risco.',
            isRecommended: false,
            impactDeltas: {
              quality: -30,
              cost: 0.40,
              latency: 45000,
              risk: 'Baixo',
              userTrust: -20
            },
            feedback: {
              title: 'Perda de Competitividade de Mercado',
              analysis: 'Os concorrentes resolveram os reembolsos em minutos enquanto seu produto demorava dias, gerando debandada de lojistas e compradores.',
              practicalLesson: 'O trabalho do AI PM não é fugir da incerteza, mas governá-la com engenharia de limites.'
            }
          }
        ]
      }
    ],
    technicalDebrief: {
      summary: 'Este case ensina a habilidade mais crítica de sobrevivência de um AI-First PM: como responder a crises de agentes autônomos e desenhar sistemas com contenção nativa.',
      keyTakeaways: [
        'Rollback de Código ≠ Reversão de Efeitos: Alterar o modelo ou código do agente não cancela transações financeiras, envios de e-mails ou chamadas de API feitas no mundo real.',
        'Kill-Switches por Ferramenta: Todo agente autônomo em produção deve possuir desligamento independente de ferramentas com risco externo.',
        'Matriz de Autonomia Gradual: Divida as ações em níveis de impacto financeiro e reversibilidade, reservando a supervisão humana para os pontos de alavancagem crítica.'
      ],
      officialGuides: [
        {
          title: 'Resposta a incidentes de agentes de IA: contenção, recuperação e rollback',
          url: 'https://www.produtocomia.com.br/guias/resposta-incidentes-agentes-de-ia/',
          description: 'Aprenda a detectar, conter, recuperar e aprender com incidentes de agentes de IA sem confundir rollback de configuração com reversão de efeitos externos.'
        },
        {
          title: 'Matriz de risco de IA: como classificar impacto e controle',
          url: 'https://www.produtocomia.com.br/guias/matriz-risco-ia/',
          description: 'Classifique risco de IA por impacto, probabilidade, escala, reversibilidade e contestação para definir avaliação, aprovação e supervisão.'
        }
      ]
    }
  },
  {
    id: 'case-discovery-sdd-spec-kit',
    code: 'CASE.04',
    title: 'Discovery & Spec-Driven Development: Da PRD Vaga ao Spec Kit com Coding Agents',
    subtitle: 'Como o trabalho do Product Manager muda radicalmente ao trabalhar com engenharia acelerada por agentes de código.',
    category: 'sdd',
    difficulty: 'Iniciante',
    targetOrigins: ['pm_tradicional', 'engenharia', 'operacoes_negocios'],
    estimatedMinutes: 20,
    companyContext: {
      name: 'StackForge SaaS',
      sector: 'Ferramentas de Desenvolvimento e Cloud',
      scale: 'Squad de 8 engenheiros utilizando Cursor, Claude Code e GitHub Copilot',
      challenge: 'O PM tradicional da squad continua escrevendo histórias no Jira como "Como usuário quero exportar relatórios inteligentes em PDF". Os agentes de código dos desenvolvedores geraram 14 implementações completamente inconsistentes, quebrando testes e inflando custos de token. A squad precisa adotar o Spec-Driven Development (SDD).'
    },
    baselineMetrics: {
      qualityScore: 50,
      costPerTask: 0.28,
      latencyMs: 3100,
      riskLevel: 'Médio',
      userTrust: 55
    },
    phases: [
      {
        id: 'phase-1-jira-to-spec',
        phaseNumber: 1,
        title: 'Fase 1: O Choque de Especificação (Morte das User Stories Vagas)',
        scenario: 'Os engenheiros reclamam que os coding agents inventam bibliotecas inexistentes e schemas de dados incompatíveis porque o briefing do PM deixa 80% das suposições em aberto. Você precisa substituir o formato de especificação.',
        contextData: [
          { label: 'Formato Atual', value: 'Card de 3 linhas no Jira', subtext: '"Como usuário quero exportar relatórios..."' },
          { label: 'Taxa de Retrabalho', value: '62% das PRs rejeitadas', subtext: 'Engenheiros gastam horas reescrevendo código' }
        ],
        reflectionPrompt: 'O que uma especificação para Coding Agents precisa conter que o Jira tradicional ignorava?',
        options: [
          {
            id: 'opt-4-1a',
            title: 'Adotar o GitHub Spec Kit / SDD com Schemas de Dados Formais, Contratos e Invariantes',
            description: 'Redigir a especificação contendo: 1) Schema JSON exato do payload de entrada e saída; 2) Invariantes de negócio (ex: "nunca permitir dados de outro tenant"); 3) Exemplos de teste verificáveis (Golden Test Cases) executáveis diretamente pelo agente de código.',
            rationale: 'Entrega aos agentes o contexto estruturado e não ambíguo necessário para síntese precisa.',
            isRecommended: true,
            impactDeltas: {
              quality: 25,
              cost: -0.12,
              latency: -1100,
              risk: 'Baixo',
              userTrust: 20
            },
            feedback: {
              title: 'Transição Perfeita para Spec-Driven Development',
              analysis: 'Exatamente o núcleo do tutorial de SDD e Spec Kit do Produto com IA: Coding Agents não leem mentes nem interpretam ambiguidades de reuniões. Quando o PM define schemas formais, contratos e testes executáveis, o agente de código gera a implementação correta de primeira.',
              practicalLesson: 'Na era dos agentes de código, o rigor da especificação do PM é o código-fonte da aplicação.',
              referenceGuideSlug: 'spec-kit-sdd'
            }
          },
          {
            id: 'opt-4-1b',
            title: 'Exigir que os desenvolvedores façam reuniões diárias de 2 horas para explicar cada card verbalmente',
            description: 'Aumentar a carga de alinhamentos síncronos e pair-programming humano.',
            rationale: 'Tenta resolver ambiguidade com mais reuniões verbais que se perdem no dia seguinte.',
            isRecommended: false,
            impactDeltas: {
              quality: -5,
              cost: 0.10,
              latency: 2500,
              risk: 'Médio',
              userTrust: -15
            },
            feedback: {
              title: 'Paralisia por Reunião e Fadiga de Equipe',
              analysis: 'Reuniões verbais não alimentam os agentes de código dos desenvolvedores. Os agentes continuam recebendo prompts incompletos nas IDEs.',
              practicalLesson: 'Informação que não está documentada em arquivo de contexto ou spec não existe para um agente de IA.'
            }
          }
        ]
      },
      {
        id: 'phase-2-context-engineering',
        phaseNumber: 2,
        title: 'Fase 2: Gestão da Janela de Contexto dos Agentes de Desenvolvimento',
        scenario: 'Com as especificações estruturadas, o time técnico agora comete outro erro: coloca a base inteira do repositório (250 arquivos) dentro do prompt do agente, estourando a janela de contexto e fazendo o modelo esquecer requisitos centrais da spec.',
        contextData: [
          { label: 'Tamanho Médio do Prompt', value: '180.000 tokens', subtext: 'Custo de $1.80 por iteração simples' },
          { label: 'Efeito Observado', value: '"Lost in the Middle"', subtext: 'O agente ignora regras do meio da especificação' }
        ],
        reflectionPrompt: 'Como orientar a squad para modularizar o contexto dos agentes de código?',
        options: [
          {
            id: 'opt-4-2a',
            title: 'Estruturar o repositório com arquivos de contexto focados (`CLAUDE.md` / `AGENTS.md` + Spec Kit fatiado)',
            description: 'Instruir a squad a manter specs modulares por domínio e um arquivo de governança com padrões de código e ferramentas disponíveis, alimentando o agente apenas com o arquivo de contrato relevante.',
            rationale: 'Mantém o prompt abaixo de 15k tokens, focado e dentro do pico de atenção do modelo.',
            isRecommended: true,
            impactDeltas: {
              quality: 15,
              cost: -0.10,
              latency: -800,
              risk: 'Baixo',
              userTrust: 15
            },
            feedback: {
              title: 'Engenharia de Contexto de Alta Eficiência',
              analysis: 'Precisão cirúrgica. Modelos de ponta sofrem degradação de raciocínio quando sobrecarregados com centenas de arquivos irrelevantes. Contexto enxuto e estruturado gera código limpo.',
              practicalLesson: 'Menos é mais: o bom AI PM garante que cada tarefa tenha apenas as referências indispensáveis para a execução.',
              referenceGuideSlug: 'spec-kit-sdd'
            }
          },
          {
            id: 'opt-4-2b',
            title: 'Contratar o modelo com a maior janela de contexto do mercado e continuar enviando todo o projeto',
            description: 'Fazer upgrade para modelos de 2M tokens e não se preocupar com filtros.',
            rationale: 'Aposta na força bruta de hardware e janela de contexto.',
            isRecommended: false,
            impactDeltas: {
              quality: -8,
              cost: 0.35,
              latency: 4000,
              risk: 'Médio',
              userTrust: -10
            },
            feedback: {
              title: 'Desperdício de Tokens e Degradação Silenciosa',
              analysis: 'Janelas gigantescas custam muito mais caro, demoram muito mais segundos para responder e não resolvem a alucinação de regras sutis de negócio.',
              practicalLesson: 'Ter uma janela de 2 milhões de tokens não significa que você deve enchê-la de ruído inútil.'
            }
          }
        ]
      }
    ],
    technicalDebrief: {
      summary: 'Neste case, o aluno experimenta a profunda mudança de papel do Product Manager na era da IA generativa e dos coding agents.',
      keyTakeaways: [
        'Do Jira Vago para o Spec Kit: O PM do futuro próximo é um arquiteto de especificações precisas, testáveis e estruturadas.',
        'Invariantes e Schemas: Agentes de código precisam de contratos de API e regras que não podem ser violadas, não de prosa vaga.',
        'Velocidade com Rigor: O SDD permite que um time pequeno de engenharia entregue o equivalente a squads gigantescas, desde que o direcionamento de produto seja cirúrgico.'
      ],
      officialGuides: [
        {
          title: 'Spec Kit na prática: tutorial de SDD para Product Managers e Tech Leads',
          url: 'https://www.produtocomia.com.br/guias/spec-kit-desenvolvimento-orientado-especificacoes/',
          description: 'Aprenda a usar o GitHub Spec Kit em SDD para transformar uma ideia em especificação, plano, tarefas e código verificável com PM, Tech Lead e agentes de IA.'
        },
        {
          title: 'Estado da IA na Gestão de Produto 2026',
          url: 'https://www.produtocomia.com.br/guias/estado-ia-gestao-de-produto-2026/',
          description: 'Análise autoral de fontes públicas sobre adoção, agentes, produtividade, governança e competências de IA na gestão de produto em 2026.'
        }
      ]
    }
  },
  {
    id: 'case-agent-washing-oportunidades',
    code: 'CASE.05',
    title: 'Agent Washing vs Valor Real: A Armadilha de Colocar IA em Tudo',
    subtitle: 'Como resistir à pressão por hype, desmascarar falsos agentes e escolher a tecnologia certa para o problema real.',
    category: 'discovery',
    difficulty: 'Iniciante',
    targetOrigins: ['pm_tradicional', 'operacoes_negocios', 'dados'],
    estimatedMinutes: 20,
    companyContext: {
      name: 'BankNeo Digital',
      sector: 'Banco Digital e Meios de Pagamento',
      scale: '3.2 milhões de correntistas pessoas físicas',
      challenge: 'O Conselho de Administração viu demonstrações de agentes autônomos no Vale do Silício e ordenou: "Queremos substituir todo o fluxo de abertura de conta e onboarding por um Agente de IA conversacional para ser a empresa mais inovadora do Brasil". O PM anterior começou a desenhar um chatbot com LLM onde o cliente precisava conversar por texto para passar seu CPF e RG.'
    },
    baselineMetrics: {
      qualityScore: 45,
      costPerTask: 0.42,
      latencyMs: 5400,
      riskLevel: 'Alto',
      userTrust: 48
    },
    phases: [
      {
        id: 'phase-1-diagnostico-hype',
        phaseNumber: 1,
        title: 'Fase 1: Diagnóstico de Agent Washing e Fricção de Usuário',
        scenario: 'Os testes de usabilidade do onboarding conversacional por IA mostraram um desastre: o tempo para abrir a conta saltou de 3 minutos para 14 minutos. O abandono de clientes aumentou em 45%. Os usuários reclamam: "Por que não tem um formulário normal de 3 campos em vez de eu ter que ficar batendo papo com um bot?". O PM precisa se posicionar perante a diretoria.',
        contextData: [
          { label: 'Abandono no Onboarding', value: '45% de churn', subtext: 'Antes da IA era de 12%' },
          { label: 'Tempo de Conclusão', value: '14 minutos', subtext: 'Antes com formulário: 3 min' },
          { label: 'Custo por Abertura', value: 'R$ 2.40 em tokens de LLM', subtext: 'Antes: R$ 0.04' }
        ],
        reflectionPrompt: 'Como demonstrar ao conselho a diferença entre valor para o cliente e puro marketing de hype (Agent Washing)?',
        options: [
          {
            id: 'opt-5-1a',
            title: 'Defender a Arquitetura Híbrida: Formulário Determinístico Ultrarrápido + IA nos Bastidores (OCR e Validação Biométrica)',
            description: 'Apresentar dados claros: a interface conversacional introduz fricção inútil em dados estruturados (CPF, CEP, RG). O design correto usa UX determinística simples para o usuário e aplica IA invisível no backend (extração de dados de fotos de documentos, detecção de fraude e liveness test).',
            rationale: 'Restaura a melhor experiência para o cliente enquanto aproveita a IA onde ela realmente gera ganho exponencial.',
            isRecommended: true,
            impactDeltas: {
              quality: 35,
              cost: -0.36,
              latency: -4200,
              risk: 'Baixo',
              userTrust: 38
            },
            feedback: {
              title: 'Coragem Estratégica e Foco no Valor Real',
              analysis: 'Perfeito. Como destacado no conceito de "Agent Washing" do Produto com IA, empacotar interfaces conversacionais onde um botão ou formulário é 10x superior é a armadilha número um de times imaturos. A IA mais valiosa geralmente é invisível para o usuário final.',
              practicalLesson: 'Nunca obrigue o usuário a digitar texto livre quando uma seleção de um toque resolve o problema.',
              referenceGuideSlug: 'gestao-de-produtos-com-ia'
            }
          },
          {
            id: 'opt-5-1b',
            title: 'Adicionar uma voz sintetizada de celebridade ao chatbot para torná-lo mais amigável',
            description: 'Contratar uma API de áudio realista para tentar convencer as pessoas a conversarem mais tempo com o bot.',
            rationale: 'Dobra a aposta no hype e no visual sem resolver a dor de fricção.',
            isRecommended: false,
            impactDeltas: {
              quality: -20,
              cost: 0.65,
              latency: 3000,
              risk: 'Alto',
              userTrust: -25
            },
            feedback: {
              title: 'Aumento da Fricção e do Custo',
              analysis: 'Adicionar áudio apenas fez o onboarding ficar mais lento e desconfortável para quem estava no transporte público abrindo a conta bancária.',
              practicalLesson: 'Se o fundamento de produto está errado, adereços cosméticos só amplificam o desastre.'
            }
          }
        ]
      },
      {
        id: 'phase-2-matriz-decisao',
        phaseNumber: 2,
        title: 'Fase 2: A Matriz de Decisão: Quando Usar IA vs Automação Determinística',
        scenario: 'Para institucionalizar esse aprendizado e evitar que outros squads caiam na mesma armadilha, o Head de Produto pede que você crie a Matriz de Decisão Oficial de IA para a empresa.',
        contextData: [
          { label: 'Demanda Interna', value: '42 novas propostas de "IA" no backlog corporativo', subtext: '80% são apenas regras `if/else` disfarçadas' }
        ],
        reflectionPrompt: 'Quais perguntas de corte você incluiria no checklist de discovery de IA?',
        options: [
          {
            id: 'opt-5-2a',
            title: 'Criar o Checklist de 4 Filtros: Dados Não Estruturados, Tolerância a Incerteza, Custo por Tarefa e Viabilidade Sem IA',
            description: '1) O problema lida com dados não estruturados (linguagem, imagem, voz)? Se não, use código determinístico; 2) O caso de uso tolera resultados estocásticos e probabilísticos? 3) O ganho econômico supera o custo por inferência? 4) Uma regra `if/else` ou regressão clássica resolveria melhor e mais barato?',
            rationale: 'Cria uma barreira de proteção corporativa contra gastos inúteis com IA e alinha os PMs com resolução real de problemas.',
            isRecommended: true,
            impactDeltas: {
              quality: 20,
              cost: -0.04,
              latency: -200,
              risk: 'Baixo',
              userTrust: 18
            },
            feedback: {
              title: 'Governança de Portfolio de Produtos de IA',
              analysis: 'Excelente. Esse checklist protege a empresa de desperdiçar milhões em "IA pela IA" e orienta a alocação de recursos escassos de engenharia para onde a IA generativa traz diferencial competitivo duradouro.',
              practicalLesson: 'O melhor AI Product Manager é aquele que sabe exatamente quando dizer NÃO para o uso de IA.',
              referenceGuideSlug: 'gestao-de-produtos-com-ia'
            }
          },
          {
            id: 'opt-5-2b',
            title: 'Aprovar todas as 42 iniciativas para testar na prática o que dá certo',
            description: 'Distribuir orçamentos de API para todas as squads sem critério prévio de corte.',
            rationale: 'Aposta descentralizada caótica sem governança.',
            isRecommended: false,
            impactDeltas: {
              quality: -10,
              cost: 0.50,
              latency: 1000,
              risk: 'Alto',
              userTrust: -15
            },
            feedback: {
              title: 'Explosão de Dívida Técnica e Custo Descontrolado',
              analysis: 'As squads implementaram dezenas de ferramentas redundantes, sem observabilidade central e sem ROI comprovado.',
              practicalLesson: 'Inovação exige foco; experimentação sem critérios de corte é apenas caos orçamentário.'
            }
          }
        ]
      }
    ],
    technicalDebrief: {
      summary: 'Saber identificar Agent Washing e resistir à pressão do hype é a marca distintiva de um Product Manager sênior voltado para IA.',
      keyTakeaways: [
        'Agent Washing destrói UX: Não force conversas de texto onde interfaces visuais e botões resolvem em 1 clique.',
        'IA nos Bastidores: O maior valor da IA muitas vezes reside na orquestração invisível de backend, não em avatares ou chatbots falantes.',
        'Critérios Rígidos de Discovery: Aplique filtros de corte antes de iniciar qualquer projeto de IA — se o problema pode ser resolvido com código determinístico, resolva com código determinístico.'
      ],
      officialGuides: [
        {
          title: 'Gestão de produtos com IA: estratégia, discovery e métricas',
          url: 'https://www.produtocomia.com.br/guias/gestao-de-produtos-com-ia/',
          description: 'Use inteligência artificial no discovery, roadmap e operação de produto com um método que preserva contexto, evidência e responsabilidade.'
        },
        {
          title: 'Conceito: O que é Agent Washing',
          url: 'https://www.produtocomia.com.br/conceitos/o-que-e-agent-washing',
          description: 'Termo cunhado para descrever produtos vendidos como agentes de IA autônomos que na prática são meros chatbots ou scripts engessados.'
        }
      ]
    }
  }
];
