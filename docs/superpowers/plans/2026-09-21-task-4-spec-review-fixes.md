# Task 4 Spec-Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the production contribution route, privacy-version contract, and contribution-form status focus behavior without changing download behavior or implementing Task 5.

**Architecture:** Keep the contribution endpoint in the existing download-leads service, add an exact Nginx location with the same proxy policy and contribution-safe body limit, and expose only the contribution privacy version alongside the existing public download config. The statically generated form carries the current contribution version for native submissions; progressive enhancement refreshes that hidden field from `contributionPrivacyVersion` before JSON submission. Generated assertions cover the native markup and both live status elements.

**Tech Stack:** Nginx configuration, Astro, Node.js test runner, Cheerio, Node HTTP service.

---

### Task 1: Add the production contribution proxy contract

**Files:**
- Modify: `deploy/nginx.conf`
- Test: `tests/deploy-contract.test.mjs`
- Test: `services/download-leads/test/container-contract.test.mjs`

- [x] **Step 1: Write failing contract assertions** for an exact `/api/contributions/submit` location, the download-leads upstream, the 128k request limit, and the existing download route limits.
- [x] **Step 2: Run the deployment and container contract tests** and confirm the new contribution-route assertion fails while the existing download assertions remain meaningful.
- [x] **Step 3: Add the exact Nginx location** with the same proxy headers and 10-second timeouts as `/api/download-leads/`, using the existing 128k API limit.
- [x] **Step 4: Run both contract test files** and confirm they pass.

### Task 2: Correct the public contribution privacy-version contract

**Files:**
- Modify: `services/download-leads/src/http.mjs`
- Modify: `src/components/ContributionForm.astro`
- Modify: `tests/contribution-form.test.mjs`
- Modify: `services/download-leads/test/http.test.mjs`
- Modify: `scripts/smoke-test.mjs`

- [x] **Step 1: Add failing tests** that require `contributionPrivacyVersion` in the public config, preserve `privacyVersion`, accept a contribution using a version different from the download version, and render the contribution version in the generated native form.
- [x] **Step 2: Run the focused service and generated-form tests** and confirm they fail because the service omits the contribution field and the form uses the download version.
- [x] **Step 3: Return only `turnstileSiteKey`, `privacyVersion`, and `contributionPrivacyVersion`** from the public config endpoint; update the enhanced form to read the contribution-specific field and keep the native hidden field aligned with the current contribution policy version.
- [x] **Step 4: Update smoke expectations** to include the safe public contribution version while continuing to reject secret fields.
- [x] **Step 5: Run the focused service and generated-form tests** and confirm the differing-version submission and legacy download contract both pass.

### Task 3: Make contribution status announcements focusable

**Files:**
- Modify: `src/components/ContributionForm.astro`
- Modify: `tests/contribution-form.test.mjs`
- Modify: `tests/generated-contributions.test.mjs`

- [x] **Step 1: Add generated assertions** that success and error status elements retain their existing roles/live regions and both have `tabindex="-1"`.
- [x] **Step 2: Run the form assertions** and confirm the error status assertion fails.
- [x] **Step 3: Add `tabindex="-1"` to the error status element** without changing its `role="alert"` or `aria-live="assertive"` semantics.
- [x] **Step 4: Run the generated form assertions** and confirm both localized forms pass.

### Task 4: Verify and commit the scoped fix

**Files:**
- No additional production files.

- [x] **Step 1: Run service tests, relevant root/form tests, `npm run check`, `npm run build`, and `git diff --check`.**
- [x] **Step 2: Inspect the final diff and status** to ensure the original repository is untouched and no Task 5 work was added.
- [x] **Step 3: Commit** with message `fix: wire production contribution endpoint and accessibility`.
