---
title: "Spec Kit na prática: tutorial de SDD para Product Managers e Tech Leads"
seoTitle: "Spec Kit: tutorial de SDD para PMs e Tech Leads"
description: "Aprenda a usar o GitHub Spec Kit em SDD para transformar uma ideia em especificação, plano, tarefas e código verificável com PM, Tech Lead e agentes de IA."
datePublished: "2026-08-27"
dateModified: "2026-08-27"
tags: ["Spec Kit", "Spec-Driven Development", "SDD", "Product Management", "Tech Leadership", "Cursor", "Codex", "Claude Code"]
alternateSlug: "spec-kit-spec-driven-development"
cluster: product
isHub: false
sources:
  - name: "GitHub Spec Kit — Quick Start"
    url: "https://github.github.com/spec-kit/quickstart.html"
  - name: "GitHub Spec Kit — What is Spec-Driven Development?"
    url: "https://github.github.com/spec-kit/concepts/sdd.html"
  - name: "GitHub Spec Kit — Agentic SDD"
    url: "https://github.github.com/spec-kit/reference/agentic-sdd.html"
  - name: "GitHub Spec Kit — Integrations"
    url: "https://github.github.com/spec-kit/reference/integrations.html"
  - name: "GitHub Spec Kit — Existing Projects"
    url: "https://github.github.com/spec-kit/guides/existing-projects.html"
  - name: "Microsoft Learn — Spec-driven development with GitHub Spec Kit"
    url: "https://learn.microsoft.com/en-us/training/modules/spec-driven-development-github-spec-kit-greenfield-intro/"
  - name: "Cursor — Rules for AI"
    url: "https://docs.cursor.com/context/rules-for-ai"
  - name: "OpenAI Codex — Codex CLI reference"
    url: "https://help.openai.com/en/articles/11096431"
  - name: "Anthropic — Claude Code getting started"
    url: "https://docs.anthropic.com/en/docs/claude-code/getting-started"
  - name: "Google Search Central — AI features and your website"
    url: "https://developers.google.com/search/docs/appearance/ai-features"
howToSteps:
  - name: "Constitution"
    text: "Registre os princípios e restrições duráveis do produto e do time antes de detalhar a funcionalidade."
  - name: "Specify"
    text: "Descreva o que será construído, por que isso importa, para quem e quais são os limites, sem decidir a implementação ainda."
  - name: "Clarify"
    text: "Resolva ambiguidades relevantes com perguntas direcionadas antes que elas se transformem em decisões implícitas."
  - name: "Plan"
    text: "Converta a especificação aprovada em uma abordagem técnica, incluindo arquitetura, stack, interfaces, dados, riscos e testes."
  - name: "Checklist"
    text: "Revise qualidade, completude e rastreabilidade dos requisitos, separando cobertura planejada de evidência de teste."
  - name: "Tasks"
    text: "Quebre o plano em tarefas pequenas, ordenadas por dependência e associadas aos artefatos que precisam mudar."
  - name: "Analyze"
    text: "Faça uma leitura de consistência entre constituição, especificação, plano, checklist e tarefas antes de escrever código."
  - name: "Implement"
    text: "Execute as tarefas aprovadas e registre separadamente os resultados de validação produzidos durante a implementação."
  - name: "Converge"
    text: "Compare código e artefatos, registre divergências e abra encaminhamentos quando a entrega ainda não convergir."
