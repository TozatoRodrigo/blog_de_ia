# Contribuições editoriais Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual editorial-contributions system that publishes Ricardo Guia's article, credits his links, exposes a professional submission form, and integrates with the existing site without changing newsletter or guide behavior.

**Architecture:** Keep public contribution pages in two new Astro content collections and render them statically with paired Portuguese/English routes. Extend the existing private download-leads service with a separate editorial-submission table, validation workflow, Turnstile action, Resend notification queue, and JSON/form endpoint; pending submissions never become public content. Add focused home, navigation, author, and form components while preserving existing collections and endpoints.

**Tech Stack:** Astro 7, Astro Content Collections, TypeScript, Markdown, Node.js `node:sqlite`, Cloudflare Turnstile, Resend, Node test runner, Cheerio.

---

### Task 1: Add the contribution content contract and route helpers

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/data/contributors.ts`
- Create: `src/utils/contribution-routes.ts`
- Create: `tests/contribution-routes.test.mjs`

- [ ] **Step 1: Write the route-helper test**

Create a test that locks the public URL contract before page files exist.

```js
test('contribution route helpers keep localized paths stable', async () => {
  const { contributionPath, contributionIndexPath } = await import('../src/utils/contribution-routes.ts');
  assert.equal(contributionIndexPath('pt-BR'), '/contribuicoes/');
  assert.equal(contributionIndexPath('en'), '/en/contributions/');
  assert.equal(contributionPath('pt-BR', 'evals-infraestrutura-produto'), '/contribuicoes/evals-infraestrutura-produto/');
  assert.equal(contributionPath('en', 'evals-as-product-infrastructure'), '/en/contributions/evals-as-product-infrastructure/');
});
```

- [ ] **Step 2: Run the route test and verify it fails because the helper does not exist**

Run: `node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/contribution-routes.test.mjs`

Expected: FAIL with a missing module error.

- [ ] **Step 3: Add the reusable author registry**

Create `src/data/contributors.ts` with a typed record keyed by author id. The Ricardo record must contain exactly the supplied identity data and both links.

```ts
export interface Contributor {
  id: string;
  name: string;
  role: string;
  bio: string;
  site?: string;
  links: Array<{ label: string; href: string }>;
}

export const contributors: Record<string, Contributor> = {
  'ricardo-guia': {
    id: 'ricardo-guia',
    name: 'Ricardo Guia',
    role: 'Executivo de produto e autor da Inteligência à Brasileira',
    bio: 'Ricardo Guia é executivo de produto e autor da Inteligência à Brasileira, onde escreve sobre IA a partir do olhar de quem constrói sistemas e produtos com ela.',
    site: 'https://ricardoguia.com/',
    links: [
      { label: 'Inteligência à Brasileira', href: 'https://iabrasileira.com/' },
      { label: 'ricardoguia.com', href: 'https://ricardoguia.com/' },
    ],
  },
};

