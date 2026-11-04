# Quickstart and Validation: Projects Showcase & Project Details

**Feature**: [Projects Showcase & Project Details](./spec.md)  
**Plan**: [Implementation Plan](./plan.md)  
**Data model**: [Project data model](./data-model.md)  
**UI contract**: [Projects UI contract](./contracts/ui-projects.md)

This guide defines reproducible checks after implementation. It does not assert that any check has already passed.

## Prerequisites

- Use the repository's locked dependencies and existing Node.js/npm environment.
- A public project record must be approved, and each rendered field must be both factually verified from an owner-confirmed or approved project-documentation source and separately publication-approved.
- Dava.X projects remain training-program work at Endava; never represent them as commercial client engagements, production deployments, or independently delivered products.
- Do not put confidential Endava materials, credentials, secrets, or private data in source content, including drafts. Add only authentic, verified and publication-approved media to `public/projects/`.
- Set `SITE_URL` to the actual production origin only when known and configured. Otherwise omit canonicals; never guess a public origin.
- Install Playwright Chromium if needed: `npm.cmd exec playwright -- install chromium`.

## Repository integration notes

Confirmed for Feature 003 on 2026-11-02: branch `feature/003-projects-showcase`; Next.js 16.4.2, React 19.3.1, TypeScript 5.9.3, Tailwind CSS v4, Vitest, Playwright, and Axe are already installed. No additional dependency is required. Existing commands are `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test`, `npm.cmd run build`, and `npm.cmd run test:e2e`.

The installed Next.js App Router guides were checked for dynamic segments, `generateStaticParams`, `generateMetadata`, `notFound()`, and `next/image`. In Next.js 16.4.2, dynamic route `params` are asynchronous and must be awaited. Static params are produced by `generateStaticParams`; unspecified paths remain runtime-resolvable unless the route opts out with `dynamicParams = false`, so this feature will resolve unknown slugs through the public projection and `notFound()`. Metadata exports require a Server Component. Local image dimensions or a fixed-ratio frame must reserve layout space.

Integration touchpoints: `src/app/page.tsx` currently renders a placeholder for `#portfolio`; project routes and presentation components do not yet exist. The established navigation owner is `src/lib/navigation-enhancement.ts`, with server-rendered links in `src/components/layout/primary-links.tsx`. Shared shell components are under `src/components/layout/`, design tokens and responsive styles are in `src/app/globals.css`, and the existing test conventions are `tests/components`, `tests/content`, `tests/lib`, and `tests/e2e`. Existing Feature 001/002 navigation and hydration suites are `tests/components/navigation-state.test.ts`, `tests/e2e/no-js-navigation.spec.ts`, and `tests/e2e/hydration.spec.ts`; Hero/About regression coverage is in `tests/e2e/hero-about.spec.ts`.

## Local review

```powershell
npm.cmd run dev
```

Inspect `/#portfolio`, all three groups and all six cards. Open each approved detail route directly, refresh it, follow Back to Projects, and navigate from details using desktop and mobile navigation. Verify Features 001–002 content and anchors remain intact.

On approved `/projects/[slug]`, verify Portfolio alone exposes `aria-current="location"`, Home is not current, and exactly one primary destination is current. The server-rendered route context and post-hydration `src/lib/navigation-enhancement.ts` owner must agree on direct load and refresh without hydration warnings. Use primary links and Back to Projects to return to `/#portfolio`; verify the existing homepage state. Exercise browser back/forward between homepage anchors and detail pages. Confirm ordinary destination links still work with JavaScript disabled.

Request unknown, malformed and unpublished paths (for example `/projects/not-a-project`) directly. Assert the HTTP response status is **404**, not a redirect; confirm generic not-found content, no project details or draft title/description/OG content, a `noindex` directive, and no public static route generated for an unpublished project. Inspect built output as well as browser DOM/metadata for leaked draft strings.

## Automated quality gates

