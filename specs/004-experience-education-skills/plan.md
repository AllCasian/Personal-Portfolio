# Implementation Plan: Experience, Education & Skills

**Branch**: `feature/004-experience-education-skills` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification and clarified Endava/Dava.X relationship at `specs/004-experience-education-skills/spec.md`.

## Summary

Add three server-rendered homepage sections for verified professional experience, education/certifications, and the fixed 33-item skills inventory. Keep editable source records separate from presentation and gate public output on independent record-level publication approval plus field-level verification and publication approval. Extend the existing seven-destination navigation through its established content registry and sole hydration-safe enhancer. Correct only the stale About sentence that presents Endava as current employment; retain the section structure and all other approved copy. Do not duplicate or rename Feature 003 Dava.X case studies. Use existing design components, styles, tests, and dependencies.

## Technical Context

**Language/Version**: TypeScript 5.9.3 in strict mode; avoid `any`.

**Primary Dependencies**: Existing Next.js 16.4.2 App Router, React 19.3.1, Tailwind CSS 4.3.3, local font, shared UI primitives, Vitest 5.0.5, React Testing Library 16.3.3, Playwright 1.64.1, and Axe Playwright 4.14.0. No new dependency is planned.

**Storage**: Static owner-maintained TypeScript content in `src/content/`; no database, CMS, remote service, or runtime persistence.

**Testing**: Existing `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:e2e`, and Axe integration. Manual accessibility is separate from automated checks.

**Target Platform**: Existing Next.js single-page portfolio, statically rendered where possible and deployed on Vercel; responsive browsers from 320px through 1920px and 200% zoom.

**Project Type**: Single web application; three additional homepage sections, existing About copy correction, and shared navigation extension. No new routes are required.

**Performance Goals**: Preserve Lighthouse >=90 for Performance, Accessibility, Best Practices, and SEO; LCP <=2.5s, CLS <=0.1, field INP <=200ms at p75 where measurable. Feature 003 recorded homepage desktop Performance 87 and representative project detail 89, below target; Feature 001 baseline was 89. Keep these as unresolved release evidence until comparable new runs establish compliance. Record field INP as “not yet measurable” without sufficient real-user data.

**Constraints**: WCAG 2.2 AA, semantic content, visible focus, reduced motion, 44px practical touch targets, 320/375/768/1024/1440/1920px and 200% zoom; server-rendered content; record-level plus per-field publication gates; no public placeholders; exactly two experience entries, two education entries, three CV-listed credentials, and 33 skills in fixed categories/order; no fabricated claims; no changes to Features 001–003 behavior or project records; only the approved factual correction to the About sentence.

**Scale/Scope**: Two Experience records, two Education records, three credential records, six fixed skill categories, and 33 skill items. Static content only. No editing interface, account, certificate-verification service, category configuration, filtering, animation framework, or new infrastructure.

## Constitution Check

*Gate: pass before research. Recheck after design below.*

| Principle | Plan response | Gate |
|---|---|---|
| I. Truthful, Useful Professional Story | Use only owner-confirmed facts; represent all Endava work from June–October 2026 as Dava.X Trainee Program work and former employment. Omit unsupported details and correct the stale About current-employment sentence. Keep Dava.X case studies in Feature 003. | PASS |
| II. Accessible, Responsive Experience | Reuse semantic section patterns and focus styles; maintain URL-driven active state, mobile dialog behavior, keyboard and no-JS links; support all specified widths, 200% zoom, reduced motion, contrast, and separate manual review. | PASS |
| III. Fast, Robust, Production-Ready Delivery | Keep all new section content server-rendered with no new client boundary or dependency. Measure comparable Lighthouse runs and leave desktop performance gaps open if below 90. | PASS WITH OPEN PERFORMANCE ISSUE |
| IV. Maintainable, Secure Engineering | Add typed local records and one server-side allowlisted projection. Keep raw drafts/verification metadata out of HTML, metadata, serialized props, and client bundles. Avoid a database or generalized project abstraction. | PASS |
| V. Verifiable Changes and Clear Acceptance | Map each requirement to content validation, projection tests, component tests, responsive/navigation E2E, Axe, manual checks, static build and documented performance evidence. | PASS |

