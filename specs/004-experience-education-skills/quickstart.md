# Quickstart: Experience, Education & Skills

- **Feature**: [specification](./spec.md)
- **Plan**: [implementation plan](./plan.md)
- **UI contract**: [Experience, Education & Skills](./contracts/ui-experience-education-skills.md)
This is a validation guide for implementation. It records no test result until the command or manual check has actually been run.

## Prerequisites and Local Run

- Use the repository's installed Node.js/npm toolchain and dependencies from `package.json` / `package-lock.json`.
- Start the application with `npm.cmd run dev` from the project root.
- Use `http://localhost:3000/` unless that port belongs to an unrelated process. Do not stop an unrelated server. For browser tests on another available port, use the runner's isolated server or set `PLAYWRIGHT_BASE_URL` to the matching server.

## User-Facing Scenarios

1. Open `/` and verify the order Experience, Education, Skills, Contact after the existing Portfolio section. Open each destination directly as `/#experience`, `/#education`, and `/#skills`.
2. Verify Endava appears before Core Elevating Media in reverse chronological order; Endava is former employment, entirely within Dava.X, June–October 2026.
3. Verify education dates/status, the omission of high-school dates, and the three certifications with only known issuer details.
4. Compare the Skills section with the exact 33-item list and category/item order in [data-model.md](./data-model.md). Confirm no levels, logos that dominate content, or numeric ratings.
5. Open `/projects/drivewise`, refresh it, confirm Portfolio is the only current navigation destination, and navigate back to each new homepage hash. Confirm existing project details remain intact.
6. Open the mobile menu at narrow widths. Confirm seven destinations, keyboard operation, visible focus, and vertical menu scrolling if needed. At desktop widths, confirm all labels remain on one row and are not compressed.

## Automated Quality Gates

Run after implementation:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Build before Playwright E2E. The Playwright configuration defaults to `http://127.0.0.1:3000`; if occupied, use the runner's isolated Next.js server on an available port and set `PLAYWRIGHT_BASE_URL`. Never terminate a server the test runner did not start.

Expected automated coverage:

- Exactly two Experience entries, their fixed reverse-chronological order, Endava's former status, Dava.X program attribution, and the verified Core Elevating Media responsibilities.
- Two Education entries, completed degree, and safe omission of high-school dates and unavailable certification attributes.
- Six fixed skill categories and all 33 ordered items exactly once; no fabricated or duplicate skill.
- Record-level and per-field verification/publication filtering, including all four independent field states and an unapproved record with otherwise approved fields. Pass sentinels through the actual public projection and private test-only render harness; assert their absence from server-rendered/static HTML, metadata, and serialized output. Do not add a production route for draft fixtures. After production build, inspect client asset/module output for sentinel values and raw content modules.
- Experience, Education/Certifications, and Skills component tests using only public-projection DTOs; assert approved rendering, ordering, optional-field omission, draft exclusion, semantic structure, and the approved UI contract.
- Seven navigation destinations, initial no-hash Home, direct hashes, history, exactly one current destination, no passive-scroll state change, project-detail Portfolio state, no-JavaScript links, and hydration stability.
- Feature 001–003 regression suites, including all six statically generated project routes and existing project metadata.
- Responsive browser checks at 320, 375, 768, 1024, 1440 and 1920 CSS-pixel widths; automated accessibility scans and reduced-motion behavior.

## Manual Accessibility and Responsive Review

Automated Axe and keyboard tests do not replace manual checks. Before release acceptance, record date, browser/OS/version, tested routes, viewport/zoom, evidence, findings, remediation, and retest status for:

1. Keyboard-only navigation through each section and all seven links; menu opening/closing; visible focus; no keyboard trap.
2. Screen-reader landmarks, reading/heading order, experience dates/status, certification names, skill category/list relationships, and CTA/navigation names.
3. Contrast for text and active/hover/focus states against their actual backgrounds.
4. 200% browser zoom starting from 1280×800 CSS pixels; record the effective viewport and inspect information retention, reflow, overflow, clipping, overlapping content, control reachability, and focus visibility.
5. Reduced-motion preference: ensure content and navigation remain available with motion disabled.

Record incomplete checks as pending; do not claim completion from automated evidence.

## Publication-Safety Review

