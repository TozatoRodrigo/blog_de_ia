---
title: "Avaliação de agentes de IA: casos, métricas e gate de lançamento"
seoTitle: "Avaliação de agentes de IA: método, métricas e gates"
description: "Aprenda a avaliar agentes de IA por resultado, trajetória, ferramentas, segurança, custo e prontidão antes de liberar uma mudança."
datePublished: "2026-08-31"
dateModified: "2026-08-31"
tags: ["agentes de IA", "avaliação", "evals", "qualidade", "gestão de produto"]
alternateSlug: "evaluate-ai-agents"
cluster: agents
isHub: false
downloads:
  - label: "Baixar checklist de gate de avaliação"
    href: "/downloads/checklist-gate-avaliacao-agente.csv"
    format: "CSV"
faq:
  - question: "O que é avaliação de um agente de IA?"
    answer: "É o processo de executar casos representativos e verificar o resultado, a trajetória, o uso de ferramentas, a segurança, a operação e os critérios de liberação do agente. Não é apenas comparar a resposta final com um gabarito."
  - question: "Quais métricas devo usar para avaliar um agente?"
    answer: "Comece por conclusão correta da tarefa, uso e parâmetros de ferramentas, segurança e respeito a políticas, evidência ou groundedness, latência, custo, repetição e escalonamento. Os limites dependem do caso, do risco e do resultado que o produto precisa entregar."
  - question: "Como testar um agente antes de colocá-lo em produção?"
    answer: "Monte um conjunto versionado de casos normais, ambíguos, incompletos, adversariais e proibidos; execute o agente em um ambiente controlado; verifique resultado e trajetória; compare com a versão anterior; e libere somente se os critérios obrigatórios e os limites de risco forem atendidos."
  - question: "LLM-as-a-judge substitui avaliação humana?"
    answer: "Não. Um avaliador baseado em modelo pode ampliar a escala, mas precisa de critérios claros e calibração periódica com revisão humana. Checks determinísticos continuam preferíveis quando o resultado ou a ação pode ser verificado por código."
sources:
  - name: "OpenAI — Evaluate agent workflows"
    url: "https://developers.openai.com/api/docs/guides/agent-evals"
  - name: "OpenAI Agents SDK — Testing"
    url: "https://openai.github.io/openai-agents-python/testing/"
  - name: "OpenAI — Evaluation best practices"
    url: "https://developers.openai.com/api/docs/guides/evaluation-best-practices"
  - name: "Anthropic — Demystifying evals for AI agents"
    url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
  - name: "Microsoft Foundry — Evaluate your AI agents"
    url: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent"
  - name: "Microsoft Foundry — Test a hosted agent"
    url: "https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent"
  - name: "Google Cloud — Evaluate agents using the GenAI Client"
    url: "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/evaluate"
  - name: "NIST AI RMF Playbook — Measure"
    url: "https://airc.nist.gov/airmf-resources/playbook/measure/"
draft: false
---

Avaliar um agente de IA é verificar se ele conclui uma tarefa útil, no estado correto e dentro dos limites de segurança, custo e operação — e se o caminho que percorreu também foi aceitável. A resposta final é apenas uma parte da evidência. Um agente pode escrever uma frase convincente depois de consultar a ferramenta errada, usar um parâmetro indevido ou deixar uma alteração externa em estado incorreto.

Este guia apresenta um método provider-neutral para Product Managers, Tech Leads, QA, SRE e governança. Ele conecta o [guia pilar sobre agentes de IA](/guias/agentes-de-ia/) a uma [pesquisa documental reproduzível sobre avaliação](/guias/pesquisa-avaliacao-agentes-de-ia/) e a um [checklist privado de gate de avaliação](/downloads/checklist-gate-avaliacao-agente.csv). O objetivo não é oferecer uma nota universal para qualquer agente. É ajudar a transformar uma mudança em uma decisão verificável.

## O que uma avaliação precisa responder

Uma avaliação útil começa com uma tarefa, não com um modelo. Descreva a entrada, o estado inicial, as ferramentas disponíveis, as ações permitidas, o resultado verificável e a condição de falha. Depois observe pelo menos cinco superfícies:

| Superfície | Pergunta que ela responde |
|---|---|
| Resultado | A tarefa terminou no estado esperado? |
| Trajetória | O agente tomou decisões intermediárias coerentes? |
| Ferramentas | Escolheu a ferramenta certa e enviou parâmetros válidos? |
| Segurança | Respeitou política, permissões, aprovação e ações proibidas? |
| Operação | Ficou dentro de latência, custo, passos, retries e escalonamento aceitáveis? |

