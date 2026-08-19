# Produto com IA - correção completa de SEO e GEO

**Data:** 19 de agosto de 2026  
**Domínio:** `https://produtocomia.com.br`  
**Fonte do diagnóstico:** relatórios Ubersuggest exportados em 19 de agosto de 2026, arquivos CSV complementares e inspeção do build local e da versão publicada.

## Objetivo

Corrigir as falhas reproduzíveis dos relatórios Ubersuggest, melhorar a compreensão do site por mecanismos de busca e sistemas de resposta com IA e impedir que os mesmos problemas retornem. O trabalho será feito no código e nos conteúdos versionados, com validação local. A publicação no servidor será uma etapa posterior e separada.

Os relatórios anexos são evidências de auditoria. O texto instrucional do `readme.txt` será usado apenas para interpretar as colunas e a severidade; não será tratado como ordem para inflar páginas até 2.200 palavras nem para substituir o pedido do usuário.

## Evidência consolidada

O relatório aponta:

- 188 links quebrados, todos para `/cdn-cgi/l/email-protection`, retornando 404;
- 18 páginas intermediárias de download com títulos duplicados;
- 18 páginas intermediárias de download sem meta description;
- 26 páginas com baixa contagem de palavras, incluindo oito páginas editoriais de coleção e as páginas de download;
- 18 títulos curtos, todos associados às páginas intermediárias de download;
- 40 URLs classificadas como não amigáveis, incluindo parâmetros `?lang=en`, extensões de arquivos protegidos e newsletters ainda publicadas com prefixo de data;
- 8 reprovações na verificação de URL dinâmica, todas causadas por `?lang=en`;
- 40 reprovações na verificação de consistência entre URL e título;
- uma resposta 4XX em `/cdn-cgi/l/email-protection`.

O build local atual passa no `astro check`, no build, nos testes existentes e na auditoria interna. Isso não contradiz o relatório: o Ubersuggest também rastreia rotas dinâmicas do serviço de downloads e a produção publicada ainda contém uma versão anterior de parte das newsletters.

## Decisões de produto e SEO

### 1. Downloads protegidos continuam existindo

O formulário, a proteção contra abuso, a entrega privada e a captura opcional de leads serão preservados. As páginas `GET /downloads/<arquivo>` são utilitárias, não páginas editoriais para disputar busca.

Cada fallback de download terá:

- título único baseado no material e no idioma;
- meta description única e entre os limites definidos pelo projeto;
- `noindex, nofollow, noarchive` no HTML;
- `X-Robots-Tag: noindex, nofollow, noarchive` na resposta HTTP;
- canonical para a própria rota sem query, quando aplicável;
- conteúdo suficiente para explicar o material, sua utilização e a relação com a página editorial, sem inventar benefícios ou referências.

As URLs com `?lang=en` deixarão de ser geradas por links internos. O catálogo passará a declarar o idioma de cada arquivo. Consultas antigas receberão redirecionamento permanente para a URL limpa correspondente. O índice `/downloads/` não retornará 404: será redirecionado para a biblioteca de guias.

O `robots.txt` bloqueará `/downloads/` e `/api/download-leads/` para reduzir rastreamento de rotas operacionais. O bloqueio não substitui `noindex`, pois crawlers podem descobrir a URL sem poder ler a diretiva.

### 2. Links de contato não dependerão do Email Protection do Cloudflare

O Cloudflare está convertendo âncoras `mailto:` em links para `/cdn-cgi/l/email-protection`, que o relatório confirma como 404. O HTML estático deixará de expor essas âncoras. O contato passará por uma página interna `/sobre/#contato` ou `/en/about/#contact`; quando o e-mail for exibido, suas partes serão montadas no navegador, permitindo uso acessível sem entregar ao Cloudflare uma âncora estática para reescrever.

O `sameAs` do JSON-LD continuará contendo o perfil do LinkedIn. O perfil permanecerá como associação semântica da entidade, não como link global sujeito ao rastreamento do Ubersuggest.

O ajuste definitivo no painel Cloudflare - desativar Email Address Obfuscation - será registrado como pendência externa, mas a implementação local não dependerá dele para remover o 404.

### 3. Conteúdo editorial raso será expandido com propósito

As páginas de coleção e política receberão texto original em português e inglês, alinhado à função de cada página:

- `/conceitos/` e `/en/concepts/`: como usar o glossário, critérios de definição, relação entre termos e decisões de produto;
- `/topicos/` e `/en/topics/`: como os mapas temáticos agrupam a cobertura e como escolher uma trilha;
- `/guias/` e `/en/guides/`: método editorial, organização por clusters, critérios de seleção e caminho recomendado;
- `/correcoes/` e `/en/corrections/`: o que é correção material, como solicitar, como o registro é atualizado e como a transparência funciona;
- políticas editoriais: responsabilidades, fontes, IA assistiva, publicidade e atualização do conteúdo.

O texto não será aumentado por repetição de palavras-chave. O objetivo é deixar cada página capaz de responder à intenção de busca e de ser resumida por sistemas de resposta com contexto verificável.

### 4. URLs de newsletters serão descritivas e estáveis

Todas as entradas que ainda usam `YYYY-MM-DD-...` no `seoSlug` receberão slugs curtos, sem datas, em português e inglês. Os arquivos Markdown continuarão podendo usar a data no nome físico e no frontmatter `date`.