Use isolated test records with unique sentinel values for each gate combination: approved record/verified+approved field; approved record/verified+unapproved; approved record/unverified+approved; approved record/unverified+unapproved; and draft record. Verify:

- Eligible fields appear in the public projection as a positive control.
- Ineligible values and internal source/approval metadata are absent from HTML and all serialized output.
- Ineligible content does not appear in site metadata or the client bundle.
- A missing required identity prevents the entry from being publicly rendered; missing optional data produces no placeholder or empty control.
- Existing Feature 003 project static routes and public pages are unchanged.

## Feature 003 Project-Name Note

Feature 003 currently calls two Dava.X records “Smart Librarian” and “ETL Pipeline”; the latest Feature 004 clarification names them “AI Smart Librarian” and “Data Integration ETL Pipeline”. Do not rename project records or duplicate case studies. Feature 004's initial experience copy omits individual project names until the discrepancy is reconciled. If later referenced, read approved names from the canonical Feature 003 public projection.

## Performance Record

Build the production application, then audit both `/` and the representative approved project detail `/projects/drivewise` using the same documented Feature 003 Lighthouse profiles on mobile and desktop. Record a separate result for each route/profile: date, Lighthouse version, browser/device and profile, Performance/Accessibility/Best Practices/SEO, lab LCP/CLS, and field INP availability. Compare `/` with the Feature 003 homepage measurements and `/projects/drivewise` with its representative project-detail measurements. Field INP is “not yet measurable” until sufficient field data exists.

Feature 003 measured homepage desktop Performance **87** and representative project detail Performance **89**; Feature 001 baseline was **89**. These are below the constitutional target of 90 and remain open release issues. Feature 004 results below 90 are not passes. Do not change thresholds or make speculative optimizations.

## Implementation Evidence

| Check | Date/environment | Result | Evidence or unresolved issue |
|---|---|---|---|
| TypeScript | 2026-11-04, Windows workspace | Pass | Baseline `npm.cmd run typecheck`; exit 0. |
| ESLint | 2026-11-04, Windows workspace | Pass | Baseline `npm.cmd run lint`; exit 0. |
| Prettier | 2026-11-04, Windows workspace | Pass | Baseline `npm.cmd run format:check`; all matched files formatted. |
| Vitest | 2026-11-04, Windows workspace | Pass | Baseline `npm.cmd test`; 15 files, 42 tests passed. |
| Playwright/Axe | 2026-11-04, Chromium, isolated 127.0.0.1:3010 | Pass | Baseline `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3010 npm.cmd run test:e2e`; 44 tests passed. The runner started and stopped its own production server on port 3010. |
| Production build/static project routes | 2026-11-04, Next.js 16.4.2, Turbopack | Pass | Baseline `npm.cmd run build`; build succeeded and generated all six static Feature 003 project routes. |
| Manual accessibility | Pending | Pending | — |
| Lighthouse mobile/desktop | Pending | Pending | Desktop Performance issue remains open until measured compliant. |

The baseline commands were run before Feature 004 source changes. Vitest emitted the existing Vite native-config loader warning; it did not fail the run. Playwright emitted environment color-variable warnings; they did not fail the run.

## Implementation Integration Inventory

- Before Feature 004, `src/app/page.tsx` rendered Hero and About directly and mapped the existing section registry; Portfolio used `ProjectsSection`, with Contact as a placeholder.
- `src/content/navigation.ts` is the ordered source for primary links. Feature 004 extends the existing seven-link navigation and `src/lib/navigation-enhancement.ts`, which remains the sole post-hydration URL/hash active-state owner and retains history and mobile-dialog focus behavior.
- Existing reusable UI includes `SectionHeading`, `Card`, content-width layout, color/spacing/focus tokens in `src/app/globals.css`, and the current responsive full-screen mobile navigation.
- Existing test conventions are Vitest/React Testing Library under `tests/components`, `tests/content`, and `tests/lib`, with Playwright under `tests/e2e`. No new dependency or route is planned.
- Feature 002's stale Endava sentence was in `src/content/profile.ts`; the approved correction changes only that sentence and its focused assertion in `tests/components/about-section.test.tsx`.

## Implementation Task Evidence

