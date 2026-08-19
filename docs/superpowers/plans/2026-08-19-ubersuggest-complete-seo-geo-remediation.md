# Complete SEO and GEO Remediation Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints. Steps use checkbox syntax for tracking.

**Goal:** Eliminate the Ubersuggest errors reproducible in source/build, improve bilingual editorial pages, canonical URLs, structured data, and AI-answer discovery without removing protected downloads or lead capture.

**Architecture:** Astro remains the source of public editorial HTML and the download-leads service remains the only owner of protected resource delivery. Utility download pages become explicit noindex fallbacks with unique localized metadata; editorial pages remain the only indexable resource surfaces. Newsletter canonical paths are driven by seoSlug, and the generated Nginx map preserves direct 301 redirects from every legacy dated path.

**Tech Stack:** Astro 7, TypeScript, Node.js test runner, Cheerio, Node HTTP service, Nginx, JSON-LD, Markdown frontmatter.

**Design:** docs/superpowers/specs/2026-08-19-ubersuggest-complete-seo-geo-remediation-design.md

---

## File map

- Modify services/download-leads/src/catalog.mjs and config/downloads.json for language, description, and related editorial URL metadata.
- Modify services/download-leads/src/http.mjs for unique noindex fallback pages, canonical clean URLs, X-Robots-Tag, language-aware redirects, and a non-4XX downloads root.
- Modify services/download-leads/test/http.test.mjs and services/download-leads/test/container-contract.test.mjs for HTTP and deployment contracts.
- Modify src/components/GuideResources.astro to emit clean file URLs without ?lang=en.
- Create src/components/ContactEmail.astro; modify BaseLayout, Footer, about, privacy, and editorial-policy pages to remove static mailto anchors.
- Modify public/robots.txt to exclude operational download paths.
- Expand the bilingual concepts, topics, guides, corrections, and editorial-policy pages with useful non-repetitive copy.
- Modify schema helpers and index templates for ItemList and DefinedTermSet data.
- Modify all dated newsletter frontmatter from 2026-08-01 through 2026-08-18.
- Extend the build auditor, generated SEO tests, route tests, schema tests, and download service tests.
- Modify docs/operations/download-leads-runbook.md with the external Cloudflare follow-up.

Existing user changes in Footer.astro, global.css, and tests/download-gate.test.mjs remain in place and are merged carefully.

---

### Task 1: Add failing report-derived regression tests

**Files:** services/download-leads/test/http.test.mjs, tests/audit-dist.test.mjs, tests/newsletter-routes.test.mjs, tests/generated-seo.test.mjs

- [ ] Step 1: Add a service test for GET /downloads/ai-risk-matrix.csv?lang=en expecting status 200, a unique title containing AI risk matrix, a non-empty description, noindex, a canonical without the query, and X-Robots-Tag: noindex, nofollow, noarchive.
- [ ] Step 2: Add a service test for GET /downloads/ expecting 301 to /guias/ without a language query and /en/guides/ with lang=en.
- [ ] Step 3: Add a route test asserting a dated slug throws dated-newsletter-seo-slug.
- [ ] Step 4: Add generated HTML assertions for queryless download links, descriptions on indexable pages, and no /cdn-cgi/l/email-protection href.
- [ ] Step 5: Run npm --prefix services/download-leads test and the focused Node tests; record the expected RED failures before implementation.
- [ ] Step 6: Commit only the red tests with message test: cover remaining Ubersuggest SEO failures.

---

### Task 2: Make protected downloads crawler-safe and URL-clean

**Files:** config/downloads.json, services/download-leads/src/catalog.mjs, services/download-leads/src/http.mjs, src/components/GuideResources.astro, public/robots.txt, services/download-leads/test/http.test.mjs, tests/download-catalog.test.mjs

