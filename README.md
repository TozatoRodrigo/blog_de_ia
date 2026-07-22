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

O build é gerado em `dist/` e publicado na VPS `rodrigo@76.13.173.181`, exclusivamente em `/home/rodrigodiastozato/apps/radar-ia`.

Nunca edite o HTML diretamente na VPS. O conteúdo publicado deve sempre ser produzido pelo build do Astro, validado localmente e enviado com backup e possibilidade de rollback.
