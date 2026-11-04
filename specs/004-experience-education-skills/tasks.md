# Tasks: Experience, Education & Skills

**Input**: Design documents from `specs/004-experience-education-skills/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/ui-experience-education-skills.md`, and `quickstart.md`.

**Tests**: Automated tests are required by FR-018 and the constitution. Manual accessibility and performance evidence are separate release gates.

**Organization**: Tasks are grouped by the four P1 user stories from `spec.md`, preceded by shared setup and publication-safety foundations and followed by cross-cutting verification.

## Task format

Every task remains pending until its stated completion condition has been verified. `[P]` means the task can run in parallel with other marked tasks because it has distinct file ownership and no dependency on their incomplete work. `[US1]`–`[US4]` identify the specification user story served.

## Phase 1: Setup and integration inventory

**Purpose**: Confirm existing conventions and establish a measured baseline before modifying shared composition or navigation.

- [X] T001 Inspect the existing section, card, typography, navigation, and test conventions in `src/components/sections/`, `src/components/layout/`, `src/content/`, `src/app/page.tsx`, and `tests/`; record reusable components and exact integration points in `specs/004-experience-education-skills/quickstart.md`.
- [X] T002 Run the existing `typecheck`, `lint`, `format:check`, Vitest, Playwright, and production-build commands before feature changes; record actual command results and any pre-existing failures in `specs/004-experience-education-skills/quickstart.md` without treating baseline Lighthouse scores as passes.

## Phase 2: Foundational content model and publication safety

**Purpose**: Implement the shared data contract and server-side projection that all user stories depend on. Do not render raw records.

- [X] T003 Define strict TypeScript verification, verification-source, field-publication, record-publication, source-record, and public-DTO types in `src/content/experience-education-skills-types.ts`; keep factual verification and publication approval independent at both field and record levels, and exclude review metadata from public DTO types.
- [X] T004 [P] Create the two source experience records and independently gated fields in `src/content/experience.ts`; encode Endava only as former Junior Data Engineer in Dava.X from June through October 2026, with no separate commercial or production assignment, and Core Elevating Media only as the July–August 2024 remote internship with supplied contributions.
- [X] T005 [P] Create the two education records and three certification records in `src/content/education.ts`; include only supplied facts, omit unknown high-school dates and unavailable issuer/date/link/credential values, and preserve the approved display order.
- [X] T006 [P] Create the six fixed ordered skill categories and 33 individually gated skill records in `src/content/skills.ts`; preserve the exact category and item sequence in FR-007 and do not add proficiency data.
- [X] T007 Implement validation and a server-only public projection in `src/lib/professional-content.ts`; require approved records and independently verified, sourced, approved fields, omit ineligible optional values, withhold entries missing required eligible identity, and strip source, status, approval, TODO, and draft data before rendering or serialization.
- [X] T008 Add focused content and projection unit tests in `tests/content/experience-education-skills.test.ts` and `tests/lib/professional-content.test.ts`; verify exact record counts/order, unique IDs, the 33-item inventory, eligibility invariants, and safe optional-field omission.
- [X] T009 Add publication-safety integration tests in `tests/components/professional-content-publication.test.tsx` and a private test-only static-render fixture under `tests/e2e/fixtures/`; inject sentinel source records through the actual public projection and section rendering path (without adding an application/public route), covering a verified+approved field, verified+unapproved field, unverified+approved field, unverified+unapproved field, and an unapproved record whose fields are otherwise approved. Assert only the positive control appears and all ineligible sentinel values and review metadata are absent from rendered/static HTML, metadata, and serialized output.

## Phase 3: User Story 1 — Review Professional Experience (P1)

**Goal**: Present the two verified roles accurately and scanably, including the complete Dava.X attribution and former status.

**Independent test**: `tests/content/experience-education-skills.test.ts` and `tests/components/experience-section.test.tsx` prove exactly two entries in reverse chronological order, required facts and approved contributions, no commercial/production implication, and omission of ineligible fields.

- [X] T010 Extend `tests/content/experience-education-skills.test.ts` and add `tests/components/experience-section.test.tsx`; verify approved public-projection content renders, Endava precedes Core Elevating Media in reverse chronological order, Dava.X covers the entire Endava period, former status and supplied facts are correct, optional fields disappear, no draft/unapproved values render, and semantic headings/lists and the approved Experience design contract are preserved.
- [X] T011 Implement the reusable scannable entry presentation in `src/components/experience/experience-entry.tsx`; render only public DTO fields with semantic role, organization, dates, status, location/work arrangement, and contribution list.
- [X] T012 Implement the `#experience` section in `src/components/sections/experience-section.tsx`; render Endava then Core Elevating Media using the public projection, a visible associated heading, and no project case-study duplication or optional project-name references.
- [X] T013 Extend `tests/components/about-section.test.tsx` and correct only the stale Endava sentence in `src/content/profile.ts`; state that the Junior Data Engineer role was within the Dava.X Trainee Program and ended in October 2026, preserving About structure, layout, behavior, and all other approved copy.