export function contributorFor(id: string): Contributor {
  const contributor = contributors[id];
  if (!contributor) throw new Error(`unknown-contributor:${id}`);
  return contributor;
}
```

- [ ] **Step 4: Extend Astro content schemas without touching existing schemas**

Add `contributionSchema` with `title`, `date`, `seoSlug`, `excerpt`, `tags`, `authorId`, `translationKey`, `featured`, `draft`, and optional `translationNote`. Register `contributions` against `src/content/contributions` and `contributions-en` against `src/content/contributions-en`.

- [ ] **Step 5: Add bilingual route helpers**

Create `contributionPath(lang, slug)` and `contributionIndexPath(lang)` with trailing slashes matching existing site routes. Add `contributionAlternatePath(lang, slug)` only when the caller supplies the translated slug; do not guess slug translations at runtime.

- [ ] **Step 6: Run the route test and Astro type check**

Run: `node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/contribution-routes.test.mjs && npm run check`

Expected: PASS for stable localized route helpers and no type errors.

- [ ] **Step 7: Commit the content contract**

```bash
git add src/content.config.ts src/data/contributors.ts src/utils/contribution-routes.ts tests/contribution-routes.test.mjs
git commit -m "feat: add editorial contribution content contract"
```

### Task 2: Publish Ricardo's contribution in Portuguese and English

**Files:**
- Create: `src/content/contributions/evals-infraestrutura-produto.md`
- Create: `src/content/contributions-en/evals-as-product-infrastructure.md`
- Create: `src/pages/contribuicoes/index.astro`
- Create: `src/pages/contribuicoes/[slug].astro`
- Create: `src/pages/en/contributions/index.astro`
- Create: `src/pages/en/contributions/[slug].astro`
- Create: `src/components/ContributionCard.astro`
- Create: `src/components/ContributionAuthor.astro`
- Modify: `src/utils/schema.ts`
- Create: `tests/contributions-content.test.mjs`
- Create: `tests/generated-contributions.test.mjs`

- [ ] **Step 1: Add the Portuguese Markdown exactly as supplied**

Copy the DOCX article body into Markdown without rewriting, shortening, adding internal links, or changing the author's wording. Add only frontmatter metadata. Preserve the supplied “Sobre o autor” section and URLs as part of the original content.

```md
---
title: "Seu produto de IA precisa lembrar dos próprios erros"
date: "2026-09-21"
seoSlug: "evals-infraestrutura-produto"
excerpt: "Evals transformam falhas reais em uma infraestrutura que acompanha cada mudança de modelo, prompt ou fluxo."
tags: ["produto", "agentes-de-ia", "governanca-de-ia"]
authorId: "ricardo-guia"
translationKey: "ricardo-evals"
featured: true
draft: false
---
```

- [ ] **Step 2: Add the faithful English translation as a separate Markdown file**

Translate the full article while keeping section order, examples, claims, author bio, links, and meaning. Use the English slug and the same `translationKey`, `authorId`, date, tags, and publication state. Add `translationNote` with a short sentence such as “Translated from the original Portuguese contribution.”

- [ ] **Step 3: Add the reusable author and card components**

`ContributionAuthor.astro` receives a contributor id and language, renders the name, role, bio, site and links, and opens external links with `target="_blank" rel="noopener noreferrer"`. `ContributionCard.astro` receives an entry and language and renders the editorial label, date, title, excerpt, author name, and route.

- [ ] **Step 4: Add the contribution content-pair test**

Create `tests/contributions-content.test.mjs` to parse the two Markdown frontmatters and assert `authorId: "ricardo-guia"`, `translationKey: "ricardo-evals"`, `draft: false`, and the expected localized slugs. This test guards against publishing one language without its pair.

- [ ] **Step 5: Add the Portuguese contribution index**

Load published `contributions`, sort featured entries first and then date descending, render a collection-page schema, and include a CTA to `/contribua/`. Keep the empty state valid and explain that the section will grow through invited and submitted voices.

- [ ] **Step 6: Add the English contribution index**

Mirror the Portuguese index using `contributions-en`, `/en/contribute/`, English copy, and the same sorting rules.

- [ ] **Step 7: Add the Portuguese article route**

Use `getStaticPaths`, `render`, a new `contributionPostingSchema`, `breadcrumbSchema`, the author registry, and the paired English entry. Render the contribution label, breadcrumb, title, excerpt, full `<Content />`, author component, translation note only when present, related editorial links outside the article body, and canonical/alternate metadata.

The `BlogPosting` author must be a `Person` object for Ricardo rather than the editor. Keep the original author content inside the article while using the structured author card for SEO and navigation.

- [ ] **Step 8: Add the English article route**

Mirror the Portuguese route with English labels, `contributions-en`, the Portuguese alternate URL, and the translation note. Do not duplicate route logic with guessed strings; reuse the route helper and contributor component.

- [ ] **Step 9: Add generated-page tests**

Add tests that load the built HTML and assert:

```js
for (const pathname of [
  'contribuicoes/index.html',
  'contribuicoes/evals-infraestrutura-produto/index.html',
  'en/contributions/index.html',
  'en/contributions/evals-as-product-infrastructure/index.html',
]) {
  const $ = await loadPage(pathname);
  assert.equal($('html').attr('lang') === 'en', pathname.startsWith('en/'));
  assert.ok($('main').text().length > 500);
  assert.ok($('script[type="application/ld+json"]').text().includes('BlogPosting') || pathname.endsWith('index.html') && $('script[type="application/ld+json"]').text().includes('ItemList'));
}