faq:
  - question: "O que é o GitHub Spec Kit?"
    answer: "É um toolkit open source do GitHub para trabalhar com Spec-Driven Development. Ele organiza o desenvolvimento em artefatos como constituição, especificação, plano, checklist e tarefas, que orientam um agente de código sem transferir a decisão para a IA."
  - question: "Como instalar o Spec Kit?"
    answer: "Com Git, Python 3.11 ou superior e uv disponíveis, instale a CLI com `uv tool install specify-cli` e inicialize o projeto com `specify init . --integration <key>`, substituindo `<key>` por `cursor-agent`, `codex` ou `claude`."
  - question: "Como usar o Spec Kit no Cursor?"
    answer: "Inicialize o projeto com `specify init . --integration cursor-agent` e use o agente integrado ao repositório. Regras em `.cursor/rules/` podem complementar o contexto do projeto, mas não substituem a especificação nem a aprovação humana."
  - question: "Como usar o Spec Kit com Codex?"
    answer: "Inicialize com `specify init . --integration codex` e conduza as fases pelo Codex no repositório. Mantenha instruções gerais do projeto em `AGENTS.md` quando fizer sentido, sem confundir essas instruções com requisitos do produto."
  - question: "Como usar o Spec Kit com Claude Code?"
    answer: "Inicialize com `specify init . --integration claude` e execute o fluxo pelo Claude Code. Um `CLAUDE.md` pode guardar contexto e convenções do projeto, enquanto a especificação continua sendo a fonte das decisões daquela mudança."
  - question: "Qual é a responsabilidade do Product Manager no fluxo SDD?"
    answer: "O Product Manager é dono do problema, do usuário, do resultado esperado, das prioridades, dos limites de escopo e da aprovação das decisões de produto. O agente pode ajudar a explorar e redigir, mas não transforma hipótese em evidência."
  - question: "SDD substitui discovery, TDD ou Product Management?"
    answer: "Não. SDD estrutura intenção e execução; não automatiza discovery, não substitui TDD ou outros testes e não substitui Product Management. As práticas podem se complementar dentro do mesmo ciclo."
  - question: "Como evitar o desvio da especificação (spec drift) no ciclo completo?"
    answer: "Use analyze antes da implementação e converge depois dela para comparar código, especificação, plano, checklist e tarefas. Registre mudanças, peça aprovação para decisões novas e abra encaminhamentos quando o código ou os artefatos não convergirem."
draft: false
---

Uma funcionalidade pode parecer simples no chat e ainda esconder decisões importantes: quem pode usar, o que acontece quando há erro, quais dados serão persistidos, o que fica fora do escopo e como saberemos se o resultado funcionou. É por isso que um prompt único raramente é uma boa especificação de produto.

Este tutorial mostra **como usar o Spec Kit** em um fluxo de Spec-Driven Development (SDD) entre Product Manager, Tech Lead e agente de código. O exemplo é deliberadamente concreto: uma funcionalidade de lista de favoritos para artigos de um produto web. A tese é simples: PM e Tech Lead continuam donos das decisões; Cursor, Codex ou Claude Code aceleram exploração, documentação e execução.

## Resposta direta: o que são Spec Kit e SDD?

