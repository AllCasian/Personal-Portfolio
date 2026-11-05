---
description: "Implementation task list for Feature 006 Motion, Microinteractions & Visual Polish"
---

# Tasks: Motion, Microinteractions & Visual Polish

**Input**: Design documents from `specs/006-motion-visual-polish/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `contracts/ui-motion.md`, and `quickstart.md`.

**Scope**: Enhance the existing portfolio only. Preserve Features 001–005, all content and routes, the navigation-state owner, publication projections, clipboard readiness, and current no-JavaScript behavior. No task implements a new section, route, data model, or dependency.

**Status**: 36/40 tasks are complete with evidence recorded. T034–T036 remain pending manual reviews, and T040 remains pending because its final evidence record depends on those reviews.

## Task Format

Every task uses `- [ ] T### [P?] [US#?] Action in exact/path`. `[P]` appears only where file ownership is disjoint and the dependency graph permits concurrent work. Story labels map to the five approved user stories in `spec.md`.

## Phase 1: Setup and Baseline Verification

**Purpose**: Capture reproducible application, visual, navigation, publication, and performance state before source changes.

- [X] T001 Run the current `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test`, `npm.cmd run build`, and `npm.cmd run test:e2e`; record actual results, current branch/tree, design-token references, navigation behavior, publication regression status, and Next production build first-load JavaScript sizes in `specs/006-motion-visual-polish/quickstart.md` before editing application files. Baseline Vitest includes one existing failing Hero portrait expectation; it is documented without changing application or test code.
- [X] T002 Capture full-page before screenshots for `/` and `/projects/drivewise` at 375x812 and 1440x900 using the current production build; save the four images under `specs/006-motion-visual-polish/reports/before/` and record browser, viewport, and build conditions in `specs/006-motion-visual-polish/quickstart.md` (depends on T001).
- [X] T003 Complete the comparable pre-change Lighthouse baseline in `specs/006-motion-visual-polish/reports/baseline/`: capture a third mobile run for `/` and `/projects/drivewise`, verify the three existing desktop runs per route use the documented profile, and record all four category scores, LCP, CLS, TBT, TTFB/LCP subparts, LCP element, median, and run variance in `specs/006-motion-visual-polish/quickstart.md` (depends on T002; must finish before T004).

## Phase 2: Shared Motion Foundations

**Purpose**: Define the shared motion vocabulary and fail-open browser enhancement before individual story integration.

- [X] T004 Add a small named motion-token set and reduced-motion-safe final-state styles to `src/app/globals.css`, reusing existing color, focus, surface, radius, and spacing tokens; include interaction duration (150–300 ms), reveal duration (350–500 ms), easing, small reveal offset, bounded stagger, and accent intensity; preserve existing focus outlines and avoid layout properties (depends on T003).
- [X] T005 Add deterministic Vitest coverage in `tests/lib/motion-reveal.test.ts` for visible-by-default markup, eligibility of only below-viewport opt-in elements, reveal once/unobserve, observer absence or construction/observe failure, cleanup, and reduced-motion preference (tests may fail until T006; depends on T004).
- [X] T006 Implement the complete UI-contract behavior in `initializeMotionReveals` in `src/lib/motion-reveal.ts`: one shared IntersectionObserver, stable opt-in markers, once-per-visit final visibility, initial viewport/direct-anchor protection, fail-open error handling, focus-within exposure, reduced-motion preference changes, and cleanup; do not add scroll listeners, React state, or navigation ownership (depends on T005).
- [X] T007 Create the markup-free Client Component `src/components/motion/motion-reveal-enhancement.tsx` and its component test `tests/components/motion-reveal-enhancement.test.tsx`; verify initial/server rendering adds no content or hidden state and the effect initializes then cleans up the shared enhancer without React state or props (depends on T006).
- [X] T008 Mount `MotionRevealEnhancement` in `src/app/layout.tsx` beside the existing `NavigationEnhancement`, preserving the latter as the sole navigation-state owner and keeping server-rendered initial HTML unchanged (depends on T007).
- [X] T009 Add enhancement-only pending/revealed, focus-within, failure, and reduced-motion presentation rules in `src/app/globals.css`; no server markup may be hidden, and unsupported/failed initialization or `prefers-reduced-motion: reduce` must leave all content visible (depends on T004, T006; serialize this global CSS edit after T004).

