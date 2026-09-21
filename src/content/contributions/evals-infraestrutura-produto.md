---
title: "Seu produto de IA precisa lembrar dos próprios erros"
date: "2026-09-21"
seoSlug: "evals-infraestrutura-produto"
excerpt: "Evals transformam falhas reais em uma infraestrutura que acompanha cada mudança de modelo, prompt ou fluxo."
tags: ["produto", "agentes-de-ia", "governanca-de-ia"]
authorId: "ricardo-guia"
translationKey: "ricardo-evals"
featured: true
draft: false
---

Evals transformam falhas reais em uma infraestrutura que acompanha cada mudança de modelo, prompt ou fluxo

Um produto com IA pode continuar rápido, disponível e tecnicamente saudável enquanto entrega respostas piores. O deploy passa, o dashboard fica verde e o problema aparece no resultado: uma decisão sem contexto, uma resposta plausível com o dado errado ou um agente que devolve trabalho em vez de concluir a tarefa.

Essa é uma diferença importante pra quem constrói produto com modelos generativos. Testes tradicionais continuam necessários para saber se a API respondeu, o banco gravou e a ferramenta foi chamada. Eles não conseguem dizer sozinhos se a resposta ficou boa.

Nos agentes que construo aprendi a tratar essa camada como infraestrutura de produto. O nome técnico é eval: um conjunto de casos, critérios e avaliadores que executa a especificação do produto contra o comportamento da IA.

## O mesmo sistema pode mudar sem nenhuma linha quebrar

Num dos meus experimentos mantive a configuração inteira de um agente e troquei apenas o modelo. As ferramentas, a memória e as instruções continuaram iguais. Um modelo recebia a tarefa, escolhia um caminho e executava. O outro devolvia opções, comparações e perguntas de esclarecimento.

Os dois funcionavam. Nenhum gerava erro técnico. A experiência de produto era completamente diferente.

Esse tipo de mudança acontece quando o time troca o modelo, reescreve o prompt, adiciona uma ferramenta ou altera a fonte de dados. Também acontece sem deploy próprio porque o provedor atualiza o modelo por trás da API. A saída continua gramaticalmente correta e o JSON continua válido. O produto só começa a tomar decisões piores em silêncio.

Uma suíte de evals cria uma referência estável para esse ambiente instável. Ela responde perguntas que o monitoramento técnico não alcança: o agente usou a fonte certa? Seguiu a política? Pediu confirmação antes de uma ação crítica? Concluiu a tarefa? A resposta ajudou alguém a decidir ou apenas pareceu convincente?

## A especificação precisa virar algo executável

Todo produto tem uma ideia do que significa “bom”. Em muitos times essa ideia fica espalhada entre o PRD, a cabeça de quem lidera produto, exemplos em documentos e correções feitas no Slack. O modelo recebe uma versão reduzida disso no prompt e o resto vira julgamento manual depois que algo dá errado.

O eval organiza esse conhecimento num gabarito que pode rodar sempre.

O ponto de partida são situações reais. Uma pergunta comum de usuário, uma tarefa que o agente executou bem, uma falha observada em produção e um caso limite que pode causar dano. Cada exemplo precisa carregar o contexto necessário, a saída esperada e os critérios usados para julgar o resultado.

Num agente que pesquisa informações para uma decisão, por exemplo, a rubrica pode verificar cinco coisas: usou fontes permitidas, separou fato de inferência, preservou os números, citou a evidência e parou quando faltou informação. “Resposta boa” deixa de ser uma sensação e vira comportamento observável.

Essa definição não pertence só à engenharia. Produto conhece a promessa feita ao usuário. Operações conhece as exceções. Especialistas do domínio sabem onde uma resposta aparentemente correta pode causar problema. Engenharia transforma essa régua num sistema repetível.

## Código primeiro, IA para o que sobra

Nem todo critério precisa de outro modelo julgando a resposta. Quanto mais objetiva a regra, mais simples deve ser o avaliador.

Código verifica formato, campos obrigatórios, URLs válidas, números preservados, uso de ferramentas permitidas e presença de evidência. Essa camada custa pouco, roda rápido e entrega um resultado reproduzível.

Um modelo avaliador entra quando o critério depende de contexto: a recomendação responde ao pedido, a justificativa está apoiada nas fontes ou o tom respeita a situação. Nesse caso a rubrica precisa ser específica e os exemplos precisam mostrar o que passa e o que falha.

A revisão humana fica nos casos ambíguos, novos ou de alto risco. Ela também calibra os outros avaliadores. Quando código, modelo e pessoa discordam, o conflito costuma revelar uma especificação incompleta.

O desenho mais útil mistura as três camadas: regra determinística para o que pode ser provado, julgamento de modelo para o que depende de linguagem e revisão humana onde o custo do erro justifica atenção.

## Cada falha vira memória do produto

Criar uma rubrica uma vez ajuda no lançamento. O ganho acumulado vem depois.

Quando uma falha aparece em produção, o time abre o rastro da execução e localiza o passo que mudou o resultado. O caso é anonimizado, recebe o comportamento esperado e entra na suíte de regressão. A próxima mudança de modelo, prompt ou ferramenta precisa passar por ele.

Esse processo transforma incidente em memória. O produto para de depender da lembrança de quem viu o problema e passa a carregar a correção junto com o código.

A média geral importa menos do que os casos que falharam. Um score de 90% pode esconder um erro recorrente justamente no fluxo que movimenta dinheiro ou publica algo em nome do usuário. Por isso acompanho os resultados por tarefa, gravidade e etapa do fluxo. Quando um caso quebra, olho o trace antes de mexer no sistema. A nota aponta o problema. O rastro mostra onde corrigir.

Também evito calcular a confiabilidade do agente multiplicando a taxa de acerto de cada passo. As falhas de um fluxo não são independentes. Uma decisão ruim de contexto no começo contamina busca, síntese e ação. Avaliar o resultado final e inspecionar o caminho produz uma leitura mais fiel do produto.

## Evals mudam a conversa de produto

Sem uma suíte de avaliação, a discussão sobre modelos tende a girar em torno de benchmark, preferência pessoal ou demonstração. Com casos próprios, o time consegue comparar mudanças usando o trabalho que o produto precisa executar.

A pergunta deixa de ser “qual modelo parece melhor?” e passa a ser concreta: qual configuração conclui mais tarefas importantes, respeita as regras e custa o suficiente para operar em escala?

Esse gabarito também dá liberdade. Trocar de fornecedor fica menos arriscado. Um prompt pode ser reescrito sem depender de teste manual aleatório. Uma ferramenta nova entra no fluxo com critérios claros. O time consegue avançar porque sabe o que não pode regredir.

Comece pelos erros que já doeram e pelos comportamentos que sustentam a promessa do produto. Versione os casos junto com o sistema, rode a suíte a cada mudança relevante e transforme toda falha nova em regressão permanente.

Modelos mudam o tempo todo. O produto precisa de uma memória própria para continuar sabendo o que significa entregar bem.

## Sobre o autor

Ricardo Guia é executivo de produto e autor da Inteligência à Brasileira, onde escreve sobre IA a partir do olhar de quem constrói sistemas e produtos com ela. Mais em https://iabrasileira.com e https://ricardoguia.com.
