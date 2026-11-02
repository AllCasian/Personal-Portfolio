# Implementation Plan: Hero & About

**Branch**: `002-hero-about` | **Date**: 2026-11-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification and implementation request for the existing portfolio's Hero and About sections.

## Summary

Extend the existing Home hero and replace only the About placeholder with concise, verified profile content. Reuse Feature 001's page shell, design tokens, typography, responsive navigation, buttons, and hydration-safe navigation enhancement. Keep the sections statically rendered and profile data separate from presentation. Model missing optional resume/social resources as absent and preserve the existing non-photo decorative portrait treatment when no verified photo is available. Use a minimal image-error boundary only when a photo is configured; do not add a motion or other dependency.

## Technical Context

**Language/Version**: TypeScript 5.9.3, strict mode; Node.js 22 LTS (project verified with 22.21.0), npm 10

**Primary Dependencies**: Existing Next.js 16.4.2 App Router, React 19.3.1, Tailwind CSS 4.3.3, Lucide React 1.61.0, `next/image`, existing shared button and card primitives; no new dependency planned

**Storage**: Public, read-only local TypeScript profile content and optional local portrait/resume assets; no persistence

**Testing**: Existing Vitest 5.0.5, React Testing Library 16.3.3, Playwright 1.64.1, and axe-core Playwright 4.14.0

**Target Platform**: Modern browsers at the Feature 001 viewport range (320–1920 CSS pixels); Vercel deployment

**Project Type**: Single Next.js web application

**Performance Goals**: The constitution's Lighthouse target remains at least 90 in Performance, Accessibility, Best Practices, and SEO; its Core Web Vitals targets remain LCP at most 2.5 s, CLS at most 0.1, and field INP at most 200 ms at p75 when measurable. The latest Feature 001 baseline, measured with Lighthouse 13.5.0 / Chrome 156.0.0.0 on 2026-11-02 using the profiles documented in its quickstart, is desktop Performance 89 and mobile Performance 98; desktop Accessibility/Best Practices/SEO are 100/96/100 and mobile is 100/96/100. Lab LCP is 2.237 s desktop and 2.226 s mobile; CLS is 0.000 and 0.066 respectively. The desktop Performance score of 89 is a known unresolved issue, below the constitution target, not a passing baseline. It does not block specification or planning. Feature 002 must compare reproducible mobile/desktop results with this baseline, identify measured bottlenecks, apply evidence-based remediation when a score regresses or remains below target, and repeat the same measurements. Record any remaining below-target score as an open release issue; never report it as passed. Report field INP as “not yet measurable” without sufficient real-user data.

**Constraints**: Reuse Feature 001 and its navigation contract; WCAG 2.2 AA; visible focus; practical 44×44 CSS-pixel touch targets; reduced-motion support; no fabricated biography or links; support JavaScript-disabled anchors; no page-level horizontal overflow at 320, 375, 768, 1024, 1440, or 1920 CSS pixels; no full Portfolio, Experience, Education, Skills, or Contact feature work.

**Scale/Scope**: One static landing page with a complete Hero and concise About summary. Portfolio and Contact remain existing titled placeholders. No database, CMS, authentication, analytics, backend, or infrastructure changes.

## Constitution Check

*Plan conformance reviewed. The existing desktop Lighthouse Performance gap is recorded below as an open issue; it does not block specification work.*

| Principle | Plan response | Gate |
|---|---|---|
| Truthful, useful professional story | Extend typed local content with explicit placeholders; optional personal assets and URLs remain absent until verified; About copy is limited to summaries. | Pass |
| Accessible, responsive experience | Preserve semantic section/heading structure, text-first mobile order, keyboard-visible links, WCAG contrast, reduced motion, 200% zoom review, and all specified widths. | Pass |
| Fast, production-ready delivery | Preserve or improve the measured Feature 001 baseline; compare reproducible mobile and desktop runs, investigate actual bottlenecks, and use evidence-based remediation. Feature 001 desktop Performance 89 is a known unresolved issue below the constitution's 90 target; it remains open until measurements meet target and must not be claimed as passing. | Open baseline issue; no specification blocker |
| Maintainable, secure engineering | Keep page sections as Server Components; separate profile from UI; add a narrowly scoped image-error client leaf only if a portrait exists; no secrets or remote data. | Pass |
| Verifiable changes and acceptance | Add component, navigation, responsive, axe, no-JavaScript, hydration, and build checks mapped to spec criteria. | Pass |
| Simple, coherent design | Reuse the current theme and components; do not recreate the shell or add infrastructure; CSS handles any simple motion. | Pass |
| Spec Kit governance | Plan, data model, UI contract, validation guide, tasks, analysis, implementation, and convergence remain separate ordered stages. | Pass |

