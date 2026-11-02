# Quickstart and Validation: Hero & About

**Feature**: [Hero & About](./spec.md)  
**Plan**: [Implementation Plan](./plan.md)  
**Data model**: [data-model.md](./data-model.md)  
**UI contract**: [Hero & About contract](./contracts/hero-about.md)

This guide describes how to validate Feature 002 after implementation. It does not claim that implementation or checks have already passed.

## Prerequisites

- Use the repository's existing Node.js 22/npm 10 environment and locked dependencies; no new package is planned.
- Install dependencies with `npm.cmd ci` only if the checkout does not already have the lockfile installation.
- Install Playwright Chromium once if it is not present: `npm.cmd exec playwright -- install chromium`.
- Profile identity, role, education, current role, technical background, interests, engineering approach, and professional direction now use owner-confirmed details. Keep future edits verified. Resume, GitHub, LinkedIn, and portrait remain optional and omitted until their assets or URLs exist.

## Local review

```powershell
npm.cmd run dev
```

Review Home and About at `#home` and `#about`. Confirm About, Portfolio, and Contact have the expected section IDs, and that Feature 002 leaves Portfolio and Contact as placeholders. Follow [the UI contract](./contracts/hero-about.md) for exact labels, hierarchy, optional states, and anchor behavior.

## Automated checks

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Build before Playwright E2E. The E2E runner uses `127.0.0.1:3000` by default and does not stop a server it did not start. If another server occupies that port, use a free port and set the matching URL before running tests:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:3001'
npm.cmd run test:e2e
```

Expected browser assertions include:

- Feature 002-specific CTA and navigation assertions live in `tests/e2e/hero-about.spec.ts`; existing Feature 001 navigation regression tests remain unchanged.
- Required profile strings use neutral, non-empty `Placeholder:` values only if their information is unavailable or unverified; any such marker is visible accessible text and is not presented as authored biography. Current required profile fields are owner-confirmed. Optional unavailable resources are omitted without placeholder links or copy.
- View Projects changes the URL to `#portfolio`; Contact Me changes it to `#contact`. The existing navigation `aria-current` state follows anchors, direct URLs, and browser history.
- Optional links appear only for verified local/remote destinations, sit below the required CTAs, and are omitted when absent.
- Missing portrait renders the existing decorative fallback. A configured photo failure shows the same fallback without broken-image UI or frame movement.
- No page-level horizontal overflow, clipped headline, overlap, or inaccessible CTA at 320, 375, 768, 1024, 1440, or 1920 CSS pixels.
- At deterministic 375×812 and 1440×900 viewport sizes, before scrolling, developer identity, professional headline, and both required actions appear in the initial viewport with no clipping, overlap, or horizontal overflow.
- axe checks report no applicable violations; keyboard order, visible focus, reduced motion, and no-JavaScript content/anchor navigation work.
- A fresh page load has no React hydration warning or error. The test checks console/page errors and does not suppress hydration diagnostics.

## Implementation verification (2026-11-02)

| Command | Result |
|---|---|
| `npm.cmd run typecheck` | Passed. |
| `npm.cmd run lint` | Passed. |
| `npm.cmd run format:check` | Passed. |
| `npm.cmd test` | Passed: 8 test files, 12 tests. Vitest printed an existing Vite native-config compatibility warning; it did not fail the suite. |
| `npm.cmd run build` | Passed on Next.js 16.4.2 / Turbopack; `/` is statically prerendered. |
| `npm.cmd run test:e2e` | Passed: 23 Chromium tests, including Axe, no-JavaScript, hydration, navigation/history, reduced motion, six responsive widths, and exact first-view checks. The latest run used an isolated production server on port 3001 because port 3000 served development assets. |

The component and E2E runs used the current owner-confirmed profile copy; the E2E run used the current production build. The recorded Lighthouse reports predate the latest content-only update; Performance 89 remains the last measured desktop result and an open issue, not a claim about a fresh post-copy run. The header and footer retained their layout/interaction contracts while generic sample name/initials were replaced to avoid implying an unverified identity. The Feature 001 navigation enhancer and navigation contract were not changed.

## Manual accessibility review

Axe is a separate automated check and does not replace this manual review. The full manual review remains pending because no screen-reader session or 200% browser-zoom session was available. Automated keyboard, focus, reduced-motion, responsive, Axe, and semantic assertions are recorded below as automated evidence only.

