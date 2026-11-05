# Feature Specification: Final UI Refinements, Responsive Navigation & Social Actions

**Feature Branch**: `feature/007-final-ui-refinements`

**Created**: 2026-11-05

**Status**: Draft — clarification decisions recorded

**Input**: Owner request to make focused refinements to portfolio branding, scroll-aware navigation, mobile composition, Hero typography, and social/contact actions.

## Feature Overview

Feature 007 polishes the existing portfolio without redesigning it or changing its established content, routes, publication rules, motion system, accessibility behavior, or design identity. It makes the portfolio easier to orient in while scrolling, balances selected content on narrow screens, fixes a confirmed clipped Hero glyph, and presents available contact and social destinations as a coherent action family.

The existing Hero portrait at `/images/me1-2.jpg` is the approved portrait source for navbar branding. Email, GitHub, LinkedIn, and Instagram have owner-confirmed destinations; the Instagram URL is `https://www.instagram.com/casiancriste`. Repository inspection found no downloadable CV document, so a CV action remains omitted until an actual document is supplied or identified and explicitly approved.

## Clarifications

### Session 2026-11-05

- Q: Should the existing Copy Email action be retired, or retained as a secondary, nonduplicative action alongside the single Send Email action? → A: Retire Copy Email. Provide one Email action using the exact approved `mailto:` destination; do not render a separate Copy Email control or oversized duplicate email presentation. Preserve the approved email through the existing publication eligibility rules.
- Q: How should the navbar respond to scroll direction, focus, history navigation, and reduced motion? → A: It is visible at the top (within 16 CSS pixels), remains visible on pages too short to scroll, hides only after the page is more than 64 CSS pixels below the top and downward travel reaches 12 CSS pixels, and reappears after 12 CSS pixels of upward travel. Smaller reversals do not change visibility. It remains visible while its controls are focused or its menu is expanded; direct hash and browser history navigation reveal it and leave the target heading below its visible edge. Reduced motion removes sliding. Without JavaScript, the navigation stays in normal page flow and its links remain usable. Visibility never changes the active destination.
- Q: Which content should be centered on narrow layouts? → A: Center the Hero heading, role, supporting description, and action groups; center the Contact heading and action group and section headings where they improve balance. Keep long project descriptions, technical lists, timelines, structured content, and project-detail prose aligned for readability. Do not change desktop alignment without a demonstrated need.
- Q: How should the known Hero glyph defect be handled? → A: The full lowercase `g` descender and other descenders must remain visible at mobile and desktop widths, with motion enabled and reduced. Investigate the actual cause; do not assume a line-height, overflow, transform, or font-size cause before evidence.
- Q: Should the introductory label be replaced or retained? → A: Remove “01 - introduction” without replacement numbering; preserve About content, heading, section ID, anchors, and navigation, adjusting spacing only if required.
- Q: Which social destinations are approved and how should action groups be arranged? → A: Use the exact owner-approved email, GitHub, LinkedIn, and Instagram destinations subject to existing publication eligibility. Use a shared rounded-pill visual family with visible concise labels and icons, make Email the primary action and social actions secondary, keep existing essential Hero actions, let groups wrap naturally, and keep the full action group in Contact rather than duplicating it in the minimal Footer.
- Q: Is there an approved CV document to publish? → A: Repository inspection found no CV/resume document. Do not create or link a placeholder; keep Download CV unavailable until an actual document is supplied or identified and explicitly approved.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Stay Oriented While Scrolling (Priority: P1)

As a visitor browsing a long portfolio page, I want the navigation to remain available when I reverse scroll so I can move to another section without returning to the top.

**Why this priority**: Navigation that disappears during downward reading should remain discoverable and operable during upward movement across pointer, touch, and keyboard use.

**Independent Test**: On desktop and mobile, scroll down from the top and confirm the navigation may hide; then scroll upward and confirm it returns and remains usable. Verify the URL/hash/history continues to determine the active destination.

**Acceptance Scenarios**:

