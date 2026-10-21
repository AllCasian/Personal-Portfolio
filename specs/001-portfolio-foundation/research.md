# Research: Portfolio Foundation

**Date**: 2026-10-21
**Feature**: [Portfolio Foundation](./spec.md)

## Decisions

### Next.js App Router and Server Components

- **Decision**: Use the Next.js App Router with React Server Components for the static shell, landing page, hero, placeholder sections, and footer. Isolate interactive behavior in the mobile navigation client boundary.
- **Rationale**: This aligns with the requested stack and keeps static content out of the browser's JavaScript bundle while retaining a small place for stateful navigation behavior.
- **Alternatives considered**: Making the page a Client Component would increase client-side work without a user-facing need; a separate backend is unnecessary for a static portfolio foundation.
- **Source**: [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

### Tailwind CSS v4 Design Tokens and Responsive Layout

- **Decision**: Use Tailwind CSS v4's CSS-first theme variables for reusable design tokens. Define mobile-first layouts with flexible max-width containers, fluid typography, and responsive variants; add custom breakpoints only for demonstrated design needs.
- **Rationale**: The responsive model directly supports the specified viewport range and gives one source of truth for typography, color, spacing, radius, and shadows.
- **Alternatives considered**: Fixed screenshot-sized dimensions would fail at intermediate widths; a second styling system would add duplication.
- **Sources**: [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme), [Tailwind CSS responsive design](https://tailwindcss.com/docs/responsive-design)

### shadcn/ui Accessible Primitives

- **Decision**: Add only the shadcn/ui components needed for this feature. Prefer its accessible dialog primitive for the full-screen mobile navigation when the generated implementation satisfies the interaction contract; otherwise use native dialog behavior and a focused wrapper.
- **Rationale**: shadcn/ui provides copied, editable components that fit the requested Tailwind v4 direction without requiring an all-or-nothing component library. Its current setup documents Tailwind v4 support.
- **Alternatives considered**: A full UI library would add unused code and constrain the visual direction; hand-rolling focus management without a tested primitive adds accessibility risk.
- **Sources**: [shadcn/ui with Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4), [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next)

### Progressive Mobile Navigation Enhancement

- **Decision**: Render useful primary navigation links in server HTML. After hydration, present a menu trigger and full-screen dialog at narrow widths, while retaining desktop links at wider widths. Keep server-rendered links available if JavaScript is disabled.
- **Rationale**: The spec requires both a full-screen mobile menu and working navigation with JavaScript unavailable. A server-rendered baseline prevents content from being locked behind client-side state.
- **Alternatives considered**: Rendering only a client-controlled hamburger leaves no usable navigation when JavaScript fails; keeping a visible wrapped link row on all mobile widths conflicts with the clarified full-screen pattern.
- **Source**: [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

### Motion and Reduced Motion

- **Decision**: Use Motion for React only for the mobile panel's purposeful open/close transition. Set a user-respecting reduced-motion policy, and ensure the panel still opens and closes without animation.
- **Rationale**: Motion is requested, but motion is not required to convey content. The panel interaction has a clear state transition and can be reduced without changing semantics.
- **Alternatives considered**: Scroll-driven, parallax, or continuously animated effects are unnecessary and conflict with the constitution's usability direction; CSS-only transitions remain suitable for ordinary hover/focus states.
- **Sources**: [Motion for React reduced-motion hook](https://motion.dev/docs/react-use-reduced-motion), [MotionConfig reduced-motion policy](https://motion.dev/docs/react-motion-config)

### Fonts and Images

- **Decision**: Load one carefully chosen font family through `next/font` and local assets where available. Use `next/image` for the supplied/confirmed portrait, with accurate alt behavior and reserved dimensions; use a designed placeholder if no confirmed portrait asset is available.
- **Rationale**: Local/self-hosted font delivery avoids a browser request to a font provider and reduces layout shift. Image dimensions and responsive sizing support stable layout and efficient delivery.
- **Alternatives considered**: Remote CSS font imports introduce another network dependency; arbitrary background images make meaningful image alternatives and intrinsic sizing harder to manage.
- **Sources**: [Next.js font optimization](https://nextjs.org/docs/app/api-reference/components/font), [Next.js Image component](https://nextjs.org/docs/app/api-reference/components/image)

### Testing Approach

- **Decision**: Use Vitest and React Testing Library for focused component behavior, Playwright for browser journeys and viewport coverage, and axe checks plus manual accessibility review.
- **Rationale**: Component tests provide fast feedback on menu semantics and focus behavior; browser tests validate actual responsive layout and interactions. Automated accessibility scans do not cover every keyboard or screen-reader behavior, so manual checks remain required.
- **Alternatives considered**: Unit tests alone cannot validate viewport overflow or native browser focus behavior; E2E-only testing is slower and less focused for component-level regressions.
- **Sources**: [Vitest React Browser testing](https://vitest.dev/api/browser/react), [Playwright auto-retrying assertions](https://playwright.dev/docs/test-assertions)

### Vercel Delivery

- **Decision**: Deploy the Next.js app through Vercel Preview and Production environments. Keep this feature environment-variable-free; do not introduce secrets or configuration merely to support a static landing page.
- **Rationale**: Vercel supports Next.js deployment directly and provides separate Preview and Production environments suitable for validation before release.
- **Alternatives considered**: Self-managed hosting adds operations work without a requirement; deploying directly to Production skips the preview validation step.
- **Sources**: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Vercel deployment environments](https://vercel.com/docs/deployments/environments)

## Unresolved Items

- The repository currently contains only Spec Kit artifacts, not an application scaffold or package-manager convention. At implementation time, choose the current compatible releases, Node.js LTS, and npm unless project setup establishes a different convention. Verify Next.js, React, Tailwind CSS v4, shadcn/ui, Motion, Vitest, and Playwright compatibility before installation; do not hard-code versions in this plan.
- The confirmed portrait, name, role, and social/contact URLs are content inputs for implementation, not technical blockers. Keep them editable and clearly marked until confirmed.