No constitution violations are planned. The optional portrait error handler is a limited exception to the Server Component default only when an image is configured; the current no-photo case remains server-rendered.

**Post-design constitution check**: PASS for the planned architecture and scope. The existing desktop Lighthouse Performance gap remains open and is not represented as meeting the constitution target. The data contract, responsive behavior, optional asset states, test strategy, and implementation boundaries require no new dependency, persistent store, or infrastructure component.

## Project Structure

### Documentation

```text
specs/002-hero-about/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── hero-about.md
└── tasks.md                 # Generated later by $speckit-tasks
```

### Source and tests

```text
src/
├── app/
│   └── page.tsx                         # Compose existing shell, Hero, About, placeholders
├── components/
│   ├── layout/                          # Reuse; no navigation rewrite
│   ├── sections/
│   │   ├── hero-section.tsx             # Extend existing Server Component
│   │   ├── hero-actions.tsx             # Required CTAs + optional supporting links
│   │   ├── about-section.tsx            # New Server Component
│   │   └── optional-portrait.tsx        # Conditional, narrow image-error boundary
│   └── ui/                              # Reuse ButtonLink, Card, SectionHeading
├── content/
│   ├── profile.ts                       # Extend editable profile data
│   ├── sections.ts                      # Mark About as content; preserve other placeholders
│   └── types.ts                         # Extend ProfileContent and AboutSummary types
└── lib/                                 # Reuse existing utilities and navigation enhancement
public/
├── images/                              # Only a verified local portrait if supplied
└── resume/                              # Only a verified resume if supplied
tests/
├── components/
│   ├── hero-section.test.tsx
│   ├── hero-actions.test.tsx
│   └── about-section.test.tsx
└── e2e/
    ├── hero-about.spec.ts
    ├── responsive.spec.ts
    ├── no-js-navigation.spec.ts
    ├── hydration.spec.ts
    └── accessibility.spec.ts
```

**Structure Decision**: Extend the current single-project `src/` layout. Keep `HeroSection` and `AboutSection` server-rendered. Use one `HeroActions` grouping because the two required CTAs and conditional supporting links share a hierarchy and responsive layout. Do not create a separate `SocialLinks` component while those links have only one consumer. Keep portrait rendering together with its fallback; isolate an `onError` state only in the optional portrait leaf because Next.js requires a Client Component for image event callbacks. Reuse the existing heading, button, content-width, and surface styles instead of creating parallel primitives.

## Design and Implementation Decisions