Essa separação evita duas conclusões apressadas. “A resposta parece boa” não prova que o estado do sistema foi alterado corretamente. “A tarefa terminou” também não prova que o agente agiu com segurança. O [OpenAI Agent Evals](https://developers.openai.com/api/docs/guides/agent-evals) descreve a combinação de traces, graders, datasets e eval runs para investigar comportamento de workflow; a [documentação da Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) diferencia transcript, tentativa, grader e resultado final do ambiente.

## 1. Defina o resultado antes de definir a nota

Um caso de avaliação precisa ter um critério de sucesso observável. Para um agente de atendimento, “responder bem” é vago; “classificar a solicitação na categoria correta, não inventar uma política e escalar quando faltar informação” é testável. Para um agente que atualiza um CRM, o estado final pode ser a alteração correta em um ambiente de teste, acompanhada do registro de autorização.

Escreva cada caso com estes campos:

- **Entrada:** o pedido e o contexto mínimo que o agente receberá.
- **Estado inicial:** registros, permissões, documentos ou sessão disponíveis.
- **Resultado esperado:** estado que deve existir depois da execução.
- **Ações permitidas:** ferramentas, parâmetros e efeitos que podem ocorrer.
- **Ações proibidas:** efeitos que reprovam o caso mesmo que a resposta seja fluente.
- **Evidência:** consulta, assertion, snapshot ou evento que comprova o resultado.
- **Severidade:** impacto de uma falha e regra de bloqueio.

O [guia da OpenAI sobre evals](https://developers.openai.com/api/docs/guides/evaluation-best-practices) recomenda definir o objetivo, coletar dados, definir métricas, comparar execuções e avaliar continuamente. A recomendação é aplicável a agentes, mas a verificação precisa acompanhar a arquitetura: um teste de texto é suficiente para uma classificação; não é suficiente para uma ação que muda o estado de outro sistema.

### Resultado não é a mesma coisa que saída

Separe `output` de `outcome`. A saída é o que o usuário vê; o resultado é o estado que a tarefa deveria produzir. Um agente pode afirmar “pedido cancelado” sem que o cancelamento tenha acontecido. Um caso robusto verifica o registro, a transação simulada ou o evento de negócio em um ambiente isolado.

Quando não houver um gabarito único, use uma rubrica com dimensões explícitas, como completude, fidelidade às fontes, aderência às instruções e comunicação. Ainda assim, registre qual evidência sustenta cada nota. Uma escala sem exemplos só transforma opinião em número.

## 2. Monte um conjunto que represente o risco

Não comece tentando cobrir todas as conversas possíveis. Comece pelas tarefas que definem o valor do produto e pelas falhas que seriam caras ou perigosas. O conjunto inicial pode combinar casos escritos por especialistas, falhas reais sanitizadas, dados históricos permitidos e cenários sintéticos revisados.

Uma distribuição prática inclui:

1. **Normais:** o caminho esperado com contexto suficiente.
2. **Ambíguos:** pedidos com duas interpretações plausíveis.
3. **Incompletos:** informação faltante, documento vazio ou ferramenta indisponível.
4. **Adversariais:** instruções conflitantes, conteúdo malicioso ou tentativa de contornar política.
5. **Proibidos:** ações que devem ser recusadas, escaladas ou aguardadas por aprovação.
6. **Regressões:** casos que falharam em versões anteriores e agora precisam continuar protegidos.

Cada caso deve ter um identificador estável e uma versão. Não coloque segredos, prompts completos de clientes ou dados pessoais reais em um CSV de avaliação. Guarde apenas o contexto mínimo e uma referência para o sistema autorizado, quando ela for necessária. Se usar dados de produção, defina critérios de retenção, anonimização e acesso antes de copiá-los para o conjunto.

O [NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/measure/) relaciona a qualidade da medição à documentação de conjuntos, métricas, ferramentas e condições de teste. Isso também ajuda a descobrir quando o conjunto não representa o ambiente real: uma coleção de perguntas fáceis pode produzir uma taxa alta e pouca informação sobre o risco.

## 3. Avalie a trajetória, não só o texto

Em um agente, a trajetória é a sequência observável de chamadas de modelo, decisões, ferramentas, resultados intermediários, handoffs, aprovações e encerramento. Ela permite distinguir uma conclusão correta por caminho permitido de uma conclusão correta por acaso.

Registre, com minimização de dados:

- identificador da execução, agente, versão e ambiente;
- entrada e estado inicial em forma sanitizada;
- ferramentas consideradas e chamadas realizadas;
- parâmetros validados, resultado e código de erro de cada ferramenta;
- aprovações, bloqueios, retries e handoffs;
- resultado final e evidência do estado do ambiente;
- passos, tokens quando disponíveis, duração e custo estimado.

O [tracing do OpenAI Agents SDK](https://openai.github.io/openai-agents-python/tracing/) registra gerações, chamadas de ferramentas, handoffs, guardrails e eventos personalizados. A seção de [testes do mesmo SDK](https://openai.github.io/openai-agents-python/testing/) mostra utilitários determinísticos para exercitar workflows em memória e verificar que todas as etapas esperadas foram consumidas. A ideia importante é independente da biblioteca: capture as decisões que o seu sistema possui e não atribua ao agente uma ação que só foi sugerida, bloqueada ou nunca executada.

Não transforme a avaliação em retenção indiscriminada de conteúdo sensível. Um trace útil pode guardar IDs, versões, tipos de evento e resumos redigidos. Para diagnosticar uma falha, acesso ao log não deve conceder automaticamente permissão para repetir a ferramenta.

## 4. Combine avaliadores com funções diferentes

Use o avaliador mais simples que responda à pergunta:

| Tipo | Bom uso | Limitação |
|---|---|---|
| Determinístico | Estado final, schema, enum, permissão, ferramenta proibida, limite de passos | Não mede bem qualidade aberta ou nuance |
| Baseado em modelo | Rubrica de relevância, clareza, fidelidade ou interação | Pode concordar com uma resposta errada e precisa de calibração |
| Humano | Casos subjetivos, risco alto, revisão do avaliador automático | Custa tempo e precisa de critérios consistentes |

Uma avaliação pode ter vários checks: resultado, segurança, ferramenta, qualidade e operação. Não some tudo em uma média que permita uma violação crítica ser compensada por uma boa redação. Defina gates obrigatórios para segurança e integridade do estado; só depois use uma pontuação ou rubrica para dimensões graduais.

O guia da [Microsoft Foundry sobre avaliar agentes](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent) separa resultados agregados por avaliador de resultados por linha, com resposta, versão, uso e justificativa. A [página de testes de agentes hospedados](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent) também diferencia testes unitários, integração e avaliação estruturada. Esses níveis não são intercambiáveis: um teste pode mostrar que o handler funciona, enquanto uma avaliação ponta a ponta verifica se o agente escolhe esse handler no contexto correto.

Se usar LLM-as-a-judge, mantenha um pequeno conjunto de casos revisados por pessoas para calibrar a rubrica. Compare divergências, registre exemplos de falso positivo e falso negativo e revise o avaliador quando a definição de sucesso mudar. A recomendação de combinar métricas e julgamento humano também aparece nas [boas práticas de avaliação da OpenAI](https://developers.openai.com/api/docs/guides/evaluation-best-practices).

## 5. Repita, compare e proteja contra regressão

Modelos generativos podem variar entre execuções. Uma única rodada mostra um ponto, não a distribuição. Para casos críticos, repita a execução em condições controladas e registre o número de tentativas. Para casos determinísticos, verifique que o harness consumiu todos os passos esperados; uma execução que para cedo não deve ser contada como sucesso.

Compare versões em uma matriz que preserve o contexto:

| Comparação | O que observar |
|---|---|
| Modelo novo vs. modelo atual | Resultado, segurança, custo e latência por tipo de caso |
| Prompt novo vs. prompt atual | Aderência, ferramentas, escalonamento e regressões |
| Ferramenta nova vs. antiga | Schema, parâmetros, efeitos e erros |
| Política nova vs. antiga | Bloqueios corretos e casos permitidos que continuam funcionando |

O [Google Cloud Agent Engine](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/evaluate) apresenta um fluxo com dataset, inferência, execução de avaliação e métricas de qualidade final, uso de ferramentas, alucinação e segurança. O detalhe que importa para a decisão é manter dataset, agente e métricas identificáveis; sem isso, duas notas não são comparáveis.

Avaliações de capacidade perguntam “o que o agente consegue fazer?” e podem começar com desempenho baixo. Avaliações de regressão perguntam “o que ele continua fazendo depois da mudança?” e devem proteger o que já foi aceito. Uma suíte saudável mantém as duas perguntas separadas.

## 6. Transforme a avaliação em gate de lançamento

Um gate não precisa ser uma pontuação única. Ele é uma regra explícita que liga evidência à decisão. Um formato simples:

- **Bloqueadores:** qualquer ação proibida, falha de autorização, vazamento, estado final incorreto de alta severidade ou ausência de evidência.
- **Limites graduais:** qualidade, custo, latência, número de passos e escalonamento dentro da faixa definida para o caso.
- **Comparação:** nenhuma regressão material nos casos protegidos sem uma decisão registrada.
- **Aprovação:** responsável nomeado, data, versão do conjunto, versão do agente e ambiente onde o resultado foi obtido.
- **Plano de retorno:** modo de sugestão, versão anterior, desativação de ferramenta ou outra contenção testada.

Um exemplo ilustrativo: a equipe testa uma mudança no agente de triagem. A conclusão correta e a latência melhoram, mas um caso proibido chama a ferramenta de alteração. A decisão é bloquear a mudança. O ganho de qualidade não compensa uma violação de segurança. O exemplo é um padrão de decisão, não um resultado medido pelo Produto com IA.

O [teste de agente hospedado da Microsoft](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/test-hosted-agent) recomenda versionar a receita de avaliação e executá-la como gate de CI quando possível. O NIST recomenda testar antes da implantação, documentar o intervalo de validade e monitorar o sistema depois. A prática resultante é: avaliação offline reduz o risco antes do release; monitoramento e revisão de traces encontram falhas que o conjunto não previa.

## 7. Continue avaliando depois do release

Produção não é apenas um lugar para medir latência. É uma fonte de novos casos, mudanças de distribuição e resultados que não estavam no conjunto. Crie um ciclo com quatro entradas:

1. selecionar traces ou feedback com sinais de falha, custo anômalo, repetição, escalonamento ou baixa confiança;
2. remover dados sensíveis e revisar o caso com alguém que conheça o domínio;
3. adicionar o caso à suíte de regressão ou capacidade, com critério de sucesso;
4. executar a próxima mudança contra a suíte e registrar a decisão.

A avaliação contínua não elimina pesquisa com usuários, revisão manual, testes A/B ou observabilidade. Cada método responde a uma pergunta diferente. Uma avaliação automatizada é rápida e reproduzível; um trace de produção mostra comportamento real; uma revisão humana ajuda a descobrir que o critério estava errado.

## O que a pesquisa deste pacote encontrou

A [pesquisa original sobre controles de avaliação](/guias/pesquisa-avaliacao-agentes-de-ia/) auditou oito páginas oficiais coletadas em 31 de agosto de 2026. A unidade foi a página, não o fornecedor, e “sim” só foi contado quando o controle apareceu explicitamente. Todos os oito documentos mencionaram tarefas ou conjuntos e critérios de sucesso. Sete mencionaram evidência de trajetória e comparação ou regressão; seis combinaram múltiplos avaliadores ou sinais; cinco descreveram gate pré-release e ciclo pós-release; apenas três mencionaram calibração ou revisão humana de forma explícita.

Esses números não são uma norma de mercado nem uma amostra representativa de todos os fornecedores. Eles sustentam uma recomendação editorial: um gate confiável precisa combinar o que é mais comum na documentação — casos e resultado — com as camadas que aparecem menos, especialmente produção e julgamento humano calibrado.

## Checklist de 30 dias

### Dias 1–7: caso e risco

Escolha um fluxo, descreva o resultado observável, liste ações proibidas e defina a severidade de cada falha. Não avalie “o agente” como uma abstração; avalie uma tarefa em um ambiente.

### Dias 8–14: conjunto e evidência

Escreva os casos normais, ambíguos, incompletos, adversariais, proibidos e de regressão. Defina como verificar o estado final e quais eventos mínimos precisam aparecer no trace.

### Dias 15–21: rodada comparável

Execute a versão atual e a mudança candidata com o mesmo conjunto. Combine checks determinísticos com uma rubrica revisada. Repita casos variáveis e leia amostras das trajetórias, não apenas a média.

### Dias 22–30: gate e ciclo vivo

Registre a decisão, o responsável e o plano de retorno. Libere em etapas quando o impacto justificar. Depois, transforme falhas reais sanitizadas em novos casos e programe a próxima avaliação.

## Baixe o checklist de gate

O [checklist privado de gate de avaliação de agente](/downloads/checklist-gate-avaliacao-agente.csv) é um CSV bilíngue com instruções na primeira linha e o exemplo fictício `EXAMPLE-001`. Ele organiza identificação da mudança, caso, resultado, trajetória, ferramentas, segurança, avaliadores, orçamento, evidência, decisão e reteste. Os campos foram derivados da pesquisa: conjunto e resultado, trajetória, múltiplos sinais, comparação, gate pré-release, acompanhamento pós-release e calibração humana.

Preencha uma linha por caso e mantenha o conjunto fora de dados pessoais reais. Use o [template amplo de avaliação de agente](/guias/template-avaliacao-agente-de-ia/) para uma ficha geral; use este checklist quando a pergunta for se uma mudança específica está pronta para avançar. Para conectar a decisão ao risco, consulte a [matriz de risco de IA](/guias/matriz-risco-ia/) e o [guia de operação de agentes em produção](/guias/operacao-de-agentes-de-ia/).