## Phase 3: User Story 1 — Follow the Portfolio Naturally (P1)

**Goal**: Reveal selected top-level homepage content gently and once without delaying reading or interaction.

**Independent Test**: Load the homepage, scroll through About, Projects, Experience, Education, Skills, and Contact, then return and jump to anchors; selected content reaches visible state within 500 ms, remains visible, and never delays actions.

- [X] T010 [P] [US1] Add `data-motion-reveal` only to the selected top-level About content group in `src/components/sections/about-section.tsx`; keep text, reading order, and section semantics unchanged (depends on T008, T009).
- [X] T011 [P] [US1] Add an opt-in reveal marker to the Projects heading through `motionReveal` in `src/components/sections/section-heading.tsx`, and use it from `src/components/sections/projects-section.tsx`; do not mark nested heading content separately and preserve project filtering/order (depends on T008, T009).
- [X] T012 [P] [US1] Add selected entry/group reveal hooks in `src/components/sections/experience-section.tsx` and `src/components/experience/experience-entry.tsx`; preserve content order and ensure nested contribution text does not animate separately (depends on T008, T009).
- [X] T013 [P] [US1] Add selected entry/group reveal hooks in `src/components/sections/education-section.tsx` and `src/components/education/education-entry.tsx`; keep certifications within one top-level group and preserve semantic order (depends on T008, T009).
- [X] T014 [P] [US1] Add one reveal hook per top-level skill category in `src/components/skills/skill-category.tsx`; skill labels remain noninteractive and do not gain tab stops (depends on T008, T009).
- [X] T015 [P] [US1] Add one selected content-group reveal hook in `src/components/sections/contact-section.tsx`; preserve projected props, approved contact values, Copy Email readiness, and all existing actions (depends on T008, T009).
- [X] T016 [US1] Add Playwright scenarios in `tests/e2e/motion-visual-polish.spec.ts` for selected homepage reveal eligibility, initial-viewport immediate visibility, deep-link visibility, reveal-once reverse scrolling, rapid scrolling, prompt action access, and any stagger group's 50–100 ms intervals/<=300 ms total delay; assert state/readiness rather than relying only on fixed sleeps (depends on T010–T015).

## Phase 4: User Story 2 — Recognize Interactive Project Cards (P1)

**Goal**: Give all six project cards coordinated pointer and keyboard feedback while preserving touch access and card semantics.

**Independent Test**: Check all six cards with pointer hover, keyboard focus, and touch-sized viewport; visual feedback is distinct, no layout shift occurs, and all actions work without hover.

- [X] T017 [P] [US2] Add opt-in reveal and bounded sibling-group hooks to `src/components/projects/project-card.tsx` and `src/components/projects/project-category-group.tsx`; preserve card links, project data, and keyboard behavior (depends on T009, T011).
- [X] T018 [P] [US2] Add project-card hover/focus CSS in `src/app/globals.css` for restrained lift, background/border/title accent and optional existing icon movement; guard hover styling for hover-capable fine pointers, preserve visible focus outline, and avoid large scale/rotation/3D or layout shifts (depends on T009, T011; shared CSS owner).
- [X] T019 [US2] Add Playwright checks in `tests/e2e/motion-visual-polish.spec.ts` for visible hover and keyboard-focus affordances on all six cards, focus at least as prominent as hover, stable card geometry, and touch usability without hover (depends on T017, T018).

## Phase 5: User Story 3 — Use Motion Accessibly and Reliably (P1)

**Goal**: Keep motion optional and preserve content, navigation, and controls across reduced motion, no JavaScript, delayed hydration, and unsupported observation.

**Independent Test**: Exercise reduced motion, JavaScript-disabled, delayed-script, observer-unavailable, and initialization-failure scenarios on homepage and project details; content/actions remain visible and usable.

