# Implementation Plan: Portfolio Foundation

**Branch**: `001-portfolio-foundation` | **Date**: 2026-10-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-portfolio-foundation/spec.md`

## Summary

Create the portfolio's responsive visual foundation as a statically rendered Next.js App Router page. Use a near-black canvas, electric-blue accents, and a portrait-led hero, improving the reference's spacing, hierarchy, contrast, and density. Keep profile and navigation content in typed local data; use reusable shell, section, button, and card patterns; and limit browser-side behavior to the accessible full-screen mobile navigation and purposeful motion. Validate accessibility, responsive behavior, and production readiness locally and through Vercel Preview deployments.

## Technical Context

**Language/Version**: TypeScript with strict mode; current Node.js LTS supported by the selected Next.js release

**Primary Dependencies**: Next.js App Router, React Server Components by default, Tailwind CSS v4, shadcn/ui accessible primitives where useful, Lucide React, Motion for React, `next/font`, and `next/image`

**Storage**: Typed local TypeScript content; no database or CMS

**Testing**: Vitest, React Testing Library, Playwright; automated axe checks plus manual keyboard and screen-reader review

**Target Platform**: Modern browsers from 320px through ultrawide desktop; Vercel deployment

**Project Type**: Single web application

**Performance Goals**: Preserve constitution goals of Lighthouse >= 90 in Performance, Accessibility, Best Practices, and SEO, and Core Web Vitals LCP <= 2.5s, CLS <= 0.1, INP <= 200ms at the 75th percentile where measurable. For reproducibility, record Lighthouse version or execution date, device and testing profile, all four category scores, and lab-measured LCP and CLS for mobile and desktop runs. Record field INP and its measurement source/time window when sufficient real-user data exists; otherwise record “not yet measurable.” Never claim the field INP target has passed without supporting measurements. Render the main route statically when possible, reserve image space, use optimized local fonts and images, and keep client JavaScript limited to required interactions.

**Constraints**: WCAG 2.2 AA for applicable criteria; 320px minimum supported viewport; no horizontal overflow at specified widths; visible keyboard focus; 44px practical touch targets; reduced-motion support; mobile navigation remains usable when JavaScript is unavailable; no fabricated profile content or secrets.

**Scale/Scope**: One public landing page, one content-bearing Home/hero destination, titled About, Portfolio, and Contact placeholders only, shared navigation and footer, reusable visual patterns, editable placeholder profile data. Full About, Portfolio, career, education, and contact-form features are out of scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / standard | Plan response | Gate |
|---|---|---|
| Truthful professional story | Typed local editable placeholders; no reference screenshot details treated as verified facts | Pass |
| Accessible, responsive experience | Semantic landmarks, mobile-first layouts, WCAG 2.2 AA, focus handling, 44px targets, reduced-motion and no-JS fallback | Pass |
| Fast, production-ready delivery | Static rendering, limited client boundary, optimized local fonts/images, Lighthouse and Core Web Vitals validation | Pass |
| Maintainable, secure engineering | Strict TypeScript, composable components, Server Components by default, no secret-bearing integrations | Pass |
| Verifiable changes and acceptance | Unit/component and E2E coverage mapped to spec; lint, format, type-check, build quality gates | Pass |
| Design and simplicity | Tokens and patterns are shared; shadcn/ui used selectively; no database, CMS, auth, microservices, or separate backend | Pass |
| Spec Kit workflow | Plan and artifacts map to the clarified feature spec; implementation and convergence remain downstream phases | Pass |

No constitution violations identified. Recheck after detailed design and during convergence.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-navigation.md
└── tasks.md                 # Created by $speckit-tasks, not by this plan
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   └── mobile-navigation.tsx
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── section-placeholder.tsx
│   │   └── section-heading.tsx
│   └── ui/
│       ├── button.tsx
│       └── card.tsx
├── content/
│   ├── profile.ts
│   └── navigation.ts
├── hooks/
├── lib/
│   └── utils.ts
└── styles/
    └── tokens.css           # Only if tokens cannot live cleanly in globals.css
public/
├── images/
├── projects/                 # Reserved for later feature work; no project content in this scope
└── resume/                   # Reserved for later feature work; no resume content in this scope
tests/
├── components/
└── e2e/
```

**Structure Decision**: Use the requested single-project `src/` layout with App Router routes under `src/app`, content separated in `src/content`, shared primitives in `src/components/ui`, and site-specific sections and shell in separate component folders. Leave `hooks`, optional `styles/tokens.css`, and reserved public folders empty unless implementation demonstrates a real need. Unit and component tests live outside application code in `tests/components`; Playwright journeys live in `tests/e2e`.

## Design and Implementation Decisions

