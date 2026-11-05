# Tasks: Final UI Refinements, Responsive Navigation & Social Actions

**Input**: Design documents in `specs/007-final-ui-refinements/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/ui-final-ui-refinements.md`, and `quickstart.md`).

**Prerequisites**: `plan.md` and `spec.md` complete; requirements checklist 16/16 passed.

**Organization**: Setup and shared foundation first, followed by one phase per approved user story in priority order, then cross-cutting regression, manual review, quality, performance, and final acceptance.

**Task count**: 56 tasks; 50 completed, 6 pending (manual acceptance T039-T043 and final acceptance T056).

## Format

Every task uses `- [ ] Tnnn [P?] [USn?] action with file path`. `[P]` is reserved for independent work with separate file ownership. Story labels are present on user-story tasks only.

## Phase 1: Setup and Baseline

**Purpose**: Verify the isolated worktree, preserve the current baseline, and capture evidence before any Feature 007 source changes.

- [x] T001 Verify the active worktree is `C:/All/Projects/personal-portfolio/.worktrees/feature-007-final-ui-refinements` on `feature/007-final-ui-refinements`, record `git status`, and confirm the Feature 006 reveal and navigation implementation is present in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T002 Inspect and record the actual header, mobile menu, navigation enhancer, Hero/Contact/Footer, approved portrait, contact projection, icon package, motion tokens, and existing tests in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T003 [P] Capture pre-change screenshots at 375×812 and 1440×900 for `/`, Hero, Contact, navbar, and `/projects/drivewise` under `specs/007-final-ui-refinements/reports/before/` without changing source files.
- [x] T004 [P] Run and record baseline `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, and `npm.cmd test` results in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T005 Build the unchanged production application, run baseline `npm.cmd run test:e2e` against that build, and record build identity and Playwright results in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T006 Run at least three comparable production Lighthouse audits for each of `/` mobile, `/` desktop, `/projects/drivewise` mobile, and `/projects/drivewise` desktop; save JSON under `specs/007-final-ui-refinements/reports/baseline/` and record all four categories, LCP, CLS, TBT, transfer size, conditions, medians, and ranges in `specs/007-final-ui-refinements/quickstart.md`.

## Phase 2: Foundational Approved Contact Projection

**Purpose**: Add the approved Instagram destination through the existing typed contact and publication boundary before rendering it in either user story.

- [x] T007 Add projection and content tests in `tests/lib/contact-content.test.ts` and `tests/content/contact.test.ts` for the exact Instagram destination and independent record approval, field verification, and field publication approval; assert ineligible Instagram values are omitted.
- [x] T008 Extend `ContactSourceRecord.fields` and `PublicContactProfile` with optional `instagramUrl` and future optional `cvUrl` fields in `src/content/contact-types.ts`; preserve independent verification and approval metadata on source fields.
- [x] T009 Add the owner-approved `https://www.instagram.com/casiancriste` contact field in `src/content/contact.ts`; do not add a CV value or invent a document path.
- [x] T010 Extend `projectPublicContact` in `src/lib/contact-content.ts` to project Instagram only for an approved record and verified, approved, nonempty HTTPS field; apply the same eligibility boundary if a future approved CV URL is added.
- [x] T011 Run the focused contact projection/content tests and confirm the exact approved value is preserved, ineligible values are omitted, and no verification/publication metadata enters `PublicContactProfile`.

## Phase 3: User Story 1 — Stay Oriented While Scrolling (Priority: P1)

**Goal**: Show the existing navigation on upward travel and preserve all URL/hash/history active-state behavior.

**Independent test**: Scroll down past the departure threshold and up by the direction threshold on home and project routes; verify visibility, keyboard recovery, menu behavior, and unchanged current-destination state.

- [x] T012 [US1] Add deterministic unit cases for 16px top, >64px departure, 12px directional movement, sub-threshold reversals, short pages, and cleanup in `tests/components/navigation-state.test.ts`.
- [x] T013 [US1] Extend `initializeNavigation` in `src/lib/navigation-enhancement.ts` with visibility-only scroll tracking using one passive listener and one pending `requestAnimationFrame`; preserve `syncCurrentDestination` as the sole active-state calculation and clean up listener/frame on teardown.
- [x] T014 [US1] Add sticky, layout-stable hide/show styling, `:focus-within` recovery, focus/menu lock, visible top state, reduced-motion transition removal, and no-JavaScript normal-flow behavior in `src/app/globals.css`.
- [x] T015 [US1] Add Playwright coverage in `tests/e2e/project-navigation.spec.ts` for threshold transitions, rapid reversals, short pages, touch scrolling, reduced-motion visibility, direct hash and browser back/forward reveal, target-heading clearance, focused controls, expanded mobile menu, and Portfolio current state on project routes.
- [x] T016 [US1] Extend `tests/e2e/no-js-navigation.spec.ts` and `tests/e2e/responsive.spec.ts` to verify the no-JavaScript links remain usable and mobile/desktop navigation visibility does not wrap, trap focus, or change active state during passive scroll.

