# Publicação diária bilíngue — Produto com IA

## Contrato

Publicar uma edição PT/EN por data de São Paulo, acrescentando conteúdo e preservando cada URL e funcionalidade pública atual. Repositório canônico: `/Users/rodrigodiastozato/Developer/Blog_de_IA`; remote único: `git@github.com:TozatoRodrigo/blog_de_ia.git`, `refs/heads/main`. Horário diário: 11h30, `America/Sao_Paulo`.

Fonte: `/Users/rodrigodiastozato/Downloads/AgentWorkspace/09 Linkedin Tozato/Newsletter - Programado/Newsletter Programada - DD-MM-YYYY.md`.

A rotina usa uma worktree limpa dentro de `.worktrees/`, iniciada exatamente no FETCH_HEAD obtido nesta execução. Não publica branch de feature, snapshot antigo ou trabalho local do checkout manual. O checkout canônico deve estar em main; suas alterações e commits locais são inventariados e preservados, nunca resetados, escondidos, copiados ou incluídos implicitamente.

## Preflight e trava compartilhada

1. Registrar status completo, HEAD, branch, log, worktrees, diferenças locais e comparação de cada caminho com FETCH_HEAD. Buscar main pelo comando exato `git fetch --prune git@github.com:TozatoRodrigo/blog_de_ia.git main` e registrar o SHA. O checkout canônico permanece intacto.
2. No código remoto verificado, executar `node scripts/newsletter-preflight.mjs inspect YYYY-MM-DD /private/tmp/produtocomia-YYYY-MM-DD-RUN-local.json`. Usar RUN único. A inspeção registra hashes dos arquivos locais, verifica fonte de hoje/próximos três dias e testa socket local. Se a fonte de hoje faltar, encerrar sem escrever conteúdo ou publicar.
3. Em caso de bloqueio exclusivamente ambiental de rede ou `listen EPERM`, repetir uma única vez o mesmo comando e destino com escalonamento limitado. Falhas reais de aplicação/validação não têm esse retry. Permissões precisam estar disponíveis no ambiente agendado; nunca usar acesso irrestrito, mocks ou testes pulados como recuperação.
4. Obter `node scripts/newsletter-preflight.mjs lock daily-YYYY-MM-DD-RUN`, guardar o token e exportá-lo em `PRODUTOCOMIA_PUBLICATION_TOKEN` durante o deploy. Todos os outros publicadores deste projeto, inclusive o semanal, usam a mesma trava. Conflito encerra sem publicar. Travas antigas não expiram automaticamente; inspecionar owner.json e o estado da publicação para revisão própria.
5. Criar a worktree em FETCH_HEAD; se o caminho da data já estiver sujo ou em outro SHA, preservá-lo e criar irmão com short SHA e RUN. Reutilizar apenas worktree limpa no SHA exato. Comparar lockfiles antes de ligar dependências existentes por symlinks temporários; incompatibilidade bloqueia, sem npm install.
6. Capturar baseline público: `node scripts/newsletter-continuity.mjs capture https://produtocomia.com.br /private/tmp/produtocomia-YYYY-MM-DD-RUN-baseline.json`. Deve incluir todo sitemap e recursos fora dele. Qualquer rota crítica não saudável bloqueia a edição. HTTP GET não comprova um endpoint POST; os probes do script são inválidos e rejeitados antes de criar dados.
7. Confirmar que a base contém contribuição, Arena, assets, downloads protegidos e services/download-leads. Comparar infraestrutura do remoto com produção; divergência deve ser revisada separadamente. Não construir híbrido de branches.

## Conteúdo e idempotência