**Pre-design gate**: PASS. Existing dependency versions and test conventions are established. The only existing content inconsistency is the known stale About employment sentence; the owner authorized correcting that sentence while preserving the section layout and other copy. No technical clarification remains.

**Post-design gate**: PASS with the documented desktop Lighthouse issue. The design is static-first, keeps the existing navigation enhancer as the sole active-state owner, preserves Feature 003 project route generation, and introduces no infrastructure or dependency. The cross-feature project-title discrepancy is handled by omitting optional individual project-name references in initial Feature 004 content.

## Project Structure

### Documentation (this feature)

```text
specs/004-experience-education-skills/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-experience-education-skills.md
└── tasks.md                         # Generated later by $speckit-tasks
```

### Source and tests

```text
src/
├── app/
│   ├── page.tsx                                      # Compose new sections in portfolio-to-contact order
│   └── globals.css                                   # Responsive section, timeline/card, and seven-link nav styling
├── components/
│   ├── sections/
│   │   ├── experience-section.tsx                    # Experience landmark, heading, ordered entries
│   │   ├── education-section.tsx                      # Education entries and certifications subsection
│   │   └── skills-section.tsx                         # Fixed ordered skill categories
│   ├── experience/experience-entry.tsx               # Reusable scannable experience presentation
│   ├── education/education-entry.tsx                  # Education entry presentation
│   └── skills/skill-category.tsx                      # Semantic category heading/list
├── content/
│   ├── experience-education-skills-types.ts           # Verification, approval, record, source and public DTO types
│   ├── experience.ts                                  # Two approved source records and contribution fields
│   ├── education.ts                                   # Two education records and three credentials
│   ├── skills.ts                                      # Six fixed categories and 33 ordered items
│   ├── sections.ts                                    # Add experience/education/skills IDs and content state
│   ├── navigation.ts                                  # Seven ordered navigation links
│   └── profile.ts                                     # Correct only stale Endava sentence in About summary
└── lib/
    ├── professional-content.ts                       # Server-only validation, filtering, and public projection
    └── navigation-enhancement.ts                     # Extend recognized homepage section IDs; preserve sole ownership

tests/
├── content/experience-education-skills.test.ts        # Exact entries, dates, fixed taxonomy, order, unique items
├── lib/professional-content.test.ts                   # Independent record/field publication and sentinel exclusion
├── components/experience-section.test.tsx             # Scannable entries, former/program labels, optional omission
├── components/education-section.test.tsx               # Degree, omitted dates, credentials
├── components/skills-section.test.tsx                  # Six groups and all 33 ordered labels
├── components/navigation-state.test.ts                 # Extend existing URL/hash owner assertions
└── e2e/
    ├── experience-education-skills.spec.ts             # Section rendering and responsive interaction
    ├── accessibility.spec.ts                          # Extend existing Axe/keyboard coverage
    ├── no-js-navigation.spec.ts                       # Extend valid anchor coverage
    ├── hydration.spec.ts                               # Extend fresh homepage hydration assertions
    └── project-navigation.spec.ts                     # Regression: Portfolio remains current on details
```

**Structure Decision**: Extend the existing single Next.js application. Keep Feature 004 records in their own typed content modules, with one shared Feature 004 projection module. Reuse `SectionHeading`, shared cards/tokens, and existing navigation component. The app page keeps Hero/About composition and maps Portfolio, Experience, Education, Skills, and Contact in order. Only `src/content/profile.ts` changes in Feature 002, limited to the authorized sentence. Project records, IDs/slugs, detail routes, and project publication code are not modified.

## Architecture and Data Flow

```text
src/content/{experience,education,skills}.ts
  raw typed records + record approval + individually verified/approved fields
                     │
                     ▼
src/lib/professional-content.ts (server-only projection)
  validate identities; filter draft records; filter each ineligible field;
  strip source/status/approval/TODO data
                     │
                     ▼
server-rendered Experience / Education / Skills section components
  semantic DOM only; no raw record or verification metadata serialized
```

