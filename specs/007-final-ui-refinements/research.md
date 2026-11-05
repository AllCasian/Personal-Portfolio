# Research: Feature 007

## Repository and Worktree

**Decision**: Plan against `C:/All/Projects/personal-portfolio/.worktrees/feature-007-final-ui-refinements` on `feature/007-final-ui-refinements`. Feature 006's motion and navigation code is present in this worktree; no transfer of the original checkout's uncommitted changes is required.

**Evidence**: `src/lib/motion-reveal.ts`, `src/components/motion/motion-reveal-enhancement.tsx`, `src/lib/navigation-enhancement.ts`, and Feature 006 specifications/reports exist here. The current status showed the Feature 007 specification directory untracked and no application source changes. The original checkout was not modified.

**Setup limitation**: `.specify/scripts/powershell/setup-plan.ps1 -Json` could not run because PowerShell script execution is disabled. No execution-policy changes or bypasses were attempted. The feature path/branch were verified from Git and `.specify/feature.json`; the checked-in template, constitution, specification, and repository source were read directly. There are no registered extension hooks in `.specify/extensions.yml`.

## Navbar Portrait and Image Handling

**Decision**: Reuse `profile.portrait.src` (`/images/me1-2.jpg`) in the existing `SiteHeader` home anchor. Use Next.js `Image` with an explicitly sized square frame (or a positioned `fill` frame) and `object-fit: cover`; reserve the frame dimensions and provide an accurate `sizes` value. Make the nested image decorative because the link already has the accessible name “Portfolio home.” Keep the link destination and responsive dimensions unchanged.

**Rationale**: This is the exact approved portrait already served in Hero and avoids a duplicate asset. The installed Next.js Image guide confirms width/height reserve intrinsic ratio, while `fill` requires a positioned parent and `object-fit` controls crop. Server rendering is possible without event handlers; no client boundary is warranted for the normal image path.

**Alternative considered**: A new image asset or client-side image-loading state. Rejected because neither is needed to reuse the approved file, and a new client component would add code for no measured benefit. If the image fails, the fixed frame and named home link remain stable and understandable; do not fabricate a replacement portrait.

**Observed discrepancy**: Desktop `SiteHeader` shows `P`; the mobile dialog header independently shows decorative `YN`. The implementation should review the latter in context so the same brand treatment is coherent, while keeping its dialog semantics and controls unchanged. Do not create another link or alter the primary navigation.

## Scroll-Aware Navbar

**Decision**: Extend `initializeNavigation` in `src/lib/navigation-enhancement.ts` and its existing `NavigationEnhancement` bootstrap. Add one passive scroll listener, coalesced through one `requestAnimationFrame`; apply visibility styling only when a threshold transition occurs. Keep this visibility state separate from the existing `syncCurrentDestination` active-state function. Do not add a React state loop, `IntersectionObserver`, scroll spy, or global state manager.

**Threshold interpretation**:

- At `scrollY <= 16px`, show the navigation and reset the movement baseline.
- Do not hide until `scrollY > 64px` and at least 12px of downward movement has accumulated from the current directional baseline.
- Once hidden, show after 12px of upward movement; keep it shown until a qualifying downward movement occurs.
- A direction reversal starts a new baseline, so movement below 12px cannot toggle visibility. Small pages remain visible.
- Focus within navigation, focus entering its controls, or an expanded mobile dialog forces it visible. Direct hash and browser history navigation force visibility and reset the baseline.

**Rendering/accessibility decision**: Use sticky positioning that retains the header's layout reservation, then a short transform to hide only the visual header. Avoid `display:none`, `visibility:hidden`, `inert`, and `aria-hidden`; these would make keyboard and assistive technology access dependent on a scroll gesture. A synchronous focus handler and CSS `:focus-within` reveal before an offscreen control remains focused. While the native mobile dialog is expanded, keep the trigger/header visible. On reduced motion, remove the slide transition but retain the same immediate visibility rules. With no JavaScript, do not emit a hidden state; the existing normal-flow links and `.no-js-mobile-links` remain available.

**Anchor positioning**: A shown sticky header can overlap a deep-linked section. On `hashchange` and `popstate`, reveal it, then use a shared scroll-padding/target-margin value based on the actual header height so destination headings remain visible below the header. Keep the existing hash/history active-state calculation authoritative; visibility must not set `aria-current` or modify the URL.

**Alternative considered**: A new navbar controller or observer. Rejected because it risks competing with the established active-state enhancer and Feature 006's single reveal observer. A passive direction listener is the smallest fit for this interaction and does not replace the reveal observer.