## Phase 4: User Story 2 — Recognize the Portfolio and Read the Hero (Priority: P1)

**Goal**: Replace the template brand marks, fix the confirmed Hero glyph clipping based on evidence, and remove the decorative introduction label.

**Independent test**: Verify the existing portrait is circular and stable, Hero descenders render fully with normal/reduced motion, and About anchors remain intact after label removal.

- [x] T017 [US2] Inspect Hero DOM wrappers, computed font/line metrics, overflow/clip rules, transforms, and rendered bounds for `g`, `j`, `p`, `q`, and `y`; record the measured root cause and before evidence in `specs/007-final-ui-refinements/quickstart.md` before selecting a fix.
- [x] T018 [US2] Add Hero regression assertions in `tests/components/hero-section.test.tsx` and `tests/e2e/hero-about.spec.ts` for all visible descenders, the <=700ms Hero sequence, normal/reduced motion, `.hero-index` absence, and unchanged About anchor semantics.
- [x] T019 [US2] Apply only the evidence-supported glyph correction in `src/app/globals.css`; preserve the font family, hierarchy, Hero motion, reduced-motion appearance, layout stability, and existing sequence duration.
- [x] T020 [US2] Remove only the decorative `.hero-index` element from `src/components/sections/hero-section.tsx`; retain Hero content, About heading/ID, section order, and navigation targets.
- [x] T021 [US2] Create focused brand-link tests in `tests/components/site-header.test.tsx` and extend `tests/components/mobile-navigation.test.tsx` to assert the named home link, shared portrait source, circular responsive branding, and removal of the `P`/`YN` template marks.
- [x] T022 [US2] Replace the `P` in `src/components/layout/site-header.tsx` and the dialog’s decorative `YN` in `src/components/layout/responsive-mobile-navigation.tsx` with the existing `/images/me1-2.jpg` portrait; use the existing Next.js Image handling and stable circular frame styles in `src/app/globals.css` without duplicating the asset.
- [x] T023 [US2] Verify the brand portrait on homepage and project-detail routes in `tests/e2e/responsive.spec.ts`; assert correct source, home-link accessible name/destination, no distortion, reserved dimensions, and no new image-related layout shift.

## Phase 5: User Story 3 — Use Clear Contact and Social Actions (Priority: P1)

**Goal**: Present one Email action and eligible profile actions in Contact while preserving the existing publication boundary.

**Independent test**: Contact contains one exact mailto action, approved GitHub/LinkedIn/Instagram links, no Copy Email UI or repeated email display, and no CV action.

- [x] T024 [US3] Update `tests/components/contact-section.test.tsx` and `tests/e2e/contact-footer.spec.ts` to assert one `mailto:cristecasian@gmail.com` action, no oversized email text or Copy Email control, exact eligible profile URLs/security attributes, and no Download CV control when no approved file exists; add an Instagram-only eligible-profile case that shows Instagram, omits the unavailable fallback, and exposes no unpublished action, plus an all-channels-ineligible case that renders no social actions and shows the fallback. The production projection boundary cases are exercised through the isolated fixture in T036.
- [x] T025 [US3] Create `src/components/sections/portfolio-actions.tsx` as a Server Component accepting only `PublicContactProfile`; derive a typed ordered action view from eligible fields, render visible labels and existing `lucide-react` icons, and omit absent destinations including CV without duplicating URLs.
- [x] T026 [US3] Integrate `PortfolioActions` into `src/components/sections/contact-section.tsx`; remove the oversized email display and `CopyEmailAction` UI, style the single mailto action and secondary profiles with existing tokens/reduced-motion rules in `src/app/globals.css`, and make the unavailable fallback depend on the absence of every eligible published channel, including Instagram, using only the approved server-side `PublicContactProfile` projection.
- [x] T027 [US3] Add shared action component tests in `tests/components/portfolio-actions.test.tsx` for primary/secondary presentation, labels, exact hrefs, external security attributes, optional field omission, keyboard focus affordance, and no client-only markup.
- [x] T028 [US3] Update `tests/e2e/contact-footer.spec.ts` to verify the Contact action group works with JavaScript disabled and reduced motion, wraps at 320px, and preserves contact/publication regressions without weakening existing sentinel tests; update `tests/components/site-footer.test.tsx` to assert the Footer remains minimal, does not render a duplicate social action group, and retains its approved copyright and publication fallback.