1. **Source model**: Use Feature 004-specific record types, never project-specific `ProjectRecord` types. Entry-level approval and field-level verification/approval both gate public content. Required identity fields gate the record; optional fields are omitted independently.
2. **Publication projection**: Validate fixed IDs, ordering, unique skill names, and required facts. Return a public DTO without review metadata. Only server modules import raw records; components accept projection types.
3. **Section composition**: Update the existing section registry and homepage composition to render Projects, Experience, Education, Skills, and Contact without changing Hero/About structure. The About correction is one string in the existing profile data.
4. **Presentation**: Experience uses an ordered list of concise entries; Education uses semantic entries with a nested certification list; Skills uses six headings and semantic text lists. No chart, progress bar, or technology-logo dependency.
5. **Navigation**: Add three ordered items to the existing navigation data and recognized section IDs. Preserve server-rendered initial current state; hash/hashchange/popstate select the matching homepage destination, no-hash selects Home, passive scrolling does not change it, and project route context continues to select Portfolio. Keep the existing mobile dialog controller and vertical scroll.
6. **Project-name discrepancy**: Do not hard-code the latest alternative Dava.X titles into Feature 004. The initial public employment copy omits individual project names; if future copy needs them, it must read canonical published project records after title reconciliation. Do not update Feature 003 as part of this feature.

## Design Decisions and Tradeoffs

### Typed records and allowlisted projection

Use a narrowly scoped Feature 004 schema with explicit record state plus `ContentField<T>` state. This repeats a few enum concepts from Feature 003 but avoids coupling job/education data to project identifiers and fields. A single server-side projection function avoids repeated filtering logic across three section components. No generalized CMS/workflow layer is warranted.

Required identities are organization/role/program/date for Experience, institution/field/status for Education, credential name for certifications, and category/name for Skills. If a required identity is not eligible, omit that entire record/category item. Missing optional dates, location, issuer, contribution details, or other facts produce no public placeholder.

### Experience presentation

Use one shared entry pattern with organization/role/date as scan anchors and short contribution bullets. Keep Endava's program attribution visible with the former status and date range. Avoid logos, project outcome metrics, client names, or production claims. Keep the Core Elevating Media entry remote and internship-labelled.

### Education and certification presentation

Render the UTCN degree first and high-school record second. Use the same readable entry structure, omit unknown high-school dates, and include a restrained Certifications subsection with the three supplied names and only the two known O'Reilly issuer labels.

### Skills presentation

Use ordered semantic groups and simple text labels. Keep the fixed category and item order from the spec. No proficiency visualization or runtime category controls are planned.

### About correction scope

Change `src/content/profile.ts` experience summary from current employment to a factual past-tense statement: “I worked as a Junior Data Engineer in the Dava.X Trainee Program at Endava from June to October 2026.” Keep all other About text and all Hero/About component/layout behavior unchanged. Update the focused About content test to assert former-tense status. This is an explicitly approved content correction, not a change to Feature 002 layout or behavior.

## Navigation Integration

- Add Experience, Education, and Skills between Portfolio and Contact in `src/content/navigation.ts`; preserve Home, About, Portfolio, and Contact labels/order/targets.
- Add matching section IDs to `src/content/sections.ts` and homepage render mapping.
- Extend the existing `sectionIds` set in `src/lib/navigation-enhancement.ts`; do not add React state, another controller, or scroll listeners.
- Home route: no hash means Home current; recognized fragment means its one matching link current. `hashchange` and `popstate` keep current state synchronized.
- Project detail route: Portfolio stays the sole `aria-current="location"`; section links remain root-prefixed and navigate to homepage hashes.
- Keep no-JavaScript links valid in the existing inline layout. Preserve the 320–1023px full-screen dialog and scrollable panel; keep desktop links unwrapped at >=1024px.
- Add tests for direct hashes, menu selection/focus, back/forward, passive scroll invariance, project detail Portfolio state, no-JavaScript navigation, hydration diagnostics, and all seven destinations.

## Performance and SEO

