# Quickstart and Validation: Portfolio Foundation

**Feature**: [Portfolio Foundation](./spec.md)  
**Plan**: [Implementation Plan](./plan.md)

## Prerequisites

- Node.js 22 LTS and npm 10 (implementation was run with Node 22.21.0 and npm 10.9.4).
- Install locked dependencies with `npm.cmd ci` in PowerShell.
- Install the Playwright browser once with `npx playwright install chromium`.
- Vercel access is needed only for a Preview deployment review.

If npm cannot read its user-level cache, preserve the lockfile and use an isolated project cache outside `node_modules`:

```powershell
$projectNpmCache = Join-Path $PWD '.npm-cache-recovery'
npm.cmd ci --cache $projectNpmCache
```

No application environment variables are required. Public profile and navigation data belongs in local typed content; never add private credentials or secrets.

## Local development

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the URL reported by Next.js. Replace the editable placeholder profile in `src/content/profile.ts` with verified information before publishing. About, Portfolio, and Contact remain titled placeholders in this feature.

## Quality checks

```powershell
npm.cmd run lint
npm.cmd run format:check
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Build before E2E. `npm.cmd run test:e2e` reuses a responding portfolio server at `127.0.0.1:3000`; otherwise it starts the production server from `.next`, runs Playwright, and stops only the server process it started. If another app occupies the port, set `PLAYWRIGHT_BASE_URL` to an available local URL (for example, `http://127.0.0.1:3001`) to test against an isolated production server. The runner does not stop a server it did not start and requires a successful production build.

Implementation verification on 2026-10-21:

- ESLint, Prettier check, strict TypeScript, Vitest, Playwright, axe, and production build passed.
- Vitest: 5 files, 8 tests passed.
- Playwright Chromium: 13 tests passed with a clean runner exit, including axe scans, no-JavaScript navigation, hash/history state, lazy-loaded mobile menu behavior, and overflow at 320, 375, 768, 1024, 1440, and 1920 CSS pixels.
- Both axe page scans reported zero violations for the tested WCAG 2.2 A/AA tags.

## Lighthouse and Core Web Vitals record

The following lab runs measured the optimized local production build at `http://127.0.0.1:3000` on 2026-10-21. Lighthouse 13.5.0 used Chromium 156.0.8078.4 and simulated throttling. Mobile used a 412 × 823 emulated viewport, DPR 1.75, 4× CPU slowdown, 150 ms RTT and approximately 1.64 Mbps download. Desktop used a 1440 × 900 emulated viewport, DPR 1, and the same simulated network/CPU profile. Scores are percentages; LCP is lab-measured. The desktop run was repeated once because its Performance score was below target.

| Profile | Performance | Accessibility | Best Practices | SEO | Lab LCP | Lab CLS |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 96 | 100 | 96 | 100 | 2.583 s | 0.066 |
| Desktop, run 1 | 85 | 100 | 96 | 100 | 2.546 s | 0.000 |
| Desktop, repeat | 86 | 100 | 96 | 100 | 2.530 s | 0.000 |

Lighthouse JSON evidence is retained in [reports](./reports/). Both CLS measurements are within the 0.1 target. Mobile Performance exceeds 90; desktop Performance is below the 90 goal, and both LCP profiles remain slightly above the 2.5 s target (the desktop repeat is 2.530 s). These are open performance gaps, not passed criteria. Tune and repeat the runs before treating the Lighthouse/Core Web Vitals goals as satisfied.

### Post-optimization verification

After deferring the mobile dialog/animation bundle until the menu is opened and using an optional local-font swap, Lighthouse 13.5.0 was rerun against the production build on 2026-10-21 with Chrome 155.0.8059.85. The same simulated 150 ms RTT, approximately 1.64 Mbps download, 675 Kbps upload, and 4× CPU slowdown were used. Profiles were mobile 412 × 823 at DPR 1.75 and desktop 1440 × 900 at DPR 1.

| Profile | Performance | Accessibility | Best Practices | SEO | Lab LCP | Lab CLS |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 97 | 100 | 96 | 100 | 2.381 s | 0.066 |
| Desktop | 87 | 100 | 96 | 100 | 2.362 s | 0.000 |

The final mobile profile meets the four Lighthouse category goals and the lab LCP/CLS targets. Desktop Accessibility, Best Practices, and SEO meet their goals; desktop Performance remains below 90. Both final LCP values are at most 2.5 s and both CLS values are at most 0.1. The desktop Performance gap remains open; the scores are reported as measured. Final JSON evidence: [mobile](./reports/lighthouse-final-mobile-2026-10-21.json) and [desktop](./reports/lighthouse-final-desktop-2026-10-21.json). The earlier runs above are retained as the pre-optimization baseline.

Field INP is **not yet measurable** because the new site has no sufficient real-user dataset. No field-data target is claimed as passed. Lab interaction metrics are not a substitute for field INP.

## Final performance refinement (2026-11-02)