Run after implementation:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Build before Playwright E2E. The runner uses `127.0.0.1:3000` by default and must not stop a server it did not start. If that port is occupied by an unrelated server, choose an available port and set it explicitly:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:3001'
npm.cmd run test:e2e
```

Expected automated coverage:

- Exactly six initial projects; categories, attribution, order and unique fixed slugs.
- Draft records and fields lacking either verification or publication approval excluded from public projection, cards, generated routes, metadata, HTML and serialized props.
- All six approved direct routes and refresh; unknown/unpublished not-found, `noindex`, no draft metadata, and unpublished route absence from static params/output.
- Unique metadata from eligible values, canonical behavior only when `SITE_URL` is configured, and no guessed domain or ineligible image.
- Detail navigation: Portfolio solely current; Home not current; returning to `/#portfolio` restores Portfolio; history synchronized; exactly one current link. Homepage Feature 001 behavior remains unchanged.
- Responsive listing/detail checks at 320, 375, 768, 1024, 1440 and 1920 CSS px, including overflow, wrapping/readability and action reachability.
- Keyboard/focus checks, Axe scans, reduced motion, no-JavaScript links, image absence and separately forced image-load failure (no broken-image indicator, readable text, usable navigation, stable reserved frame/no layout shift), and hydration diagnostics.
- Existing Feature 001 navigation and Feature 002 Hero/About regression suites pass unchanged.

## Manual accessibility review — required before release acceptance

Automated Axe results are recorded separately and do not replace manual review. Do not mark a manual check complete until it has actually been performed. Any required check not performed, or any unresolved applicable WCAG 2.2 AA failure, blocks release acceptance.

Record actual date, browser/OS/version, assistive technology and version, tested route, viewport and zoom, evidence (notes or captures), result, finding severity, related requirement, remediation owner/status, and retest result. Track each failure to a verified retest; document unresolved items and their release-blocking status.

1. Use keyboard only on the collection and representative detail page. Verify logical order, activation of every card/detail/external link, menu open/close, Escape behavior, return navigation and no keyboard trap.
2. Confirm focus indicators remain visible and unobscured on navigation, cards, actions and optional links; verify focus order.
3. Use a screen reader to inspect landmarks, category grouping/headings, project link names, detail heading hierarchy, image alternatives and link destinations.
4. Measure text, muted text, link, active, hover and focus contrast against applicable WCAG 2.2 AA thresholds.
5. Perform the 200% zoom procedure below and inspect the collection, detail, navigation panel and media.
6. Enable reduced motion and confirm no essential content/action is hidden or delayed.
7. If project media exists, verify informative alt is accurate and decorative media is ignored.

| Review item | Status/date | Environment and evidence | Findings/remediation/retest |
|---|---|---|---|
| Keyboard-only interaction (T040) | Partial user report, 2026-11-04; pending | User reports keyboard navigation works correctly. Browser/OS, tested listing/detail routes, viewport, focus order and visibility, menu/link interactions, and review evidence were not supplied. | Complete T040 and record environment, evidence, findings, remediation, and retest. |
| Screen-reader navigation and names (T041) | Deferred at user's request; pending | Not performed; no assistive technology or environment evidence. | Perform and document before production release acceptance. |
| Contrast (T042) | Deferred at user's request; pending | No measurements or method recorded. | Measure applicable states and document results before production release acceptance. |
| 200% zoom and reflow (T043) | Partial user report, 2026-11-04; pending | User reports browser zoom at 200% works correctly. Starting/effective viewport, browser/OS, tested routes, individual reflow conditions, focus visibility, and evidence were not supplied. | Complete the documented procedure from 1280x800 CSS pixels and record all required checks before production release acceptance. |
| Focus visibility and order (T044) | Deferred at user's request; pending | Not manually reviewed or evidenced. | Perform and document before production release acceptance. |
| Reduced motion (T044) | Deferred at user's request; pending | Not manually reviewed or evidenced. | Perform and document before production release acceptance. |
| Image alternatives, when applicable | Deferred with remaining manual review; pending | No manual screen-reader review recorded. | Verify informative/decorative alternatives if approved project media is added; record results in the manual review. |

### Development milestone status (2026-11-04)

Feature 003 implementation is complete, and the automated verification listed above passed. Manual accessibility is partially verified only to the extent of the user's reported keyboard-navigation and 200% zoom checks; T040 and T043 remain open because task-specific acceptance conditions and evidence are incomplete. T041, T042, and T044 are deferred at the user's request for this development milestone. The deferrals are not passes, waivers, or not-applicable results. Task status remains **52/57 complete**, with T040-T044 pending. The user accepts these deferrals for the current development milestone; production release is not approved until the manual accessibility gates are completed and desktop Lighthouse Performance reaches the constitutional target.

