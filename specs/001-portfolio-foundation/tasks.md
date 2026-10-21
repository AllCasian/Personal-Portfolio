---
description: "Dependency-ordered implementation tasks for Portfolio Foundation"
---

# Tasks: Portfolio Foundation

**Input**: Design documents from `specs/001-portfolio-foundation/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [UI navigation contract](./contracts/ui-navigation.md), [quickstart.md](./quickstart.md)

**Tests**: Included because the specification and plan require unit/component, accessibility, responsive E2E, and production-build validation.

**Organization**: Shared setup and foundations come first. User-story phases follow the priorities in the spec: US1, US2, US3, then US4. Cross-cutting browser validation and final polish follow story implementation.

## Phase 1: Setup

**Purpose**: Create the app scaffold and establish development and verification commands.

- [X] T001 Scaffold a single Next.js App Router application with `src/`, React, TypeScript strict mode, and the root route in `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, and `src/app/page.tsx`.
- [X] T002 Configure Tailwind CSS v4, shadcn/ui project metadata, Lucide React, Motion for React, and the shared class utility in `postcss.config.mjs`, `components.json`, `src/lib/utils.ts`, and `package.json`.
- [X] T003 Configure ESLint, Prettier, and the `lint`, `format:check`, `typecheck`, `dev`, `build`, and `start` scripts in `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, and `package.json`.
- [X] T004 Configure Vitest and React Testing Library with a DOM test environment and test setup in `vitest.config.ts`, `tests/setup.ts`, and `package.json`.
- [X] T005 Configure Playwright, browser setup, and the `test:e2e` script in `playwright.config.ts` and `package.json`.

**Verification**: The app starts locally, `tsconfig.json` has strict mode enabled, and lint, format-check, typecheck, and test commands are discoverable from `package.json`.

---

## Phase 2: Foundational Architecture

**Purpose**: Establish the shared content types and document shell prerequisites used by all stories.

- [X] T006 [P] Define typed public-content shapes and constraints from `data-model.md` in `src/content/types.ts`.
- [X] T007 [P] Set the document language, page metadata defaults, and shared app document structure in `src/app/layout.tsx`.

**Verification**: TypeScript accepts the shared content types under strict mode; the root route has semantic document metadata and language.

**Checkpoint**: Architecture foundation is ready for design-system work.

---

## Phase 3: Design System

**Purpose**: Translate the screenshot-inspired visual language into reusable, responsive tokens and defaults.

- [X] T008 Define semantic dark-surface, text, blue-accent, border, focus, spacing, radius, shadow, content-width, and fluid typography tokens in `src/app/globals.css`.
- [X] T009 [P] Load one restrained self-hosted font with a system fallback and expose its font variable in `src/app/layout.tsx`.

**Verification**: Token names express design roles rather than screenshot coordinates; default layout rules are mobile-first and do not impose fixed desktop widths.

---

## Phase 4: Reusable Components

**Purpose**: Build small shared visual primitives before composing the hero and section patterns.

- [X] T010 [P] Write and run role-based component tests for button names, focusable behavior, and supported variants in `tests/components/button.test.tsx`.
- [X] T011 [P] Write and run component tests for card content and section-heading semantic hierarchy in `tests/components/content-primitives.test.tsx`.
- [X] T012 [P] Create the accessible button primitive and its visual variants in `src/components/ui/button.tsx`.
- [X] T013 [P] Create the reusable card primitive in `src/components/ui/card.tsx`.
- [X] T014 [P] Create the reusable semantic section heading in `src/components/sections/section-heading.tsx`.
- [X] T015 Create a minimal titled navigation-destination placeholder pattern with stable section IDs in `src/components/sections/section-placeholder.tsx`.

**Verification**: The component tests pass; focus and text contrast styles inherit the shared tokens; placeholders contain no fabricated profile or portfolio claims.

---

## Phase 5: User Story 1 - Understand the Engineer at a Glance (Priority: P1)

**Goal**: Present an editable identity, role focus, and clear next step in a concise hero, with navigation destinations represented below it.

**Independent Test**: At desktop and phone widths, a visitor can identify the engineer's role focus and next step within 10 seconds; the hero works with a confirmed portrait or designed placeholder.

### Tests for User Story 1

- [X] T016 [US1] Write and run failing role-based hero component tests for identity, role focus, primary action, unverified-content placeholders, and narrow-screen content order in `tests/components/hero-section.test.tsx`.

### Implementation for User Story 1

- [X] T017 [US1] Add editable, explicitly unverified profile fields and primary-action content in `src/content/profile.ts`.
- [X] T018 [US1] Build the responsive hero with introduction and action before the portrait on narrow screens, using `next/image` only for a confirmed asset and a deliberate fallback otherwise, in `src/components/sections/hero-section.tsx`.
- [X] T019 [US1] Compose the hero and minimal titled section destinations in the landing page in `src/app/page.tsx` and `src/content/sections.ts`.

**Verification**: `tests/components/hero-section.test.tsx` passes; the role and next step are visible in the first screen at representative phone and desktop widths; no unverified facts are presented as confirmed.

**Checkpoint**: User Story 1 is independently demonstrable as a first-impression page.

---

## Phase 6: User Story 2 - Navigate the Portfolio on Any Device (Priority: P1)

**Goal**: Provide desktop links and the specified accessible full-screen mobile navigation, with destinations available when JavaScript is disabled.

**Independent Test**: Navigate to each section by keyboard and touch at narrow and wide widths; open and close the mobile panel by button and Escape; confirm focus and no-JavaScript fallback behavior.

### Tests for User Story 2

- [X] T020 [US2] Write and run failing component tests for panel semantics, open state, Escape and close behavior, focus containment/return, section-link selection and focus moving to its destination heading, and the single accessible current-destination state in `tests/components/mobile-navigation.test.tsx`; Playwright coverage for all FR-005 URL and visual states is specified in T033.

### Implementation for User Story 2

- [X] T021 [US2] Define exactly four primary navigation labels and valid section-anchor relationships in `src/content/navigation.ts`: Home â†’ hero, About â†’ titled placeholder, Portfolio â†’ titled placeholder, and Contact â†’ titled placeholder; keep Home as the only content-bearing destination.
- [X] T022 [US2] Implement the responsive mobile navigation with server-rendered links, enhanced full-screen dialog, visible close control, Escape handling, focus management, and exposed open state in `src/components/layout/mobile-navigation.tsx`.
- [X] T023 [US2] Implement the desktop header navigation and responsive menu trigger integration in `src/components/layout/site-header.tsx`.
- [X] T024 [P] [US2] Implement the footer landmark and confirmed-only secondary/social links in `src/components/layout/site-footer.tsx`.
- [X] T025 [US2] Integrate header and footer around the main landmark in `src/app/page.tsx` and ensure every navigation target exists in `src/content/sections.ts`.

**Verification**: `tests/components/mobile-navigation.test.tsx` passes; `contracts/ui-navigation.md` behavior is met; all primary links resolve; Escape and close return focus; with JavaScript disabled, primary links remain visible and usable.

**Checkpoint**: User Story 2 is independently navigable with keyboard, pointer, and touch.

---

## Phase 7: User Story 3 - Experience a Coherent, Accessible Visual System (Priority: P1)

**Goal**: Ensure consistent section patterns and usable content for keyboard, assistive technology, zoom, and reduced-motion users.

**Independent Test**: Review landmarks, headings, links, contrast, focus, zoom, reduced motion, and all required widths on the composed page.

### Tests for User Story 3

- [X] T026 [US3] Add and run axe-based accessibility assertions for the landing page and open mobile-navigation state in `tests/e2e/accessibility.spec.ts`, recording any initial violations.

### Implementation for User Story 3

- [X] T027 [US3] Add visible focus, high-contrast interactive states, and CSS reduced-motion fallbacks for global UI in `src/app/globals.css`.
- [X] T028 [US3] Add a keyboard-operable skip link and ensure landmark and heading order in `src/components/layout/skip-link.tsx` and `src/app/layout.tsx`.
- [X] T029 [US3] Refine the hero, placeholders, header, and footer to use consistent section spacing, readable line lengths, contrast-safe tokens, and practical touch targets in `src/components/sections/hero-section.tsx`, `src/components/sections/section-placeholder.tsx`, `src/components/layout/site-header.tsx`, and `src/components/layout/site-footer.tsx`.

**Verification**: The axe checks pass without applicable WCAG 2.2 AA violations; manually review keyboard focus, screen-reader names/states, text contrast, 200% zoom, and reduced motion.

**Checkpoint**: User Story 3 is independently usable without relying on color, pointer, or motion alone.

---

## Phase 8: User Story 4 - Notice Subtle, Useful Interaction (Priority: P2)

**Goal**: Add restrained panel transitions and interaction cues without distracting from content or changing function for reduced-motion users.

**Independent Test**: Compare the panel and interaction states with normal and reduced-motion settings and confirm that state remains clear without animation.

### Tests for User Story 4

- [X] T030 [US4] Write and run reduced-motion assertions for the mobile-panel interaction in `tests/components/mobile-navigation-motion.test.tsx`.

### Implementation for User Story 4

- [X] T031 [US4] Add purposeful Motion for React panel open/close transitions and configure the user reduced-motion preference in `src/components/layout/mobile-navigation.tsx` and `src/app/layout.tsx`.
- [X] T032 [US4] Align hover, focus, active, expanded, and motion-disabled feedback across buttons and navigation in `src/app/globals.css` and `src/components/ui/button.tsx`.

**Verification**: Motion tests pass; disabling/reducing motion preserves all controls and state cues; animation is limited to communicating interaction state.

**Checkpoint**: User Story 4 is complete without adding decorative motion that delays or obscures content.

---

## Phase 9: Testing and Cross-Viewport Validation

**Purpose**: Cover responsive and fallback behavior in a real browser and validate the whole feature against its requirements.

- [X] T033 [P] Add Playwright assertions for FR-005 in `tests/e2e/responsive.spec.ts`: on an initial load without a hash, Home is active; direct loads of `#about`, `#portfolio`, and `#contact` activate the matching item; clicking each primary link updates the URL hash, visible active style, and accessible current-location state; browser back/forward keeps the active item synchronized with the URL; and exactly one primary navigation item exposes `aria-current="location"` at a time. Verify active styling is distinguishable from hover and keyboard focus, and remains correct after opening the mobile menu, selecting a destination, and closing the menu. Do not add scroll-based section tracking. Assert destination headings remain visible and unobscured after anchor navigation. Also test navigation mode, destination selection, menu opening/closing, keyboard navigation and focus management, and horizontal overflow at 320, 375, 768, 1024, 1440, and 1920 CSS pixel widths; assert full-screen mobile navigation below 1024px, unwrapped desktop navigation from 1024px, and hero order at 320â€“767px.
- [X] T034 [P] Add a browser test with JavaScript disabled that asserts mobile navigation destinations remain visible and usable in `tests/e2e/no-js-navigation.spec.ts`.
- [X] T035 Run Vitest, Playwright, axe, ESLint, Prettier check, TypeScript typecheck, and production build using scripts in `package.json`; resolve failures in the affected source or test files.
- [X] T036 Run reproducible Lighthouse mobile and desktop measurements and record the Lighthouse version or execution date, device/testing profile, Performance/Accessibility/Best Practices/SEO scores, and lab-measured LCP/CLS in `specs/001-portfolio-foundation/quickstart.md`; record field INP with source and time window only when sufficient real-user data exists, otherwise mark it "not yet measurable," and never claim an unmeasured field target passed.

