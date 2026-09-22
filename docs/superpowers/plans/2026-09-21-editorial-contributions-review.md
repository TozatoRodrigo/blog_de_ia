# Editorial Contributions Review Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage contribution discovery contract explicit, localize its navigation labels, and directly assert the privacy SEO copy without changing existing download behavior.

**Architecture:** Keep `ContributionCTA` responsible only for the unconditional compact submission strip. Extract the featured editorial card into `ContributionFeatured`, whose props are `lang`, `featuredEntry`, and `featuredAuthor`; it renders nothing when either featured input is absent. Both homepages render one strip after the recent archive, then one optional featured card after the separator and before topics.

**Tech Stack:** Astro, TypeScript, Node’s built-in test runner, Cheerio, npm scripts.

---

### Task 1: Lock the generated contracts with failing assertions

**Files:**
- Modify: `tests/generated-seo.test.mjs`

- [x] **Step 1: Add generated homepage assertions**

Update the homepage contribution test so each locale asserts the exact discovery label in the header and footer, exactly one compact strip, and exactly one featured card. Add a privacy-page test that asserts `/contribuição editorial/i` for Portuguese and `/editorial contribution/i` for English in generated main content. Keep every existing assertion in the file.

- [x] **Step 2: Run the focused generated SEO tests and verify the label assertion fails**

Run: `node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/generated-seo.test.mjs`

Expected: the existing generated output fails on the requested `Contribua`/`Contribute` navigation label.

### Task 2: Split the contribution placements and remove the escape hatch

**Files:**
- Modify: `src/components/ContributionCTA.astro`
- Create: `src/components/ContributionFeatured.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

- [x] **Step 1: Make `ContributionCTA` a strip-only component**

Remove `CollectionEntry`, `Contributor`, `featuredEntry`, `featuredAuthor`, `showStrip`, `featurePath`, and the featured-card markup from `ContributionCTA.astro`. Keep its `Props` as `{ lang: Lang }`, render the strip unconditionally, and retain the strip styles and intake/index routes.

- [x] **Step 2: Extract the featured card with a safe empty state**

Create `ContributionFeatured.astro` with props `{ lang: Lang; featuredEntry?: ContributionEntry; featuredAuthor?: Contributor }`, derive `featurePath` only when an entry exists, and render the existing featured-card markup only when both `featuredEntry` and `featuredAuthor` are present. Move the existing featured-card CSS unchanged except for the wrapper class needed for the existing max-width/gutter layout. Do not introduce a `showStrip` or mode prop.

- [x] **Step 3: Use the two components at the approved homepage positions**

Import `ContributionFeatured` in both homepages and replace the `ContributionCTA` call that passes `showStrip={false}` with `<ContributionFeatured lang={lang} featuredEntry={featuredContribution} featuredAuthor={featuredAuthor} />`. Keep the existing unconditional `<ContributionCTA lang={lang} />` after the recent archive and the separator immediately before the featured component.

- [x] **Step 4: Run the focused generated SEO tests after rebuilding**

Run: `npm run build && node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/generated-seo.test.mjs`

Expected: homepage count, placement, localized label, and privacy assertions pass.

### Task 3: Localize the contribution discovery labels

**Files:**
- Modify: `src/i18n/ui.ts`

- [x] **Step 1: Set the existing localized navigation key to the requested labels**

Change only `nav.contributions` to `{ 'pt-BR': 'Contribua', 'en': 'Contribute' }`. Keep `nav.contribute` for the intake link, preserve all routes, and do not change `Header.isActive`.

- [x] **Step 2: Rebuild and rerun the generated SEO test**

Run: `npm run build && node --disable-warning=ExperimentalWarning --experimental-strip-types --test tests/generated-seo.test.mjs`

Expected: all generated SEO tests pass, including exact header/footer labels and both privacy-page disclosure assertions.

### Task 4: Full verification and commit

**Files:**
- Verify all modified files and the final worktree diff.

- [x] **Step 1: Run the requested validations**

Run each command from the target worktree:

```bash
npm test
npm run check
npm run build
npm run audit:dist
git diff --check
```

- [x] **Step 2: Inspect the final diff and contract**

Confirm `showStrip` is absent, the original repository is not modified, the homepage has one strip and one featured card per locale, privacy copy remains detailed, and no download-gate assertions were removed or weakened.

- [x] **Step 3: Commit the completed fix**

```bash
git add src/components/ContributionCTA.astro src/components/ContributionFeatured.astro src/pages/index.astro src/pages/en/index.astro src/i18n/ui.ts tests/generated-seo.test.mjs docs/superpowers/plans/2026-09-21-editorial-contributions-review.md
git commit -m "fix: align contribution discovery contract"
```
