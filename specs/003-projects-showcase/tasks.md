# Implementation Tasks: Projects Showcase & Project Details

**Feature**: [Projects Showcase & Project Details](./spec.md)  
**Plan**: [Implementation plan](./plan.md)  
**Status**: 52/57 tasks complete. T040 and T043 have partial user-reported verification but remain pending because their full acceptance conditions are not evidenced. T041, T042, and T044 are deferred at the user's request and remain pending. Production release acceptance remains withheld pending these reviews and desktop Lighthouse Performance compliance.

## MVP Scope

The MVP is the approved six-project, server-rendered showcase at `#portfolio` and the six approved `/projects/[slug]` pages, with strict content publication filtering, working navigation, responsive accessible presentation, automated regression coverage, and documentation. The unknown/unpublished route handling and required release gates are included in the MVP; no category filters, CMS, database, or other feature scope is added.

## Phase 1 — Setup and Repository Conventions

- [X] T001 Confirm the current branch is `feature/003-projects-showcase`, inspect existing app/test conventions and dependencies in `package.json`, and record the exact commands/paths used by this feature in `specs/003-projects-showcase/quickstart.md`.
- [X] T002 Inspect the installed Next.js 16.4.2 documentation for App Router dynamic segments, async `params`, `generateStaticParams`, metadata, `notFound()`, and `next/image`; record any version-specific implementation constraint in `specs/003-projects-showcase/quickstart.md`.
- [X] T003 After T002, inventory existing navigation, design tokens, shared cards/buttons, content types, Axe/Playwright/Vitest setup, and hydration regression tests; record integration touchpoints in `specs/003-projects-showcase/quickstart.md` without changing Features 001–002 contracts.

## Phase 2 — Foundational Content Model and Publication Boundary

**Blocking dependency**: Complete T001–T003 before story implementation.

- [X] T004 Define strict TypeScript project types in `src/content/project-types.ts` for `ProjectId`, `ProjectSlug`, categories, attribution, `ProjectField<T>`, verification state/source, field publication approval, record publication status, case-study sections, technologies, media, links, and the public `PublishedProject` shape, following `specs/003-projects-showcase/data-model.md`. Do not add a placeholder type for the current six confirmed identities; future placeholder rendering requires a separately approved schema/specification change.
- [X] T005 [P] Add the six centralized records in `src/content/projects.ts` with the stable IDs/slugs and exact categories/order from `specs/003-projects-showcase/data-model.md`; include no unverified descriptions, technologies, contributions, screenshots, or URLs. Keep AI Recipe to its confirmed name/category. Classify Drivewise, Smart Librarian, and ETL Pipeline unconditionally as Dava.X training projects at Endava, never commercial/client/production work or independently delivered products.
- [X] T006 Implement the server-only eligibility projection and lookup in `src/lib/projects.ts`: a record is public only when record status is approved and required identity fields are both verified with a source and separately approved; an optional field is included only when its own verification and publication approval are both positive. Do not synthesize placeholders; a missing required identity makes a record ineligible in this six-project feature. Strip workflow/source/review metadata and ineligible values from the result.
- [X] T007 [P] Add unit tests in `tests/content/projects.test.ts` for exactly six initial projects; unique IDs/slugs; fixed category and within-category order; all six project identities; AI Recipe's limited confirmed content; Dava.X training classification; and rejection of unverified, unapproved, malformed, or duplicate data.
- [X] T008 Add projection tests in `tests/lib/projects.test.ts` that exercise all verification/approval combinations for required and optional values and prove negative leakage: draft/unverified/unapproved sentinel strings never appear in the public projection, generated-route inputs, HTML-bound data, or metadata inputs. Verify public output contains no sources, review dates, or status fields; reject placeholder or guessed external URLs and verify only exact verified-and-approved destinations enter public data.

## Phase 3 — User Story 1 (P1): Browse the Project Collection

**Story goal**: Recruiters can scan exactly six projects in the approved groups/order and open each detail page.  
**Independent test**: Render `/#portfolio` and assert group/order, card essentials, optional-field omission, and destination hrefs without modifying other homepage sections.