1. Use only the keyboard. Confirm logical focus order, visible focus indicators, Enter and Space activation for both CTA links, and the skip link.
2. In a screen reader, inspect accessible names, reading order, link interaction/activation, the single H1 and subordinate About heading, and the decorative fallback's hidden status.
3. Measure normal/large text, focus, active, and control contrast against WCAG 2.2 AA thresholds; record method, browser, color pairs, and findings.
4. At 320 CSS pixels and exactly 200% browser zoom, inspect wrapping, action reachability, About readability, and media/fallback fit; confirm reflow and no page-level horizontal scrolling.
5. Enable `prefers-reduced-motion` and confirm required content and actions do not depend on movement.
6. If a portrait is configured, verify meaningful alt for informative media and empty alt for decorative media. With no portrait, ensure the decorative fallback is not announced.

| Field | Record |
|---|---|
| Status | **Pending** - full manual accessibility review not completed. |
| Test date | Automated verification: 2026-11-02. Manual review date: pending. |
| Environment | Windows; production build; Playwright Chromium 156.0.0.0; responsive E2E viewports 320, 375, 768, 1024, 1440, and 1920 CSS px. No real screen-reader or browser zoom session performed. |
| Keyboard-only and visible focus | Automated checks passed for CTA keyboard activation, navigation focus, menu focus management, and visible focus outline. Manual check pending. |
| Screen-reader names, reading order, heading hierarchy, and CTA interaction | Pending real screen-reader session. Axe passed; one H1, About H2, and accessible CTA names are asserted. |
| Text/control contrast and method | Axe WCAG 2.2 AA scan passed. Manual contrast measurement pending. |
| 200% zoom and responsive reflow | Automated responsive tests passed at six widths. Manual 200% zoom check pending. |
| Reduced-motion behavior | Automated Playwright check passed with reduced motion enabled; content and actions remain visible and usable. |
| Portrait alternative text, if applicable | No verified portrait is configured; decorative fallback is hidden from assistive technology. Component coverage checks informative image naming and error fallback. |
| Findings, remediation, and unresolved issues | No Axe findings. Real screen-reader interaction, manual contrast measurements, and 200% zoom remain unresolved. |

Do not mark the manual accessibility task complete until all applicable manual checks are performed and their date, environment, results, and outstanding issues are recorded.

## Manual visual review

| Field | Record |
|---|---|
| Status | Reviewed; screenshot-reference comparison unavailable. |
| Review date and environment/viewports | 2026-11-02; Windows, production build, Chromium 156; captures at 375x812, 1440x900, and full-page mobile width. |
| Reference screenshots available for inspection | Earlier supplied screenshots are unavailable in the current workspace. No screenshot details were inferred. |
| Feature 001 token and component comparison | Retains the dark canvas, blue accent, Inter typography, content width, spacing, focus token, buttons, and surface cards; reuses `ButtonLink`, `Card`, and `SectionHeading`. |
| Hierarchy, spacing, density, CTA prominence, responsive composition | Reviewed after the final owner-confirmed copy in 375x812 mobile and 1440x900 desktop captures. The Junior Data Engineer headline wraps naturally to two lines at both sizes; both required actions remain prominent and visible in the initial viewport. About uses a readable six-topic card grid that stacks on mobile. No clipping, overlap, or horizontal overflow was observed. |
| Portrait placement, if applicable | No verified portrait exists. The decorative fallback aligns beside desktop copy and follows the copy/actions on mobile. |
| Accessible interaction states | Visual review found the existing focus outline remains visible; automated active/hover/focus and Axe checks passed. |
| Findings and unresolved issues | Visual review against Feature 001 is complete. Direct comparison with the supplied screenshots could not be performed. All required profile fields are now populated with owner-confirmed details; optional portrait, resume, and social URLs remain absent. |

Review captures: `reports/hero-about-final-content-mobile-2026-11-02.png`, `reports/hero-about-final-content-desktop-2026-11-02.png`, and `reports/hero-about-final-content-mobile-full-2026-11-02.png`.

## Performance comparison

The constitution targets Lighthouse scores of at least 90 in Performance, Accessibility, Best Practices, and SEO; lab LCP at most 2.5 s; CLS at most 0.1; and field INP at most 200 ms at p75 when measurable. Field INP is reported as **not yet measurable** until sufficient real-user data exists.

Feature 001 baseline: Desktop Performance 89, Accessibility 100, Best Practices 96, SEO 100, LCP 2.237 s, CLS 0.000; Mobile Performance 98, Accessibility 100, Best Practices 96, SEO 100, LCP 2.226 s, CLS 0.066. The desktop score of 89 is an existing unresolved issue below the constitution target.