- Keep the new UI in Server Components. Existing `NavigationEnhancement` remains the only established browser enhancement; Feature 004 adds no client state or dependency.
- Do not expose raw records through client modules, props, or metadata. Existing site metadata remains static and does not include employment, education, credentials, or draft values.
- Static homepage content introduces no new routes, fetches, images, font requests, or external URLs. Existing six project static paths must remain unchanged after build.
- Run comparable mobile/desktop production Lighthouse checks using Feature 003's documented profiles. Record all category scores, lab LCP/CLS, and field INP status. Homepage desktop 87 and representative detail 89 remain open against the >=90 target; no score below target passes.
- Do not make speculative optimizations. If a measured regression occurs, identify the trace evidence and address only a supported cause within Feature 004 scope.

## Test Strategy

1. **Content validation**: Assert two exact Experience records and order, Endava Dava.X attribution/former status, the Core internship details, two Education records, three credentials with only known issuers, six fixed skill categories, 33 exact ordered skill names, and unique identities.
2. **Projection tests**: Inject sentinel values across verified+approved, verified+unapproved, unverified+approved, and unverified+unapproved field states, plus an unapproved record with otherwise approved fields. Pass them through the actual public projection and section-rendering path in a private test-only static-render harness, not an application route. Assert eligible positive controls survive and all ineligible values and workflow metadata are absent from public DTOs, rendered/static HTML, metadata, and serialized output. After the production build, inspect client asset/module output to ensure raw content modules and sentinel values are not bundled.
3. **Component tests**: Add `tests/components/experience-section.test.tsx`, `tests/components/education-section.test.tsx`, and `tests/components/skills-section.test.tsx` using existing Vitest/React Testing Library conventions. Render each section using the public projection DTO, and assert approved content, chronological/category ordering, optional-field omission, no draft/unapproved values, semantic structure, and the approved UI contract. Also test the corrected About sentence without unrelated copy changes.
4. **Navigation tests**: Extend current unit/browser assertions for seven items, no-hash Home, direct recognized hashes, link activation, back/forward, exactly one `aria-current`, no passive-scroll tracking, project-detail Portfolio current, root-prefixed detail links, and no-JavaScript behavior.
5. **Responsive/E2E tests**: Check at 320, 375, 768, 1024, 1440, and 1920px for overflow, wrapping, clipping, and reachability. Check mobile menu vertical scrolling and desktop seven-link unwrapped layout. Keep actual 200% browser zoom and screen-reader/focus/contrast review as manual evidence.
6. **Accessibility**: Extend Axe scans and automated keyboard checks. Add manual screen-reader, keyboard, focus, contrast, reduced-motion, and 200% zoom review records; never mark these complete without human execution and evidence.
7. **Regression and build**: Run existing Feature 001–003 navigation, hydration, hero/about, project route, static generation, and publication suites; then TypeScript, ESLint, Prettier, Vitest, Playwright, and production build. Confirm six project routes and project metadata stay unchanged.
8. **Performance**: Build the production application and run Lighthouse on both `/` and the representative approved project detail `/projects/drivewise`, using the documented comparable mobile and desktop profiles for each route. Record all four category scores, lab LCP/CLS, and field INP availability for each route/profile; compare `/` with the Feature 003 homepage evidence and `/projects/drivewise` with the Feature 003 representative project-detail evidence. Preserve all below-target results as unresolved issues.

## Cross-Feature Dependencies and Risks

| Dependency or risk | Plan response |
|---|---|
| Feature 001 has a four-item navigation contract and 1024px desktop threshold. | Add three destinations through the same registry/owner. Test all seven at 1024px and keep them unwrapped; use existing full-screen mobile menu below 1024px. |
| Feature 002 About sentence says Endava is current employment. | Owner approved changing only that sentence to former employment ending October 2026 within Dava.X. Preserve layout and all other copy; test the precise correction. |
| Feature 003 project names differ from latest Feature 004 clarification for two projects. | Do not rename Feature 003 or duplicate case studies. Omit project-name mentions in initial Experience content; use canonical records only after reconciliation. |
| Draft values could be bundled by static imports or passed into components. | Raw modules remain server-only; project only public DTOs to server presentation; add sentinel tests against HTML/metadata/serialization. |
| Seven desktop navigation links may crowd the header near 1024px. | Verify at exact 1024px and larger specified widths; adapt spacing within existing design tokens without wrapping, hiding links, or changing breakpoint behavior. |
| Desktop Lighthouse remains below target. | Treat 87 homepage / 89 project detail as open baseline. Measure after integration; no threshold change or unsupported pass claim. |
| Manual accessibility requires human environments. | Automated tests remain separate. Document screen-reader, manual keyboard, contrast, focus, reduced motion, and zoom evidence before release acceptance. |

