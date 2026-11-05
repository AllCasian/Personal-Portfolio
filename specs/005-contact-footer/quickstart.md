# Feature 005 Validation Guide

This guide records Feature 005 implementation procedures, actual verification evidence, and remaining release gates.

## Implementation Baseline

Recorded before Feature 005 source changes on 2026-11-05:

- Branch: `feature/005-contact-footer`.
- `git status --short`: pre-existing `M next-env.d.ts` and untracked `specs/005-contact-footer/`; both are preserved.
- Requirements checklist: 16/16 checked.
- `npm.cmd run typecheck`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run format:check`: passed.
- `npm.cmd test`: passed, 21 test files / 59 tests. Vite printed its existing `configLoader: 'native'` compatibility notice.
- Feature 005 has no application source implementation yet.

## Baseline Integration Points (Before Feature 005 Changes)

- `src/content/sections.ts` defines the unique `contact` section as a placeholder; `src/app/page.tsx` maps it to `SectionPlaceholder` after the existing portfolio/professional sections.
- `src/content/navigation.ts` is the source of the seven destinations. `src/lib/navigation-enhancement.ts` remains the sole post-hydration active-state owner and sets `has-js` after initializing navigation listeners and state.
- `src/components/layout/site-footer.tsx` is rendered by the homepage, approved project detail route, and project not-found route. The project pages pass their existing navigation contexts.
- Feature 003/004 publication projectors use independent record approval and field verification/publication approval, returning minimal public data transfer objects.
- Tests use Vitest with React Testing Library and Playwright E2E under `tests/e2e/`; `npm.cmd run test:e2e` requires a production build and starts an isolated production server when its configured origin is not already serving the app.

## Feature 005 Implementation Evidence

- Implemented typed owner-approved contact source data and a server-side projection in `src/content/contact-types.ts`, `src/content/contact.ts`, and `src/lib/contact-content.ts`. Owner name, email, and profile URLs are each gated by record approval, field factual verification, and field publication approval. UI components receive only projected values.
- Implemented the server-rendered Contact section and responsive Footer, including the seven existing destinations. The Footer receives owner attribution only through the public projection and renders year-only copyright if the name is ineligible.
- The isolated Copy Email Client Component remains hidden and unfocusable until both the existing `has-js` marker and its own post-hydration readiness state are true. Clipboard success, rejection, unsupported API, delayed hydration, and JavaScript-disabled behavior are covered.
- Publication sentinel tests pass in a private, isolated Next.js fixture through the actual projection, Contact/Footer rendering, and Next serialized output. A separate production output scan checks generated server/static assets. No draft route or test sentinel is included in the production application.
- Latest automated results, rerun on 2026-11-05: `npm.cmd run build`, `npm.cmd run typecheck`, and `npm.cmd run lint` passed; `npm.cmd test` passed (**26 files / 77 tests**); `npm.cmd run test:e2e` passed (**58 tests**). The full Playwright suite includes Features 001-004 regression, navigation, hydration, no-JavaScript, axe, and publication-boundary checks. Prettier and `git diff --check` also passed after the documentation update.
- T027's Playwright check currently uses narrow effective CSS viewport widths as a reflow proxy; it does not set actual browser zoom to 200%, so T027 remains pending. Manual accessibility tasks T032-T035 were not performed and remain pending. External profile redirect/destination review T039 remains pending.
- T040 records field INP as not yet measurable and the optional visitor review as not conducted in this run; no representative visitor session was performed. It is qualitative and non-blocking. These entries are not claims of test success.

## Prerequisites

- Use the repository's Node/npm versions and install from the committed lockfile.
- Build production output before browser and Lighthouse checks.
- Run an isolated test server on the documented base URL; do not reuse an unrelated development server.
- Keep test-only sentinel content in private fixtures, never in a public route or production contact record.

## Automated Checks

Run the established repository scripts:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Expected outcomes:

- TypeScript, ESLint, Prettier, Vitest, Playwright, and the production build complete successfully.
- Content tests assert exact approved values and server-side field/record eligibility.
- `tests/e2e/contact-publication.spec.ts` starts the private Next fixture in `tests/e2e/fixtures/contact-publication-next/` on an ephemeral local port, with sentinel JSON passed through a server-process-only environment variable to the fixture-only `/test-publication-boundary` route. Never use `NEXT_PUBLIC_` or add this route to production `src/app`; the route uses a hyphenated segment because Next.js treats underscore-prefixed folders as private and omits them from routing. T013 exercises verified+approved, verified+unapproved, unverified+approved, unverified+unapproved, and record-unapproved cases through the actual `projectPublicContact()` projection and production `ContactSection`, asserting absence from server HTML/head output and the Next Flight/serialized response, with eligible values as positive controls. After T025, T030 extends the same fixture to pass ineligible owner-name and email sentinels through the projection and production `SiteFooter`/`CopyEmailAction`, asserting absence from Footer HTML, serialized output, Client Component props, and fixture-generated assets. After the production build, scan `.next/server/app` and `.next/static` for the exact private sentinel values as a separate additional check; this scan cannot establish sentinel exclusion by itself.
- Clipboard browser tests cover success, rejected permission, unsupported API, accessible live feedback, and focus remaining on the button.
- With JavaScript disabled, Copy Email is absent from the visible/accessibility/keyboard surface while the exact address, mailto link, and social links remain usable.
- Footer tests assert the projected owner/copyright when eligible; when ownerName is ineligible, they assert the name is omitted and the year-only copyright is rendered. Freeze the test clock and verify deterministic rendering on both sides of a calendar-year boundary. Also assert all seven existing navigation links, route-appropriate destinations, and no footer `aria-current` state.
- Delay the CopyEmailAction client chunk while allowing the existing `has-js` marker to initialize. Confirm the button remains hidden and unfocusable until its own post-hydration readiness gate is true; then confirm it becomes interactive without an inert-button interval.
- Navigation regression coverage asserts Contact hash navigation/history, homepage behavior, and Portfolio as the sole current primary destination on each project detail route.
- Responsive E2E checks at 320, 375, 768, 1024, 1440, and 1920 CSS pixels and 200% zoom assert no overflow, clipping, overlap, or unreachable controls.
- Axe automated checks are recorded separately from manual accessibility review.

## Lighthouse Measurements

Production Lighthouse 13.5.0 audits ran on 2026-11-05 against the production build at `127.0.0.1:3197`, using Chrome 156.0.8078.49. Both routes were measured with Performance, Accessibility, Best Practices, and SEO. A repeated series covering all route/profile combinations ran sequentially against one already-ready production server without restarting it between audits.

- Mobile profile: 412 x 823 CSS pixels, DPR 1.75, simulated throttling: 150 ms RTT, 1638.4 Kbps throughput, 562.5 ms request latency, 1474.56 Kbps download, 675 Kbps upload, and 4x CPU slowdown.
- Desktop profile: 1440 x 900 CSS pixels, DPR 1, with the same simulated throttling values. The desktop route audits were repeated because the first Drivewise run showed an unusually high local TTFB.

| Route/profile and run | Performance | Accessibility | Best Practices | SEO | LCP | CLS | Field INP |
|---|---:|---:|---:|---:|---:|---:|---|
| `/`, mobile 1 / 2 | 97 / 97 | 100 | 96 | 100 | 2.547 / 2.517 s | 0.000 / 0.000 | Not yet measurable |
| `/`, desktop 1 / 2 / 3 | 86 / 86 / 86 | 100 | 96 | 100 | 2.504 / 2.526 / 2.510 s | 0.000 | Not yet measurable |
| `/projects/drivewise`, mobile 1 / 2 | 98 / 98 | 100 | 96 | 100 | 2.409 / 2.355 s | 0.000 / 0.000 | Not yet measurable |
| `/projects/drivewise`, desktop 1 / 2 / 3 | 81 / 87 / 87 | 100 | 96 | 100 | 2.251 / 2.359 / 2.355 s | 0.000 | Not yet measurable |

Run details (times in milliseconds; TTFB and render delay are the LCP insight subparts):

| Route/profile run | LCP element | FCP | Speed Index | TBT | CLS | LCP TTFB | LCP render delay |
|---|---|---:|---:|---:|---:|---:|---:|
| `/` mobile 1 | Hero role heading, “Junior Data Engineer” | 898 | 898 | 68 | 0.000 | 53 | 103 |
| `/` mobile 2 | Hero role heading, “Junior Data Engineer” | 865 | 865 | 50 | 0.000 | 50 | 119 |
| `/` desktop 1 | Hero role heading, “Junior Data Engineer” | 879 | 879 | 54 | 0.000 | 14 | 257 |
| `/` desktop 2 | Hero role heading, “Junior Data Engineer” | 882 | 882 | 49 | 0.000 | 43 | 206 |
| `/` desktop 3 | Hero role heading, “Junior Data Engineer” | 870 | 870 | 61 | 0.000 | 8 | 255 |
| `/projects/drivewise` mobile 1 | Project summary text | 1133 | 1133 | 46 | 0.000 | 26 | 96 |
| `/projects/drivewise` mobile 2 | Project summary text | 802 | 802 | 44 | 0.000 | 19 | 79 |
| `/projects/drivewise` desktop 1 | Project heading, “Drivewise” | 861 | 2948 | 48 | 0.000 | 1771 | 77 |
| `/projects/drivewise` desktop 2 | Project heading, “Drivewise” | 800 | 800 | 45 | 0.000 | 17 | 75 |
| `/projects/drivewise` desktop 3 | Project heading, “Drivewise” | 803 | 803 | 45 | 0.000 | 12 | 82 |

JSON reports: [home mobile 1](./reports/lighthouse-home-mobile-2026-11-05.json), [home mobile 2](./reports/lighthouse-home-mobile-repeat-2026-11-05.json), [home desktop 1](./reports/lighthouse-home-desktop-2026-11-05.json), [home desktop 2](./reports/lighthouse-home-desktop-repeat-2026-11-05.json), [home desktop 3](./reports/lighthouse-home-desktop-repeat2-2026-11-05.json), [Drivewise mobile 1](./reports/lighthouse-drivewise-mobile-2026-11-05.json), [Drivewise mobile 2](./reports/lighthouse-drivewise-mobile-repeat-2026-11-05.json), [Drivewise desktop 1](./reports/lighthouse-drivewise-desktop-2026-11-05.json), [Drivewise desktop 2](./reports/lighthouse-drivewise-desktop-repeat-2026-11-05.json), and [Drivewise desktop 3](./reports/lighthouse-drivewise-desktop-repeat2-2026-11-05.json).

The homepage desktop score is stable at 86 across three runs, below the constitutional target and close to the prior 86-87 range. Normal-TTFB Drivewise desktop runs scored 87 twice. One Drivewise run scored 81 with an isolated 1.771 s LCP TTFB and 2.948 s Speed Index, while two runs in the same stable-server repeat series had 12-17 ms LCP TTFB and approximately 0.8 s Speed Index. The cause of the one high local TTFB was not established; this evidence is consistent with transient local-server or audit variability, but does not identify whether startup, resource contention, or another transient caused it. The normal repeats do not show a reproducible Feature 005-specific regression.

Lighthouse identifies the homepage hero role heading and the Drivewise project heading/summary as LCP elements. Homepage LCP is consistently 2.504-2.547 s, at or slightly over the 2.5 s target. TBT is 44-68 ms and CLS is 0.000. The reports show no render-blocking requests or estimated font-display savings. They identify about 54 KiB unused JavaScript (including about 14 KiB legacy JavaScript) in shared Next chunks used by prior features; the evidence does not isolate a safe Contact/Footer-specific change. No speculative optimization was made.

The desktop Performance threshold remains an open production release issue; the mobile homepage lab LCP is also slightly above the constitutional 2.5 s target. Historical Feature 004 mobile Performance of approximately 98 has an undocumented profile and is context only, not a comparable baseline. Existing desktop baselines were approximately 86-87 on `/` and 87 on `/projects/drivewise`; current results do not demonstrate compliance. Field INP is **not yet measurable** because sufficient real-user data is unavailable.

## Manual Accessibility Review

Before production release, record reviewer, date, browser/device/assistive technology, steps, findings, and remediation status for:

1. Keyboard-only movement through the Contact links, copy action (when JavaScript is enabled), footer links, and navigation; confirm visible focus and logical order.
2. Screen-reader names and reading order; activate Copy Email and confirm success/failure announcement without focus movement.
3. Text and control contrast measurements against WCAG 2.2 AA thresholds.
4. 200% browser zoom at a narrow viewport and desktop; verify reflow and reachability without unintended horizontal scrolling.
5. Reduced-motion preference; confirm no content or action depends on animation.
6. Contact/footer landmarks, heading hierarchy, and footer navigation name.

Do not mark manual checks complete from Axe results alone. Track each failure and retest it; unresolved manual issues remain release gates.

### T027: Actual Chrome 200% Zoom Procedure

Playwright's installed headless Chromium could not set real browser zoom. A probe sent `Control+Equal` five times and confirmed that `window.innerWidth`, `document.documentElement.clientWidth`, `devicePixelRatio`, `visualViewport.scale`, and computed document zoom were unchanged. The existing viewport-width test is only a reflow proxy; neither it nor DPR emulation satisfies T027. T027 remains pending.

For manual verification, use desktop Chrome with the production app running. Open `http://127.0.0.1:3000/#contact`, reset browser zoom to 100% with Chrome's menu, then use the menu's Zoom `+` control until it explicitly displays 200%. Do not use DevTools device emulation, operating-system scaling, CSS zoom, or `deviceScaleFactor` as a substitute. Inspect the visible email, Send Email/Copy Email controls, social links, footer text and all seven footer links. Tab through the controls and verify visible focus and reachability, readable wrapping, no clipped/overlapping text, and no horizontal overflow; also check the footer links reflow. Repeat at a narrow browser-window width and a wide desktop width, record the actual window/CSS viewport dimensions, Chrome version, date, observations, and failures. Reset to 100% after review.

