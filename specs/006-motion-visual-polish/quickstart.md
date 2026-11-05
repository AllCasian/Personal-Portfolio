# Feature 006 Verification Guide

This guide records Feature 006 implementation verification. Baseline tasks T001–T003, implementation/automated tasks T004–T033, and automated/performance tasks T037–T039 are complete. Manual tasks T034–T036 and final acceptance closure T040 remain pending.

## Implementation and Automated Verification (2026-11-05)

The implementation is CSS-first. Shared tokens and transitions are in `src/app/globals.css`; one small `MotionRevealEnhancement` Client Component mounts the shared `IntersectionObserver` enhancer. Server-rendered content has no pending/hidden state. Only opted-in below-viewport elements enter a temporary pending state after successful observer initialization. Intersection, focus, anchor navigation, reduced motion, resize, unsupported APIs, exceptions, and cleanup all fail open. There is no scroll listener, animation state manager, new dependency, or navigation-state change. Hero markup remains server rendered and receives a bounded CSS sequence and static gradient accent. Existing card actions remain separate links.

Automated evidence on 2026-11-05:

- `npm.cmd run typecheck`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run format:check`: PASS.
- `npm.cmd test -- --reporter=dot`: PASS, 28 files / 89 tests.
- `npm.cmd run test:e2e -- --reporter=dot` against the isolated production server at `127.0.0.1:3198`: PASS, 72 tests.
- `npm.cmd run build`: PASS; the homepage and all six project detail routes were statically generated.
- Axe checks passed for homepage/project collection and focused card states, including after reveal candidates reached their final visible state.
- Playwright covered visible-by-default server HTML, no JavaScript, blocked scripts, absent/failing IntersectionObserver, reduced motion, direct anchors, rapid/reverse scrolling, keyboard focus, pointer hover, touch navigation, all six detail routes, navigation history, and required responsive widths.
- The stale Hero unit/E2E assertions that expected no portrait were updated to verify the currently approved `Casian Criste` portrait and stable reserved frame. No portrait content or application behavior was changed for that test correction.
- `git diff --check`: PASS.

These automated results do not close the manual visual, assistive-technology, or actual browser-zoom reviews below.

## Prerequisites

- Stay on `feature/006-motion-visual-polish` and preserve unrelated working-tree changes.
- Use the repository Node/npm versions and lockfile.
- Run Lighthouse against a production build and an isolated, ready production server, not an unrelated development server.
- Chrome must match the baseline browser where available (Chrome 156.0.8078.49); Lighthouse version is 13.5.0.
- Save new Lighthouse JSON reports under `specs/006-motion-visual-polish/reports/` and record exact profile, date, browser, server lifecycle, run order, and failures.

## Automated Quality Gates

Run the repository's existing scripts after implementation:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Expected evidence includes:

- TypeScript, ESLint, Prettier, Vitest, Playwright, and the production build pass.
- Unit tests cover observer initialization/failure, target eligibility, once-only reveal, cleanup, reduced-motion changes, and immediate fail-open visibility.
- Playwright tests cover initial server HTML, delayed scripts, JavaScript disabled, unavailable IntersectionObserver, initial viewport and direct-anchor content, rapid scrolling, reverse-scroll permanence, reduced motion, and route transitions/reloads.
- Project-card tests cover keyboard focus parity and pointer hover; touch tests do not depend on hover.
- Existing route, navigation, hydration, contact clipboard/publication, and all six project-detail tests continue to pass.
- Existing Axe checks report no new WCAG 2.2 AA findings. Axe does not replace manual visual, contrast, touch, reduced-motion, or zoom review.

## Scroll-Reveal Browser Scenarios

Use deterministic test conditions rather than fixed-duration sleeps:

1. Load `/` and verify all content exists and is visible in server HTML before the reveal enhancer runs.
2. Delay or block the motion client bundle; confirm Hero, headings, section content, cards, actions, navigation, and Footer remain visible and usable.
3. Disable JavaScript; verify normal content and links remain visible/usable and there are no reveal-pending markers.
4. Disable/throw from `IntersectionObserver` before initialization; verify fail-open visibility.
5. With motion enabled, inspect an opt-in below-fold group: it may be pending only after the observer initializes; on intersection it becomes visible and remains visible after scrolling away and back.
6. Jump directly to a section hash and open `/projects/drivewise`; verify the destination and page content are immediately readable and do not wait behind earlier reveal groups.
7. Scroll rapidly past several groups; confirm all content is visible once reached and no long stagger queue blocks an action.
8. Focus a descendant in a pending group; confirm the group is immediately exposed and focus remains visible.
9. Change the emulated or system reduced-motion preference to `reduce`; confirm pending items become visible, movement/shimmer/stagger stop, and static accent/focus remains.

## Visual and Manual Accessibility Review

Record reviewer, date, browser/OS, viewport, preference/input mode, steps, findings, and unresolved issues. Reference screenshots were not found in the repository; compare with existing Features 001–005 tokens and compositions and do not invent unavailable reference details.

- Capture comparable before/after views at 375x812 and 1440x900 for Hero, About, Projects, Experience, Education, Skills, Contact, Footer, and a project detail.
- Review the hierarchy (Hero > Projects > other sections), text wrapping/contrast, animation density, reveal timing, no content hidden or duplicated, and consistency of spacing/colors/typography.
- Use pointer hover where supported and keyboard-only tab/focus through cards, navigation, CTAs, and Footer. Confirm focus is not obscured and is at least as clear as hover feedback.
- Use a touch-capable device/emulation and confirm project actions are apparent without hover.
- Enable `prefers-reduced-motion: reduce` in browser settings/devtools and verify immediate content visibility, no translation/shimmer/stagger, and retained static accents/focus.
- Verify **actual Chrome browser zoom at 200%** using Chrome's Zoom menu. Do not substitute device scale factor, OS scaling, CSS zoom, or viewport resizing. At narrow and desktop window widths check no clipping/overlap/overflow, visible focus, readable cards, and reachable controls. Record zoom percentage explicitly.

## Lighthouse Baseline and Repeatable Measurement

The Feature 005 quickstart recorded Lighthouse 13.5.0 / Chrome 156.0.8078.49 using these profiles:

| Profile | Viewport | DPR | Simulated network | CPU slowdown |
|---|---|---:|---|---:|
| Mobile | 412x823 CSS px | 1.75 | RTT 150 ms; throughput 1638.4 Kbps; request latency 562.5 ms; download 1474.56 Kbps; upload 675 Kbps | 4x |
| Desktop | 1440x900 CSS px | 1 | Same simulated network settings | 4x |

Feature 005's original baseline comprised two mobile and three desktop runs per route. Before Feature 006 source changes, two third mobile runs were captured against one production build on the isolated server at `127.0.0.1:3198`; the six Feature 005 desktop and four original mobile JSON reports were copied into `specs/006-motion-visual-polish/reports/baseline/` without altering the originals. The completed 12-report baseline uses Lighthouse 13.5.0 / Chrome 156, the profile settings above, simulated throttling, and the same emulated mobile user agent. The desktop route profiles were verified as 1440x900/DPR 1; mobile profiles were 412x823/DPR 1.75. The four pre-change screenshots are in `reports/before/` and were captured against that production build at 375x812 and 1440x900.

| Route/profile | Performance runs (median) | Accessibility / Best Practices / SEO | LCP ms (median; range) | FCP ms (median; range) | TBT ms (range) | TTFB ms (range) | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` mobile | 97 / 97 / 97 (97) | 100 / 96 / 100 | 2547 (2517–2595) | 865 (853–898) | 44–68 | 10–51 | 0.000 |
| `/` desktop | 86 / 86 / 86 (86) | 100 / 96 / 100 | 2510 (2504–2526) | 879 (870–882) | 49–61 | 6–40 | 0.000 |
| `/projects/drivewise` mobile | 98 / 98 / 98 (98) | 100 / 96 / 100 | 2368 (2355–2409) | 805 (802–1133) | 44–58 | 7–24 | 0.000 |
| `/projects/drivewise` desktop | 81 / 87 / 87 (87) | 100 / 96 / 100 | 2355 (2251–2359) | 803 (800–861) | 45–48 | 8–14 | 0.000 |

