# Tasks: Contact & Footer

**Input**: Design documents from `specs/005-contact-footer/`; prerequisites are `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/ui-contact-footer.md`, and `quickstart.md`.

**Task status**: 35/41 tasks complete; T027, T032-T035, and T039 remain pending. **Scope**: Feature 005 only, plus the specifically approved Contact placeholder replacement and Footer extension.

## Format

`- [ ] T### [P?] [US#?] Action with concrete file path and completion evidence`

`[P]` is used only when the task has no dependency on incomplete work and owns files distinct from concurrently marked tasks. Story labels map to the three user stories in `spec.md`.

## Phase 1: Setup and Baseline

**Purpose**: Confirm the implementation context and protect existing work before edits.

- [X] T001 Verify `feature/005-contact-footer`, inspect `git status --short`, and record the pre-existing `next-env.d.ts` modification plus baseline commands/results in `specs/005-contact-footer/quickstart.md`; do not alter unrelated files.
- [X] T002 Inspect `src/app/page.tsx`, `src/content/sections.ts`, `src/components/layout/site-footer.tsx`, `src/content/navigation.ts`, `src/lib/navigation-enhancement.ts`, the Feature 003/004 publication projectors, and existing `tests/` conventions; record confirmed integration paths in `specs/005-contact-footer/quickstart.md`.

## Phase 2: Foundational Contact Model and Public Projection

**Purpose**: Establish the privacy boundary required by all user stories before UI integration.

- [X] T003 [P] Create source and public contact types in `src/content/contact-types.ts`, representing independent record publication status, per-field factual verification/source, per-field publication approval, and a public DTO containing only optional owner name, email, GitHub URL, and LinkedIn URL.
- [X] T004 Add the single owner-confirmed source record in `src/content/contact.ts` with exact approved values `Casian Criste`, `cristecasian@gmail.com`, `https://github.com/AllCasian`, and `https://www.linkedin.com/in/casian-criste-b65582263/`; set record and each field as verified from `owner-confirmed` and publication-approved; add no other contact data.
- [X] T005 [P] Add eligibility-matrix unit tests in `tests/lib/contact-content.test.ts` for approved+verified, verified+unapproved, unverified+approved, unverified+unapproved fields, and an unapproved record containing individually approved fields; assert that only the first eligible combination can enter public output.
- [X] T006 Implement `projectPublicContact(record)` and `getPublishedContactProfile()` in `src/lib/contact-content.ts`; require record approval and, independently per field, verified factual status plus field approval; return only eligible values and strip verification, source, approval, and other review metadata.
- [X] T007 Add contact content invariants in `tests/content/contact.test.ts` for the exact four approved values, allowed URL schemes/destinations, and exclusion of unsupported phone/address/social/resume fields; confirm the projection does not rewrite URLs.

## Phase 3: User Story 1 — Find a Professional Contact Option (P1)

**Goal**: Visitors can find truthful, usable email and social contact paths in the established Contact section.

**Independent test**: Render the homepage and verify the unique `#contact` section, heading/invitation, exact visible selectable email, exact `mailto:` target, and exact approved social links with security attributes and accessible names. An ineligible field produces no empty or inactive control.

### Tests for User Story 1

- [X] T008 [P] [US1] Add server-rendered Contact component tests in `tests/components/contact-section.test.tsx` for the heading, invitation, selectable email, mailto action, exact social URLs, `target="_blank"`, `rel="noopener noreferrer"`, accessible names, semantic section, eligible-field omission, and neutral no-channel fallback.

### Implementation for User Story 1

