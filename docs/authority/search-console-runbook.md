# Google Search Console — roteiro do Produto com IA

Atualizado em 22 de julho de 2026.

## Resultado esperado

O domínio `produtocomia.com.br` verificado como propriedade de domínio, o sitemap aceito, as páginas prioritárias solicitadas para indexação e uma rotina semanal de acompanhamento de consultas, páginas, impressões, cliques e posição média.

## Configuração inicial — uma vez

### 1. Criar a propriedade

1. Acessar [Google Search Console](https://search.google.com/search-console/).
2. Clicar em **Adicionar propriedade**.
3. Escolher **Domínio**.
4. Informar somente `produtocomia.com.br`, sem `https://` e sem caminho.
5. Copiar o valor TXT entregue pelo Google. Não fechar essa tela.

Uma propriedade de domínio reúne protocolos e subdomínios. Essa é a opção recomendada para a visão completa do site.

### 2. Verificar no Cloudflare

1. No painel correto do Cloudflare, abrir o domínio `produtocomia.com.br`.
2. Entrar em **DNS > Records** e selecionar **Add record**.
3. Tipo: **TXT**.
4. Nome: `@` (ou o domínio raiz indicado pela interface).
5. Conteúdo: colar exatamente `google-site-verification=...` fornecido pelo Search Console.
6. TTL: **Auto**.
7. Salvar e voltar ao Search Console para clicar em **Verificar**.

Não apagar nem alterar registros A, AAAA, CNAME, MX ou TXT existentes. O novo TXT de verificação deve permanecer no DNS mesmo depois da confirmação.

### 3. Enviar o sitemap

1. No menu do Search Console, abrir **Sitemaps**.
2. Em “Adicionar um novo sitemap”, informar `sitemap-index.xml`.
3. Confirmar que o endereço completo é `https://produtocomia.com.br/sitemap-index.xml`.
4. Enviar e aguardar o status **Sucesso**.

## Páginas prioritárias para inspeção

Usar a barra **Inspeção de URL**, testar a URL publicada e, quando disponível, clicar em **Solicitar indexação**. Fazer primeiro nestas páginas:

1. `https://produtocomia.com.br/guias/agentes-de-ia/`
2. `https://produtocomia.com.br/guias/como-criar-agentes-de-ia/`
3. `https://produtocomia.com.br/guias/agentes-de-ia-com-n8n/`
4. `https://produtocomia.com.br/guias/governanca-de-ia/`
5. `https://produtocomia.com.br/guias/gestao-de-produto/`
6. `https://produtocomia.com.br/guias/estado-ia-gestao-de-produto-2026/`
7. `https://produtocomia.com.br/guias/`

Não é necessário solicitar individualmente todas as páginas: o sitemap e os links internos cuidam da descoberta do restante. A inspeção tem limites diários.

## Rotina semanal — 15 minutos

Toda segunda-feira, comparar **últimos 28 dias** com o período anterior em **Desempenho > Resultados da pesquisa**.

| Medida | O que observar | Ação |
|---|---|---|
| Impressões | crescimento por cluster e consulta | manter conteúdos que ganham descoberta |
| Cliques | páginas com aumento ou queda | revisar título e descrição se as impressões sobem sem cliques |
| CTR | consultas com posição 1–10 e CTR baixo | alinhar título à intenção da consulta |
| Posição média | consultas nas posições 8–20 | fortalecer conteúdo e links internos relacionados |
| Páginas indexadas | URLs enviadas versus indexadas | inspecionar somente páginas prioritárias excluídas |

Filtros salvos/repetidos:

- Página contém `/guias/agentes-de-ia`
- Página contém `/guias/governanca-de-ia`
- Página contém `/guias/gestao-de-produto`
- Consulta contém `agente`
- Consulta contém `governança`
- Consulta contém `produto`
- País: Brasil
- Tipo de pesquisa: Web

## Registro mensal

| Mês | Cliques | Impressões | CTR | Posição média | Páginas indexadas | Links externos | Observações |
|---|---:|---:|---:|---:|---:|---:|---|
| 2026-07 | — | — | — | — | — | — | linha de base após publicação |

No fechamento mensal, exportar consultas e páginas em CSV. Marcar quais consultas pertencem a Agentes, Governança e Gestão de Produto. A decisão editorial do mês seguinte deve vir das consultas com impressões crescentes e posição entre 8 e 20.

## Diagnóstico rápido

- **Descoberta, não indexada:** aguardar, reforçar links internos e conferir qualidade/duplicação.
- **Rastreada, não indexada:** melhorar conteúdo e diferenciação; não reenviar repetidamente.
- **Página com redirecionamento:** confirmar se o endereço canônico termina com `/`.
- **Bloqueada:** conferir a URL ao vivo; este projeto não bloqueia mecanismos de pesquisa em `robots.txt`.
- **Sitemap não lido:** abrir a URL pública, confirmar HTTP 200 e reenviar o índice.
- **Sem dados no início:** normal para propriedade nova; acompanhar por algumas semanas antes de concluir que há falha.

## Fontes oficiais

- [Adicionar propriedade ao Search Console](https://support.google.com/webmasters/answer/34592)
- [Propriedade de domínio](https://support.google.com/webmasters/answer/10431861)
- [Criar e enviar sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Inspeção de URL](https://support.google.com/webmasters/answer/9012289)
- [Relatório de desempenho](https://support.google.com/webmasters/answer/7576553)
- [Relatório de indexação](https://support.google.com/webmasters/answer/7440203)
- [Adicionar registro DNS no Cloudflare](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/)