## Responsive Alignment and Hero Glyph

**Decision**: Make local mobile alignment changes for Hero heading, role, description, and action groups; Contact heading and actions; and section headings only when they improve balance. Preserve reading alignment for long project prose, technical lists, timeline content, structured data, and detail pages. Do not use a global `text-align:center` rule.

**Hero glyph investigation**: The actual `.hero-role` uses a responsive font clamp, negative letter spacing, `line-height: .99`, wrapping, and is animated through Feature 006 styles. These are candidates, not a proven cause. Before selecting a fix, inspect computed line-height/font metrics, wrapper heights, overflow/clip rules, transforms, and painted bounds at mobile/desktop and reduced-motion settings. The change must restore descenders `g`, `j`, `p`, `q`, and `y`, preserve type hierarchy and the <=700ms sequence, and avoid layout shift/font-size reduction without evidence.

**Alternative considered**: Shrink the role text or globally increase line-height. Rejected until measurement identifies the clipping mechanism; either could weaken hierarchy or alter layout unnecessarily.

**Introduction marker discrepancy**: Specification wording places “01 - introduction” after Hero; actual source is a decorative `.hero-index` node inside `HeroSection`, visually rendered “01 INTRODUCTION.” Remove that node only. Keep Hero semantics, About heading/ID, and anchor navigation untouched.

## Social Action Content and Rendering

**Decision**: Continue using `ContactSourceRecord` and `projectPublicContact` as the single source/projection path. Add exact Instagram URL `https://www.instagram.com/casiancriste` as its own verified and approved field. Extend public projection with `instagramUrl` only when both record and field are eligible. Pass that server-produced public object from `src/app/page.tsx` to Hero and Contact. Do not duplicate URL strings in components or profile content.

Render a shared, server-side action presentation from eligible projected fields, using existing `lucide-react` icons. Actions have visible concise labels and meaningful link destinations; Email uses `mailto:cristecasian@gmail.com`; profile links retain `target="_blank"` and `rel="noopener noreferrer"`. Email is primary and profile actions secondary. Keep existing Hero CTAs; avoid icon-only controls. The Contact section owns the full group; Footer remains minimal.

**Copy Email decision**: Remove the visible Copy Email action from Contact per the explicit owner decision. Do not remove the contact source field, record/field verification and approval checks, server projection, or publication sentinel tests. Update only UI assertions whose contract intentionally changed.

**CV decision**: Repository inspection found no CV/resume document. Do not render a link, placeholder, or disabled control. Keep a future optional CV field/asset contract only if a real document is later supplied/identified, reviewed for currency, and approved; publish only its eligible URL. This is a nonblocking missing input.

**Footer**: Preserve server-generated current year, owner name exclusively from projected eligible `ownerName`, year-only fallback, and navigation reuse. Do not duplicate social actions or introduce `aria-current` behavior.

## Feature 006 Compatibility

**Decision**: Reuse motion variables in `src/app/globals.css`; keep Hero, Contact, header and Footer server-rendered. Do not alter Feature 006's single reveal observer, once-only/fail-open behavior, reduced-motion rules, focus exposure, or visible-by-default server markup. Navbar scrolling uses a distinct passive `scroll` event in the existing navigation enhancer and does not create a second reveal system. Action and navbar transitions must respect existing reduced-motion media rules.

## Verification and Performance

**Decision**: Keep component/projection checks in existing Vitest suites and navigation/layout cases in Playwright. Use test-only ineligible contact records through the real projection and Hero/Contact renderers; assert sentinels and review metadata do not reach server HTML or serialized output. Keep the production asset scan as a separate defense, not a replacement for test-sentinel boundary coverage.

**Performance profiles**: Use the documented Feature 006 comparison environment: Lighthouse 13.5.0 / Chrome 156.0.8078.49, production build, one ready server lifecycle, mobile 412x823 CSS px at DPR 1.75 and desktop 1440x900 at DPR 1, same simulated network and 4x CPU settings. Run at least three audits for `/` and `/projects/drivewise` on each device profile before changes and repeat after. Record version/profile, scores for all four categories, LCP, CLS, TBT, transfer bytes, and run variance. Existing Feature 006 medians were Home 97 mobile / 85 desktop and Drivewise 98 mobile / 87 desktop. Desktop results remain pre-existing global debt below 90; compare regression independently and do not claim the threshold is met.

**Alternatives considered**: Use undocumented historical scores as the baseline; accept one noisy run; promise to fix desktop Performance as part of this feature. Rejected because none establishes a like-for-like regression measurement or falls within approved scope.