## 200% browser zoom procedure

1. Set browser viewport to **1280 × 800 CSS pixels** before zoom and record browser/version and operating system.
2. Set browser page zoom to **200%** using browser controls. Record the actual resulting CSS viewport dimensions reported by the browser/devtools; it will be approximately 640 × 400 CSS pixels, depending on browser chrome.
3. Inspect `/#portfolio`, a representative project detail route, navigation panel and media where present. Do not substitute device scale factor for browser zoom.
4. Confirm information is not lost; cards remain readable; all controls are reachable and operable; there is no unintended horizontal scroll, overlap or clipping; and keyboard focus remains visible.
5. Record route, initial and effective viewport, zoom, evidence, pass/fail, findings, remediation and retest in the manual review table.

## Visual review

Review the collection and representative detail at 375px and 1440px at minimum. Check category hierarchy, content-driven grid/card readability, title wrapping, CTA prominence, media proportions, content width, Feature 001–002 tokens, and accessible interaction states. Original screenshots are unavailable; use the established design system only and record this limitation. Save dated captures/findings under `specs/003-projects-showcase/reports/` if review occurs.

## External link review

Before publishing a GitHub or Live Demo link, confirm its exact URL, project correspondence, HTTPS scheme and publication approval. Inspect any redirect and approve the actual destination independently before publishing. If a link is unavailable, unsafe, unexpectedly redirected, or no longer project-related, remove it from public content; never guess a replacement. Recheck when the link is edited or a problem is reported. No automated monitoring is required.

Record the result for each public link; if no external links are published, mark the review **Not applicable — no URLs published** rather than claiming a link was tested.

| Project/link kind | Exact URL | Verification source and date | Approval evidence | Redirect/final destination/project match | Result/action |
|---|---|---|---|---|---|
| All six records / GitHub and Live Demo | — | No project URL fields are present in the six approved records; inspected 2026-11-02 | Not applicable — no URLs published | Not applicable | No external link was tested or claimed; repeat the review before any URL is added or after a link issue is reported |

## Optional media failure check

Test the absent-media state separately from load failure. With no approved media value, confirm no image request or empty media control is rendered. For failure testing, use an isolated in-memory project fixture and browser request interception; never add fixture media to `src/content/projects.ts`, `public/projects/`, or a public route. Confirm no broken-image indicator appears, reserved geometry remains stable (no layout shift), project text remains readable, navigation remains usable, and no replacement artwork or screenshot is fabricated. Record the result alongside responsive/browser evidence.

## Lighthouse and performance

Use the same documented Feature 001 mobile and desktop Lighthouse profiles and a production build. Audit the homepage collection and at least one representative detail route on both profiles. Record date or Lighthouse version, browser/device/testing profile, Performance/Accessibility/Best Practices/SEO scores, lab LCP/CLS, and field INP only when sufficient real-user data exists (otherwise write “not yet measurable”).

Feature 001's last documented desktop Performance baseline is **89**, below the constitutional target of **90**. Keep it open until new measurements demonstrate compliance; do not call 89 a pass or claim an earlier run validates new project pages. Investigate measured bottlenecks, make evidence-based changes only, repeat comparable runs after changes, and document unresolved below-target results as release issues. All four score targets remain >=90; LCP <=2.5s and CLS <=0.1.

For commands and profile flags, reuse the exact production Lighthouse commands/profile documentation in [Feature 001 quickstart](../001-portfolio-foundation/quickstart.md). Record Feature 003 paths, scores, traces and comparisons here or in a linked report; never fabricate test outcomes.

## Feature 003 implementation record (2026-11-02)

Environment: Windows PowerShell, repository Node/npm environment, Next.js 16.4.2, Chromium 156.0.0.0 and Lighthouse 13.5.0. The production build was served at `http://127.0.0.1:3000`. Verification commands ran on 2026-11-02.

