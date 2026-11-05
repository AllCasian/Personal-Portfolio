# Implementation Plan: Final UI Refinements, Responsive Navigation & Social Actions

**Branch**: `feature/007-final-ui-refinements` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification and checklist in `specs/007-final-ui-refinements/`.

## Summary

Apply the requested refinements to the existing portfolio using the current server-rendered components, contact publication projection, navigation enhancer, CSS design tokens, and test suites. Reuse the Hero portrait in the existing header brand link; extend the current navigation enhancement lifecycle with a separate, passive scroll-visibility state; make targeted mobile alignment and Hero glyph corrections; remove the decorative Hero index label; and share a server-rendered pill-action presentation between Hero and Contact. The optional CV action remains absent until an actual document is approved. The Contact UI loses Copy Email, while its approved email data and publication checks remain in place.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19, Next.js 16 App Router.

**Primary Dependencies**: Existing Next.js, Tailwind CSS 4, `lucide-react`, Vitest 5, Playwright 1.64, Axe; no new dependencies proposed.

**Storage**: TypeScript content modules; public contact fields are produced by the existing server-side projection.

**Testing**: Vitest component/library tests, Playwright end-to-end tests, Axe checks, TypeScript, ESLint, Prettier, production build, and repeated production Lighthouse measurements.

**Target Platform**: Responsive web browsers; Next.js production deployment.

**Project Type**: Single Next.js web application.

**Performance Goals**: No measurable Feature 007 regression under comparable production Lighthouse profiles; keep constitutional category targets at >=90 and report existing desktop Performance debt rather than claiming it is resolved. No image-related CLS; retain server-first rendering and existing motion behavior.

**Constraints**: Preserve all seven navigation destinations, hash/history current-state ownership, passive-scroll invariance, all six project-detail routes, contact eligibility, Feature 006 reveals/reduced-motion behavior, JavaScript-free links, and existing content except the expressly removed introduction label and Copy Email control. Responsive range is 320–1920 CSS px plus actual 200% browser zoom.

**Scale/Scope**: One existing portfolio homepage and six project-detail routes; one shared action presentation; no new routes or backend services.

## Repository Findings and Integration Dependencies

- The Feature 007 worktree is on `feature/007-final-ui-refinements`. Its current untracked work is limited to `specs/007-final-ui-refinements/`; no application source edits are present.
- Feature 006 implementation is already present in this worktree: `src/lib/motion-reveal.ts`, `src/components/motion/motion-reveal-enhancement.tsx`, the motion tokens and styles in `src/app/globals.css`, and the existing navigation enhancement. No cherry-pick, merge, copy, or dependency on the original checkout's uncommitted changes is needed for this plan.
- The original checkout at `C:/All/Projects/personal-portfolio` has separate uncommitted Feature 006 work. It was not modified. Keep implementation confined to this worktree.
- The standard PowerShell planning setup script could not execute because PowerShell script execution is disabled. No execution-policy change or bypass was attempted. The current branch, `.specify/feature.json`, feature spec, and existing plan template were inspected directly; planning proceeds from those verified paths.
- `SiteHeader` in `src/components/layout/site-header.tsx` contains the visible `P` wordmark link. The existing portrait is `profile.portrait.src` (`/images/me1-2.jpg`), rendered by `OptionalPortrait` with `next/image`. The mobile dialog separately contains a decorative `YN` mark in `src/components/layout/responsive-mobile-navigation.tsx`; the implementation should assess its visual relationship to the navbar brand, but must not change menu behavior or add another brand destination.
- `src/lib/navigation-enhancement.ts` owns hash/history-driven active navigation state, the existing mobile dialog interactions, and the `has-js` marker. It currently has no scroll listener. Feature 007 visibility logic must remain distinct from active-destination resolution and should share this enhancer's initialization and cleanup lifecycle rather than add another navigation controller.
- The desktop header is currently in document flow; mobile navigation has a native `<dialog>` and a `.no-js-mobile-links` fallback. Preserve normal-flow links without JavaScript. Use a layout-stable sticky header and a visual transform for enhanced hide/show behavior; keep focusable controls exposed and force visibility synchronously on `focusin`/`:focus-within` and while the dialog is open.
- Contact content is defined by `src/content/contact.ts` and `src/content/contact-types.ts`, then filtered by `projectPublicContact` in `src/lib/contact-content.ts`. Home and project pages obtain the public profile server-side. Instagram should be added to this existing approved field model and projection; action components receive only projected, eligible values. A future CV is optional and must use the same explicit verification/approval boundary.
- `HeroSection` and `ContactSection` are Server Components. `HeroActions` currently reads optional profile links from `src/content/profile.ts`, which has no such destinations. Change the integration to pass the projected contact profile from the homepage server component, not duplicate URLs in Hero or Contact. Use existing `lucide-react` icons and keep visible text labels.
- `SiteFooter` already reuses `navigationItems`, receives eligible `ownerName`, and prints a server-generated year. Keep it minimal and preserve its owner-name/year-only fallback.
- The visible source label is actually `.hero-index` inside the Hero in `src/components/sections/hero-section.tsx` (rendered as “01 INTRODUCTION”), not a label after the Hero. Remove this decorative node only; preserve About, `#about`, and all section IDs.
- Existing Feature 006 styles define interaction/reveal durations, easing, distances, and stagger tokens in `src/app/globals.css`. Reuse them; do not introduce a second reveal mechanism or scroll observer. The existing reveal enhancement uses one `IntersectionObserver`; the new navbar visibility behavior is a passive `scroll` listener coordinated with `requestAnimationFrame` inside the existing navigation lifecycle.
- The Hero role currently uses a tightly set line-height and negative letter spacing, with a motion wrapper/transform. These are investigation candidates only; implementation must capture computed styles and rendered glyph bounds before selecting a correction.
- The CV discovery recorded in the specification found no PDF/DOC/DOCX/ODT/RTF/Pages document or public CV asset. The action is therefore omitted; this is a nonblocking dependency.