Lighthouse 13.5.0 with Chrome 156.0.0.0 measured the optimized production build on the documented simulated profiles. Desktop used 1440 by 900 at DPR 1; mobile used 412 by 823 at DPR 1.75. Both used 4x CPU slowdown, 150 ms RTT, 1638.4 Kbps throughput, 1474.56 Kbps download and 675 Kbps upload.

| Run | Profile | Performance | Accessibility | Best Practices | SEO | FCP | Lab LCP | TBT | Lab CLS | Script transfer / requests | Total transfer |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Refinement baseline | Desktop | 87 | 100 | 96 | 100 | 0.780 s | 2.399 s | 69 ms | 0.000 | 153,056 B / 8 | 214,608 B |
| Final refinement | Desktop | 89 | 100 | 96 | 100 | 0.679 s | 2.237 s | 58 ms | 0.000 | 139,897 B / 7 | 199,047 B |
| Final refinement | Mobile | 98 | 100 | 96 | 100 | 0.667 s | 2.226 s | 53 ms | 0.066 | 139,897 B / 7 | 199,047 B |

The desktop score improved by two points and lab LCP by 162 ms; mobile Performance remains above target. Desktop Performance is 89, below the constitution target of 90. Desktop and mobile lab LCP and CLS meet their numeric targets. Field INP remains not yet measurable.

The baseline report identified a 5,326-byte render-blocking stylesheet with an estimated 110 ms opportunity, 29 KiB of unused JavaScript with an estimated 400 ms opportunity, and 14 KiB of legacy JavaScript. The largest-contentful element was the hero role text. A 119 ms task in the shared Next.js chunk ended at the measured baseline LCP; the trace identifies the chunk but not a function-level cause, so this timing is recorded as a correlation. The page made no image requests, and Lighthouse reported no font-display issue; the local 48,556-byte font was retained to preserve the visual design.

The refinement enables Next.js `experimental.inlineCss`, removing the CSS request and the render-blocking insight; the build explicitly warns that this option is experimental. The tradeoff is that CSS is inlined into the document instead of separately cached. The navigation is server-rendered and uses native same-page anchors plus a native modal `<dialog>`; a small enhancement component initializes after React hydration to synchronize `aria-current`, hash/history state, and destination focus. This preserves working server-rendered links when JavaScript is unavailable and prevents pre-hydration DOM mutation. The final trace still reports a 108 ms task in the shared Next.js chunk at LCP and estimates 55 KiB of unused JavaScript, so the Performance score gap remains open. No unsupported claim is made that the navigation change alone caused the score improvement.

Evidence: [baseline desktop report](./reports/lighthouse-refinement-baseline-desktop-2026-11-02.json), [final desktop report](./reports/lighthouse-refinement-final-desktop-2026-11-02.json), [final mobile report](./reports/lighthouse-refinement-final-mobile-2026-11-02.json). Intermediate diagnostic runs are retained in the same reports folder.

To reproduce the desktop profile after `npm.cmd run build` and starting the production server at `127.0.0.1:3000`:

```powershell
npm.cmd exec lighthouse -- http://127.0.0.1:3000 --output=json --output-path=./desktop-lighthouse.json --only-categories=performance,accessibility,best-practices,seo --form-factor=desktop --screenEmulation.mobile=false --screenEmulation.width=1440 --screenEmulation.height=900 --screenEmulation.deviceScaleFactor=1 --throttling-method=simulate --throttling.rttMs=150 --throttling.throughputKbps=1638.4 --throttling.cpuSlowdownMultiplier=4 --throttling.requestLatencyMs=562.5 --throttling.downloadThroughputKbps=1474.56 --throttling.uploadThroughputKbps=675 --chrome-path='C:\Program Files\Google\Chrome\Application\chrome.exe' --quiet
```

To repeat after building and starting the production app, use the same Lighthouse major version and Chromium build, preserve the profiles above, and write new JSON reports:

```powershell
npm.cmd run build
npm.cmd run start
npm.cmd exec lighthouse -- http://127.0.0.1:3000 --output=json --output-path=./lighthouse-mobile.json --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile
npm.cmd exec lighthouse -- http://127.0.0.1:3000 --output=json --output-path=./lighthouse-desktop.json --only-categories=performance,accessibility,best-practices,seo --form-factor=desktop --screenEmulation.mobile=false --screenEmulation.width=1440 --screenEmulation.height=900 --screenEmulation.deviceScaleFactor=1
```

Use a local Chrome/Chromium executable compatible with the installed Lighthouse version; add `--chrome-path="<path>"` if it is not auto-detected. Record the Lighthouse version, browser version, viewport/device and throttling settings alongside every new run.

## Manual accessibility review record

Automated axe checks passed. A partial manual review was performed in the Codex In-app Browser on 2026-10-21 at 1440 by 900 and 375 by 812, before the 2026-11-02 change from a React dialog to the native dialog. The browser accessibility tree was available; no screen-reader application was available for spoken-output verification. Those manual observations are historical and do not verify the final native-dialog implementation. Recheck the final UI using the steps below; no manual checks are being marked complete for this refinement.