const article = await loadPage('contribuicoes/evals-infraestrutura-produto/index.html');
assert.match(article('main').text(), /Ricardo Guia/);
assert.equal(article('a[href="https://iabrasileira.com/"]').attr('rel'), 'noopener noreferrer');
assert.equal(article('a[href="https://ricardoguia.com/"]').attr('rel'), 'noopener noreferrer');
assert.equal(article('link[rel="alternate"][hreflang="en"]').attr('href'), 'https://produtocomia.com.br/en/contributions/evals-as-product-infrastructure/');
```

- [ ] **Step 10: Build and run the generated-page tests**

Run: `npm run build && node --test tests/generated-contributions.test.mjs`

Expected: PASS with four contribution pages and complete language alternates.

- [ ] **Step 11: Commit the published contribution**

```bash
git add src/content/contributions src/content/contributions-en src/pages/contribuicoes src/pages/en/contributions src/components/ContributionCard.astro src/components/ContributionAuthor.astro src/utils/schema.ts tests/contributions-content.test.mjs tests/generated-contributions.test.mjs
git commit -m "feat: publish bilingual editorial contribution"
```

### Task 3: Add contribution form persistence and notification workflow

**Files:**
- Modify: `services/download-leads/src/config.mjs`
- Modify: `services/download-leads/src/security.mjs`
- Modify: `services/download-leads/src/database.mjs`
- Create: `services/download-leads/src/contribution-workflow.mjs`
- Modify: `services/download-leads/src/notifier.mjs`
- Modify: `services/download-leads/src/server.mjs`
- Create: `services/download-leads/test/contribution-workflow.test.mjs`
- Modify: `services/download-leads/test/database.test.mjs`
- Modify: `services/download-leads/test/security.test.mjs`

- [ ] **Step 1: Write failing workflow tests**

Cover valid submission, missing required data, invalid email, invalid URL, oversized content, failed Turnstile, honeypot, and notification retry state. Use an in-memory database and a fake verifier that accepts only `valid-contribution-turnstile`.

```js
const validContribution = {
  name: 'Pessoa autora',
  email: 'autora@example.com',
  role: 'Product Manager',
  siteUrl: 'https://example.com/',
  title: 'Uma contribuição útil',
  excerpt: 'Resumo editorial da contribuição.',
  content: 'Texto completo da contribuição.',
  links: 'https://example.com/referencia',
  bio: 'Bio curta da pessoa autora.',
  language: 'pt-BR',
  privacyVersion: '2026-09-21',
  turnstileToken: 'valid-contribution-turnstile',
  company: '',
  sourcePath: '/contribua/',
};