## Phase 4: User Story 2 — Review Education (P1)

**Goal**: Present both completed education records and the three CV-listed certifications without inventing unknown facts.

**Independent test**: `tests/components/education-section.test.tsx` verifies the approved names, degree, completion state, known dates/locations, certification attribution, and absence of unknown values.

- [X] T014 Extend `tests/content/experience-education-skills.test.ts` and add `tests/components/education-section.test.tsx`; verify the approved public-projection records and all three credentials render in order, optional unknown dates/issuers/links are omitted, draft or unapproved fields do not render, semantic headings/lists are used, and the approved Education/Certifications design contract is preserved.
- [X] T015 Implement the reusable education entry in `src/components/education/education-entry.tsx`; render verified public fields and omit absent optional period or issuer values without empty labels or placeholder controls.
- [X] T016 Implement `#education` and its Certifications subsection in `src/components/sections/education-section.tsx`; render UTCN before Liceul Teoretic “Ioan Buteanu” and exactly the eligible credentials in the approved order.

## Phase 5: User Story 3 — Scan Technical Skills (P1)

**Goal**: Make the full CV-derived skills inventory easy to scan without implying proficiency.

**Independent test**: `tests/components/skills-section.test.tsx` checks all six categories and exactly 33 unique labels in the specified category and item order, with no levels or ratings.

- [X] T017 Extend `tests/content/experience-education-skills.test.ts` and add `tests/components/skills-section.test.tsx`; verify every item against FR-007 in order and exactly once, only approved public-projection content renders, ineligible items/categories and optional fields are omitted, no draft/unapproved values or proficiency claims appear, and semantic grouping plus the approved Skills design contract are preserved.
- [X] T018 Implement semantic category heading and skill-list presentation in `src/components/skills/skill-category.tsx`; use text labels or restrained text chips and render no bars, levels, percentages, endorsements, or excessive logos.
- [X] T019 Implement `#skills` in `src/components/sections/skills-section.tsx`; render only eligible public categories/items, preserve fixed ordering, and omit an ineligible category/item without an empty control or fabricated replacement.

## Phase 6: User Story 4 — Navigate and Use the Sections Accessibly (P1)

**Goal**: Integrate the three sections and seven primary destinations without changing the existing navigation-state owner or breaking existing routes.

**Independent test**: navigation unit and E2E checks cover every destination, URL/hash/history state, exactly one `aria-current`, project-detail context, no-JavaScript anchors, and responsive menu behavior.

- [X] T020 Add unique `experience`, `education`, and `skills` entries to `src/content/sections.ts` while preserving existing section identities and render order; verify no ID duplicates in `tests/content/experience-education-skills.test.ts`.
- [X] T021 Add Experience, Education, and Skills links in the approved order in `src/content/navigation.ts`; preserve all existing labels, targets, and ordering around them, with seven destinations total.
- [X] T022 Compose the public-projection-backed sections in `src/app/page.tsx` after the existing Portfolio section and before Contact; preserve Hero, About, Portfolio, Contact, and all existing section IDs and markup behavior.
- [X] T023 Extend the recognized section context in `src/lib/navigation-enhancement.ts` as the sole post-hydration active-state owner; preserve Home as the homepage no-hash default, hash/history behavior, passive-scroll invariance, and Portfolio as the sole current item on project-detail routes without competing React state.
- [X] T024 Extend the existing navigation-state assertions in `tests/components/navigation-state.test.ts`; cover initial no-hash Home, direct hashes for all seven links, hash changes, back/forward, exactly one `aria-current="location"`, passive scrolling without state change, and Portfolio current on project details.
- [X] T025 Extend the existing responsive navigation styling in `src/app/globals.css` and navigation components only as needed; ensure at 320–1023px all seven links are keyboard accessible and the full-screen menu scrolls vertically when needed, and at 1024px and above desktop links remain unwrapped and uncompressed.
- [X] T026 Extend `tests/e2e/no-js-navigation.spec.ts` and `tests/e2e/project-navigation.spec.ts`; prove root-prefixed homepage hashes remain usable without JavaScript and approved project-detail pages keep only Portfolio current before and after refresh and browser navigation.
- [X] T027 Extend `tests/e2e/experience-education-skills.spec.ts` to verify the homepage order and unique section targets, navigation selection, URL, active styling, and accessible current-location state for the three new destinations.