- [X] T009 [P] [US1] Build `src/components/projects/project-technology-list.tsx` as a data-driven Server Component that renders verified-and-approved technology/concept labels only and omits an empty list.
- [X] T010 [P] [US1] Build `src/components/projects/project-media.tsx` using `next/image` for eligible local media, reserved dimensions/aspect ratio, truthful informative or decorative alt text, and no output/request when media is absent. On load failure, suppress broken-image UI while keeping the reserved frame, project text, navigation, and surrounding layout stable; use no fabricated replacement screenshot.
- [X] T011 [US1] Build `src/components/projects/project-card.tsx` using existing design-system components/tokens; show required title/category and a project-specific accessible View Details link, with verified-and-approved summary, technology, media, GitHub, or Live Demo controls only when present. Use separate anchors and no nested links.
- [X] T012 [US1] Build `src/components/projects/project-category-group.tsx` and `src/components/sections/projects-section.tsx` to render the three semantic groups in exact order at the existing `#portfolio` destination, preserving other section IDs and adding no filters, tabs, or category state.
- [X] T013 [US1] Replace only the Portfolio placeholder in `src/app/page.tsx` with `ProjectsSection`; preserve Features 001–002 content, anchors, server rendering, and existing shell/navigation behavior.
- [X] T014 [P] [US1] Add `tests/components/project-card.test.tsx` for required card semantics, unique accessible detail names, optional content omission, separate links, and no empty controls or invented content.
- [X] T015 [P] [US1] Add `tests/components/projects-section.test.tsx` for `#portfolio`, three headings, exactly six entries, all category assignments and order, AI Recipe sparse state, and preservation of the other homepage section IDs.

## Phase 4 — User Story 2 (P1): Evaluate an Individual Project

**Story goal**: A visitor can directly open a stable project route, read available approved case-study information, and return to the collection.  
**Independent test**: Open each approved slug directly and after refresh; confirm matching identity, only eligible optional sections, sparse-page behavior, and Back to Projects.

- [X] T016 [P] [US2] Build reusable `src/components/projects/case-study-section.tsx` and `src/components/projects/project-detail-layout.tsx` to render only present verified-and-approved content with one `h1`, logical section headings, readable measure, and no project-specific presentation branches.
- [X] T017 [P] [US2] Build `src/components/projects/project-navigation.tsx` with a keyboard-accessible Back to Projects link targeting `/#portfolio` and existing focus styling.
- [X] T018 [US2] Implement `src/app/projects/[slug]/page.tsx` as a Server Component route using async params and only `PublishedProject` lookup; call `notFound()` for absent, malformed, or unpublished slugs and render a navigable sparse state without invented narrative.
- [X] T019 [US2] Implement `generateStaticParams` in `src/app/projects/[slug]/page.tsx` using approved records with eligible identity only; prove unpublished records are excluded while approved IDs retain the six specified slugs.
- [X] T020 [US2] Implement `generateMetadata` in `src/app/projects/[slug]/page.tsx` from the same public projection: unique eligible title/description, neutral title/category fallback, and generic non-project `noindex` metadata with no draft values for unknown/unpublished slugs.
- [X] T021 [US2] Add project-scoped `src/app/projects/[slug]/not-found.tsx` with a clear semantic not-found state and a safe link back to `/#portfolio`; ensure it contains no project-specific claims or metadata.
- [X] T022 [US2] Add `tests/components/project-detail.test.tsx` for optional section omission, sparse AI Recipe rendering, heading hierarchy, image alternatives, Back to Projects destination, absent media omission, and mocked image-load failure with no broken-image indicator or layout-frame removal.
- [X] T023 [US2] Add Playwright route coverage in `tests/e2e/project-details.spec.ts` for all six direct route identities and refreshes; directly request unknown and malformed slugs and assert HTTP 404 (not redirect) with generic not-found content. T036 separately verifies the unpublished-project case and its metadata/content exclusions.
- [X] T024 [US2] Add negative public-output coverage in `tests/e2e/project-publication.spec.ts` using draft/unverified/unapproved sentinel fixtures to inspect rendered HTML, metadata, and browser-visible data; assert unpublished records are absent from static params/output and no draft details are rendered.

## Phase 5 — User Story 3 (P1): Understand Project Context and Authenticity

**Story goal**: Visitors can distinguish trainee, academic, and personal work without unsupported claims.  
**Independent test**: Validate exact project attribution and confirm public text never frames Dava.X training projects as commercial or production delivery.

