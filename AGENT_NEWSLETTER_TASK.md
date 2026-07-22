Você é responsável por publicar diariamente a newsletter do Rodrigo Tozato no site Produto com IA.

## ARQUITETURA DO SITE (LEIA ANTES DE QUALQUER COISA)

O site é um projeto **Astro** (gerador de sites estáticos). O fluxo correto é:

1. **Projeto fonte (local):** `/Users/rodrigodiastozato/Desktop/Blog_de_IA`
   - Newsletters em PT: `src/content/newsletters/YYYY-MM-DD-slug.md`
   - Newsletters em EN: `src/content/newsletters-en/YYYY-MM-DD-slug.md`
   - Build: `cd /Users/rodrigodiastozato/Desktop/Blog_de_IA && npx astro build`
   - Output: `dist/` (HTML estático gerado)

2. **Deploy (VPS):** `ssh rodrigo@76.13.173.181`
   - Container Docker: `produtocomia` (nginx:alpine)
   - HTML servido de: `/home/rodrigodiastozato/apps/radar-ia/html`
   - Config: `/home/rodrigodiastozato/apps/radar-ia/docker-compose.yml` + `nginx.conf`

3. **NUNCA edite HTML diretamente na VPS.** Todo HTML é gerado pelo Astro build. Editar HTML manualmente na VPS QUEBRA O SITE (CSS hashes não batem, sitemap fica inconsistente, RSS desatualiza).

## CONTEXTO FIXO

- Timezone: America/Sao_Paulo. Execute pensando em 11:30 da manhã no horário de Brasília.
- Arquivo local da newsletter do dia: `/Users/rodrigodiastozato/Downloads/AgentWorkspace/09 Linkedin Tozato/Newsletter - Programado/Newsletter Programada - DD-MM-YYYY.md`
- VPS: `ssh rodrigo@76.13.173.181` (sem senha)
- Não alterar outros projetos da VPS em `/home/rodrigodiats`. Não tocar em containers, redes ou arquivos fora de `/home/rodrigodiastozato/apps/radar-ia` e `/Users/rodrigodiastozato/Desktop/Blog_de_IA`.

## ESTRUTURA DO PROJETO ASTRO

```
Blog_de_IA/
├── src/
│   ├── content/
│   │   ├── newsletters/          ← markdown PT (frontmatter + body)
│   │   │   └── 2026-07-09-preco-de-ia.md
│   │   └── newsletters-en/       ← markdown EN (mesma estrutura)
│   │       └── 2026-07-09-preco-de-ia.md
│   ├── config.ts                 ← nome do site, autor, email, links
│   ├── data/topics.ts            ← 14 tópicos bilíngues (PT+EN)
│   └── data/concepts.ts          ← 10 conceitos bilíngues (PT+EN)
├── astro.config.mjs              ← site: https://produtocomia.com.br
├── package.json
└── dist/                         ← output do build (NÃO versionar)
```

## FORMATO DO MARKDOWN DE NEWSLETTER

Cada newsletter é um arquivo `.md` com frontmatter:

```markdown
---
title: "Título da edição aqui"
date: "YYYY-MM-DD"
excerpt: "Resumo de 1-2 frases para cards e SEO"
tags: ["tag-canonica-1", "tag-canonica-2", "produto"]
featured: true
draft: false
---

Corpo da newsletter em markdown...

## O resto do radar

**Item** — descrição. [Ler mais](https://url.com)

---
Frase de fechamento.
```

**Tags são chaves canônicas** que casam com `topic.id` em `src/data/topics.ts`. Tags válidas incluem: `inteligencia-artificial`, `agentes-de-ia`, `modelos-de-ia`, `coding-agents`, `finops-de-ia`, `governanca-de-ia`, `precificacao-de-ia`, `adocao-de-ia`, `fintech`, `automacao`, `seguranca-de-ia`, `open-source`, `avaliacao-de-modelos`, `produto`.

## FLUXO OBRIGATÓRIO A CADA EXECUÇÃO

### Passo 1: Validar arquivo do dia
1. Confirme a data local em America/Sao_Paulo e monte o caminho do arquivo.
2. Se o arquivo não existir, NÃO publique nada. Registre que a execução foi ignorada.

### Passo 2: Parsear e criar conteúdo PT
1. Leia o arquivo markdown da newsletter do dia.
2. Extraia: título, data, corpo principal, itens do radar, frase de fechamento, hashtags.
3. Mapeie as hashtags para tags canônicas válidas (lista acima). Se uma hashtag não mapear, use `produto` como fallback.
4. Crie o slug no formato `YYYY-MM-DD-slug-do-titulo` (kebab-case, sem acentos).
5. Crie o arquivo em `src/content/newsletters/YYYY-MM-DD-slug.md` com o frontmatter e body corretos.

### Passo 3: Criar conteúdo EN (tradução)
1. Traduza título, excerpt, corpo e itens do radar para inglês profissional.
2. Crie o arquivo em `src/content/newsletters-en/YYYY-MM-DD-slug.md` com o MESMO nome de arquivo.
3. Mantenha as MESMAS tags canônicas (não traduza as tags).
4. Mantenha as MESMAS URLs dos links externos.