1. **Given** a page is at its top, **When** it first renders, **Then** the primary navigation is visible.
2. **Given** a scrollable page is more than 64 CSS pixels below the top, **When** the visitor travels downward by at least 12 CSS pixels, **Then** the navigation hides without changing the active destination.
3. **Given** the navigation has hidden during downward scrolling, **When** the visitor travels upward by at least 12 CSS pixels, **Then** it reappears and remains visible until a subsequent qualifying downward movement.
4. **Given** a keyboard user tabs to a primary navigation control or a mobile menu is expanded, **When** the navigation would otherwise be hidden, **Then** the navigation remains visible and its controls remain reachable.
5. **Given** a visitor opens a project-detail route, **When** the navigation is shown, **Then** Portfolio remains the sole current destination.
6. **Given** a visitor uses a direct anchor or browser back/forward navigation, **When** the destination is reached, **Then** the navigation is visible and the target heading is not obscured.
7. **Given** JavaScript is disabled or the page is too short to scroll, **When** the visitor uses the page, **Then** the navigation remains in normal document flow and all links remain usable.

### User Story 2 — Recognize the Portfolio and Read the Hero (Priority: P1)

As a visitor, I want the site brand to identify its owner and the Hero role title to display completely so the portfolio looks personal and its introduction is easy to read.

**Why this priority**: The current placeholder brand and clipped descender are prominent defects at the start of the experience.

**Independent Test**: Inspect the navbar and Hero at mobile and desktop widths, with motion enabled and reduced, and confirm the approved portrait appears without distortion or layout shift and every glyph in the role title is fully visible.

**Acceptance Scenarios**:

1. **Given** the navbar is displayed on the homepage or a project detail, **When** a visitor views the brand link, **Then** it uses the existing approved Hero portrait in a circular, undistorted presentation and preserves its home-link behavior and accessible name.
2. **Given** the Hero role reads “JUNIOR DATA ENGINEER”, **When** it renders at supported mobile and desktop widths, **Then** the complete text, including the descender of “g”, is visible without clipping.
3. **Given** motion is enabled or reduced, **When** the Hero appears, **Then** its existing heading, introduction, actions, and entrance behavior remain readable and stable.
4. **Given** the introduction begins, **When** the visitor reaches the About section, **Then** the “01 - introduction” decorative label is absent while the About heading, anchor, and navigation behavior remain intact.

### User Story 3 — Use Clear Contact and Social Actions (Priority: P1)

As a recruiter or collaborator, I want a compact set of clearly labeled contact and profile actions so I can reach the developer using confirmed destinations.

**Why this priority**: The Contact and Hero action groups are direct paths to the owner and should not repeat or misrepresent destinations.

**Independent Test**: Inspect Hero and Contact action groups, follow the email and approved social destinations, and confirm unsupported destinations have no active control.

**Acceptance Scenarios**:

1. **Given** approved email, GitHub, LinkedIn, and Instagram values are eligible for public display, **When** Hero or Contact actions render, **Then** they use those exact approved destinations and the shared action family has consistent visual treatment.
2. **Given** no owner-approved CV file is available, **When** action groups render, **Then** no empty, broken, draft, or guessed download link is shown.
3. **Given** an actual CV file is later supplied or identified and approved, **When** the Download CV action is published, **Then** it links to that exact approved document with a meaningful filename.
5. **Given** Contact is displayed, **When** its actions are presented, **Then** it contains one Email action to the exact approved destination and no Copy Email control or oversized duplicate email presentation.

### User Story 4 — Browse a Balanced Mobile Layout (Priority: P2)

As a visitor using a phone or narrow window, I want the main introduction and selected headings/actions to feel balanced and centered without sacrificing readability of dense content.

**Why this priority**: The owner reports that the existing responsive composition feels too left-heavy, while long technical content still benefits from readable alignment.

**Independent Test**: Review the required narrow viewport widths and actual 200% browser zoom. Confirm Hero typography, supporting text, and primary action groups are centered where appropriate, dense content remains readable, and no horizontal overflow or unreachable control occurs.