- [ ] Step 1: Add language, localized description, and localized relatedUrl to every catalog item. Portuguese filenames use pt-BR; English filenames use en. Related URLs must point to the existing guide that references each material.
- [ ] Step 2: Validate those fields in catalog.mjs, including both localized descriptions and both related URLs.
- [ ] Step 3: Update fallbackPage to emit an escaped localized title, meta description, noindex/noarchive, self-canonical without query, related-guide link, and the existing protected form.
- [ ] Step 4: Add X-Robots-Tag: noindex, nofollow, noarchive to fallback responses.
- [ ] Step 5: Add a 301 redirect helper and make /downloads/ redirect to /guias/ or /en/guides/. Make valid ?lang=en requests redirect to the same file without the query.
- [ ] Step 6: Change GuideResources.astro so it never appends ?lang=en; the catalog language determines the resource language.
- [ ] Step 7: Add Disallow: /downloads/ and Disallow: /api/download-leads/ under the wildcard robots block.
- [ ] Step 8: Run all download service tests, catalog tests, and download gate tests; verify authorized file delivery still uses attachment.
- [ ] Step 9: Commit with message fix: make protected downloads crawler-safe.

---

### Task 3: Remove Cloudflare-rewritten contact anchors

**Files:** create src/components/ContactEmail.astro; modify src/layouts/BaseLayout.astro, src/components/Footer.astro, src/pages/sobre.astro, src/pages/en/about.astro, src/pages/privacidade.astro, src/pages/en/privacy.astro, src/pages/politica-editorial.astro, src/pages/en/editorial-policy.astro, tests/seo.test.mjs, tests/generated-seo.test.mjs

- [ ] Step 1: Add a failing generated-page assertion that no static HTML contains mailto: or /cdn-cgi/l/email-protection and that the about pages contain internal contact anchors.
- [ ] Step 2: Run the generated tests and observe RED against the current static mailto anchors.
- [ ] Step 3: Create ContactEmail.astro that splits SITE.email into separate data attributes, renders an accessible fallback label, and never emits the complete address or a static mailto href.
- [ ] Step 4: Add one BaseLayout script that converts data-contact-email elements into mailto links after hydration using the separate data attributes.
- [ ] Step 5: Replace footer and policy email links with internal /sobre/#contato or /en/about/#contact actions. Keep sameAs in JSON-LD and the service notification address unchanged.
- [ ] Step 6: Run build, generated SEO tests, SEO tests, and download-gate tests.
- [ ] Step 7: Commit with message fix: remove crawler-broken contact anchors.

---

### Task 4: Expand thin editorial pages

**Files:** concepts index pages, topics index pages, guides index pages, corrections pages, editorial-policy pages, tests/audit-dist.test.mjs

- [ ] Step 1: Add a failing generated audit contract for /conceitos/, /correcoes/, /topicos/, /guias/, /en/concepts/, /en/corrections/, /en/topics/, and /en/guides/. Each path must have at least 200 words in main, one H1, a description, and an explanatory section outside the card grid.
- [ ] Step 2: Run the audit test and observe failures for the pages named in low_word_count.csv.
- [ ] Step 3: Add Portuguese sections explaining how the glossary, topic map, guide library, corrections log, and editorial policy should be used. Use existing internal pages and real editorial practices; do not add keyword repetition.
- [ ] Step 4: Add equivalent English sections with language-specific headings, links, and descriptions.
- [ ] Step 5: Run astro check, build, audit-dist, and the generated SEO tests.
- [ ] Step 6: Commit with message content: expand bilingual SEO collection pages.

---

### Task 5: Add collection and glossary schemas for GEO

**Files:** src/utils/schema.ts, concepts index pages, topics index pages, guides index pages, tests/schema.test.mjs

- [ ] Step 1: Add failing pure tests for itemListSchema and definedTermSetSchema. Verify absolute URLs, positions beginning at 1, and locale fields.
- [ ] Step 2: Run schema.test.mjs and confirm RED because the helpers do not exist.
- [ ] Step 3: Implement the two minimal JSON-LD helpers using absoluteUrl. Do not add invisible FAQ or HowTo entities.
- [ ] Step 4: Pass visible topic, guide, and concept cards into ItemList; pass visible glossary entries into DefinedTermSet and ItemList. Keep existing CollectionPage and connected entity schemas.
- [ ] Step 5: Build and run schema tests, generated SEO tests, and audit-dist. Confirm JSON-LD parses and matches visible links.
- [ ] Step 6: Commit with message feat: add collection schemas for GEO discovery.

---

### Task 6: Migrate every remaining dated newsletter slug

**Files:** all dated newsletter frontmatter under src/content/newsletters and src/content/newsletters-en, src/utils/newsletter-routes.ts, route and generated SEO tests