- [X] T020 [US3] Extend `tests/lib/motion-reveal.test.ts` to verify the complete T006 UI-contract behavior, including preference changes to reduced motion, focus-within revealing a pending group, direct-anchor protection, initialization failure, and cleanup removing temporary states; all cases must prove fail-open visibility (depends on T006).
- [X] T021 [US3] Review T020 results and change `src/lib/motion-reveal.ts` or `src/app/globals.css` only to fix a demonstrated test failure or uncovered UI-contract gap; otherwise record that no corrective change was needed in `specs/006-motion-visual-polish/quickstart.md`. Preserve fail-open visibility, reduced-motion behavior, static highlights, and focus feedback (depends on T020; any shared-file edits must follow T009 and be serialized with other CSS/library edits). No corrective change was needed after all 12 focused Vitest cases passed.
- [X] T022 [US3] Add Playwright cases in `tests/e2e/motion-visual-polish.spec.ts` for JavaScript disabled, delayed/blocked hydration, missing IntersectionObserver, unsupported initialization, and reduced-motion preference; assert server-rendered content and links remain usable before enhancer readiness and no inert or hidden content persists (depends on T021).

## Phase 6: User Story 4 — Experience a Distinctive Introduction (P2)

**Goal**: Give the existing Hero a bounded entrance and readable static accent without delaying its message/actions.

**Independent Test**: Check the Hero at mobile and desktop with motion enabled/reduced and JavaScript disabled; heading, introduction, and actions appear in order within 700 ms, remain visible, and do not shift layout.

- [X] T023 [US4] Add the bounded CSS-first Hero sequence and static gradient/highlight to `src/app/globals.css` and styling hooks to `src/components/sections/hero-section.tsx`; use a static accent on the Projects heading only if the visual review supports it, keep heading text semantic and unduplicated, ensure the heading precedes introduction and actions, keep all content visible from initial render, and add no continuous Hero/shimmer animation (depends on T004, T021; shared CSS owner).
- [X] T024 [US4] Add deterministic Playwright checks in `tests/e2e/motion-visual-polish.spec.ts` for Hero order, computed sequence bounds <=700 ms, interaction/reveal token timing bounds, stable geometry, visible actions, static accent, reduced motion with no translation/stagger/shimmer movement, and JavaScript-disabled visibility (depends on T023).

## Phase 7: User Story 5 — See a Consistent Motion Language (P2)

**Goal**: Apply the defined restrained hierarchy to remaining sections, navigation, Footer, and existing project detail routes.

**Independent Test**: Compare the homepage and all six detail pages; section emphasis is consistent, decorative content is not presented as interactive, navigation behavior is unchanged, and long-form content remains easy to scan.

- [X] T025 [US5] Add subtle Experience and Education border/background emphasis in `src/app/globals.css` using existing tokens and no new focusability or hover cursor on noninteractive entries (depends on T012, T013, T018, T023; shared CSS owner).
- [X] T026 [US5] Add minimal skill-category/badge transitions in `src/app/globals.css`; preserve plain-list semantics and do not imply skills are clickable (depends on T014, T025; same CSS file, execute serially).
- [X] T027 [US5] Add refined Contact controls and minimal Footer/navigation link transitions in `src/app/globals.css`; preserve focus, `aria-current`, seven destinations, hash/history, no-JavaScript navigation, and all Feature 005 publication/clipboard states (depends on T015, T026; same CSS file, execute serially).
- [X] T028 [US5] Add selected top-level reveal hooks to `src/components/projects/project-detail-layout.tsx` and `src/components/projects/case-study-section.tsx`; avoid nested/repetitive long-form reveals and preserve server-rendered published content (depends on T009, T017).
- [X] T029 [US5] Add restrained detail-heading and existing link/action feedback in `src/app/globals.css` for project-detail layouts without changing route, history, or Portfolio active-state behavior (depends on T027, T028; same CSS file, execute serially).
- [X] T030 [US5] Add Playwright coverage in `tests/e2e/motion-visual-polish.spec.ts` for direct load/refresh, link navigation, browser back/forward, and final visible content on all six project-detail routes with motion enabled and reduced; assert Portfolio is the sole current navigation destination and project identities/actions remain unchanged (depends on T028, T029; the current implementation uses native anchors rather than `next/link` or router navigation).

## Phase 8: Automated Accessibility and Responsive Regression

**Purpose**: Verify accessible states, reduced-motion behavior, responsive layouts, and preservation of Features 001–005.