**Acceptance Scenarios**:

1. **Given** a narrow responsive viewport, **When** the visitor views the Hero, **Then** its primary typography, supporting description, and primary action group are balanced and centered.
2. **Given** a section heading is a focal point, **When** it appears on a narrow layout, **Then** it may be centered while long-form descriptions, technical lists, timeline details, and project-detail prose retain readability-oriented alignment.
3. **Given** the viewport ranges from 320 through 1920 CSS pixels or the browser is at actual 200% zoom, **When** the visitor uses the portfolio, **Then** content fits without horizontal overflow, clipping, awkward wrapping, or unreachable actions.

### User Story 5 — Move Between Available Actions Consistently (Priority: P2)

As a keyboard, touch, or pointer user, I want the Hero and Contact actions to share a recognizable visual language and clear accessible names so I can identify and activate them confidently.

**Why this priority**: Consistent actions improve polish across the existing page without adding new navigation destinations or changing content.

**Independent Test**: Use the Hero and Contact action groups with keyboard, touch, and pointer input. Verify understandable labels, visible focus, usable touch targets, reduced-motion compatibility, and no dependency on hover.

**Acceptance Scenarios**:

1. **Given** an action is available, **When** it is viewed or focused, **Then** its label or accessible name clearly identifies its destination or purpose.
2. **Given** a visitor uses keyboard or touch input, **When** they interact with actions, **Then** all available actions remain operable with visible focus and without hover-only information.
3. **Given** reduced motion is requested, **When** actions are rendered or focused, **Then** meaningful state and focus remain perceivable without unnecessary movement.

### Edge Cases

