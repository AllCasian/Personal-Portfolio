# UI Contract: Final UI Refinements, Responsive Navigation & Social Actions

This contract describes observable behavior for implementation and verification. It preserves existing Features 001–006 contracts except the explicitly approved changes: portrait branding, scroll visibility, targeted mobile composition, Hero index-label removal, one Email action instead of Copy Email, and Instagram action availability.

## Component and State Ownership

| Area | Owner | Contract |
|---|---|---|
| Brand link | `SiteHeader` | Existing “Portfolio home” link destination/name; use existing portrait in a circular dimension-reserved frame. No duplicate asset. |
| Navigation active destination | `initializeNavigation` in `src/lib/navigation-enhancement.ts` | Sole owner of URL/hash/history active state, seven destination links, and existing menu integration. Passive scroll visibility never changes `aria-current`. |
| Navigation visibility | Same existing enhancer lifecycle; separate visibility state | Passive scroll + one rAF-coalesced read; change visibility only on meaningful direction/edge/focus/menu events. No React scroll state, second active-state owner, scroll spy, or IntersectionObserver. |
| Content reveal | Feature 006 `motion-reveal` implementation | Existing one shared IntersectionObserver only; Feature 007 must not alter its visible-by-default, once-only, fail-open contract. |
| Public contact data | `projectPublicContact` server-side projection | Approved fields only; review metadata never passed to UI. Hero and Contact use the same projected values. |
| Shared actions | Server-rendered presentational component or equivalent existing primitive | Visible labels, existing icon package, Email primary, profile actions secondary. No new client boundary. |
| Footer | Existing `SiteFooter` | Minimal copyright/navigation behavior; only projected eligible owner name, existing missing-name fallback, no repeated action family. |

## Scroll Visibility State Machine

| State/event | Required visible behavior |
|---|---|
| First render / no JavaScript | Header remains normal-flow and visible; no hidden marker is emitted. Existing no-JavaScript navigation stays usable. |
| `scrollY <= 16px` | Force visible and reset directional baseline. |
| Short/non-scrollable page | Remain visible regardless of direction events. |
| `scrollY > 64px`, qualifying downward movement | Hide only after at least 12px downward travel from the active direction baseline, unless focus or menu lock applies. |
| Qualifying upward movement while hidden | Show after 12px upward travel. Remain visible until another qualifying downward movement. |
| Reversal under 12px | Does not toggle visibility. On reversal, begin measuring the new direction from its new baseline. |
| Focus enters/is within header controls | Reveal synchronously before the user is left focused on a visually hidden control. Keep visible through `:focus-within`. Never use `display:none`, `visibility:hidden`, `inert`, or `aria-hidden` to hide it. |
| Mobile dialog expanded | Keep the header/trigger visible; preserve native dialog focus and close behavior. |
| `hashchange` or `popstate` | Reveal header, reset directional baseline, and ensure destination heading clears the visible header. Current destination remains determined by existing URL/history logic. |
| Reduced motion | Remove decorative slide transition; visibility rule changes remain immediate and accessible. |

The enhanced header should retain its document-space reservation (for example, sticky positioning with a visual transform) so show/hide does not cause a layout jump. Anchor scroll padding/target margin must account for its measured occupied height. Scroll callbacks are passive, coalesced to at most one pending animation frame, and only write visibility when state changes. Cleanup removes listeners and cancels a pending frame.

## Portrait

- Reuse `/images/me1-2.jpg` and preserve the existing `Portfolio home` anchor and accessible name.
- Frame is circular, square, responsive, and reserves its dimensions before image load. Crop with `object-fit: cover` without stretching.
- Use the existing Next.js `Image` implementation; provide intrinsic dimensions or a positioned fill parent and an accurate `sizes` value.
- If image loading fails, the named brand/home link remains understandable and the reserved frame does not shift layout. Do not fabricate another portrait.
- Review the mobile dialog's decorative `YN` mark for consistency, without changing dialog semantics or creating another link.

## Responsive Composition

- Center Hero name/role/supporting copy and action group on mobile; center Contact heading/action group and only those section headings where the composition benefits.
- Keep long descriptions, project-detail prose, timelines, structured lists, and technical data aligned for reading.
- Preserve desktop alignment unless review establishes a specific need.
- No horizontal overflow, clipped glyph, action, focus ring, or navigation control at 320, 375, 390, 768, 1024, 1440, and 1920 CSS px or actual browser zoom 200%.
- Action links wrap naturally. Each has a visible label, descriptive accessible name, visible focus, and practical 44×44px minimum touch area.

## Hero Text and Introduction Marker

- The full `JUNIOR DATA ENGINEER` text and descenders (`g`, `j`, `p`, `q`, `y`) remain painted and readable in normal and reduced motion at supported widths.
- Identify the glyph clipping cause from DOM/computed styles/rendered bounds before changing styles. Preserve font, hierarchy, Hero motion sequence <=700ms, and stable layout; do not arbitrarily reduce font size.
- Remove the actual `.hero-index` decorative node rendered inside Hero as `01 INTRODUCTION`. Keep Hero semantics, About content/heading, `#about`, section order, and navigation links.

## Contact and Social Actions

- Hero and Contact render the same available action family using public projected values only.
- Exact destinations: `mailto:cristecasian@gmail.com`, `https://github.com/AllCasian`, `https://www.linkedin.com/in/casian-criste-b65582263/`, and `https://www.instagram.com/casiancriste`, subject to record and independent field approval.
- Profile links retain `target="_blank"` and `rel="noopener noreferrer"`. All actions have visible concise labels; icon-only naming is insufficient.
- Email is primary; profile/download actions are secondary. Preserve existing important Hero CTAs. Contact owns the main action group; Footer does not repeat it.
- Contact has exactly one Email action, uses normal mailto behavior without JavaScript, and has no oversized duplicate email display or Copy Email control.
- No CV file currently exists. Do not render a Download CV link/control until an actual file is verified and explicitly approved. Do not show disabled or broken controls.
- Keep the existing record approval, independent field factual verification, publication approval, server projection, and metadata exclusion tests.

## Motion and Compatibility

Reuse existing Feature 006 tokens and reduced-motion behavior. Do not add an animation library, another reveal observer, or a global state manager. The navbar slide can be removed under reduced motion; action focus and hover states remain understandable without movement. Keep all server-rendered content visible before hydration and when JavaScript is unavailable. Preserve seven destinations, project-route Portfolio state, hash/history behavior, passive-scroll invariance, mobile menu behavior, no-JS links, and all six project routes.