### Feature 002 measurements (2026-11-02)

Lighthouse 13.5.0, Chrome 156.0.0.0. Both profiles used simulated throttling: 150 ms RTT, 1638.4 Kbps throughput, 4x CPU slowdown, 562.5 ms request latency, 1474.56 Kbps download, and 675 Kbps upload. Mobile used 412x823 at DPR 1.75; desktop used 1440x900 at DPR 1.

| Run | Profile | Performance | Accessibility | Best Practices | SEO | FCP | Lab LCP | TBT | Lab CLS |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Feature 001 baseline | Desktop | 89 | 100 | 96 | 100 | 0.679 s | 2.237 s | 58 ms | 0.000 |
| Feature 001 baseline | Mobile | 98 | 100 | 96 | 100 | 0.667 s | 2.226 s | 53 ms | 0.066 |
| Feature 002 final | Desktop | 89 | 100 | 96 | 100 | 0.694 s | 2.222 s | 56 ms | 0.000 |
| Feature 002 final run 1 | Mobile | 97 | 100 | 96 | 100 | 0.697 s | 2.238 s | 67 ms | 0.066 |
| Feature 002 final repeat | Mobile | 98 | 100 | 96 | 100 | 0.674 s | 2.212 s | 53 ms | 0.066 |

These Lighthouse results were captured before the latest owner-confirmed profile copy update; no new Lighthouse run was made for the content-only change. Desktop Performance remains 89 in the last measured run, below target; it is an open release issue and is not reported as passing. One preliminary desktop run was 88; the same-profile repeat and final run were 89, matching the Feature 001 baseline, so a sustained regression was not reproduced. Mobile varied from 97 to 98 across two same-profile runs; the repeat matches the baseline score of 98. Both mobile measurements exceed 90. Lab LCP and CLS met their numeric thresholds in those runs. Field INP is **not yet measurable**.

The final desktop report identifies the same unused-JavaScript opportunity already present in Feature 001: two shared Next.js chunks with an estimated 55,781-byte / 300 ms opportunity. A roughly 100 ms task is attributed to a shared Next.js chunk, but the trace does not attribute it to an application function. The opportunity and script transfer are comparable to baseline; no evidence ties it to the Hero/About additions. Lighthouse reported no render-blocking resource, font-display issue, or image cost; no portrait request occurs without configured portrait data. Because the remaining issue is in shared framework chunks and cannot be localized to a safe feature-level change, no speculative changes to the Feature 001 navigation/foundation were made. The desktop target remains open.

Final JSON reports: [mobile run 1](./reports/lighthouse-final-mobile-2026-11-02.json), [mobile repeat](./reports/lighthouse-final-mobile-repeat-2026-11-02.json), and [desktop](./reports/lighthouse-final-desktop-2026-11-02.json). Diagnostic reports and visual captures are retained in `reports/`.

Reproduction, after `npm.cmd run build` and `npm.cmd run start` at `127.0.0.1:3000`:

```powershell
npm.cmd exec lighthouse -- http://127.0.0.1:3000 --output=json --output-path=./specs/002-hero-about/reports/lighthouse-final-mobile.json --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --screenEmulation.mobile=true --screenEmulation.width=412 --screenEmulation.height=823 --screenEmulation.deviceScaleFactor=1.75 --throttling-method=simulate --throttling.rttMs=150 --throttling.throughputKbps=1638.4 --throttling.cpuSlowdownMultiplier=4 --throttling.requestLatencyMs=562.5 --throttling.downloadThroughputKbps=1474.56 --throttling.uploadThroughputKbps=675 --chrome-path='C:\Program Files\Google\Chrome\Application\chrome.exe' --quiet
npm.cmd exec lighthouse -- http://127.0.0.1:3000 --output=json --output-path=./specs/002-hero-about/reports/lighthouse-final-desktop.json --only-categories=performance,accessibility,best-practices,seo --form-factor=desktop --screenEmulation.mobile=false --screenEmulation.width=1440 --screenEmulation.height=900 --screenEmulation.deviceScaleFactor=1 --throttling-method=simulate --throttling.rttMs=150 --throttling.throughputKbps=1638.4 --throttling.cpuSlowdownMultiplier=4 --throttling.requestLatencyMs=562.5 --throttling.downloadThroughputKbps=1474.56 --throttling.uploadThroughputKbps=675 --chrome-path='C:\Program Files\Google\Chrome\Application\chrome.exe' --quiet
```

## Documentation

`README.md` documents profile editing. Keep test results and manual-review findings in this quickstart.