- The portrait asset fails to load or is unavailable; the brand link must remain understandable, fallback behavior must avoid layout shift, and no replacement portrait may be fabricated.
- Scroll direction changes by less than 12 CSS pixels; navbar visibility must not flicker or jump.
- A keyboard user tabs to navigation while it is hidden or focus remains in the navigation during scrolling.
- A mobile menu is expanded while the visitor scrolls.
- The page is too short to scroll, or direct hash/browser history navigation restores a deep scroll position.
- The navbar is hidden when the user activates an anchor or history destination; the destination heading must remain clear of the visible navbar.
- The Hero text wraps differently at 320 CSS pixels, at 200% zoom, or with reduced motion enabled; descenders must remain visible.
- GitHub, LinkedIn, and email eligibility changes under the established publication rules; only currently eligible values may render.
- The approved Instagram URL becomes ineligible under the existing publication rules; omit the action.
- A CV file is absent, draft, unapproved, or unavailable; omit the download action.
- The Copy Email action is retired for this feature; the single approved Email action remains a normal link and does not depend on JavaScript.
- Social labels, action wrapping, or portrait placement create clipping, overlap, or horizontal overflow on narrow layouts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The navbar brand MUST replace its template letter mark with the existing owner-approved Hero portrait at `/images/me1-2.jpg`, using the same source image rather than introducing a duplicate portrait asset.
- **FR-002**: The navbar portrait MUST appear circular and balanced across desktop and mobile, preserve the image proportions without distortion, retain the existing brand link destination and accessible name, and reserve stable layout space while loading.
- **FR-003**: The primary navigation MUST be visible when the page is within 16 CSS pixels of its top and MUST remain visible on pages too short to scroll.
- **FR-004**: On desktop, tablet, and mobile scrollable pages, the primary navigation MUST hide only when the page is more than 64 CSS pixels below the top and the visitor has moved at least 12 CSS pixels downward. After it hides, at least 12 CSS pixels of upward movement MUST make it visible again; it remains visible until a subsequent qualifying downward movement. Direction changes smaller than 12 CSS pixels MUST NOT toggle visibility.
- **FR-005**: When shown away from the page top, the navigation MUST reappear at the top edge without causing a document layout jump. Direct anchor navigation and browser back/forward navigation MUST reveal the navigation and leave the target heading visible below its occupied area. A short transition MUST NOT obscure content.
- **FR-006**: Navigation visibility MUST remain operable by keyboard, pointer, and touch. Tabbing to a navigation control MUST expose the navigation before focus is left on an offscreen control. The navigation MUST remain visible while a control has focus or its mobile menu is expanded; no visitor may need a specific scroll gesture to recover access.
- **FR-007**: Scroll-aware visibility MUST NOT own or change active navigation state. The existing URL/hash/history behavior, seven destinations, passive-scroll invariance, project-detail Portfolio current state, and no-JavaScript navigation MUST remain unchanged. With JavaScript disabled, the navigation MUST stay in normal page flow with all links usable.
- **FR-008**: Reduced-motion preferences MUST remove decorative sliding while preserving navigation visibility behavior, immediate access, and focus feedback.
- **FR-009**: Responsive layouts MUST center the Hero heading, role, supporting description, and action groups; the Contact heading and action group; and section headings when centering improves narrow-screen balance.
- **FR-010**: Long project descriptions, technical lists, timeline information, structured content, and project-detail prose MUST retain alignment that supports reading; desktop alignment MUST remain unchanged unless a demonstrated consistency need requires adjustment.
- **FR-011**: Layouts MUST remain usable from 320 through 1920 CSS pixels and at actual 200% browser zoom without horizontal overflow, clipping, overlap, awkward wrapping, or unreachable controls.
- **FR-012**: The Hero role text “JUNIOR DATA ENGINEER” MUST display every glyph and descender, including “g”, without clipping at supported viewport widths and at reduced motion.
- **FR-013**: The Hero typography correction MUST preserve the existing font family, approved visual hierarchy, entrance behavior, and maximum 700-millisecond sequence, and MUST NOT introduce layout shift or an unnecessary font-size reduction.
- **FR-014**: The decorative “01 - introduction” label MUST be removed without removing or changing the About heading, section identity, anchor target, accessibility semantics, or navigation behavior.
- **FR-015**: The Contact presentation MUST contain one clear Email action using the exact approved email through a `mailto:` destination and MUST remove the oversized repeated email presentation.
- **FR-016**: The existing Copy Email control MUST be retired. Contact MUST provide one Email action using the exact approved `mailto:` destination and MUST NOT render a separate copy control or oversized duplicate email presentation; the email value remains subject to existing record-level and field-level publication eligibility.
- **FR-017**: Hero and Contact MUST use a consistent family of available Email, GitHub, LinkedIn, Instagram, and CV actions. Use rounded pill-shaped actions with clear visible labels and appropriate icons, consistent height, borders, spacing, focus/hover feedback, and touch targets of at least 44 by 44 CSS pixels where practical. Email is primary; profile and download actions are visually secondary. Existing essential Hero actions MUST remain prominent, the Hero action groups MUST wrap naturally, and the full social-action group MUST NOT be duplicated in the minimal Footer.
- **FR-018**: Email, GitHub, LinkedIn, and Instagram actions MUST use only the existing owner-confirmed and publication-approved values and MUST continue to honor record-level and independent field-level factual-verification and publication-approval eligibility. The exact approved Instagram destination is `https://www.instagram.com/casiancriste`.
- **FR-019**: The Instagram action MUST use exactly `https://www.instagram.com/casiancriste` when its record and field are eligible for publication; no alternate username or URL may be substituted or guessed.
- **FR-020**: A Download CV action MUST be omitted unless an actual CV document is present, factually verified, and explicitly approved for public download; no empty link, invented asset, or private/draft document may be published.
- **FR-021**: Social and contact actions MUST have understandable accessible names, semantic destinations, visible focus, keyboard operation, and touch-friendly targets; icons MUST NOT be the sole accessible name.
- **FR-022**: Social actions that open external profiles MUST preserve the established secure external-link behavior and exact approved destinations.
- **FR-023**: The same available action family MUST appear in Hero and Contact with responsive wrapping or arrangement and existing design-token-based hover/focus feedback. Contact owns the main action group. The Footer MUST remain visually minimal and MUST NOT repeat the full action group; its existing copyright and navigation behavior remain unchanged.
- **FR-024**: Action presentation MUST remain understandable and usable without JavaScript, and action state MUST NOT depend on hover or animation.
- **FR-025**: Motion and visual treatment MUST reuse the established Feature 006 motion vocabulary and reduced-motion behavior; no new animation framework, unrelated color palette, or excessive continuous effect may be introduced.
- **FR-026**: The feature MUST preserve all existing content, project classifications and routes, seven primary navigation destinations, navigation state ownership, publication rules, Contact/Footer fallback behavior, and Feature 001–006 behavior except for the explicitly requested visual and content-label changes. Retiring Copy Email intentionally supersedes Feature 005's user-facing Copy Email control only; its contact record, field-level publication checks, approved email, and normal mailto behavior remain intact.
- **FR-027**: Verification MUST cover portrait rendering and failure behavior, navigation visibility on desktop/mobile/touch, focus recovery, active-state/history invariants, responsive alignment, Hero glyph visibility, removal of the introduction label, exact approved action destinations including Instagram, omission of ineligible destinations and the currently unavailable CV action, reduced motion, no-JavaScript behavior, actual 200% browser zoom, accessibility, and performance regression.
- **FR-028**: Manual visual, keyboard/focus, screen-reader, contrast, touch, reduced-motion, and actual 200% zoom review MUST be recorded separately from automated checks; automated tests MUST NOT be represented as manual approval.
- **FR-029**: Lighthouse targets MUST remain at least 90 for Performance, Accessibility, Best Practices, and SEO. Existing desktop Performance results below 90 MUST remain documented as global release debt unless new comparable measurements demonstrate compliance; Feature 007 MUST not claim to resolve unrelated global debt.
- **FR-030**: Feature 007 MUST NOT introduce measurable performance regression, unnecessary JavaScript or dependencies, image-related layout shift, or changes to Features 001–006 outside the approved scope.

