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
    productImpact: {
      'pt-BR': 'Na decisão de produto, use agent washing como teste de honestidade da proposta. Peça evidência de autonomia, memória, uso de ferramentas e recuperação após erro. Compare o fluxo declarado com logs reais e identifique onde regras determinísticas fazem o trabalho. A métrica não é quantas vezes a palavra agente aparece, mas quantas etapas o sistema conclui com qualidade, limites claros e intervenção humana conhecida. Se o produto não sustenta essa evidência, descreva-o como automação assistida.',
      'en': 'In product decisions, use agent washing as an honesty test for the proposition. Ask for evidence of autonomy, memory, tool use, and recovery after failure. Compare the claimed workflow with real logs and identify where deterministic rules do the work. The metric is not how often the word agent appears, but how many steps the system completes with quality, clear limits, and known human intervention. If the product cannot support that evidence, describe it as assisted automation.',
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
    productImpact: {
      'pt-BR': 'Trate FinOps de IA como uma decisão de margem por funcionalidade. Registre custo de input, output, ferramentas, armazenamento e revisão humana para cada tarefa concluída corretamente. Separe custo médio de cauda e picos, porque poucos fluxos longos podem dominar a fatura. Defina orçamento, alerta e fallback antes do lançamento. A métrica central deve combinar custo por tarefa válida com valor entregue; reduzir tokens sem preservar qualidade apenas transfere custo para suporte, retrabalho ou risco.',
      'en': 'Treat AI FinOps as a margin decision for each feature. Record input, output, tools, storage, and human review costs for every correctly completed task. Separate average cost from tail and peak behavior because a few long workflows can dominate the bill. Define budgets, alerts, and fallbacks before launch. The central metric should combine cost per valid task with value delivered; reducing tokens without preserving quality merely transfers cost to support, rework, or risk.',
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
    productImpact: {
      'pt-BR': 'Use destilação quando a tarefa é estável, repetitiva e possui exemplos de qualidade suficientes. Antes de trocar o modelo geral por um menor, crie um conjunto de avaliação com casos comuns, cauda e falhas caras. Compare qualidade, latência, custo e manutenção, não apenas acurácia média. Mantenha rota de fallback para o modelo maior e monitore mudança de distribuição. O ganho só é real quando o modelo destilado preserva o resultado que o usuário percebe e reduz o custo total de operação.',
      'en': 'Use distillation when the task is stable, repetitive, and supported by enough quality examples. Before replacing a general model with a smaller one, create an evaluation set with common cases, tail cases, and expensive failures. Compare quality, latency, cost, and maintenance, not only average accuracy. Keep a fallback route to the larger model and monitor distribution shifts. The gain is real only when the distilled model preserves the outcome users perceive and reduces total operating cost.',
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
    productImpact: {
      'pt-BR': 'Para decidir por RAG, confirme primeiro que a resposta depende de conhecimento privado, atualizado ou citável. Meça recuperação antes de geração: se o documento correto não chega ao contexto, um modelo melhor apenas produz uma resposta mais convincente sobre evidência errada. Versione fontes, registre trechos usados e defina comportamento quando não houver evidência suficiente. Acompanhe recall, precisão, custo de contexto, latência e taxa de respostas sem suporte. RAG deve aumentar rastreabilidade, não esconder incerteza atrás de texto fluente.',
      'en': 'Before choosing RAG, confirm that the answer depends on private, current, or citable knowledge. Measure retrieval before generation: if the right document does not reach the context, a better model only produces a more convincing answer from the wrong evidence. Version sources, record the passages used, and define behavior when evidence is insufficient. Track recall, precision, context cost, latency, and unsupported-answer rate. RAG should improve traceability, not hide uncertainty behind fluent text.',
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
    productImpact: {
      'pt-BR': 'Avalie MCP como contrato de integração, não como benefício isolado para o usuário. Liste ferramentas, permissões, dados expostos e efeitos colaterais antes de conectar um agente. Cada servidor precisa de autenticação, escopo mínimo, timeout, observabilidade e revogação. Teste nomes e schemas de ferramentas com os modelos usados em produção, porque pequenas ambiguidades alteram a escolha do agente. O resultado esperado é reduzir custo de integração sem criar uma superfície invisível de acesso. A métrica útil combina sucesso de chamadas, falhas seguras e tempo de recuperação.',
      'en': 'Evaluate MCP as an integration contract, not as a standalone user benefit. List tools, permissions, exposed data, and side effects before connecting an agent. Every server needs authentication, minimum scope, timeouts, observability, and revocation. Test tool names and schemas with the production models because small ambiguities change agent selection. The expected outcome is lower integration cost without creating an invisible access surface. Useful metrics combine call success, safe failures, and recovery time.',
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
    productImpact: {
      'pt-BR': 'Um agent gateway passa a fazer sentido quando várias equipes, modelos ou ferramentas precisam compartilhar políticas. Centralize identidade, autorização, limites de gasto, roteamento e logs, mas preserve responsáveis claros por cada fluxo. Antes de comprar ou construir, estime o custo de manter essas regras espalhadas e compare com o risco de criar um ponto único de falha. Meça bloqueios corretos, falsos positivos, latência adicionada e tempo para investigar incidentes. O gateway deve reduzir variabilidade operacional sem esconder decisões críticas das equipes de produto.',
      'en': 'An agent gateway becomes useful when several teams, models, or tools must share policies. Centralize identity, authorization, spending limits, routing, and logs while preserving clear owners for every workflow. Before buying or building, estimate the cost of maintaining those rules separately and compare it with the risk of creating a single point of failure. Measure correct blocks, false positives, added latency, and incident investigation time. The gateway should reduce operational variability without hiding critical decisions from product teams.',
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
    productImpact: {
      'pt-BR': 'Use SWE-Bench para comparar capacidade geral de coding agents, nunca como previsão direta da produtividade da sua equipe. Verifique a versão do benchmark, tarefas excluídas, ambiente e taxa de contaminação antes de citar um ranking. Depois crie uma avaliação interna com repositórios, padrões e tipos de mudança reais. Meça solução correta, regressões, tempo de revisão, custo e severidade do erro. Uma pontuação pública alta só importa quando se traduz em mudanças confiáveis no seu contexto de engenharia e no seu processo de entrega.',
      'en': 'Use SWE-Bench to compare the general capability of coding agents, never as a direct forecast of your team’s productivity. Check the benchmark version, excluded tasks, environment, and contamination rate before citing a ranking. Then create an internal evaluation with real repositories, standards, and change types. Measure correct resolution, regressions, review time, cost, and failure severity. A high public score matters only when it translates into reliable changes in your engineering context and delivery process.',
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
    productImpact: {
      'pt-BR': 'Comece evals pela decisão que será tomada com o resultado. Colete exemplos reais, defina o que conta como sucesso e dê peso maior às falhas de alto impacto. Separe conjunto de desenvolvimento e teste para não otimizar o produto contra a própria prova. Combine avaliação automática com revisão humana calibrada e acompanhe desacordo entre avaliadores. Publique versões do dataset, prompt e modelo. A métrica útil não é uma nota única: é a distribuição de qualidade, risco e custo nos casos que representam o uso em produção.',
      'en': 'Start evals with the decision that will be made from the result. Collect real examples, define what counts as success, and assign greater weight to high-impact failures. Separate development and test sets so the product is not optimized against its own exam. Combine automated evaluation with calibrated human review and track evaluator disagreement. Version the dataset, prompt, and model. The useful metric is not one score but the distribution of quality, risk, and cost across cases that represent production use.',
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
    productImpact: {
      'pt-BR': 'Trate cada tool call como uma operação de software sujeita a entrada inválida, repetição e efeito colateral. Use schemas estreitos, validação no servidor, idempotência e confirmação explícita para ações irreversíveis. Não confie na escolha de ferramenta ou nos argumentos apenas porque o JSON é válido. Registre intenção, parâmetros validados, resultado e erro de forma auditável. Meça chamadas corretas, retries, recusas seguras e impacto de falhas. O modelo propõe a ação; a aplicação continua responsável por autorização e execução.',
      'en': 'Treat every tool call as a software operation exposed to invalid input, repetition, and side effects. Use narrow schemas, server-side validation, idempotency, and explicit confirmation for irreversible actions. Do not trust tool selection or arguments merely because the JSON is valid. Record intent, validated parameters, result, and error in an auditable form. Measure correct calls, retries, safe refusals, and failure impact. The model proposes the action; the application remains responsible for authorization and execution.',
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
    productImpact: {
      'pt-BR': 'Gerencie inferência como uma cadeia de serviço, não apenas uma tarifa por milhão de tokens. Inclua fila, cache, rede, ferramentas, retries e revisão humana na latência e no custo percebidos pelo usuário. Defina SLO por caso de uso e roteie tarefas simples para modelos menores quando a avaliação permitir. Monitore tokens, tempo até primeiro token, duração total, erro e custo por tarefa concluída. A melhor otimização é a que preserva qualidade e previsibilidade, especialmente nos picos e nos casos longos.',
      'en': 'Manage inference as a service chain, not merely a price per million tokens. Include queues, cache, network, tools, retries, and human review in the latency and cost users perceive. Define an SLO for each use case and route simple tasks to smaller models when evaluations allow it. Monitor tokens, time to first token, total duration, errors, and cost per completed task. The best optimization preserves quality and predictability, especially during peaks and long-tail cases.',
    },
    category: { 'pt-BR': 'Técnico', 'en': 'Technical' },
    relatedTerms: ['modelos-de-ia', 'finops-de-ia'],
  },
];