- [X] T025 [US3] Add any category attribution presentation needed in `src/components/projects/project-category-group.tsx` and `src/components/projects/project-detail-layout.tsx` so Dava.X is labeled “Dava.X Trainee Program” and Endava, academic projects identify UTCN, and personal projects gain no unsupported organization. Serialize these edits after T012 and T016 because they share presentation files.
- [X] T026 [P] [US3] Add authenticity regression cases in `tests/content/projects.test.ts` and `tests/components/projects-section.test.tsx` that reject commercial-client, production-deployment, or independently delivered Endava product framing for all Dava.X projects, regardless of approved technical details.
- [X] T027 [P] [US3] Ensure content validation in `src/lib/projects.ts` and `tests/lib/projects.test.ts` rejects fabricated claims and optional fields without both verification and publication approval. For the current six projects, use their verified identities and no placeholders; document future required-identity placeholders as outside this feature's implementation scope and do not treat them as verified factual claims. For any candidate GitHub/Live Demo link, manually verify the exact destination, factual source, separate publication approval, redirects, safety, and project correspondence before publication; record evidence in `specs/003-projects-showcase/quickstart.md`, mark the review not applicable if no URLs are published, and repeat after a link change or invalid-link report. Do not add monitoring or guessed URLs. Confirm eligible content can be added without project-specific UI changes.

## Phase 6 — User Story 4 (P1): Navigate Projects on Any Device

**Story goal**: The showcase and detail routes remain easy to use with the established navigation on desktop, mobile, keyboard, and touch.  
**Independent test**: Verify detail route active state, normal homepage hash/history state, menu behavior, no-JavaScript anchors, and responsive usability without changing the existing state owner.

- [X] T028 [US4] Update shared link components in `src/components/layout/site-header.tsx`, `src/components/layout/primary-links.tsx`, `src/components/layout/responsive-mobile-navigation.tsx`, and `src/components/layout/site-footer.tsx` to use root-prefixed homepage anchors on project detail routes and provide server-rendered route context. Render Home as the initial current link on `/` with no hash and Portfolio as the initial current link on `/projects/[slug]`; ensure the enhancer can read the same context without adding a competing active-state store.
- [X] T029 [US4] Extend `src/lib/navigation-enhancement.ts` as the sole post-hydration navigation-state owner to read server-rendered route context (for example, a root navigation-context data attribute) and select Portfolio on `/projects/[slug]`; on `/`, preserve hash selection and Home as the no-hash default. Ensure only one primary link has `aria-current="location"`, Home is not current on details, and direct load, refresh, hash/popstate history, and return to `/#portfolio` stay synchronized. Keep server-rendered initial active markup consistent to avoid hydration mismatch; do not add React state or another owner, and preserve ordinary JavaScript-disabled links.
- [X] T030 [US4] Add or extend `tests/e2e/project-navigation.spec.ts` for homepage no-hash Home and hash/history behavior; project-detail initial state and refresh; Portfolio-only `aria-current` with exactly one current destination; primary link and Back to Projects navigation; browser back/forward synchronization; return to `/#portfolio`; no-JavaScript links; no hydration diagnostics; and unchanged Feature 001 homepage navigation assertions.
- [X] T031 [US4] Build a content-driven responsive grid in `src/app/globals.css`; prefer 16rem card tracks and shrink to a single container-width track where inner width is smaller. Avoid fixed column counts and preserve readable wrapping/actions.
- [X] T032 [US4] Add responsive Playwright coverage in `tests/e2e/projects-responsive.spec.ts` at 320, 375, 768, 1024, 1440, and 1920 CSS px for collection and representative details; assert no horizontal overflow, clipping, overlap, unreadable/truncated card content, or unreachable action. Intercept a project image request and force failure; verify no broken-image indicator, text/navigation usability, stable reserved layout, and no layout shift, separately from the absent-media case. The isolated actual-component browser test is `tests/e2e/project-media-failure.spec.ts`; its ephemeral Vite fixture does not add a public route or project media.
- [X] T033 [US4] Verify mobile full-screen navigation and project link behavior at 320–1023px and desktop navigation at 1024px and above using `tests/e2e/project-navigation.spec.ts`; preserve open/close, focus management, Escape, touch target, progressive enhancement, and no-JavaScript contract.

## Phase 7 — User Story 5 (P2): Share and Find a Project

**Story goal**: Approved project pages are directly shareable with accurate, safe metadata; unknown/unpublished pages do not enter search results.  
**Independent test**: Inspect all approved page metadata plus unknown/unpublished responses and canonical behavior under configured/unconfigured site origin.