**Verification**: All browser widths and critical journeys pass; Lighthouse and Core Web Vitals claims are recorded from actual measurements, not inferred.

### Manual and Optional Reviews

- [ ] T037 Complete a manual accessibility review of keyboard-only navigation, visible focus indicators, screen-reader accessible names, mobile menu expanded/collapsed states, text and interactive-control contrast, 200% browser zoom, and reduced-motion preferences; record browser/assistive-technology context, contrast method and state combinations, findings, and remediation status in `specs/001-portfolio-foundation/quickstart.md`.
- [ ] T038 Optionally conduct the SC-001/SC-006 qualitative review with available representative visitors: ask them to identify the developer's professional role, find a clear next action within 10 seconds, and explain each primary navigation label; document observations in `specs/001-portfolio-foundation/quickstart.md`. Reviewer availability or review outcome is not a release gate.

---

## Phase 10: Final Polish and Delivery

**Purpose**: Document operation and deployment, then validate a production-like preview.

- [X] T039 Document Node/npm prerequisites, development and quality scripts, environment-variable policy, content editing, and Vercel Preview/Production steps in `README.md`.
- [ ] T040 Complete the production-like deployment review and record any remaining acceptance gaps in `specs/001-portfolio-foundation/quickstart.md` before release.

**Final Verification**: The scope remains limited to the foundation; content is truthful or clearly marked as placeholder; the build, automated checks, manual accessibility review, and Vercel Preview review are documented.

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Begins immediately and blocks all later phases.
- **Foundational Architecture (Phase 2)**: Depends on setup; defines shared types and page document.
- **Design System (Phase 3)**: Depends on setup and the root app scaffold.
- **Reusable Components (Phase 4)**: Depends on design tokens and shared utilities.
- **US1 (Phase 5)**: Depends on architecture, design tokens, and reusable section/button patterns.
- **US2 (Phase 6)**: Depends on US1 section destinations; header and footer integrate with the landing page.
- **US3 (Phase 7)**: Depends on the composed hero, navigation, and footer.
- **US4 (Phase 8)**: Depends on the functional mobile navigation in US2.
- **Testing and Validation (Phase 9)**: E2E and full quality-gate tasks depend on implemented story work; responsive and no-JS tests may be authored in parallel after the app routes and navigation exist. T037 is a required manual review; T038 is optional and never blocks release.
- **Final Polish (Phase 10)**: Depends on all story and validation phases.