## Requirement Traceability

| Specification requirements | Planned design and verification |
|---|---|
| FR-001 | Section registry and homepage composition; section IDs and ordering asserted in `tests/e2e/experience-education-skills.spec.ts`. |
| FR-002–FR-003 | Endava record, program/former labels, gated responsibility fields, and no commercial/production language; content and component tests. |
| FR-004 | Core Elevating Media remote internship record and approved contribution fields; content/component tests. |
| FR-005–FR-006 | Education records and nested credentials; omission tests for unknown high-school period, credential dates, links, and issuer. |
| FR-007–FR-008 | Six fixed ordered skill categories and 33 unique records; content/component assertions, no proficiency presentation. |
| FR-009–FR-010 | Record and field gates plus server-side public projection; sentinel exclusion from HTML, metadata, static output, and serialization. |
| FR-011–FR-012 | Seven-link navigation data and sole existing enhancer; hash, history, project-detail current state, passive-scroll invariance, hydration, and no-JS E2E coverage. |
| FR-013–FR-014 | Semantic sections, focus, reduced motion, and responsive CSS; Axe/browser checks at six widths plus manual 200% zoom. |
| FR-015–FR-016 | Feature regression suites; only the approved About employment sentence is updated, with its layout and behavior preserved. |
| FR-017 | Comparable Lighthouse runs and Core Web Vitals evidence; below-target desktop values remain open, not passed. |
| FR-018 | Type, lint, formatting, Vitest, Playwright, Axe, build, manual evidence, and publication checks are recorded in quickstart. |

| Success criteria | Planned verification |
|---|---|
| SC-001–SC-002 | Exact Experience record count/order, Endava status/program/date, Core internship facts, and contribution authenticity. |
| SC-003–SC-004 | Education/credential names, status, known issuer, and omission of unknown values. |
| SC-005 | Exact 33 skills in fixed category/item order without duplicates or ratings. |
| SC-006 | Sentinel tests cover all record/field publication combinations and all public output boundaries. |
| SC-007 | Navigation E2E covers all destinations, URL/hash/history, current state, project detail context, and no-JS use. |
| SC-008 | Playwright viewport checks plus manual 200% zoom procedure. |
| SC-009 | Axe automation plus separate dated human accessibility evidence. |
| SC-010 | Feature 001–003 navigation, hydration, Hero/About, project routes, and publication regressions. |
| SC-011 | Mobile/desktop Lighthouse profiles, lab LCP/CLS, and field INP availability. |

## Constitution Recheck

| Principle | Post-design assessment |
|---|---|
| Truthful professional story | All confirmed role/program dates are explicit; About stale copy is corrected; unknown optional facts and project title references are omitted. |
| Accessible responsive experience | Semantic server-rendered sections, existing keyboard navigation, seven-link mobile scroll panel, no-JS links, six viewport checks, 200% zoom and manual review are specified. |
| Fast robust delivery | Static server output, no new package/client component, comparable Lighthouse validation; desktop gap remains open. |
| Maintainable secure engineering | Three focused content modules, shared narrow projection, strict types, no raw drafts sent to client, no unnecessary service. |
| Verifiable changes | Requirements map to content, projection, component, navigation, E2E, Axe/manual, regression, build, and performance verification. |

**Gate**: PASS for planning and implementation design. Production release remains blocked if desktop Performance is below 90 or required manual accessibility checks have not passed and been documented.

## Complexity Tracking

No constitution violations or additional infrastructure are introduced. The single About sentence correction is explicitly approved by clarification and is necessary to comply with the truthful-content principle; no other Feature 002 content or behavior changes are planned.