- Ler integralmente a fonte. Preservar tese, fatos, números, URLs, voz e fechamento. Traduzir profissionalmente; não inventar fontes, experiência ou conclusão.
- Procurar todos os arquivos com a data nas duas coleções antes de criar. Se já existe uma edição equivalente em main, verificar sua publicação pública e registrar sucesso idempotente. Conteúdo divergente, múltiplas edições ou pareamento incompleto bloqueiam; nunca sobrescrever silenciosamente.
- PT e EN usam exatamente o mesmo filename: `YYYY-MM-DD-slug.md`, nos diretórios `src/content/newsletters/` e `src/content/newsletters-en/`.
- Frontmatter: `title`, `date`, `seoSlug`, `excerpt`, `tags`, `featured`, `draft`. `seoSlug` não começa com data; pode ser traduzido em EN. O pareamento é pelo filename.
- Usar tags existentes, intenção fiel à fonte, uma palavra-chave principal e 2–4 secundárias naturais. Organizar introdução direta, H2/H3 quando sustentados pelo texto e 2–5 links internos de rotas reais, priorizando o guia pilar pertinente. Resumos/FAQ somente derivados da fonte.
- PT e EN têm canonical próprio, hreflang recíproco, lang, title/description, OpenGraph e JSON-LD corretos. Não alterar robots, tópicos, conceitos, componentes ou implementação para publicar uma edição.
- Arquivos gerados esperados: `dist/newsletter/<seoSlug-PT>/index.html` e `dist/en/newsletter/<seoSlug-EN>/index.html`. Confirmar redirects dos filenames antigos com data. Ambas URLs em sitemap e llms-full.txt; PT no RSS existente, que é português por projeto.

## Validação e Git

1. Antes de editar/validar, salvar `node scripts/newsletter-preflight.mjs snapshot-validation /private/tmp/produtocomia-YYYY-MM-DD-RUN-validation.json` no checkout de publicação limpo. Depois escrever os dois Markdown.
2. Rodar integralmente `npm run validate`. Exigir sucesso de check, imagens, build, testes do site, testes de leads e SEO. Repetição única com permissão limitada somente se a causa for exclusivamente ambiental.
3. Rodar `node scripts/newsletter-preflight.mjs verify-validation /private/tmp/produtocomia-YYYY-MM-DD-RUN-validation.json YYYY-MM-DD slug`. Novos arquivos ignorados em `.astro/`, `dist/` e `public/og/newsletter/` são saídas esperadas e nunca são staged. Alterações/remoções preexistentes ou arquivos rastreados fora da allowlist bloqueiam. Não descartar nenhuma saída.
4. Comparar todas as rotas e conteúdo do baseline com dist: `node scripts/newsletter-continuity.mjs candidate /private/tmp/produtocomia-YYYY-MM-DD-RUN-baseline.json dist`. Nenhuma URL antiga ou asset atualmente usado pode faltar. Recursos dinâmicos/Cloudflare exigem auditoria externa; não fingir que são arquivos Astro.
   Vincular também os dois Markdown às páginas efetivamente geradas: o contrato editorial exige `draft: false`, data igual ao filename, uma edição por data em cada idioma e seoSlugs únicos. O deploy executa `verify-editions` com esse contrato e exige HTML, canonical, hreflang, lang, sitemap, corpus LLM e RSS PT. Um build que silenciosamente exclui a edição é bloqueado.
5. Revisar `git status`, `git diff` e `git diff --check`. Adicionar somente os dois Markdown e executar `node scripts/newsletter-preflight.mjs stage-check YYYY-MM-DD slug`. Commit: `content: publish newsletter YYYY-MM-DD in pt and en`.
6. Novo fetch exato de main; o pai do commit deve ser o SHA recém-obtido. Se avançou, parar sem rebase. Push exato: `git push git@github.com:TozatoRodrigo/blog_de_ia.git HEAD:main`.
7. Verificar `git ls-remote git@github.com:TozatoRodrigo/blog_de_ia.git refs/heads/main` igual HEAD. Sem push verificado, não executar deploy.

## Deploy oficial e continuidade