## External Profile Reachability

The exact owner-approved URLs are GitHub `https://github.com/AllCasian` and LinkedIn `https://www.linkedin.com/in/casian-criste-b65582263/`. A direct fetch attempt on 2026-11-05 returned cache misses for both URLs; this did not inspect the browser destination or redirects, and does not establish unavailability. T039 therefore remains pending. An unreachable URL is not automatically invalid and does not revoke owner publication approval. During manual review, open each exact link, inspect redirects and the final destination, and record evidence. Omit a link only if it is confirmed unsafe, unavailable, unexpectedly redirected, or unrelated; do not guess a replacement or add automated monitoring. If reachability still cannot be established, record the limitation and keep the check pending.

## Optional Visitor Review

No representative visitor session was conducted during this implementation run. If reviewers are available later, ask them to identify a contact route and explain the footer destinations within 10 seconds. Record observations as qualitative usability feedback; lack of reviewers does not block release.

## Feature 005 Milestone and Open Gates

- Task status: **35/41 complete**. Pending: T027 (automated actual 200% browser-zoom verification), T032 (manual keyboard/focus review), T033 (screen-reader review), T034 (contrast measurements), T035 (manual zoom/reduced-motion review), and T039 (manual GitHub/LinkedIn destination and redirect review).
- Automated quality gates: TypeScript, ESLint, Prettier, Vitest (26 files / 77 tests), Playwright (58 tests), and the production build passed. Publication sentinel rendering checks and the separate production server/static output scan passed.
- Manual accessibility reviews T032-T035 were not performed. Axe results are automated evidence only and do not complete those tasks.
- Lighthouse audits were completed and recorded above, but desktop Performance remains below the constitutional threshold of 90 on both routes. The homepage mobile lab LCP is 2.547 s, slightly above the 2.5 s target. These remain open production release issues; no performance threshold is waived.
- External social URLs remain owner-approved and present in the public projection. Redirect/destination review was not performed, so T039 remains pending; no URL was judged invalid or replaced.
- No Feature 005 production-release approval is claimed while these evidence gates remain open.
