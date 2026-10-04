---
title: "Dots, da OpenAI, age sozinho: agora o PM desenha confiança"
date: "2026-10-04"
seoSlug: "dots-agentes-proativos"
excerpt: "Agentes proativos mudam a pergunta de produto: quais ações podem rodar em segundo plano, quando pedir confirmação e como devolver o controle."
tags: ["inteligencia-artificial", "agentes-de-ia", "governanca-de-ia", "produto"]
featured: true
draft: false
---

Cinco novidades passaram pelo meu filtro hoje, e o que mais pesa para quem trabalha com produto é o Dots, o novo agente proativo de IA da OpenAI. O destaque não é só o que ele consegue fazer: é a mudança de produto que acontece quando o assistente deixa de esperar um comando a cada passo.

O resto do radar passa por prototipação dentro do ChatGPT, edição de imagem mais precisa, modelos rodando local e dados reais de custo e monetização.

## Quando agentes proativos de IA deixam de esperar o comando

A OpenAI apresentou o Dots no DevDay como um agente que pode assumir tarefas contínuas e agir de forma proativa. A página oficial diz que ele é baseado no GPT-6 Astra e tem seu próprio computador na nuvem. No mesmo evento, a empresa também anunciou o GPT-6.1 Sol e o tier de velocidade Ultrafast. A cobertura da [LA NACION comparou o Dots ao Muse, da Meta](https://www.lanacion.com.ar/usa/openai-ceo-announces-new-ai-agent-and-avoids-mention-of-security-concerns-at-developer-conference-nid29092026/).

Quem trabalha com produto sabe que a gente passa muito tempo desenhando telas para o usuário clicar: botão, menu, filtro, confirmação. Agora imagine um produto em que o usuário não precisa iniciar cada etapa porque o assistente já está trabalhando em uma tarefa que recebeu.

Para mim, essa mudança troca a pergunta do PM: sai “qual tela eu desenho?” e entra “o que esse agente pode fazer sozinho, e quando precisa me chamar?”. A resposta define permissões, pontos de confirmação, como mostrar o que foi feito e como desfazer ou compensar uma ação. Essa camada aproxima [governança de IA](/guias/governanca-de-ia/) da [operação de agentes em produção](/guias/operacao-de-agentes-de-ia/).

A reportagem destacou que Sam Altman não abordou preocupações de segurança no palco. Isso descreve o que foi dito durante o anúncio; a [página oficial do Dots detalha salvaguardas do produto](https://openai.com/index/introducing-dots/), como pesquisa proativa somente para leitura, monitoramento de segurança, limites de acesso e revisão de ações que podem exigir aprovação. Essas medidas não eliminam a necessidade de avaliar o risco de cada fluxo. Elas mostram por que desenhar confiança precisa fazer parte da [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/).

Há custo nessa disponibilidade contínua também. Um agente que trabalha em segundo plano tende a consumir mais do que uma interação curta de chat; frequência, duração e velocidade entram na decisão. O próprio produto organiza o trabalho avançado por limites de uso e prevê opções para ampliar velocidade ou volume mensal. Por isso, acompanhar [custos de agentes de IA](/guias/custo-agentes-de-ia/) deixa de ser um detalhe de engenharia.

Sou otimista com esse movimento. Automação que antes dependia de fluxos rígidos tende a ficar mais flexível, abrindo espaço para produtos úteis em muitas áreas, inclusive nas finanças. O desafio é começar com limites claros de permissão, trilha de auditoria e um jeito simples de a pessoa retomar o controle — com o mesmo cuidado que a gente sempre teve ao desenhar usabilidade.

## O resto do radar

- **Sites in ChatGPT** — a OpenAI leva a criação de sites, apps e jogos para dentro do ChatGPT e encurta o caminho entre ideia e protótipo publicado. [Veja o recurso](https://chatgpt.com/features/sites/).
- **FLUX 3 Image (Black Forest Labs)** — edição por caixas delimitadoras abre espaço para controle fino em produtos criativos, com API e licença comercial. [Conheça o modelo](https://bfl.ai/models/flux-3-image).
- **DwarfStar 4, do criador do Redis** — inferência local compatível com APIs da OpenAI e da Anthropic pode viabilizar protótipos privados e de baixo custo. [Acesse o projeto](https://dwarfstar.sh/).
- **Um mês programando com GLM 5.3 Flash (Wagtail)** — traz números reais de custo e de seleção de modelos para times que constroem com IA. [Leia o relato](https://wagtail.org/blog/one-month-on-glm-53-flash/).
- **Como monetizar funcionalidades de IA (Lenny's Newsletter)** — o custo variável por uso exige decidir entre incluir IA no pacote, vender como adicional ou cobrar pelo consumo. [Leia a edição](https://www.lennysnewsletter.com/p/how-should-you-monetize-your-ai-features).

Amanhã volto com mais um recorte do que apareceu por aí.
