# UI Contract: Hero & About

**Feature**: [Hero & About](../spec.md)  
**Navigation contract**: [Feature 001 UI Navigation](../../001-portfolio-foundation/contracts/ui-navigation.md)

This is a user-facing content and interaction contract. It extends Feature 001; it does not replace the shell or navigation contract.

## Section Destinations and Hierarchy

- Home remains the hero at `#home`. Its semantic reading order is the full-name field, broad engineering role headline, one- or two-sentence introduction, required actions, optional supporting links, and portrait/fallback treatment. Desktop visual placement may put the portrait beside the copy without changing that reading order.
- The headline leads with a broad professional role. A single short focus phrase appears in the introduction only when verified; otherwise use the explicit editable placeholder.
- The authored-biography sentence rule applies only to authored copy. When a required identity, role, or introduction value is unavailable or unverified, use a neutral, non-empty plain-text value prefixed `Placeholder:` that names the field and verification status; show it as accessible text, not as a factual biography claim. Use the same marker for unavailable/unverified required About topic strings. Optional unavailable resources are omitted without placeholders.
- Keep the existing string-valued profile model. A placeholder is testably identified by its `Placeholder:` prefix; replace it and remove that marker only after verification. Placeholder wording must not imply employment history, qualifications, achievements, technical expertise, professional metrics, or personal details.
- The page has one primary page heading for the developer introduction. About is a subordinate section heading at `#about`.
- About addresses education, current professional experience, software engineering interests, general technical competencies, engineering approach, and professional direction in approximately 150 words or fewer. It does not contain Feature 004's detailed timeline, education history, or skills catalog.
- The existing Portfolio and Contact placeholders remain the destinations for `#portfolio` and `#contact`.

## Actions and Navigation

- **View Projects** is the primary hero link to `#portfolio`.
- **Contact Me** is the secondary hero link to `#contact`.
- Both are ordinary keyboard-operable in-page links. They update the URL fragment and use the existing navigation active-state/history behavior, including accessible current-location indication. Do not add scroll-based active-section tracking.
- A verified resume, GitHub, or LinkedIn link may appear as a lower-emphasis supporting link beneath the required actions. Each is omitted when its exact resource or URL is unavailable or unverified.
- No optional item renders as an empty button, `href`, fake URL, or broken download.

## Portrait and Fallback

- With no verified portrait, retain Feature 001's existing non-photo decorative portrait treatment. It is not presented as an image or depiction of the developer and is hidden from assistive technology as decoration.
- With a verified local photo, display it within the same stable frame. Provide a meaningful text alternative if informative; use an empty alternative if decorative. Loading or failure must not shift surrounding content or leave a broken-image indicator. On failure, reveal the same decorative fallback.
- On mobile, hero copy and required actions precede the portrait/fallback in reading order.

## Responsive and Visual Behavior

- Reuse Feature 001's dark canvas, blue accent palette, Inter typography, spacing, content width, focus token, buttons, and section patterns.
- At 320–767 CSS pixels, stack the hero with copy/actions first. At 768px and above, side-by-side placement is allowed only while copy remains readable and actions do not become compressed; stack otherwise. This does not alter the navigation's 1024px breakpoint.
- At 320, 375, 768, 1024, 1440, and 1920 CSS pixels, do not clip headings, overlap content, hide actions, or cause page-level horizontal overflow; About remains readable and scannable. At 200% zoom, content reflows and all links remain reachable.
- At deterministic 375×812 and 1440×900 viewports, the identity, headline, concise introduction, and both required actions appear in the initial viewport before scrolling, without clipping, overlap, or horizontal overflow.
- Optional links remain lower in the visual hierarchy than the two required actions. About text remains scannable and within its content-length budget.

## Accessibility, Progressive Enhancement, and Motion

- Use semantic sections and heading order; all required and optional links have clear names and visible keyboard focus. Meet applicable WCAG 2.2 AA contrast and practical 44×44 CSS-pixel target sizing.
- Essential hero/About content and in-page anchor links are present in server-rendered HTML. JavaScript is not needed to read them or follow required actions.
- Do not mutate React-managed `<html>` or navigation attributes before hydration. Keep the existing hydration-safe navigation enhancer as the only owner of active destination state.
- CSS may provide simple feedback. All information and actions remain usable with reduced motion or with animation unavailable.

## Validation Contract

- Component tests cover content, heading hierarchy, required links, optional-resource omission, profile content limits, and portrait fallback/alt states.
- Feature 002-specific browser tests in `tests/e2e/hero-about.spec.ts` verify direct anchors, CTA destinations, navigation current-location/history behavior, the exact 375×812 and 1440×900 first-view states before scrolling, optional-media failure and stable layout, keyboard/focus, reduced motion, and all specified widths. Existing Feature 001 navigation regression tests remain unchanged.
- Run automated Axe scans on the composed page separately. After implementation, record manual keyboard, visible focus, screen-reader names/reading order/CTA interaction, heading hierarchy, contrast, zoom/reflow, reduced-motion, and portrait alternative-text checks; automated results do not replace them.
- A fresh page load emits no hydration warning or error. Regression coverage must detect React hydration diagnostics and must not suppress them.
- Compare production mobile and desktop performance runs using the documented Feature 001 profiles; record actual results and field INP availability.
