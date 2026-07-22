import type { Topic } from '../types';

export const topics: Topic[] = [
  {
    id: 'inteligencia-artificial',
    slug: { 'pt-BR': 'inteligencia-artificial', 'en': 'artificial-intelligence' },
    name: { 'pt-BR': 'Inteligência Artificial', 'en': 'Artificial Intelligence' },
    description: {
      'pt-BR':
        'Análises, cases e radar de notícias sobre inteligência artificial para product managers e líderes de produto. Cobrimos modelos frontier, agentes autônomos, governança, FinOps e adoção de IA em produtos de tecnologia e fintech.',
      'en': 'Analysis, case studies, and news radar on artificial intelligence for product managers and product leaders. We cover frontier models, autonomous agents, governance, FinOps, and AI adoption in technology and fintech products.',
    },
    shortDescription: {
      'pt-BR': 'Modelos, agentes, governança e adoção de IA em produto.',
      'en': 'Models, agents, governance, and AI adoption in product.',
    },
    keywords: {
      'pt-BR': ['inteligência artificial', 'IA', 'AI', 'produtos de IA', 'IA em produto', 'inteligência artificial para empresas', 'IA corporativa'],
      'en': ['artificial intelligence', 'AI', 'AI products', 'AI in product', 'enterprise AI', 'AI for business', 'corporate AI'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'O que é inteligência artificial no contexto de produto?',
          'en': 'What is artificial intelligence in the context of product?',
        },
        answer: {
          'pt-BR': 'Inteligência artificial no contexto de produto é o uso de modelos de aprendizado de máquina — especialmente LLMs — embutidos em funcionalidades que resolvem problemas reais dos usuários. Não se trata de IA como produto isolado, mas como capacidade que melhora fluxos existentes: automação de análise documental, triagem inteligente, geração de conteúdo e suporte a decisão.',
          'en': 'Artificial intelligence in the context of product is the use of machine learning models — especially LLMs — embedded in features that solve real user problems. It is not about AI as an isolated product, but as a capability that improves existing workflows: document analysis automation, intelligent triage, content generation, and decision support.',
        },
      },
      {
        question: {
          'pt-BR': 'Como product managers deveriam avaliar IA para seus produtos?',
          'en': 'How should product managers evaluate AI for their products?',
        },
        answer: {
          'pt-BR': 'PMs devem avaliar IA por três lentes: viabilidade técnica (o modelo resolve o problema com a acurácia necessária?), viabilidade de negócio (o unit economics fecha com o custo de tokens e infraestrutura?) e viabilidade operacional (existe governança, revisão humana e processo definido para escalar?). O erro mais comum é olhar só a primeira lente.',
          'en': 'PMs should evaluate AI through three lenses: technical feasibility (does the model solve the problem with the required accuracy?), business viability (do unit economics work with token and infrastructure costs?), and operational viability (is there governance, human review, and a defined process to scale?). The most common mistake is looking only at the first lens.',
        },
      },
      {
        question: {
          'pt-BR': 'Qual o custo médio de implementar IA em um produto?',
          'en': 'What is the average cost of implementing AI in a product?',
        },
        answer: {
          'pt-BR': 'O custo varia drasticamente conforme o caso de uso. Chamadas de LLM podem custar frações de centavo por requisição, mas escalar para toda a base de usuários pode chegar a dezenas de milhares de dólares por mês em tokens. O case da Lovable mostra US$ 85 mil em tokens para escalar coding agents. A pergunta certa não é quanto custa implementar, mas quanto valor cada chamada gera.',
          'en': 'Costs vary dramatically depending on the use case. LLM calls can cost fractions of a cent per request, but scaling to the entire user base can reach tens of thousands of dollars per month in tokens. The Lovable case shows $85K in tokens to scale coding agents. The right question is not how much it costs to implement, but how much value each call generates.',
        },
      },
    ],
  },
  {
    id: 'agentes-de-ia',
    slug: { 'pt-BR': 'agentes-de-ia', 'en': 'ai-agents' },
    name: { 'pt-BR': 'Agentes de IA', 'en': 'AI Agents' },
    description: {
      'pt-BR': 'Frameworks, casos de uso e alertas sobre agentes de IA autônomos. Cobrimos coding agents, agentes de voz, agent gateways, agent washing e tudo que um product manager precisa saber para decidir quando usar agentes no produto.',
      'en': 'Frameworks, use cases, and alerts about autonomous AI agents. We cover coding agents, voice agents, agent gateways, agent washing, and everything a product manager needs to know to decide when to use agents in their product.',
    },
    shortDescription: {
      'pt-BR': 'Frameworks, cases e riscos de agentes autônomos.',
      'en': 'Frameworks, case studies, and risks of autonomous agents.',
    },
    keywords: {
      'pt-BR': ['agentes de IA', 'AI agents', 'agentes autônomos', 'coding agents', 'agent gateway', 'agent washing', 'agentes de inteligência artificial'],
      'en': ['AI agents', 'autonomous agents', 'agentic AI', 'coding agents', 'agent gateway', 'agent washing', 'AI agent frameworks'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'O que são agentes de IA?',
          'en': 'What are AI agents?',
        },
        answer: {
          'pt-BR': 'Agentes de IA são sistemas que usam LLMs não apenas para gerar texto, mas para tomar decisões, chamar ferramentas, executar ações e iterar sobre um objetivo. Diferente de um chatbot que responde perguntas, um agente pode navegar sistemas, editar arquivos, fazer chamadas de API e coordenar múltiplas etapas de um workflow.',
          'en': 'AI agents are systems that use LLMs not just to generate text, but to make decisions, call tools, execute actions, and iterate toward a goal. Unlike a chatbot that answers questions, an agent can navigate systems, edit files, make API calls, and coordinate multiple steps of a workflow.',
        },
      },
      {
        question: {
          'pt-BR': 'O que é agent washing?',
          'en': 'What is agent washing?',
        },
        answer: {
          'pt-BR': 'Agent washing é um termo cunhado pela Gartner para descrever produtos vendidos como "agentes de IA" que na prática são apenas lógica condicional (if/else) com uma camada superficial de LLM. O risco para PMs é investir em "agentes" que não têm capacidade real de autônoma de decisão e iteração.',
          'en': 'Agent washing is a term coined by Gartner to describe products sold as "AI agents" that are in practice just conditional logic (if/else) with a superficial LLM layer. The risk for PMs is investing in "agents" that lack real autonomous decision-making and iteration capabilities.',
        },
      },
      {
        question: {
          'pt-BR': 'Quando vale a pena usar agentes de IA no produto?',
          'en': 'When is it worth using AI agents in a product?',
        },
        answer: {
          'pt-BR': 'Agentes fazem sentido quando o workflow tem variabilidade alta (não dá para codificar todos os caminhos), requer múltiplas ferramentas integradas e tolera iteração com verificação humana. Se o processo é determinístico e repetitivo, automação tradicional é mais barata e confiável.',
          'en': 'Agents make sense when the workflow has high variability (you cannot codify every path), requires multiple integrated tools, and tolerates iteration with human verification. If the process is deterministic and repetitive, traditional automation is cheaper and more reliable.',
        },
      },
    ],
  },
  {
    id: 'modelos-de-ia',
    slug: { 'pt-BR': 'modelos-de-ia', 'en': 'ai-models' },
    name: { 'pt-BR': 'Modelos de IA', 'en': 'AI Models' },
    description: {
      'pt-BR': 'Análises comparativas de modelos frontier: GPT-5.6, Claude Fable 5, Grok 4.5, GLM-5.2 e mais. Benchmark, custo, disponibilidade e implicações para decisões de stack de produto.',
      'en': 'Comparative analysis of frontier models: GPT-5.6, Claude Fable 5, Grok 4.5, GLM-5.2 and more. Benchmarks, cost, availability, and implications for product stack decisions.',
    },
    shortDescription: {
      'pt-BR': 'Análises de modelos frontier, custo e benchmarks.',
      'en': 'Frontier model analysis, cost, and benchmarks.',
    },
    keywords: {
      'pt-BR': ['modelos de IA', 'LLM', 'GPT-5.6', 'Claude Fable 5', 'Grok 4.5', 'GLM-5.2', 'modelos de linguagem', 'frontier models'],
      'en': ['AI models', 'LLM', 'GPT-5.6', 'Claude Fable 5', 'Grok 4.5', 'GLM-5.2', 'language models', 'frontier models'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Qual o melhor modelo de IA para produto em 2026?',
          'en': 'What is the best AI model for product in 2026?',
        },
        answer: {
          'pt-BR': 'Não existe "melhor modelo" universal. A escolha depende do caso de uso, custo tolerável, latência exigida e requisitos de segurança. A Shopify mostrou que modelos pequenos destilados podem superar modelos grandes em tarefas específicas a 30x menos custo. A recomendação é testar com dados reais do seu produto, não com benchmarks genéricos.',
          'en': 'There is no universal "best model." The choice depends on use case, tolerable cost, required latency, and security requirements. Shopify showed that distilled small models can outperform large models on specific tasks at 30x lower cost. The recommendation is to test with real data from your product, not with generic benchmarks.',
        },
      },
      {
        question: {
          'pt-BR': 'Vale a pena migrar de modelo a cada lançamento?',
          'en': 'Is it worth switching models with every release?',
        },
        answer: {
          'pt-BR': 'Raramente. Migrar modelo envolve retrabalhar prompts, validar integrações, testar regressões e ajustar custos. O ganho marginal entre gerações costuma ser pequeno para a maioria dos casos de uso. Avalie estabilidade, custo real e ganho mensurável antes de trocar.',
          'en': 'Rarely. Migrating models involves reworking prompts, validating integrations, testing for regressions, and adjusting costs. The marginal gain between generations is usually small for most use cases. Evaluate stability, real cost, and measurable improvement before switching.',
        },
      },
      {
        question: {
          'pt-BR': 'Como avaliar a qualidade de um modelo de IA?',
          'en': 'How to evaluate the quality of an AI model?',
        },
        answer: {
          'pt-BR': 'Não confie cegamente em rankings públicos. A OpenAI encontrou cerca de 30% das tarefas do SWE-Bench Pro quebradas. Avalie com dados do seu próprio produto, meça acurácia na sua tarefa específica, monitore regressões em produção e considere custo total, não só capacidade máxima.',
          'en': 'Do not blindly trust public rankings. OpenAI found about 30% of SWE-Bench Pro tasks were broken. Evaluate with your own product data, measure accuracy on your specific task, monitor regressions in production, and consider total cost, not just maximum capability.',
        },
      },
    ],
  },
  {
    id: 'coding-agents',
    slug: { 'pt-BR': 'coding-agents', 'en': 'coding-agents' },
    name: { 'pt-BR': 'Coding Agents', 'en': 'Coding Agents' },
    description: {
      'pt-BR': 'Cases reais de escala de agentes de codificação: Lovable, Codex, Claude Code, SWE-1.7. Custos de tokens, governança de PRs, classificação de risco e o que significa para produtividade de engenharia.',
      'en': 'Real-world scaling cases of coding agents: Lovable, Codex, Claude Code, SWE-1.7. Token costs, PR governance, risk classification, and what it means for engineering productivity.',
    },
    shortDescription: {
      'pt-BR': 'Escala, custo e governança de agentes de código.',
      'en': 'Scale, cost, and governance of code agents.',
    },
    keywords: {
      'pt-BR': ['coding agents', 'agentes de codificação', 'Claude Code', 'Codex', 'SWE-1.7', 'Lovable', 'AI coding', 'automação de engenharia'],
      'en': ['coding agents', 'Claude Code', 'Codex', 'SWE-1.7', 'Lovable', 'AI coding', 'engineering automation', 'code generation agents'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Quanto custa escalar coding agents?',
          'en': 'How much does it cost to scale coding agents?',
        },
        answer: {
          'pt-BR': 'A Lovable reportou US$ 85 mil em tokens desde janeiro para escalar de 20-30 para 150+ pull requests por semana. Simon Willison gastou US$ 149,25 em tokens para escrever sqlite-utils 4.0 majoritariamente com IA. O custo varia conforme volume, modelo e complexidade das tarefas.',
          'en': 'Lovable reported $85K in tokens since January to scale from 20-30 to 150+ pull requests per week. Simon Willison spent $149.25 in tokens to write sqlite-utils 4.0 primarily with AI. Cost varies depending on volume, model, and task complexity.',
        },
      },
      {
        question: {
          'pt-BR': 'Como governar coding agents em produção?',
          'en': 'How to govern coding agents in production?',
        },
        answer: {
          'pt-BR': 'A Lovable classificou mudanças por nível de risco, colocou revisão automatizada em camadas e criou skills reutilizáveis. O princípio: definir onde o humano entra e onde a máquina resolve sozinha, com classificação de impacto de cada mudança antes de aprovar.',
          'en': 'Lovable classified changes by risk level, implemented layered automated review, and created reusable skills. The principle: define where humans step in and where the machine decides on its own, with impact classification for each change before approval.',
        },
      },
      {
        question: {
          'pt-BR': 'Coding agents substituem desenvolvedores?',
          'en': 'Do coding agents replace developers?',
        },
        answer: {
          'pt-BR': 'Dados do Ramp Economics Lab mostram que empresas com adoção intensa de IA contratam mais, não menos. Coding agents ampliam produtividade, mas a atenção humana continua sendo o recurso mais escasso do processo. O ganho está em liberar pessoas para decisões de maior valor.',
          'en': 'Data from the Ramp Economics Lab shows that companies with intensive AI adoption hire more, not fewer. Coding agents amplify productivity, but human attention remains the scarcest resource in the process. The gain is in freeing people for higher-value decisions.',
        },
      },
    ],
  },
  {
    id: 'finops-de-ia',
    slug: { 'pt-BR': 'finops-de-ia', 'en': 'ai-finops' },
    name: { 'pt-BR': 'FinOps de IA', 'en': 'AI FinOps' },
    description: {
      'pt-BR': 'Estratégias para reduzir custo de IA em produção: destilação de modelos, roteamento inteligente, otimização de contexto e ferramentas de monitoramento. O playbook do product manager para unit economics de IA.',
      'en': 'Strategies to reduce AI production costs: model distillation, intelligent routing, context optimization, and monitoring tools. The product manager playbook for AI unit economics.',
    },
    shortDescription: {
      'pt-BR': 'Redução de custo e unit economics de IA.',
      'en': 'Cost reduction and AI unit economics.',
    },
    keywords: {
      'pt-BR': ['finops de IA', 'custo de IA', 'unit economics IA', 'destilação de modelos', 'otimização de tokens', 'redução de custo LLM', 'Frugon'],
      'en': ['AI FinOps', 'AI cost', 'AI unit economics', 'model distillation', 'token optimization', 'LLM cost reduction', 'Frugon'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'O que é FinOps de IA?',
          'en': 'What is AI FinOps?',
        },
        answer: {
          'pt-BR': 'FinOps de IA é a disciplina de gerenciar e otimizar o custo de operação de modelos de linguagem em produção. Inclui monitoramento de gastos com tokens, roteamento de requisições para modelos mais baratos quando possível, destilação de modelos grandes em menores e otimização de contexto para reduzir volume de tokens processados.',
          'en': 'AI FinOps is the discipline of managing and optimizing the cost of operating language models in production. It includes monitoring token spend, routing requests to cheaper models when possible, distilling large models into smaller ones, and optimizing context to reduce the volume of tokens processed.',
        },
      },
      {
        question: {
          'pt-BR': 'Como reduzir o custo de IA em produção?',
          'en': 'How to reduce AI costs in production?',
        },
        answer: {
          'pt-BR': 'A Shopify reduziu custo em 30x com destilação de modelos. A RidgeText reduziu contexto de 125 mil para 150 tokens com camadas em memória. O Frugon identifica chamadas que podem migrar para modelos mais baratos. As três alavancas: modelo certo para cada tarefa, contexto otimizado e roteamento inteligente.',
          'en': 'Shopify reduced costs 30x with model distillation. RidgeText reduced context from 125K to 150 tokens with in-memory layers. Frugon identifies calls that can move to cheaper models. The three levers: the right model for each task, optimized context, and intelligent routing.',
        },
      },
      {
        question: {
          'pt-BR': 'Qual o impacto do custo de tokens no unit economics?',
          'en': 'What is the impact of token costs on unit economics?',
        },
        answer: {
          'pt-BR': 'Em escala, o custo de tokens pode inviabilizar um produto de IA. Se cada chamada custa US$ 0,01 e você tem 1 milhão de usuários ativos fazendo 10 chamadas por dia, são US$ 100 mil por dia só em tokens. O unit economics precisa fechar com margem saudável, e isso exige otimização agressiva do custo de inferência.',
          'en': 'At scale, token costs can make an AI product unviable. If each call costs $0.01 and you have 1 million active users making 10 calls per day, that is $100K per day in tokens alone. Unit economics need to work with a healthy margin, which requires aggressive inference cost optimization.',
        },
      },
    ],
  },
  {
    id: 'governanca-de-ia',
    slug: { 'pt-BR': 'governanca-de-ia', 'en': 'ai-governance' },
    name: { 'pt-BR': 'Governança de IA', 'en': 'AI Governance' },
    description: {
      'pt-BR': 'Frameworks de governança para agentes de IA em produção: revisão em camadas, classificação de risco, compliance, auditoria de runtime e os pré-requisitos para escalar IA com segurança.',
      'en': 'Governance frameworks for AI agents in production: layered review, risk classification, compliance, runtime auditing, and the prerequisites for scaling AI safely.',
    },
    shortDescription: {
      'pt-BR': 'Risco, compliance e auditoria para IA em produção.',
      'en': 'Risk, compliance, and auditing for AI in production.',
    },
    keywords: {
      'pt-BR': ['governança de IA', 'compliance IA', 'auditoria de IA', 'risco de IA', 'segurança de IA', 'AI governance', 'regulação de IA'],
      'en': ['AI governance', 'AI compliance', 'AI auditing', 'AI risk', 'AI security', 'AI regulation', 'AI safety'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Por que governança é pré-requisito para escalar IA?',
          'en': 'Why is governance a prerequisite for scaling AI?',
        },
        answer: {
          'pt-BR': 'Sem governança madura, agentes de IA não saem da fase de experimento. A pymnts.com resume: governança dá "permissão para crescer" aos agentes. Sem camadas de revisão, classificação de risco e auditoria, qualquer falha em produção vira incidente que trava a operação inteira.',
          'en': 'Without mature governance, AI agents never leave the experimentation phase. pymnts.com summarizes it: governance gives agents "permission to grow." Without review layers, risk classification, and auditing, any production failure becomes an incident that halts the entire operation.',
        },
      },
      {
        question: {
          'pt-BR': 'Como implementar governança de agentes de IA?',
          'en': 'How to implement governance for AI agents?',
        },
        answer: {
          'pt-BR': 'Comece classificando mudanças por nível de risco (como a Lovable fez). Defina onde o humano aprova e onde a máquina decide sozinha. Implemente evidência de runtime (como o Halo) para auditoria. Estabeleça limites de escopo para cada agente. E documente cada decisão para compliance.',
          'en': 'Start by classifying changes by risk level (as Lovable did). Define where humans approve and where the machine decides on its own. Implement runtime evidence (like Halo) for auditing. Establish scope limits for each agent. And document every decision for compliance.',
        },
      },
      {
        question: {
          'pt-BR': 'Quais os riscos de segurança mais comuns em agentes de IA?',
          'en': 'What are the most common security risks in AI agents?',
        },
        answer: {
          'pt-BR': 'O caso GitLost mostrou agentes vazando repositórios privados ao ler conteúdo não confiável. O Claude Code teve possível vazamento de sessão entre contas. Modelos podem inventar campos ao chamar tools. O risco principal é tratar o output do agente como confiável sem validação, expondo dados e sistemas.',
          'en': 'The GitLost case showed agents leaking private repositories when reading untrusted content. Claude Code had a possible session leak between accounts. Models can invent fields when calling tools. The main risk is treating agent output as trusted without validation, exposing data and systems.',
        },
      },
    ],
  },
  {
    id: 'precificacao-de-ia',
    slug: { 'pt-BR': 'precificacao-de-ia', 'en': 'ai-pricing' },
    name: { 'pt-BR': 'Precificação de IA', 'en': 'AI Pricing' },
    description: {
      'pt-BR': 'Como precificar produtos de IA: frameworks de valor vs custo, modelos de cobrança por uso, assento ou resultado, e por que custo baixo de construção não deveria virar desconto.',
      'en': 'How to price AI products: value vs cost frameworks, usage-based, seat-based, or outcome-based billing models, and why low build cost should not become a discount.',
    },
    shortDescription: {
      'pt-BR': 'Estratégias de preço e packaging para IA.',
      'en': 'Pricing and packaging strategies for AI.',
    },
    keywords: {
      'pt-BR': ['precificação de IA', 'preço de IA', 'pricing de IA', 'valor vs custo IA', 'monetização de IA', 'cobrança por uso IA', 'pricing strategy AI'],
      'en': ['AI pricing', 'AI price', 'AI monetization', 'value vs cost AI', 'usage-based billing AI', 'SaaS pricing AI', 'pricing strategy AI'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Como precificar um produto de IA?',
          'en': 'How to price an AI product?',
        },
        answer: {
          'pt-BR': 'O preço não vem do custo de rodar o modelo, vem do valor gerado para quem usa. Mapeie o valor real (horas economizadas, receita gerada, risco evitado), olhe o que o mercado paga por resultados parecidos, escolha entre cobrança por uso, assento ou resultado, teste disposição a pagar e ajuste.',
          'en': 'Price does not come from the cost of running the model; it comes from the value generated for the user. Map the real value (hours saved, revenue generated, risk avoided), look at what the market pays for similar outcomes, choose between usage-based, seat-based, or outcome-based billing, test willingness to pay, and adjust.',
        },
      },
      {
        question: {
          'pt-BR': 'Devo cobrar pelo custo de tokens?',
          'en': 'Should I charge based on token costs?',
        },
        answer: {
          'pt-BR': 'Não. Cobrar pelo custo de infraestrutura é deixar dinheiro na mesa. Um recurso de IA que economiza dez horas de trabalho por semana vale muito mais do que os centavos gastos em tokens. O preço deve refletir o valor entregue, não o custo de entrega.',
          'en': 'No. Charging for infrastructure cost is leaving money on the table. An AI feature that saves ten hours of work per week is worth far more than the cents spent on tokens. Price should reflect the value delivered, not the cost of delivery.',
        },
      },
      {
        question: {
          'pt-BR': 'Qual o melhor modelo de cobrança para IA?',
          'en': 'What is the best billing model for AI?',
        },
        answer: {
          'pt-BR': 'Depende do caso. Cobrança por uso funciona para features de consumo variável. Por assento funciona para ferramentas de produtividade. Por resultado funciona quando o valor é mensurável e atribuível diretamente à IA. O framework da Mercury sugere testar os três e ajustar com base em disposição a pagar real.',
          'en': 'It depends on the case. Usage-based billing works for variable-consumption features. Seat-based works for productivity tools. Outcome-based works when value is measurable and directly attributable to AI. The Mercury framework suggests testing all three and adjusting based on real willingness to pay.',
        },
      },
    ],
  },
  {
    id: 'adocao-de-ia',
    slug: { 'pt-BR': 'adocao-de-ia', 'en': 'ai-adoption' },
    name: { 'pt-BR': 'Adoção de IA', 'en': 'AI Adoption' },
    description: {
      'pt-BR': 'Dados reais sobre adoção de IA nas empresas: impacto no headcount, ROI, barreiras de implementação e o que diferencia pilotos que escalam daqueles que morrem na prova de conceito.',
      'en': 'Real data on enterprise AI adoption: headcount impact, ROI, implementation barriers, and what differentiates pilots that scale from those that die in proof of concept.',
    },
    shortDescription: {
      'pt-BR': 'ROI, impacto no headcount e barreiras de escala.',
      'en': 'ROI, headcount impact, and scaling barriers.',
    },
    keywords: {
      'pt-BR': ['adoção de IA', 'implementação de IA', 'ROI de IA', 'IA nas empresas', 'transformação digital IA', 'piloto de IA', 'business case IA'],
      'en': ['AI adoption', 'AI implementation', 'AI ROI', 'enterprise AI', 'AI digital transformation', 'AI pilot', 'AI business case'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Adoção de IA corta empregos?',
          'en': 'Does AI adoption cut jobs?',
        },
        answer: {
          'pt-BR': 'O estudo do Ramp Economics Lab com 21 mil empresas mostra o oposto: empresas com adoção intensa de IA contratam mais, não menos. Headcount cresce 10% em dois anos e vagas de entrada sobem 12%. Mas o efeito não é automático: exige integração real ao processo e maturação de 6 a 12 meses.',
          'en': 'The Ramp Economics Lab study with 21,000 companies shows the opposite: companies with intensive AI adoption hire more, not fewer. Headcount grows 10% over two years and entry-level positions rise 12%. But the effect is not automatic: it requires real process integration and 6 to 12 months of maturation.',
        },
      },
      {
        question: {
          'pt-BR': 'Por que pilotos de IA não escalam?',
          'en': 'Why do AI pilots fail to scale?',
        },
        answer: {
          'pt-BR': 'A Microsoft identificou que muitos pilotos corporativos não entregam o retorno esperado porque ninguém redesenhou o workflow ao redor da IA. O modelo raramente é o gargalo. O problema é integração ao processo real, com pessoas certas, dados certos e governança certa em cada etapa.',
          'en': 'Microsoft identified that many corporate pilots fail to deliver expected returns because no one redesigned the workflow around the AI. The model is rarely the bottleneck. The problem is integration into the real process, with the right people, the right data, and the right governance at each step.',
        },
      },
      {
        question: {
          'pt-BR': 'Qual o ROI de implementar IA?',
          'en': 'What is the ROI of implementing AI?',
        },
        answer: {
          'pt-BR': 'O ROI não precisa vir só de corte de custo. Pode vir de crescimento também. O estudo do Ramp mostra que adoção intensa gera contratação e expansão. O business case deve considerar tanto eficiência (custos reduzidos) quanto crescimento (receita nova, capacidade ampliada, mercado expandido).',
          'en': 'ROI does not need to come only from cost cutting. It can also come from growth. The Ramp study shows that intensive adoption generates hiring and expansion. The business case should consider both efficiency (reduced costs) and growth (new revenue, expanded capacity, expanded market).',
        },
      },
    ],
  },
  {
    id: 'fintech',
    slug: { 'pt-BR': 'fintech', 'en': 'fintech' },
    name: { 'pt-BR': 'Fintech', 'en': 'Fintech' },
    description: {
      'pt-BR': 'IA aplicada a produtos financeiros: crédito, recebíveis, automação de análise documental, antecipação, triagem de operações. O cruzamento entre produto de crédito e inteligência artificial.',
      'en': 'AI applied to financial products: credit, receivables, document analysis automation, anticipation, transaction screening. The intersection of credit products and artificial intelligence.',
    },
    shortDescription: {
      'pt-BR': 'IA em crédito, recebíveis e produtos financeiros.',
      'en': 'AI in credit, receivables, and financial products.',
    },
    keywords: {
      'pt-BR': ['fintech', 'IA em fintech', 'crédito', 'recebíveis', 'produto financeiro', 'automação financeira', 'IA bancária', 'capital de giro'],
      'en': ['fintech', 'AI in fintech', 'credit', 'receivables', 'financial products', 'financial automation', 'banking AI', 'working capital'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Como a IA está transformando o crédito?',
          'en': 'How is AI transforming credit?',
        },
        answer: {
          'pt-BR': 'A IA em crédito não substitui a decisão de crédito — aprimora as etapas ao redor: automação de análise documental, triagem de recebíveis, leitura de contratos, sinalização de inconsistências. O ganho real está em liberar analistas para decisões de maior valor, não em automatizar a decisão final sem critério de risco.',
          'en': 'AI in credit does not replace the credit decision — it enhances the surrounding steps: document analysis automation, receivables screening, contract reading, inconsistency flagging. The real gain is in freeing analysts for higher-value decisions, not in automating the final decision without risk criteria.',
        },
      },
      {
        question: {
          'pt-BR': 'O que a precificação de IA tem a ver com fintech?',
          'en': 'What does AI pricing have to do with fintech?',
        },
        answer: {
          'pt-BR': 'Tudo. Preço de crédito nunca foi sobre o custo de processar uma operação. Sempre foi sobre o valor de destravar capital de giro, antecipar um recebível, dar previsibilidade de caixa. A IA muda o custo de entrega dessa solução, mas não muda essa régua de valor. O framework é o mesmo.',
          'en': 'Everything. Credit pricing was never about the cost of processing a transaction. It was always about the value of unlocking working capital, anticipating a receivable, providing cash flow predictability. AI changes the delivery cost of this solution, but does not change the value benchmark. The framework is the same.',
        },
      },
      {
        question: {
          'pt-BR': 'Quais os riscos de automação em produtos de crédito?',
          'en': 'What are the risks of automation in credit products?',
        },
        answer: {
          'pt-BR': 'Automatizar sem critério de risco vira dor de cabeça rápido. O trabalho está em desenhar a governança: decidir onde o humano entra e onde a máquina resolve sozinha, classificar impacto de cada automação, revisar em camadas. A Lovable aplicou exatamente esse padrão para coding agents — a lógica vale para crédito.',
          'en': 'Automating without risk criteria quickly becomes a headache. The work is in designing governance: deciding where humans step in and where the machine decides on its own, classifying the impact of each automation, reviewing in layers. Lovable applied exactly this pattern for coding agents — the logic applies to credit.',
        },
      },
    ],
  },
  {
    id: 'automacao',
    slug: { 'pt-BR': 'automacao', 'en': 'automation' },
    name: { 'pt-BR': 'Automação', 'en': 'Automation' },
    description: {
      'pt-BR': 'Automação inteligente com IA: quando automatizar, como governar, onde o humano entra. Cases de escala de automação em produtos de tecnologia e financeiros.',
      'en': 'Intelligent automation with AI: when to automate, how to govern, where humans fit in. Scaling cases of automation in technology and financial products.',
    },
    shortDescription: {
      'pt-BR': 'Escala, governança e limites da automação com IA.',
      'en': 'Scale, governance, and limits of AI automation.',
    },
    keywords: {
      'pt-BR': ['automação', 'automação inteligente', 'automação de processos', 'automação com IA', 'workflow automation', 'process automation AI'],
      'en': ['automation', 'intelligent automation', 'process automation', 'AI automation', 'workflow automation', 'process automation AI'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Quando automatizar com IA vs automação tradicional?',
          'en': 'When to use AI automation vs traditional automation?',
        },
        answer: {
          'pt-BR': 'Use IA quando o workflow tem alta variabilidade, requer interpretação de linguagem natural ou decisão sob incerteza. Use automação tradicional (RPA, scripts) quando o processo é determinístico e repetitivo. Misturar os dois — IA para as partes variáveis, regras para as partes determinísticas — costuma ser a abordagem mais eficaz.',
          'en': 'Use AI when the workflow has high variability, requires natural language interpretation, or involves decision-making under uncertainty. Use traditional automation (RPA, scripts) when the process is deterministic and repetitive. Mixing the two — AI for variable parts, rules for deterministic parts — is usually the most effective approach.',
        },
      },
      {
        question: {
          'pt-BR': 'Como escalar automação sem perder controle?',
          'en': 'How to scale automation without losing control?',
        },
        answer: {
          'pt-BR': 'Classifique mudanças por nível de risco. Coloque revisão automatizada em camadas. Crie skills reutilizáveis para os agentes. Defina limites de escopo. Monitore runtime com evidência auditável. O princípio da Lovable: mesmo com dezenas de agentes rodando em paralelo, a atenção humana continua sendo o recurso mais escasso.',
          'en': 'Classify changes by risk level. Implement layered automated review. Create reusable skills for agents. Define scope limits. Monitor runtime with auditable evidence. Lovable\u2019s principle: even with dozens of agents running in parallel, human attention remains the scarcest resource.',
        },
      },
    ],
  },
  {
    id: 'seguranca-de-ia',
    slug: { 'pt-BR': 'seguranca-de-ia', 'en': 'ai-security' },
    name: { 'pt-BR': 'Segurança de IA', 'en': 'AI Security' },
    description: {
      'pt-BR': 'Vulnerabilidades, vazamentos e riscos de segurança em produtos de IA: agents lendo conteúdo não confiável, isolamento de sessão, tool calling fora do padrão e como se proteger.',
      'en': 'Vulnerabilities, leaks, and security risks in AI products: agents reading untrusted content, session isolation, non-standard tool calling, and how to protect yourself.',
    },
    shortDescription: {
      'pt-BR': 'Vulnerabilidades, vazamentos e defesa em IA.',
      'en': 'Vulnerabilities, leaks, and defense in AI.',
    },
    keywords: {
      'pt-BR': ['segurança de IA', 'AI security', 'vazamento de IA', 'risco de segurança IA', 'prompt injection', 'isolamento de agentes', 'GitLost'],
      'en': ['AI security', 'AI vulnerability', 'AI leak', 'AI security risk', 'prompt injection', 'agent isolation', 'GitLost'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Quais os principais riscos de segurança em agentes de IA?',
          'en': 'What are the main security risks in AI agents?',
        },
        answer: {
          'pt-BR': 'O caso GitLost mostrou agentes do GitHub vazando repositórios privados ao processar conteúdo malicioso. O Claude Code teve possível vazamento de sessão entre contas. Modelos podem inventar campos ao chamar ferramentas. O risco principal é tratar o output do agente como confiável sem validação de segurança.',
          'en': 'The GitLost case showed GitHub agents leaking private repositories when processing malicious content. Claude Code had a possible session leak between accounts. Models can invent fields when calling tools. The main risk is treating agent output as trusted without security validation.',
        },
      },
      {
        question: {
          'pt-BR': 'Como proteger agentes de IA contra conteúdo malicioso?',
          'en': 'How to protect AI agents from malicious content?',
        },
        answer: {
          'pt-BR': 'Isole o ambiente de execução do agente. Valide todo output antes de executar ações. Não permita que o agente acesse recursos além do escopo necessário. Implemente sandboxing para operações de arquivo e rede. Monitore runtime com evidência auditável (como o Halo). E nunca confie cegamente no output do modelo.',
          'en': 'Isolate the agent execution environment. Validate all output before executing actions. Do not allow the agent to access resources beyond the necessary scope. Implement sandboxing for file and network operations. Monitor runtime with auditable evidence (like Halo). And never blindly trust model output.',
        },
      },
    ],
  },
  {
    id: 'open-source',
    slug: { 'pt-BR': 'open-source', 'en': 'open-source-ai' },
    name: { 'pt-BR': 'IA Open Source', 'en': 'Open Source AI' },
    description: {
      'pt-BR': 'Modelos open-weight, frameworks open-source e ferramentas de IA self-hosted: GLM-5.2, Omnigent, Rowboat, Frugon, Halo. Alternativas para reduzir lock-in e custo.',
      'en': 'Open-weight models, open-source frameworks, and self-hosted AI tools: GLM-5.2, Omnigent, Rowboat, Frugon, Halo. Alternatives to reduce lock-in and cost.',
    },
    shortDescription: {
      'pt-BR': 'Modelos e ferramentas open-source de IA.',
      'en': 'Open-source AI models and tools.',
    },
    keywords: {
      'pt-BR': ['IA open source', 'open source AI', 'open weight models', 'GLM-5.2', 'self-hosted IA', 'Omnigent', 'Rowboat', 'Frugon'],
      'en': ['open source AI', 'open weight models', 'GLM-5.2', 'self-hosted AI', 'Omnigent', 'Rowboat', 'Frugon', 'open source LLM'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Vale a pena usar modelos open-weight em produção?',
          'en': 'Is it worth using open-weight models in production?',
        },
        answer: {
          'pt-BR': 'Depende do caso de uso e da capacidade de self-hosting. O GLM-5.2 da Z.ai oferece peso aberto com foco em codificação e segurança, ampliando opções de custo e controle. O trade-off é infraestrutura própria vs conveniência de API. Para volume alto, self-hosting pode ser dramaticamente mais barato.',
          'en': 'It depends on the use case and self-hosting capacity. Z.ai\u2019s GLM-5.2 offers open weights focused on coding and security, expanding cost and control options. The trade-off is own infrastructure vs API convenience. For high volume, self-hosting can be dramatically cheaper.',
        },
      },
      {
        question: {
          'pt-BR': 'Quais ferramentas open-source existem para IA?',
          'en': 'What open-source tools exist for AI?',
        },
        answer: {
          'pt-BR': 'Omnigent unifica Claude Code, Codex e Cursor. Rowboat é alternativa open-source ao Claude Desktop. Frugon identifica chamadas de LLM que podem migrar para modelos mais baratos. Halo grava evidência de runtime para auditoria. O ecossistema open-source de IA cresce rápido e oferece alternativas viáveis a ferramentas proprietárias.',
          'en': 'Omnigent unifies Claude Code, Codex, and Cursor. Rowboat is an open-source alternative to Claude Desktop. Frugon identifies LLM calls that can move to cheaper models. Halo records runtime evidence for auditing. The open-source AI ecosystem is growing fast and offers viable alternatives to proprietary tools.',
        },
      },
    ],
  },
  {
    id: 'avaliacao-de-modelos',
    slug: { 'pt-BR': 'avaliacao-de-modelos', 'en': 'model-evaluation' },
    name: { 'pt-BR': 'Avaliação de Modelos', 'en': 'Model Evaluation' },
    description: {
      'pt-BR': 'Como avaliar modelos de IA sem cegar para benchmarks: evals, SWE-Bench, sinais vs ruído, testes com dados reais do produto e armadilhas dos rankings públicos.',
      'en': 'How to evaluate AI models without being blinded by benchmarks: evals, SWE-Bench, signal vs noise, testing with real product data, and the pitfalls of public rankings.',
    },
    shortDescription: {
      'pt-BR': 'Evals, benchmarks e como não ser enganado.',
      'en': 'Evals, benchmarks, and how not to be fooled.',
    },
    keywords: {
      'pt-BR': ['avaliação de modelos', 'evals', 'benchmark de IA', 'SWE-Bench', 'avaliação de LLM', 'model evaluation', 'ranking de modelos'],
      'en': ['model evaluation', 'evals', 'AI benchmark', 'SWE-Bench', 'LLM evaluation', 'model assessment', 'AI model ranking'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Posso confiar em benchmarks públicos de modelos de IA?',
          'en': 'Can I trust public AI model benchmarks?',
        },
        answer: {
          'pt-BR': 'Com cautela. A OpenAI encontrou cerca de 30% das tarefas do SWE-Bench Pro quebradas ou mal definidas. Benchmarks podem ser contaminados por dados de treino, ter tarefas mal especificadas ou não refletir o seu caso de uso real. Use benchmarks como sinal direcional, não como decisão final.',
          'en': 'With caution. OpenAI found about 30% of SWE-Bench Pro tasks were broken or poorly defined. Benchmarks can be contaminated by training data, have poorly specified tasks, or not reflect your real use case. Use benchmarks as a directional signal, not as a final decision.',
        },
      },
      {
        question: {
          'pt-BR': 'Como avaliar um modelo para meu produto?',
          'en': 'How to evaluate a model for my product?',
        },
        answer: {
          'pt-BR': 'Construa um dataset de avaliação com casos reais do seu produto. Meça acurácia na sua tarefa específica, não em benchmark genérico. Teste regressões ao atualizar modelo. Monitore qualidade em produção com amostragem. E considere custo total (tokens, latência, infraestrutura), não só capacidade máxima.',
          'en': 'Build an evaluation dataset with real cases from your product. Measure accuracy on your specific task, not on a generic benchmark. Test for regressions when updating models. Monitor quality in production with sampling. And consider total cost (tokens, latency, infrastructure), not just maximum capability.',
        },
      },
    ],
  },
  {
    id: 'produto',
    slug: { 'pt-BR': 'produto', 'en': 'product' },
    name: { 'pt-BR': 'Produto', 'en': 'Product' },
    description: {
      'pt-BR': 'Gestão de produto na era da IA: decisões de stack, priorização de features de IA, business case, ROI, integração ao workflow e o papel do PM em produtos que usam inteligência artificial.',
      'en': 'Product management in the AI era: stack decisions, AI feature prioritization, business case, ROI, workflow integration, and the PM role in products that use artificial intelligence.',
    },
    shortDescription: {
      'pt-BR': 'Decisões de produto, stack e priorização com IA.',
      'en': 'Product decisions, stack, and prioritization with AI.',
    },
    keywords: {
      'pt-BR': ['produto', 'product management', 'product manager', 'PM', 'gestão de produto', 'produto de IA', 'product owner', 'PO'],
      'en': ['product', 'product management', 'product manager', 'PM', 'product ownership', 'AI product', 'product owner', 'PO'],
    },
    faqs: [
      {
        question: {
          'pt-BR': 'Qual o papel do product manager em produtos de IA?',
          'en': 'What is the role of a product manager in AI products?',
        },
        answer: {
          'pt-BR': 'O PM em produtos de IA precisa entender as trade-offs técnicos (modelo, custo, latência), traduzir capacidade técnica em valor de negócio, desenhar a governança e a experiência humana ao redor da IA, e construir o business case. O modelo é uma peça — o produto é o todo, incluindo workflow, dados, pessoas e processo.',
          'en': 'The PM in AI products needs to understand technical trade-offs (model, cost, latency), translate technical capability into business value, design governance and the human experience around AI, and build the business case. The model is one piece — the product is the whole, including workflow, data, people, and process.',
        },
      },
      {
        question: {
          'pt-BR': 'Como priorizar features de IA no roadmap?',
          'en': 'How to prioritize AI features in the roadmap?',
        },
        answer: {
          'pt-BR': 'Priorize pelo valor gerado vs custo de entrega e operação. Uma feature que economiza dez horas de trabalho manual por semana vale mais que os centavos em tokens. Considere também maturidade de governança, viabilidade técnica e alinhamento com o workflow existente. Features de IA que exigem redesign de processo custam mais para entregar.',
          'en': 'Prioritize by value generated vs delivery and operational cost. A feature that saves ten hours of manual work per week is worth more than the cents in tokens. Also consider governance maturity, technical feasibility, and alignment with existing workflow. AI features that require process redesign cost more to deliver.',
        },
      },
      {
        question: {
          'pt-BR': 'Quais ferramentas de IA um PM deveria conhecer?',
          'en': 'What AI tools should a PM know?',
        },
        answer: {
          'pt-BR': 'A Figma publicou um mapa com 13 ferramentas de IA organizadas por etapa do ciclo de produto. O ponto não é conhecer todas, mas entender quais problemas cada categoria resolve: pesquisa, ideação, prototipagem, análise, documentação. Conhecer o landscape ajuda a tomar melhores decisões de stack.',
          'en': 'Figma published a map with 13 AI tools organized by product lifecycle stage. The point is not to know all of them, but to understand which problems each category solves: research, ideation, prototyping, analysis, documentation. Knowing the landscape helps make better stack decisions.',
        },
      },
    ],
  },
];
