---
description: "Dependency-ordered implementation tasks for Feature 002"
---

# Tasks: Feature 002 — Hero & About

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [data-model.md](./data-model.md), [UI contract](./contracts/hero-about.md), [quickstart.md](./quickstart.md), and the project constitution.

**Organization**: Tasks are grouped by user story and follow the requested delivery areas. Statuses reflect verification performed during implementation; T029 remains pending until the complete manual accessibility review is performed.

**Preservation constraint**: Reuse Feature 001 shell, tokens, buttons, responsive navigation, and hydration-safe navigation enhancer. Keep `#home`, `#about`, `#portfolio`, and `#contact`; do not redefine navigation state ownership or implement Features 003–006.

## Phase 1: Setup and Content Modeling

**Purpose**: Prepare the approved profile contract and identify only verified local content/assets before changing presentation.

- [X] T001 Review `specs/002-hero-about/spec.md`, `specs/002-hero-about/plan.md`, `specs/002-hero-about/data-model.md`, `specs/002-hero-about/contracts/hero-about.md`, `specs/002-hero-about/quickstart.md`, and `.specify/memory/constitution.md`; record any implementation-blocking mismatch in `specs/002-hero-about/quickstart.md` before coding.
- [X] T002 Update the existing typed profile content in `src/content/profile.ts` and `src/content/types.ts` using the existing string-field shape: required unverified values use a neutral non-empty `Placeholder:` string naming the field/status, while verified values contain only confirmed facts; represent broad role, one-or-two-sentence authored intro with verified focus phrase or marked placeholder, six About topic values, and optional resume/GitHub/LinkedIn/portrait fields. Omit unavailable optional values; never imply unverified facts.
- [X] T003 After T002, inspect `public/images/` and `public/resume/` and update the verified-asset entries in `src/content/profile.ts`; with no verified portrait, retain the existing decorative fallback and request no image, and with no verified resume/social destination, render no link.

## Phase 2: Foundational Integration

**Purpose**: Establish testable compatibility with the existing page and navigation before section-specific work.

- [X] T004 Add a composed-page regression assertion in `tests/components/hero-section.test.tsx` requiring exactly one descriptive page H1 and a subordinate About heading at `#about` while preserving `#home`, `#portfolio`, and `#contact` destinations.
- [X] T005 Add Feature 002 navigation integration coverage in `tests/e2e/hero-about.spec.ts` for direct `#home` and `#about` loads and their accessible current-location state; preserve Feature 001's existing navigation regression tests unchanged and do not add competing active-state ownership, scroll tracking, or pre-hydration DOM mutations.

## Phase 3: User Story 1 — Professional Introduction (P1)

**Goal**: Communicate the developer's name, broad engineering role, and concise verified focus promptly.

**Independent Test**: Render the Home section and verify content hierarchy, placeholder behavior, and text availability in server-rendered HTML.

- [X] T006 [P] [US1] Add component tests in `tests/components/hero-section.test.tsx` for the full-name field, broad role headline, one-or-two-sentence authored intro, verified focus phrase, required non-empty accessible fallback, and exact `Placeholder:` marker behavior; confirm a marked placeholder is not treated as verified/authored biography and no fabricated or cliché content appears.
- [X] T007 [US1] Extend `src/components/sections/hero-section.tsx` as a Server Component to render the profile name, broad professional headline, and concise introduction in the approved order; preserve its existing `id="home"` and render meaningful content without client JavaScript.
- [X] T008 [US1] Update `src/app/page.tsx` to compose the enhanced Home hero with the existing page shell; preserve one page H1 and all anchor IDs, leaving About integration to T015 and keeping Portfolio and Contact as placeholders.

## Phase 4: User Story 2 — Clear Next Actions (P1)

**Goal**: Make Projects and Contact the clear next actions while safely supporting optional verified resources.

**Independent Test**: Activate both actions and verify exact fragment destinations; verify absent optional data produces no empty controls.

- [X] T009 [P] [US2] Add action tests in `tests/components/hero-actions.test.tsx` to assert View Projects uses `href="#portfolio"`, Contact Me uses `href="#contact"`, and absent resume/social data produces no empty or placeholder links.
- [X] T010 [US2] Implement the action group in `src/components/sections/hero-actions.tsx` using existing `ButtonLink` styles; keep View Projects primary, Contact Me secondary, and verified resume/GitHub/LinkedIn links visually subordinate and beneath them.
- [X] T011 [US2] Integrate `HeroActions` in `src/components/sections/hero-section.tsx`; use ordinary semantic anchors so links work with JavaScript disabled and let the existing enhancer manage `aria-current`, hash/history synchronization, and active state.
- [X] T012 [US2] Add CTA journey tests in `tests/e2e/hero-about.spec.ts` for clicking each CTA, direct loading of `#portfolio` and `#contact`, browser back/forward synchronization, keyboard activation, and the Feature 001 accessible current-location state.

