# Research: Portfolio Foundation

**Date**: 2026-10-21
**Feature**: [Portfolio Foundation](./spec.md)

## Decisions

### Next.js App Router and Server Components

- **Decision**: Use the Next.js App Router with React Server Components for the full page, including navigation. Use same-page anchors, a native modal dialog, and a small client enhancement component that initializes after hydration for active destination state and post-selection focus.
- **Rationale**: Lighthouse identified unused JavaScript and a late shared-runtime task. Native dialog behavior and a small post-hydration initializer retain the focus trap, Escape behavior, hash/history synchronization, and no-JavaScript links while keeping React-managed attributes unchanged until hydration completes.
- **Alternatives considered**: Making the page a Client Component would increase client-side work without a user-facing need; a separate backend is unnecessary for a static portfolio foundation.
- **Source**: [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

### Tailwind CSS v4 Design Tokens and Responsive Layout

- **Decision**: Use Tailwind CSS v4's CSS-first theme variables for reusable design tokens. Define mobile-first layouts with flexible max-width containers, fluid typography, and responsive variants; add custom breakpoints only for demonstrated design needs.
- **Rationale**: The responsive model directly supports the specified viewport range and gives one source of truth for typography, color, spacing, radius, and shadows.
- **Alternatives considered**: Fixed screenshot-sized dimensions would fail at intermediate widths; a second styling system would add duplication.
- **Sources**: [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme), [Tailwind CSS responsive design](https://tailwindcss.com/docs/responsive-design)

### shadcn/ui Accessible Primitives

- **Decision**: Add only the shadcn/ui components needed for this feature. Use native `<dialog>` for the mobile navigation because its modal focus containment, Escape behavior, and focus restoration meet the interaction contract without a React dialog dependency.
- **Rationale**: The navigation panel is a small, well-defined interaction. The native primitive passed Playwright checks and supports a server-rendered navigation shell.
- **Alternatives considered**: A full UI library would add unused code and constrain the visual direction; hand-rolling focus management without a tested primitive adds accessibility risk.
- **Sources**: [shadcn/ui with Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4), [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next)

### Progressive Mobile Navigation Enhancement

- **Decision**: Render primary navigation links and the mobile dialog in server HTML. A small effect-based enhancement enables the trigger, modal behavior, active hash/history state, and post-selection focus at narrow widths after hydration. Keep server-rendered links visible if JavaScript is disabled.
- **Rationale**: The spec requires a full-screen mobile menu and working navigation when JavaScript is unavailable. Navigation content stays server-rendered; only a small post-hydration effect wires the native dialog and synchronizes current-location state, avoiding React-managed menu state while preserving the no-JavaScript links.
- **Alternatives considered**: Rendering only a client-controlled hamburger leaves no usable navigation when JavaScript fails; keeping a visible wrapped link row on all mobile widths conflicts with the clarified full-screen pattern.
- **Source**: [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

### Motion and Reduced Motion

- **Decision**: Use a brief CSS keyframe transition for the native mobile dialog and disable it under `prefers-reduced-motion: reduce`.
- **Rationale**: This simple open-state animation does not need a motion runtime. CSS preserves the visual feedback while supporting server-rendered navigation, and Playwright verifies the reduced-motion state.
- **Alternatives considered**: A React motion package and scroll-driven or continuous animation add code without improving this one panel interaction.
- **Evidence**: The 2026-11-02 Lighthouse reports and resource totals are recorded in `quickstart.md` and `reports/`.

### Fonts and Images

- **Decision**: Load one carefully chosen font family through `next/font` and local assets where available. Use `next/image` for the supplied/confirmed portrait, with accurate alt behavior and reserved dimensions; use a designed placeholder if no confirmed portrait asset is available.
- **Rationale**: Local/self-hosted font delivery avoids a browser request to a font provider and reduces layout shift. Image dimensions and responsive sizing support stable layout and efficient delivery.
- **Alternatives considered**: Remote CSS font imports introduce another network dependency; arbitrary background images make meaningful image alternatives and intrinsic sizing harder to manage.
- **Sources**: [Next.js font optimization](https://nextjs.org/docs/app/api-reference/components/font), [Next.js Image component](https://nextjs.org/docs/app/api-reference/components/image)

### Testing Approach

- **Decision**: Use Vitest and React Testing Library for focused server markup and navigation-state behavior, Playwright for browser journeys and viewport coverage, and axe checks plus manual accessibility review.
- **Rationale**: Component tests provide fast feedback on accessible markup and current-location synchronization; browser tests validate native dialog focus behavior and responsive layout. Automated accessibility scans do not cover every keyboard or screen-reader behavior, so manual checks remain required.
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