## Constitution Check

| Principle | Plan assessment |
|---|---|
| I. Truthful, useful professional story | Pass. Existing approved contact values flow through the eligibility projection. No CV or other personal details are invented. |
| II. Accessible, responsive experience | Pass subject to implementation evidence. Preserve semantic links, accessible names, visible focus, 44px practical touch targets, reduced motion, all required widths, and real 200% zoom review. Visibility changes may not strand keyboard focus. |
| III. Fast, robust, production-ready delivery | Pass subject to comparable measurement. Reuse the portrait and existing tokens, avoid dependencies, prevent layout shift, and report existing desktop scores below 90 as open global release debt. |
| IV. Maintainable, secure engineering | Pass. Reuse the typed server-side projection and existing navigation lifecycle. Server Components remain default; only the existing browser enhancer handles scroll and menu behavior. No private/ineligible content reaches public actions. |
| V. Verifiable changes and clear acceptance | Pass subject to planned regression evidence. Use existing Vitest, Playwright, Axe, quality commands, production build, Lighthouse reports, and separate manual visual/accessibility/zoom records. |

**Post-design gate**: Pass. The chosen design reuses current architecture, adds no library or route, preserves source-of-truth boundaries, and provides automated plus manual evidence for the measurable requirements. The CV is not a blocker because safe omission is an approved state.

## Architecture and Component Boundaries

1. **Branding**: Keep `SiteHeader` a Server Component. Replace the decorative letter in its existing `Portfolio home` anchor with `next/image` for `/images/me1-2.jpg`; use a fixed square frame with a circular crop and `object-fit: cover`, reserve dimensions, and mark the image decorative within the already named link. Use the installed Next.js Image component guidance: provide dimensions or a positioned `fill` parent and an accurate `sizes` value. No second portrait file or image-fetching client state is needed. Keep the mobile dialog's navigation semantics untouched; assess its decorative `YN` mark for brand consistency during the visual review.
2. **Visibility**: Extend `initializeNavigation` in `src/lib/navigation-enhancement.ts` so visibility and active destination are distinct state concerns in one initialization/cleanup lifecycle. Use one passive scroll listener and at most one pending animation frame; read scroll position in the frame and update a data attribute only when visibility changes. Do not use React state, IntersectionObserver, a second scroll spy, or `aria-current` changes for visibility. Use CSS sticky positioning so the header retains its document-space reservation; hide visually with a short transform and keep `:focus-within`, focused controls, and expanded dialog visible. With `prefers-reduced-motion`, remove the sliding transition while retaining immediate visibility changes.
3. **Scroll thresholds**: At `scrollY <= 16px`, force visible and reset the direction baseline. On a scrollable page, only consider hiding after `scrollY > 64px`; accumulate at least 12px of downward movement from the current direction baseline before hiding. While hidden, accumulate 12px upward movement before showing. Movements below threshold and reversals below threshold do not toggle. Very short pages remain visible. On `hashchange`/`popstate`, show the header, reset the baseline, and ensure the destination is positioned below the sticky header using scroll padding/margin sized from the actual rendered header. The passive listener must not mutate URL/hash or active state.
4. **Responsive composition**: Keep changes scoped to the Hero, Contact, selected section headings, action groups, and navbar styles in `src/app/globals.css` and the owning existing components. Do not center long project descriptions, timelines, lists, technical content, or project-detail prose. Do not alter desktop alignment without visual evidence. Action groups wrap naturally from 320px and keep touch targets usable.
5. **Hero descender and label**: Inspect DOM wrappers and computed layout at 320, 375, 390, 768, desktop, and actual 200% zoom. Compare the role glyph's line box and painted bounds with motion on/off and reduced motion; check line-height, overflow, fixed sizing, transforms, and clipping before selecting the smallest CSS adjustment. Do not reduce type size unless evidence proves it necessary. Remove only the `.hero-index` decoration; keep Hero heading and About structure intact.
6. **Actions and data**: Extend `ContactSourceRecord`/`PublicContactProfile` with the exact approved Instagram URL and optional CV field only if an actual reviewed asset is added in a later approved change. Extend `projectPublicContact` to independently enforce record approval, field factual verification, field publication approval, nonempty text, and HTTPS URL validation. Render one shared server-side action presentation from only projected values in Hero and Contact. Keep email as `mailto:` and profile actions as secure external links. Email is primary, profile actions secondary. No Download CV action is rendered now. Remove `CopyEmailAction` from Contact UI; preserve contact projection and publication safety tests.
7. **Footer**: Preserve the existing minimal footer, navigation data reuse, year generation, and eligible owner attribution. Do not repeat the full action group or add an active-state controller.