| Check | Result | Evidence |
|---|---|---|
| TypeScript | PASS | `npm.cmd run typecheck` exited 0. |
| ESLint | PASS | `npm.cmd run lint` exited 0. |
| Prettier | PASS | `npm.cmd run format:check` exited 0; all repository files passed. |
| Vitest | PASS | `npm.cmd test`: 15 files and 42 tests passed. Vite emitted its existing config-loader advisory. |
| Playwright and Axe | PASS | With `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001`, `npm.cmd run test:e2e -- --reporter=line`: 44 tests passed, including Feature 001/002 regressions, project routes, navigation, hydration, responsive coverage, configured Axe scans, and the isolated failed-media fixture. |
| Production build | PASS | `npm.cmd run build` exited 0 and generated exactly the six approved project paths. |
| Lighthouse | MEASURED; desktop Performance below target | See the measurements and JSON evidence below. Field INP is **not yet measurable**; lab interaction metrics are not field INP. |
| Manual accessibility | PARTIALLY VERIFIED; remaining checks deferred | On 2026-11-04 the user reported that keyboard navigation and browser zoom at 200% work correctly. Task-specific routes, environment, viewport, detailed checks, and evidence were not provided, so T040 and T043 remain pending. T041, T042, and T044 are deferred at the user's request; none is marked passed or waived. |
| Visual review | REVIEWED | Playwright captures at 375px and 1440px were inspected on 2026-11-02. The supplied screenshots were used as inspiration for the dark surfaces, blue accents and project-card grouping, not as pixel-perfect layouts. |

The automated responsive suite used 320, 375, 768, 1024, 1440 and 1920 CSS-pixel widths. Collection and detail pages had no horizontal overflow, clipping or unreachable project actions. Mobile and desktop navigation, active destination, browser history, JavaScript-disabled links, reduced-motion behavior, hydration and 404 metadata checks passed. Automated Axe reported no configured violations. This is not a substitute for the manual accessibility gate.

### Supplemental publication and failed-media tests (2026-11-02)

- **T057 — PASS:** `npm.cmd test -- tests/components/project-publication.test.tsx` passed 1 file and 5 tests. The tests feed `verified+approved`, `verified+unapproved`, `unverified+approved`, `unverified+unapproved`, and entirely draft records through the actual public projection. Approved summary content is a positive control; ineligible sentinel values are asserted absent from `renderToStaticMarkup()` output for `ProjectDetailLayout`, metadata, static route parameters, and JSON-serialized public data. Draft records produce no rendered project HTML or static route parameters and receive generic unavailable metadata. Existing Playwright route tests independently confirm HTTP 404, generic not-found content, and `noindex` for unavailable URLs.
- **T032 — PASS:** `npm.cmd run test:e2e -- --grep 'project media failure' --reporter=line` passed 1 browser test. `tests/e2e/project-media-failure.spec.ts` starts a private Vite server on an ephemeral localhost port and mounts the actual `ProjectDetailLayout`/`ProjectMediaImage`. A test-only `next/image` adapter emits a browser `<img>`; Playwright intercepts the fixture URL and returns HTTP 404. The test verifies the image is removed with no visible broken-image UI, reserved frame dimensions and layout-shift entries remain stable, Drivewise text stays readable, Back to Projects navigates to `/#portfolio`, and the test-only failed-media URL is absent from the actual public projection. The fixture exists only under `tests/e2e/fixtures/`; no public Next.js route, project record, or media asset was added.
- Full Playwright verification then ran on an isolated runner-owned Next.js server at port 3001: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npm.cmd run test:e2e -- --reporter=line` — 44 passed. No unrelated server was stopped.

### Lighthouse results

Each run used Lighthouse 13.5.0 and Chrome 156.0.0.0, simulated 150 ms RTT, 1638.4 Kbps throughput, 4x CPU slowdown, 562.5 ms request latency, 1474.56 Kbps download and 675 Kbps upload. Mobile used 412 x 823 at DPR 1.75; desktop used 1440 x 900 at DPR 1. These were production-build measurements. The homepage desktop run was repeated with the same profile.

| Page/profile | Performance | Accessibility | Best Practices | SEO | Lab LCP | Lab CLS | Field INP |
|---|---:|---:|---:|---:|---:|---:|---|
| `/#portfolio`, mobile | 97 | 100 | 96 | 100 | 2.374 s | 0.066 | Not yet measurable |
| `/#portfolio`, desktop | 87 | 100 | 96 | 100 | 2.358 s | 0.000 | Not yet measurable |
| `/#portfolio`, desktop repeat | 87 | 100 | 96 | 100 | 2.357 s | 0.000 | Not yet measurable |
| `/projects/drivewise`, mobile | 98 | 100 | 96 | 100 | 2.210 s | 0.052 | Not yet measurable |
| `/projects/drivewise`, desktop | 89 | 100 | 96 | 100 | 2.217 s | 0.000 | Not yet measurable |