- [X] T034 [US5] Add Open Graph and canonical metadata in `src/app/projects/[slug]/page.tsx` using only eligible approved values; include an image only for verified and approved authentic media, use canonical URLs only when `SITE_URL` is configured, and never guess an origin.
- [X] T035 [US5] Add metadata and indexing tests in `tests/lib/project-metadata.test.ts` for all six unique approved routes, no-summary fallback, optional image omission, configured/unconfigured canonical behavior, generic `noindex` metadata for unknown/unpublished routes, no project/draft metadata leakage, and unpublished static route exclusion.
- [X] T036 [US5] Add Playwright tests in `tests/e2e/project-details.spec.ts` that directly request an unpublished slug and assert HTTP 404 (not a redirect), generic not-found content, appropriate `noindex`, no unpublished project content, and no stale/draft title, description, or Open Graph metadata.

## Phase 8 — Accessibility and Visual Validation (Cross-Story Release Gate)

- [X] T037 Add focused Axe scans in `tests/e2e/accessibility.spec.ts` for the collection, representative detail, and not-found state; assert no configured WCAG 2.2 AA violations and keep automated outcomes distinct from manual review.
- [X] T038 Add keyboard/focus browser checks in `tests/e2e/accessibility.spec.ts` for logical order, descriptive links, visible/unobscured focus, menu and detail navigation, and available reduced-motion behavior.
- [X] T039 Add screenshot/reflow checks to `tests/e2e/projects-responsive.spec.ts` at the six supported widths and inspect card media ratio, text wrapping, link reachability, design-token consistency, and failed-image behavior (no broken indicator, stable reserved frame, readable text, and usable navigation); do not invent screenshot-reference details that are unavailable.
- [ ] T040 Perform and document manual keyboard-only accessibility checks for the listing and representative detail in `specs/003-projects-showcase/quickstart.md`; record date, browser/OS, viewport, evidence, focus order/visibility, findings, severity, remediation and retest. User reported on 2026-11-04 that keyboard navigation works correctly; the tested environment, routes, focus visibility/order, link/menu interactions, and evidence are unspecified, so this partial report does not satisfy the task. Leave pending until the full review is documented.
- [ ] T041 Perform and document real screen-reader checks in `specs/003-projects-showcase/quickstart.md` for landmarks, category grouping, reading/heading order, accessible names, media alternatives, and CTA/link interaction; record actual assistive technology/version, environment, date, evidence and unresolved issues. Leave pending until executed.
- [ ] T042 Measure applicable text, link, hover, active and focus-state contrast for collection/detail surfaces and record actual values, method, environment, failures and retests in `specs/003-projects-showcase/quickstart.md`. Leave pending until performed.
- [ ] T043 Perform and document the 200% browser zoom review in `specs/003-projects-showcase/quickstart.md` from a 1280x800 CSS viewport, recording effective viewport and verifying no information loss, unreadable cards, unreachable controls, horizontal overflow, overlap, clipping, or hidden focus. User reported on 2026-11-04 that browser zoom at 200% works correctly; the starting/effective viewport, tested routes, specific reflow conditions, focus visibility, and evidence are unspecified, so this partial report does not satisfy the task. Leave pending until the full review is documented.
- [ ] T044 Perform and document manual focus visibility/order and reduced-motion checks in `specs/003-projects-showcase/quickstart.md`; record environment, evidence and remediation. Keep release blocked for any required check not performed or unresolved applicable WCAG 2.2 AA issue.

## Phase 9 — Quality Gates, Performance, and Regression

