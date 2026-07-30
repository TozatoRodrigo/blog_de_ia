# Produto com IA — remediação SEO do Ubersuggest

**Data:** 30 de julho de 2026  
**Domínio:** `https://produtocomia.com.br`  
**Fonte do diagnóstico:** relatório Ubersuggest exportado em 30 de julho de 2026 às 13h20, build local e inspeção do site publicado

## Objetivo

Eliminar as causas reproduzíveis dos alertas do Ubersuggest, reduzir o risco de novas regressões e melhorar a base técnica para descoberta orgânica. O trabalho não promete posição, tráfego ou backlinks; ele garante que o site publique conteúdo indexável, útil, estável e auditável.

## Evidência e linha de base

O relatório registrou 267 URLs rastreadas, nota on-page 79, 236 problemas, tráfego orgânico zero, palavras-chave orgânicas zero e backlinks zero. Os grupos reportados foram:

- 20 páginas com pouco conteúdo;
- 14 páginas com títulos duplicados;
- 144 páginas com links quebrados;
- 33 páginas com URLs mal formatadas;
- 12 páginas com título curto;
- 12 páginas sem meta description;
- uma URL com resposta 4XX;
- LCP de 1,30 s, INP de 228,34 ms e CLS histórico de 0,97.

O site foi republicado às 14h35, depois da exportação. No build atual há 145 páginas HTML, 0 erros e 0 avisos na auditoria interna, 40 testes do site e 38 testes do serviço aprovados. A comparação pós-deploy encontrou:

- nenhuma meta description ausente;
- nenhum link interno quebrado e todas as URLs do sitemap respondendo na origem;
- 13 títulos abaixo de 35 caracteres e um título ainda duplicado entre PT e EN;
- exatamente 20 páginas de conceitos abaixo de 200 palavras de conteúdo principal;
- 52 URLs de newsletter com prefixo de data e 23 rotas com mais de 80 caracteres no caminho;
- o perfil do LinkedIn repetido em praticamente todas as páginas devolvendo 999 ou 405 para robôs;
- CLS de laboratório de 0,0904, provocado principalmente pela troca tardia das fontes web;
- AdSense Auto Ads carregado globalmente, bloqueios de CSP para recursos de anúncios e quatro erros no console.

As diferenças mostram que parte do relatório já foi corrigida pelo deploy posterior. Esta fase trata o que ainda é reproduzível e adiciona proteção contra o retorno dos alertas antigos.

## Abordagem aprovada

Foi escolhida a correção completa e conservadora de autoridade: conteúdo bilíngue específico, metadados únicos, remoção de links que parecem quebrados para robôs, migração de URLs com 301, fontes locais e retirada temporária do Auto Ads global. Como o relatório registra zero tráfego, palavras-chave e backlinks, este é o momento de corrigir a arquitetura de URLs com custo mínimo de migração.

## 1. Conteúdo das páginas de conceitos

O tipo `Concept` ganhará um campo bilíngue `productImpact`. Cada um dos dez conceitos terá um texto próprio que transforma a definição em decisão de produto: quando o conceito importa, qual evidência coletar, qual risco observar e qual métrica ou limite operacional usar.

Os templates PT e EN exibirão a nova seção depois da explicação detalhada, com um H2 localizado. O conteúdo visível e o schema continuarão coerentes: o `DefinedTerm.description` permanecerá como definição curta, enquanto a página oferecerá contexto editorial adicional.

Critério de aceitação: as 20 páginas indexáveis em `/conceitos/` e `/en/concepts/` terão pelo menos 200 palavras dentro de `main`, sem repetir o mesmo parágrafo entre conceitos.

## 2. Títulos e descriptions

O componente `SEO.astro` continuará como a única origem de metadados. Títulos curtos receberão um complemento localizado:

- PT: `IA para PMs`;
- EN: `AI for PMs`.

O complemento será aplicado quando o título com marca tiver menos de 40 caracteres. Isso diferencia termos idênticos nos dois idiomas, incluindo `Coding Agents`, e preserva o teto de 60 caracteres. Titles serão avaliados no conjunto completo do build, não apenas página a página.

Descriptions continuarão com fallback localizado e corte em palavra. A auditoria passará a exigir exatamente uma meta description não vazia por página indexável, entre 70 e 160 caracteres.

Critérios de aceitação:

- títulos indexáveis únicos no site inteiro;
- títulos entre 35 e 60 caracteres;
- exatamente uma description entre 70 e 160 caracteres;
- nenhum título ou description português na versão inglesa.

## 3. Links do LinkedIn e links internos

O LinkedIn bloqueia crawlers com códigos 999/405, embora o perfil exista. Para impedir que um único destino contamine quase todas as páginas:

- o rodapé apontará para a página interna do autor;
- CTAs globais e caixas de autor apontarão para `/sobre/` ou `/en/about/`;
- as páginas sobre usarão email e arquivo da newsletter como ações visíveis;
- `sameAs` no JSON-LD continuará contendo o perfil do LinkedIn, preservando a associação da entidade sem expor um `<a>` que o auditor classifique como quebrado.

Links editoriais para fontes primárias permanecem, pois são evidência do conteúdo. A auditoria de build continuará bloqueando links internos inexistentes.

Critério de aceitação: nenhum `<a href>` gerado terá o domínio `linkedin.com`, e o schema de Person/Organization manterá o perfil em `sameAs`.

## 4. URLs de newsletter e redirecionamentos

As datas continuarão nos metadados e nomes dos arquivos de conteúdo, mas sairão das URLs públicas. Cada newsletter receberá `seoSlug` no frontmatter:

- PT com slug curto e descritivo em português;
- EN com slug curto e descritivo em inglês.

