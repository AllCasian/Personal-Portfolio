# Feature Specification: Contact & Footer

**Feature Branch**: feature/005-contact-footer

**Created**: 2026-11-05

**Status**: Draft

**Input**: User request to complete the single-page portfolio with an accessible Contact section and Footer using only verified and approved contact information.

## Clarifications

### Session 2026-11-05

- Q: Which owner and contact details are confirmed and approved for public display? → A: Publish Casian Criste, cristecasian@gmail.com, https://github.com/AllCasian, and https://www.linkedin.com/in/casian-criste-b65582263/. Owner confirmation is the factual-verification source and explicit publication approval; record-level and each field-level eligibility remain independently enforced.
- Q: What behavior is required for email actions when copying succeeds, fails, or JavaScript is unavailable? → A: Use the browser Clipboard API when available; announce concise success or failure without moving focus, keep the exact address visibly selectable and linked by mailto, and do not expose Copy Email without JavaScript. A minimal isolated client-side boundary is limited to copy interaction; all other Contact and Footer content remains server-rendered, with no clipboard dependency or global state manager.
- Q: How should the confirmed social profiles behave, including when reachability cannot be checked? → A: Use only the exact approved GitHub and LinkedIn destinations, open them in a new tab with rel="noopener noreferrer" and descriptive accessible names. The current review could not fetch either URL because of web cache misses; this does not establish unavailability or revoke the owner's approval. Report the verification limitation, and omit a link only if it is later confirmed unsafe, unavailable, redirected unexpectedly, or unrelated.
- Q: How should the Footer handle its year and section links? → A: Use the current calendar year from one server-generated value shared by server output and hydration; do not hardcode a permanent year or recompute it independently in the browser. For generated static output, the year advances on the next regeneration or deployment. Include a compact named secondary navigation to the existing seven destinations; it does not set aria-current or own active state.
- Q: Which Contact copy should be the initial presentation, and which other contact channels are in scope? → A: Use “Let's work together.” and “Have an opportunity, a project idea, or just want to connect? I'd love to hear from you.” Keep phone, address, WhatsApp, X/Twitter, Instagram, Calendly, resume URLs, and other unconfirmed channels unpublished and out of scope; omit optional technology attribution by default.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find a Professional Contact Option (Priority: P1)

As a recruiter, hiring manager, or collaborator, I want to find an available professional contact option so I can reach the developer without guessing how to contact them.

**Why this priority**: A clear and truthful contact path completes the portfolio's primary purpose for professional visitors.

**Independent Test**: Open the Contact section and inspect its available actions. Confirm each displayed route corresponds to an explicitly verified and approved contact channel, and that unavailable channels have no misleading control.

**Acceptance Scenarios**:

1. **Given** an email address is verified and approved for publication, **When** a visitor opens Contact, **Then** a Send Email link is available and opens a message addressed to that exact address.
2. **Given** no email or social destination is both verified and approved, **When** a visitor opens Contact, **Then** no email or social address, empty link, or inactive contact control is shown, and a neutral availability message is presented.
3. **Given** a GitHub or LinkedIn destination is verified and approved, **When** Contact is displayed, **Then** that exact destination is available with a clear accessible name; an unavailable or unapproved profile is omitted.

---

### User Story 2 - Copy an Available Email Address (Priority: P1)

As a visitor who wants to use an available email address in another application, I want to copy it and understand whether copying succeeded.

**Why this priority**: Copying provides a convenient alternative to opening an email application while keeping the interaction explicit and accessible.

**Independent Test**: With a verified and approved email available, activate Copy Email using pointer and keyboard. Confirm the clipboard contains the exact address and that success or failure is announced. Repeat with clipboard permission denied or unavailable and with JavaScript disabled.

**Acceptance Scenarios**:

1. **Given** an approved email address and working clipboard access, **When** the visitor activates Copy Email, **Then** the exact address is copied and an accessible success message is announced.
2. **Given** clipboard access is unavailable or fails, **When** the visitor activates Copy Email, **Then** an accessible failure message is announced and the approved address remains available for manual selection.
3. **Given** JavaScript is disabled, **When** the visitor navigates Contact, **Then** Copy Email is absent from the visible and keyboard-accessible controls, while the Send Email link remains a usable ordinary link if an approved address exists.
4. **Given** no eligible email address exists, **When** Contact is displayed, **Then** neither Send Email nor Copy Email is rendered.