- [X] T045 Run `npm.cmd run typecheck` and record actual output and date in `specs/003-projects-showcase/quickstart.md`.
- [X] T046 Run `npm.cmd run lint` and record actual output and date in `specs/003-projects-showcase/quickstart.md`.
- [X] T047 Run `npm.cmd run format:check` and record actual output and date in `specs/003-projects-showcase/quickstart.md`.
- [X] T048 Run `npm.cmd test` (Vitest/component/data/publication tests) and record actual output and date in `specs/003-projects-showcase/quickstart.md`.
- [X] T049 Run `npm.cmd run test:e2e` including navigation, responsive, accessibility, unknown-route, and hydration coverage; record actual output and date in `specs/003-projects-showcase/quickstart.md`.
- [X] T050 Run `npm.cmd run build`, inspect generated routes for approved-only output, and record actual output and date in `specs/003-projects-showcase/quickstart.md`.
- [X] T051 Run reproducible production Lighthouse audits on mobile and desktop for homepage collection and representative detail using the Feature 001 profiles; record date/version, device/profile, all four category scores, lab LCP/CLS, and field INP as measured or “not yet measurable” in `specs/003-projects-showcase/quickstart.md`.
- [X] T052 Compare current results with the documented Feature 001 desktop Performance baseline of 89 and constitutional thresholds (>=90 all Lighthouse categories; LCP <=2.5s, CLS <=0.1, field INP <=200ms p75 when measurable); investigate actual regressions/below-target scores, apply evidence-based fixes only, repeat measurements, and record unresolved gaps as release issues in `specs/003-projects-showcase/quickstart.md`.
- [X] T053 Run existing Feature 001 navigation and Feature 002 Hero/About regression suites unchanged and record exact commands/results in `specs/003-projects-showcase/quickstart.md`; do not modify Feature 002 T029.

## Phase 10 — Final Documentation and Acceptance Traceability

- [X] T054 Update `specs/003-projects-showcase/quickstart.md` with actual test/performance/manual/visual evidence, dates and environments; keep unperformed reviews and all unresolved findings explicitly pending/open.
- [X] T055 Audit `specs/003-projects-showcase/spec.md`, `plan.md`, `data-model.md`, `contracts/ui-projects.md`, `quickstart.md`, and this task list against FR-001–FR-029 and SC-001–SC-012; record requirement-to-test evidence and unresolved acceptance gates in quickstart. Confirm no Feature 001–002 contract regression and no application feature outside approved scope.
- [X] T056 Confirm release acceptance is withheld while required manual accessibility checks remain unperformed, any applicable WCAG 2.2 AA failure is unresolved, or any Lighthouse score remains below constitutional targets; document the Feature 001 desktop Performance baseline of 89 and the current Feature 003 desktop results of 87 for the homepage and 89 for the representative detail. Do not claim production readiness without evidence for all gates.

## Dependency Graph and Execution Order

```text
T001 → T002 → T003 → T004
                         ├── T005 → T006 → T008
                         └── T007 (parallel with T005)

T005–T008 → US1 collection ──┐
         ├→ US2 detail routes ├→ US3 authenticity → US4 navigation/responsive
         └→ US4 foundation ───┘                         │
US2 routes → US5 metadata ──────────────────────────────┤
                                                        ↓
                                  T037–T044 accessibility/visual gates
                                                        ↓
                                  T045–T053 quality/performance/regression
                                                        ↓
                                  T054–T056 final evidence/acceptance
```

T002 precedes T003 because both update `quickstart.md`; do not run them concurrently. Complete T001–T008 before story implementation. Within US1, T009 and T010 may run in parallel; T011 consumes both components, then T012/T013 integrate the section. T014/T015 follow their rendered components. Within US2, T016 and T017 may run in parallel; T018 follows the detail layout/navigation, then T019/T020 implement route exports in the same route file sequentially. T023 and T036 share `tests/e2e/project-details.spec.ts` and must be serialized. US1 and US2 can proceed in parallel after foundation where files do not overlap; T025 must wait for T012/T016 because it edits their presentation files. Within US4, T028 establishes server-rendered route context and links before T029 extends the enhancer; T030 then verifies both routes. T032 and T039 share the responsive E2E file; T037/T038 share the accessibility E2E file; serialize each pair. US5 metadata depends on the approved projection and route lookup. Quickstart writers (T027, T040–T056) must coordinate/serialize updates. Accessibility, regression, performance and final acceptance depend on integrated UI/routes.

## Parallel Execution Opportunities

- T001, T002, and T003 are sequential. T002 and T003 both write `quickstart.md`, so neither carries `[P]` and they must not run concurrently.
- Within foundational work, T007 (content tests) can proceed alongside T005 data authoring after T004 types are agreed; T008 depends on T006 projection contract.
- After foundation, T009/T010 and T016/T017 are safe parallel pairs because they own separate files. Then integrate the card/section and route layers in dependency order. Do not parallelize simultaneous edits to shared source files or `quickstart.md`.
- T026 and T027 can run in parallel after the earlier content/model work is stable because they own different test/library/content files; T027's evidence update to quickstart must be coordinated with other quickstart edits. Serialize T025 after T012/T016 because it touches the same presentation files.
- Manual review tasks T040–T044 are separate human verification activities and may be performed in parallel with automated test authoring, but results must be recorded before release acceptance.
- T045–T050 should be run after implementation stabilization; their documentation updates to quickstart must be serialized or consolidated by one owner.
- T051–T052 Lighthouse measurement and analysis are sequential: capture comparable results before deciding whether evidence-based remediation/retest is needed.