### Key Entities

- **Brand portrait**: The existing owner-approved Hero portrait reused for the navbar brand, with the same identity, accessible meaning, and stable presentation.
- **Navigation visibility state**: Whether the primary navigation is visually available based on the 16-pixel top region, a 64-pixel departure from page top, 12-pixel directional movement, focused controls, menu state, and explicit hash/history navigation; this is separate from current-destination state.
- **Portfolio action**: An available Email, GitHub, LinkedIn, Instagram, or CV action whose exact destination or asset is independently eligible for public display.
- **Responsive composition**: The alignment and grouping of existing Hero, section, and action content at different viewport widths and browser zoom levels.

## Assumptions

- Existing Features 001–006 remain the source of truth for the design system, navigation ownership and destinations, content, publication eligibility, responsive behavior, motion tokens, project routes, and accessibility behavior.
- The current Hero portrait at `/images/me1-2.jpg` is the portrait to reuse. It remains the same approved asset; Feature 007 does not require a new portrait.
- The approved public contact destinations are `cristecasian@gmail.com`, `https://github.com/AllCasian`, `https://www.linkedin.com/in/casian-criste-b65582263/`, and `https://www.instagram.com/casiancriste`, subject to existing record-level and field-level publication eligibility.
- Repository-wide filename search for PDF, DOC, DOCX, ODT, RTF, and Pages documents and inspection of public assets found no CV/resume document. A CV action remains absent until an actual document is supplied or identified and explicitly approved.
- The existing seven navigation destinations and the existing navigation enhancer remain authoritative. Navigation visibility is a separate presentation behavior and does not alter destination state.
- Mobile centering is selective: Hero content and action groups receive the strongest centering; dense or long-form content may remain left-aligned for readability.
- Existing Feature 004 and Feature 005 manual release checks and the global desktop Lighthouse Performance shortfall retain their original ownership and are not closed by Feature 007.
- No additional contact details, social profiles, CV claims, or portrait imagery are inferred from repository placeholders.

