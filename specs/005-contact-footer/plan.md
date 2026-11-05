# Implementation Plan: Contact & Footer

**Branch**: `feature/005-contact-footer` | **Date**: 2026-11-05 | **Spec**: [spec.md](spec.md)

## Summary

Replace the homepage Contact placeholder with a responsive, accessible section using the exact owner-approved name, email, GitHub, and LinkedIn values. Retain server rendering for all content and the Footer. Isolate Clipboard API behavior in one small Client Component; reveal it only after both the existing navigation enhancer has established `has-js` and the component's own post-hydration readiness state confirms its event handler is ready. Extend the existing server footer with projection-sourced owner attribution and compact secondary navigation sourced from `navigationItems`; preserve navigation state ownership and all Features 001–004 contracts.

## Technical Context

**Language/Version**: TypeScript 5.9.3, strict mode; React 19.3.1; Next.js 16.4.2 App Router

**Primary Dependencies**: Existing Next.js, React, Tailwind CSS v4, Vitest 5.0.5, Testing Library, Playwright 1.64.1, axe-core Playwright integration, Lighthouse 13.5.0; no new dependencies planned

**Storage**: Typed local content modules; no database or external service

**Testing**: Vitest component/content tests; Playwright E2E and no-JavaScript tests; Axe scans; TypeScript, ESLint, Prettier, production build, and Lighthouse

**Target Platform**: Static/server-rendered Next.js portfolio on Vercel; current browsers supporting the existing site baseline

**Project Type**: Next.js web application

**Performance Goals**: Preserve the constitution's Lighthouse thresholds of >=90 for Performance, Accessibility, Best Practices, and SEO. Measure `/` and `/projects/drivewise` using comparable production mobile and desktop profiles. The latest known desktop Performance scores (homepage 86–87, Drivewise 87) remain unresolved baseline issues. The historical mobile Performance baseline is approximately 98; its original measurement profile is undocumented, so it is context only and not a comparable result. Feature 005 must not claim existing issues are fixed. Target LCP <=2.5s and CLS <=0.1; field INP remains not yet measurable until sufficient field data exists.

**Constraints**: Keep Contact and Footer server-rendered by default; pass only the eligible public email string into the clipboard Client Component; no public draft route, clipboard dependency, form/backend, new primary navigation destination, client-side year timer, or competing navigation state owner. Preserve visible/selectable email and mailto behavior with JavaScript disabled. Support 320, 375, 768, 1024, 1440, and 1920 CSS-pixel widths and 200% zoom.

**Scale/Scope**: One Contact section, one existing Footer, four confirmed public profile fields, and the existing seven navigation destinations.

## Constitution Check

| Principle | Plan decision | Status |
|---|---|---|
| Truthful, approved content | Use only owner-confirmed fields; public projection requires approved record plus independently verified and approved field; omit ineligible data and review metadata. | Pass |
| Accessible, semantic UI | Use section/footer landmarks, clear labels, keyboard-operable links/button, announced clipboard result, visible focus, WCAG 2.2 AA contrast, reduced-motion compatibility, and manual review separate from Axe. | Pass |
| Responsive and mobile-first | Reuse current tokens and layout patterns; verify all six required widths, 200% zoom, no overflow/clipping, and practical 44px targets. | Pass |
| Performance | Server Components by default; one isolated clipboard Client Component; no added dependency or remote request; measure existing required routes and preserve unresolved scores. | Pass with existing global release issue |
| Maintainable architecture | Extend the current content and page-composition conventions; no new state manager, database, or broad publication abstraction. | Pass |
| Tested and honest delivery | Add focused Vitest/Playwright/Axe coverage; record actual results only; keep manual checks and Lighthouse failures open until evidence exists. | Pass |
| Navigation and progressive enhancement | Reuse `navigationItems` and `navigation-enhancement.ts`; preserve URL/hash/history and project-route context; reveal Copy Email only when existing `has-js` and the component-local post-hydration readiness gate are both satisfied. | Pass |