test('stores a pending contribution and queues its notification', async () => {
  const result = await workflow.submit(validContribution);
  assert.equal(result.status, 'pending');
  assert.equal(db.pendingContributionNotifications(10).length, 1);
});
```

- [ ] **Step 2: Run the service tests and verify they fail**

Run: `npm --prefix services/download-leads test -- --test-name-pattern="contribution"`

Expected: FAIL because the contribution table and workflow do not exist.

- [ ] **Step 3: Add contribution configuration without changing download defaults**

Add `contributionMaxBodyBytes` with a default of `96 * 1024`, `contributionRateLimitAttempts` with a default of `5`, and `contributionPrivacyVersion = env.CONTRIBUTION_PRIVACY_VERSION?.trim() || privacyVersion`. Leave `maxBodyBytes` and every download config key unchanged.

- [ ] **Step 4: Make Turnstile action configurable with a backward-compatible default**

Change `verifyTurnstile` to accept `action = 'download_lead'` and compare `result.action === action`. Existing download calls continue using the default; the contribution workflow passes `action: 'contribution_submit'`. Add tests for both actions.

- [ ] **Step 5: Add the private SQLite submission table and accessors**

Add `editorial_submissions` with these columns: `id`, `name`, `email`, `role`, `site_url`, `title`, `excerpt`, `content`, `links`, `bio`, `language`, `source_path`, `privacy_version`, `status`, `created_at`, `updated_at`, `notification_state`, `notification_attempts`, `notification_last_error`, `notification_sent_at`. Add statements and methods for `createEditorialSubmission`, `pendingContributionNotifications`, `markContributionNotificationSent`, `markContributionNotificationFailed`, and `purgeEditorialSubmissions`.

The table must not reference `leads` or expose a public lookup by id.

- [ ] **Step 6: Implement normalization and validation in a dedicated workflow**

Create `createContributionWorkflow({ config, db, verifyTurnstileFn, clock })` with a `submit()` method. Normalize the e-mail using the existing `normalizeEmail`, allow only `pt-BR` or `en`, require non-empty name/title/excerpt/content/bio/privacy version, cap each text field at a known limit, validate each non-empty link as an `http` or `https` URL, reject non-empty honeypot, verify `contribution_submit`, insert status `pending`, and return `{ id, status: 'pending' }`.

Raise `LeadFlowError` codes `invalid_submission`, `invalid_email`, `invalid_url`, `body_too_large`, `privacy_version_mismatch`, `turnstile_failed`, and `rate_limited` with appropriate 400/413/429 statuses.

- [ ] **Step 7: Add contribution notification formatting and retry batching**

Add `sendContributionNotification({ submission })` to the notifier. The subject must include the submitted title and author name; the text and HTML bodies must include all submitted fields and the full content, escaped in HTML. Use Resend idempotency key `editorial-submission/${submission.id}`. Add `runContributionNotificationBatch({ db, notifier, limit })` and invoke it in the existing startup and 60-second timer alongside the download batch.

If notification fails, increment the submission attempt count and keep the record retryable; after the configured retry limit it remains marked failed for manual recovery.

- [ ] **Step 8: Run all service tests**

Run: `npm --prefix services/download-leads test`

Expected: PASS for existing download tests and all new contribution workflow, database, security, and notification tests.

- [ ] **Step 9: Commit the service workflow**

```bash
git add services/download-leads/src/config.mjs services/download-leads/src/security.mjs services/download-leads/src/database.mjs services/download-leads/src/contribution-workflow.mjs services/download-leads/src/notifier.mjs services/download-leads/src/server.mjs services/download-leads/test
git commit -m "feat: add editorial contribution intake workflow"
```

### Task 4: Expose the contribution endpoint and public form

**Files:**
- Modify: `services/download-leads/src/http.mjs`
- Modify: `services/download-leads/test/http.test.mjs`
- Create: `src/components/ContributionForm.astro`
- Create: `src/pages/contribua.astro`
- Create: `src/pages/en/contribute.astro`
- Create: `tests/contribution-form.test.mjs`

- [ ] **Step 1: Write failing HTTP contract tests**

Add tests for `GET /api/download-leads/config` exposing only the existing public keys, `POST /api/contributions/submit` returning `201` JSON for valid input, rejecting wrong origin/honeypot/invalid email/invalid Turnstile/oversized body, and returning `303` to `/contribua/?submitted=1` for form-encoded no-JavaScript submissions.

```js
const response = await fetch(`${app.baseUrl}/api/contributions/submit`, jsonRequest({
  ...validContribution,
  turnstileToken: 'valid-contribution-turnstile',
}));
assert.equal(response.status, 201);
assert.deepEqual(await response.json(), { status: 'pending' });
```

- [ ] **Step 2: Run the HTTP tests and verify they fail**

Run: `npm --prefix services/download-leads test -- --test-name-pattern="contribution endpoint"`

Expected: FAIL with a 404 for `/api/contributions/submit`.

- [ ] **Step 3: Extend the handler with a separate contribution branch**

Add optional `contributionWorkflow` and `contributionRateLimiter` dependencies to `createLeadHandler`. Route `POST /api/contributions/submit` through origin validation, the dedicated body limit, rate limiter, honeypot, workflow submission, and JSON/form response handling. Keep all existing download branches unchanged.

For JSON requests return `201 { "status": "pending" }`. For form requests redirect with `303` to the localized success URL. On form errors return an escaped noindex HTML fallback containing the submitted safe fields, the localized error, and a link to privacy/contact. Never echo raw HTML from the submitted article into the fallback.

- [ ] **Step 4: Wire the endpoint into application composition**

In `server.mjs`, create the contribution workflow and a distinct rate limiter using the existing cookie secret, pass both to the handler, and expose them on the returned application object for tests. Do not alter download workflow construction.

- [ ] **Step 5: Build the progressive-enhancement form component**

`ContributionForm.astro` must render a real `<form method="post" action="/api/contributions/submit">` with labels, `textarea` fields, hidden `lang`, `sourcePath`, and `privacyVersion`, a visually-hidden `company` honeypot, Cloudflare Turnstile configured with `data-action="contribution_submit"`, and a visible consent checkbox. Add a small client script that fetches the public Turnstile/privacy config, submits `fetch()` as JSON, moves focus to success/error, and leaves the native form fallback intact.

The client script must never send analytics payloads containing name, email, article text, links, or bio.

- [ ] **Step 6: Add Portuguese and English submission pages**

Use the approved visual composition: editorial explanation first, a two-column form on wide screens, stacked fields on small screens, trust copy, privacy link, and direct-contact fallback. `/contribua/` posts `lang=pt-BR`; `/en/contribute/` posts `lang=en`. Render the success state when `submitted=1` and keep the page indexable as a normal editorial-information page.

- [ ] **Step 7: Add generated form tests**

Assert both pages expose all required fields, associated labels, correct language, Turnstile action, non-automatic-publication copy, privacy links, and direct contact fallback. Assert the form action is the same endpoint in both languages.

- [ ] **Step 8: Run build and endpoint tests**

Run: `npm run build && node --test tests/contribution-form.test.mjs && npm --prefix services/download-leads test`

Expected: PASS with localized forms and a working endpoint contract.

- [ ] **Step 9: Commit the intake surface**

```bash
git add services/download-leads/src/http.mjs services/download-leads/src/server.mjs services/download-leads/test/http.test.mjs src/components/ContributionForm.astro src/pages/contribua.astro src/pages/en/contribute.astro tests/contribution-form.test.mjs
git commit -m "feat: add bilingual contribution submission form"
```

### Task 5: Integrate home, navigation, translations, and privacy disclosure

**Files:**
- Create: `src/components/ContributionCTA.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/i18n/ui.ts`
- Modify: `src/pages/privacidade.astro`
- Modify: `src/pages/en/privacy.astro`
- Modify: `tests/download-gate.test.mjs`
- Modify: `tests/generated-seo.test.mjs`

- [ ] **Step 1: Add bilingual UI strings**

Add keys for contribution nav, home strip, featured section, index labels, form labels, validation messages, success state, translation note, author metadata, and privacy disclosure. Use Portuguese and English values rather than inline language conditionals for repeated copy.

- [ ] **Step 2: Add the reusable home CTA and featured component**

`ContributionCTA.astro` receives `lang`, `featuredEntry`, and `featuredAuthor`. It always renders the compact “Contribua” strip; it renders the larger featured card only when an entry is available. Use the approved black/off-white/red style and do not depend on a contribution existing for the component to render safely.

- [ ] **Step 3: Integrate contributions into both home pages**

Load the localized published collection in each home page, select the first featured/date-sorted entry, and place the permanent editorial strip after the recent archive. Place the featured card after the Arena section and before topic coverage. Keep existing newsletter queries, cards, hero, and CTA unchanged.

- [ ] **Step 4: Add menu and footer links**

Add “Contribua” / “Contribute” to the navigation list and contact/footer group with the correct localized route. Preserve the current active-link logic.

- [ ] **Step 5: Update privacy pages**

Add a bilingual section explaining that contribution submissions collect contact and editorial data for evaluation, are stored privately while pending, may be sent through Resend for operational notification, are protected by Turnstile, are not automatically published, and may be requested for access/correction/deletion where applicable. Preserve the existing download-lead disclosure and current contact links.

- [ ] **Step 6: Add integration assertions**

Extend generated SEO tests to assert both home pages link to localized contribution indexes and `/contribua/` pages, the featured Ricardo card appears, and both privacy pages mention editorial submissions. Extend download-gate tests to ensure the existing download form contract is unchanged.

- [ ] **Step 7: Commit the site integration**

```bash
git add src/components/ContributionCTA.astro src/pages/index.astro src/pages/en/index.astro src/components/Header.astro src/components/Footer.astro src/i18n/ui.ts src/pages/privacidade.astro src/pages/en/privacy.astro tests/download-gate.test.mjs tests/generated-seo.test.mjs
git commit -m "feat: surface editorial contributions across the site"
```

### Task 6: Full verification and deployment-readiness audit

**Files:**
- Modify: `scripts/smoke-test.mjs` to cover the new public routes
- Modify: `docs/operations/download-leads-runbook.md` with the contribution endpoint and privacy-version deployment notes
- Create: `tests/editorial-contributions.test.mjs`

- [ ] **Step 1: Run the type checker**

Run: `npm run check`

Expected: PASS with no Astro or TypeScript errors.

- [ ] **Step 2: Build the static site**

Run: `npm run build`

Expected: PASS and output includes Portuguese/English indexes, articles, and form pages.

- [ ] **Step 3: Run all repository tests**

Run: `npm test`

Expected: PASS, including generated SEO, privacy, contribution, and download tests.

- [ ] **Step 4: Run the service test suite**

Run: `npm run test:leads`

Expected: PASS for download and contribution persistence, validation, notification, and HTTP contracts.

- [ ] **Step 5: Run the distribution audit**

Run: `npm run audit:dist`

Expected: PASS with no pending submission content, private endpoints exposed to search, unsafe contact anchors, or broken localized routes.

- [ ] **Step 6: Add a final public-route audit test**

Create `tests/editorial-contributions.test.mjs` that walks `dist/`, fails if any generated HTML contains a pending submission field value or `noindex` is missing from a service fallback, and asserts the four Ricardo pages plus the four contribution/form index routes exist.

- [ ] **Step 7: Review the rendered pages visually**

Use the local Astro preview to inspect desktop and mobile widths for:

- Portuguese and English home contribution strip and featured block;
- contribution indexes;
- Ricardo's two article pages;
- Portuguese and English submission forms;
- inline validation and success state.

Confirm contrast, focus states, line wrapping, external link affordances, and no overflow in long titles.

- [ ] **Step 8: Run the live smoke suite only after local validation**

Run: `npm run validate`

Expected: PASS for check, OG generation, build, all tests, service tests, and distribution audit.

- [ ] **Step 9: Document deployment configuration**

Add the required operational notes for the existing `.env.download-leads`: the service must have the `CONTRIBUTION_PRIVACY_VERSION` value aligned with the updated privacy pages, the same Turnstile site/secret pair must be configured for the production host, and Resend notifications must target the editor mailbox. Do not commit secrets or the production environment file.

- [ ] **Step 10: Commit the final audit documentation**

```bash
git add scripts/smoke-test.mjs docs/operations/download-leads-runbook.md tests/editorial-contributions.test.mjs
git commit -m "chore: verify editorial contributions release"
```