---

### User Story 3 - Navigate and Recognize the Portfolio Footer (Priority: P2)

As a visitor reaching the end of the page or viewing a project detail, I want a concise footer that identifies the portfolio owner and helps me return to portfolio sections.

**Why this priority**: The footer provides orientation and a predictable route back through the existing portfolio without adding another navigation system.

**Independent Test**: Inspect the footer on the homepage and a project detail route. Confirm the owner and current copyright year are correct, links lead to existing destinations, and existing current-navigation behavior remains unchanged.

**Acceptance Scenarios**:

1. **Given** the visitor reaches the footer, **When** it is displayed, **Then** it shows the verified owner name and current calendar year.
2. **Given** the visitor activates a footer destination on the homepage or a project detail page, **When** navigation completes, **Then** the link reaches the matching homepage section and existing navigation behavior remains synchronized.
3. **Given** the visitor uses a keyboard or assistive technology, **When** they navigate the footer, **Then** the footer landmark and any secondary navigation have clear accessible names and logical focus order.

### Edge Cases

- Email, GitHub, or LinkedIn data is missing, unverified, or not approved for publication.
- The email action is invoked when clipboard support is absent, permission is denied, or copying rejects.
- JavaScript is disabled; no copy-only control may appear or remain focusable.
- A social profile redirects to an unexpected destination, is unsafe, unavailable, or no longer belongs to the developer.
- A contact URL is malformed or does not use the confirmed exact destination.
- The calendar year changes between visits or around a year boundary.
- Contact and footer links are used at 320 CSS pixels, at 200% zoom, or from a project detail page.
- Clipboard feedback is announced repeatedly or stale feedback is left visible after a later attempt.
- The Contact section is visited directly through its existing hash or through browser back/forward navigation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The existing Contact placeholder MUST become a complete Contact section at the unchanged, unique #contact destination. It MUST include a concise professional heading and a short invitation to connect.
- **FR-002**: Contact information MUST be published only when factual verification and publication approval are both satisfied. Owner confirmation is the source of factual verification and explicit approval for the owner name, email, GitHub URL, and LinkedIn URL listed in the Clarifications section. Record-level approval and independent field-level verification and approval MUST remain separate eligibility conditions.
- **FR-003**: Contact MUST display the approved address cristecasian@gmail.com as selectable text and provide a semantic Send Email anchor whose exact destination is mailto:cristecasian@gmail.com. The action MUST work without JavaScript, have an understandable accessible name, and MUST NOT imply that activating it guarantees message delivery.
- **FR-004**: With JavaScript available, the Copy Email action MUST use the browser Clipboard API when available and copy exactly cristecasian@gmail.com. Success MUST announce concise confirmation such as “Email copied”; failure, denied permission, or unsupported clipboard access MUST announce an understandable failure and leave the exact address selectable. Feedback MUST not move focus or rely on color alone.
- **FR-005**: Copy Email MUST NOT be visible, exposed to assistive technology, or keyboard-focusable when JavaScript is unavailable. With JavaScript available, it MUST remain hidden and unfocusable until `CopyEmailAction` has hydrated and its own event handler is ready; the global `has-js` marker alone is insufficient. Reveal it only when both the existing marker and local readiness gate are satisfied. The approved address MUST remain visible and selectable, and the Send Email link MUST remain usable without JavaScript.
- **FR-006**: Contact MUST display only the confirmed GitHub URL https://github.com/AllCasian and LinkedIn URL https://www.linkedin.com/in/casian-criste-b65582263/ when their independent verification and approval conditions pass. Each MUST open in a new tab using target="_blank" and rel="noopener noreferrer", with a descriptive accessible name. No additional social network or contact channel is included.
- **FR-007**: Any contact channel that is missing or ineligible MUST be omitted without an empty control. If no contact channel qualifies, the section MUST show neutral availability copy instead of a false or nonfunctional action. This fallback remains defined for future content changes; all three supplied channels are approved initial content.
- **FR-008**: Contact records and fields MUST remain separate from presentation. Unverified or unapproved values and publication-review metadata MUST NOT appear in public HTML, metadata, generated output, or publicly delivered/serialized application data.
- **FR-009**: Published social URLs MUST retain their exact approved destinations. A confirmed unsafe, unavailable, unexpectedly redirected, or unrelated destination MUST be omitted and re-reviewed when changed or reported invalid. If reachability cannot be checked in the current environment, report that limitation without treating it as proof of unavailability or revoking owner approval. Do not add automated monitoring or guessed replacements.
- **FR-010**: When `ownerName` is eligible in the server-side public projection, the Footer MUST show “© [current year] Casian Criste. All rights reserved.” The owner name MUST come only from that projection and MUST NOT be hardcoded in the Footer component. When `ownerName` is ineligible, omit the owner attribution and render “© [current year]. All rights reserved.” The year MUST be generated as one server-side value and shared with any hydrated output to prevent mismatch; it MUST not be permanently hardcoded or independently recomputed in the browser. For statically generated output, it updates at the next page regeneration or deployment.
- **FR-011**: The Footer MUST provide a compact, separately named secondary navigation using only the existing seven destinations and labels. It MUST NOT create new primary destinations, set a competing current-location state, or introduce another active-state controller.
- **FR-012**: On the homepage, Contact and footer links MUST preserve existing section hashes, direct navigation, browser history, current-destination indication, and JavaScript-disabled behavior. On project detail pages, section links MUST return to the corresponding homepage hash and the primary Portfolio destination MUST remain current until navigation returns to the homepage.
- **FR-013**: Only the existing primary navigation participates in the established aria-current contract. A secondary footer navigation MUST NOT introduce a competing current-location owner or alter the existing navigation enhancer.
- **FR-014**: Contact and Footer MUST use semantic landmarks and headings, meaningful accessible names, logical reading and focus order, visible focus, and applicable WCAG 2.2 AA text and control contrast. Interactive targets MUST be at least 44 by 44 CSS pixels where practical.
- **FR-015**: Contact and Footer MUST remain readable and operable at 320, 375, 768, 1024, 1440, and 1920 CSS-pixel viewport widths and at 200% browser zoom, without horizontal overflow, clipped content, overlap, or unreachable controls.
- **FR-016**: Motion MUST be unnecessary by default; any interaction transition MUST be subtle, purposeful, and respect reduced-motion preferences. All content and controls MUST remain understandable and usable without motion.
- **FR-017**: Existing Vitest component tests and Playwright browser tests MUST cover exact approved content, eligibility and negative sentinel cases, exact mailto/social destinations, new-tab security attributes, clipboard success/failure/unsupported behavior, no-JavaScript visibility and usability, accessible announcements and focus retention, footer year/navigation, responsive layouts, navigation/history behavior, and regressions for Features 001–004. Automated accessibility checks MUST remain distinct from manual accessibility review.
- **FR-018**: Performance and accessibility quality claims MUST use current measurements. Lighthouse targets remain at least 90 for Performance, Accessibility, Best Practices, and SEO. A below-target result MUST remain explicitly unresolved and MUST NOT be reported as a pass; the latest Feature 004 desktop Performance results (homepage 86–87, Drivewise 87) remain open release issues unless new measurements show compliance.

