# UI Contract: Projects Showcase & Project Details

**Feature**: [Projects Showcase & Project Details](../spec.md)  
**Navigation contract**: [Feature 001 UI Navigation](../../001-portfolio-foundation/contracts/ui-navigation.md)  
**Hero/About contract**: [Feature 002 Hero & About](../../002-hero-about/contracts/hero-about.md)

This contract extends the existing site shell and navigation. It does not redefine homepage navigation, mobile-menu behavior, or Feature 001's active-state ownership.

## Portfolio Destination

- The collection is the existing homepage `#portfolio` section.
- Show exactly six projects, once each, in three semantic groups and this order:
  1. Dava.X Trainee Program (Endava): Drivewise, Smart Librarian, ETL Pipeline.
  2. Academic Projects (Technical University of Cluj-Napoca / UTCN): Automatic Guitar Tuner, Energy Management System.
  3. Personal Projects: AI Recipe.
- The three Dava.X projects are training-program projects. They must never be framed as commercial client engagements, production deployments, or independently delivered Endava products, even if technical facts are later verified. This training experience is distinct from commercial employment.
- Do not add category filters, tabs, or filtering state. Group headings are the category cue for this six-project collection.
- Each card has a visible project title, category, and View Details action with a project-specific accessible name. Show summary, technology/concept terms, authentic media, GitHub, or Live Demo only when verified and publication-approved.
- Use separate anchors for details and optional links; do not nest interactive links inside a full-card link. Omit unavailable optional content; render no empty controls, fake links, or invented artwork.
- AI Recipe initially shows only its confirmed title and category plus the details action.

## Public Content Boundary

- Factual verification and publication approval are independent. A field appears only when its source-backed verification is `verified` and its publication status is `approved`; the project record must also be approved. This applies to summaries, technology terms, contributions, architecture, screenshots/media, external links, and SEO metadata.
- Raw records, drafts, verification sources/statuses, approval metadata, and ineligible values remain server-side. Public rendering, static generation, metadata, HTML and serialized props use only the eligible public projection.
- Publish GitHub/Live Demo links only at their exact verified and approved HTTPS URLs. Review redirects before publication and when changed/reported. Omit unavailable, unsafe, unexpectedly redirected, or no-longer-project-related destinations. Never guess substitutes; no link monitoring infrastructure is required.

## Project Detail Destinations

- Initial detail URLs use `/projects/{slug}` with the stable slugs in [data-model.md](../data-model.md).
- A detail page has one `h1` for its approved title, visible category/organization context, and only present fields satisfying both verification and approval conditions. Optional case-study sections disappear when missing or ineligible. AI Recipe may be sparse; a neutral notice may explain unavailable details without factual claims.
- Back to Projects links to `/#portfolio` and is keyboard-operable with visible focus.
- Unknown, malformed, or unpublished slugs return not-found behavior; no project details or project-specific/draft metadata are exposed. These responses are non-indexable and unpublished projects are absent from static route generation.
- Generic not-found metadata contains no project identity or draft value and carries `noindex`. Canonical metadata is emitted only with a configured site base; do not invent a public origin.

## Shared Navigation

- On `/`, existing primary navigation and hero links remain the existing `#home`, `#about`, `#portfolio`, and `#contact` fragments. Feature 001's active state and history behavior remain unchanged.
- On an approved `/projects/[slug]` detail page, Portfolio is the sole primary navigation destination exposing `aria-current="location"`. Home must not be current merely because the detail URL has no hash. The server-rendered route-context marker and existing `src/lib/navigation-enhancement.ts` owner must agree on direct load and refresh.
- Detail-page header, footer and mobile-menu section links use `/#home`, `/#about`, `/#portfolio`, and `/#contact`. Back to Projects also targets `/#portfolio`. Returning to `/#portfolio` restores the homepage Portfolio current state.
- Extend the existing `src/lib/navigation-enhancement.ts` as the sole post-hydration navigation-state owner to read route context. On `/`, preserve hash-based state and Home as the no-hash default; on project details, select Portfolio. Keep server-rendered initial `aria-current` aligned with the route context to avoid hydration mismatch. Do not add a second state store, competing React state, scroll tracking, or pre-hydration mutation.
- Only one primary destination may be current. Ordinary anchors preserve JavaScript-disabled navigation and browser history. Test homepage and detail initial states, direct navigation/refresh, link selection, browser back/forward and return to `/#portfolio`; existing homepage behavior must pass unchanged.