### Passo 4: Build
1. `cd /Users/rodrigodiastozato/Desktop/Blog_de_IA`
2. Se o build travar (problema conhecido de cache), rode: `rm -rf node_modules .astro && npm install && npx astro build`
3. Verifique se o build completou sem erros e gerou as páginas esperadas em `dist/`.
4. Confirme que `dist/newsletter/YYYY-MM-DD-slug/index.html` e `dist/en/newsletter/YYYY-MM-DD-slug/index.html` existem.

### Passo 5: Deploy para VPS
1. Faça backup na VPS: `ssh rodrigo@76.13.173.181 "cp -r /home/rodrigodiastozato/apps/radar-ia/html /home/rodrigodiastozato/apps/radar-ia/backups/YYYYMMDD-HHMMSS"`
2. Pare o container: `ssh rodrigo@76.13.173.181 "docker stop produtocomia"`
3. Limpe o diretório HTML: `ssh rodrigo@76.13.173.181 "rm -rf /home/rodrigodiastozato/apps/radar-ia/html && mkdir -p /home/rodrigodiastozato/apps/radar-ia/html"`
4. Copie o build: `scp -r dist/* rodrigo@76.13.173.181:/home/rodrigodiastozato/apps/radar-ia/html/`
5. Inicie o container: `ssh rodrigo@76.13.173.181 "docker start produtocomia"`
6. Aguarde 3 segundos e valide.

### Passo 6: Validação
Teste na VPS via curl:
1. Homepage PT: `curl -sk -o /dev/null -w '%{http_code}' https://produtocomia.com.br/` → deve ser 200
2. Homepage EN: `curl -sk -o /dev/null -w '%{http_code}' https://produtocomia.com.br/en/` → deve ser 200
3. Newsletter nova PT: `curl -sk -o /dev/null -w '%{http_code}' https://produtocomia.com.br/newsletter/YYYY-MM-DD-slug/` → deve ser 200
4. Newsletter nova EN: `curl -sk -o /dev/null -w '%{http_code}' https://produtocomia.com.br/en/newsletter/YYYY-MM-DD-slug/` → deve ser 200
5. CSS carregando: `curl -sk -o /dev/null -w '%{content_type}' https://produtocomia.com.br/_astro/` → não deve retornar text/html para arquivos .css
6. Sitemap: `curl -sk https://produtocomia.com.br/sitemap-index.xml` → deve listar o sitemap-0.xml
7. RSS: `curl -sk https://produtocomia.com.br/rss.xml` → deve conter a nova newsletter

### Passo 7: Reportar
Ao final, reporte:
- Arquivo local usado (caminho completo)
- Slug gerado
- Arquivos criados no projeto Astro (PT e EN)
- Backup criado na VPS (caminho)
- Build: sucesso ou erros
- URLs publicadas (PT e EN)
- Validações executadas e resultados
- Pontos de atenção

## REGRAS DE SEGURANÇA

1. **NUNCA edite HTML diretamente na VPS.** Tudo passa pelo Astro build.
2. **NUNCA** use `rm -rf` na VPS fora de `/home/rodrigodiastozato/apps/radar-ia/html` e `/home/rodrigodiastozato/apps/radar-ia/backups`.
3. **NUNCA** reinicie ou modifique outros containers, redes ou serviços da VPS.
4. **SEMPRE** faça backup do diretório html antes de fazer deploy.
5. **SEMPRE** pare o container antes de limpar o diretório html (evita race conditions).
6. **SEMPRE** valide que o CSS está sendo servido com MIME type `text/css` após o deploy.
7. Não publique se o parse do Markdown ficar ambíguo (título, corpo ou links quebrados).
8. Não invente fatos nem fontes; preserve os links e textos do arquivo Markdown original.
9. Se a página do dia já existir no content collection (mesmo slug), não duplique. Compare e atualize se necessário.
10. Se precisar criar novo tópico/conceito, adicione em `src/data/topics.ts` ou `src/data/concepts.ts` mantendo a estrutura bilíngue `{ 'pt-BR': ..., 'en': ... }`.
11. O `rm -rf node_modules .astro && npm install` pode ser necessário se o build travar (problema intermitente de cache). Sempre tente `npx astro build` primeiro.

## INFORMAÇÕES DO SITE

- Nome: Produto com IA
- Domínio: produtocomia.com.br
- Autor: Rodrigo Tozato
- Email: rodrigo.tozato@icloud.com
- LinkedIn: https://www.linkedin.com/in/rodrigo-tozato/
- Role: Product Manager · Crédito & Recebíveis
- Analytics: Umami (analytics.servidortozato.cloud, website-id: 3b6d559f-9bec-4f01-9d11-d166999d4b11)
- CDN/DNS: Cloudflare (nameservers louis.ns.cloudflare.com / riya.ns.cloudflare.com)
- Idiomas: Português (padrão, sem prefixo) + Inglês (/en/)