The previous Feature 001 desktop Performance result was 89. The Feature 003 homepage measures 87 in two comparable runs, and the representative project detail measures 89. Both desktop Performance results remain below the constitutional target of 90; release acceptance is therefore withheld. The measured scores do not establish a field INP result. Lab LCP and CLS meet their numeric limits in these runs.

The homepage desktop trace identifies the hero role headline as the LCP element, a 199 ms element-render delay, approximately 54 KiB estimated unused JavaScript savings, and approximately 14 KiB of legacy JavaScript. The previous Feature 001 trace reported approximately 55 KiB unused and approximately 14 KiB legacy JavaScript, so those findings do not identify a newly introduced cause. Current script transfer is 145,369 bytes versus 139,897 bytes in the previous report; the trace does not attribute that difference to a specific safe-to-remove feature. No evidence-backed, low-risk optimization was established in this pass, so no speculative performance change was made. The gap remains open for future investigation.

JSON evidence: [homepage mobile](./reports/lighthouse-mobile-2026-11-02.json), [homepage desktop](./reports/lighthouse-desktop-2026-11-02.json), [homepage desktop repeat](./reports/lighthouse-desktop-repeat-2026-11-02.json), [Drivewise mobile](./reports/lighthouse-detail-mobile-2026-11-02.json), and [Drivewise desktop](./reports/lighthouse-detail-desktop-2026-11-02.json).

### Visual review record

The 375px collection and 1440px collection/detail captures were reviewed against the available Feature 001/002 design system and supplied inspiration. Dark surfaces, restrained blue accents, typography, card surfaces and category grouping remain coherent. Mobile content stacks naturally; project titles and summaries wrap; detail actions remain clear; the sparse AI Recipe page does not invent narrative. Review found duplicated category labels in Academic and Personal group headings; the group component was refined to omit a subtitle when it repeats the heading. No clipping or horizontal overflow appeared in the tested viewport captures. No authentic project media is available, so media proportions and an actual browser-loaded failed image could not be visually reviewed. Captures: [collection at 375px](./reports/visual-collection-375-2026-11-02.png), [collection at 1440px](./reports/visual-collection-1440-2026-11-02.png), [detail at 1440px](./reports/visual-detail-1440-2026-11-02.png).

### Remaining verification and release issues

- T032 is complete using the isolated browser fixture described above. No authentic project media is present in the public records, and no replacement screenshot was added.
- T040 and T043 remain pending despite the user's partial reports that keyboard navigation and 200% zoom work correctly; the complete procedures and task-specific evidence are not recorded. T041, T042, and T044 remain pending and are deferred at the user's request for this development milestone. Automated Axe and keyboard/focus Playwright checks remain separate evidence and do not complete these manual tasks.
- Desktop Lighthouse Performance is below 90 on both tested page types (homepage 87, Drivewise detail 89), so production release acceptance remains open. The Feature 001 baseline of 89 is retained for comparison, not treated as passing.
- No public GitHub or Live Demo URLs are present; link review is not applicable until a URL is proposed. Do not describe external links as tested.

Requirement traceability was checked against FR-001-FR-029 and SC-001-SC-012 in `tasks.md`; T032 and T057 are verified, while the manual/release gates above remain explicitly open. No Feature 001/002 contract regression was observed in the existing regression suites.

## Blank implementation results template for future verification runs

| Command/review | Date and environment | Result | Evidence/issues |
|---|---|---|---|
| TypeScript | Pending | Pending | — |
| ESLint | Pending | Pending | — |
| Prettier | Pending | Pending | — |
| Vitest | Pending | Pending | — |
| Playwright and Axe | Pending | Pending | — |
| Production build | Pending | Pending | — |
| Lighthouse mobile/desktop | Pending | Pending | — |
| Manual accessibility | Pending | Pending | — |
| Visual review | Pending | Pending | — |

Document task status, actual command outputs, performance comparisons, visual findings, manual review, and unresolved release issues. A check remains pending until evidence is recorded.
