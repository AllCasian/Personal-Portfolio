# Research: Projects Showcase & Project Details

**Feature**: [Projects Showcase & Project Details](./spec.md)  
**Date**: 2026-11-02

## Decisions

### 1. Local content with independent verification and approval

**Decision**: Keep the six records in typed local source content. Model factual verification (`unverified|verified` plus source class `owner-confirmed|approved-project-documentation`) separately from publication approval (`unapproved|approved`); a record also has `draft|approved` publication status. Each public field is eligible only when both field conditions are positive and its record is approved. Use one server-side `PublishedProject` projection for cards, routes, static params, metadata and public output. Exclude workflow state and ineligible values from all generated or serialized output.

**Rationale**: Verification answers whether a claim is supported; publication approval answers whether it may be shown. Keeping two small typed enums prevents one condition from silently implying the other without adding a CMS or workflow system.

**Alternatives considered**:
- Treat an editorially approved field as verified: rejected because permission to publish does not prove a claim.
- Render raw data and hide drafts in CSS/client code: rejected because content could leak through HTML, metadata, static output, or serialized props.
- Add a CMS/database/editorial dashboard: rejected because six local records do not justify new infrastructure and these systems are out of scope.

### 2. Unconditional Dava.X training classification

**Decision**: Drivewise, Smart Librarian and ETL Pipeline are projects developed during the Dava.X Trainee Program at Endava. They must never be described as commercial client engagements, production deployments, or independently delivered Endava products, even if technical implementation details are later verified. Keep the training experience distinct from commercial employment.

**Rationale**: This preserves the explicit user-provided scope and prevents later technical evidence from being misused to imply a different professional relationship.

### 3. Approved routes and safe unknown responses

**Decision**: Generate static params only for approved records with eligible required identity fields. Resolve detail routes through the same public projection; unknown, malformed and unpublished slugs return not-found. Unknown/unpublished responses expose no project details or project-specific/draft metadata and are non-indexable (`noindex`). Do not generate static routes for unpublished records.

**Rationale**: This allows static generation for the approved set while keeping all public surfaces governed by one eligibility rule.

### 4. Metadata from the same eligible public view

**Decision**: `generateMetadata` consumes only the verified-and-approved public projection. Unknown/unpublished routes use generic non-project metadata with `noindex`; never borrow another project's metadata. Canonicals require configured `SITE_URL`; do not invent an origin. Open Graph images require eligible authentic media.

**Rationale**: Metadata and social tags are public outputs and need the same disclosure rules as page body content.

### 5. Grouped showcase without filters

**Decision**: Render three semantic category groups in approved order with a content-driven responsive card grid. Do not add tabs or category filtering.

**Rationale**: Six records are scannable through headings and ordering. Filtering adds controls and states without demonstrated user value.

### 6. Existing route-aware navigation owner

**Decision**: Keep homepage fragment URLs and Feature 001 active-state behavior unchanged. From approved `/projects/[slug]` pages, Portfolio alone has `aria-current="location"`; Home is not current just because the detail URL has no hash. Use the existing navigation-state architecture as sole owner; detail links resolve to root-prefixed homepage anchors. Returning to `/#portfolio` restores the normal homepage state.

**Rationale**: This communicates current portfolio context on a project detail route without a competing state store or changes to homepage behavior.

### 7. Server Components and local authentic media

**Decision**: Use Server Components for listing, groups, cards, optional data, detail pages, navigation and not-found UI. Use only verified, publication-approved authentic local images, with reserved dimensions/aspect ratio and correct alt semantics. Omit unavailable media.

**Rationale**: Project content is static and interactions are ordinary anchors; client-side state, extra animation packages and remote media are not needed.

### 8. Responsive grid and 200% zoom

**Decision**: Use a content-driven grid (such as auto-fit) with a preferred 16rem minimum track. If the container cannot fit that track, it becomes one full-width track that shrinks with the container. Objective checks at 320, 375, 768, 1024, 1440 and 1920 CSS px require readable wrapping, reachable controls, and no overflow, overlap or clipping. At 200% zoom additionally require no information loss, unreadable cards or hidden focus.

**Rationale**: This keeps cards readable while avoiding rigid column counts that fail between named breakpoints or under zoom.

### 9. Manual accessibility review is a release gate

**Decision**: Automated Axe checks remain required but separate. Before release acceptance, document actual screen-reader navigation, manual keyboard operation, contrast, 200% zoom, focus visibility and order results. Record date, environment, AT, viewport/zoom, evidence, failures, severity, requirement, remediation and retest. Any required check not performed or unresolved applicable WCAG 2.2 AA failure blocks acceptance.

**Rationale**: Automated scans cannot establish real assistive-technology or hands-on interaction behavior.

### 10. External-link publication policy

**Decision**: Publish only exact verified and separately approved GitHub/Live Demo URLs over HTTPS. Review redirect destinations before publication and when a link changes or is reported. Omit links that are unavailable, unsafe, unexpectedly redirected or no longer project-related; never guess a replacement. Do not add monitoring infrastructure.

### 11. Visual source of truth

**Decision**: Original screenshots are unavailable in the workspace. Use the approved Features 001–002 design system; do not reconstruct screenshot-specific details.

## Next.js Documentation Reviewed

The installed Next.js 16.4.2 documentation under `node_modules/next/dist/docs/01-app/` was read for dynamic route segments, `generateStaticParams`, `generateMetadata`, `notFound`, and Image behavior. Follow its async route `params`, static known-parameter, metadata, not-found, and intrinsic image dimension/reserved frame guidance during implementation.

## Unresolved Research Items

No product decision blocks task generation. `SITE_URL` remains optional deployment configuration; if absent, canonical metadata is omitted. No project media or optional project claims are assumed to exist or be approved. Feature 001's desktop Lighthouse Performance baseline of 89 remains an unresolved release issue until a new measurement demonstrates >=90.
