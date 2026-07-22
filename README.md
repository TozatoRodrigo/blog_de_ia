# Produto com IA

Site estático bilíngue do Produto com IA, construído com Astro.

## Desenvolvimento

```bash
npm install
npm run dev
```

Antes de publicar:

```bash
npm run validate
```

O build é gerado em `dist/` e publicado na VPS `rodrigo@76.13.173.181`, exclusivamente em `/home/rodrigo/apps/radar-ia`.

Nunca edite o HTML diretamente na VPS. O conteúdo publicado deve sempre ser produzido pelo build do Astro, validado localmente e enviado com backup e possibilidade de rollback.

## Downloads com captura de leads

Os materiais são entregues por um serviço privado; eles nunca devem ser copiados diretamente para o diretório público `html`. A publicação em produção exige o arquivo exclusivo do servidor `.env.download-leads` e as credenciais de Resend e Cloudflare Turnstile.

- [Desenho da solução](docs/superpowers/specs/2026-07-22-captura-leads-downloads-design.md)
- [Plano de implementação](docs/superpowers/plans/2026-07-22-captura-leads-downloads.md)
- [Manual de ativação e operação](docs/operations/download-leads-runbook.md)