## Requirement Coverage Map

| Requirements / outcomes | Tasks |
|---|---|
| FR-001–FR-003, FR-027, SC-001, SC-012: six projects, categories/order, Dava.X and UTCN attribution/authenticity | T005, T007, T012–T015, T025–T027 |
| FR-004–FR-006: supplied facts only; no invented AI Recipe claims | T005, T007, T026–T027 |
| FR-007, FR-009–FR-010, FR-016, FR-028, SC-004, SC-011: cards/details, optional fields/media, sparse pages, reusable content and failed-image behavior | T006, T009–T018, T022, T027, T032, T039 |
| FR-008, FR-011, FR-013–FR-015, FR-024: routes, publication eligibility, leakage prevention, unknown/unpublished handling | T004–T008, T018–T024, T035–T036 |
| FR-012: typed, centralized content model | T004–T008 |
| FR-017: exact verified/approved external links, manual redirect/destination review, evidence and omission policy | T006–T008, T011, T027 |
| FR-018, SC-008: route-aware navigation, current state, history, no-JS and hydration stability | T028–T030, T033, T049, T053 |
| FR-019: visual identity/design system consistency | T003, T011–T013, T031, T039, T055 |
| FR-020, SC-005: responsive layouts and 200% zoom | T031–T033, T039, T043 |
| FR-021, FR-029, SC-006: accessibility and mandatory manual gate | T037–T044, T054–T056 |
| FR-022: server-rendered and no-JavaScript content | T013, T018, T030, T033, T049 |
| FR-023, SC-007: metadata, OG, canonical behavior, and unknown/unpublished HTTP 404/noindex | T020, T034–T036 |
| FR-025, SC-009: Lighthouse/Core Web Vitals goals and baseline issue | T051–T052 |
| FR-026: scope/dependency constraints | T001–T006, T055 |
| SC-002–SC-003: route correctness and public content authenticity | T007–T008, T018–T027, T035–T036 |
| SC-010: quality gates | T045–T050, T053 |

## Implementation Strategy

1. **Foundation first**: establish typed eligibility and negative tests before content reaches presentation or metadata.
2. **MVP increment**: deliver the six-card `#portfolio` collection, then six approved detail routes and not-found behavior; verify each independently before moving to cross-route polish.
3. **Integrate navigation**: preserve Feature 001 as the single state owner, add detail context, and prove the home/detail/history behavior.
4. **Release gates**: finish responsive and automated checks, perform and record all manual accessibility reviews, collect reproducible Lighthouse evidence, and document unresolved issues. A score of 89 is not a pass; production readiness cannot be claimed while required manual checks or constitutional thresholds remain unmet.

## Task Generation Notes

`[P]` is used only for tasks that can work in different files without depending on incomplete work. User-story labels map to the five stories in `spec.md`. Manual accessibility, Lighthouse, and production-build evidence must reflect actual execution; no task may be marked complete based on planned commands alone. T032 is verified with an isolated browser fixture and does not add media to the public catalog. T040 and T043 have partial user-reported results recorded in the quickstart but remain open pending their complete documented checks. T041, T042, and T044 are deferred at the user's request and remain open. Desktop Performance remains below target, as recorded in the Feature 003 quickstart.

## Phase 11: Convergence

- [X] T057 Add a test-only server-rendering publication-boundary test in `tests/components/project-publication.test.tsx` or the repository's established equivalent. Feed draft, unverified, and unapproved sentinel records through the public projection; render only projected values and derive metadata/static route parameters from that same projection. Assert each sentinel is absent from server-rendered HTML, metadata, and generated route parameters while approved fixture content remains visible. Keep fixtures out of `src/content/projects.ts` and do not add a public test route.

Development milestone status (2026-11-04): 52/57 tasks complete. T040/T043 have partial user-reported verification; T041/T042/T044 are deferred at the user's request. All five tasks remain pending for production release acceptance, and desktop Lighthouse Performance is below target.