- [X] T009 [US1] Implement server component `src/components/sections/contact-section.tsx` using only `PublicContactProfile`; render the semantic `#contact` section, approved heading and concise invitation, visible/selectable email, semantic `mailto:` link, and eligible GitHub/LinkedIn links with the required accessible names and security attributes.
- [X] T010 [US1] Update `src/content/sections.ts` to retain the unique `contact` ID and title while changing its state from placeholder to content; do not add or rename a navigation destination.
- [X] T011 [US1] Integrate `ContactSection` in `src/app/page.tsx` using `getPublishedContactProfile()`; replace only the Contact placeholder rendering, preserve current order and all Features 001–004 sections, and keep the page as a Server Component.
- [X] T012 [US1] Complete `tests/components/contact-section.test.tsx` against the integrated public component and run the targeted Vitest test; verify no source record or review metadata is required by the component.
- [X] T013 Add a private integration harness under `tests/e2e/fixtures/contact-publication-next/` and test it from `tests/e2e/contact-publication.spec.ts`. Start its isolated Next server on an ephemeral local port with sentinel JSON in a server-process-only environment variable; its fixture-only `/test-publication-boundary` route passes records through `projectPublicContact()` and renders the production `ContactSection`. Exercise verified+approved, verified+unapproved, unverified+approved, unverified+unapproved, and a record-unapproved case with individually approved fields. Assert ineligible sentinel field values and private approval/provenance payload sentinels are absent from captured server HTML/head and Next Flight/serialized responses, with positive controls proving eligible values render. Confirm runtime sentinel values are not embedded in fixture-generated assets. Never use a `NEXT_PUBLIC_` variable, compile sentinels into fixture/client source, add a route to production `src/app`, or expose a public draft route. This task follows T012; execute its Playwright assertions after the production build in T036.

**Checkpoint**: User Story 1 is independently usable with JavaScript disabled; every displayed channel is exact and publication-eligible.

## Phase 4: User Story 2 — Copy an Available Email Address (P1)

**Goal**: Visitors with JavaScript can copy the approved email and receive accessible success or failure feedback, while no-JavaScript users never see an unusable control.

**Independent test**: With JavaScript enabled, test successful Clipboard API writes, rejected access, missing API, live announcements, and unchanged focus. With JavaScript disabled, assert the copy control is hidden, absent from the accessibility/keyboard surface, and email/mailto remain usable.

### Tests for User Story 2

- [X] T014 [P] [US2] Add `tests/components/copy-email-action.test.tsx` for exact clipboard payload, success/failure announcements, API rejection, unsupported API handling, initial hidden state, readiness state transitions, and focus remaining on the activated button.
- [X] T015 [US2] Add Playwright clipboard cases in `tests/e2e/contact-footer.spec.ts` using browser clipboard permissions or controlled API stubs; delay the CopyEmailAction client chunk while allowing the global `has-js` marker to initialize, then assert Copy Email remains hidden and unfocusable until its own handler is ready; verify no inert-button window, exact copied value on success, accessible failure on rejection/unsupported API, and focus retention.
- [X] T016 [US2] Add a JavaScript-disabled Playwright case in `tests/e2e/contact-footer.spec.ts`; assert Copy Email is not rendered visibly, exposed to accessibility, or keyboard-focusable, while the email is selectable and mailto/social links work.

### Implementation for User Story 2

- [X] T017 [US2] Implement the isolated Client Component `src/components/sections/copy-email-action.tsx`; accept only the public approved email string, use `navigator.clipboard.writeText`, handle unavailable/rejected API, announce concise polite status text, never move focus, and maintain a component-local readiness state that starts false and becomes true only after hydration/effect setup.
- [X] T018 [US2] Add the three-state visibility contract in `src/app/globals.css` and `src/components/sections/copy-email-action.tsx`: (1) JavaScript disabled, hidden and unfocusable; (2) JavaScript enabled but this component not hydrated/ready, hidden and unfocusable even if `html.has-js` exists; (3) component ready and existing `html.has-js` present, visible and interactive. Use `hidden`/inert-safe semantics or equivalent so hidden controls cannot receive focus; do not add another script or global state owner.
- [X] T019 [US2] Add `CopyEmailAction` to `src/components/sections/contact-section.tsx` only when projected email exists; keep the visible address and mailto link server-rendered and preserve the server-only boundary for all other Contact content.
- [X] T020 [US2] Run the targeted Vitest and Playwright clipboard/no-JavaScript tests; verify no hydration warning occurs and the existing navigation enhancer remains the sole writer of the `has-js` marker.

**Checkpoint**: User Story 2 works with clipboard success/failure and preserves a complete, usable non-JavaScript fallback.

## Phase 5: User Story 3 — Navigate and Recognize the Portfolio Footer (P2)

**Goal**: Visitors can identify the owner/year and return to existing portfolio sections from home or project details without creating competing navigation state.

**Independent test**: On `/` and `/projects/drivewise`, verify copyright owner/year and the seven footer destinations. Follow a footer link and confirm homepage hash behavior remains synchronized; confirm only the primary header participates in `aria-current`.

### Tests for User Story 3