Executar somente `./scripts/deploy.sh`, no checkout limpo publicado, mantendo os symlinks de dependências até terminar. O script valida de novo e recaptura o baseline imediatamente antes de publicar; verifica HEAD/main remoto; compara infraestrutura real; envia apenas o site estático e manifestos públicos de release; ativa uma versão dentro do mount estável de HTML e faz reload gracioso de Nginx.

O caminho editorial não para/recria containers, não empacota/substitui leads, Compose, catálogo ou arquivos privados, não altera `.env.download-leads` nem `lead-data`. A primeira ativação migra apenas root/include do Nginx verificados por hash, mantendo o inode do arquivo montado e os arquivos HTML originais. Mantém assets antigos necessários a sessões abertas. Divergência de infraestrutura bloqueia; não há fallback automático para um deploy completo.

## Coordenação com o pacote semanal

A automação semanal mantém seu horário e produz os candidatos em worktree isolada, usando a mesma trava. O contrato diário aceita apenas newsletters; guias, novos templates privados, catálogo e alterações de infraestrutura exigem um fluxo semanal próprio revisado. Até esse fluxo existir, o semanal preserva os candidatos e entrega o relatório de revisão, sem commit para main, push ou deploy. Essa barreira deve estar no prompt do semanal antes da liberação do caminho diário: enviar um pacote ao main e só depois descobrir que ele não pode ser implantado interromperia os diários.

A verificação integral dos URLs antigos e novos, conteúdo, formulários, assets, APIs, crawler policies e download protegido ocorre antes de finalizar a release. Falha provoca reversão automática do ponteiro/configuração pelo mesmo script e verificação pública do baseline. Reportar evidência de reversão; se ela não puder ser confirmada, declarar isso. Nunca executar outro deploy manual.

O estado da release e as evidências ficam em `/home/rodrigo/apps/radar-ia/releases/<release>/` e no diretório local de evidências mostrado pelo script. Push concluído com deploy pendente não autoriza outro commit equivalente. Retomar somente se HEAD ainda for main remoto e todos os gates forem refeitos; main avançado exige nova preparação a partir da base atual. Não instalar commit antigo para recuperar uma edição.

## Finalização

- Conferir checkout editorial limpo no Git; remover somente symlinks temporários criados pela execução.
- Rodar `node scripts/newsletter-preflight.mjs verify-local /private/tmp/produtocomia-YYYY-MM-DD-RUN-local.json` para provar preservação do checkout manual.
- Liberar a trava com `node scripts/newsletter-preflight.mjs unlock TOKEN`, somente com o token proprietário, também nas saídas por erro. Deploy libera apenas a trava que ele próprio adquiriu.
- Memória/relatório: fonte, assunto, intenção, palavras-chave, filenames/seoSlugs PT/EN, links internos, SHAs base/commit/main, push, release, URLs novas, testes/SEO, listas e contagens baseline/candidato/pós, contribuição/Arena/serviço/download protegido, diretório isolado, caminhos preservados e primeira fonte futura ausente.

## Proibições permanentes

Nunca editar/copiar/limpar HTML manualmente na VPS, parar/recriar containers manualmente, usar rm -rf, git reset/clean/stash, apagar caches/dependências, executar npm install automaticamente, publicar dist/node_modules/segredos/bancos privados no Git, alterar Cloudflare ou ignorar uma validação. Preparações de infraestrutura têm revisão própria e não entram nos commits diários.

## Verificação da preparação

Testes unitários: `npm test`; suite explícita com mounts reais e fixtures Docker locais: `node --test tests/editorial-deploy.integration.mjs`; gate integral: `npm run validate`. A suite Docker cria somente containers de fixture com nomes `newsletter-test-*` e label específica; remove somente esses recursos ao terminar. Nunca usar a VPS como ambiente de testes. Fazer um ensaio sem commit/push/deploy no contexto agendado antes de atualizar a recorrência. Conferir as três próximas execuções reais e sua continuidade.