The Drivewise desktop 81 result is retained as a run in the three-sample median/range, not discarded. Current desktop Performance remains below the constitutional target of 90. The new home-mobile third run scored Performance 97, Accessibility 100, Best Practices 96, SEO 100; LCP 2595 ms, FCP 853 ms, Speed Index 853 ms, TBT 44 ms, TTFB 10 ms, CLS 0.000. Its LCP element was `.hero .portrait-image`; the LCP breakdown was TTFB 12 ms, resource-load delay 105 ms, resource-load duration 4 ms, and element-render delay 76 ms. The new Drivewise-mobile third run scored 98/100/96/100 with LCP 2368 ms, FCP 805 ms, Speed Index 805 ms, TBT 58 ms, TTFB 7 ms, CLS 0.000. Exact values and per-run breakdowns are preserved in the JSON reports.

Baseline quality gates on 2026-11-05, branch `feature/006-motion-visual-polish`: typecheck PASS; ESLint PASS; Prettier PASS; production build PASS; Playwright PASS (58/58). Vitest: 76 passed, 1 failed across 26 files. The existing failure is `tests/components/hero-section.test.tsx` expecting no image while the current Hero renders `me1-2.jpg` with alt text `Casian Criste`; no test or source was changed to hide or revert the portrait. The existing navigation and publication regression scenarios passed in the Playwright baseline. Navigation uses the existing seven destination links and `src/lib/navigation-enhancement.ts` hash/history owner. The existing color/focus/surface tokens are `--canvas`, `--surface`, `--surface-raised`, `--text`, `--muted`, `--accent`, `--accent-strong`, `--line`, `--focus`, and `--radius-card` in `src/app/globals.css`. Existing publication-filter and contact-projection checks passed in the baseline Playwright run.

