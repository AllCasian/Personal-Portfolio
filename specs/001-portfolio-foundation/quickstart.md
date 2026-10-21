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

Build before E2E. `npm.cmd run test:e2e` reuses a responding portfolio server at `127.0.0.1:3000`; otherwise it starts the production server from `.next`, runs Playwright, and stops only the server process it started. If another app occupies the port, the runner fails without stopping it. The runner requires a successful production build.

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

To repeat after building and starting the production app, use the same Lighthouse major version and Chromium build, preserve the profiles above, and write new JSON reports:

```powershell
npm.cmd run build
npm.cmd run start
npm.cmd exec lighthouse -- http://127.0.0.1:3000 --output=json --output-path=./lighthouse-mobile.json --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile
npm.cmd exec lighthouse -- http://127.0.0.1:3000 --output=json --output-path=./lighthouse-desktop.json --only-categories=performance,accessibility,best-practices,seo --form-factor=desktop --screenEmulation.mobile=false --screenEmulation.width=1440 --screenEmulation.height=900 --screenEmulation.deviceScaleFactor=1
```

Use a local Chrome/Chromium executable compatible with the installed Lighthouse version; add `--chrome-path="<path>"` if it is not auto-detected. Record the Lighthouse version, browser version, viewport/device and throttling settings alongside every new run.

## Manual accessibility review record

Automated axe checks passed. A partial manual review was performed in the Codex In-app Browser on 2026-10-21 at 1440 × 900 and 375 × 812. The browser accessibility tree was available; no screen-reader application was available for spoken-output verification. Keyboard focus, menu states, and sampled contrast were reviewed directly. The remaining screen-reader, 200% zoom, and manual reduced-motion reviews remain open.

| Review area | Findings | Remediation status |
|---|---|---|
| Keyboard-only navigation | Manually followed skip link, brand, primary links, mobile menu controls, and destination focus | Reviewed in browser; footer keyboard pass still needs confirmation |
| Visible focus indicators | A 3px gold focus outline was visible on desktop and mobile controls | Reviewed; measured focus color #f4c95d is 12.59:1 against the canvas |
| Screen-reader accessible names | Browser accessibility tree exposed named primary navigation, menu controls, links, and section headings; spoken output not tested | Pending screen-reader verification |
| Mobile menu expanded/collapsed states | Menu opened, focus entered and remained in the dialog, Escape and explicit close returned focus, and destination selection focused its heading | Reviewed in browser and covered by automated tests |
| Text and interactive-control contrast | Computed sRGB/WCAG contrast ratios: muted text #aab2c3 on canvas #080a10 is 9.30:1; accent #8095ff on canvas is 7.22:1; accent text #a6b4ff on canvas is 9.98:1; primary button text #0b1025 on #8095ff is 6.87:1 | Sampled combinations exceed applicable AA thresholds; full state-by-state review pending |
| 200% browser zoom | Browser zoom shortcut was unavailable in the in-app browser; no 200% zoom result is claimed | Pending manual browser review |
| Reduced-motion preferences | Playwright reduced-motion navigation test passes; the browser review did not expose a preference toggle | Pending manual preference review |
| Browser, assistive technology, viewport, date | Codex In-app Browser accessibility tree; 1440 × 900 and 375 × 812; 2026-10-21; no screen-reader application | Partial context recorded |
| Contrast method and state combinations | WCAG sRGB contrast formula applied to computed foreground/background colors for body, accent/role, focus outline, and primary button | Sampled method and combinations recorded; complete state inventory pending |

## Optional visitor review

SC-001 and SC-006 are qualitative goals, not release gates. No representative visitors were available during implementation, so this optional review was not conducted. If reviewers are available, show the page without coaching and ask them to identify the professional role, find a clear next action within 10 seconds, and explain the four primary navigation labels. Record observations here.

## Production-like review

No Vercel project link, CLI, or Preview deployment is available in this workspace (`.vercel/project.json` is absent). No deployment was attempted. Before release, connect the repository to the intended Vercel project, use the Next.js preset and repository root, create a Preview deployment, and review required widths, keyboard use, reduced motion, and JavaScript-disabled navigation. Confirm final personal content is verified before promotion. Record the Preview URL and review result here.
