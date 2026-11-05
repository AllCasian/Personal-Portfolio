# Research: Feature 006 Motion, Microinteractions & Visual Polish

**Date**: 2026-11-05

**Branch**: `feature/006-motion-visual-polish`

## Repository Findings

- The project is a Next.js 16.4.2 App Router application using React 19.3.1, TypeScript 5.9.3, Tailwind CSS 4, and a shared `src/app/globals.css` stylesheet.
- `src/app/layout.tsx` is a Server Component root layout. It imports the global stylesheet and mounts the small `NavigationEnhancement` Client Component.
- Home and project detail page composition remains server-rendered. Project routes use `/projects/[slug]`, `generateStaticParams()`, and server-resolved published project content.
- Existing seven-destination navigation state is owned by `src/lib/navigation-enhancement.ts`. It sets `has-js` for navigation progressive enhancement. Motion must not change this owner or use it as a per-element readiness signal.
- Global CSS already defines dark-surface, text, accent, line, focus, content-width, spacing, radii and shadow tokens; button and navigation transitions; responsive breakpoints; and a `prefers-reduced-motion` override. Project cards and content groups have existing stable wrappers suitable for CSS hooks.
- Tests use Vitest/jsdom/React Testing Library under `tests/**/*.test.{ts,tsx}` and Playwright under `tests/e2e/`. Existing test helpers exercise reduced motion, no-JavaScript navigation, browser hydration, contact publication and all project routes.
- Feature 005 quickstart documents the production Lighthouse profile and results. Mobile reference sets currently have two runs per route, so a third pre-change run is needed for the specification's three-run comparisons. Desktop homepage has three runs; Drivewise has three, one of which is a high-TTFB outlier (81) while two stable repeats scored 87. Treat run variance separately from feature regression.
- No design-reference image files were found under `specs/`; the existing implemented design system is the available visual reference.

## Decisions

### 1. Use CSS for visual feedback and Hero motion

**Decision**: Put motion tokens and presentational states in `src/app/globals.css`. Keep hover, focus, card lift, border/background/title changes, navigation/footer link transitions, static gradient accents, and the bounded Hero sequence in CSS.

**Rationale**: These effects depend on existing pseudo-classes and static markup. CSS avoids event handlers and client state, keeps the Server Component boundary intact, uses the existing color/focus tokens, and supports reduced-motion media queries. Transform and opacity movement do not affect layout geometry; color/background transitions are limited to finite interactions.

**Alternatives considered**:

- A motion library: rejected because current requirements are finite CSS transitions and one visibility observer; no requirement demonstrates the need for a runtime library.
- React state and per-component event handlers: rejected because pointer/focus transitions are native CSS state and do not need React rendering.

### 2. Use one fail-open IntersectionObserver for selected reveals

**Decision**: A small client-only enhancement initializes one observer for opt-in DOM markers. The initializer adds temporary pending state only to eligible elements that are strictly below the viewport after initialization and only after confirming observer support. Intersection removes pending state and marks the target revealed once. Unsupported APIs, initialization errors, reduced motion, and cleanup leave or restore content visible.

**Rationale**: A once-only reveal that does not replay on reverse scrolling needs a discrete visibility transition. IntersectionObserver is event-driven and avoids a scroll-event loop. The default server markup has no hidden class or style, preserving no-JavaScript, delayed-hydration, direct-anchor, and unsupported-browser behavior.

**Alternatives considered**:

- CSS-only scroll-driven animation: rejected for the initial design because support/behavior varies and progress-based scroll timelines can reverse on reverse scrolling, conflicting with the once-only contract. CSS remains the fallback and owns all final styles.
- Hide-by-default markup/CSS until hydration: rejected because failed or delayed hydration could leave meaningful content invisible and create a flash of hidden content.
- One observer per card/component: rejected because it duplicates setup/cleanup and is unnecessary; a shared observer can observe the small selected set.
- Scroll listeners or polling: rejected because they add recurring main-thread work and are unnecessary for viewport entry detection.
- Reusing the navigation enhancer: rejected because reveal observation is not navigation state and would blur ownership; navigation remains unchanged.

### 3. Keep the enhancement separate from navigation state

