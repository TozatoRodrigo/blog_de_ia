# Publicação diária de Produto com IA

O repositório canônico é `/Users/rodrigodiastozato/Developer/Blog_de_IA`.
Leia integralmente `docs/operations/daily-newsletter-runbook.md` **da base main remota verificada nesta execução**, antes de editar ou publicar. Esse runbook contém o fluxo autorizado de fontes, isolamento, preservação, validação, Git, deploy e evidências.

- Uma edição por data em America/Sao_Paulo, nos dois idiomas, às 11h30.
- Fonte: `/Users/rodrigodiastozato/Downloads/AgentWorkspace/09 Linkedin Tozato/Newsletter - Programado/Newsletter Programada - DD-MM-YYYY.md`.
- Base única: FETCH_HEAD do novo fetch SSH de `git@github.com:TozatoRodrigo/blog_de_ia.git main`.
- Worktree limpa dentro de `.worktrees/`; checkout manual e todas as mudanças locais preservados.
- Mesmo filename com data em `src/content/newsletters/` e `src/content/newsletters-en/`; URLs canônicas usam seoSlug sem data.
- Commit diário limitado aos dois Markdown; artefatos normais ignorados do build ficam fora do Git.
- Sucesso total de `npm run validate` e preservação de todas as URLs/funcionalidades públicas antes de publicar.
- Push SSH verificado e único comando de produção: `./scripts/deploy.sh`.
- Preservar contribuição, Arena, serviço de leads, `.env.download-leads`, `lead-data` e `private-downloads`.
- Fonte ausente, divergência, falha real de validação ou continuidade não comprovada encerram sem publicação.
- Nenhuma edição manual de HTML/containers na VPS, limpeza, reset/stash, npm install ou mudança de Cloudflare está autorizada na rotina.
