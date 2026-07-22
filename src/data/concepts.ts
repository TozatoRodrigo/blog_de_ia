import type { Concept } from '../types';

export const concepts: Concept[] = [
  {
    id: 'o-que-e-agent-washing',
    slug: { 'pt-BR': 'o-que-e-agent-washing', 'en': 'what-is-agent-washing' },
    term: { 'pt-BR': 'Agent Washing', 'en': 'Agent Washing' },
    definition: {
      'pt-BR': 'Termo cunhado pela Gartner para descrever produtos vendidos como "agentes de IA" que na prática são apenas lógica condicional (if/else) com uma camada superficial de LLM.',
      'en': 'A term coined by Gartner to describe products sold as "AI agents" that are in practice just conditional logic (if/else) with a superficial LLM layer.',
    },
    longDescription: {
      'pt-BR': 'Agent washing é o equivalente de IA ao "greenwashing": produtos que se vendem como agentes autônomos de inteligência artificial mas que, na prática, são sistemas determinísticos tradicionais com uma interface de LLM por cima. A Gartner cunhou o termo para alertar compradores corporativos sobre o risco de investir em "agentes" que não têm capacidade real de decisão autônoma, iteração sobre objetivos ou uso de múltiplas ferramentas. Para product managers, o agent washing é um sinal de alerta na due diligence de fornecedores e na comunicação do próprio produto: vender como "agente" algo que é automação tradicional pode gerar expectativa não cumprida e erodir confiança.',
      'en': 'Agent washing is the AI equivalent of greenwashing: products that sell themselves as autonomous AI agents but are in practice traditional deterministic systems with an LLM interface on top. Gartner coined the term to alert corporate buyers about the risk of investing in "agents" that lack real autonomous decision-making, goal iteration, or multi-tool usage capabilities. For product managers, agent washing is a red flag in vendor due diligence and in their own product communication: selling something as an "agent" when it is traditional automation can create unmet expectations and erode trust.',
    },
    category: { 'pt-BR': 'Governança', 'en': 'Governance' },
    relatedTerms: ['agentes-de-ia', 'governanca-de-ia'],
  },
  {
    id: 'o-que-e-finops-de-ia',
    slug: { 'pt-BR': 'o-que-e-finops-de-ia', 'en': 'what-is-ai-finops' },
    term: { 'pt-BR': 'FinOps de IA', 'en': 'AI FinOps' },
    definition: {
      'pt-BR': 'Disciplina de gerenciar e otimizar o custo de operação de modelos de linguagem em produção, incluindo monitoramento de gastos com tokens, roteamento inteligente e destilação de modelos.',
      'en': 'The discipline of managing and optimizing the cost of operating language models in production, including token spend monitoring, intelligent routing, and model distillation.',
    },
    longDescription: {
      'pt-BR': 'FinOps de IA aplica os princípios de FinOps (gestão financeira de nuvem) ao custo de operar modelos de IA. As principais alavancas são: (1) roteamento inteligente — direcionar requisições para modelos mais baratos quando a tarefa não exige modelo frontier, como faz o Frugon; (2) destilação de modelos — treinar modelos menores a partir de modelos maiores para tarefas específicas, como a Shopify fez para cortar custo em 30x; (3) otimização de contexto — reduzir o número de tokens processados por requisição, como a RidgeText fez ao reduzir de 125 mil para 150 tokens; (4) monitoramento de gastos — rastrear custo por feature, por usuário e por chamada para identificar gargalos de unit economics. Para product managers, FinOps de IA é o que separa um produto de IA viável de um que quebra o orçamento em escala.',
      'en': 'AI FinOps applies the principles of FinOps (cloud financial management) to the cost of operating AI models. The main levers are: (1) intelligent routing — directing requests to cheaper models when the task does not require a frontier model, as Frugon does; (2) model distillation — training smaller models from larger ones for specific tasks, as Shopify did to cut costs 30x; (3) context optimization — reducing the number of tokens processed per request, as RidgeText did by reducing from 125K to 150 tokens; (4) spend monitoring — tracking cost per feature, per user, and per call to identify unit economics bottlenecks. For product managers, AI FinOps is what separates a viable AI product from one that breaks the budget at scale.',
    },
    category: { 'pt-BR': 'Operação', 'en': 'Operations' },
    relatedTerms: ['finops-de-ia', 'modelos-de-ia', 'precificacao-de-ia'],
  },
  {
    id: 'o-que-e-destilacao-de-modelos',
    slug: { 'pt-BR': 'o-que-e-destilacao-de-modelos', 'en': 'what-is-model-distillation' },
    term: { 'pt-BR': 'Destilação de Modelos', 'en': 'Model Distillation' },
    definition: {
      'pt-BR': 'Técnica de treinar um modelo menor a partir das saídas de um modelo maior, preservando a capacidade para uma tarefa específica a uma fração do custo de inferência.',
      'en': 'A technique to train a smaller model from the outputs of a larger model, preserving capability for a specific task at a fraction of the inference cost.',
    },
    longDescription: {
      'pt-BR': 'A destilação de modelos (model distillation) é uma técnica onde um modelo menor ("student") é treinado para imitar as saídas de um modelo maior e mais capaz ("teacher"). O resultado é um modelo que performa de forma comparável ao modelo maior em uma tarefa específica, mas a uma fração do custo de inferência. A Shopify demonstrou isso em produção: seu pipeline de destilação cortou o custo de IA em até 30x, e em vários casos o modelo menor performou igual ou melhor que o modelo grande genérico. O princípio é que modelos grandes são excelentes para tarefas generalistas, mas quando a tarefa é específica e bem definida, um modelo destilado para aquele domínio é mais eficiente em custo, latência e até qualidade. Para PMs, a destilação é uma das alavancas mais poderosas de FinOps de IA.',
      'en': 'Model distillation is a technique where a smaller model ("student") is trained to mimic the outputs of a larger, more capable model ("teacher"). The result is a model that performs comparably to the larger model on a specific task, but at a fraction of the inference cost. Shopify demonstrated this in production: their distillation pipeline cut AI costs by up to 30x, and in several cases the smaller model performed equal to or better than the generic large model. The principle is that large models excel at generalist tasks, but when the task is specific and well-defined, a distilled model for that domain is more efficient in cost, latency, and even quality. For PMs, distillation is one of the most powerful AI FinOps levers.',
    },
    category: { 'pt-BR': 'Técnico', 'en': 'Technical' },
    relatedTerms: ['modelos-de-ia', 'finops-de-ia'],
  },
  {
    id: 'o-que-e-rag',
    slug: { 'pt-BR': 'o-que-e-rag', 'en': 'what-is-rag' },
    term: { 'pt-BR': 'RAG (Retrieval-Augmented Generation)', 'en': 'RAG (Retrieval-Augmented Generation)' },
    definition: {
      'pt-BR': 'Técnica que combina recuperação de informação com geração de texto, permitindo que LLMs usem conhecimento externo sem retreinar o modelo.',
      'en': 'A technique that combines information retrieval with text generation, allowing LLMs to use external knowledge without retraining the model.',
    },
    longDescription: {
      'pt-BR': 'RAG (Retrieval-Augmented Generation) é uma arquitetura onde, antes de gerar uma resposta, o sistema recupera documentos relevantes de uma base de conhecimento e os inclui no contexto do prompt. Isso permite que o modelo use informação atualizada e específica do domínio sem precisar de retreino. O desafio de RAG em produção é o custo: cada documento recuperado adiciona tokens ao contexto. A Kapa.ai demonstrou uma técnica para cortar 68% do contexto de RAG mantendo 96% do recall, mostrando que otimização de RAG é tanto uma questão de qualidade quanto de FinOps. Para product managers, RAG é frequentemente a arquitetura de escolha para produtos de IA que precisam responder com base em dados proprietários ou atualizados.',
      'en': 'RAG (Retrieval-Augmented Generation) is an architecture where, before generating a response, the system retrieves relevant documents from a knowledge base and includes them in the prompt context. This allows the model to use up-to-date and domain-specific information without retraining. The challenge of RAG in production is cost: each retrieved document adds tokens to the context. Kapa.ai demonstrated a technique to cut 68% of RAG context while maintaining 96% recall, showing that RAG optimization is as much a quality issue as a FinOps one. For product managers, RAG is often the architecture of choice for AI products that need to answer based on proprietary or up-to-date data.',
    },
    category: { 'pt-BR': 'Técnico', 'en': 'Technical' },
    relatedTerms: ['modelos-de-ia', 'finops-de-ia'],
  },
  {
    id: 'o-que-e-mcp',
    slug: { 'pt-BR': 'o-que-e-mcp', 'en': 'what-is-mcp' },
    term: { 'pt-BR': 'MCP (Model Context Protocol)', 'en': 'MCP (Model Context Protocol)' },
    definition: {
      'pt-BR': 'Protocolo aberto que padroniza como modelos de IA se conectam a fontes de dados e ferramentas externas, simplificando integrações de agentes.',
      'en': 'An open protocol that standardizes how AI models connect to external data sources and tools, simplifying agent integrations.',
    },
    longDescription: {
      'pt-BR': 'O Model Context Protocol (MCP) é um padrão aberto que define como LLMs e agentes de IA se conectam a fontes de dados, APIs e ferramentas externas. Antes do MCP, cada integração exigia código customizado específico para o modelo e a ferramenta. Com MCP, um agente pode descobrir e usar ferramentas expostas por qualquer servidor compatível com o protocolo. O Google levou agentes de IA à segurança do Chrome Enterprise usando MCP, demonstrando adoção do padrão em produtos enterprise de grande escala. Para product managers, MCP reduz o custo de integração de agentes com sistemas existentes e é um sinal de maturidade do ecossistema de IA agêntica.',
      'en': 'The Model Context Protocol (MCP) is an open standard that defines how LLMs and AI agents connect to external data sources, APIs, and tools. Before MCP, each integration required custom code specific to the model and tool. With MCP, an agent can discover and use tools exposed by any protocol-compatible server. Google brought AI agents to Chrome Enterprise security using MCP, demonstrating adoption of the standard in large-scale enterprise products. For product managers, MCP reduces the cost of integrating agents with existing systems and is a sign of maturity in the agentic AI ecosystem.',
    },
    category: { 'pt-BR': 'Técnico', 'en': 'Technical' },
    relatedTerms: ['agentes-de-ia', 'seguranca-de-ia'],
  },
  {
    id: 'o-que-e-agent-gateway',
    slug: { 'pt-BR': 'o-que-e-agent-gateway', 'en': 'what-is-agent-gateway' },
    term: { 'pt-BR': 'Agent Gateway', 'en': 'Agent Gateway' },
    definition: {
      'pt-BR': 'Categoria de infraestrutura que atua como plano de controle para agentes de IA corporativos, gerenciando roteamento, segurança, observabilidade e governança.',
      'en': 'An infrastructure category that acts as the control plane for enterprise AI agents, managing routing, security, observability, and governance.',
    },
    longDescription: {
      'pt-BR': 'Agent Gateway é uma nova categoria de infraestrutura que está se consolidando rapidamente no mercado de IA corporativa. Empresas como Nutanix, Arcade e Palo Alto/Portkey estão construindo produtos que funcionam como o "control plane" da IA empresarial: roteando requisições de agentes, aplicando políticas de segurança, monitorando custo e comportamento, e garantindo compliance. Para product managers que estão escalando agentes em produção, um Agent Gateway é a camada que permite governar múltiplos agentes de múltiplos provedores sem perder controle de custo, segurança e auditoria. É o equivalente do API Gateway para o mundo dos agentes de IA.',
      'en': 'Agent Gateway is a new infrastructure category that is rapidly consolidating in the enterprise AI market. Companies like Nutanix, Arcade, and Palo Alto/Portkey are building products that function as the "control plane" for enterprise AI: routing agent requests, applying security policies, monitoring cost and behavior, and ensuring compliance. For product managers scaling agents in production, an Agent Gateway is the layer that enables governing multiple agents from multiple providers without losing control of cost, security, and auditing. It is the API Gateway equivalent for the AI agent world.',
    },
    category: { 'pt-BR': 'Infraestrutura', 'en': 'Infrastructure' },
    relatedTerms: ['agentes-de-ia', 'governanca-de-ia', 'seguranca-de-ia'],
  },
  {
    id: 'o-que-e-swe-bench',
    slug: { 'pt-BR': 'o-que-e-swe-bench', 'en': 'what-is-swe-bench' },
    term: { 'pt-BR': 'SWE-Bench', 'en': 'SWE-Bench' },
    definition: {
      'pt-BR': 'Benchmark que avalia a capacidade de modelos de IA resolverem issues reais de repositórios open-source, medindo capacidade prática de engenharia de software.',
      'en': 'A benchmark that evaluates the ability of AI models to solve real issues from open-source repositories, measuring practical software engineering capability.',
    },
    longDescription: {
      'pt-BR': 'O SWE-Bench é um dos benchmarks mais influentes para avaliar agentes de codificação. Ele submete modelos a issues reais de repositórios open-source e mede se o modelo consegue produzir um patch que resolve o problema. A OpenAI conduziu uma auditoria do SWE-Bench Pro e encontrou cerca de 30% das tarefas quebradas ou mal definidas, levantando dúvidas sobre a confiabilidade de rankings públicos de capacidade de coding. Para product managers que avaliam modelos de IA para tarefas de engenharia, o SWE-Bench é um sinal direcional útil, mas deve ser complementado com avaliação em dados reais do próprio produto. Não confie cegamente em rankings de "capacidade" ao escolher modelo.',
      'en': 'SWE-Bench is one of the most influential benchmarks for evaluating coding agents. It submits models to real issues from open-source repositories and measures whether the model can produce a patch that solves the problem. OpenAI conducted an audit of SWE-Bench Pro and found about 30% of tasks broken or poorly defined, raising doubts about the reliability of public coding capability rankings. For product managers evaluating AI models for engineering tasks, SWE-Bench is a useful directional signal, but should be complemented with evaluation on real product data. Do not blindly trust capability rankings when choosing a model.',
    },
    category: { 'pt-BR': 'Avaliação', 'en': 'Evaluation' },
    relatedTerms: ['avaliacao-de-modelos', 'coding-agents', 'modelos-de-ia'],
  },
  {
    id: 'o-que-e-evals',
    slug: { 'pt-BR': 'o-que-e-evals', 'en': 'what-is-evals' },
    term: { 'pt-BR': 'Evals', 'en': 'Evals' },
    definition: {
      'pt-BR': 'Conjunto de técnicas e datasets para avaliar a qualidade, segurança e capacidade de modelos de IA em tarefas específicas.',
      'en': 'A set of techniques and datasets to evaluate the quality, safety, and capability of AI models on specific tasks.',
    },
    longDescription: {
      'pt-BR': 'Evals (avaliações) são o processo de medir quão bem um modelo de IA performa em um conjunto de tarefas. Existem evals públicos (como SWE-Bench, MMLU, HumanEval) e evals customizadas construídas para um produto específico. O problema dos evals públicos é que podem ser contaminados por dados de treino, ter tarefas mal definidas ou não refletir o caso de uso real. A OpenAI separou sinal de ruído em evals de coding e encontrou 30% das tarefas quebradas. A recomendação para product managers: construa seu próprio dataset de avaliação com casos reais do produto, meça acurácia na sua tarefa específica, monitore regressões em produção e use benchmarks públicos apenas como referência direcional.',
      'en': 'Evals (evaluations) are the process of measuring how well an AI model performs on a set of tasks. There are public evals (like SWE-Bench, MMLU, HumanEval) and custom evals built for a specific product. The problem with public evals is that they can be contaminated by training data, have poorly defined tasks, or not reflect the real use case. OpenAI separated signal from noise in coding evals and found 30% of tasks broken. The recommendation for product managers: build your own evaluation dataset with real product cases, measure accuracy on your specific task, monitor regressions in production, and use public benchmarks only as a directional reference.',
    },
    category: { 'pt-BR': 'Avaliação', 'en': 'Evaluation' },
    relatedTerms: ['avaliacao-de-modelos', 'modelos-de-ia'],
  },
  {
    id: 'o-que-e-tool-calling',
    slug: { 'pt-BR': 'o-que-e-tool-calling', 'en': 'what-is-tool-calling' },
    term: { 'pt-BR': 'Tool Calling', 'en': 'Tool Calling' },
    definition: {
      'pt-BR': 'Capacidade de um LLM de invocar funções externas (APIs, ferramentas) de forma estruturada, permitindo que o modelo execute ações no mundo real.',
      'en': 'The ability of an LLM to invoke external functions (APIs, tools) in a structured way, allowing the model to execute real-world actions.',
    },
    longDescription: {
      'pt-BR': 'Tool calling (ou function calling) é o mecanismo pelo qual um LLM pode decidir chamar uma função externa — como uma API, um banco de dados ou um script — como parte de sua resposta. Em vez de apenas gerar texto, o modelo produz uma estrutura de dados que especifica qual função chamar e com quais parâmetros. O problema observado em produção: modelos melhores às vezes pioram no tool calling. Opus 4.8 e Sonnet 5 inventam campos ao chamar tools fora do padrão do Claude Code, criando risco de integração para quem constrói sobre a API da Anthropic. Para product managers, tool calling é o que transforma um LLM de gerador de texto em agente capaz de executar ações, mas exige validação rigorosa do output.',
      'en': 'Tool calling (or function calling) is the mechanism by which an LLM can decide to call an external function — such as an API, database, or script — as part of its response. Instead of just generating text, the model produces a data structure that specifies which function to call and with which parameters. The problem observed in production: better models sometimes get worse at tool calling. Opus 4.8 and Sonnet 5 invent fields when calling tools outside the Claude Code standard, creating integration risk for those building on the Anthropic API. For product managers, tool calling is what transforms an LLM from a text generator into an agent capable of executing actions, but it requires rigorous output validation.',
    },
    category: { 'pt-BR': 'Técnico', 'en': 'Technical' },
    relatedTerms: ['agentes-de-ia', 'modelos-de-ia', 'seguranca-de-ia'],
  },
  {
    id: 'o-que-e-inferencia-de-ia',
    slug: { 'pt-BR': 'o-que-e-inferencia-de-ia', 'en': 'what-is-ai-inference' },
    term: { 'pt-BR': 'Inferência de IA', 'en': 'AI Inference' },
    definition: {
      'pt-BR': 'Processo de usar um modelo treinado para gerar saídas a partir de novas entradas. É a fase que consome recursos computacionais em produção e define o custo operacional.',
      'en': 'The process of using a trained model to generate outputs from new inputs. It is the phase that consumes computational resources in production and defines operational cost.',
    },
    longDescription: {
      'pt-BR': 'Inferência é a fase onde um modelo de IA já treinado processa novas entradas e gera saídas. Diferente do treino (que acontece uma vez), a inferência acontece a cada chamada em produção, e é o que define o custo operacional de um produto de IA. O custo de inferência depende de três fatores: tamanho do modelo, volume de tokens processados (input + output) e preço do provedor. A ZML lançou LLMD, uma ferramenta de inferência multi-chip gratuita que reduz o lock-in de hardware. Para product managers, otimizar inferência — escolhendo o modelo certo, reduzindo contexto e roteando inteligentemente — é a alavanca principal de FinOps de IA.',
      'en': 'Inference is the phase where an already-trained AI model processes new inputs and generates outputs. Unlike training (which happens once), inference happens on every call in production, and is what defines the operational cost of an AI product. Inference cost depends on three factors: model size, volume of tokens processed (input + output), and provider pricing. ZML released LLMD, a free multi-chip inference tool that reduces hardware lock-in. For product managers, optimizing inference — choosing the right model, reducing context, and routing intelligently — is the primary AI FinOps lever.',
    },
    category: { 'pt-BR': 'Técnico', 'en': 'Technical' },
    relatedTerms: ['modelos-de-ia', 'finops-de-ia'],
  },
];
