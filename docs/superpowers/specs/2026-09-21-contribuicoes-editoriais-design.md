# Contribuições editoriais

## Contexto

O Produto com IA recebeu uma contribuição pronta de Ricardo Guia sobre evals como infraestrutura de produto. O objetivo desta feature é publicar essa contribuição com autoria, bio e links externos preservados e criar uma experiência repetível para futuras participações editoriais.

O site é um projeto Astro estático, bilíngue, com um serviço privado já existente para captura de leads, validação por Cloudflare Turnstile e notificações por Resend. A feature deve aproveitar essa base sem misturar contribuições com downloads, newsletter ou guias.

## Objetivos

- Publicar a contribuição do Ricardo em português e inglês.
- Preservar integralmente o texto original em português.
- Dar crédito explícito ao autor, sua bio e seus links.
- Criar um índice e páginas individuais de contribuições editoriais.
- Criar uma página de submissão com formulário para nome, e-mail, contexto, site, título, resumo, texto, links e bio.
- Receber submissões para triagem manual, sem publicação automática.
- Dar visibilidade às contribuições na home sem competir com a newsletter.
- Manter uma porta de entrada permanente no menu e no rodapé.
- Manter acessibilidade, SEO bilíngue e comportamento responsivo.

## Fora de escopo

- Painel administrativo com login.
- Publicação automática de textos submetidos.
- Upload de DOCX ou PDF pelo formulário.
- Alteração do conteúdo original do Ricardo em português.
- Reestruturação das coleções de newsletter e guias.
- Mudança de comportamento dos endpoints de download existentes.

Anexos continuam possíveis pelo contato direto com o editor, como ocorreu com o Ricardo.

## Modelo editorial

Contribuições são uma unidade editorial independente. Elas não são newsletter, guia ou texto do editor. Cada publicação tem uma moldura clara de autoria e uma relação explícita entre as versões nos dois idiomas.

O primeiro registro será:

- português: `evals-infraestrutura-produto`;
- inglês: `evals-as-product-infrastructure`;
- autor: Ricardo Guia;
- bio: texto fornecido pelo autor;
- links: `https://iabrasileira.com/` e `https://ricardoguia.com/`;
- tema: evals como infraestrutura de produto;
- status: publicado;
- destaque: sim na primeira publicação.

A versão em português será mantida como recebida. A versão em inglês será uma tradução fiel e terá uma nota discreta informando que é a tradução da contribuição original.

## Rotas públicas

### Português

- `/contribuicoes/` — índice de contribuições;
- `/contribuicoes/evals-infraestrutura-produto/` — contribuição do Ricardo;
- `/contribua/` — orientação e formulário.

### Inglês

- `/en/contributions/` — índice de contribuições;
- `/en/contributions/evals-as-product-infrastructure/` — versão inglesa;
- `/en/contribute/` — orientação e formulário.

As páginas de índice e submissão sempre existirão. A página individual de uma contribuição só será gerada para conteúdo publicado e não rascunho.

## Estrutura de conteúdo

Adicionar as coleções `contributions` e `contributions-en` com schema para:

- `title`;
- `date`;
- `seoSlug`;
- `excerpt`;
- `tags`;
- `authorId`;
- `translationKey`;
- `featured`;
- `draft`;
- `translationNote` opcional.

Adicionar um cadastro reutilizável de autores para que o mesmo autor possa publicar mais de uma contribuição sem duplicar dados de bio e links. O cadastro deve conter nome, função/contexto, bio, site principal e links adicionais.

## Experiência visual

A experiência segue o sistema visual existente: preto, off-white, vermelho de alerta, tipografia display forte, mono para rótulos e composição editorial de alto contraste.

### Home

- faixa editorial permanente com convite para novas vozes;
- seção de contribuição em destaque quando existir publicação;
- destaque com título, resumo, autor e chamada para leitura;
- link “Contribua” no menu e no rodapé;
- fallback seguro quando não houver contribuições publicadas.

### Índice de contribuições

- cabeçalho com função editorial da seção;
- cards com selo, título, resumo, autor e data;
- ordenação por data, com destaque primeiro quando aplicável;
- chamada para enviar uma nova contribuição.

### Página de contribuição

- breadcrumb da seção;
- selo “Contribuição editorial”;
- título e resumo;
- ficha de autor em bloco de contraste forte;
- links para o site e referências do autor;
- corpo integral do artigo;
- leituras relacionadas fora do corpo original;
- nota de tradução somente na versão inglesa;
- política editorial e navegação de retorno.

### Página de submissão

- explicação do propósito antes do formulário;
- indicação de que toda submissão passa por triagem;
- campos curtos, labels visíveis e textos de ajuda;
- bloco de confiança sobre autoria e créditos;
- estado de sucesso com próximos passos;
- alternativa para contato direto por e-mail.

## Formulário e fluxo de triagem

Campos públicos:

