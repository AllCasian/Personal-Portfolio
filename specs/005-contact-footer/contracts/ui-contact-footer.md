# UI Contract: Contact & Footer

- **Feature**: [Contact & Footer](../spec.md)
- **Plan**: [Implementation Plan](../plan.md)
- **Navigation source**: `src/content/navigation.ts`
- **Active-state owner**: `src/lib/navigation-enhancement.ts`

## Contact Section

- Replace the existing placeholder at the unique `#contact` anchor; do not add a new navigation destination.
- Render a semantic section with an associated heading, the approved concise invitation, and a logical reading order.
- Render only fields from the server-side public projection. Initial approved values are `Casian Criste`, `cristecasian@gmail.com`, `https://github.com/AllCasian`, and `https://www.linkedin.com/in/casian-criste-b65582263/`.
- Keep the email address visible and selectable. The Send Email anchor is `mailto:cristecasian@gmail.com`; its accessible name indicates the email action and does not promise delivery.
- GitHub and LinkedIn use their exact approved URLs, descriptive accessible names, `target="_blank"`, and `rel="noopener noreferrer"`.
- Omit missing, unverified, or unapproved fields without empty links or controls. If no eligible contact destination remains, show neutral availability copy instead.

## Copy Email Enhancement

- Copy Email uses the exact projected email and browser Clipboard API.
- The button is hidden in server markup and the first client render. It may be revealed only when both the existing `has-js` marker is present after `initializeNavigation()` completes and `CopyEmailAction` has completed its own hydration and marked local readiness. The global marker alone does not prove that the copy handler is ready.
- Visibility contract: (1) JavaScript disabled — hidden and unfocusable; (2) JavaScript enabled but component not hydrated — hidden and unfocusable even if `has-js` is present; (3) component hydrated and ready — visible and interactive.
- The local readiness state belongs only to the copy leaf; it does not control navigation or global hydration. Do not introduce another script, class writer, navigation owner, or global state manager.
- With JavaScript disabled, the email text, mailto anchor, and eligible social links remain ordinary server-rendered content.
- With JavaScript enabled, button activation either writes the exact email or announces a concise failure when the API is unsupported or rejects. Feedback uses a polite live status, is not color-only, and does not move focus.
- The copy client leaf receives only the projected email string. It never receives publication metadata or the private source record.

## Footer

- Use the existing `<footer>` landmark. Receive `ownerName` only from `getPublishedContactProfile()`; never hardcode or fall back to the source owner name in the Footer.
- When `ownerName` is eligible, render `© [current year] Casian Criste. All rights reserved.` When ineligible, omit the owner attribution and render `© [current year]. All rights reserved.`
- Generate the current year once on the server. A frozen test clock must cover both sides of a calendar-year boundary. Do not add client date logic.
- Include a separately named, compact secondary navigation whose seven labels and destinations derive from `navigationItems`.
- On `/`, footer section destinations use their existing fragment links. On project detail routes, section destinations use root-prefixed homepage fragments.
- Footer links do not set `aria-current`, add `data-section-link` state ownership, or alter the primary navigation enhancer. The primary header remains the sole current-location navigation.
- Static rendering can refresh the year at regeneration/deployment.

## Publication Test Contract

- Use a test-only isolated Next fixture app under `tests/e2e/fixtures/contact-publication-next/`, served only on an ephemeral local test port and excluded from the production application and deployment build. Its fixture-only `/test-publication-boundary` route reads sentinel JSON from a server-process-only test environment variable (never a `NEXT_PUBLIC_` variable); it must not exist in `src/app` or the production route table. Do not use an underscore-prefixed route folder because Next.js reserves those folders as private and omits them from routing.
- Inject unique runtime sentinels from the test runner over loopback for approved+verified, verified+unapproved, unverified+approved, unverified+unapproved, and an unapproved record with otherwise approved fields; include private reviewer/provenance payload sentinel values.
- Pass these records through the actual `projectPublicContact()` function and render the production `ContactSection` and `SiteFooter` using only the resulting public DTO. Contact field cases are tested after Contact integration; Footer owner-name exclusion is tested after projected Footer integration.
- Assert private sentinel values and private approval/provenance payloads do not appear in server HTML/head metadata, Next.js Flight/serialized output, serialized `CopyEmailAction` props, or fixture-generated client assets. Do not compile sentinel values into fixture source. Approved fields act as positive controls.
- Separately scan the normal production build output for sentinels and review metadata. This normal build scan is supplementary and does not replace the injected fixture test.
- The fixture must not register a route in `src/app`, publish test data, or enter the deployment build.

## Accessibility and Responsive Behavior

- Preserve semantic headings, landmarks, link names, logical focus/reading order, visible focus, applicable WCAG 2.2 AA contrast, and practical 44×44 CSS-pixel targets.
- Clipboard messages are programmatically announced without focus movement; success and failure remain understandable without color.
- Respect reduced-motion preferences; no motion is required for comprehension.
- At 320, 375, 768, 1024, 1440, and 1920 CSS pixels and at 200% zoom, prevent horizontal overflow, overlap, clipping, and unreachable controls.
- Automated Axe and keyboard assertions do not replace recorded manual screen-reader, keyboard, contrast, focus-order, zoom, and reduced-motion review.

## Navigation Invariants

- Reuse the current seven destinations and existing navigation enhancer.
- Hash/history behavior, passive-scroll invariance, no-JavaScript navigation, and Portfolio current state on project detail routes remain unchanged.
- Contact hash navigation and browser back/forward behavior stay synchronized through the existing owner.
- Footer links are standard anchors and do not create another active-state controller.
