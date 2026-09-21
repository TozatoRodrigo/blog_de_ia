# Editorial Quality-Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the existing editorial contribution intake against forged consent and client-IP spoofing, align privacy disclosures and retention with the live service, and make the no-JavaScript security fallback honest without implementing home or navigation work.

**Architecture:** Keep the contribution workflow as the canonical validation boundary and accept only explicit consent values (`true`, `on`, `1`, or `yes`, case-insensitively). Keep native form submission and the escaped HTML fallback, adding visible no-JavaScript copy that points to the existing contact and privacy routes. Preserve the Nginx/Cloudflare real-IP architecture by overwriting proxy headers with Nginx’s sanitized `$remote_addr`; the service will use the proxy-provided `X-Real-IP` only when the immediate peer is a private proxy address and otherwise use the socket address.

**Tech Stack:** Astro, Node.js HTTP service, SQLite, Nginx, Node test runner, Cheerio.

---

### Task 1: Enforce explicit editorial consent

**Files:**
- Modify: `services/download-leads/test/contribution-workflow.test.mjs`
- Modify: `services/download-leads/test/http.test.mjs`
- Modify: `services/download-leads/src/contribution-workflow.mjs`
- Modify: `services/download-leads/src/http.mjs`

- [x] Add failing workflow assertions for omitted consent, `false`, and arbitrary truthy values, while preserving `consent: 'on'` and JSON `consent: true` as valid.
- [x] Run the focused contribution workflow test and confirm the new assertions fail because consent is currently ignored.
- [x] Add a strict consent parser in the workflow and reject missing/false/unrecognized values as `invalid_submission` before Turnstile or persistence.
- [x] Add HTTP JSON and form regression cases for forged submissions and retain the successful native checkbox encoding path.
- [x] Run the focused service tests and confirm all consent cases pass.

### Task 2: Align privacy/legal disclosure and purge coverage

**Files:**
- Modify: `src/pages/privacidade.astro`
- Modify: `src/pages/en/privacy.astro`
- Modify: `services/download-leads/test/database.test.mjs`
- Modify: `services/download-leads/test/server.test.mjs`

- [x] Add failing privacy-page assertions for version `2026-09-21`, private editorial storage, identity/contact, bio, links, excerpt, article text, Resend notification processing, non-publication, retention, and deletion/contact routing while keeping download disclosures.
- [x] Add a failing database purge assertion proving an old editorial submission is removed together with the existing lead-retention path.
- [x] Update both privacy pages to the configured contribution version and document the two data flows without removing current download details.
- [x] Exercise the existing operational cleanup boundary in tests and keep `purgeEditorialSubmissions(cutoff)` coupled with `purgeOlderThan(cutoff)`.
- [x] Run focused privacy, database, and server tests after the changes.

### Task 3: Make no-JavaScript/Turnstile limitations and fallback explicit

**Files:**
- Modify: `src/components/ContributionForm.astro`
- Modify: `services/download-leads/src/http.mjs`
- Modify: `tests/contribution-form.test.mjs`
- Modify: `services/download-leads/test/http.test.mjs`

- [x] Add failing generated-form assertions that a `<noscript>` message explicitly requires JavaScript for Turnstile and links to both direct contact and privacy routes.
- [x] Add the same safe wording to the server-rendered contribution fallback so validation errors do not imply that direct no-JavaScript submission can pass Turnstile.
- [x] Preserve the native form fields, required consent checkbox, escaped values, noindex fallback, direct contact link, and privacy link.
- [x] Run generated-form and HTTP fallback tests and confirm the copy and routes remain visible.

### Task 4: Harden client identity through the existing proxy boundary

**Files:**
- Modify: `deploy/nginx.conf`
- Modify: `services/download-leads/src/http.mjs`
- Modify: `services/download-leads/test/http.test.mjs`
- Modify: `tests/deploy-contract.test.mjs`

- [x] Add a failing regression test that sends different forged `CF-Connecting-IP` values directly to the service and proves they cannot create separate rate-limit identities.
- [x] Update service IP extraction to validate IP syntax, ignore client-supplied Cloudflare headers on direct connections, and accept only the sanitized `X-Real-IP` from a private proxy peer.
- [x] Make all Nginx upstream locations overwrite both client-IP headers with `$remote_addr`, leaving download route limits and proxy timeouts unchanged.
- [x] Update the deployment contract and run focused service/deploy tests.

### Task 5: Full verification and commit

**Files:**
- No additional production files.

- [x] Run `npm test`.
- [x] Run `npm run test:leads`.
- [x] Run `npm run check`.
- [x] Run `npm run build`.
- [x] Run `npm run audit:dist`.
- [x] Run `git diff --check` and inspect the diff for the Task 5 home/nav boundary.
- [x] Commit as `fix: harden editorial consent privacy and client identity` and report changed files, tests, and commit SHA.