### State and Progressive Enhancement

| Condition | Navigation | Content/actions |
|---|---|---|
| Before hydration / JavaScript disabled | Header remains in normal document flow; no hidden state is emitted; existing no-JS navigation remains usable. | Server-rendered content and ordinary links are available. |
| JavaScript active, at top/short page | Visible. | No content or action depends on animation/hydration. |
| Qualifying downward movement beyond 64px | May be visually translated away only when no focus/menu lock applies. | Header remains in accessibility tree; a `focusin`/`:focus-within` state exposes it before navigation interaction continues. |
| Qualifying upward movement / anchor or history navigation | Reappears at top edge without changing active destination. | Anchor target remains below the header. |
| Reduced motion | Visibility changes immediately with no slide transition. | Existing Feature 006 reduced-motion rules remain; no action depends on hover or movement. |

## Project Structure

### Planning artifacts

```text
specs/007-final-ui-refinements/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── ui-final-ui-refinements.md
```

`tasks.md` is intentionally not generated during planning; it belongs to `$speckit-tasks`.

### Expected implementation ownership (for later task generation)

```text
src/
├── app/
│   ├── globals.css                         # existing motion/layout tokens and scoped styles
│   ├── page.tsx                            # pass public contact projection to Hero and Contact
│   └── projects/[slug]/page.tsx            # regression surface; expected no content change
├── components/
│   ├── layout/
│   │   ├── site-header.tsx                 # portrait brand link
│   │   ├── responsive-mobile-navigation.tsx # preserve dialog/no-JS links; align brand mark if warranted
│   │   └── site-footer.tsx                 # preserve minimal footer and publication fallback
│   └── sections/
│       ├── hero-section.tsx                # pass projected profile; remove hero-index decoration
│       ├── hero-actions.tsx                # retain essential CTAs; render shared available actions
│       ├── contact-section.tsx             # one Email action, social actions, retire Copy Email UI
│       └── portfolio-actions.tsx           # proposed shared Server Component for visible action links
├── content/
│   ├── contact-types.ts                    # typed approved Instagram and optional CV field
│   └── contact.ts                          # exact approved Instagram source field
└── lib/
    └── contact-content.ts                 # server-side eligibility projection extension

tests/
├── components/                             # header/actions/hero/contact component tests
├── lib/contact-content.test.ts             # projection eligibility and omission tests
└── e2e/                                    # scroll visibility, responsiveness, routes, zoom/manual evidence
```

`portfolio-actions.tsx` is a planning proposal for a shared, presentational Server Component; implementation may reuse an existing suitable primitive if repository inspection at task execution finds one. Do not create a new domain layer solely for the action list.

**Structure Decision**: Single Next.js App Router project. Extend the existing content, projection, layout, and section boundaries; add at most one small server-rendered shared action component if no current component already owns this markup. No new client component or dependency is proposed.

## Verification Strategy