The baseline production reports measured homepage JavaScript requests at 505,807 decoded bytes / 154,995 transferred bytes, and Drivewise JavaScript requests at 476,433 decoded bytes / 145,205 transferred bytes. These figures come from the Lighthouse `network-requests` audit; use the same method and build comparison for the post-change bundle budget.

Initial motion foundation verification: focused Vitest for `tests/lib/motion-reveal.test.ts` and `tests/components/motion-reveal-enhancement.test.tsx` passed 12/12 cases after implementation. Coverage includes visible-by-default markup, below-viewport eligibility, reveal-once/unobserve, missing/throwing observer, observe failure, reduced motion before and during a visit, focus exposure, direct hash protection, cleanup, server markup, and effect cleanup. T021 required no corrective source change after those tests passed. TypeScript and ESLint also passed after the foundation and section hooks were added.

LCP attribution is recorded per report below. Older Feature 005 reports did not expose resource-load delay/duration subparts in `lcp-breakdown-insight`; those values are reported as unavailable rather than inferred. The new home-mobile third report exposes both values.

| Baseline report | LCP element | LCP TTFB / element-render delay (ms) | Other reported LCP subparts (ms) |
|---|---|---:|---|
| `home-mobile-1.json` | `.hero-role` | 53 / 103 | Not reported |
| `home-mobile-2.json` | `.hero-role` | 50 / 119 | Not reported |
| `home-mobile-3.json` | `.portrait-image` | 12 / 76 | Resource load delay 105; resource load duration 4 |
| `home-desktop-1.json` | `.hero-role` | 14 / 257 | Not reported |
| `home-desktop-2.json` | `.hero-role` | 43 / 206 | Not reported |
| `home-desktop-3.json` | `.hero-role` | 8 / 255 | Not reported |
| `drivewise-mobile-1.json` | `.project-summary` | 26 / 96 | Not reported |
| `drivewise-mobile-2.json` | `.project-summary` | 19 / 79 | Not reported |
| `drivewise-mobile-3.json` | `.project-summary` | 9 / 89 | Not reported |
| `drivewise-desktop-1.json` | `.project-detail-header h1` | 1771 / 77 | Not reported |
| `drivewise-desktop-2.json` | `.project-detail-header h1` | 17 / 75 | Not reported |
| `drivewise-desktop-3.json` | `.project-detail-header h1` | 12 / 82 | Not reported |

## Post-change Lighthouse and Bundle Comparison (2026-11-05)

The post-change set uses the same Lighthouse 13.5.0 profiles, Chrome 156.0.8078.49, production build, emulated device/network/CPU settings, and one ready isolated server lifecycle at `127.0.0.1:3198`. Each route/profile has three JSON reports under `reports/after/`. The server was built once and remained ready for the audits. Scores below show all three Performance results and their median; the other category scores were identical across the three runs for each profile.