- [X] T021 [P] [US3] Add `tests/components/site-footer.test.tsx` asserting the approved projected owner/copyright when eligible; omission of an ineligible or absent ownerName with safe year-only copyright; a frozen system clock with deterministic output immediately before and after a calendar-year boundary; all seven links from `navigationItems`, home/project href prefixes, named secondary navigation, and absence of `aria-current` and primary navigation state attributes on footer links.
- [X] T022 [US3] Add footer navigation regression cases in `tests/e2e/contact-footer.spec.ts` for homepage fragment navigation, browser back/forward synchronization, project-detail root-prefixed destinations, Portfolio as the sole current primary destination on project detail, and no-JavaScript link behavior.

### Implementation for User Story 3

- [X] T023 [US3] Extend `src/components/layout/site-footer.tsx` to accept `ownerName` only from the approved server-side `getPublishedContactProfile()` projection, passed by `src/app/page.tsx`, `src/app/projects/[slug]/page.tsx`, and `src/app/projects/[slug]/not-found.tsx` wherever the Footer is rendered; never hardcode `Casian Criste` in the Footer or use a fallback that bypasses eligibility. Render `© [year] [ownerName]. All rights reserved.` only when projected ownerName exists; otherwise render `© [year]. All rights reserved.`. Generate the year once per server render, reuse `navigationItems`, preserve context-sensitive hrefs, and add no current-state attributes or client state.
- [X] T024 [US3] Add or refine Footer layout styles in `src/app/globals.css` using existing tokens and link/focus patterns; preserve readable wrapping and practical touch targets without adding motion or new dependencies.
- [X] T025 [US3] Run `tests/components/site-footer.test.tsx` and the targeted footer E2E coverage; verify the primary navigation enhancer and its active-state behavior are unchanged.

**Checkpoint**: User Story 3 provides the correct footer identity and destinations on homepage and detail routes without becoming a second navigation controller.

## Phase 6: Automated Cross-Feature, Accessibility, and Responsive Verification

**Purpose**: Verify the complete feature and protect Features 001–004.

- [X] T026 Add responsive Playwright assertions in `tests/e2e/contact-footer.spec.ts` at 320, 375, 768, 1024, 1440, and 1920 CSS pixels; assert no horizontal overflow, clipped/overlapping Contact or Footer content, or unreachable interactive controls.
- [ ] T027 Add 200% browser zoom verification in `tests/e2e/contact-footer.spec.ts` at a narrow and desktop viewport; assert content reflow, email selection, action reachability, and visible focus without unintended horizontal scrolling.
- [X] T028 Add Axe scans in `tests/e2e/contact-footer.spec.ts` for homepage Contact/Footer and project-detail Footer states; assert no configured WCAG 2.2 AA violations and keep these automated results separate from manual review.
- [X] T029 Add regression assertions in `tests/e2e/contact-footer.spec.ts` and related existing suites for all seven navigation destinations, hash/history behavior, passive-scroll invariance, Portfolio current state on project details, and preserved Hero/About/Projects/Experience/Education/Skills output.
- [X] T030 Extend `tests/e2e/contact-publication.spec.ts` and the private fixture after T025 to use its server-only test environment record with ineligible owner-name and email sentinels through `projectPublicContact()` and render the production `SiteFooter` and `CopyEmailAction`; include a record-unapproved case with otherwise approved fields. Verify private values and approval/provenance payload sentinels are absent from Footer HTML, Next serialized output, Client Component props, and fixture-generated assets. Add a separate normal production artifact scan for `.next/server/app` generated HTML and `.next/static` assets for the exact private sentinel values; execute it after the production build as specified in T036. The build scan is supplementary and cannot substitute for injected sentinels.
- [X] T031 Run all existing Feature 001–004 Vitest regression suites plus the Feature 005 component/content suite; record commands, environment, counts, and results in `specs/005-contact-footer/quickstart.md`. Playwright regression execution is performed after the production build in T036.

## Phase 7: Manual Accessibility Review

**Purpose**: Record human review evidence required for production release; automated checks do not satisfy these tasks.