No constitutional violation is proposed. The desktop Lighthouse baseline below target remains an existing production release issue and is not waived by this feature plan.

## Design Decisions

1. **Use a feature-specific contact source model and server projection.** Follow the independent record and field eligibility semantics established by Features 003–004, but do not refactor their domain-specific models into a new generic publication framework. The server projection returns only owner name, email, GitHub URL, and LinkedIn URL that pass the required gates, without approval or verification metadata.
2. **Keep the page server-first.** A server `ContactSection` receives only projected data. Its `CopyEmailAction` leaf is the only new client boundary and receives only the approved email string. Contact text, visible email, mailto anchor, social anchors, Footer, and footer navigation remain server-rendered.
3. **Progressively reveal the copy button.** Render the button hidden by default. Reveal it only when both the existing global `has-js` marker is present and the `CopyEmailAction` Client Component has set its own local readiness state after hydration, when its event handler is ready. The local state belongs only to the copy control and does not own navigation or global hydration state. With JavaScript disabled, or while JavaScript is enabled but the component has not hydrated, the control remains hidden, absent from the accessibility tree, and unfocusable. The user can always select the adjacent email text or follow `mailto:`. No new script, dependency, or second navigation controller is added.
4. **Use an inline status region for copy feedback.** The client leaf uses `navigator.clipboard.writeText` on activation, handles absent API and rejected permissions, and updates a concise polite live region. Keep focus on the activated button; do not make feedback color-only or move focus.
5. **Extend the current server Footer.** Compute the calendar year once in the server render and use it in the copyright string. Source the compact secondary links from `navigationItems`, using home hashes on `/` and root-prefixed hashes from project detail pages. Name the secondary navigation and omit `aria-current` from its links.
6. **Keep social URLs exact and owner-approved.** No alternate URL or automated monitor is introduced. The previous cache-miss response is recorded as a reachability limitation, not an unavailability finding. Future manual link review follows FR-009.

## Architecture and Data Flow

```text
src/content/contact.ts (source record and review metadata)
                  |
                  v
src/lib/contact-content.ts (server-only eligibility projection)
                  |
                  v
src/app/page.tsx -> ContactSection (server-rendered)
                         |                 |
                         |                 +-> CopyEmailAction (client leaf; public email only)
                         +-> visible email, mailto, GitHub, LinkedIn

src/app/page.tsx -> getPublishedContactProfile() -> SiteFooter(ownerName?)
src/app/projects/[slug]/page.tsx -> getPublishedContactProfile() -> SiteFooter(ownerName?)
src/app/projects/[slug]/not-found.tsx -> getPublishedContactProfile() -> SiteFooter(ownerName?)
                  (server-rendered; navigationItems + one server year)
```

The projection must check record publication approval and, independently for every field, factual verification and publication approval. Only the projected public DTO may be passed to rendering. `SiteFooter` receives `ownerName` only from this projection; it must not contain the literal owner name as a fallback. If the field is ineligible, the Footer omits the name and uses the year-only copyright form defined in FR-010. Review states, source notes, and sentinel values must be absent from HTML, metadata, generated output, serialized props, and client bundles. Contact adds no metadata to the site-wide document head.

## Project Structure

### Documentation (this feature)

```text
specs/005-contact-footer/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── ui-contact-footer.md
```

### Source Code (planned implementation targets; no code changes in this planning step)