## Dependencies

- Features 001–006 provide the navigation state contract, approved portrait and profile content, responsive design tokens, motion vocabulary, contact publication rules, and regression coverage that this feature must preserve.
- Instagram publication uses the exact owner-approved URL and remains subject to the existing record-level and field-level publication eligibility rules.
- CV download publication depends on an actual document being supplied or identified, checked for current content, and explicitly approved for public download. No current document was found.
- The owner has decided that Copy Email is retired; the single Email action remains available as a no-JavaScript link.
- Actual 200% browser zoom and manual visual/accessibility review require a human reviewer and a browser environment that exposes the real browser zoom setting.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At scroll positions within 16 CSS pixels of page top and on non-scrollable pages, the navbar is visible. More than 64 CSS pixels below the top it hides only after at least 12 CSS pixels of downward travel; 12 CSS pixels upward travel restores it. Smaller reversals do not toggle visibility. Focus, an expanded menu, or explicit hash/history navigation keeps it visible, without changing the current destination or obscuring the target heading.
- **SC-002**: The brand link on homepage and project-detail routes shows the existing approved portrait in a circular, undistorted frame with its current accessible name and destination, and with no measurable image-related layout shift.
- **SC-003**: At 320, 375, and 768 CSS-pixel widths, Hero heading/role/description/actions and Contact heading/actions have balanced centered presentation; selected section headings may be centered. At all required widths through 1920 CSS pixels, dense content remains readability-aligned and no horizontal overflow or clipped control occurs.
- **SC-004**: At desktop and mobile widths, the full “JUNIOR DATA ENGINEER” role is visible, including the complete lowercase “g” descender, with motion enabled and reduced and without layout shift.
- **SC-005**: The visible “01 - introduction” label is absent while the About heading, `#about` target, and all existing navigation behavior continue to work.
- **SC-006**: The Contact group presents exactly one Email action to `mailto:cristecasian@gmail.com`, with no Copy Email control or oversized duplicate email presentation.
- **SC-007**: Hero and Contact use consistent rounded-pill actions for eligible email, GitHub, LinkedIn, and Instagram destinations, including the exact approved Instagram URL. The CV action is absent because no approved document exists; unavailable destinations or documents are never guessed. Footer remains minimal and does not duplicate the action group.
- **SC-008**: All action controls have descriptive accessible names, visible keyboard focus, usable touch targets, and remain usable with JavaScript disabled and reduced motion enabled.
- **SC-009**: Existing seven-destination URL/hash/history behavior, passive-scroll invariance, sole Portfolio current state on project details, and all six project routes pass regression checks.
- **SC-010**: Automated accessibility checks report no new configured violations, and separate human review records visual quality, keyboard/focus, screen-reader, contrast, touch, reduced motion, and actual 200% zoom evidence.
- **SC-011**: Production Lighthouse measurements for representative homepage and project-detail routes use comparable documented conditions, meet or report each constitutional >=90 category threshold, and show no material Feature 007 regression; existing below-target desktop Performance remains explicitly open unless new evidence shows it passes.
- **SC-012**: No action exposes unverified, unapproved, guessed, draft, or private personal information in rendered or serialized public output.

## Out of Scope

- Redesigning the portfolio or replacing its design system.
- Changing project content, project categories, publication state, or project routes.
- Adding an eighth primary navigation destination or changing active-state ownership.
- Adding a contact form, backend service, analytics, authentication, database, or CMS.
- Altering or guessing an owner-approved social URL, or creating a CV/resume file without owner approval.
- Changing the existing Hero portrait or replacing it with a newly generated asset.
- General remediation of desktop Lighthouse debt unrelated to Feature 007.
- Changing Feature 004/005 release task status or claiming their manual checks complete.

## Unresolved Optional Facts

- **CV**: Repository inspection found no CV/resume document. Omit the download action until an actual document is supplied or identified, reviewed for current content, and explicitly approved for public download.
