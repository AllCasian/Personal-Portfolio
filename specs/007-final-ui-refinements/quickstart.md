# Feature 007 Verification Guide

This guide is for the implementation phase. It records commands, reproducible checks, and manual evidence required to verify Feature 007. It does not represent implementation or test results.

## Preconditions and Scope

- Use the isolated worktree `C:/All/Projects/personal-portfolio/.worktrees/feature-007-final-ui-refinements` on `feature/007-final-ui-refinements`.
- Do not transfer uncommitted changes from the original checkout. The Feature 006 implementation is present in this worktree already.
- Keep changes within Feature 007 integration scope. Preserve publication checks, all seven navigation destinations, six project routes, and Feature 006 reveal/motion behavior.
- Do not create a CV placeholder. The repository has no approved CV asset; the Download CV action is expected to be absent.

## Before-Change Baseline (2026-11-05)

The baseline was collected before any Feature 007 application-source edits. The worktree was on `feature/007-final-ui-refinements`; build source revision: `2d9d9e7c4e5051e9193641d3d14e3364aa943ea7`. The production build completed successfully and generated the homepage and all six project detail routes. Baseline Playwright: 72 passed. Static checks: TypeScript, ESLint, Prettier, and Vitest passed (28 files / 89 tests).

Playwright captured full-page reference screenshots at 375×812 and 1440×900 for `/` and `/projects/drivewise`; these include the Hero, navbar, and Contact/Footer where present. Files are in `specs/007-final-ui-refinements/reports/before/`. They are reference evidence only, not human visual approval.

Lighthouse 13.5.0 ran against one unchanged production build and one already-ready server lifecycle at `http://127.0.0.1:3198`. Chrome was 156.0.8078.49. The 12 audits ran sequentially. Mobile emulation: 412×823 CSS px, DPR 1.75, mobile user agent. Desktop emulation: 1440×900 CSS px, DPR 1, desktop user agent. Both used the Feature 006 documented provided throttling values (RTT 150 ms; throughput 1638.4 Kbps; request latency 562.5 ms; download 1474.56 Kbps; upload 675 Kbps; CPU slowdown 4×). Local output reports were fully written; the CLI process was stopped after report completion because it remained running after saving the JSON. A failed preliminary desktop invocation with mismatched mobile emulation settings produced no report and is excluded.

| Route/profile | Performance (3 runs) | Accessibility | Best Practices | SEO | LCP median (range) | CLS | TBT | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` mobile | 100 / 100 / 100 | 100 | 96 | 100 | 251 ms (246–255) | 0 | 0 ms | 252,351 B |
| `/` desktop | 100 / 100 / 100 | 100 | 96 | 100 | 301 ms (300–316) | 0 | 0 ms | 252,351 B |
| `/projects/drivewise` mobile | 100 / 100 / 100 | 100 | 96 | 100 | 86 ms (86–96) | 0 | 0 ms | 222,337 B |
| `/projects/drivewise` desktop | 100 / 100 / 100 | 100 | 96 | 100 | 94 ms (84–109) | 0 | 0 ms | 222,337 B |

Per-run JSON is saved in `specs/007-final-ui-refinements/reports/baseline/`. Lighthouse reports TBT in milliseconds and transfer size as total byte weight. These are the Feature 007 comparison baseline under the exact settings above; the older Feature 006 scores are historical context and are not mixed into these measurements. No baseline application source was changed.

## Implementation Evidence

Hero glyph inspection at 1440×900 found `.hero-role` at `font-size: 102.24px` with `line-height: 101.218px` (0.99). A browser text-range measurement for the lowercase `g` extended 10.8px below the role element's line box. At 375×812, the role was 48.75px with a 48.2625px line-height, and the measured `g` range extended 4.75px below its box. The role, heading, Hero copy, section, and page ancestors had visible overflow, no clipping path, and no fixed role/heading height. The role's screenshot visibly cut the descender at the line box; a test-only `line-height: 1.1` probe restored its visible tail. This identifies the overly tight line-height as the cause; the fix is limited to the existing `.hero-role` line-height and preserves its font size, font family, gradient, and entrance animation. Before/probe screenshots are under `reports/before/hero-role-desktop*.png`; mobile normal/reduced-motion references are under `reports/before/hero-role-mobile*.png`.

Navigation browser verification passed 19 Playwright tests and the focused navigation unit suite passed 6 tests. This includes the 16/64/12px visibility thresholds, direction reversal, mobile viewport and focus recovery, direct anchor/history reveal, reduced-motion transition behavior, unchanged active state, all seven destinations, and no-JavaScript operation. The initial no-JavaScript fallback used a fixed overlay that intercepted Hero links; it now provides normal-flow links inside `<noscript>`, matching the Feature 007 specification and keeping both navigation and page actions usable without JavaScript while preventing a hydration layout shift.

## Automated Quality Commands

Run from the worktree root after implementation:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run format:check
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
```

Expected evidence:

- TypeScript, ESLint, Prettier, Vitest, Playwright, Axe, and production build complete without Feature 007 regressions.
- Projection tests prove that draft records, unverified fields, and unapproved fields are excluded, including Instagram and optional CV. Exercise fixtures through `projectPublicContact` and actual Hero/Contact renderers; assert private sentinels and review metadata do not occur in HTML or serialized output.
- UI tests assert one mailto Email action, no Copy Email UI, exact eligible GitHub/LinkedIn/Instagram links and external security attributes, no CV control, and the unchanged minimal Footer.
- Navigation tests assert 16px top visibility, >64px departure gate, 12px directional movement, reversals below threshold, short-page behavior, focus recovery, expanded-menu lock, hash/history reveal and target clearance, active-state/hash invariants, and no-JS link usability.
- Responsive assertions cover 320, 375, 390, 768, 1024, 1440, and 1920 CSS px; these assertions do not substitute for actual browser zoom.
- Route regression checks preserve all six project-detail routes and Portfolio as the current destination on details.

## Hero and Responsive Visual Checks

Automated screenshot/bounds assertions are supplemental; record human inspection separately.

1. Inspect `/` at 320, 375, 390, 768, 1024, 1440, and 1920 CSS px.
2. Confirm Hero name/role/description/actions and Contact heading/actions are balanced on narrow screens; long descriptions, timeline details, technical content, and project prose remain readability-aligned.
3. Inspect the navbar portrait on `/` and `/projects/drivewise`. Confirm the same `/images/me1-2.jpg` source, circular crop, stable geometry, correct accessible home-link name, and no distortion.
4. Inspect the full Hero role and descenders `g`, `j`, `p`, `q`, `y` with motion enabled and `prefers-reduced-motion: reduce`. Capture computed styles and compare glyph bounds before/after the correction.
5. Confirm `.hero-index`/“01 INTRODUCTION” is absent, while About heading, `#about`, content, and links remain intact.
6. Confirm action wrapping and focus outlines do not clip or overflow at 320px.

## Navbar Browser Scenarios

1. At page top, confirm header is visible.
2. On a scrollable page, move below 64 CSS px and downward by 11px; confirm it stays visible. Move a further qualifying pixel (12px total for the direction baseline) and confirm it hides only after the specified thresholds.
3. Reverse direction by less than 12px; confirm there is no visibility toggle. Continue upward to 12px and confirm the header returns and stays visible until a later qualifying downward movement.
4. Repeat with pointer/touch and keyboard. Tab to a nav control while the header is hidden; verify it becomes visible before focus is stranded. Expand the mobile dialog and scroll; verify header/menu access persists.
5. Activate a section link and use browser Back/Forward. Confirm header visibility, target heading clearance, hash/history active state, and no passive-scroll active-state changes.
6. Confirm a short page remains visible and project details keep Portfolio current.
7. Disable JavaScript and confirm header/nav links stay in normal flow and work without a visibility state.
8. Enable reduced motion and confirm visibility remains operable with no decorative slide.

## Accessibility and Actual 200% Browser Zoom

Run Axe in the existing Playwright suite, then perform and record human checks separately:

- Keyboard-only through skip link, navbar, Hero actions, Contact actions, project links, and Footer; check visible focus and no focus trapped offscreen.
- Screen-reader names and landmarks for portrait home link, nav, all labeled actions, and Contact/Footer. Verify icons are decorative where visible text already names an action.
- Contrast in default, hover, focus, active, and reduced-motion states.
- Touch operation without hover-dependent information; check targets remain practical.
- Reduced-motion visual review for navbar and existing Feature 006 motion.
- Actual Chrome browser Zoom menu at 200% on `/` and `/projects/drivewise`. Record Chrome version, displayed zoom, window dimensions, route, no overflow/clipping, target visibility, and focus reachability. Do not use DPR, OS scaling, CSS zoom, or viewport shrink as a substitute.

## Publication Safety

- Use test-only source records with private sentinel values for owner, email, and social destinations; vary record status and field verification/approval independently.
- Run each fixture through the real server-side contact projection and the Hero/Contact render path. Ensure only approved projected values render, metadata is absent, and the eligible email still uses mailto.
- Check private sentinels do not appear in server-rendered HTML, Next serialized output, client props/assets, or production artifacts. Test fixtures must not be included in production content or exposed through a public route.
- Keep production artifact scanning as a second independent check; a scan without sentinel input is not evidence that the projection boundary filters sentinels.

## Production Lighthouse Comparison

The comparable Feature 006 profile is documented in `specs/006-motion-visual-polish/quickstart.md`. Use it unchanged before the first Feature 007 source edit and after implementation:

| Profile | CSS viewport | DPR | Network simulation | CPU slowdown |
|---|---:|---:|---|---:|
| Mobile | 412×823 | 1.75 | RTT 150ms; throughput 1638.4 Kbps; request latency 562.5ms; download 1474.56 Kbps; upload 675 Kbps | 4× |
| Desktop | 1440×900 | 1 | Same simulated settings | 4× |

Use Lighthouse 13.5.0 and Chrome 156.0.8078.49 when available, one production build per comparison set, and one already-ready isolated production server lifecycle. Collect at least three runs for each combination:

- `/` mobile
- `/` desktop
- `/projects/drivewise` mobile
- `/projects/drivewise` desktop

Record all four Lighthouse categories, LCP, CLS, TBT, transfer bytes, browser/tool versions, build identity, server lifecycle, run order, median/range, and any failures. Save JSON under `specs/007-final-ui-refinements/reports/` if a report directory is added by implementation. Compare medians against the new pre-change measurements, not undocumented historical values.

Historical Feature 006 results were Home mobile Performance 97 / desktop 85 and Drivewise mobile 98 / desktop 87. These desktop scores remain below the >=90 constitutional target and are existing global release debt. The historical scores are context only; they are not a substitute for the Feature 007 before-change baseline. Report Feature 007 regression separately from the global target status. Do not claim desktop compliance unless current comparable measured results meet 90.

## Feature 007 Implementation and Final Verification

The worktree was at repository HEAD `2d9d9e7` with Feature 007 changes uncommitted; the measured build includes those worktree changes and was built with Next.js 16.4.2. Chrome 156.0.8078.49 and Lighthouse 13.5.0 were used. The same production build and ready server on `127.0.0.1:3200` served all post-change audits. Audits ran sequentially with the exact mobile/desktop viewport, network, CPU, and user-agent settings recorded above. Individual post-change JSON reports are in `reports/after/`.

Final before/after human-review materials are available as screenshot pairs under `reports/before/` and `reports/after/`: home and Drivewise at 375x812 and 1440x900. These screenshots prepare comparison but do not count as completed human visual acceptance.

| Route/profile | Performance (3 runs) | Accessibility | Best Practices | SEO | LCP median (range) | CLS | TBT | TTFB median (range) | Transfer (baseline -> after) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` mobile | 100 / 100 / 100 | 100 | 96 | 100 | 205 ms (185-228) | 0 | 0 ms | 9 ms (7-66) | 252,351 -> 246,497 B |
| `/` desktop | 100 / 100 / 100 | 100 | 96 | 100 | 254 ms (249-254) | 0 | 0 ms | 7 ms (6-10) | 252,351 -> 245,618 B |
| `/projects/drivewise` mobile | 100 / 100 / 100 | 100 | 96 | 100 | 92 ms (86-93) | 0 | 0 ms | 7 ms (6-17) | 222,337 -> 225,400 B |
| `/projects/drivewise` desktop | 100 / 100 / 100 | 100 | 96 | 100 | 94 ms (92-97) | 0 | 0 ms | 6 ms (5-6) | 222,337 -> 224,521 B |

All four profiles meet their measured Lighthouse category scores in this controlled run set. This does not change the constitutional >=90 targets or establish scores for other routes/devices. The Feature 006 historical desktop Performance results (85 homepage, 87 Drivewise) remain unresolved global release debt; they are not substituted for this comparable Feature 007 evidence.

The first final-profile diagnostic found a repeatable mobile CLS of 0.053 from the no-JavaScript navigation fallback row collapsing after hydration (the earlier, taller wrapping fallback measured 0.115). The final fallback is inside `<noscript>`: JavaScript-enabled browsers do not lay out that row, while JavaScript-disabled mobile browsers retain usable normal-flow navigation links. On the final build, all three mobile runs on both routes and all desktop runs measured CLS 0. This removes the measured Feature 007 layout shift without removing the no-JavaScript navigation fallback.

Final automated evidence: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test` (30 files, 99 tests), `npm.cmd run build`, and `npm.cmd run test:e2e` (81 Playwright tests including Axe and production publication sentinel coverage) passed. The normal production output scan is separate from test-only sentinel records; the sentinel records were passed through the real projection and Server Component render boundary and did not leak. `git diff --check` passed; the accompanying status review includes untracked Feature 007 docs and report artifacts because `git diff --check` does not inspect untracked files.

## Outstanding Manual Acceptance

Feature 007 tasks T039-T043 remain open until a reviewer records genuine evidence:

- T039: Compare before/after desktop and mobile visuals, including Hero descenders and the action groups.
- T040: In Chrome, use the browser menu to set actual zoom to 200% on `/` and `/projects/drivewise`; record browser version, displayed zoom, dimensions, clipping/overflow, target reachability, and focus behavior. Viewport resizing and DPR changes do not count.
- T041: Complete keyboard-only navigation and focus-recovery review.
- T042: Verify screen-reader names/landmarks and contrast in default, hover, focus, active, and reduced-motion states.
- T043: Review touch use and reduced-motion appearance on a real or representative touch device.

Record reviewer, date, browser/device/assistive technology, route, actual zoom or input mode, procedure, result, and unresolved issues. These checks are not claimed complete from automated screenshots or assertions.

## Manual Evidence Record

For each manual review, capture reviewer, date, browser/device/assistive technology, route, viewport or actual zoom, preference/input mode, steps performed, observed result, and unresolved issues. Keep automated results and human acceptance separate. Existing Feature 004/005/006 release checks retain their original task ownership and are not closed by this feature.