| Route/profile | Performance runs (median) | Accessibility / Best Practices / SEO | LCP median (range) | FCP median (range) | Speed Index median (range) | TBT range | LCP TTFB range | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` mobile | 97 / 97 / 97 (97) | 100 / 96 / 100 | 2601 ms (2600–2612) | 858 ms (854–859) | 1027 ms (1011–1035) | 37–47 ms | 8–9 ms | 0.000 |
| `/` desktop | 85 / 85 / 85 (85) | 100 / 96 / 100 | 2590 ms (2546–2596) | 865 ms (859–865) | 984 ms (865–1024) | 36–86 ms | 7 ms | 0.000 |
| `/projects/drivewise` mobile | 98 / 98 / 98 (98) | 100 / 96 / 100 | 2373 ms (2369–2379) | 808 ms (805–808) | 808 ms (805–808) | 60–69 ms | 7–8 ms | 0.000 |
| `/projects/drivewise` desktop | 87 / 87 / 87 (87) | 100 / 96 / 100 | 2367 ms (2357–2377) | 811 ms (804–815) | 811 ms (804–815) | 48–68 ms | 8–12 ms | 0.000 |

Like-for-like median comparison against the pre-change three-run groups: homepage mobile Performance stayed 97 and LCP changed +54 ms; homepage desktop changed 86→85 (-1 point) and LCP +80 ms; Drivewise mobile stayed 98 and LCP +5 ms; Drivewise desktop stayed 87 and LCP +12 ms. No median difference exceeded the documented >2-point, >200 ms LCP, or >0.02 CLS investigation limits. CLS remained zero on every run. TBT and TTFB stayed low; the home desktop TBT range widened to 36–86 ms, without a corresponding score or LCP regression beyond those limits.

LCP candidates were `img.portrait-image` on all homepage runs, `.project-summary` on all Drivewise mobile runs, and `.project-detail-header h1` on all Drivewise desktop runs. Home report LCP breakdowns showed TTFB 7–9 ms, resource-load delay 106–119 ms, resource-load duration 4–5 ms, and element-render delay 88–149 ms. Drivewise reports exposed TTFB and element-render delay (mobile 71–97 ms; desktop 89–99 ms); resource-load subparts were not reported for those runs. The homepage portrait discovery audit did not report a high-priority hint or eager load. This is an existing Hero image loading characteristic, not evidence that motion caused the global desktop score gap; no change was made to Feature 002 media behavior.

Desktop Performance remains below the constitutional minimum: homepage 85 and Drivewise 87. Mobile Performance is 97 and 98; Accessibility, Best Practices, and SEO met their >=90 targets in all runs. The existing global desktop Performance release blocker remains open.

The Lighthouse network-requests audit measured homepage JavaScript at 505,807 decoded / 154,995 transferred bytes before and 507,750 / 155,588 bytes after (+1,943 decoded / +593 transferred). Drivewise changed from 476,433 / 145,205 to 478,376 / 145,798 bytes (+1,943 / +593). The replaced first-load chunk was 15,863 decoded / 4,621 transferred bytes before and 17,806 / 5,214 after. The current emitted chunk is 4,817 bytes when compressed with Node's built-in `gzipSync`; the old emitted baseline chunk was not retained, so an exact Node-gzip-to-Node-gzip delta cannot be reconstructed. The production network transfer delta (+593 bytes) is the available compressed-delivery comparison and stays below the planned 2 KiB incremental budget; the complete reports retain the underlying resource values. No mitigation was necessary.

No performance optimization was justified: score and LCP changes stayed below the documented regression thresholds, and no motion-caused bottleneck was demonstrated. The portrait's LCP discovery hints may merit separate, measured review under Feature 002/global performance remediation; they were not changed in Feature 006.

| Profile group | Post-change report files |
|---|---|
| `/` mobile | `home-mobile-1.json` through `home-mobile-3.json` |
| `/` desktop | `home-desktop-1.json` through `home-desktop-3.json` |
| `/projects/drivewise` mobile | `drivewise-mobile-1.json` through `drivewise-mobile-3.json` |
| `/projects/drivewise` desktop | `drivewise-desktop-1.json` through `drivewise-desktop-3.json` |

Build once for the audit set, then start an isolated production server on a verified unused local port (example 3198):

```powershell
npm.cmd run build
npm.cmd run start -- --hostname 127.0.0.1 --port 3198
```

In a separate terminal, run at least three audits per route and profile. The mobile command example is:

```powershell
npm.cmd exec lighthouse -- http://127.0.0.1:3198/ --output=json --output-path=./specs/006-motion-visual-polish/reports/baseline/home-mobile-1.json --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --screenEmulation.mobile --screenEmulation.width=412 --screenEmulation.height=823 --screenEmulation.deviceScaleFactor=1.75 --throttling-method=simulate --throttling.rttMs=150 --throttling.throughputKbps=1638.4 --throttling.requestLatencyMs=562.5 --throttling.downloadThroughputKbps=1474.56 --throttling.uploadThroughputKbps=675 --throttling.cpuSlowdownMultiplier=4 --chrome-path="C:\Program Files\Google\Chrome\Application\chrome.exe" --quiet
```

For the other route use `http://127.0.0.1:3198/projects/drivewise`. Repeat with unique report filenames for runs 2 and 3. For desktop, use the same command with `--form-factor=desktop`, a distinct `*-desktop-*.json` report path, and the 1440x900/DPR1 profile. Keep the documented Lighthouse throttling settings identical; confirm each report's `configSettings`, browser version, and viewport before including it.