- nome obrigatório;
- e-mail obrigatório;
- cargo ou contexto profissional;
- site principal;
- título obrigatório;
- resumo obrigatório;
- texto completo obrigatório;
- links que o autor quer creditar;
- bio curta obrigatória;
- confirmação de autoria e autorização para publicação.

O navegador envia os dados para um endpoint dedicado de contribuições no serviço privado já existente. O endpoint:

1. aceita JSON e formulário tradicional para progressive enhancement;
2. valida campos, e-mail, URLs e tamanho máximo do corpo;
3. aplica Cloudflare Turnstile com ação própria para contribuições;
4. valida origem e aplica honeypot e limite de requisições;
5. salva a submissão em uma tabela privada com status `pending`;
6. envia uma notificação operacional por Resend;
7. retorna confirmação somente quando o envio foi aceito para triagem.

O conteúdo pendente não ganha URL pública, não entra no sitemap e não é indexado. Se a notificação de e-mail falhar, o registro permanece disponível para recuperação e a interface não deve informar uma conclusão falsa.

A tabela de submissões deve ser separada da tabela de leads dos downloads. Os dados são mantidos somente para operação editorial e seguem a política de privacidade do projeto.

As páginas de privacidade em português e inglês devem explicar que o formulário coleta os dados enviados para avaliação editorial, que o texto pode ser mantido internamente enquanto a submissão estiver em análise e que o autor pode solicitar acesso, correção ou exclusão quando aplicável.

## Tratamento de erros

- campos inválidos mostram mensagens próximas ao campo;
- o texto preenchido permanece no formulário após erro recuperável;
- falha de Turnstile informa que o envio precisa ser tentado novamente;
- limite de envio informa para aguardar ou escrever diretamente ao editor;
- falha temporária do serviço oferece o contato por e-mail;
- sucesso move o foco para a mensagem de confirmação;
- links externos abrem em nova aba com `noopener noreferrer`.

## SEO e acessibilidade

Cada contribuição publicada terá:

- `BlogPosting` com título, resumo, autor, data e URL;
- `Person` associado ao autor;
- canonical;
- alternates `pt-BR` e `en`;
- Open Graph próprio;
- entrada no sitemap;
- breadcrumbs;
- links externos normais e rastreáveis, sem `nofollow`, pois são créditos editoriais não patrocinados.

O formulário terá labels associados, foco visível, estados de erro acessíveis, suporte a teclado e estrutura semântica. O conteúdo público será renderizado no servidor e a interação do formulário será progressivamente aprimorada.

## Limites de implementação

Arquivos novos esperados:

- `src/data/contributors.ts`;
- `src/content/contributions/*.md`;
- `src/content/contributions-en/*.md`;
- `src/pages/contribuicoes/index.astro`;
- `src/pages/contribuicoes/[slug].astro`;
- `src/pages/en/contributions/index.astro`;
- `src/pages/en/contributions/[slug].astro`;
- `src/pages/contribua.astro`;
- `src/pages/en/contribute.astro`;
- componentes reutilizáveis para cards, destaque, autoria e CTA;
- utilitário de rotas de contribuição;
- módulos, schema e testes do endpoint de submissão.

Arquivos existentes podem receber apenas extensões localizadas:

- `src/content.config.ts`;
- `src/pages/index.astro` e `src/pages/en/index.astro`;
- `src/components/Header.astro`;
- `src/components/Footer.astro`;
- `src/i18n/ui.ts`;
- `src/pages/privacidade.astro` e `src/pages/en/privacy.astro` para refletir o novo fluxo de dados;
- serviço privado de leads para as rotas e tabela novas;
- testes de auditoria, build e contrato quando necessário.

Nenhum conteúdo existente deve ser reformatado ou reescrito como parte desta feature.

## Verificação

Antes de considerar a feature concluída:

- conferir `npm run check`;
- conferir `npm run build`;
- executar testes unitários e de serviço existentes;
- adicionar testes para schema, pares de tradução, submissão válida e inválida, Turnstile, honeypot, limite de tamanho e falha de notificação;
- verificar que o build gera as quatro páginas do Ricardo;
- verificar home, menu, rodapé, sitemap e alternância de idioma;
- executar auditoria de distribuição sem revelar endpoint ou dados pendentes;
- revisar visualmente desktop e mobile, incluindo formulário, estados de erro e sucesso.

## Critérios de aceite

- O texto original em português é publicado sem alteração.
- A versão em inglês existe e está ligada à versão portuguesa.
- Ricardo Guia aparece como autor com bio e os dois backlinks fornecidos.
- A home exibe a faixa editorial e o destaque da contribuição publicada.
- Menu, rodapé, índice e páginas individuais apontam para rotas corretas.
- O formulário aceita texto colado e não aceita publicação automática.
- O endpoint protege, valida e registra submissões pendentes.
- Falhas de envio não descartam silenciosamente o texto do autor.
- A coleção vazia não quebra nenhuma página existente.
- As validações do projeto passam sem regressões.
