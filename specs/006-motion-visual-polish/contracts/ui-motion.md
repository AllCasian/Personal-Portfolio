# UI Contract: Motion and Visual Polish

This contract layers optional motion and visual feedback onto existing Feature 001–005 markup. It does not change content, routes, navigation state, publication projection, contact behavior, or accessible semantics.

## Ownership and Boundaries

- Server-rendered section/page/card components remain Server Components.
- `src/components/motion/motion-reveal-enhancement.tsx` is a markup-free Client Component mounted by the root layout. It initializes only the browser reveal enhancement after hydration.
- `src/lib/motion-reveal.ts` owns one document-scoped IntersectionObserver lifecycle. It owns no React state, global animation manager, navigation state, URL/hash state, contact state, or publication data.
- `src/lib/navigation-enhancement.ts` remains the sole post-hydration owner of active navigation state. Motion may style existing hover/focus/active attributes but cannot add or change active-state behavior.
- All final visual styling and state presentation live in the existing global CSS/design token system. No new animation package or external runtime resource is introduced.

## Render and Enhancement States

| State | Server/client condition | Visual/content contract |
|---|---|---|
| Default | Server output, JavaScript disabled, before hydration | All content is visible and in final layout. No pending/hidden marker is emitted by the server. All links/actions work normally. |
| Motion unavailable | Reduced motion requested, IntersectionObserver missing, or initialization fails | All content remains visible. No reveal movement or stagger is required. Static accents and existing focus styles remain. |
| Pending reveal | Hydration completed, observation available, target was strictly below the viewport at initialization | Only this opt-in offscreen target may receive temporary reveal styling. Its position and reserved dimensions do not change. `:focus-within` immediately exposes it. |
| Revealed | Target intersects once or is forced visible by focus/preference/failure | Pending state is removed and the element stays visible for the remainder of the page visit, including reverse scrolling and anchor navigation. |

The enhancement MUST NOT set pending state on an element already visible, above the viewport, or currently targeted by the URL fragment. If observation cannot be established for any target, remove/avoid its pending marker and fail open. Cleanup disconnects observation and clears temporary pending state. No `has-js` marker alone may indicate reveal readiness.

## Motion Vocabulary

| Interaction | Eligible area | Behavior contract |
|---|---|---|
| Section reveal | Selected top-level groups/headings in About, Projects, Experience, Education, Skills, Contact and selected project-detail blocks | Gentle fade plus small upward settling movement; 350–500 ms; once only; no layout shift or nested repeated sequences. Initially visible and direct-anchor content is immediate. |
| Group stagger | Selected sibling project cards or similarly repeated top-level entries | 50–100 ms between siblings where used; <=300 ms total additional delay; no offscreen queue blocks access. |
| Hero entrance | Existing heading, introduction, and actions | Heading first, supporting text shortly after, actions next; complete within 700 ms. Content remains visible/readable, no layout shift and no continuous whole-Hero movement. |
| Project-card hover/focus | Existing actionable card/link affordance | Coordinated slight lift, background/gradient, border, title color, restrained glow or existing icon movement; focus is at least as visible as hover and retains the established focus outline. No large scale, rotation, tilt, or 3D treatment. |
| Other content emphasis | Experience/Education, Skills, Contact, navigation and Footer | Respect intensity hierarchy in FR-012; only actual interactive controls receive hover/focus feedback. Decorative content receives no misleading cursor, focus target, or button semantics. |
| Heading accent | Hero headline; optional Projects heading | Static gradient/highlight is the default. Moving shimmer is not part of the initial design unless later manual evidence establishes a need and a safe, single-pass treatment. No duplicated accessible text. |

Named motion tokens should be centralized in `src/app/globals.css`: fast interaction (150–300 ms), reveal duration, easing, reveal offset, bounded stagger, and restrained accent. Reuse existing `--accent`, `--accent-strong`, `--line`, `--focus`, surface/text and radius tokens. Animate only properties that do not alter document flow; keep focus outlines visible.

## Reduced Motion and Input Modes

When `prefers-reduced-motion: reduce` is active, decorative translation and moving shimmer are disabled, stagger delays are zero, and content is immediately readable. A static, contrast-checked gradient/highlight may remain. Focus, active-state, and success/failure feedback continue to be perceivable without depending on motion or color alone. If the preference changes to reduce during a page visit, pending reveals are exposed and ongoing decorative effects stop/reduce.

Hover-only styling is limited to devices that support hover with a fine pointer. Touch users receive the same content and actions without hover. Keyboard focus retains a visible outline and a clear card/action affordance. Motion must not move focus, alter reading order, announce decorative changes, clip content, or create horizontal overflow at 320–1920 CSS px or 200% zoom.

## Navigation, Routes, and Contact Invariants

- Preserve the existing seven navigation destinations, labels, anchors, hrefs, hash/history behavior, passive-scroll invariance, mobile menu, and desktop no-wrap behavior.
- Home remains current on `/`; hash state continues to be resolved by the existing navigation enhancer; Portfolio remains the sole current destination on approved `/projects/[slug]` routes.
- Preserve all six project-detail routes, project identities, publication filters, and direct navigation/refresh behavior.
- Preserve Contact public projection, eligible values, Copy Email local readiness gate, clipboard feedback, Footer owner eligibility, and year-only fallback.
- Footer/navigation motion is CSS visual polish only; it must not add `aria-current`, `data-section-link`, new navigation state, or a competing controller.

## Verification Contract

Automated tests verify state transitions, fail-open behavior, reduced motion, no-JavaScript and delayed-hydration visibility, direct anchors, once-only behavior, hover/focus affordance, touch usability, six detail routes, existing navigation/contact/publication behavior, responsive overflow and Axe results. Tests use observer/media-query mocks or browser readiness state, not arbitrary sleeps alone.

Manual evidence separately records before/after visual review at 375x812 and 1440x900, text/focus contrast and clarity, touch behavior, reduced-motion appearance, and actual 200% browser zoom. Browser, date, viewport/window, steps, results, and unresolved issues are recorded in the Feature 006 quickstart. Feature 004/005 manual tasks remain owned by those features.