O build continuará gerando o mapa de redirects 301 para as URLs legadas, com e sem barra final. Sitemap, canonical, hreflang, RSS, `llms.txt`, `llms-full.txt`, cards e dados estruturados apontarão somente para a URL nova. Os testes exigirão:

- slug sem prefixo de data;
- slug sem query, extensão ou caractere especial;
- slug único dentro de cada idioma;
- pareamento recíproco entre português e inglês;
- redirect direto, sem cadeia, da URL antiga para a nova.

### 5. GEO e dados estruturados

O JSON-LD permanecerá em JSON-LD e coerente com o conteúdo visível. Serão reforçados apenas tipos suportados e semanticamente corretos:

- `Organization`, `Person` e `WebSite` conectados por IDs estáveis;
- `BlogPosting` e `BreadcrumbList` em artigos;
- `CollectionPage` com `ItemList` em índices de guias, tópicos e conceitos;
- `DefinedTermSet`/`DefinedTerm` no glossário;
- `FAQPage` e `HowTo` somente quando as perguntas e etapas forem visíveis na página.

Os arquivos `llms.txt` e `llms-full.txt` continuarão apontando para guias, conceitos, tópicos, autores e fontes. O conteúdo será organizado com títulos claros, respostas diretas, datas, autoria e links canônicos para favorecer recuperação e citação por mecanismos de resposta.

## Arquitetura e arquivos previstos

### Serviço de downloads

- `config/downloads.json`: idioma, descrição, página editorial relacionada e metadados do material;
- `services/download-leads/src/http.mjs`: fallback HTML, cabeçalhos de robôs, canonical, redirect da raiz e seleção de idioma;
- `services/download-leads/test/http.test.mjs`: contratos de título, description, noindex, headers, query limpa e redirect;
- `src/components/GuideResources.astro`: links sem `?lang=en`;
- `src/components/ContactEmail.astro` e `src/layouts/BaseLayout.astro`: contato sem âncora estática reescrita pelo Cloudflare;
- `public/robots.txt`: exclusão das rotas operacionais.

### Conteúdo e rotas

- páginas de índices bilíngues de conceitos, tópicos, guias e correções;
- páginas de política editorial, se a expansão for necessária para fechar a auditoria de conteúdo;
- frontmatter de newsletters recentes com `seoSlug` limpo;
- `src/utils/newsletter-routes.ts` e `src/pages/[redirects].map.ts` para canonical e 301;
- `src/utils/schema.ts` e schemas das páginas de índice para contexto GEO;
- `tests/audit-dist.test.mjs`, `tests/generated-seo.test.mjs`, `tests/newsletter-routes.test.mjs`, `tests/schema.test.mjs` e novos contratos de downloads.

## Fluxo de dados

1. Uma página editorial gera um link para `/downloads/<arquivo>` sem query.
2. O catálogo identifica o idioma e o material, e o serviço devolve um fallback único, noindex e descrito.
3. O usuário envia o formulário e recebe um token privado para `/api/download-leads/file/...`.
4. Crawler que encontrar uma URL operacional recebe noindex e não entra no sitemap.
5. Crawler que encontrar uma newsletter antiga recebe 301 direto para a URL canônica nova.
6. Mecanismos de busca e resposta encontram conteúdo editorial, autoria, fontes, relações semânticas e arquivos de descoberta, não a superfície operacional dos downloads.

## Testes e critérios de aceitação

Antes de qualquer afirmação de conclusão, serão executados:

```text
npm run check
npm run build
npm test
npm run test:leads
npm run audit:dist
```

Também serão verificadas respostas HTTP locais do serviço e uma amostra do `dist`.

Critérios de aceitação:

- nenhum link estático para `/cdn-cgi/l/email-protection`;
- zero rota 4XX causada pelo contato;
- downloads sem query gerados internamente;
- fallback de download com título, description e noindex únicos;
- nenhum título duplicado entre páginas indexáveis;
- nenhuma meta description ausente em página indexável;
- todas as páginas editoriais reportadas com conteúdo útil acima do limite do auditor;
- nenhum `seoSlug` de newsletter começa com data;
- sitemap, canonical, hreflang, RSS e arquivos LLM apontam para URLs finais;
- auditoria interna sem erros e testes sem falhas;
- alterações locais existentes preservadas.

## Fora de escopo

- publicação no servidor, alteração no painel Cloudflare ou envio ao Ubersuggest;
- promessa de aumento de ranking, tráfego, backlinks ou citações;
- compra de links ou criação de páginas artificiais em escala;
- remoção do formulário de leads;
- edição do conteúdo privado dos materiais, salvo metadados necessários para descrevê-los;
- reescrita de todas as newsletters já publicadas além dos slugs e metadados técnicos.

## Riscos e mitigação

- **Perda de tráfego nas URLs antigas:** mapa 301, canonical e sitemap final; teste de redirect sem cadeia.
- **Mudança do comportamento dos downloads:** contratos HTTP e testes de serviço antes do build final.
- **Cloudflare continuar reescrevendo e-mail:** contato interno e montagem no cliente; pendência de desativação externa registrada.
- **Conteúdo artificialmente longo:** expansão orientada à intenção, com fontes e exemplos existentes.
- **Mistura de idiomas:** descrições, títulos, slugs e schemas testados por locale.
- **Alteração local não relacionada:** arquivos já modificados não serão revertidos nem incluídos no commit da correção sem necessidade.