## Phase 6: User Story 4 — Browse a Balanced Mobile Layout (Priority: P2)

**Goal**: Center selected Hero/Contact content and headings on narrow layouts without reducing readability of dense content.

**Independent test**: At required widths, inspect centering, readable text alignment, natural card/action wrapping, and absence of overflow; perform actual 200% zoom separately.

- [x] T029 [US4] Add responsive assertions to `tests/e2e/responsive.spec.ts` for 320, 375, 390, 768, 1024, 1440, and 1920 CSS px; check horizontal overflow, action wrapping, and preserved reading alignment for timelines, lists, project descriptions, and detail prose.
- [x] T030 [US4] Apply targeted mobile alignment and spacing in `src/app/globals.css` for Hero name/role/description/actions, Contact heading/actions, and selected section headings; preserve desktop alignment and readability-oriented dense content.
- [x] T031 [US4] Verify natural project-card stacking, action touch targets, text wrapping, focus outline visibility, and no clipping/overflow in `tests/e2e/responsive.spec.ts` at all required viewport widths.

## Phase 7: User Story 5 — Move Between Available Actions Consistently (Priority: P2)

**Goal**: Reuse the shared available-action family in Hero and Contact with consistent semantics and visual hierarchy.

**Independent test**: Hero and Contact have the same eligible actions and presentation; existing Hero primary actions remain prominent, groups wrap, labels are accessible, and no CV link is rendered.

- [x] T032 [US5] Update `tests/components/hero-actions.test.tsx` and add assertions in `tests/components/hero-section.test.tsx` for projected action values, no duplicated destinations, preserved primary Hero CTAs, and omission of unapproved/absent actions.
- [x] T033 [US5] Pass the server-produced `PublicContactProfile` from `src/app/page.tsx` through `src/components/sections/hero-section.tsx` to `HeroActions`; do not read or duplicate contact URLs from `src/content/profile.ts` or introduce a client boundary.
- [x] T034 [US5] Render the shared `PortfolioActions` from `src/components/sections/hero-actions.tsx`; retain the existing View Projects and Contact Me buttons as prominent actions and provide balanced wrapping/spacing through `src/app/globals.css`.
- [x] T035 [US5] Extend `tests/e2e/hero-about.spec.ts` and `tests/e2e/contact-footer.spec.ts` to compare Hero/Contact action labels, destinations, keyboard focus, touch usability, reduced-motion behavior, and 320px wrapping.

## Phase 8: Cross-Feature Regression and Publication Safety

**Purpose**: Exercise the real approved projection boundary and protect existing Feature 001–006 contracts.

- [x] T036 Extend `tests/e2e/fixtures/contact-publication-next/app/test-publication-boundary/page.tsx` and `tests/e2e/contact-publication.spec.ts` with test-only Instagram/CV sentinels and independent approval combinations; route fixtures through `projectPublicContact` and actual Hero/Contact renderers, assert sentinels and review metadata are absent from HTML/serialized output, and keep fixtures out of production routes/assets.
- [x] T037 [P] Extend `tests/e2e/project-details.spec.ts` and `tests/e2e/project-navigation.spec.ts` to verify all six project routes, existing project names/classifications, brand link behavior, seven destinations, Portfolio current state, and unchanged hash/history behavior.
- [x] T038 [P] Extend `tests/e2e/accessibility.spec.ts` to run Axe on homepage and project detail with the portrait and action groups; assert semantic landmarks, accessible link names, focus indicators, and no new configured violations.

## Phase 9: Manual Acceptance (Evidence Required)

**Purpose**: Record human review separately; automated checks and screenshots do not complete these tasks.