### User Story Dependencies

- **US1 (P1)**: Begins after shared foundations; delivers the first-impression MVP.
- **US2 (P1)**: Follows US1 because its links require actual section-anchor destinations.
- **US3 (P1)**: Follows US1 and US2 so it can evaluate the complete visual and navigation experience.
- **US4 (P2)**: Follows US2 because purposeful motion enhances the completed mobile-panel interaction.

### Safe Parallel Opportunities

- After T001, T006 and T007 can run in parallel because they touch separate files.
- In Phase 3, T008 and T009 can run in parallel because global token CSS and font setup are in separate files.
- In Phase 4, T010 and T011 are independent test files; after those tests and T008, T012, T013, and T014 are separate reusable component files and can be implemented in parallel.
- In US1, write and run T016 before profile/hero implementation; T018 waits for the typed profile content, and T019 waits for the hero and placeholder components.
- In US2, write and run T020 before implementing navigation; after T021, T024 can proceed alongside T022 because the footer and mobile menu touch separate files, while T023 depends on T022.
- In US3, write T026 before the accessibility refinements; T028 and T029 follow their listed file and component dependencies.
- In Phase 9, T033 and T034 are separate browser-test files and can be authored in parallel; run them after the story implementations are complete.

## Implementation Strategy

### MVP First