- [X] T031 [P] Add or update Axe assertions in `tests/e2e/accessibility.spec.ts` for the homepage, a representative project detail, and relevant interactive/focus states; report no new configured WCAG 2.2 AA violations without treating Axe as manual sign-off (depends on T019, T022, T024, T027, T029).
- [X] T032 [P] Add motion-specific responsive assertions in `tests/e2e/responsive.spec.ts` at 320, 375, 768, 1024, 1440, and 1920 CSS px for no motion-related overflow, clipping, overlap, inaccessible focus, or unreachable action (depends on T019, T024, T027, T029).
- [X] T033 Verify the existing regression suites in `tests/e2e/hydration.spec.ts`, `tests/e2e/no-js-navigation.spec.ts`, `tests/e2e/project-navigation.spec.ts`, `tests/e2e/contact-footer.spec.ts`, `tests/e2e/contact-publication.spec.ts`, and `tests/e2e/project-publication.spec.ts` remain unchanged in behavior; add assertions only where a Feature 006 integration contract is not already covered (depends on T022, T027, T030).

## Phase 9: Manual Visual and Accessibility Review

**Purpose**: Record human-observed visual, input, accessibility, and actual browser-zoom evidence. These tasks remain pending until performed.

- [ ] T034 Perform and document the manual before/after visual review at 375x812 and 1440x900 for Hero, About, Projects, Experience, Education, Skills, Contact, Footer, and a detail route; compare with T002 captures and existing tokens, record browser/date/findings, and note repository reference screenshots were unavailable in `specs/006-motion-visual-polish/quickstart.md` (depends on T002, T023–T030).
- [ ] T035 Perform and document manual keyboard/focus, screen-reader reading/announcement, contrast, touch-without-hover, and reduced-motion review; record reviewer, browser/device/assistive technology, steps, results, failures, and unresolved issues in `specs/006-motion-visual-polish/quickstart.md` (depends on T031–T034; do not infer success from automated tests).
- [ ] T036 Verify actual Chrome browser zoom at 200% on homepage and project detail at narrow and desktop window widths; check reflow, content, focus, overflow, clipping, and reachable controls, and record Chrome version, actual displayed zoom, viewport/window dimensions, date, results, and unresolved issues in `specs/006-motion-visual-polish/quickstart.md` (depends on T035; do not substitute DPR or viewport reduction).

## Phase 10: Automated Quality Gates

**Purpose**: Run the complete established automated suite after implementation.

- [X] T037 Run `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test`, `npm.cmd run test:e2e`, and `npm.cmd run build`; record exact pass/fail output and test counts in `specs/006-motion-visual-polish/quickstart.md` (depends on T031–T033).

## Phase 11: Performance Comparison and Release Evidence

**Purpose**: Measure Feature 006 against the completed baseline and retain all unmet constitutional or prior-feature gates.

- [X] T038 Run at least three production Lighthouse audits for each `/` and `/projects/drivewise` mobile/desktop profile using the same built output, browser/Lighthouse versions, profile settings, server lifecycle, and measurement conditions as T003; save JSON under `specs/006-motion-visual-polish/reports/after/` and record Performance, Accessibility, Best Practices, SEO, LCP, CLS, TBT, TTFB/LCP subparts, LCP element, run variance, and failures. Compare production first-load JavaScript with T001 using emitted chunk sizes and Node's built-in gzip support; keep incremental motion-owned JavaScript at or below the planned 2 KiB gzip target or document a concrete justification and mitigation (depends on T037).
- [X] T039 Compare post-change and pre-change medians for every route/profile against FR-026/SC-011 limits; investigate any >2 Performance-point, >200 ms LCP, or >0.02 CLS regression, separate variability and inherited desktop debt, and document all measurements and unresolved gaps in `specs/006-motion-visual-polish/quickstart.md` (depends on T003, T038).
- [ ] T040 Complete the Feature 006 acceptance/traceability and release-evidence record in `specs/006-motion-visual-polish/quickstart.md`: map FR-001–FR-027 and SC-001–SC-012 to evidence, list incomplete/manual gates, preserve Feature 004/005 task ownership, and do not claim production readiness while any required gate or Lighthouse category is unmet (depends on T034–T039).

## Dependencies and Execution Order

### Critical Path

`T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010–T016 → T017/T018 → T019 → T020–T022 → T023–T024 → T025–T030 → T031/T032 → T033 → T034–T036 → T037 → T038 → T039 → T040`.