- [ ] T039 Record desktop and mobile before/after visual review for navbar, Hero, Contact, Footer, and a project detail in `specs/007-final-ui-refinements/quickstart.md`, including reviewer, browser, screenshots, glyph visibility, image crop, visual hierarchy, wrapping, and findings.
- [ ] T040 Perform actual Chrome browser zoom at 200% on `/` and `/projects/drivewise`; record Chrome version, displayed zoom, window dimensions, overflow/clipping, heading clearance, visible focus, and reachable controls in `specs/007-final-ui-refinements/quickstart.md`.
- [ ] T041 Perform manual keyboard-only navigation and focus-recovery review, including tabbing into a hidden navbar and operating the mobile menu; record steps and evidence in `specs/007-final-ui-refinements/quickstart.md`.
- [ ] T042 Perform manual screen-reader and contrast review for the portrait home link, navigation, action labels/icons, focus/hover states, and Contact/Footer landmarks; record assistive technology, browser, findings, and evidence in `specs/007-final-ui-refinements/quickstart.md`.
- [ ] T043 Perform manual touch and reduced-motion review on a touch-capable device/emulation; confirm no hover dependency, practical targets, immediate visibility behavior, and preservation of Feature 006 motion behavior; record evidence in `specs/007-final-ui-refinements/quickstart.md`.

## Phase 10: Quality Gates

**Purpose**: Run repository checks against the integrated implementation and record exact outcomes.

- [x] T044 Run `npm.cmd run typecheck` and record the result in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T045 Run `npm.cmd run lint` and record the result in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T046 Run `npm.cmd run format:check` and record the result in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T047 Run `npm.cmd test` and record Vitest file/test counts and failures in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T048 Run `npm.cmd run test:e2e` including Playwright/Axe and record browser/test counts and failures in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T049 Run `npm.cmd run build` and verify the homepage and all six project-detail routes build successfully; record the result in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T050 Scan normal generated production assets for accidental review metadata, then run `git diff --check` and review `git status --short --untracked-files=all` to confirm only approved Feature 007 changes are present; record both checks in `specs/007-final-ui-refinements/quickstart.md`. The production scan supplements the sentinel-through-rendering test in T036 and does not replace it.

## Phase 11: Post-Change Performance Comparison

**Purpose**: Compare against the new Feature 007 baseline; keep existing desktop Performance debt distinct from regressions.

- [x] T051 Run at least three production Lighthouse audits for `/` mobile using the exact baseline profile and save reports under `specs/007-final-ui-refinements/reports/after/`; record Performance, Accessibility, Best Practices, SEO, LCP, CLS, TBT, transfer size, and run variance in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T052 Run at least three production Lighthouse audits for `/` desktop using the exact baseline profile and save reports under `specs/007-final-ui-refinements/reports/after/`; record all required metrics and variance in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T053 Run at least three production Lighthouse audits for `/projects/drivewise` mobile using the exact baseline profile and save reports under `specs/007-final-ui-refinements/reports/after/`; record all required metrics and variance in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T054 Run at least three production Lighthouse audits for `/projects/drivewise` desktop using the exact baseline profile and save reports under `specs/007-final-ui-refinements/reports/after/`; record all required metrics and variance in `specs/007-final-ui-refinements/quickstart.md`.
- [x] T055 Compare post-change medians with the new baseline in `specs/007-final-ui-refinements/quickstart.md`; investigate material Feature 007 regressions, report each constitutional category accurately, and keep desktop Performance below 90 as an open global release blocker unless new comparable evidence meets the threshold.

## Phase 12: Final Acceptance

**Purpose**: Close Feature 007 only when implementation, traceability, automated checks, manual evidence, and performance evidence are complete.

- [ ] T056 Reconcile all 30 functional requirements and 12 success criteria against evidence in `specs/007-final-ui-refinements/tasks.md` and `specs/007-final-ui-refinements/quickstart.md`; depend on completed baseline tasks T001–T006, implementation and regression tasks T007–T038, quality tasks T044–T050, manual tasks T039–T043, and Lighthouse tasks T051–T055. Require genuine recorded evidence for every manual task; do not waive or mark one complete without performing it. Keep the missing CV as an approved nonblocking omission, retain Feature 004–006 release debt under its original ownership, and report Feature 007 acceptance separately from global production release readiness.

## Dependencies and Execution Order

```text
Phase 1 baseline
  → Phase 2 approved contact projection
    → US1 navbar visibility
    → US2 portrait/Hero corrections
    → US3 Contact actions
      → US5 Hero action reuse
    → US4 responsive composition
      → cross-feature regression
        → manual acceptance
          → quality gates
            → post-change Lighthouse comparison
              → final acceptance
```

