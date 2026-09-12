export interface ToolDetail {
  id: string;
  name: string;
  category: 'pesquisa' | 'segundo_cerebro' | 'alinhamento' | 'execucao';
  roleInPMSuit: string;
  tagline: string;
  badge: string;
  whyUse: string;
  howToIntegrate: string;
  practicalUseCases: {
    title: string;
    description: string;
    stepByStep: string[];
  }[];
  proTip: string;
  promptOrConfigTemplate?: {
    title: string;
    filename?: string;
    code: string;
  };
}

export interface WorkflowPlaybook {
  id: string;
  title: string;
  subtitle: string;
  objective: string;
  duration: string;
  toolsInvolved: string[];
  stages: {
    stageNumber: number;
    toolName: string;
    action: string;
    output: string;
  }[];
  pmGoldenRule: string;
}

export const TOOLCHAIN_LIST: ToolDetail[] = [
  {
    id: 'notebooklm',
    name: 'NotebookLM (Google)',
    category: 'pesquisa',
    badge: 'GROUNDED RESEARCH',
    tagline: 'Análise de dados não estruturados fundamentada estritamente em fontes verificadas, com citações exatas e zero alucinação.',
    roleInPMSuit: 'O Laboratório de Discovery e Síntese de Evidências do PM.',
    whyUse: 'Modelos genéricos inventam respostas quando recebem documentos longos. O NotebookLM cria um "espaço isolado" (grounded) baseado apenas nos PDFs, gravações de clientes e relatórios que você envia, citando a linha e página exata de onde tirou cada conclusão.',
    howToIntegrate: 'Alimente o notebook com transcrições de entrevistas de clientes do Gong/Google Meet, relatórios financeiros de concorrentes e regulamentações (ex: BACEN/LGPD). Exporte os resumos consolidados diretamente para o Obsidian ou Notion.',
    practicalUseCases: [
      {
        title: 'Clusterização de 30 Entrevistas de Clientes (Customer Discovery)',
        description: 'Em vez de gastar 20 horas ouvindo gravações, suba os arquivos de áudio ou transcrições para um mesmo caderno.',
        stepByStep: [
          'Suba os 30 arquivos de transcrição do Gong/Meet para o NotebookLM.',
          'Execute a query: "Identifique as 5 dores mais recorrentes sobre a etapa de checkout, indicando quem falou e o minuto exato."',
          'Gere o relatório de "Estudo de Caso" ou o resumo executivo em áudio (Deep Dive) para compartilhar com stakeholders no Slack.'
        ]
      },
      {
        title: 'Auditoria Regulatória de IA sem Risco de Erro',
        description: 'Faça upload de marcos regulatórios (ex: EU AI Act ou Resoluções do Banco Central) para checar conformidade da feature.',
        stepByStep: [
          'Adicione a íntegra da resolução regulatória como fonte.',
          'Pergunte: "Quais são as obrigações específicas para sistemas de scoring de crédito com decisão automatizada?"',
          'Clique nas notas de rodapé para validar o trecho exato da lei antes de redigir os requisitos no Notion.'
        ]
      }
    ],
    proTip: 'Use o recurso de "Áudio Deep Dive" do NotebookLM para transformar documentos densos de arquitetura em podcasts de 8 minutos para ouvir a caminho do trabalho ou alinhar diretores antes de uma reunião de comitê.',
    promptOrConfigTemplate: {
      title: 'Prompt Mestre para Análise de Transcrições de Usuários',
      code: `Você é um Lead Product Manager focado em extrair dores reais de clientes sem viés de confirmação.
Com base EXCLUSIVAMENTE nas fontes fornecidas:
1. Agrupe as citações dos usuários em 3 categorias: (A) Bloqueios Críticos de Fluxo, (B) Desejos Expressos e (C) Dores Ocultas (não ditas diretamente, mas deduzidas pelo comportamento).
2. Para cada dor, liste o nome do cliente e a citação textual exata com referência de fonte.
3. Classifique a frequência e a intensidade emocional (Baixa, Média, Alta).
4. NÃO infira nada além dos dados fornecidos.`
    }
  },
  {
    id: 'genspark',
    name: 'Genspark (AI Autonomous Search)',
    category: 'pesquisa',
    badge: 'DEEP RESEARCH',
    tagline: 'Mecanismo autônomo de busca e síntese que gera Sparkpages interativas sobre mercados, concorrentes e fornecedores de IA.',
    roleInPMSuit: 'O Radar de Inteligência de Mercado e Benchmarking Contínuo.',
    whyUse: 'Mecanismos de busca tradicionais priorizam páginas otimizadas para SEO patrocinadas. O Genspark orquestra agentes autônomos que leem dezenas de fontes em paralelo, comparam prós/contras, preços e opiniões reais de desenvolvedores no Reddit e GitHub, gerando uma "Sparkpage" consolidada.',
    howToIntegrate: 'Use o Genspark para iniciar o discovery de novas verticais ou comparar fornecedores de modelos (ex: custos de inferência da Together AI vs Bedrock vs Groq). Salve a Sparkpage como PDF ou Markdown no Obsidian.',
    practicalUseCases: [
      {
        title: 'Benchmark Competitivo de Soluções com Agentes',
        description: 'Descubra como os principais concorrentes globais implementaram agentes em seus produtos.',
        stepByStep: [
          'Pesquise: "Detailed breakdown of how Shopify, Klarna and Stripe implement AI agents in production: architecture, latency, user complaints".',
          'O Genspark gera uma Sparkpage com tabelas comparativas, reclamações de usuários e métricas declaradas.',
          'Identifique falhas nas soluções concorrentes para transformar em diferenciais na sua PRD.'
        ]
      }
    ],
    proTip: 'Sempre que sua squad for decidir um novo provedor de infraestrutura de IA, peça ao Genspark para comparar "Developer sentiment and production downtime post-mortems" das opções analisadas.',
    promptOrConfigTemplate: {
      title: 'Query Estruturada para Análise Competitiva no Genspark',
      code: `Comprehensive competitive teardown of [NOME DO MERCADO/PRODUTO]:
- Top 5 market players and their AI features
- User friction points and negative reviews on Reddit, G2 and Trustpilot
- Pricing model (consumption-based vs seat-based)
- Underlying model architecture and reported latency/reliability issues
- Summary table with strengths, weaknesses, and underserved customer segments`
    }
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    category: 'segundo_cerebro',
    badge: 'PERSONAL SECOND BRAIN',
    tagline: 'O cofre pessoal do PM em Markdown puro, local, offline-first e com grafos bidirecionais de hipóteses de produto.',
    roleInPMSuit: 'O Santuário de Raciocínio, Hipóteses e Conexões do PM.',
    whyUse: 'O Notion é compartilhado com a equipe, o que inibe rascunhos crus e anotações inconclusivas. O Obsidian é o espaço pessoal privado onde o PM constrói seu Segundo Cérebro: notas atômicas que se conectam ao longo dos meses através de links bidirecionais (`[[conceito]]`).',
    howToIntegrate: 'Mantenha um vault sincronizado via Git. Use o plugin Obsidian Canvas para desenhar diagramas de fluxo de agentes de IA e o plugin Dataview para rastrear hipóteses de testes e decisões de FinOps.',
    practicalUseCases: [
      {
        title: 'Criação do Diário de Decisões de Produto (Decision Log)',
        description: 'Em sistemas estocásticos de IA, registrar POR QUE você tomou uma decisão e quais eram as premissas é vital para post-mortems futuros.',
        stepByStep: [
          'Crie uma nota com template `decision-log-[data]-[feature]`.',
          'Vincule aos conceitos com colchetes duplos: `[[FinOps]]`, `[[Release-Gate]]`, `[[Claude-3.5-Sonnet]]`.',
          'Quando um incidente ocorrer 3 meses depois, o grafo de conhecimento revelará instantaneamente todas as suposições antigas.'
        ]
      }
    ],
    proTip: 'Use o plugin "Smart Connections" no Obsidian para rodar embeddings locais nas suas notas pessoais e encontrar conexões automáticas entre entrevistas de clientes realizadas há 1 ano e o problema atual.',
    promptOrConfigTemplate: {
      title: 'Template de Nota Atômica de Decisão de Produto (Obsidian)',
      filename: 'templates/decision-log.md',
      code: `---
tipo: decisao_produto
data: <% tp.date.now("YYYY-MM-DD") %>
status: [ativo | em_validacao | obsoleto]
tags:
  - produto/decisao
  - ia/arquitetura
---
# Decisão: <% tp.file.title %>

## 1. Contexto & Problema
- O que motivou esta mudança?
- Referências: [[<% tp.file.cursor() %>]]

## 2. Trade-offs Analisados
| Opção | Prós | Contras | Custo/Task Est. |
|---|---|---|---|
| Opção A | ... | ... | $... |
| Opção B | ... | ... | $... |

## 3. Decisão Final & Racional
- Escolha:
- Por que rejeitamos as alternativas?

## 4. Critério de Falsificabilidade (O que provaria que estávamos errados?)
- Métrica de gatilho para reversão: Se churn > X% ou latência p95 > Ys.`
    }
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'alinhamento',
    badge: 'TEAM WORKSPACE',
    tagline: 'O sistema operacional da squad: PRDs executáveis, roadmaps probabilísticos e bases relacionais integradas com IA.',
    roleInPMSuit: 'A Fonte Única de Verdade da Squad (Single Source of Truth).',
    whyUse: 'O Notion é onde o pensamento privado do Obsidian é transformado em contratos públicos de alinhamento com Engenharia, Design e Liderança. Suas bases de dados relacionais permitem conectar cada épico a métricas de negócio e post-mortems de IA.',
    howToIntegrate: 'Configure o Notion MCP (Model Context Protocol) para permitir que agentes de IA leiam e atualizem PRDs automaticamente, mantendo a documentação sincronizada com o código.',
    practicalUseCases: [
      {
        title: 'PRD Viva de Agente de IA com Status em Tempo Real',
        description: 'Uma PRD moderna de IA não é estática: ela contém links para o Golden Dataset de Evals e histórico de experimentos.',
        stepByStep: [
          'Crie um banco de dados relacional: "Funcionalidades de IA".',
          'Vincule as propriedades: Modelo Base, Custo Teto por Tarefa, Latência Máxima, Hard Gates de Release e Nível de Alçada Humana.',
          'Use o Notion AI para gerar resumos de lançamento para a equipe de Marketing e Suporte.'
        ]
      }
    ],
    proTip: 'Integre o Notion com o GitHub via webhook: quando um Coding Agent altera a especificação de uma ferramenta no repositório, o Notion atualiza automaticamente a tabela de contratos da PRD.',
    promptOrConfigTemplate: {
      title: 'Estrutura de Propriedades Essenciais para Database de Features de IA no Notion',
      code: `Propriedades recomendadas para a tabela "IA Features Hub" no Notion:
1. Feature Name (Title)
2. Squad / PM Owner (Person)
3. Status de Produção (Select: Discovery, Evals Lab, Beta Fechado, Rollout 100%)
4. Custo Alvo / Task USD (Number - Currency)
5. Custo Real Atual USD (Number - Calculado via API/Ledger)
6. Latência Alvo p95 (Number - ms)
7. Modelo Provedor (Select: GPT-4o, Claude 3.5 Sonnet, Gemini Flash, Local SLM)
8. Nível de Autonomia (Select: Tier 1 Read-only, Tier 2 Soft-action, Tier 3 High-risk HITL)
9. Golden Dataset URL (URL para suite de evals)`
    }
  },
  {
    id: 'antigravity',
    name: 'Google Antigravity (AGY)',
    category: 'execucao',
    badge: 'AGENTIC ORCHESTRATION',
    tagline: 'Ambiente de desenvolvimento e orquestração agêntica de ponta: subagents autônomos, tarefas em background, skills personalizadas e governança por rules.',
    roleInPMSuit: 'O Co-piloto Executivo e Squad Agêntica do PM.',
    whyUse: 'Diferente de simples janelas de chat, o Antigravity opera diretamente no repositório do produto. Permite disparar subagents de pesquisa em paralelo, delegar tarefas longas em background (`schedule`), governar o comportamento da IA com `.agent/rules` e customizar ferramentas via Skills.',
    howToIntegrate: 'Crie skills de PM (ex: analisador de PRDs, gerador de Golden Datasets, verificador de FinOps). Use o comando `/plan` para decompor iniciativas complexas e `/grill-me` para testar a solidez de suas decisões antes de conversar com os diretores.',
    practicalUseCases: [
      {
        title: 'Validação de Consistência de PRD com `/plan` e `/grill-me`',
        description: 'Submeta sua especificação ao Antigravity e peça para ele atuar como um Tech Lead sênior hostil desafiando suas premissas.',
        stepByStep: [
          'Abra o Antigravity CLI ou IDE e selecione o repositório do produto.',
          'Execute a skill de análise com `/grill-me` apontando para sua nova PRD.',
          'O Antigravity fará 5 perguntas afiadas sobre gargalos de concorrência, latência e custo que você não havia previsto.',
          'Ajuste a PRD antes da reunião de refinamento.'
        ]
      },
      {
        title: 'Disparo de Subagents Paralelos para Provas de Conceito (PoCs)',
        description: 'Enquanto você redige a documentação, um subagent pesquisa repositórios abertos de modelos e outro gera o schema de testes.',
        stepByStep: [
          'Dispare um subagent `research` para mapear benchmarks de acurácia de modelos no Hugging Face.',
          'Dispare um subagent `self` em modo isolado de branch para montar o Golden Dataset de 100 casos.',
          'Receba a notificação proativa quando ambos concluírem sem bloquear seu fluxo.'
        ]
      }
    ],
    proTip: 'Adicione uma regra permanente no `.agent/rules` instruindo todos os agentes da squad a nunca adicionarem uma chamada a modelo frontier sem antes registrar o cálculo de custo por tarefa e os limites de token.',
    promptOrConfigTemplate: {
      title: 'Arquivo de Governança de Produto para Antigravity (.agent/rules)',
      filename: '.agent/rules/ai-pm-governance.md',
      code: `---
description: Regras inegociáveis de engenharia de produto com IA para o time
globs: "**/*"
---
# Regras de Produto e Engenharia de IA

1. Nenhuma nova chamada a LLM/SLM deve ser adicionada sem schema de entrada e saída estrito (JSON Schema ou Pydantic).
2. Todo agente autônomo com acesso a ferramentas de efeito externo (banco de dados, envio de e-mail, pagamento) DEVE conter:
   - Parâmetro max_steps configurado para teto de 3 iterações.
   - Kill-switch mapeado para variável de ambiente de feature flag.
   - Chave de idempotência única por requisição.
3. Se a latência estimada da chamada exceder 2 segundos, a interface de usuário deve obrigatoriamente implementar streaming de tokens e mensagem de estado transitório.`
    }
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: 'execucao',
    badge: 'TERMINAL AGENTIC CODING',
    tagline: 'Agente autônomo de terminal com raciocínio profundo para navegar codebases complexas, inspecionar APIs e executar tarefas de código.',
    roleInPMSuit: 'O Inspetor Técnico e Construtor de Protótipos no Terminal.',
    whyUse: 'Para o PM moderno, não basta "escrever textos" e esperar que a engenharia entregue. Com o Claude Code no terminal, o PM pode clonar o repositório, inspecionar como as chamadas de API estão sendo feitas, verificar se as métricas de telemetria foram implementadas e criar protótipos funcionais para testes com usuários em minutos.',
    howToIntegrate: 'Instale o Claude Code via npm (`npm install -g @anthropic-ai/claude-code`). Configure o arquivo `CLAUDE.md` na raiz do projeto com as diretrizes de produto e padrões de código da squad.',
    practicalUseCases: [
      {
        title: 'Auditoria de Telemetria e Logs da Squad',
        description: 'Verifique se a squad realmente implementou o tracking de latência e custo que foi combinado na PRD.',
        stepByStep: [
          'Abra o terminal no repositório da aplicação e execute `claude`.',
          'Comande: "Inspecione o arquivo do orquestrador de agentes e verifique se o logger de tokens de entrada e saída está ativo."',
          'O Claude Code analisa o código, aponta se há vazamento de dados sensíveis e sugere a correção exata via Pull Request.'
        ]
      }
    ],
    proTip: 'Use o Claude Code para rodar os testes de Evals antes da reunião de release: `claude "execute a suíte de evals em tests/evals e gere um resumo markdown com a taxa de acerto por categoria"`.',
    promptOrConfigTemplate: {
      title: 'Arquivo de Orientação de Produto para Claude Code (CLAUDE.md)',
      filename: 'CLAUDE.md',
      code: `# DIRETRIZES DE PRODUTO & ARQUITETURA — CLAUDE CODE

## Filosofia da Squad
- Somos uma squad AI-First com foco estrito em unit economics sustentáveis.
- Priorize sempre Small Models e cache determinístico antes de escalar para modelos de alto custo.

## Comandos Rápidos de Validação
- Rodar Evals: npm run test:evals
- Checar Linters: npm run lint
- Simular Custo por Tarefa: npm run finops:ledger

## Critérios de Qualidade para PRs
- Nenhuma função probabilística pode subir sem tratamento de fallback gracioso (timeout e circuit breaker).`
    }
  },
  {
    id: 'codex-cursor',
    name: 'Codex / Cursor & APIs',
    category: 'execucao',
    badge: 'RAPID PROTOTYPING',
    tagline: 'Geração rápida de scripts de dados, transformações de logs, queries SQL complexas e MVPs interativos.',
    roleInPMSuit: 'A Ferramenta de Análise Quantitativa e Síntese de Protótipos.',
    whyUse: 'Frequentemente o PM precisa extrair insights de bases gigantescas de dados de produção (ex: 200.000 chamadas de API com payloads de JSON complexos). Modelos como o OpenAI Codex e IDEs assistidas como o Cursor permitem escrever scripts em Python/DuckDB em segundos para decodificar comportamentos e encontrar anomalias.',
    howToIntegrate: 'Utilize extensões de chat com contexto de repositório e configure regras `.cursorrules` para padronizar protótipos rápidos de UI.',
    practicalUseCases: [
      {
        title: 'Análise Forense de Falhas de Prompts em Produção',
        description: 'Processe 5.000 requisições com erro para encontrar padrões sem precisar esperar a fila do time de BI.',
        stepByStep: [
          'Exporte o CSV/JSON de logs de erro do CloudWatch/Datadog.',
          'Peça ao Cursor/Codex: "Escreva um script DuckDB para agrupar os erros de tool calling por nome de ferramenta e tamanho do prompt."',
          'Gere o gráfico de distribuição em 3 minutos e anexe diretamente à PRD no Notion.'
        ]
      }
    ],
    proTip: 'Crie uma biblioteca de prompts SQL salvos para que você possa consultar tabelas analíticas de consumo de tokens com consultas de agregação sem sobrecarregar a engenharia de dados.',
    promptOrConfigTemplate: {
      title: 'Regras de Prototipagem Rápida (.cursorrules)',
      filename: '.cursorrules',
      code: `You are an assistant to a Lead AI Product Manager.
When generating prototype code:
1. Always build fully functional, self-contained single-page apps (React + Tailwind).
2. Include visible telemetry indicators (Latency, Cost per prompt, Tokens consumed).
3. Implement fallback UI states for slow responses or API failures.
4. Keep dependencies minimal.`
    }
  }
];