- **Vitest**: projection eligibility for owner/email/GitHub/LinkedIn/Instagram; draft record and unverified/unapproved fields excluded; optional CV omitted; header portrait markup and accessible name; shared action rendering; Contact has one Email/no Copy Email; Hero label absent; Footer behavior unchanged.
- **Playwright**: verify scroll thresholds at 16/64/12 CSS px, small fluctuations and reversals, short pages, focus recovery, expanded menu lock, direct hash and back/forward reveal, active-state invariants, project-route Portfolio state, mobile navigation, desktop no-wrap, no-JS links, exact action destinations/security attributes, CV omission, 320/375/390/768/1024/1440/1920 widths, six project routes, no overflow, and reduced motion.
- **Publication boundary**: exercise test-only ineligible contact fixtures through the existing projection and actual Hero/Contact renderers; assert sentinel values and approval metadata do not enter HTML or serialized output. Do not add a production draft route or include private fixtures in production content.
- **Hero visual regression**: inspect/measure descenders `g`, `j`, `p`, `q`, `y` under normal/reduced motion and responsive widths. Automated bounding-box/screenshot checks are supplemental; capture a human review separately.
- **Accessibility**: Axe on homepage/actions and representative project page, semantic/link name assertions, keyboard traversal/focus recovery tests, and separate manual keyboard, screen-reader, contrast, touch, reduced-motion and zoom review. Axe does not establish WCAG conformance on its own.
- **Quality**: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:e2e`.
- **Performance**: before any source change and after implementation, build once and collect at least three runs for `/` and `/projects/drivewise` on mobile and desktop using the Feature 006 documented Lighthouse 13.5 / Chrome 156 profiles (412x823 DPR 1.75 mobile; 1440x900 DPR 1 desktop; same throttling, CPU, build, and ready isolated production-server lifecycle). Record category scores, LCP, CLS, TBT, transfer bytes, browser/tool versions and variance. Use the same before/after conditions. Existing desktop Performance medians 85/87 remain below 90; compare for regression separately from the constitutional release gate.
- **Manual gate**: actual Chrome browser zoom at 200% (not DPR or viewport simulation), visual inspection of portrait/glyph/action wrapping, keyboard and screen-reader operation, reduced motion, touch and anchor/header obstruction. Record browser, viewport, inputs, steps, observed result, and reviewer. Do not mark manual acceptance based on automated tests.

## Specification Traceability

| Specification coverage | Planned implementation | Planned evidence |
|---|---|---|
| FR-001–002; SC-002: portrait source, crop, link name/destination, stable dimensions | `SiteHeader` and existing `/images/me1-2.jpg` | Header component test; Playwright on homepage and project route; CLS/Lighthouse comparison. |
| FR-003–008; SC-001, SC-009: top/short-page visibility, directional thresholds, focus/menu lock, anchor/history behavior, reduced motion, no-JS, unchanged active state | Extend existing `initializeNavigation` lifecycle and scoped header CSS | Vitest threshold/state tests; Playwright scroll/focus/menu/history/project/no-JS/reduced-motion tests. |
| FR-009–011; SC-003: selected mobile centering, readable dense content, 320–1920px and actual 200% zoom | Scoped Hero/Contact/heading styles and action wrapping | Playwright viewport/overflow checks plus actual Chrome 200% manual review. |
| FR-012–013; SC-004: visible Hero descenders, preserved font/hierarchy/sequence, no layout shift | Evidence-led Hero CSS correction only after computed/rendered bounds inspection | Component/E2E text and motion assertions plus manual visual check at mobile/desktop and reduced motion. |
| FR-014; SC-005: remove introduction decoration while retaining About semantics/anchor | Remove `.hero-index` node only | Hero component and Playwright assertions for absence, `#about`, and navigation. |
| FR-015–016; SC-006: one exact mailto action, no duplicate display or Copy Email control | Shared projected action rendering in Contact | Contact component/E2E exact href and count assertions; no-JS link test. |
| FR-017–024; SC-007–008: shared rounded action family, labels, icons, touch/focus, exact destinations, eligibility, Instagram, CV omission, Footer minimality, no-JS/reduced motion | Extend contact source/projection; shared server-rendered action component; preserve Footer | Vitest projection and component checks; Playwright destinations/security/keyboard/no-JS/wrapping; Axe/manual accessibility. |
| FR-025–026; SC-009: reuse Feature 006 tokens and preserve prior features/routes/contracts | Existing tokens, reveal implementation, navigation owner, contact projection | Existing Vitest/Playwright regressions, six route checks, navigation and publication suites. |
| FR-027; SC-010: complete automated and manual verification coverage | Test suites and verification procedures in quickstart | Playwright/Axe/quality gates plus separately recorded human review; actual zoom evidence. |
| FR-028; SC-010: manual reviews distinct from automated results | Quickstart manual evidence record | Reviewer/browser/steps/results recorded; no automated-only completion claim. |
| FR-029–030; SC-011–012: Lighthouse thresholds, no privacy leakage/performance regression, report existing debt | Production audit methodology and real-projection sentinel fixtures | Three-run comparable audits on both routes/profiles; sentinel through projection/render path; artifact scan as additional evidence. |

All 30 functional requirements and 12 success criteria map to implementation and verification evidence above. The unavailable CV is a documented optional input with omission as its acceptance state, not an implementation blocker.

## Complexity Tracking

No constitutional exceptions or new architectural complexity are proposed. The only browser-side extension is the requested navbar visibility behavior within the existing navigation enhancer lifecycle; it does not create another active-state owner. The missing CV is handled by omission, not a placeholder or new service.