## Responsive, Visual, and Accessibility Behavior

- Reuse Features 001–002 dark/blue identity, Inter typography, content width, spacing, card/button patterns, contrast tokens, and visible focus style. Supplied screenshots are inspirational only; if unavailable, use the approved system without inventing their appearance.
- Use a content-driven responsive grid (for example, CSS auto-fit). Prefer a minimum usable card track of 16rem; when the available inner width is smaller, use one track that shrinks to the container width. Do not force a fixed column count. At every required viewport, cards must wrap text naturally, remain readable, and show reachable controls without overflow or clipping.
- Required viewport widths: 320, 375, 768, 1024, 1440, and 1920 CSS pixels. Detail copy stays within a readable bounded measure. Media uses a consistent reserved ratio and does not cause layout shift.
- At 200% browser zoom, content reflows without loss, cards remain readable, controls remain reachable, no unintended horizontal scrolling/overlap/clipping occurs, and focus remains visible. Follow the repeatable viewport and zoom procedure in [quickstart.md](../quickstart.md).
- Desktop navigation remains at 1024px and above; existing mobile full-screen navigation remains at 320–1023px. Its keyboard, focus, close, reduced-motion, and no-JavaScript behavior remain unchanged.
- Use semantic landmarks, logical headings, descriptive keyboard-operable links, visible focus, applicable WCAG 2.2 AA contrast, and practical 44x44px targets where feasible. Reduced motion removes or simplifies nonessential transitions.
- Informative images have accurate approved alt text; decorative images use empty alt. Missing media is omitted without a request. If present media fails to load, no broken-image indicator appears; reserved geometry remains stable without layout shift; project text remains readable and navigation usable; no fabricated replacement screenshot is shown.
- Manual screen-reader, keyboard, color-contrast, 200% zoom, focus-visibility and focus-order review is a release acceptance gate separate from Axe. Record date, environment, assistive technology, viewport/zoom, evidence, results, failures, remediation and retest in quickstart. Any unperformed required check or unresolved applicable WCAG 2.2 AA failure blocks acceptance and remains documented as open.

## Validation Contract

- Unit tests validate six records, categories, attribution, order, unique slugs, independent verification/approval filtering, optional omissions, link safety, and no forbidden AI Recipe assertions.
- Component tests validate card/detail rendering, content omission, media alternatives, heading hierarchy, and sparse-but-navigable content.
- Browser tests validate all six detail routes and direct loads, HTTP 404 for unknown/malformed/unpublished slugs without redirect, generic not-found/noindex behavior, exclusion from static params, metadata non-leakage, Back to Projects, and route-aware navigation state on detail routes plus unchanged homepage hash/history behavior.
- Test navigation state: on details exactly Portfolio has `aria-current="location"`; Home is not current; selecting/returning to `/#portfolio` restores Portfolio on `/`; back/forward remains synchronized; exactly one current destination at a time.
- Browser tests cover all six responsive widths and objective overflow, wrapping/readability, focus and action-reachability checks. Force an approved media request to fail and assert no broken-image UI, stable reserved layout, readable project text and usable navigation; test absent media separately. 200% browser zoom also requires the manual procedure in quickstart.
- Automated Axe scans cover collection, representative case study, and not-found. Axe does not replace manual keyboard, screen-reader, contrast, zoom/reflow, and focus verification.
- Production mobile/desktop Lighthouse audits cover homepage collection and representative detail and are compared to Feature 001 baseline and constitutional targets. The known desktop Performance baseline of 89 remains unresolved until a new compliant measurement exists.
