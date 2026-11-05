# Research: Contact & Footer

**Feature**: [Contact & Footer](spec.md)
**Date**: 2026-11-05

## Repository Findings

- The homepage is an App Router Server Component at `src/app/page.tsx`. It maps the existing ordered section registry and currently renders `SectionPlaceholder` for `#contact`.
- The seven destinations already exist in `src/content/navigation.ts`. The header consumes this data through `PrimaryLinks`.
- `src/lib/navigation-enhancement.ts` is the sole post-hydration navigation owner. It initializes hash/history behavior and adds the `has-js` document class only after event handlers and initial active state are established.
- `SiteFooter` is already a Server Component and already receives home/project context. Project detail routes pass project context, allowing footer links to use root-prefixed homepage hashes.
- Features 003–004 use domain-specific typed source records and server-side public projections. Their raw records and review metadata are kept away from client components.
- Existing tests use Vitest/Testing Library under `tests/**` and Playwright under `tests/e2e`; an existing E2E runner accepts a base URL. Axe is integrated with Playwright.
- The project already includes React, Next.js, Tailwind CSS, Clipboard API browser primitives, Playwright, and Axe. No package addition is necessary.

## Decisions

### 1. Contact content and publication projection

**Decision**: Add a small Feature 005 contact source record with explicit record approval and independently gated name/email/GitHub/LinkedIn fields. Add a server-side projection returning only eligible public values. Keep it feature-specific and align its types and tests with Features 003–004.

**Rationale**: The existing publication implementations are adapted to their respective domains rather than exposed as a generic service. Contact needs only four values, so a local model is the smallest maintainable choice. It enforces independent factual verification and publication approval without refactoring older features.

**Alternatives considered**:
- Reuse a Feature 004 model directly: rejected because it couples contact data to professional-history records and imports a domain-specific public projector.
- Refactor a shared generic publication package: rejected because it creates cross-feature scope and migration risk without a concrete current need.
- Put public values directly in JSX: rejected because it bypasses source/public projection separation and weakens sentinel testing.

### 2. Server/client boundary and clipboard progressive enhancement

**Decision**: Keep the Contact section and Footer on the server. Use one isolated Client Component for Copy Email. Keep the control hidden and unfocusable in the server HTML and first client render. Reveal it only after both the existing `html.has-js` marker and a local post-hydration readiness state owned by `CopyEmailAction` are true. The component receives only the projected email string.

**Rationale**: Server-rendered markup alone does not guarantee that a Client Component's button is absent when JavaScript is disabled. The global marker proves the navigation enhancer initialized, not that this component's own event handler hydrated. The component-local readiness state closes that race without changing navigation ownership or adding global hydration state. In all non-ready states the button remains hidden and unfocusable; selectable email text and `mailto:` remain available.

**Alternatives considered**:
- Render button visible and disable it without JS: rejected because the control is unusable and contradicts FR-005.
- Add an inline pre-hydration script or another root DOM class writer: rejected because it risks hydration mismatch and duplicates enhancement ownership.
- Convert the entire Contact section to a Client Component: rejected because only clipboard access requires browser-side code.
- Reveal from `has-js` alone: rejected because navigation initialization can precede this Client Component's hydration.
- Use a `<form>` or server action: rejected because the feature needs no submission or backend.

### 3. Clipboard feedback

**Decision**: On activation, call `navigator.clipboard.writeText` with the exact public email. Catch rejected permissions and API absence; render a short status string in a polite live region. Keep focus on the initiating button and keep the email text selectable for manual copying.

**Rationale**: This matches the interaction contract and uses the platform API without dependencies. It also makes failure understandable without removing the underlying contact route.

**Alternatives considered**: Clipboard packages, hidden textarea fallback, automatic focus changes, and color-only feedback are unnecessary or conflict with the approved contract.

### 4. Footer navigation and active-state ownership