## Phase 5: User Story 3 — About the Developer (P1)

**Goal**: Present a concise, authentic profile summary without duplicating the detailed Feature 004 content.

**Independent Test**: Verify all six topics are represented in approximately 150 words or fewer, remain scannable, and are available without JavaScript.

- [X] T013 [P] [US3] Add About component tests in `tests/components/about-section.test.tsx` for the six topic fields, `id="about"`, subordinate heading, neutral accessible `Placeholder:` values for unavailable required topics, absence of optional placeholders, approximate 150-word maximum, and exclusion of detailed timeline/catalog content.
- [X] T014 [US3] Create `src/components/sections/about-section.tsx` as a Server Component that renders all six typed About topics in scannable prose or short statements, uses the existing section heading/surface patterns, and stays within the approved content-width system.
- [X] T015 [US3] Replace only the About placeholder in `src/app/page.tsx` with `AboutSection`; keep the existing Portfolio and Contact placeholders and their IDs unchanged.

## Phase 6: User Story 4 — Mobile Experience and Visual Refinement (P1)

**Goal**: Keep the same essential identity and actions readable across supported viewport sizes.

**Independent Test**: At deterministic 320, 375, 768, 1024, 1440, and 1920 CSS-pixel viewport widths, verify no overflow, clipping, overlap, or inaccessible CTA and confirm mobile reading order. Verify SC-001 at exactly 375×812 and 1440×900 before scrolling.

- [X] T016 [P] [US4] Extend `tests/e2e/responsive.spec.ts` with deterministic viewport sizes for 320, 375, 768, 1024, 1440, and 1920px, checking page-level horizontal overflow, headline clipping, content overlap, action visibility/reachability, About readability, and copy/actions-before-portrait order at 320–767px; separately assert SC-001 first-view content at 375×812 and 1440×900 without scrolling.
- [X] T017 [US4] Add mobile-first hero/About layout rules in `src/app/globals.css` (or the existing section styles) using fluid type and existing spacing/content-width tokens; stack content below 768px and use columns at 768px or above only where text measure and action grouping remain readable.
- [X] T018 [US4] Add portrait/fallback presentation in `src/components/sections/optional-portrait.tsx` and `src/components/sections/hero-section.tsx`; when a verified local portrait exists, use `next/image`, fixed frame dimensions, and informative or empty alt text as appropriate, and on image failure reveal the existing decorative fallback without frame shift; when absent, keep the fallback server-rendered and make no image request.
- [X] T019 [US4] Add Playwright assertions in `tests/e2e/hero-about.spec.ts` using exact 375×812 and 1440×900 viewports; before any scroll, require developer identity, professional headline, concise introduction, and both required actions in the initial viewport with no clipped/overlapping elements or horizontal overflow. With the current unconfigured portrait, verify the absent-image fallback has stable frame geometry, readable copy, and no image request; component tests cover configured image alt text and failure fallback because no verified portrait asset exists for a browser fixture.

## Phase 7: User Story 5 — Accessibility and Progressive Enhancement (P1)

**Goal**: Ensure all content and actions are perceivable and operable with keyboard, assistive technology, zoom, reduced motion, and without JavaScript.

**Independent Test**: Automated axe checks pass for the composed page; keyboard/no-JS checks and documented manual review steps are available.

- [X] T020 [US5] Extend `tests/e2e/accessibility.spec.ts` to run Axe as a separate automated check on the composed Home/About page and assert semantic headings, accessible link names, visible focus hooks, and no duplicate page H1; cover the optional portrait state when configured.
- [X] T021 [US5] Extend `tests/e2e/no-js-navigation.spec.ts` to confirm server-rendered hero/About copy and both ordinary anchor CTAs remain available and navigable when JavaScript is disabled.
- [X] T022 [US5] Extend `tests/e2e/hydration.spec.ts` to assert a fresh Feature 002 page load emits no React hydration warning/error and that Hero/About integration introduces no pre-hydration mutation of React-managed HTML/navigation state.
- [X] T023 [US5] After T020, add reduced-motion coverage in `tests/e2e/accessibility.spec.ts` and `src/app/globals.css`; verify disabling nonessential transitions leaves all content/actions visible and usable and no animation is needed to understand content.