| Task | Status | Evidence |
|---|---|---|
| T001 Integration inventory | Complete | Existing page, section registry, navigation owner, design tokens, tests, and approved About correction points recorded above. |
| T002 Baseline checks | Complete | TypeScript, ESLint, Prettier, Vitest (15 files/42 tests), Playwright (44 passed, isolated port 3010), and production build/static routes all passed before Feature 004 source changes. |
| T003–T008 Content foundation | Complete | Typed records, independent approval metadata, public projection, validation, and content/projection tests passed. |
| T009 Publication integration | Complete | Sentinel fixtures passed through the projection and server-rendered sections; static metadata, rendered HTML and serialized DTO assertions passed. Production output/client-asset scan found no sentinel or review metadata strings. |
| T010–T019 Experience, Education, Skills | Complete | Three component suites passed; ordered content, optional omissions, semantic structure, approved projection, exact skill inventory, and About sentence regression passed. |
| T020–T027 Navigation | Complete | Seven destinations, current-state owner, anchors, history, mobile menu, desktop row, and JavaScript-disabled homepage/project links passed regression tests. |
| T028–T032 Responsive/accessibility/regressions | Complete | Playwright passed all six widths, Axe and hydration checks, with existing Features 001–003 routes and behavior intact. |
| T033–T037 Automated quality | Complete | Final typecheck, lint, formatting, 59 Vitest tests, 47 Playwright tests, production build, and output-leak inspection passed. |
| T038-T042 Manual accessibility | Deferred by user decision; pending | Not performed or verified. Evidence requirements remain open as production-release checks; they do not block continued feature development. |
| T043-T044 Lighthouse measurement and release gate | Complete | Comparable mobile and desktop profiles were repeated and documented below. Desktop Performance remains below 90 on both routes; the release issue remains open. |
| T045–T046 Documentation/traceability | Complete | This quickstart records actual results and remaining release gates; FR-001–FR-018 and SC-001–SC-011 are mapped to tasks and validation. |

## Feature 004 Implementation Results — 2026-11-04

### Automated checks

The final implementation checks used the repository's locked toolchain on Windows:

| Check | Result | Evidence |
|---|---|---|
| TypeScript | Pass | `npm.cmd run typecheck`, exit 0. |
| ESLint | Pass | `npm.cmd run lint`, exit 0. |
| Prettier | Pass | `npm.cmd run format:check`, all matched files formatted. |
| Vitest | Pass | `npm.cmd test`, 21 files and 59 tests passed. Includes content validation, all publication-field combinations, sentinel server-rendering, all three section components, About accuracy, and navigation state. |
| Playwright and Axe | Pass | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3013 npm.cmd run test:e2e`, 47 tests passed. The test runner started and stopped its isolated production server. Coverage includes the six viewport widths, mobile menu scroll/focus, desktop navigation, direct anchors/history, no-JavaScript links, Axe, hydration, and Feature 001–003 regressions. |
| Production build | Pass | `npm.cmd run build`, Next.js 16.4.2/Turbopack; homepage and all six existing `/projects/[slug]` static routes generated. |
| Publication output inspection | Pass | Sentinel integration test passed through `getPublishedProfessionalContent()` and the three actual section renderers; ineligible values and review metadata were absent from HTML, static metadata, and serialized public DTOs. After build, recursive scans of `.next/static` and `.next/server/app` found no sentinel, verification, or approval metadata strings. No draft route was added. |

The existing Vitest native-config warning and Playwright `NO_COLOR`/`FORCE_COLOR` warnings remained non-fatal.

### Responsive navigation and implementation

Seven primary destinations now render in the approved order: Home, About, Portfolio, Experience, Education, Skills, Contact. The existing navigation enhancer remains the only post-hydration state owner. Automated tests passed for current-location state, project detail context, hash/history behavior, no-JavaScript navigation, mobile menu operation, and unwrapped desktop links.

The initial Lighthouse run reported mobile CLS of 0.124 on `/` and 0.106 on `/projects/drivewise`; Lighthouse identified the shifted element as `main#main-content`. Inspection showed the no-JavaScript fallback links participated in header document flow before `.has-js` hid them. The fallback navigation was changed to a fixed, scrollable panel at mobile widths so it remains usable without JavaScript and its visibility change no longer moves the page content. The no-JavaScript Playwright test asserts this fallback remains visible and fixed. Comparable reruns reported CLS 0.000 on both mobile routes. No JavaScript, dependency, or route was added for this correction.

### Lighthouse measurements