- [ ] Step 1: Make assertUniqueNewsletterSlugs reject /^\d{4}-\d{2}-\d{2}-/ with dated-newsletter-seo-slug.
- [ ] Step 2: Run newsletter-routes.test.mjs and confirm RED against the 36 current dated slugs.
- [ ] Step 3: Apply this exact map to 2026-08-01 through 2026-08-18:

| Date | Portuguese | English |
|---|---|---|
| 08-01 | modelo-ia-peca-trocavel | interchangeable-ai-model |
| 08-02 | transparencia-custo-ia | ai-cost-transparency |
| 08-03 | openai-desliga-atlas | openai-atlas-shutdown |
| 08-04 | lacuna-produtividade-ia | ai-productivity-gap |
| 08-05 | agente-ia-carteira-limite | ai-agent-portfolio-limit |
| 08-06 | custo-ia-ideias-engavetadas | ai-cost-backlog |
| 08-07 | humano-no-loop-supervisao-agentes | human-in-loop-agent-supervision |
| 08-08 | preco-sonnet-5-orcamento-ia | sonnet-5-ai-budget |
| 08-09 | gestao-gastos-ia-rippling | rippling-ai-spend |
| 08-10 | gemini-flash-custo-roadmap | gemini-flash-roadmap-cost |
| 08-11 | agentes-ia-bancos | ai-agents-banks |
| 08-12 | capital-infraestrutura-ia-nvidia | nvidia-ai-infrastructure-capital |
| 08-13 | pricing-por-tarefa | task-based-ai-pricing |
| 08-14 | fraude-documental-marca-dagua | ai-document-fraud-watermarks |
| 08-15 | ia-privada-credito-saude | private-ai-credit-healthcare |
| 08-16 | agentes-ia-limite-pagamento | ai-agent-payment-boundary |
| 08-17 | orquestracao-modelos-ia | model-orchestration-product |
| 08-18 | garantia-openai-infraestrutura-ia | openai-infrastructure-guarantee |

- [ ] Step 4: Build and inspect the generated redirect map, sitemap, RSS, llms.txt, llms-full.txt, and one PT/EN newsletter. Confirm legacy paths redirect directly and emitted links are final.
- [ ] Step 5: Commit with message fix: migrate remaining newsletters to clean slugs.

---

### Task 7: Strengthen audit and deployment contracts

**Files:** scripts/lib/audit-dist.mjs, scripts/audit-dist.mjs, tests/audit-dist.test.mjs, tests/deploy-contract.test.mjs, docs/operations/download-leads-runbook.md

- [ ] Step 1: Add failing auditor assertions for descriptions, 200-word collection pages, queryless download links, no global /cdn-cgi/ anchors, and dated indexable newsletter paths.
- [ ] Step 2: Run the focused auditor and deployment tests and confirm RED.
- [ ] Step 3: Implement the rules while preserving the noindex 404 exception and keeping protected downloads outside static dist.
- [ ] Step 4: Keep Nginx redirect-map inclusion, service routing, rollback, and secret boundaries covered by the existing deployment contracts.
- [ ] Step 5: Document the external Cloudflare action: disable Email Address Obfuscation and rerun the broken-link report after deployment.
- [ ] Step 6: Run npm run build, npm run audit:dist, and the focused contract tests; expect zero audit errors and warnings.
- [ ] Step 7: Commit with message test: enforce complete SEO remediation contracts.

---

### Task 8: Full verification and handoff

**Files:** no planned source changes; fix only a specifically identified verification regression.

- [ ] Step 1: Run npm run check, npm run build, npm test, npm run test:leads, and npm run audit:dist. Every command must exit 0.
- [ ] Step 2: Inspect generated signals with rg for cdn-cgi, static mailto, ?lang=en, and dated canonical newsletter paths. Date strings may remain in publication metadata and redirect keys, not canonical paths or internal links.
- [ ] Step 3: Verify service behavior for clean fallback, legacy query redirect, downloads root redirect, controlled unknown-material 404, and authorized attachment delivery.
- [ ] Step 4: Review git diff --check, status, and stat. Confirm pre-existing user changes remain preserved.
- [ ] Step 5: Report local validation, the Cloudflare dashboard follow-up, the fact that production was not changed, and post-deploy sitemap/Ubersuggest/Search Console actions.