## Phase 8: User Story 6 — Subtle Visual Engagement (P2)

**Goal**: Give the portfolio restrained interaction feedback that supports clarity and preserves the existing design system.

**Independent Test**: Review interactive states at keyboard and pointer input; confirm focus remains visible, content remains understandable without motion, and reduced-motion settings suppress nonessential transitions.

- [X] T024 [US6] Add or refine purposeful hover and focus transitions in `src/app/globals.css` using existing design tokens; ensure the states remain visually distinct, do not obscure content, and disable nonessential motion under `prefers-reduced-motion` without adding a Motion dependency.

## Phase 9: Automated Testing and Cross-Feature Regression

**Purpose**: Verify the feature acceptance criteria and preserve Feature 001 behavior.

- [X] T025 Update `specs/002-hero-about/quickstart.md` with reproducible manual accessibility steps and a results template for keyboard-only navigation, visible focus, screen-reader names/reading order/CTA interaction, text and control contrast, semantic heading hierarchy, 200% zoom/reflow, reduced motion, and portrait alternatives; leave all results pending until actually performed.
- [X] T026 Run `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, and `npm.cmd test`; fix failures in the relevant `src/` or `tests/` files and record actual outcomes in `specs/002-hero-about/quickstart.md`.
- [X] T027 Run `npm.cmd run build` followed by `npm.cmd run test:e2e`; verify CTA/hash/history behavior, six viewport widths, no-JavaScript content, hydration regression, and axe checks, then record actual results and unresolved failures in `specs/002-hero-about/quickstart.md`.
- [X] T028 Run reproducible mobile and desktop Lighthouse using the same documented profiles as Feature 001; compare all four category scores and lab LCP/CLS with the documented baseline and constitution targets, record version/date/profile and field INP only when measurable, inspect reports/traces to identify actual bottlenecks, apply evidence-based remediation for regressions or scores below 90 without compromising accessibility or UX, rerun relevant quality gates and the production build after code changes, repeat the same Lighthouse measurements after remediation, and record any remaining below-target score as an open release issue in `specs/002-hero-about/quickstart.md`; a score below 90 must not be reported as passing.

## Phase 10: Post-Implementation Manual Review

**Purpose**: Perform the required manual accessibility and visual reviews after implementation without claiming unperformed checks.

- [ ] T029 Perform the manual accessibility review described in `specs/002-hero-about/quickstart.md` and record actual test date, environment, results, findings, and unresolved issues there; cover keyboard-only navigation, visible focus, screen-reader names/reading order/CTA interaction, text and control contrast, 200% zoom/reflow, reduced motion, semantic heading hierarchy, and portrait alternative text when applicable. Keep this task pending until all applicable checks are actually performed.
- [X] T030 Review the implemented Hero and About against Feature 001 design tokens and record date, viewport/environment, findings, and unresolved issues in `specs/002-hero-about/quickstart.md`; assess typography/hierarchy, spacing/content density, CTA prominence, responsive composition, portrait position when applicable, and accessible interaction states. Check for previously supplied visual screenshots; if unavailable, state that no screenshot comparison was possible and base findings only on the approved design system, without inventing visual evidence.

## Phase 11: Documentation and Final Verification

**Purpose**: Make content maintenance and verification reproducible and confirm feature boundaries.

- [X] T031 Update `README.md` content-editing guidance for `src/content/profile.ts`: broad role, verified focus phrase, six About fields, explicit placeholders, and optional verified resume/social/portrait assets and fallback behavior.
- [X] T032 Review and update `specs/002-hero-about/quickstart.md` against the completed implementation; document actual automated command results, manual-review status, Lighthouse measurements, known deviations, and any pending verification without marking unperformed checks complete.
- [X] T033 Confirm `src/components/layout/`, `src/lib/navigation-enhancement.ts`, `src/content/navigation.ts`, and Feature 001 navigation contract are unchanged except for any explicitly necessary integration; run `git diff --check` and verify Feature 002 has not added Projects, detailed Experience/Education/Skills, Contact form, CMS, database, authentication, analytics, or new infrastructure.

## Dependencies and Execution Order

### Phase Dependencies

- Phase 1 establishes the verified profile data contract and precedes all content rendering; T003 follows T002 because both touch `src/content/profile.ts`.
- Phase 2 establishes integration and navigation regression coverage; it depends on Phase 1 review and blocks hero/About composition.
- User Stories 1 and 2 depend on Phases 1–2. US2 integrates with US1's hero container, so it follows US1's hero implementation.
- User Story 3 depends on the typed profile model and is integrated after the Home hero in the page composition.
- User Story 4 depends on the hero/actions/About structure. US5 can begin once semantic section markup exists, but final accessibility checks depend on US4's layout and media states.
- Phase 8 (US6) depends on the implemented sections and interactive styles from US1–US5; it does not depend on its own completion.
- Phase 9 automated tests and performance measurements depend on implementation through Phase 8. Phase 10 manual/visual reviews depend on the implemented page and should follow automated verification. Phase 11 documentation and final boundary checks follow recorded review results.

### User Story Dependencies

- **US1 — Professional Introduction (P1)**: after Phases 1–2; MVP foundation for identifying the developer.
- **US2 — Clear Next Actions (P1)**: depends on US1 hero container; reuses Feature 001 navigation behavior.
- **US3 — About the Developer (P1)**: depends on Phase 1 content model; page integration follows US1.
- **US4 — Mobile Experience and Visual Refinement (P1)**: depends on US1–US3 section structure.
- **US5 — Accessibility and Progressive Enhancement (P1)**: semantic/test scaffolding can run alongside layout work; final verification depends on US1–US4.
- **US6 — Visual Engagement (P2)**: depends on section and interactive-control styles from US1–US5; uses existing CSS feedback and reduced-motion support, without adding Motion unless justified by a concrete need.

### Parallel Opportunities

- T002 and T003 are sequential because both modify `src/content/profile.ts`; complete T002 before T003.
- T004 and T005 can be authored in parallel after destinations/model are confirmed because their component and E2E test files differ; T005 must use `tests/e2e/hero-about.spec.ts` and leave Feature 001 regression tests unchanged.
- T006 and T009 target separate component test files (`hero-section.test.tsx` and `hero-actions.test.tsx`) and may be authored in parallel once the content contract is fixed. T007 follows T006; T010/T011 follow T009.
- US3 component work and US2 actions can be developed in parallel in separate component/test files after foundational integration, but page composition tasks T011/T015 must be serialized to avoid concurrent edits to `src/app/page.tsx`/hero integration.
- T020 and T023 both edit `tests/e2e/accessibility.spec.ts`; serialize them, with T023 after T020. T021 may run independently in its own file after server-rendered content exists; T022 follows once the integration is composed. T024 and T023 both touch `src/app/globals.css`, so keep those style edits sequential.
- Run phases sequentially for a solo implementation; parallelize only tasks marked `[P]` when files and prerequisites do not conflict.

## Independent Acceptance Criteria by User Story

- **US1**: Home has a single descriptive H1, verified full name or explicit editable placeholder, broad role, concise intro with verified focus or placeholder; content is server-rendered and contains no unsupported claims.
- **US2**: View Projects and Contact Me link to exact existing fragments; navigation active state/history remains Feature 001-owned; optional resources appear only when verified and are subordinate or absent.
- **US3**: About at `#about` covers all six topics in approximately 150 words or fewer, remains scannable, uses placeholders for unknown facts, and avoids Feature 004 catalogs.
- **US4**: At all six specified widths, no overflow/clipping/overlap occurs; required actions remain reachable; mobile copy/actions precede portrait; optional media failure has a stable decorative fallback.
- **US5**: Semantic headings, accessible names, keyboard operation, visible focus, applicable WCAG 2.2 AA checks, no-JS links, reduced-motion behavior, and hydration stability are covered; manual findings remain explicitly pending until performed.
- **US6**: Any visual feedback supports usability, reuses the existing visual system, does not obscure content, and respects reduced motion; no unnecessary animation library is introduced.

## Implementation Strategy

1. Complete Setup and Foundational work; confirm profile fields and existing navigation contract.
2. Deliver US1 as the MVP checkpoint, then add US2 actions and US3 About content.
3. Refine responsive/media states, accessibility, and purposeful visual feedback progressively, preserving server rendering by default.
4. Run automated checks and reproducible Lighthouse comparisons only after implementation is complete; record observed outcomes.
5. Perform and record manual accessibility and visual reviews only after the page exists; leave each task pending until its review is complete.
6. Complete final documentation and boundary verification using observed results; retain unresolved Lighthouse gaps as open release issues.

## Notes

- Every task uses the required checkbox/ID format; `[P]` is reserved for work in separate files with no unmet dependency.
- `[US1]`–`[US6]` map to the six user stories in `specs/002-hero-about/spec.md`.
- Tests are included because the specification and user explicitly require component, navigation, responsive, accessibility, no-JavaScript, hydration, and production verification.
- Do not add a separate `SocialLinks` abstraction unless implementation reveals a second real consumer; do not add Motion for React unless CSS is shown to be insufficient.
