# Final Editorial Intake Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the final production-quality gaps in the editorial contribution intake without implementing home or navigation integration.

**Architecture:** Put the lead service on a private Compose network shared only with the Nginx sidecar, while Nginx remains the only Traefik-facing container and overwrites client-IP headers after its trusted Cloudflare/Traefik real-IP processing. Return a safe contribution error contract containing a stable code and allowlisted field name, then let the enhanced form render localized field errors and focus its live status. Keep the static direct `mailto:` only as the intentional no-JavaScript fallback and verify it safely in generated/live smoke checks.

**Tech Stack:** Astro, Node.js HTTP service, Docker Compose, Nginx, Node test runner, Cheerio.

---

### Task 1: Close the proxy trust boundary

**Files:**
- Modify: `deploy/docker-compose.yml`
- Modify: `services/download-leads/src/config.mjs`
- Modify: `services/download-leads/src/http.mjs`
- Modify: `deploy/download-leads.env.example`
- Test: `services/download-leads/test/config.test.mjs`
- Test: `services/download-leads/test/http.test.mjs`
- Test: `services/download-leads/test/container-contract.test.mjs`
- Test: `tests/deploy-contract.test.mjs`

- [x] Add tests proving the service trusts `X-Real-IP` only from the exact configured internal proxy CIDR, ignores direct `X-Real-IP`, `CF-Connecting-IP`, and `X-Forwarded-For`, and that Compose puts Nginx and the service on a private internal network while the service is absent from the Traefik-facing network.
- [x] Run the focused tests and observe the new assertions fail against the shared-network/broad-private-range implementation.
- [x] Add a configured trusted-proxy CIDR, validate it as an IPv4 CIDR, define a Compose internal network with a fixed subnet, attach Nginx to both networks and the lead service only to the internal network, and use the configured CIDR when accepting sanitized `X-Real-IP`.
- [x] Preserve Nginx’s trusted Cloudflare/Traefik real-IP handling and all upstream header overwrites; rerun focused tests.

### Task 2: Make contribution validation errors field-addressable

**Files:**
- Modify: `services/download-leads/src/contribution-workflow.mjs`
- Modify: `services/download-leads/src/http.mjs`
- Modify: `src/components/ContributionForm.astro`
- Test: `services/download-leads/test/http.test.mjs`
- Test: `tests/contribution-form.test.mjs`

- [x] Add failing JSON endpoint assertions for invalid email, invalid website URL, and missing/invalid content: each response must contain only the stable safe `error`, `field`, and localized `message` contract and must not contain submitted values.
- [x] Add failing generated-form assertions for per-field error targets and client code that sets `aria-invalid`, preserves help text in `aria-describedby`, and focuses the status region.
- [x] Attach allowlisted field metadata to validation errors (`email`, `siteUrl`, `links`, or `content`), return it through the endpoint, render nearby localized error text, clear stale errors, and focus the status region after a rejected enhanced submission.
- [x] Run the focused HTTP and generated-form tests, then keep all existing escaping and progressive-enhancement behavior intact.

### Task 3: Tell the deployment truth about contact fallbacks

**Files:**
- Modify: `docs/operations/download-leads-runbook.md`
- Modify: `scripts/smoke-test.mjs`
- Modify: `tests/deploy-contract.test.mjs`

- [x] Add a safe fetch-only smoke assertion for Portuguese/English contribution pages that checks the intentional actionable direct `mailto:` fallback, localized contact/privacy links, and absence of Cloudflare’s obfuscated email endpoint; check privacy pages for their actionable contact route and the same absence.
- [x] Update the runbook to state that static `mailto:` fallback links intentionally exist on contribution pages, that Email Address Obfuscation must be disabled or explicitly verified on contribution and privacy pages, and that fallback links must remain actionable after deployment.
- [x] Add deployment-contract coverage for the smoke routes and runbook truth.

### Task 4: Verify and commit

**Files:**
- No additional production files.

- [x] Run `npm test`.
- [x] Run `npm run test:leads`.
- [x] Run `npm run check`.
- [x] Run `npm run build`.
- [x] Run `npm run audit:dist`.
- [x] Run `git diff --check` and inspect the diff for accidental home/nav integration.
- [x] Commit as `fix: finish editorial intake production hardening` and report changed files, tests, and the resulting SHA.
