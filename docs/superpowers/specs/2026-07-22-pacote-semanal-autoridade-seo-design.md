# Pacote semanal de autoridade SEO, GEO e geração de leads

**Data:** 2026-07-22

**Projeto:** Produto com IA

**Status:** desenho aprovado nas três seções pelo usuário

## 1. Objetivo

Criar uma automação semanal que selecione uma oportunidade editorial estratégica e publique um pacote bilíngue completo composto por:

1. um guia profundo;
2. uma pesquisa original com método verificável;
3. um template útil protegido por captura de lead.

O pacote deve ampliar a autoridade temática do Produto com IA em mecanismos de busca e sistemas de resposta baseados em IA, fortalecer os clusters existentes e gerar leads qualificados sem comprometer a segurança ou a estabilidade da produção.

## 2. Cadência e convivência com outras automações

- Frequência: semanal.
- Horário: segunda-feira às 08:00, em `America/Sao_Paulo`.
- A newsletter diária permanece às 11:30.
- A automação semanal deve terminar ou interromper de forma segura antes da rotina diária.
- Se houver outra execução modificando o repositório, a automação semanal não deve publicar nem forçar a integração.

## 3. Estratégia de seleção

A seleção seguirá o modelo de pacote de autoridade por cluster:

- 70% de prioridade para conteúdo estrutural e perene;
- 30% de prioridade para oportunidades recentes que pertençam aos clusters estratégicos.

Clusters prioritários:

1. agentes de IA;
2. governança de IA;
3. gestão de produto e IA para Product Managers;
4. automação com n8n;
5. avaliação, custos, risco e operação de sistemas de IA.

A escolha semanal deve considerar:

- intenção de busca;
- volume e dificuldade, quando houver dados confiáveis;
- consultas e páginas do Search Console, quando os relatórios estiverem disponíveis;
- lacunas do acervo atual;
- risco de canibalização;
- qualidade dos concorrentes encontrados;
- possibilidade de produzir evidência original;
- utilidade prática do template;
- potencial de links, menções e citações por mecanismos de IA;
- alinhamento com a experiência e o posicionamento editorial de Rodrigo Tozato.

Antes de criar arquivos, a execução deve registrar no relatório de trabalho:

- tema central;
- palavra-chave principal;
- de duas a seis palavras-chave secundárias;
- intenção;
- público;
- página pilar;
- lacuna competitiva;
- tipo de pesquisa;
- tipo de template;
- fontes candidatas.

Se não existir oportunidade suficientemente confiável, a execução será encerrada sem alterações ou publicação.

## 4. Fontes de dados e pesquisa de mercado

A automação poderá usar:

- Search Console, quando acessível e com dados processados;
- Ubersuggest, somente quando o conector estiver disponível;
- resultados públicos atuais de busca;
- documentação oficial;
- artigos científicos e publicações institucionais;
- dados públicos com licença e origem identificáveis;
- conteúdo e métricas não pessoais do próprio site;
- dados explicitamente fornecidos pelo usuário.

Na ausência do Ubersuggest, a automação não deve inventar volume ou dificuldade. Ela deve registrar a indisponibilidade e trabalhar com intenção, lacuna competitiva, Search Console e fontes públicas.

## 5. Guia profundo

Cada execução publicará um guia em português e uma versão editorialmente equivalente em inglês.

Requisitos:

- extensão indicativa de 1.800 a 3.000 palavras por idioma, ajustada à intenção e sem preenchimento artificial;
- resposta direta no início;
- título e descrição específicos;
- hierarquia correta de H1, H2 e H3;
- sumário quando melhorar a navegação;
- definições claras;
- exemplos concretos;
- etapas, critérios, comparações, riscos e limitações quando pertinentes;
- FAQ apenas para perguntas realmente respondidas;
- de cinco a dez fontes confiáveis, priorizando fontes primárias;
- de três a oito links internos contextuais;
- link para a página pilar do cluster;
- link para a pesquisa e chamada contextual para o template;
- autoria, publicação e atualização coerentes;
- canonical próprio e `hreflang` recíproco;
- metadados Open Graph e Twitter;
- dados estruturados coerentes com conteúdo visível;
- nenhuma afirmação inventada ou citação não verificada.

Não é permitido traduzir palavras-chave de forma literal quando a expressão natural em inglês for diferente.

## 6. Pesquisa original

Pesquisa própria significa análise realizada pelo Produto com IA a partir de dados reais e método reproduzível. Não é permitido fabricar entrevistas, respostas, amostras, benchmarks, números, avaliações ou conclusões.

Formatos permitidos:

- análise de dados públicos;
- benchmark executado de forma reproduzível;
- levantamento sistemático de documentação oficial;
- auditoria quantitativa de um conjunto claramente definido;
- análise do acervo e de métricas não pessoais do site;
- pesquisa com respondentes somente quando houver base real fornecida ou coletada com autorização apropriada.

Toda pesquisa deve apresentar:

- pergunta investigada;
- hipótese ou objetivo;
- universo analisado;
- período;
- critérios de inclusão e exclusão;
- fontes;
- método de coleta;
- método de cálculo;
- resultados;
- limitações;
- data da análise;
- tabela ou dados suficientes para reprodução, respeitando direitos e licenças.

Se os dados não sustentarem um resultado original, o material não será chamado de pesquisa. A automação deve escolher outro tema ou encerrar sem publicar.

## 7. Template útil e captura de lead

O template deve resolver uma tarefa diretamente relacionada ao guia e à pesquisa. Formatos aceitos incluem CSV, planilha, checklist e documento editável seguro.

Requisitos:

- instruções de uso;
- campos claramente nomeados;
- pelo menos um exemplo preenchido;
- critérios derivados da pesquisa;
- versões PT e EN quando necessárias;
- ausência de macros, scripts ou conteúdo executável;
- ausência de fórmulas perigosas;
- ausência de dados pessoais reais;
- arquivo privado incluído no pacote protegido;
- entrada declarada em `config/downloads.json`;
- página pública de apresentação;
- formulário leve de nome e e-mail;
- consentimento opcional separado para comunicações;
- notificação para `rodrigo.tozato@icloud.com`;
- download autorizado somente pelo serviço de leads;
- resposta pública do caminho de download como HTML protegido e `no-store` antes da autorização.

O arquivo não pode ser exposto no diretório estático público nem versionar dados de leads.

## 8. Jornada e arquitetura de links

A jornada será:

`consulta ou resposta de IA → guia → evidência original → template → lead`

O pacote deverá:

- ligar o guia à página pilar;
- ligar a página pilar ao novo guia quando isso fizer sentido editorial;
- ligar conteúdos relacionados ao guia sem alteração artificial;
- apontar o guia para a pesquisa e o template;
- usar âncoras descritivas;
- evitar duplicação e canibalização;
- manter as rotas equivalentes em português e inglês;
- atualizar sitemap, arquivos para LLMs e demais artefatos gerados pelo build.

## 9. Fluxo Git e produção

Repositório canônico:

`/Users/rodrigodiastozato/Desktop/Blog_de_IA`

Fluxo obrigatório:

1. verificar `git status --short`;
2. interromper diante de alterações conflitantes ou não compreendidas;
3. confirmar a branch `main`;
4. buscar `main` por SSH;
5. integrar somente por fast-forward;
6. criar o pacote;
7. revisar o diff e executar `git diff --check`;
8. executar `npm run validate`;
9. adicionar somente os arquivos pertencentes ao pacote;
10. registrar um commit descritivo;
11. confirmar novamente que o remoto não divergiu;
12. enviar `HEAD:main` somente após validação integral;
13. executar exclusivamente `./scripts/deploy.sh`;
14. verificar produção e registrar a release.

É proibido:

- usar `git reset`, `git clean` ou push forçado;
- apagar caches ou dependências automaticamente;
- editar ou copiar HTML manualmente na VPS;
- limpar diretórios de produção;
- parar ou recriar containers manualmente;
- contornar o script oficial;
- publicar se o push falhar;
- versionar `dist`, `node_modules`, segredos, bancos de leads ou arquivos privados.

## 10. Validações obrigatórias

Antes do commit:

- schemas de conteúdo;
- consistência PT/EN;
- links internos existentes;
- fontes externas acessíveis e adequadas;
- metodologia reproduzível;
- catálogo de downloads válido;
- arquivos privados presentes apenas no pacote correto;
- build completo;
- testes do site;
- testes do serviço de leads;
- auditoria SEO;
- ausência de segredos e dados pessoais no diff.

Depois da publicação:

- páginas PT e EN com HTTP 200;
- canonical e `hreflang` corretos;
- metadados e dados estruturados presentes;
- URLs no sitemap e em `llms-full.txt`;
- links internos respondendo corretamente;
- `/api/download-leads/health` saudável;
- download protegido exibindo o formulário antes da autorização;
- `cache-control: no-store` no caminho protegido;
- conteúdo público principal acessível;
- rollback respeitado se o script oficial falhar.

## 11. Barreiras de publicação

A execução deve terminar sem publicar quando ocorrer qualquer uma destas condições:

- repositório divergente ou com conflito;
- automação concorrente modificando o projeto;
- tema duplicado ou canibalização não resolvida;
- falta de evidência verificável;
- metodologia insuficiente;
- fonte quebrada ou afirmação não sustentada;
- tradução que altera fatos ou intenção;
- link interno inexistente;
- template incompleto ou inseguro;
- falha em build, testes ou auditoria;
- falha no serviço de leads;
- falha no GitHub;
- falha no deploy ou nos smoke tests.

Não haverá deploy alternativo ou correção destrutiva automática.

## 12. Relatório semanal

Cada execução deve informar:

- decisão de publicar ou interromper;
- tema e justificativa;
- palavra-chave principal e secundárias;
- intenção e público;
- concorrentes analisados;
- lacuna competitiva explorada;
- página pilar;
- guia PT e EN;
- pergunta, método, fontes, resultados e limitações da pesquisa;
- template e instruções;
- links internos adicionados;
- arquivos alterados;
- validações e respectivos resultados;
- commit e push;
- identificação da release;
- URLs públicas;
- estado do serviço de leads;
- riscos ou acompanhamentos necessários.

## 13. Acompanhamento de resultados

Cada pacote deverá ser acompanhado em 30, 60 e 90 dias, quando houver dados disponíveis. Indicadores:

- indexação;
- impressões;
- consultas;
- posição média;
- CTR;
- cliques orgânicos;
- downloads;
- leads atribuídos;
- links e menções externas;
- aparições observáveis em respostas de IA;
- páginas próximas das posições 1–10 e 11–30.

A automação semanal não deve alterar conteúdo anterior apenas por ausência temporária de dados. Atualizações deverão se basear em evidência suficiente.

## 14. Critérios de sucesso

Uma execução semanal é bem-sucedida somente quando:

1. o pacote é coerente e não duplica intenção existente;
2. a pesquisa contém dados reais e método reproduzível;
3. o template resolve uma tarefa concreta;
4. PT e EN estão editorialmente equivalentes;
5. todas as validações passam;
6. o GitHub recebe somente mudanças pertinentes;
7. o deploy oficial termina com sucesso;
8. as páginas e o download protegido funcionam em produção;
9. o relatório permite auditoria posterior.

Publicar três arquivos sem qualidade, evidência e integração não conta como sucesso.