| Review area | Findings | Remediation status |
|---|---|---|
| Keyboard-only navigation | Skip link, page navigation, and the prior React menu were sampled; final native dialog has not been manually reviewed | Historical observation only; final menu and footer traversal pending |
| Visible focus indicators | A 3px gold focus outline was visible in the prior browser review; the shared focus token remains #f4c95d | Historical observation only; retest the final native dialog and all controls |
| Screen-reader accessible names | Prior browser accessibility tree exposed named navigation and controls; spoken output was not tested | Pending screen-reader verification on the final implementation |
| Mobile menu expanded/collapsed states | Prior React dialog opened and closed with focus handling; final native dialog has automated coverage but no manual review | Pending manual check on the final implementation |
| Text and interactive-control contrast | Prior WCAG ratios: muted text #aab2c3 on canvas #080a10 is 9.30:1; accent #8095ff on canvas is 7.22:1; accent text #a6b4ff on canvas is 9.98:1; primary button text #0b1025 on #8095ff is 6.87:1 | Prior samples only; recheck mobile dialog, active, hover, and focus combinations |
| 200% browser zoom | Browser zoom shortcut was unavailable in the in-app browser; no 200% zoom result is claimed | Pending manual browser review |
| Reduced-motion preferences | Playwright reduced-motion navigation test passes; the browser review did not expose a preference toggle | Pending manual preference review |
| Browser, assistive technology, viewport, date | Codex In-app Browser accessibility tree; 1440 by 900 and 375 by 812; 2026-10-21; no screen-reader application | Historical context only; record a new context for the final review |
| Contrast method and state combinations | WCAG sRGB contrast formula applied to computed foreground/background colors for body, accent/role, focus outline, and primary button | Sampled method and combinations recorded; complete state inventory pending |

### Reproducible steps for the outstanding manual review

The remaining manual checks are **pending**. These steps prepare the review; they are not evidence that it has been completed.

1. Start the production build with `npm.cmd run build` and `npm.cmd run start`, then use a current Chrome or Edge browser. Record browser version, Windows version, viewport, date, and any assistive-technology version.
2. **Keyboard-only:** At desktop width, reload and press Tab from the browser chrome. Confirm the skip link appears first, every visible link and control receives a visible focus outline, and focus follows the page order. At 375 CSS pixels, Tab to the Open menu button and activate it with Enter and Space in separate runs. Confirm focus enters the named dialog, Tab and Shift+Tab remain inside it, Escape closes it and returns focus to the trigger, and the Close menu button does the same. Reopen it, select About, and confirm the URL is #about and focus moves to the About heading.
3. **Screen reader names and states:** With NVDA and Chrome or Firefox, or Narrator and Edge, inspect the Landmarks and Headings lists. Confirm the visible primary navigation is named Primary, the open modal is named Primary navigation, the trigger is announced as a button with collapsed or expanded state, and the close control has the name Close menu. Move to each navigation destination and confirm its link name and current-location announcement. Record screen-reader and browser versions.
4. **Contrast:** Use a WCAG contrast analyzer or browser DevTools computed colors. Check normal text, large hero/section text, muted copy, active and inactive navigation, hover and focus states, the primary button label/background, the menu close icon, mobile panel links, and panel CTA. Record each foreground/background pair and ratio; require 4.5:1 for normal text and 3:1 for large text and meaningful controls/graphics as applicable.
5. **200% zoom:** Set browser page zoom to exactly 200%, then inspect the hero, desktop/mobile navigation transition, each section, footer, and the open mobile dialog. Confirm text and controls remain visible, focus is not clipped, the dialog can scroll when needed, and there is no page-level horizontal scrolling. Record viewport and zoom level.
6. **Reduced motion:** Enable Windows Settings > Accessibility > Visual effects > Animation effects off, or emulate prefers-reduced-motion: reduce in DevTools Rendering. Reload, open and close the mobile dialog, and follow a section link. Confirm navigation still works and the panel transition is removed or reduced.
7. Record pass/fail and evidence for each step in the table above, fix any failures, and rerun affected automated checks. Keep T037/T042 open until this review is actually performed and all findings are resolved.

## Optional visitor review

SC-001 and SC-006 are qualitative goals, not release gates. No representative visitors were available during implementation, so this optional review was not conducted. If reviewers are available, show the page without coaching and ask them to identify the professional role, find a clear next action within 10 seconds, and explain the four primary navigation labels. Record observations here.

## Production-like review

No Vercel project link, CLI, or Preview deployment is available in this workspace (`.vercel/project.json` is absent). No deployment was attempted. Before release, connect the repository to the intended Vercel project, use the Next.js preset and repository root, create a Preview deployment, and review required widths, keyboard use, reduced motion, and JavaScript-disabled navigation. Confirm final personal content is verified before promotion. Record the Preview URL and review result here.