**Decision**: Extend `SiteFooter` with `ownerName` only from the approved server-side contact projection, the current year, and a named secondary navigation generated from `navigationItems`. If `ownerName` is ineligible or omitted, render the year-only copyright form and never hardcode the private value in the component. Preserve existing context behavior: section fragments on home and root-prefixed fragments on project details. Do not set `aria-current` or attach active-state logic to footer links.

**Rationale**: This reuses the existing seven-destination source and leaves `navigation-enhancement.ts` as the only state owner. The footer remains ordinary server-rendered navigation.

**Alternatives considered**: Maintaining a separate destination array, adding a footer-specific active state, or duplicating enhancer logic would risk link drift and conflicting state.

### 5. Copyright year

**Decision**: Read the current calendar year once during server rendering and reuse that value in the single copyright output. Static output advances when regenerated or deployed. Do not run a client timer or independently compute year in a hydrated child. Component tests freeze the system clock and verify deterministic output on both sides of a year boundary.

**Rationale**: The footer is a Server Component and its year does not need live updates during an open page session. This prevents a server/client mismatch at year boundaries.

**Alternatives considered**: Client-side date updates add JavaScript without product value; a hardcoded year becomes stale.

### 6. Contact visual treatment

**Decision**: Reuse current section heading, content width, typography, color, spacing, button/link, focus, and responsive utilities. Keep copy and contact destinations text-first; use no required decorative iconography, animation, or remote asset.

**Rationale**: Contact should complete the existing page without a redesign or a new dependency. Existing controls remain the visual reference.

### 7. External profile reachability

**Decision**: Preserve the owner-approved exact GitHub and LinkedIn URLs. The prior web fetch returned cache-miss errors, which do not establish unavailability. Record the verification limitation; do not guess or substitute URLs. Later manual review must inspect redirects and confirm the destination still belongs to the intended profile.

**Rationale**: Owner confirmation establishes factual source and approval under the current specification. A cache miss is an environment/network limitation, not evidence that a URL is invalid.

### 8. Verification profiles and baseline

**Decision**: Use the production build for Lighthouse on `/` and `/projects/drivewise`, each on comparable mobile and desktop profiles, and record all four categories, lab LCP/CLS, and INP as not yet measurable without sufficient field data. Preserve the latest known desktop results (home 86–87; Drivewise 87) as unresolved global release debt. A historical mobile Performance result of approximately 98 is approximate context only; its profile and run details are undocumented, so it is not reproducible baseline evidence or proof of current compliance.

**Rationale**: The constitution retains >=90 thresholds. Repeated, comparable measurements distinguish feature impact from the existing site baseline; they do not authorize a target change.

## Open Research Items

No product or architecture questions block task generation. Actual external URL reachability and manual accessibility outcomes require later verification and must not be inferred from this plan. An unreachable approved external URL is not automatically invalid and does not revoke owner publication approval; record the verification limitation and omit the URL only after confirming that it is unsafe, unavailable, unexpectedly redirected, or unrelated.

### 9. Publication-boundary integration fixture

Use a private, test-only Next.js fixture under `tests/e2e/fixtures/contact-publication-next/`, launched on an ephemeral local port by the test harness and excluded from production source/build routing. Pass sentinel JSON from the test runner in a server-process-only environment variable to the fixture's private `/test-publication-boundary` route; never use a `NEXT_PUBLIC_` variable or add this route to production `src/app`. The actual fixture route must not use an underscore-prefixed folder because Next.js reserves those folders as private and omits them from routing. Pass records through the real public projection, then render the production Contact and Footer components. Capture server HTML/head output, the Next.js serialized/Flight response, serialized Client Component props, and assets generated by this fixture; check field cases after Contact integration and owner-name omission after Footer integration. Assert ineligible sentinel values and private approval metadata payloads are absent while eligible controls remain. Keep a separate scan of the normal production build as additional coverage; it cannot substitute for this fixture because the production record intentionally contains no private sentinel values.