Four final runs used the production build on 2026-11-04 with Lighthouse **13.5.0**, Chrome **156.0.8078.49**, `http://127.0.0.1:3012`, simulated throttling (150 ms RTT, 1638.4 Kbps throughput, 4× CPU slowdown, 562.5 ms request latency, 1474.56 Kbps download and 675 Kbps upload). Mobile used 412×823 at DPR 1.75; desktop used 1440×900 at DPR 1. All runs measured Performance, Accessibility, Best Practices and SEO. Field INP is **not yet measurable** because sufficient real-user data is unavailable.

| Route/profile | Performance | Accessibility | Best Practices | SEO | Lab LCP | Lab CLS | Field INP |
|---|---:|---:|---:|---:|---:|---:|---|
| `/`, mobile | 97 | 100 | 96 | 100 | 2.408 s | 0.000 | Not yet measurable |
| `/`, desktop | 87 | 100 | 96 | 100 | 2.365 s | 0.000 | Not yet measurable |
| `/projects/drivewise`, mobile | 98 | 100 | 96 | 100 | 2.369 s | 0.000 | Not yet measurable |
| `/projects/drivewise`, desktop | 85 | 100 | 96 | 100 | 2.366 s | 0.000 | Not yet measurable |

Report JSON: [homepage mobile](./reports/lighthouse-final-home-mobile-2026-11-04.json), [homepage desktop](./reports/lighthouse-final-home-desktop-2026-11-04.json), [Drivewise mobile](./reports/lighthouse-final-drivewise-mobile-2026-11-04.json), and [Drivewise desktop](./reports/lighthouse-final-drivewise-desktop-2026-11-04.json). The initial pre-CSS diagnostic reports are also retained in this directory under the `lighthouse-home-*` and `lighthouse-drivewise-*` names.

Compared with Feature 003's comparable measurements, homepage desktop Performance remains 87 (previously 87), and Drivewise desktop measures 85 (previously 89). A prior comparable post-layout-correction run measured Drivewise desktop at 87, so its lab score varied by two points between runs; both results remain below the constitutional minimum of 90. Homepage and Drivewise mobile measured 97 and 98, compared with 97 and 98 previously. The prior mobile CLS values were 0.066 and 0.052; the final 0.000 values meet the CLS target. All measured LCP values are below 2.5 seconds. The desktop Performance issue remains an open release blocker; no field INP result is claimed. Lighthouse's final desktop report still shows the hero role headline as the LCP element (about 225 ms element-render delay) and an estimated 54 KiB unused JavaScript opportunity; the render-blocking insight lists no blocking requests, and no font-display savings were reported. The report does not establish a new safe code removal or other evidence-backed desktop optimization. No further speculative optimization was made.

### Manual accessibility and release status

Manual tasks T038-T042 are deferred at the user request. They have not been performed, passed, or verified. Their required evidence remains visible in tasks.md: keyboard/focus order, screen-reader review, contrast ratios, 200% zoom/reflow, and OS/browser reduced-motion behavior, each with date, environment, findings, evidence, remediation, and retest. Deferral does not block continued development, but these remain outstanding production-release checks. Automated Axe passing does not replace them.

**Milestone status:** Feature 004 sections and navigation are implemented, and automated checks pass. Manual accessibility reviews remain deferred and pending. T043-T044 are complete as measurement and reporting tasks; they do not indicate that the Performance target passed. Production release is not approved because desktop Performance is below 90 and required manual accessibility evidence is incomplete. Implementation task status is **41/46 complete**; T038-T042 remain pending production-release checks.


## Convergence follow-up: repeated Lighthouse review (2026-11-04)

Audits ran against the same production build with Lighthouse 13.5.0 and Chrome 156.0.8078.49. The desktop profile used 1440 x 900, simulated throttling (150 ms RTT, 1638.4 Kbps throughput, 4x CPU slowdown, 562.5 ms request latency, 1474.56 Kbps download, 675 Kbps upload), and disabled screen emulation. Mobile used 412 x 823 at DPR 1.75 with the same simulated throttling. Each run measured Performance, Accessibility, Best Practices, and SEO. INP remains "not yet measurable" because there is insufficient field data.