- **Rendering and client boundary**: Keep the root layout, landing page, hero, placeholders, and footer as Server Components. The responsive navigation is the only required Client Component boundary; Motion may be used there for the open/close transition. Do not hydrate unrelated page content.
- **Navigation destinations and breakpoint**: Use exactly Home → hero, About → titled placeholder, Portfolio → titled placeholder, and Contact → titled placeholder. Home alone contains feature content. At 320–1023px use a full-screen mobile navigation panel; at 1024px and wider use uncompressed, unwrapped desktop navigation. Preserve a usable server-rendered navigation list as the no-JavaScript fallback. Provide a visible close button, Escape handling, focus containment, and an announced expanded/open state with correct background inertness. Escape and explicit close return focus to the trigger; selecting a destination closes the panel and moves focus to that section's heading. Use a shadcn/ui accessible dialog primitive if its current generated implementation fits these behaviors; otherwise use native dialog semantics with focused, tested behavior. Do not build a generic overlay framework.
- **Current destination**: Derive the current navigation destination from the initial URL/hash and anchor/history changes; Home is current when the initial URL has no hash. Exactly one primary link exposes `aria-current="location"`. Style active, hover, and keyboard focus states distinctly. Do not add scroll-based active-section tracking.
- **Motion**: Use Motion only for concise panel and state transitions where it helps communicate opening and closing. Configure reduced-motion behavior and retain all core state and navigation when animation is disabled. Prefer CSS for decorative hover/focus feedback.
- **Design tokens**: Define semantic color, typography, spacing, radius, shadow, and content-width tokens in Tailwind v4's CSS-first theme plus regular CSS variables where needed. Use one consistent dark theme. Use fluid type and flexible max-width containers; do not lock page sections to screenshot dimensions.
- **Typography and imagery**: Use `next/font` with a restrained local or build-time self-hosted font selection and a system fallback. Keep body text to approximately 65–75 characters per line where practical. Use `next/image` for the confirmed portrait, with concise descriptive alt text when meaningful or empty alt when decorative; provide intrinsic dimensions or a stable aspect-ratio container to avoid layout shift. If no portrait is provided, render a designed non-image placeholder without misleading alt text.
- **Content**: Store profile labels and primary/secondary destinations as typed local data. Keep unverified profile values clearly marked as editable placeholders. Section placeholders communicate destinations only; do not seed them with fabricated portfolio details.
- **UI dependencies**: Use shadcn/ui only where its accessible primitives provide value, likely the modal navigation foundation. Use Lucide React for small decorative or action icons; hide decorative icons from assistive technology and give icon-only controls accessible names. Avoid adding a component library wholesale.
- **Validation scripts**: Provide development, build/start, lint, format-check, type-check, unit-test, and E2E scripts. The exact package manager and script names are finalized when the application scaffold is created; prefer npm if no repository convention exists.
- **Documentation**: Keep this feature's architecture decisions in this plan and its constraints in the UI contract. Add project README sections for prerequisites, scripts, environment configuration, and Vercel deployment during implementation.

## Testing Strategy

- **Vitest + React Testing Library**: Test typed navigation/profile presentation, section landmark and heading structure, button/link accessible names, and mobile navigation open/close behavior, Escape handling, focus movement/return, and reduced-motion state where applicable. Prefer role-based queries and user-visible assertions.
- **Playwright E2E**: Verify first impression, the four exact navigation destinations, current-location behavior on no-hash initial load, direct anchors, link activation, and browser back/forward; assert exactly one primary link has `aria-current="location"`. Verify active styling separately from hover and keyboard focus, including after mobile menu selection. Check destination heading visibility after anchors, full-screen mobile menu, close button and Escape behavior, keyboard flow, no-JavaScript fallback, and responsive layout at 320, 375, 768, 1024, 1440, and 1920 CSS pixels. Assert no document-level horizontal overflow at every required width and correct hero order at 320–767px. Navigation uses mobile mode at 320–1023px and desktop mode at 1024px and above.
- **Accessibility**: Run axe checks on the landing page and open mobile navigation states. Complete and document a manual review of keyboard-only navigation, visible focus indicators, screen-reader accessible names, mobile menu expanded/collapsed states, text and interactive-control contrast (4.5:1 normal text, 3:1 large text and control/state visuals), 200% browser zoom, and reduced-motion preferences. Automated checks complement but do not replace this review.
- **Quality gates and performance measurement**: Run ESLint, Prettier check, TypeScript type checking, Vitest, Playwright E2E, and the production build before declaring implementation complete. Run Lighthouse for both mobile and desktop with a documented device/testing profile; record Lighthouse version or execution date, Performance/Accessibility/Best Practices/SEO scores, and lab LCP/CLS. Record field INP, source, and time window only when sufficient real-user data exists; otherwise write “not yet measurable.” Do not mark an unmeasured field target as passed.
- **Deployment validation**: Use Vercel Preview for a production-like review before promoting the approved version to Production. The feature needs no environment variables; document Vercel project linking only if needed by the actual project setup.

## Complexity Tracking

No constitution exceptions or unnecessary infrastructure are planned.