- [ ] T032 Perform and document keyboard-only review of Contact, copy action, Footer links, and navigation, including focus order/visibility and unchanged focus after clipboard feedback; record date, browser/device, findings, and remediation in `specs/005-contact-footer/quickstart.md`.
- [ ] T033 Perform and document screen-reader review of landmarks, heading hierarchy, link names, reading order, and clipboard success/failure announcements; record assistive technology/version, date, results, and unresolved issues in `specs/005-contact-footer/quickstart.md`.
- [ ] T034 Measure Contact/Footer text and interactive-control contrast against WCAG 2.2 AA criteria and record tools, measured pairs/ratios, date, pass/fail results, and remediation status in `specs/005-contact-footer/quickstart.md`.
- [ ] T035 Perform manual 200% zoom/reflow review at narrow and desktop viewport sizes and verify visible focus, touch-target usability, and reduced-motion behavior; record environment, exact viewport/zoom procedure, results, and unresolved issues in `specs/005-contact-footer/quickstart.md`.

## Phase 8: Performance, Quality Gates, and Release Evidence

**Purpose**: Verify production output, document measurements, and retain honest release blockers.

- [X] T036 Run `npm.cmd run build` first, then `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test`, and `npm.cmd run test:e2e` against the production build; ensure the E2E run executes the T030 normal generated-output scan against `.next/server/app` and `.next/static`; record exact commands, outcomes, and failures in `specs/005-contact-footer/quickstart.md`.
- [X] T037 Run reproducible production Lighthouse audits for `/` and `/projects/drivewise` on mobile and desktop using the same documented browser/tool versions and profiles; record run date, four category scores, lab LCP/CLS, comparison with the documented Feature 004 baseline, and report locations in `specs/005-contact-footer/quickstart.md`.
- [X] T038 Investigate any measured Feature 005 regression or below-target Lighthouse result using its report evidence; apply only justified, in-scope remediation or document the unresolved issue in `specs/005-contact-footer/quickstart.md`; do not lower any threshold or attribute the existing desktop shortfall without evidence.
- [ ] T039 Manually review each published GitHub/LinkedIn URL against the exact approved destination after implementation; inspect redirects and final destination, record date/evidence in `specs/005-contact-footer/quickstart.md`, and omit only a URL confirmed unsafe, unavailable, unexpectedly redirected, or unrelated, without guessing a replacement or adding monitoring. Inability to establish reachability is a pending verification limitation, is not by itself proof of unavailability, and does not revoke owner publication approval.
- [X] T040 Record INP as “not yet measurable” unless sufficient field data exists, and perform/document the optional 10-second visitor review when representative visitors are available; record unavailable reviewers as not performed, not passed, in `specs/005-contact-footer/quickstart.md`; keep this qualitative review non-blocking.
- [X] T041 Review all 18 FRs and 12 SCs against the delivered code/evidence, update `specs/005-contact-footer/quickstart.md` with completed, failed, deferred, and blocked release checks, and leave any manual or Lighthouse gate pending until evidence meets its acceptance condition.

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 Setup**: Starts immediately; T001 and T002 have independent inspection scope but both update `quickstart.md`, so serialize their writes or consolidate them under one editor.
- **Phase 2 Foundation**: Begins after T002 confirms repository conventions. T003–T007 establish source types, exact approved data, projection logic, and content invariants before UI tasks use them. T003 and T005 may be authored in parallel because they own different files; T006 depends on the type contract and eligibility tests. No rendering-based sentinel test runs in this phase.
- **Phase 3 US1**: Depends on the public projection in Phase 2. T008 tests ContactSection; T009 implements the server component; T010 updates section registry; T011 integrates the section; T012 validates the integrated story; T013 then runs its Contact-only sentinel fixture through the actual projection and rendering path.
- **Phase 4 US2**: Depends on the eligible email projection and Contact section. T014 unit coverage and T015 delayed-hydration/browser coverage precede T017–T019; T018 gates visibility on both the existing marker and local component readiness without modifying the enhancer. T020 validates this increment.
- **Phase 5 US3**: Independent of clipboard work but requires Phase 1 integration inspection. T021–T022 tests precede T023–T024 implementation; T025 validates the story and is a required execution dependency for the Footer sentinel assertion in T030.
- **Phase 6**: Requires US1–US3 integration. T026–T030 may be developed in parallel only when each test file has a single owner; T013 covers Contact sentinel rendering, T030 covers Footer sentinel rendering, and T030's separate production-output scan is executed after the build in T036. T031 runs Vitest coverage; Playwright runs after the production build in T036.
- **Phase 7 Manual review**: Requires feature implementation and automated checks; human review results are independent by modality but must be recorded before production acceptance.
- **Phase 8**: Requires implemented scope. T036 quality gates precede comparable Lighthouse audits; T038 follows T037 if the measurement shows a regression or target shortfall. T039 follows implementation of social links and records actual redirect/destination review. T041 is the final traceability and release evidence review.