- **Phase 1** must capture the current source, tests, screenshots, and comparable production Lighthouse baseline before any implementation source changes. T006 depends on the production build/server setup from T005.
- **Phase 2** is a shared prerequisite for Instagram rendering in US3/US5. Contact values continue to be projected server-side; CV is omitted because no approved asset exists.
- **US1** can be developed independently of the contact projection after the baseline, but is ordered first because navigation visibility and focus recovery are a shared layout contract.
- **US2** depends on baseline evidence for the clipping investigation. Portrait and Hero work must preserve existing Feature 006 behavior.
- **US3** depends on the approved projection extension. **US5** depends on the shared action presentation and uses the projected profile in Hero.
- **US4** validates the final composed layouts after Hero and action integration to avoid repeated responsive CSS edits.
- Cross-feature tests precede manual acceptance. Quality gates run on the integrated source, production build precedes post-change Lighthouse runs, and final acceptance waits on every required evidence task.
- T003 and T004 are the only `[P]` setup tasks: screenshot capture writes only to `reports/before/`, while the automated baseline summary is recorded separately. T037 and T038 are `[P]` because they extend independent Playwright files after implementation is complete. Do not parallelize Lighthouse runs; concurrent audits would contaminate comparable measurements.

## Requirement Traceability

| Requirements / criteria | Tasks |
|---|---|
| FR-001–002; SC-002 (portrait source, framing, accessible link, stable layout) | T002, T021–T023, T039, T040 |
| FR-003–008; SC-001, SC-009 (visibility thresholds, focus/menu, hash/history, reduced motion, no-JS, active state) | T012–T016, T037, T041, T043 |
| FR-009–011; SC-003 (selective centering, dense-text readability, responsive range and real zoom) | T029–T031, T039–T043 |
| FR-012–013; SC-004 (descenders, typography, motion duration, stable layout) | T017–T019, T039, T043 |
| FR-014; SC-005 (label removal and About anchor preservation) | T018, T020, T037 |
| FR-015–016; SC-006 (single Email action, no oversized address or Copy Email control) | T024–T028 |
| FR-017–024; SC-007–008 (shared available actions, exact/secure links, no CV, semantics, no-JS, reduced motion) | T007–T011, T024–T028, T032–T035, T038, T041–T043 |
| FR-025–026; SC-009 (Feature 006 compatibility and previous-feature regressions) | T002, T013–T016, T019, T028, T035–T038, T043 |
| FR-027–028; SC-010 (automated/manual verification separation) | T012–T016, T018, T021–T024, T027–T038, T039–T050 |
| FR-029–030; SC-011 (targets, no regression, report global debt accurately) | T004–T006, T044–T055 |
| FR-018–020; SC-012 (field eligibility, Instagram approval, CV omission, no leakage) | T007–T011, T024–T028, T036, T055 |

All **30 FRs** and **12 SCs** have implementation and verification coverage. Manual-only evidence is explicitly assigned to T039–T043. No task makes the unavailable CV a blocker or permits a placeholder.

## Parallel Execution Opportunities

- Before implementation, T003 screenshot capture and T004 automated baseline collection can run independently after T001/T002 because they write to separate evidence locations and do not edit source.
- After integrated source changes, T037 project/navigation regression coverage and T038 Axe/accessibility automation own separate test files and may be authored independently.
- Do not run Lighthouse audits concurrently. Do not parallelize edits to `src/app/globals.css`, `src/lib/navigation-enhancement.ts`, `src/app/page.tsx`, shared component tests, or `quickstart.md` when another active task owns the same file.

## Manual Acceptance and Release Gates

- T039 desktop/mobile human visual review and recorded before/after evidence.
- T040 actual Chrome browser zoom at 200%; viewport resizing and DPR changes do not satisfy it.
- T041 manual keyboard and focus-recovery review.
- T042 manual screen-reader and contrast review.
- T043 manual touch and reduced-motion review.
- T051–T055 require comparable production measurements. Existing Feature 006 desktop Performance (Home 85, Drivewise 87) is below the constitutional 90 target and remains global release debt unless new comparable evidence demonstrates compliance. Feature 007 regression status and global release readiness must be reported separately.

## Implementation Strategy

1. Establish and preserve the worktree baseline, including comparable Lighthouse runs before source edits.
2. Extend the verified contact projection and prove eligibility first.
3. Implement US1, US2, and US3 in priority order; use the existing Server Component boundaries and navigation enhancer.
4. Complete responsive composition, then reuse the shared action component in Hero for US5.
5. Run publication, route, navigation, responsive, and accessibility automation; then complete separately recorded manual reviews.
6. Run repository quality gates, production build, and serial comparable Lighthouse audits.
7. Close T056 only with complete evidence and accurate open-release-debt reporting.