### Key Entities

- **Contact profile**: The public-facing email, GitHub URL, and LinkedIn URL, each optional and independently subject to factual verification and publication approval.
- **Contact action**: A visitor-facing Send Email, Copy Email, GitHub, or LinkedIn action that exists only when its required channel is eligible and available.
- **Copy feedback**: The accessible success or failure information associated with a visitor-initiated copy attempt.
- **Footer identity**: The confirmed portfolio owner name and current-year copyright information.
- **Footer destination**: A secondary link to one of the existing primary portfolio sections, retaining its established destination and route behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Contact section has one clear heading and a concise connection invitation at the existing #contact destination, with no duplicate section ID.
- **SC-002**: The visible email address is exactly cristecasian@gmail.com and the Send Email anchor destination is exactly mailto:cristecasian@gmail.com; no other email value appears in public output.
- **SC-003**: In clipboard success and failure tests, the copied value is exact when successful, the appropriate accessible status is announced, and focus remains on the Copy Email control.
- **SC-004**: With JavaScript disabled, Copy Email is absent from the visible page, accessibility tree, and keyboard order. When JavaScript is enabled but the CopyEmailAction chunk is delayed after the global `has-js` marker initializes, it remains hidden and unfocusable until its own event handler is ready; after readiness it becomes visible and interactive. In each state, the exact approved email remains visible/selectable and its Send Email link remains usable.
- **SC-005**: Unverified or unapproved sentinel values and review metadata are absent from rendered and generated public output, while the approved owner, email, GitHub, and LinkedIn values appear exactly as confirmed.
- **SC-006**: GitHub and LinkedIn anchors use the exact confirmed URLs, target="_blank", rel="noopener noreferrer", and descriptive accessible names. If current reachability cannot be verified, that limitation is recorded without revoking approval.
- **SC-007**: With the initial approved owner-name field eligible, the footer contains the exact owner name, server-generated current calendar year, specified copyright attribution, and links only to the seven existing destinations. When the owner-name field is ineligible, the owner name is absent and the year-only copyright fallback is rendered.
- **SC-008**: Contact and Footer navigation preserve all seven existing destinations, homepage hash/history behavior, and the sole Portfolio current state on approved project detail pages; footer links do not expose aria-current or own state.
- **SC-009**: At all six specified viewport widths and at 200% zoom, Contact and Footer have no horizontal overflow, overlap, clipped text/control, or unreachable interactive element.
- **SC-010**: Automated accessibility scans on representative Contact and Footer states report no configured WCAG 2.2 AA violations, and manual keyboard, screen-reader, focus-order, contrast, zoom, and reduced-motion reviews are documented separately before production release.
- **SC-011**: Reproducible mobile and desktop audits report all four Lighthouse categories. Each target is at least 90 to claim compliance; any lower score, including Feature 004 desktop Performance of 86–87 on the homepage and 87 on Drivewise, is recorded as unresolved. Field INP is “not yet measurable” without sufficient data.
- **SC-012**: In a lightweight optional visitor review, a representative visitor can identify the available contact route and understand the footer destinations within 10 seconds; this qualitative usability goal does not block release when reviewers are unavailable.