## Phase 7: Responsive layout, accessibility, and regression coverage

**Purpose**: Verify the complete page at approved widths and protect Features 001–003. Automated checks and human review remain separate.

- [X] T028 Refine the three section layouts in `src/app/globals.css` and the section components to reuse existing design tokens, maintain natural text wrapping and logical reading order, avoid layout shifts, and preserve visible focus and reduced-motion behavior; validate at 320, 375, 768, 1024, 1440, and 1920 CSS pixels.
- [X] T029 Extend `tests/e2e/experience-education-skills.spec.ts` with deterministic Playwright viewport checks at 320, 375, 768, 1024, 1440, and 1920 pixels; assert no horizontal overflow, clipping, overlap, hidden content, or unreachable controls, and assert the desktop navigation remains on one row.
- [X] T030 Extend `tests/e2e/accessibility.spec.ts` with Axe coverage for the updated homepage and its three sections; assert no configured WCAG 2.2 AA violations and retain existing Feature 001–003 scans.
- [X] T031 Extend `tests/e2e/hydration.spec.ts` to detect console hydration warnings/errors on fresh homepage load with the new server-rendered content and seven-link navigation.
- [X] T032 Extend the existing Feature 001–003 regression suites under `tests/e2e/` and `tests/components/`; verify Hero/About except the authorized sentence, Portfolio, all six public project routes and metadata, project publication boundaries, project-detail Portfolio current state, and existing responsive/no-JavaScript behavior remain intact.

## Phase 8: Quality gates, manual verification, and performance

**Purpose**: Record reproducible evidence. Manual checks and below-target performance remain release blockers until actually resolved.

- [X] T033 Run `npm.cmd run typecheck` and record the actual result in `specs/004-experience-education-skills/quickstart.md`; resolve Feature 004 type errors before marking complete.
- [X] T034 Run `npm.cmd run lint` and record the actual result in `specs/004-experience-education-skills/quickstart.md`; resolve lint errors before marking complete.
- [X] T035 Run `npm.cmd run format:check` and record the actual result in `specs/004-experience-education-skills/quickstart.md`; format only in-scope files and report any pre-existing failure accurately.
- [X] T036 Run `npm.cmd test` and record Vitest results in `specs/004-experience-education-skills/quickstart.md`; include publication sentinel, content, component, and navigation tests.
- [X] T037 Run `npm.cmd run build` and `npm.cmd run test:e2e` in that order; record actual results in `specs/004-experience-education-skills/quickstart.md`, including static generation and preservation of all six Feature 003 routes, then inspect generated output and production client asset/module output for sentinel values and raw professional-content modules using the private test fixture (without adding an application/public draft route).
- [ ] T038 Perform and document manual keyboard-only navigation and focus-order review for the seven-link navigation, mobile menu, all three new sections, and interactive links; record date, browser/OS, viewport, actual findings, evidence, remediation, and retest status in `specs/004-experience-education-skills/quickstart.md`.
- [ ] T039 Perform and document screen-reader review of landmarks, heading/reading order, employment status and dates, education/certifications, skill grouping, and navigation names; record actual screen reader, browser/OS, date, findings, evidence, and unresolved issues in `specs/004-experience-education-skills/quickstart.md`.
- [ ] T040 Measure text and interactive-state contrast in the rendered interface, including active, hover, and focus states; document tools, color pairs, ratios, WCAG 2.2 AA outcomes, date, evidence, and remediation in `specs/004-experience-education-skills/quickstart.md`.
- [ ] T041 Verify 200% browser zoom from a 1280×800 CSS-pixel starting viewport; record effective viewport, reflow, information retention, overflow, clipping, control reachability, and focus visibility with date, browser/OS, evidence, and findings in `specs/004-experience-education-skills/quickstart.md`.
- [ ] T042 Verify `prefers-reduced-motion` manually in a supporting browser/OS and confirm all essential content and navigation remain available; record environment, date, observed behavior, evidence, and unresolved findings in `specs/004-experience-education-skills/quickstart.md`.
- [x] T043 Using the production build from T037, run comparable Lighthouse audits on both `/` and `/projects/drivewise`, for mobile and desktop using the documented Feature 003 profiles; record a separate result per route/profile (date/tool version, device/profile, Performance, Accessibility, Best Practices, SEO, lab LCP/CLS, and field INP availability) in `specs/004-experience-education-skills/quickstart.md`, compare each route with its corresponding Feature 003 evidence, investigate actual regressions or below-target scores with evidence, and repeat measurements after any justified remediation.
- [x] T044 Keep each score below the constitutional target of 90 and field INP without sufficient data explicitly unresolved in `specs/004-experience-education-skills/quickstart.md`; do not change thresholds or claim compliance without current evidence. Release acceptance remains blocked while any required target or manual accessibility gate is unmet.