After implementation, repeat the same six route/profile measurements at least three times against one already-ready production server and the same built output. Record Performance, Accessibility, Best Practices, SEO, LCP, CLS, TBT, LCP element/subparts, and run-to-run variance. Compare medians against the pre-change three-run groups. Investigate >2 Performance points, >200 ms LCP, or >0.02 CLS median regression. A score below 90 remains below the constitutional target even when it is not a Feature 006 regression. Lab data does not establish field INP.

| Route/profile | Pre-change runs / median | Post-change runs / median | Regression review |
|---|---|---|---|
| `/` mobile | 3 runs; Performance 97; LCP 2547 ms; CLS 0.000 | 3 runs; Performance 97; LCP 2601 ms; CLS 0.000 | No material regression; +54 ms LCP |
| `/` desktop | 3 runs; Performance 86; LCP 2510 ms; CLS 0.000 | 3 runs; Performance 85; LCP 2590 ms; CLS 0.000 | No material regression; -1 point / +80 ms LCP; target remains unmet |
| `/projects/drivewise` mobile | 3 runs; Performance 98; LCP 2368 ms; CLS 0.000 | 3 runs; Performance 98; LCP 2373 ms; CLS 0.000 | No material regression; +5 ms LCP |
| `/projects/drivewise` desktop | 3 runs; Performance 87; LCP 2355 ms; CLS 0.000 | 3 runs; Performance 87; LCP 2367 ms; CLS 0.000 | No material regression; +12 ms LCP; target remains unmet |

## Existing Release Checks

Feature 004 manual accessibility reviews and Feature 005 T027, T032–T035, T039 remain open under their original task ownership. Feature 006 verification must not mark them complete, replace their evidence, or claim the existing desktop Performance shortfall is resolved. Record Feature 006-specific findings separately.

## Feature 006 Manual Reviews and Release Status

As of 2026-11-05, no human manual review evidence was recorded for Feature 006. Keep these tasks unchecked:

- **T034 — Visual review:** compare the captured before/after Hero, About, Projects, Experience, Education, Skills, Contact, Footer, and project-detail views at 375x812 and 1440x900. Record the reviewer, browser/date, motion hierarchy, clipping/overflow, readability, and findings.
- **T035 — Manual accessibility/input review:** perform keyboard/focus-order and visible-focus review, screen-reader reading, contrast/visual-state review, touch use without hover, and reduced-motion review. Record the reviewer, browser/device/assistive technology, exact steps, results, and remaining defects. Automated Playwright and Axe results are not manual evidence.
- **T036 — Actual browser zoom:** use Chrome's browser Zoom menu at an actual displayed 200% on the homepage and a project-detail page at narrow and desktop window sizes. Record Chrome version, displayed zoom, window dimensions, reflow, overflow, clipping, focus, and reachable controls. Viewport resizing and device scale factor are not substitutes.

T040 final acceptance closure remains pending because its declared dependency includes manual tasks T034–T036. Feature 006 implementation and automated verification are complete, but production release is not approved: desktop Lighthouse Performance medians remain 85 and 87, and all three manual reviews remain open. Existing Feature 004/005 release tasks continue under their original ownership.