### User Story Dependencies

- **US1 (P1)**: Depends on foundational publication-safe projection; independently provides usable contact paths.
- **US2 (P1)**: Depends on the approved email projection and US1 email presentation. It adds clipboard behavior only.
- **US3 (P2)**: Depends on the baseline navigation inspection; it extends the existing footer and can be implemented independently of clipboard behavior. Full regression runs require all three stories.

### Safe Parallel Opportunities

- T003 and T005 (separate source type and unit test files; the test may initially fail until projection implementation).
- T009 with T021 after setup (different component test files; both precede their implementation tasks).
- T014 can be developed separately from T015/T016/T022; T015, T016, and T022 edit the same `contact-footer.spec.ts` and must be serialized or owned by one editor.
- T021 with T014 (different test files) and T023 after its tests are ready.
- Manual T032–T035 and T039 can be scheduled independently after the feature is available, but edits to `quickstart.md` must be serialized or consolidated by one owner.

Do not parallelize tasks that modify the same file, including concurrent edits to `src/app/globals.css`, `src/app/page.tsx`, `src/components/sections/contact-section.tsx`, `tests/e2e/contact-footer.spec.ts`, or `specs/005-contact-footer/quickstart.md`.

## Requirements Traceability

| Requirement | Task coverage |
|---|---|
| FR-001 | T008–T013, T026 |
| FR-002 | T003–T007, T013, T030 |
| FR-003 | T008–T013, T016 |
| FR-004 | T014–T020, T028, T032–T033 |
| FR-005 | T016, T018–T020 |
| FR-006 | T007–T013, T015–T016 |
| FR-007 | T006, T008–T013 |
| FR-008 | T003–T007, T013, T030 |
| FR-009 | T007, T039, T041 (exact URL policy and manual redirect/destination evidence; no automated monitoring) |
| FR-010 | T021, T023, T025, T030 |
| FR-011 | T021–T025 |
| FR-012 | T022, T029 |
| FR-013 | T021–T025, T029 |
| FR-014 | T009, T014–T016, T021, T026–T028, T032–T035 |
| FR-015 | T026–T027, T035 |
| FR-016 | T028, T035 |
| FR-017 | T005–T008, T013–T016, T020–T022, T025–T031, T036 |
| FR-018 | T037–T041 |

| Success criterion | Task coverage |
|---|---|
| SC-001 | T009–T013, T026 |
| SC-002 | T008–T013, T030 |
| SC-003 | T014–T020, T032–T033 |
| SC-004 | T016, T018–T020 |
| SC-005 | T005–T008, T030 |
| SC-006 | T007, T009, T039, T041 |
| SC-007 | T021, T023–T025, T030 |
| SC-008 | T022, T029 |
| SC-009 | T026–T027, T035 |
| SC-010 | T028, T032–T035 |
| SC-011 | T037–T041 |
| SC-012 | T040 |

## MVP and Critical Path

**MVP**: Phase 2 publication-safe projection plus US1 Contact section (T003–T013). This delivers usable, approved contact routes without relying on JavaScript; T013 adds isolated publication-boundary rendering evidence after production components exist. US2 clipboard enhancement and US3 Footer follow as separate increments.

**Critical path**: T001–T002 → T003/T005 → T004/T006/T007 → T008 → T009–T013 → T014–T020 → T021–T025 → T026–T031 → T032–T035 → T036 (build then artifact scan) → T037–T041.

## Implementation Notes

- Task statuses reflect implementation and evidence recorded in `specs/005-contact-footer/quickstart.md`; incomplete zoom, manual accessibility, and external-link review tasks remain unchecked.
- Keep manual accessibility review and Lighthouse gates separate from automated checks.
- Existing Feature 004 desktop Performance remains a global unresolved issue unless comparable current measurements demonstrate compliance.
- Do not modify `next-env.d.ts` as part of this feature unless a separately verified framework action requires it; preserve its pre-existing working-tree change.
- Do not add a contact form, email API, backend, database, CAPTCHA, newsletter, analytics, new social channel, or clipboard package.