**Decision**: Mount a dedicated `MotionRevealEnhancement` Client Component in the root layout. It returns no content and calls a standalone initializer from an effect. It does not own React state, active navigation, URL/hash handling, contact data, or publication rules.

**Rationale**: The existing navigation enhancer remains the sole navigation-state owner. A separate single-purpose initializer makes motion cleanup and tests independent without promoting whole sections to client components.

**Alternatives considered**:

- Add reveal logic inside `src/lib/navigation-enhancement.ts`: rejected because the navigation module has an explicit single responsibility and motion must not become a competing navigation concern.
- Convert individual section/card components to Client Components: rejected because all content is static server-rendered content and only the shared browser observer needs client capability.

### 4. Use static typography emphasis; omit moving shimmer initially

**Decision**: Start with a static readable gradient/highlight on the Hero headline and optionally a static accent on the Projects heading. Do not add moving shimmer unless a later evidence-based visual review demonstrates that static styling fails the approved direction and contrast/accessibility checks.

**Rationale**: The owner prefers static gradient when sufficient. A moving accent is decorative, needs reduced-motion handling, and adds visual/performance complexity without a demonstrated need. The static accent still supports the hybrid visual direction.

**Alternatives considered**:

- Continuous shimmer: rejected due to distraction, reduced-motion burden, and unnecessary ongoing paint.
- One-pass shimmer: available in the spec but not needed for the initial plan; can be reconsidered only with documented visual evidence.

### 5. Preserve interaction affordances and semantics

**Decision**: Apply hover styling only where hover/fine pointer is supported; preserve and strengthen `:focus-visible` appearance; keep all card content/actions present on touch. Noninteractive cards/badges do not receive tab stops or button semantics. Focus within a temporarily pending reveal forces its target visible.

**Rationale**: The same content must remain available to touch, keyboard, and assistive technology users; color alone does not carry state and motion does not change semantics.

### 6. Compare repeated, like-for-like performance measurements

**Decision**: Use the exact Lighthouse 13.5/Chrome 156 profiles documented in Feature 005 quickstart: mobile 412x823 CSS pixels/DPR 1.75 and desktop 1440x900/DPR 1 with the documented throttling/CPU profile. Capture a third pre-feature mobile run for each route, then compare three-run medians before/after for `/` and `/projects/drivewise`. Record all four categories, LCP, CLS, TBT, LCP element/subparts and run variance. If a later profile differs, document it; do not treat historical values with undocumented settings as comparable.

**Rationale**: This fulfills the three-run specification and separates Feature 006 regressions from existing debt and audit variability. Feature 005 shows sub-90 desktop Performance (homepage 86; Drivewise stable repeats 87, one outlier 81), and that debt remains open unless new measurements pass.

**Alternatives considered**:

- Compare against a single historical score: rejected because it cannot distinguish variance.
- Claim an existing desktop score below 90 as a pass if unchanged: rejected because constitutional targets remain >=90.
- Compare mobile historical values from an undocumented profile: rejected; use the documented profile and a completed pre-change run set.

## Compatibility / Open Risks

- Delayed hydration can occur after an initial page render. Therefore only offscreen opt-in groups may be marked pending; content already in or above the viewport is never hidden by initialization.
- A focused descendant must not remain visually hidden inside a pending group. CSS `:focus-within` is part of the UI contract and a Playwright assertion.
- Actual Chrome browser zoom is not equivalent to device scale factor or viewport resizing. Follow the Feature 005 manual procedure and record real zoom evidence separately.
- Existing reduced-motion CSS globally shortens transitions and animations. New motion rules must explicitly preserve final visible state and static focus feedback under that existing media query.
- Existing `has-js` supports navigation and clipboard readiness, but it does not prove the reveal initializer has run; the reveal design uses per-element enhancement state only after observer setup.

## Source References

- Installed Next.js docs: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `11-css.md`, and `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`.
- Current architecture: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/projects/[slug]/page.tsx`, `src/lib/navigation-enhancement.ts`, and section/project/layout components listed in `plan.md`.
- Existing style/tokens: `src/app/globals.css`.
- Test conventions: `vitest.config.ts`, `playwright.config.ts`, `tests/components/`, `tests/lib/`, and `tests/e2e/`.
- Lighthouse baseline/profiles: `specs/005-contact-footer/quickstart.md` and its linked reports.