1. Complete Setup, Foundational Architecture, Design System, and Reusable Components.
2. Complete US1: typed editable profile content, hero, primary action, and minimal titled section placeholders.
3. Run the US1 component tests and verify the first impression at phone and desktop sizes.
4. Continue with US2 navigation, then US3 accessibility/coherence, then US4 motion.

### Incremental Delivery

Each user-story checkpoint is independently reviewable. US2 relies on the real anchor destinations from US1; US3 and US4 intentionally build on the integrated page and functional navigation. Do not claim the full feature complete until Phase 9 and Phase 10 validation has passed and any gaps are recorded.

## Notes

- Every task uses a checkbox, sequential ID, optional `[P]` only for independent work, story label for user-story tasks, and concrete file paths.
- User-story test tasks are written and run to fail before the corresponding implementation tasks. Tests are verification work and do not indicate that implementation has been completed.
- `[P]` marks safe parallel execution only; tasks that edit a shared file or depend on incomplete work remain sequential.
- No authentication, database, CMS, microservices, separate backend, or contact form is introduced.


## Phase 11: Convergence

**Purpose**: Close the measured performance, manual accessibility, deployment-review, and E2E-runner verification gaps found during convergence.

- [X] T041 Optimize the measured mobile and desktop performance gaps, then repeat the documented Lighthouse profiles and update `specs/001-portfolio-foundation/quickstart.md` with actual scores and lab LCP/CLS; retain any unmet targets as open gaps and make no unsupported pass claims per SC-007 and Constitution III (partial).
- [ ] T042 Complete the manual accessibility review for keyboard-only navigation, visible focus, screen-reader names and mobile-menu states, text and control contrast, 200% zoom, and reduced motion; document review context, contrast method, findings, and remediation status in `specs/001-portfolio-foundation/quickstart.md` per SC-003–SC-005 and plan accessibility strategy (missing).
- [ ] T043 Complete a production-like review of a Vercel Preview at the required viewport and interaction states, then record its URL, review outcome, and remaining acceptance gaps in `specs/001-portfolio-foundation/quickstart.md` per plan deployment validation and T040 (missing).
- [X] T044 Diagnose why `npm.cmd run test:e2e` hangs after all Playwright cases report passing, correct the runner or teardown issue within the approved feature scope, and verify a clean exit with the complete suite per plan testing strategy and T035 (partial).