```text
src/
├── app/
│   ├── page.tsx                         # Compose the Contact section from projected data
│   ├── projects/[slug]/page.tsx         # Keep projected owner attribution on approved detail pages
│   ├── projects/[slug]/not-found.tsx    # Keep the Footer projection-safe on not-found responses
│   └── globals.css                      # Reuse tokens; gate copy control on has-js and local readiness
├── components/
│   ├── layout/site-footer.tsx           # Projected ownerName, year and navigationItems; no identity fallback
│   └── sections/
│       ├── contact-section.tsx          # Server-rendered Contact content/actions
│       └── copy-email-action.tsx        # Isolated clipboard Client Component
├── content/
│   ├── contact-types.ts                 # Source/public contact types
│   ├── contact.ts                       # Owner-confirmed source values and eligibility metadata
│   └── sections.ts                      # Keep #contact identity; replace placeholder state
└── lib/contact-content.ts               # Server-side public projection

tests/
├── content/contact.test.ts              # Content shape and exact approved values
├── lib/contact-content.test.ts           # Eligibility combinations and metadata stripping
├── components/contact-section.test.tsx   # Public markup, links, omission, semantic contract
├── components/copy-email-action.test.tsx # Clipboard success/failure/focus/live region
├── components/site-footer.test.tsx       # Owner omission, frozen year, labels and destinations
└── e2e/
    ├── contact-footer.spec.ts            # Browser, responsive, navigation, no-JS, accessibility paths
    ├── contact-publication.spec.ts        # Sentinel publication-boundary assertions
    └── fixtures/contact-publication-next/ # Isolated test-only Next app for RSC/HTML/client-prop sentinels
```

Test paths are planning targets and should follow the nearest existing repository convention during task generation; no public route may expose draft fixtures.

**Structure Decision**: Integrate the feature into the existing single Next.js application and `src/content`, `src/lib`, `src/components`, and `tests` conventions. Keep the clipboard boundary small and avoid changes to Features 001–004 beyond the Contact placeholder composition and the existing Footer component required by this feature.

## Requirements Traceability

| Specification | Planned design / verification |
|---|---|
| FR-001, SC-001 | ContactSection at unique `#contact`, heading and concise invitation; component and E2E assertions |
| FR-002, FR-007–009, SC-005–006 | Independent record/field gate projection; sentinel integration checks through isolated Next fixture; exact social destination checks |
| FR-003–005, SC-002–004 | Visible selectable exact email, `mailto:`, progressively enhanced copy action; success/failure/unsupported/no-JS tests |
| FR-006, SC-006 | Exact approved social links, target/rel/accessibility tests; document reachability limitation without changing approval |
| FR-010–011, SC-007 | Projection-sourced owner identity with year-only ineligible fallback, frozen-clock year tests, and secondary links from existing navigation data |
| FR-012–013, SC-008 | Reuse active-state architecture; home hash/history and project-detail route tests; footer links never set `aria-current` |
| FR-014–016, SC-009–010 | Semantic structure, contrast/focus/targets, reduced motion, six widths, 200% zoom, Axe plus separate manual review |
| FR-017 | Vitest, Playwright, Axe, existing cross-feature regressions, production build and route checks |
| FR-018, SC-011 | Comparable mobile/desktop Lighthouse for `/` and `/projects/drivewise`, all categories, current evidence and unresolved issues documented |
| SC-012 | Optional 10-second visitor review protocol; qualitative and non-blocking when reviewers are unavailable |

## Constitution Check (post-design)

- Server-first architecture is retained; only the clipboard operation requires client-side behavior.
- Public data is minimized before rendering and client serialization; no draft preview or private metadata is exposed.
- Footer owner attribution is projection-sourced and eligibility-gated. An ineligible value is never replaced by a literal fallback.
- Copy control visibility requires both the existing navigation `has-js` marker and the copy component's local post-hydration readiness; local readiness cannot affect navigation state.
- JavaScript-disabled users retain the visible/selectable email, working `mailto:` and social links; the hidden copy control does not become an unusable control.
- Existing navigation enhancer remains the sole post-hydration owner. Footer navigation is a separately named set of ordinary links and has no active-state behavior.
- Existing global desktop Performance shortfall stays an open release issue. Feature-specific Lighthouse measurements are required before making claims; field INP is not yet measurable absent sufficient real-user data.
- No unresolved design or architecture decision blocks task generation.

## Complexity Tracking

No constitution violations or additional infrastructure are proposed. A feature-specific projection is retained because the current publication projectors are domain-specific; a generic shared framework would add scope without a demonstrated need.