## Assumptions

- Owner confirmation is the source for factual verification and explicit publication approval of the name Casian Criste, email cristecasian@gmail.com, GitHub https://github.com/AllCasian, and LinkedIn https://www.linkedin.com/in/casian-criste-b65582263/. Record-level and field-level eligibility states remain independent even though the owner confirmed and approved these values together.
- The existing Contact placeholder keeps the unique #contact destination; Feature 005 replaces only its content and preserves all seven destinations, labels, and existing navigation behavior.
- The Contact section uses the proposed concise heading and supporting text recorded in Clarifications. If a channel becomes missing or ineligible later, omit it and show neutral availability copy when no eligible contact channels remain.
- A minimal isolated client-side boundary is appropriate only for clipboard interaction. The owner identity, email text/link, social links, Contact copy, Footer, and secondary navigation remain usable as server-rendered content. Do not add a global state manager or clipboard dependency.
- The Footer uses one server-generated current-year value. Static output updates when regenerated or deployed; no client-side date calculation is required.
- A compact secondary footer navigation mirrors the existing seven destinations, uses root-prefixed homepage hashes on project details, and does not participate in primary current-state semantics.
- The verified GitHub and LinkedIn URLs remain approved despite the current web-fetch cache-miss limitation. No reachability conclusion is inferred from that limitation. Confirmed unsafe, unavailable, unexpectedly redirected, or unrelated targets are omitted if later observed.
- Phone, physical address, WhatsApp, Twitter/X, Instagram, Calendly, resume links, other social networks, and unsupported technology attribution are outside this feature's public content.
- Existing design tokens, publication-safety conventions, navigation behavior, and test infrastructure remain authoritative. No contact form, backend service, database, CAPTCHA, newsletter, analytics, or third-party contact dependency is introduced.
- Feature 004 desktop Performance remains an unresolved global production-release issue; Feature 005 neither changes the constitutional thresholds nor claims that issue is fixed.

## Unresolved Optional Facts

There are no unresolved contact facts required for Feature 005. Additional personal contact channels remain out of scope unless separately confirmed and approved. External reachability of the supplied GitHub and LinkedIn pages could not be verified in the current review because both web fetches returned cache misses; this is an environment limitation, not a change to owner approval.