## Phase 9: Documentation and acceptance traceability

**Purpose**: Keep implementation evidence and cross-feature decisions reviewable without claiming unperformed checks.

- [X] T045 Update `specs/004-experience-education-skills/quickstart.md` with the final commands, actual automated/manual/performance evidence, unresolved findings, Lighthouse profile/results, and Feature 001–003 integration outcomes; leave all unperformed checks pending.
- [X] T046 Verify the completed implementation and evidence against the FR/SC traceability table below and `specs/004-experience-education-skills/spec.md`; report uncovered or failed criteria and retain the project-name discrepancy note without renaming Feature 003 records.

## Dependency order and implementation strategy

```text
T001 -> T002 -> T003
T003 -> T004, T005, T006 (safe parallel source-record work)
T004 + T005 + T006 -> T007 -> T008 + T009
T008 + T009 -> US1 (T010–T013), US2 (T014–T016), US3 (T017–T019)
US1 + US2 + US3 -> US4 (T020–T027)
US4 -> T028–T032 -> T033–T044 -> T045–T046
```

The only explicitly marked parallel tasks are T004–T006; they own distinct content files and share only the completed type contract. Do not parallelize edits to `src/app/page.tsx`, `src/content/sections.ts`, `src/content/navigation.ts`, `src/lib/navigation-enhancement.ts`, `src/app/globals.css`, shared test files, or `quickstart.md`. Perform the single-file navigation and page-composition integrations serially. The experience, education, and skills sections form independently testable content increments after the shared projection is available; integrate them together only after their isolated checks pass.

**MVP scope**: US1 (verified experience) is the first independently reviewable increment after the publication-safe foundation. Release acceptance requires all four stories, regression coverage, quality gates, manual accessibility evidence, and current performance evidence; MVP completion is not production release approval.

## Requirement-to-task coverage

| Requirement | Implementation and verification tasks |
|---|---|
| FR-001 | T020, T022, T027, T029 |
| FR-002–FR-003 | T004, T010–T012, T032 |
| FR-004 | T004, T010–T012 |
| FR-005–FR-006 | T005, T014–T016 |
| FR-007–FR-008 | T006, T017–T019 |
| FR-009–FR-010 | T003, T007–T009, T036–T037 |
| FR-011–FR-012 | T020–T027, T031–T032 |
| FR-013–FR-014 | T025, T028–T030, T038–T042 |
| FR-015–FR-016 | T013, T026, T031–T032, T037 |
| FR-017 | T043–T044 |
| FR-018 | T008–T009, T024, T026–T027, T029–T044 |

| Success criterion | Verification tasks |
|---|---|
| SC-001–SC-002 | T008, T010–T012 |
| SC-003–SC-004 | T008, T014–T016 |
| SC-005 | T008, T017–T019 |
| SC-006 | T007–T009, T036–T037 |
| SC-007 | T024, T026–T027, T032 |
| SC-008 | T028–T029, T041 |
| SC-009 | T030, T038–T042 |
| SC-010 | T013, T026, T031–T032, T037 |
| SC-011 | T043–T045 |

## Release gates

- Automated: typecheck, ESLint, Prettier, Vitest, Playwright, Axe, hydration checks, static production build, and Feature 001–003 regression coverage must have recorded successful results.
- Manual: T038–T042 require actual human execution and evidence; automated Axe or keyboard assertions do not complete them.
- Performance: T043 requires comparable current mobile and desktop Lighthouse measurements. All four Lighthouse categories must meet 90 to pass; lab LCP/CLS and field INP availability must be recorded. INP remains “not yet measurable” without sufficient field data. The previously measured homepage desktop Performance 87, project-detail desktop 89, and Feature 001 baseline 89 remain unresolved historical issues until new evidence demonstrates compliance.
- Documentation: T045–T046 record actual evidence and unresolved failures. No task may be marked complete solely because a command or manual procedure is planned.