export const WORKFLOW_PLAYBOOKS: WorkflowPlaybook[] = [
  {
    id: 'playbook-discovery-to-spec',
    title: 'Playbook 1: Da Entrevista de Cliente à Spec Executável em 1 Dia',
    subtitle: 'Como transformar horas de conversas gravadas em uma especificação de IA pronta para a engenharia.',
    objective: 'Eliminar semanas de transcrição manual e interpretações subjetivas, gerando uma PRD com schemas verificáveis.',
    duration: '~4 a 6 horas',
    toolsInvolved: ['Google Meet / Gong', 'NotebookLM', 'Obsidian', 'Notion', 'Antigravity'],
    stages: [
      {
        stageNumber: 1,
        toolName: 'NotebookLM',
        action: 'Faça upload das transcrições de 10 a 20 entrevistas de clientes da sprint. Extraia as dores mais recorrentes com citação exata de fonte.',
        output: 'Dossiê de evidências com trechos comprovados e áudio deep dive de 10 minutos.'
      },
      {
        stageNumber: 2,
        toolName: 'Obsidian',
        action: 'Abra seu cofre privado. Conecte as dores extraídas aos conceitos arquiteturais existentes ([[FinOps]], [[RAG]], [[Autonomia]]). Formule 3 hipóteses de solução com trade-offs.',
        output: 'Nota atômica de raciocínio de produto com matriz de trade-offs.'
      },
      {
        stageNumber: 3,
        toolName: 'Notion',
        action: 'Transfira a hipótese validada para a base oficial da squad. Preencha o template de PRD com alçadas de autonomia (Tier 1 a 3), teto de custo por tarefa e SLOs de latência.',
        output: 'PRD formal publicada e compartilhada com Design e Engenharia.'
      },
      {
        stageNumber: 4,
        toolName: 'Antigravity',
        action: 'No terminal/IDE, rode o comando `/grill-me` contra a PRD do Notion para encontrar vulnerabilidades técnicas antes do refinamento com os desenvolvedores.',
        output: 'Especificação blindada contra furos de arquitetura e casos de borda.'
      }
    ],
    pmGoldenRule: 'Informação não citada é achismo. O NotebookLM dá o embasamento; o Antigravity dá a consistência técnica.'
  },
  {
    id: 'playbook-competitive-intelligence',
    title: 'Playbook 2: Radar Competitivo & Análise Regulatória Autônoma',
    subtitle: 'Mapeamento contínuo de movimentações de mercado e novos modelos de IA sem viés de marketing.',
    objective: 'Manter a estratégia de produto sempre à frente dos concorrentes e em total conformidade jurídica.',
    duration: '~2 a 3 horas semanais',
    toolsInvolved: ['Genspark', 'NotebookLM', 'Obsidian', 'Notion'],
    stages: [
      {
        stageNumber: 1,
        toolName: 'Genspark',
        action: 'Dispare pesquisa profunda autônoma: analise 4 concorrentes diretos, buscando reclamações reais de usuários e novos lançamentos de agentes.',
        output: 'Sparkpage interativa com tabelas comparativas de preços, modelos e dores de clientes.'
      },
      {
        stageNumber: 2,
        toolName: 'NotebookLM',
        action: 'Suba o PDF da Sparkpage juntamente com as leis ou regulamentos do setor (ex: Banco Central, CVM, HIPAA, GDPR).',
        output: 'Matriz cruzada indicando onde os concorrentes violam ou atendem requisitos de compliance.'
      },
      {
        stageNumber: 3,
        toolName: 'Obsidian & Notion',
        action: 'Sintetize no Obsidian os pontos de diferenciação estratégica e atualize o Radar Competitivo compartilhado da empresa no Notion.',
        output: 'Item de roadmap defensável com justificativa competitiva incontestável para a diretoria.'
      }
    ],
    pmGoldenRule: 'Não copie features dos concorrentes: use o Genspark para descobrir do que os clientes deles estão reclamando e construa a solução certa.'
  },
  {
    id: 'playbook-prototype-validation',
    title: 'Playbook 3: Prototipagem & Validação Técnica de IA em 2 Horas',
    subtitle: 'Como o AI PM valida se uma ideia é viável antes de comprometer a sprint da equipe de engenharia.',
    objective: 'Eliminar o desperdício de sprints construindo protótipos interativos funcionais para teste com usuários.',
    duration: '~2 horas',
    toolsInvolved: ['Notion Spec', 'Antigravity / Claude Code', 'Codex', 'Localhost / Vercel'],
    stages: [
      {
        stageNumber: 1,
        toolName: 'Notion Spec',
        action: 'Escreva a especificação resumida com schema JSON de entrada e saída e o prompt de sistema calibrado.',
        output: 'Arquivo de especificação executável (Spec Kit).'
      },
      {
        stageNumber: 2,
        toolName: 'Claude Code / Antigravity',
        action: 'No terminal, execute o agente com a instrução: "Com base na spec, gere um protótipo web completo com React, Tailwind e chamada direta à API com telemetria de latência visível."',
        output: 'Aplicação web funcional rodando localmente em menos de 15 minutos.'
      },
      {
        stageNumber: 3,
        toolName: 'Teste com Usuários',
        action: 'Conduza um teste de usabilidade rápido com 3 clientes reais. Meça a reação à latência das respostas e valide se a interface conversacional faz sentido ou se botões seriam melhores.',
        output: 'Evidência empírica antes de escrever uma única linha no Jira da squad.'
      }
    ],
    pmGoldenRule: 'Um protótipo que você constrói em 2 horas vale mais do que 10 reuniões conceituais com a engenharia.'
  },
  {
    id: 'playbook-incident-postmortem',
    title: 'Playbook 4: Observabilidade de IA & Post-Mortem de Incidentes',
    subtitle: 'Como responder a falhas de modelos em produção e retroalimentar as regras dos agentes.',
    objective: 'Evitar que o mesmo erro de alucinação ou estouro de orçamento aconteça duas vezes.',
    duration: '~1 a 2 horas pós-incidente',
    toolsInvolved: ['Logs de Telemetria', 'Codex / DuckDB', 'Obsidian', 'Notion Database', 'Antigravity Rules'],
    stages: [
      {
        stageNumber: 1,
        toolName: 'Codex / Python',
        action: 'Analise o dump de logs do incidente. Isole as 100 requisições que causaram o loop anômalo ou a alucinação.',
        output: 'Tabela de causa-raiz e identificação exata dos prompts que violaram as premissas.'
      },
      {
        stageNumber: 2,
        toolName: 'Obsidian',
        action: 'Abra a nota de decisão original da feature e registre o desvio observado contra a hipótese inicial.',
        output: 'Registro de aprendizado pessoal com links para as tags do sistema.'
      },
      {
        stageNumber: 3,
        toolName: 'Notion Incident Log',
        action: 'Publique o Post-Mortem oficial da squad com: Impacto Financeiro, Causa-Raiz, Plano de Ação e Reconciliação com Clientes Afetados.',
        output: 'Documentação institucional auditável e transparente.'
      },
      {
        stageNumber: 4,
        toolName: 'Antigravity (.agent/rules)',
        action: 'Adicione os casos que falharam ao Golden Dataset de Evals e atualize o arquivo `.agent/rules` para que nenhum Coding Agent da squad possa remover os guardrails recém-criados.',
        output: 'Proteção permanente contra regressão em nível de repositório.'
      }
    ],
    pmGoldenRule: 'Em sistemas estocásticos, falhas são inevitáveis. O que define a maturidade do AI PM é o tempo de contenção e a garantia de que o mesmo caso nunca mais passará no Release Gate.'
  }
];