- **Content and presentation**: Extend the existing string-based `ProfileContent` and add a focused `AboutSummary` in `src/content/types.ts`; update the one local profile object. Preserve the current string-field shape rather than adding placeholder metadata. For unavailable or unverified required values, use a neutral, non-empty, accessible plain-text value prefixed `Placeholder:` and identify the field/status; tests can assert this explicit marker. Authored biography sentence rules do not apply to marked placeholders, and placeholder strings must not resemble verified claims. On verification, replace the placeholder and remove the marker. Omit optional resume/social/portrait content when absent (the approved decorative portrait fallback is handled separately). Keep the broad engineering role in the existing role field. Verified introduction copy is one or two sentences with one short verified focus phrase. About has six concise fields and stays at approximately 150 words or fewer. Required View Projects and Contact Me destinations are stable UI contract values (`#portfolio` and `#contact`), not editable personal profile facts.
- **Optional data**: Represent resume, GitHub, LinkedIn, and portrait as optional fields. Render no anchor, button, broken image, or fake URL for missing optional data. Verified resume and profile links appear beneath the two required actions with lower visual emphasis. Preserve the existing decorative portrait placeholder when no verified portrait is configured.
- **Section composition**: Keep the existing `#home` hero and its single page-level heading. Add `#about` with a subordinate section heading. Replace the About placeholder only; retain the Portfolio and Contact placeholder sections and existing header/footer/navigation.
- **Navigation behavior**: Use normal same-page anchors for both required CTAs. Do not add custom scroll tracking, client-side routing, or another navigation state store. The existing post-hydration enhancer remains the sole owner of `aria-current`, URL hash/history synchronization, and navigation active styling.
- **Responsive layout**: Keep all content in the existing content-width system and use fluid typography. At 320–767 px, order copy and required actions before the portrait fallback or image. At 768 px and above, a two-column hero is allowed only while readable line length and action grouping remain intact; otherwise stack. The hero layout breakpoint is independent of Feature 001's 1024 px navigation breakpoint. Test all six specified widths and 200% browser zoom.
- **Portrait and media**: No portrait is currently present. With no image, render the existing decorative fallback on the server with stable proportions and no image request. If a verified local portrait is supplied, use `next/image`, intrinsic or explicit dimensions, responsive sizing, and a fixed-ratio frame. Use meaningful alternative text only when the portrait contributes information; otherwise use empty alternative text. A small client leaf may hide a failed image and reveal the same decorative fallback without changing the frame size. Verify both delayed load and failed load; no client boundary is rendered for the absent-image case.
- **Motion**: Use existing CSS transition patterns only for purposeful hover/focus or reveal feedback. Keep content visible without motion and disable nonessential transitions under the existing reduced-motion rule. Do not add Motion for React unless implementation demonstrates a concrete interaction CSS cannot support.
- **Performance**: Preserve the current font and shared styles. Do not preload an optional portrait by default; use Lighthouse evidence to decide whether it is the LCP element and whether eager loading is justified. Compare before/after mobile and desktop runs against the same Feature 001 profile; report score variance and field-data availability honestly.
- **Documentation**: Update README content-editing instructions to include About fields and conditional assets. Keep implementation verification results in Feature 002 quickstart; do not mark any checks passed before they run.

## Validation Strategy

- Vitest/React Testing Library: required content and heading order; broad role; verified focus phrase or neutral `Placeholder:` values in required string fields; ensure marked placeholders are rendered as accessible text and are not treated as authored biography; exact required CTA hrefs; verified optional links appear with subordinate presentation; missing optional links produce no controls or placeholders; About covers all six topics with explicitly marked placeholders only for unavailable/unverified values and remains within the word target; portrait fallback and image alternatives.
- Playwright: direct `#home`/`#about` loading, View Projects and Contact Me navigation, URL and `aria-current` synchronization, history back/forward; all six viewport widths; deterministic 375×812 and 1440×900 first-view checks for SC-001 before scrolling; overflow and CTA reachability; optional portrait success/failure with stable frame; reduced-motion navigation; keyboard order/focus; JavaScript-disabled page; no hydration warning/error on fresh load. Feature 002 CTA/navigation scenarios belong in `tests/e2e/hero-about.spec.ts`; preserve Feature 001 regression tests.
- Axe: run on the landing page at default and available optional-media states as a separate automated check. After implementation, perform and document manual keyboard-only navigation, visible focus, screen-reader names/reading order/CTA interaction, semantic heading hierarchy, contrast/state pairs, 200% zoom and responsive reflow, reduced-motion behavior, and portrait alternatives when applicable. Record environment, test date, results, and unresolved issues; manual checks remain pending until performed.
- Visual review: compare typography/hierarchy, spacing/content density, CTA prominence, responsive composition, portrait placement when applicable, and accessible interaction states against Feature 001 design tokens and any supplied screenshots still available for inspection. If screenshots are unavailable, document that limitation and base the review only on the approved design system; do not infer screenshot details. Record findings and unresolved issues in quickstart.
- Quality gates: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test`, `npm.cmd run build`, and `npm.cmd run test:e2e`.
- Performance: after a production build, run reproducible mobile and desktop Lighthouse using the same documented Feature 001 profiles. Record Lighthouse version/date, browser/device profile, four category scores, lab LCP/CLS, and field INP only when sufficient data exists. Compare results against Feature 001's documented baseline and the constitution targets. Identify actual bottlenecks from reports/traces; make evidence-based changes if scores regress or remain below 90, then repeat the same runs. Document unresolved gaps as open release issues and never claim a score below 90 passes. The known desktop Performance 89 baseline does not block specification work; until resolved it remains an open performance issue.

## Complexity Tracking

No new package, service, data store, or framework is required. The optional image-error boundary is the smallest way to satisfy portrait failure behavior when a verified photo is present; without one, Hero and About remain server-rendered.