| Route/profile and run | Performance | Accessibility | Best Practices | SEO | LCP | FCP | Speed Index | TBT | CLS | Field INP |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| /, desktop initial | 86 | 100 | 96 | 100 | 2.403 s | 0.919 s | 0.919 s | 64 ms | 0.000 | Not yet measurable |
| /, desktop repeat 1 | 87 | 100 | 96 | 100 | 2.392 s | 0.883 s | 0.883 s | 60 ms | 0.000 | Not yet measurable |
| /, desktop repeat 2 | 87 | 100 | 96 | 100 | 2.360 s | 0.882 s | 0.882 s | 44 ms | 0.000 | Not yet measurable |
| /projects/drivewise, desktop initial | 87 | 100 | 96 | 100 | 2.356 s | 0.806 s | 0.806 s | 46 ms | 0.000 | Not yet measurable |
| /projects/drivewise, desktop repeat 1 | 87 | 100 | 96 | 100 | 2.363 s | 0.807 s | 0.807 s | 54 ms | 0.000 | Not yet measurable |
| /projects/drivewise, desktop repeat 2 | 87 | 100 | 96 | 100 | 2.364 s | 0.806 s | 0.806 s | 53 ms | 0.000 | Not yet measurable |
| /, mobile | 98 | 100 | 96 | 100 | 2.368 s | 0.869 s | 0.869 s | 59 ms | 0.000 | Not yet measurable |
| /projects/drivewise, mobile | 98 | 100 | 96 | 100 | 2.361 s | 0.797 s | 0.797 s | 50 ms | 0.000 | Not yet measurable |

The additional desktop runs were comparable: homepage Performance ranged 86-87 with LCP 2.360-2.403 s; Drivewise remained 87 with LCP 2.356-2.364 s. Both are reproducibly below the constitutional Performance target of 90, not merely one-off low scores. Relative to prior recorded scores (87 homepage, 85 Drivewise), the latest homepage result is within one point and Drivewise improved by two points but still misses the target. Mobile scores remain at or above prior results, and CLS is zero in all these audits.

### Bottleneck evidence and optimization decision

- The homepage LCP element is the Hero role headline. Across desktop runs, its element-render delay ranged about 180-291 ms, while TTFB was about 10 ms. The Drivewise LCP element is its project summary text; element-render delay was about 94-101 ms, with TTFB about 9-10 ms. LCP is the repeatable score pressure on both routes; homepage render delay varies more between runs.
- Desktop FCP and Speed Index are approximately 0.88-0.92 s on the homepage and 0.81 s on Drivewise. TBT stayed 44-64 ms on the homepage and 46-54 ms on Drivewise, so long main-thread tasks are not a significant measured bottleneck in these runs.
- Main-thread work showed about 201-210 ms of Style & Layout on the homepage versus 85-88 ms on Drivewise. This is a real route difference, but the trace does not identify a specific safe CSS rule or below-the-fold operation whose removal would preserve layout, navigation, and accessibility contracts.
- Lighthouse reported about 54 KiB of unused JavaScript. The reported Next.js chunks are shared with Features 001-003; Feature 004 content is server-rendered, and the report does not attribute that unused code to the new sections. Script evaluation was roughly 175-200 ms, with low TBT. These measurements do not justify removing shared navigation/runtime code.
- The local Inter font is preloaded and about 48.6 KiB transferred. Font request time was roughly 8-18 ms in the repeated desktop traces; Lighthouse reported no font-display savings. CSS is inlined by the existing build configuration, and the render-blocking insight found no blocking requests.

No implementation optimization was made: repeated evidence confirms the sub-90 desktop gap, but does not support a safe, scoped change. Changing typography, deferring visible sections, or altering shared client/navigation code would be speculative or risk approved behavior. The desktop Performance issue therefore remains an open production-release blocker. There is no field INP claim.

The repeated JSON evidence is retained as [homepage desktop repeat 1](./reports/lighthouse-repeat1-home-desktop-2026-11-04.json), [homepage desktop repeat 2](./reports/lighthouse-repeat2-home-desktop-2026-11-04.json), [Drivewise desktop repeat 1](./reports/lighthouse-repeat1-drivewise-desktop-2026-11-04.json), [Drivewise desktop repeat 2](./reports/lighthouse-repeat2-drivewise-desktop-2026-11-04.json), [homepage mobile](./reports/lighthouse-repeat-home-mobile-2026-11-04.json), and [Drivewise mobile](./reports/lighthouse-repeat-drivewise-mobile-2026-11-04.json).