O [GitHub Spec Kit](https://github.github.com/spec-kit/) é um toolkit open source para organizar desenvolvimento orientado por especificações. Em vez de pedir que um agente salte diretamente de uma ideia para o código, o fluxo constrói e relaciona artefatos de intenção, requisitos, abordagem técnica e tarefas.

**Spec-Driven Development (SDD)** é a prática de tratar uma especificação rica como contrato de trabalho antes e durante a implementação. A documentação do Spec Kit resume o núcleo como **Spec → Plan → Tasks → Implement** e amplia o caminho com etapas de esclarecimento, análise e convergência. O objetivo não é produzir burocracia: é tornar explícito o que está sendo decidido e reduzir espaço para que o agente preencha lacunas com suposições.

O guia oficial descreve uma progressão de refinamento: `what` e `why` vêm antes de `how`; a implementação só deve avançar quando as decisões relevantes estiverem claras. O [Microsoft Learn](https://learn.microsoft.com/en-us/training/modules/spec-driven-development-github-spec-kit-greenfield-intro/) apresenta a mesma ideia como uma forma de transformar intenção em especificação, plano, tarefas e código com checkpoints humanos.

## O que SDD não é

SDD ajuda a organizar o trabalho, mas não resolve sozinho tudo o que um time de produto precisa resolver.

- **Não é automação de discovery.** Um agente pode resumir entrevistas fornecidas, agrupar sinais e sugerir perguntas. Ele não substitui conversar com usuários, verificar evidências ou decidir se um problema merece investimento.
- **Não é substituto de TDD.** Uma checklist de requisitos verifica cobertura do comportamento especificado. Testes unitários, de integração, contrato, interface e outros continuam sendo decisões da estratégia técnica.
- **Não é substituto de Product Management.** O PM ainda define problema, resultado, prioridade, trade-offs e limites. SDD dá forma às decisões; não cria evidência de mercado.
- **Não é autorização automática para mudar o produto.** Se o agente encontrar uma decisão nova, ela deve voltar ao PM e ao Tech Lead antes de virar comportamento permanente.

## O fluxo entre PM, Tech Lead e agente de código

O fluxo funciona melhor quando cada participante tem uma responsabilidade clara:

| Momento | Product Manager | Tech Lead | Agente de código |
| --- | --- | --- | --- |
| Intenção | Explica problema, usuário, resultado e prioridade | Expõe restrições técnicas e riscos conhecidos | Organiza contexto e aponta lacunas |
| Especificação | Aprova comportamento, escopo e critérios | Questiona ambiguidade, segurança, dados e operação | Redige alternativas e perguntas |
| Plano | Confirma que a solução ainda atende o resultado | Decide abordagem técnica e dependências | Explora o repositório e propõe plano |
| Execução | Valida decisões que alteram produto | Revisa mudanças e evidências de execução | Implementa tarefas e atualiza artefatos |
| Convergência | Aceita ou rejeita divergências de comportamento | Aceita ou rejeita divergências técnicas | Compara código com os artefatos e abre encaminhamentos (follow-ups) |

O agente não é um terceiro aprovador. Ele é um acelerador com capacidade de leitura, escrita e execução, conforme a integração e as permissões adotadas pelo time. A aprovação continua sendo humana.

## Pré-requisitos

Para seguir o quick start atual do Spec Kit, tenha:

- um repositório Git;
- Python 3.11 ou superior;
- [uv](https://docs.astral.sh/uv/) instalado;
- um agente compatível configurado — neste tutorial, Cursor, Codex ou Claude Code.

Em um projeto existente, escolha uma branch ou ponto de restauração e comece por uma mudança delimitada. O [guia de existing projects](https://github.github.com/spec-kit/guides/existing-projects.html) recomenda estabelecer uma linha de base e evitar recriar o sistema inteiro apenas para adotar o fluxo.

## Instalação e inicialização

Instale a CLI do Spec Kit com:

```bash
uv tool install specify-cli
```

Dentro da pasta do projeto, inicialize a integração escolhida:

```bash
specify init . --integration <key>
```

Substitua `<key>` por uma das chaves documentadas para este tutorial. Estes são os três comandos prontos; escolha e execute apenas o correspondente ao agente que sua dupla adotou:

```bash
specify init . --integration cursor-agent
specify init . --integration codex
specify init . --integration claude
```

As chaves selecionam a integração do agente; não são uma promessa de que os três produtos tenham a mesma interface, permissões ou modelo de execução. Consulte a [referência oficial de integrações](https://github.github.com/spec-kit/reference/integrations.html) para o estado atual. Em um projeto novo, o quick start também mostra a inicialização em uma pasta nomeada, como `specify init taskify`; aqui usamos `.` para trabalhar no repositório atual.

Depois disso, o agente escolhido pode conduzir as fases pelo mecanismo de instruções que ele suporta. A integração do Spec Kit e os arquivos opcionais de contexto do projeto são camadas diferentes. Conforme a integração, as skills do Spec Kit podem ficar disponíveis em diretórios como `.cursor/skills/`, `.agents/skills/` ou `.claude/skills/`; verifique o que a CLI gerou para o agente selecionado. Alguns agentes usam comandos ou skills do Spec Kit; outros podem receber os prompts abaixo em sua interface. O importante é preservar os artefatos e as aprovações, não decorar uma sintaxe específica do agente.

## As nove fases do SDD na prática

O caminho completo atual é:

`constitution → specify → clarify → plan → checklist → tasks → analyze → implement → converge`

Existe também um caminho curto — `specify → plan → tasks → implement → converge` — para situações em que os princípios já estão registrados, o contexto é conhecido e o risco de ambiguidade é baixo. O caminho curto é uma decisão do time, não uma licença para pular revisão. Para a primeira funcionalidade de favoritos, use o caminho completo.

### 1. Constitution: princípios e limites duráveis

**Objetivo.** Registrar princípios do produto e do time que devem valer para várias mudanças: privacidade, acessibilidade, observabilidade, segurança, compatibilidade, padrões de revisão e critérios de qualidade. A constitution não é o lugar para descrever cada detalhe de favoritos.

**Dono humano principal.** Ambos: o PM traz princípios de produto e experiência; o Tech Lead traz princípios técnicos e operacionais.

**Prompt copiável.**

```text
Ajude a criar ou revisar a constitution deste produto. Use apenas o contexto disponível no repositório e marque como hipótese qualquer ponto não comprovado. Sugira princípios duráveis para produto, acessibilidade, privacidade, segurança, observabilidade, qualidade e revisão. Não escolha a implementação da lista de favoritos ainda. Separe fatos conhecidos, hipóteses, decisões que precisam de aprovação e evidências ausentes. Termine com as perguntas que PM e Tech Lead precisam responder.
```

**Artefato esperado.** Uma constitution versionada, curta e aplicável a futuras funcionalidades, com princípios e restrições explícitos.

**Pergunta de aprovação.** “Esses princípios representam como queremos construir e operar o produto, ou algum deles é apenas uma preferência desta funcionalidade?”

**Correção quando incompleto.** Remova detalhes locais, adicione princípios que faltam e marque conflitos para decisão conjunta. Se a equipe ainda não consegue dizer por que um princípio é durável, não o trate como regra aprovada.

### 2. Specify: o que e por que

**Objetivo.** Capturar o problema, usuários, resultado esperado, comportamento observável, escopo, fora de escopo e critérios de aceitação sem começar pela stack. A documentação do [Agentic SDD](https://github.github.com/spec-kit/reference/agentic-sdd.html) enfatiza que specify deve responder ao que e ao porquê, não prescrever o como.

**Dono humano principal.** Product Manager, com revisão do Tech Lead.

**Prompt copiável.**

```text
Crie uma especificação para uma lista de favoritos em um produto web de artigos. O usuário deve conseguir marcar um artigo como favorito e visualizar sua lista de favoritos. Descreva usuário, problema, resultado esperado, histórias de usuário, critérios de aceitação, fora de escopo, casos de erro e perguntas em aberto. Não escolha framework, banco, endpoint ou arquitetura. Separe fatos fornecidos, hipóteses a validar, decisões propostas e evidências necessárias. Não invente que algo foi implementado ou testado.
```

**Artefato esperado.** Uma especificação de produto legível, com requisitos testáveis e limites de escopo; nenhum detalhe técnico é obrigatório nesta fase.

**Pergunta de aprovação.** “Se uma pessoa implementar apenas este documento, ela saberá qual comportamento entregar e como reconhecer sucesso sem adivinhar uma decisão de produto?”

**Correção quando incompleto.** Volte ao problema e peça exemplos de sucesso, falha, estado vazio, autenticação, duplicidade e remoção. Se o agente sugerir uma tecnologia, mova a sugestão para uma seção de hipótese técnica ou aguarde plan.

### 3. Clarify: resolver ambiguidades relevantes

**Objetivo.** Fazer perguntas direcionadas sobre lacunas que podem mudar escopo, risco, UX ou arquitetura. Clarify não deve virar uma entrevista infinita: priorize ambiguidades com consequência real.

**Dono humano principal.** Ambos.

**Prompt copiável.**

```text
Leia a especificação de favoritos e faça somente perguntas de clarificação que possam alterar comportamento, escopo, risco, dados ou critérios de aceitação. Organize cada pergunta por impacto e proponha opções sem escolher por nós. Inclua casos como usuário anônimo, artigo removido, sincronização entre dispositivos, ordenação, paginação, erro de persistência, acessibilidade e telemetria. Para cada resposta recebida, registre se é fato, hipótese validada ou decisão aprovada. Não escreva o plano técnico ainda.
```

**Artefato esperado.** Perguntas respondidas, decisões adicionadas à especificação e um registro do que continua desconhecido.

**Pergunta de aprovação.** “Restou alguma ambiguidade capaz de fazer duas pessoas implementarem comportamentos incompatíveis?”

**Correção quando incompleto.** Não avance por conveniência. Faça uma rodada menor de perguntas, consulte evidências de produto quando necessário e atualize a especificação com a resposta e seu responsável. Uma hipótese não respondida deve permanecer marcada como hipótese.

### 4. Plan: como construir

**Objetivo.** Transformar o comportamento aprovado em uma abordagem técnica: componentes, dados, interfaces, dependências, migração, segurança, observabilidade, testes e riscos. O plan é o lugar do how e da stack.

**Dono humano principal.** Tech Lead, com aprovação do PM para impactos de produto, prazo, risco ou operação.

**Prompt copiável.**

```text
Com base somente na especificação e nas decisões aprovadas da lista de favoritos, proponha um plano técnico. Inspecione o repositório antes de sugerir mudanças. Descreva arquitetura e componentes existentes a reutilizar, modelo de dados, interfaces, estados de erro, autorização, acessibilidade, observabilidade, estratégia de testes, migrações e riscos. Compare alternativas quando houver trade-off. Separe fatos observados no código, hipóteses técnicas, decisões recomendadas, evidências de inspeção e itens que exigem aprovação. Não implemente nada.
```

**Artefato esperado.** Plano técnico ligado aos requisitos, com arquivos ou áreas afetadas, dependências, riscos e estratégia de validação.

**Pergunta de aprovação.** “Este plano é viável no sistema atual, preserva o comportamento aprovado e torna explícitos os riscos que estamos aceitando?”

**Correção quando incompleto.** Peça inspeção de áreas específicas do repositório, exija alternativas para decisões irreversíveis e devolva ao specify qualquer conflito de comportamento. Stack escolhida sem evidência deve ser rebaixada a hipótese ou justificada pelo Tech Lead.

### 5. Checklist: revisar os requisitos

**Objetivo.** Fazer uma revisão de qualidade, completude e rastreabilidade dos requisitos. A checklist verifica se cada requisito aprovado está representado e se pode ser acompanhado até uma tarefa ou forma de validação; ela não é um teste de implementação nem uma prova de que o código foi executado.

**Dono humano principal.** Ambos.

**Prompt copiável.**

```text
Converta a especificação de favoritos em uma checklist de revisão de qualidade, completude e rastreabilidade. Cubra o caminho feliz, estados vazios, marcação e desmarcação, persistência, autorização, artigo indisponível, erros, acessibilidade, responsividade, privacidade, observabilidade e fora de escopo. Para cada item, aponte a seção da especificação que o sustenta, a tarefa relacionada e a forma de validação esperada. Marque lacunas, contradições e itens que exigem teste automatizado ou revisão humana, sem registrar resultado de execução nesta fase.
```

**Artefato esperado.** Checklist de revisão com requisitos completos, rastreáveis e sem contradições, distinguindo cobertura prevista de evidência de teste a ser produzida depois.

**Pergunta de aprovação.** “Cada critério importante tem uma forma clara de verificação, e a checklist não introduziu requisito que o PM não aprovou?”

**Correção quando incompleto.** Relacione cada item à especificação, tarefa ou remova-o. Quando um requisito não é observável, reescreva-o como comportamento ou resultado verificável. Quando a validação é visual ou de negócio, deixe claro que depende de revisão humana e não a trate como realizada antes da execução.

### 6. Tasks: ordenar a execução

**Objetivo.** Quebrar o plano em tarefas pequenas, implementáveis e ordenadas por dependência. Tasks devem apontar os artefatos que mudam, mas não devem reabrir decisões já aprovadas sem registrar a mudança.

**Dono humano principal.** Tech Lead, com revisão do PM para tarefas que alteram comportamento ou escopo.

**Prompt copiável.**

```text
Quebre o plano aprovado da lista de favoritos em tarefas pequenas e ordenadas por dependência. Inclua mudanças de interface, domínio, persistência, autorização, estados de erro, testes e documentação quando aplicável. Para cada tarefa, informe objetivo, pré-requisitos, arquivos ou áreas prováveis, requisito coberto e evidência esperada. Não crie tarefas para funcionalidades fora de escopo. Se encontrar uma decisão nova, pare e sinalize para PM e Tech Lead em vez de assumi-la.
```

**Artefato esperado.** Lista de tarefas ordenada por dependências, com rastreabilidade para requisitos e plano.

**Pergunta de aprovação.** “Outra pessoa consegue executar cada tarefa sem descobrir uma decisão de produto escondida no meio da implementação?”

**Correção quando incompleto.** Divida tarefas grandes, corrija dependências, adicione a referência ao requisito e remova trabalho não aprovado. Se uma tarefa depender de informação ausente, crie uma tarefa de decisão ou volte para clarify.

### 7. Analyze: consistência antes do código

**Objetivo.** Fazer uma leitura de consistência entre constitution, especificação, respostas de clarify, plano, checklist e tasks. O [Agentic SDD do Spec Kit](https://github.github.com/spec-kit/reference/agentic-sdd.html) trata analyze como uma etapa de leitura, não como autorização para mudar tudo silenciosamente.

**Dono humano principal.** Tech Lead, com participação do PM na consistência de produto.

**Prompt copiável.**

```text
Faça uma análise somente de leitura dos artefatos de favoritos. Procure conflitos, requisitos sem tarefa, tarefas sem requisito, decisões técnicas que contradizem o comportamento, hipóteses apresentadas como fatos, critérios sem evidência e riscos sem responsável. Liste cada achado com severidade, artefatos envolvidos e correção sugerida. Não edite arquivos nem marque a implementação como válida.
```

**Artefato esperado.** Relatório de inconsistências e uma decisão explícita sobre o que corrigir antes de implementar.

**Pergunta de aprovação.** “Os artefatos contam a mesma história e sabemos quais riscos ainda estão aceitos?”

**Correção quando incompleto.** Corrija a fonte do conflito, não apenas a cópia mais conveniente. Atualize a especificação se o comportamento mudou; atualize plan ou tasks se apenas a abordagem mudou; rode analyze novamente até não restarem conflitos relevantes.

### 8. Implement: executar com evidência

**Objetivo.** Executar as tarefas aprovadas, mantendo o vínculo com requisitos e checklist. O agente pode ler, editar e executar comandos conforme suas permissões, mas toda saída precisa ser distinguida de uma decisão humana.

**Dono humano principal.** Tech Lead durante a execução; PM aprova mudanças de comportamento.

**Prompt copiável.**

```text
Implemente somente as tarefas aprovadas da lista de favoritos, na ordem de dependência. Antes de cada mudança, consulte a especificação, o plano e a tarefa correspondente. Preserve padrões existentes do repositório. Não invente comportamento para lacunas: pare e sinalize a decisão. Ao final de cada tarefa, registre arquivos alterados, comandos executados, resultados observados, testes não executados e itens da checklist cobertos. Diferencie fatos de execução, hipóteses e decisões que ainda precisam de aprovação. Não declare sucesso sem evidência.
```

**Artefato esperado.** Código e testes/documentação previstos, junto de um registro separado dos resultados de validação realmente produzidos. A checklist da fase anterior indica cobertura e rastreabilidade; não funciona como prova de execução.

**Pergunta de aprovação.** “A implementação entregue corresponde à especificação e temos evidência suficiente para revisar comportamento, qualidade e risco?”

**Correção quando incompleto.** Pare em falhas de teste ou decisões novas, investigue a causa e registre o resultado. Se o código revelar que a especificação não é viável, volte a plan ou specify conforme a natureza da mudança; não altere requisitos silenciosamente.

### 9. Converge: verificar e fechar o ciclo

**Objetivo.** Comparar o código e as evidências com especificação, plano, checklist e tasks. Converge identifica divergências que não apareceram antes e cria encaminhamentos quando a entrega ainda não está alinhada.

**Dono humano principal.** Ambos: o Tech Lead avalia a convergência técnica; o PM avalia comportamento e resultado de produto.

**Prompt copiável.**

```text
Compare o estado atual do código da lista de favoritos com a constitution, a especificação, as decisões de clarify, o plano, a checklist e as tarefas. Classifique cada requisito como coberto, parcialmente coberto, não coberto ou não verificável, citando a evidência disponível. Procure desvio entre especificação e código, comportamento fora de escopo, documentação desatualizada, testes ausentes e divergências técnicas. Proponha encaminhamentos ordenados por risco. Não encerre como concluído se houver divergência relevante ou evidência faltante.
```

**Artefato esperado.** Matriz de convergência, checklist final honesta, decisões de aceite e encaminhamentos versionados quando necessário.

**Pergunta de aprovação.** “PM e Tech Lead aceitam a relação entre intenção, código e evidência, ou existe alguma divergência que deve voltar ao fluxo?”

**Correção quando incompleto.** Abra um encaminhamento para código, teste ou documentação; reabra specify quando o produto mudou; reabra plan quando a solução técnica mudou. Em seguida, repita analyze e converge no escopo afetado.

## Exemplo completo: lista de favoritos para artigos

O exemplo abaixo mostra como transformar uma ideia curta em requisitos concretos. Ele não afirma que o código foi escrito ou executado; é uma amostra de especificação para o fluxo.

### Histórias de usuário

1. **Marcar um artigo.** Como pessoa autenticada que encontrou um artigo útil, quero marcá-lo como favorito para reencontrá-lo depois.
2. **Desmarcar um artigo.** Como pessoa autenticada, quero remover um artigo dos favoritos quando ele deixar de ser relevante.
3. **Consultar favoritos.** Como pessoa autenticada, quero abrir uma lista com meus artigos favoritos para continuar a leitura.
4. **Ter um estado vazio compreensível.** Como pessoa autenticada sem favoritos, quero saber que a lista está vazia e como adicionar o primeiro item.

### Critérios de aceitação

- Dado que a pessoa está autenticada e o artigo existe, quando ela marca o artigo, então o estado visual muda para favorito e a associação é persistida para aquela conta.
- Dado que o artigo já é favorito, quando a pessoa o desmarca, então ele deixa de aparecer na lista de favoritos após a confirmação da operação.
- Dado que a pessoa abre a lista, então vê somente os artigos que favoritou e consegue distinguir carregamento, lista vazia e erro.
- Dado que a pessoa não tem favoritos, então vê uma mensagem de estado vazio com uma ação para voltar a explorar artigos.
- Dado que o mesmo comando de marcar seja repetido, então não são criadas associações duplicadas.
- Dado que o artigo tenha sido removido ou esteja indisponível, então a lista informa o estado de forma compreensível e não expõe conteúdo que a pessoa não pode acessar.
- Dado que a persistência falhe, então a interface informa que a ação não foi confirmada e não apresenta o item como salvo sem evidência.
- O controle de favorito tem nome acessível, estado perceptível sem depender apenas de cor e comportamento utilizável por teclado.

### Separando fato, hipótese, decisão e evidência

Para evitar que um agente preencha lacunas, cada artefato pode usar quatro rótulos:

| Rótulo | Exemplo no caso de favoritos |
| --- | --- |
| **Fato** | O repositório já possui autenticação e uma página de artigos — somente se a inspeção confirmar isso. |
| **Hipótese** | Usuários autenticados provavelmente esperam que favoritos sincronizem entre dispositivos — precisa de validação. |
| **Decisão** | A primeira versão terá apenas artigos, sem pastas ou compartilhamento — aprovação do PM. |
| **Evidência de execução** | Um teste, comando ou revisão visual produziu um resultado observável — registrar o que realmente ocorreu. |

Esse vocabulário melhora clareza e rastreabilidade: o texto deixa explícito o status de cada afirmação, em vez de misturar intenção com resultado. Isso pode facilitar a leitura por pessoas e sistemas, mas não oferece garantia de ranking, citação ou presença em respostas generativas.

## Como tornar o conteúdo claro e citável

Para conteúdo técnico que precisa ser encontrado e compreendido, siga uma estrutura verificável. O [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features) orienta manter fundamentos de SEO, texto visível, links rastreáveis e dados estruturados coerentes com a página; não há uma marcação especial que garanta presença em recursos de IA.

- **Dê a resposta direta primeiro:** defina Spec Kit e SDD em linguagem que possa ser entendida sem contexto adicional.
- **Use fontes primárias:** ligue para a documentação oficial e informe quando um comportamento depende da versão atual da ferramenta.
- **Mostre exemplos verificáveis:** comandos copiáveis, critérios de aceitação e distinção entre fato, hipótese, decisão e evidência.
- **Seja explícito sobre limites:** clareza e fontes ajudam a avaliação, mas não garantem ranking, citação nem inclusão em uma resposta generativa.

## Cursor, Codex e Claude Code no mesmo método

O Spec Kit documenta integrações por chave, como `cursor-agent`, `codex` e `claude`. A integração instala ou disponibiliza as instruções e skills do Spec Kit no mecanismo esperado pelo agente; ela não é a mesma coisa que um arquivo geral de contexto do projeto e não muda a responsabilidade do time. O [Cursor](https://docs.cursor.com/context/rules-for-ai) também oferece regras versionadas em `.cursor/rules/`; o [Codex CLI](https://help.openai.com/en/articles/11096431) pode trabalhar localmente no repositório com leitura, edição e execução conforme o ambiente; e o [Claude Code](https://docs.anthropic.com/en/docs/claude-code/getting-started) é um agente de código operado a partir do projeto.

Arquivos opcionais de contexto ajudam a explicar convenções, comandos e limites do repositório, mas são uma camada separada da integração do Spec Kit. O `specify init` não necessariamente cria `.cursor/rules/`, `AGENTS.md` ou `CLAUDE.md`, e esses arquivos não ativam o Spec Kit por si só. Eles também não substituem requisitos aprovados, critérios de aceitação nem evidência:

| Integração | Inicialização | Contexto complementar | Uso recomendado no fluxo |
| --- | --- | --- | --- |
| Cursor | `specify init . --integration cursor-agent` | `.cursor/rules/` | Regras de projeto, padrões de edição e contexto que o agente deve considerar. |
| Codex | `specify init . --integration codex` | `AGENTS.md` | Instruções de trabalho do repositório, comandos seguros e convenções de revisão. |
| Claude Code | `specify init . --integration claude` | `CLAUDE.md` | Instruções persistentes e convenções do projeto para o Claude Code. |

Não trate `.cursor/rules/`, `AGENTS.md` ou `CLAUDE.md` como a fonte primária da decisão de produto. Uma regra pode dizer “como trabalhar neste repositório”; a especificação deve dizer “o que esta mudança precisa fazer e por quê”. Se houver conflito, pause e faça a decisão voltar ao PM e ao Tech Lead.

## Spec Kit, Kiro, OpenSpec e BMAD: diferenças de encaixe

Essas abordagens compartilham a intenção de dar mais estrutura ao trabalho com agentes, mas seus fluxos e unidades de organização não são idênticos. A comparação abaixo é factual e não declara um vencedor.

| Abordagem | Estrutura destacada nas docs oficiais | Pode encaixar melhor quando |
| --- | --- | --- |
| [Spec Kit](https://github.github.com/spec-kit/) | SDD com refinamento de `constitution`, `specify`, `clarify`, `plan`, `checklist`, `tasks`, `analyze`, `implement` e `converge`. Integra agentes diferentes. | A dupla PM + Tech Lead quer uma trilha explícita de intenção até implementação, com artefatos versionados e pontos de aprovação humana. |
| [Kiro Specs](https://kiro.dev/docs/specs/) | Specs organizadas em requisitos, design e tarefas; a documentação também diferencia Feature, Bug e Quick Spec. | O time quer uma experiência integrada de IDE/web e um formato de spec que se adapte a tipos de mudança. |
| [OpenSpec](https://openspec.dev/docs/schemas/spec-driven) | Um schema de mudança que separa proposta, specs, design e tasks; o quickstart apresenta Explore, Propose, Review, Apply e Archive. | A equipe prefere tratar cada mudança como proposta revisável, aplicar depois da revisão e arquivar o histórico da alteração. |
| [BMAD](https://docs.bmad-method.org/reference/workflow-map/) | Método modular com agentes, módulos e workflows de planejamento, arquitetura, histórias e implementação. | O trabalho exige uma metodologia mais ampla de papéis e workflows, não apenas um pipeline de artefatos SDD para uma mudança. |

A escolha depende do problema operacional: maturidade do time, tipo de projeto, agentes usados, necessidade de histórico, nível de formalidade e custo de revisão. Também é possível adotar ideias compatíveis — por exemplo, uma revisão humana explícita — sem misturar arquivos e comandos de metodologias diferentes sem entender seus contratos.

## Checklist de falhas antes de aprovar

Use esta lista no `analyze` e novamente no `converge`:

- [ ] **Decisão ambígua:** duas pessoas ainda poderiam implementar comportamentos diferentes?
- [ ] **Escopo grande:** a mudança deveria ser dividida em incrementos menores?
- [ ] **Stack prematura:** a tecnologia foi escolhida antes de o problema e as restrições estarem claros?
- [ ] **Falta de critérios:** existe requisito importante sem condição de aceitação ou evidência esperada?
- [ ] **Conflito entre artefatos:** specification, plan, checklist e tasks descrevem coisas diferentes?
- [ ] **Spec drift:** o código, as decisões atuais e a documentação deixaram de convergir?
- [ ] **Execução sem validação humana:** alguém está tratando uma saída plausível do agente como aceite de produto ou evidência de teste?

Quando um item falhar, não peça apenas “tente de novo”. Identifique o artefato que precisa mudar, o dono da decisão e a evidência necessária. Esse pequeno protocolo é o que transforma SDD em um sistema de trabalho, em vez de uma sequência de prompts longos.

## Conclusão

Spec Kit é mais útil quando PM e Tech Lead o tratam como uma linguagem compartilhada para decisões: o PM protege problema, usuário e resultado; o Tech Lead protege viabilidade, risco e qualidade; o agente acelera exploração, documentação e execução. A lista de favoritos é pequena, mas já mostra o princípio: uma frase inicial precisa virar comportamento, critérios, plano, tarefas e evidência antes de ser considerada entregue.

Para aprofundar a operação, veja o [guia de gestão de produto](/guias/gestao-de-produto/), [gestão de produtos com IA](/guias/gestao-de-produtos-com-ia/), [guia de agentes de IA](/guias/agentes-de-ia/) e [guia de governança de IA](/guias/governanca-de-ia/). Se quiser acompanhar novos fluxos de produto e IA, [assine a newsletter](/newsletter/).