T007 precedes T008 because the root layout imports the enhancer. T009 shares `src/app/globals.css` with T004 and later styling tasks; serialize every global stylesheet modification. T010–T015 may run concurrently after foundations because their component files do not overlap. T017 and T018 may run concurrently after T009/T011 because their source files are disjoint. T031 and T032 may run concurrently after their behavior exists because they own separate test files. All test tasks depend on their relevant behavior being implemented; tests must not import or target components that do not yet exist.

### Story Dependencies

- **US1 (P1)** scroll reveals: after shared foundations; independently verified by T016.
- **US2 (P1)** project-card interaction: after reveal styling and Projects markup; verified by T019.
- **US3 (P1)** accessible/reliable motion: uses the shared reveal foundation and is verified by T020–T022. It is a release prerequisite for other animated stories, not an optional later enhancement.
- **US4 (P2)** Hero: after foundations and reduced-motion/fail-open behavior; verified by T024.
- **US5 (P2)** consistent section/detail polish: after relevant reveal/card/hero integration; verified by T030.
- Automated, manual, and performance phases depend on the relevant story implementation; manual tasks cannot be completed by automated evidence.

### Parallel Opportunities

- T010, T011, T012, T013, T014, and T015: separate section/component files, after T008–T009.
- T017 and T018: project component files vs shared CSS; both depend on T009/T011, and tests wait for both.
- Do not parallelize tasks that edit `src/app/globals.css`, `tests/e2e/motion-visual-polish.spec.ts`, or `specs/006-motion-visual-polish/quickstart.md`.
- T031 and T032 use separate Playwright files and may run in parallel only after their source behavior exists; T033 is separate regression verification after integration.

## Requirement Traceability

| Requirements / criteria | Tasks |
|---|---|
| FR-001–FR-003 (scope, purpose, vocabulary) | T001, T004, T040 |
| FR-004–FR-006 (eligible reveals, bounded grouping, once-only) | T005–T006, T009–T016, T020–T022, T028, T030 |
| FR-007–FR-008 (Hero order, accent and timing) | T023–T024, T034 |
| FR-009–FR-011 (card hover/focus/touch and unchanged content) | T017–T019, T031–T033 |
| FR-012 (cross-section intensity/semantics) | T025–T030, T034–T035 |
| FR-013–FR-014 and FR-020 (navigation invariants) | T001, T027, T030, T033 |
| FR-015–FR-016 (fail-open, no-JS, delayed hydration, reduced motion) | T005–T009, T020–T022, T031–T035 |
| FR-017–FR-019 (accessibility, focus, responsive/zoom) | T018–T019, T022, T031–T036 |
| FR-021–FR-022 (Contact/Footer publication/clipboard/server output) | T015, T027, T031, T033, T040 |
| FR-023–FR-024 (design system and verification) | T004, T018, T023, T025–T035, T037, T040 |
| FR-025–FR-027 (Lighthouse, regression, existing debt ownership) | T001, T003, T037–T040 |
| SC-001–SC-003 (reveal completion/order/stagger) | T005–T006, T009–T016, T020, T024 |
| SC-004–SC-005 (reduced motion and progressive enhancement) | T005–T009, T020–T022, T031–T035 |
| SC-006 (all card affordances/touch) | T017–T019, T034–T035 |
| SC-007 (accessibility and regression) | T031, T033, T035, T037 |
| SC-008 (six widths and 200% zoom) | T032, T036 |
| SC-009 (six detail routes and Portfolio state) | T028–T030, T033 |
| SC-010 (documented visual review) | T002, T034 |
| SC-011–SC-012 (repeated Lighthouse comparison and global thresholds) | T003, T038–T040 |

## MVP and Incremental Strategy

The smallest independently testable motion increment is shared foundations plus **US1 and US3** (T004–T016, T020–T022): selected reveals that remain safe and accessible under failure/no-JavaScript conditions. This does not complete Feature 006 acceptance; US2 card interactions and US4/US5 polish remain required. Complete automated regressions, actual manual reviews, and performance evidence before making any release-readiness claim.

## Existing Release Debt

Feature 004's deferred manual accessibility checks; Feature 005 T027 (actual 200% zoom), T032–T035 (manual accessibility), T039 (external link review); and below-target desktop Lighthouse Performance remain open with original ownership. Feature 006 tasks must not mark or imply these checks are resolved. Feature 006's own manual tasks T034–T036 and performance evidence T038–T040 are separate.