Os templates dinâmicos, cards, homepage, RSS, `llms.txt`, `llms-full.txt`, alternates, canonical e schema usarão o `seoSlug`. As coleções PT e EN serão pareadas por data e testes exigirão uma correspondência única e recíproca.

Um endpoint de build gerará `dist/_newsletter-redirects.map` a partir do `id` legado e do novo `seoSlug`. O Nginx incluirá esse mapa e devolverá 301 das formas antigas, com e sem barra final, para a nova canonical. O sitemap listará apenas os destinos novos.

O Nginx deixará de servir páginas de diretório sem barra por meio de `$uri/index.html`; caminhos HTML sem barra serão normalizados para a versão com barra. Arquivos reais como RSS, sitemap, imagens e downloads não receberão barra.

Critérios de aceitação:

- nenhuma rota canônica de newsletter começa com `YYYY-MM-DD-`;
- slugs ingleses estão em inglês;
- toda rota antiga responde 301 diretamente para uma rota nova;
- não existem cadeias ou loops de redirecionamento;
- todos os links internos já apontam diretamente para a canonical final.

## 5. Estabilidade visual e interatividade

As fontes Archivo Black, Inter e JetBrains Mono serão hospedadas em `public/fonts/`, com licenças preservadas, `@font-face` local, `font-display: optional` e preload apenas dos arquivos latinos usados acima da dobra. As chamadas a Google Fonts e `fonts.gstatic.com` serão removidas.

O AdSense Auto Ads global será removido temporariamente. O script hoje executa em todas as páginas, tenta inserir anúncios sem espaço reservado e é parcialmente bloqueado pela CSP. Quando houver tráfego que justifique monetização, anúncios poderão voltar como unidades manuais e responsivas, abaixo da dobra, em contêineres com altura reservada.

O handler de rolagem será limitado a um `requestAnimationFrame` por frame. A barra de leitura usará `transform: scaleX()` em vez de alterar `width`, evitando recálculo de layout. A configuração de prefetch será reduzida de todos os links para uma estratégia intencional, evitando trabalho e requisições desnecessárias.

A CSP removerá origens exclusivas do AdSense e do Google Fonts. O beacon injetado pela Cloudflare continuará bloqueado até que Browser Insights seja desativado no painel ou pela API; ele não será liberado apenas para esconder um erro de console e adicionar mais JavaScript.

Critérios de aceitação:

- nenhuma requisição a Google Fonts ou AdSense no carregamento inicial;
- nenhum recurso bloqueado relacionado ao AdSense;
- CLS de laboratório abaixo de 0,1 em desktop e mobile;
- scripts próprios sem long task acima de 200 ms nas interações testadas;
- LCP não piora em relação à linha de base de 1,30 s.

O INP de campo leva até 28 dias para refletir a mudança. A validação local mede proxies reproduzíveis, não substitui os dados reais do Chrome UX Report.

## 6. Auditoria automática e observabilidade

O auditor do `dist` ganhará verificações para:

- título e description únicos e dentro dos limites;
- contagem mínima nas páginas de conceitos;
- ausência de âncoras globais do LinkedIn;
- rotas de newsletter sem data e com comprimento controlado;
- presença do mapa de redirecionamentos;
- alternates e canonicals apontando para rotas finais;
- apenas uma URL indexável por página.

Testes de contrato cobrirão o Nginx e o deploy para garantir 301 permanente, inclusão do mapa e rollback do arquivo junto com a versão do site. O smoke test publicado verificará uma amostra PT/EN, uma rota antiga, sitemap, canonical, título, description, robots e uma URL inexistente que deve responder 404.

## 7. Publicação

Depois de `npm run validate`, o deploy existente será usado com backup e rollback. A publicação incluirá o mapa de redirects no mesmo pacote do HTML, evitando divergência entre página e regra 301.

Após o deploy serão executados:

1. smoke tests locais contra o build;
2. smoke tests HTTPS contra produção;
3. medição em navegador de console, CLS e recursos de terceiros;
4. conferência de sitemap e robots;
5. nova auditoria no Ubersuggest quando o recrawl estiver disponível.

Search Console, Bing e os dados de campo continuarão sendo monitorados; mudanças de posição serão avaliadas em semanas, não imediatamente após a publicação.

## Fora de escopo

- garantia de ranking, tráfego, backlinks ou citação por mecanismos de IA;
- compra de links;
- alteração da marca ou do modelo editorial diário;
- reativação de anúncios sem unidades e dimensões aprovadas;
- remoção de fontes editoriais válidas apenas porque um provedor bloqueia HEAD ou robôs.

## Riscos e mitigação

- **Perda de sinais nas URLs antigas:** 301 direto, canonical final e sitemap apenas com destinos.
- **Erro manual em 52 slugs:** schema obrigatório, unicidade e pareamento PT/EN testados.
- **Conteúdo artificialmente inflado:** cada `productImpact` será específico e orientado a decisões reais.
- **Mudança visual das fontes:** arquivos locais serão os mesmos tipos usados hoje; `optional` prioriza estabilidade quando o carregamento for lento.
- **Perda de receita de anúncios:** o relatório mostra tráfego zero; a retirada é temporária e reversível.
- **Cloudflare continuar injetando o beacon:** desativação será tratada como etapa externa verificável e registrada se não houver credencial disponível.

## Ordem de implementação

1. ampliar auditor e testes para reproduzir cada falha;
2. corrigir títulos, descriptions e links do LinkedIn;
3. expandir os conceitos bilíngues;
4. migrar slugs e gerar redirects 301;
5. otimizar fontes, scripts, CSP e prefetch;
6. executar validação completa, revisão e deploy seguro;
7. verificar produção e registrar as pendências externas.
