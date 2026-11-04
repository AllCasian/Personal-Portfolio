# Implementation Plan: Projects Showcase & Project Details

**Branch**: `feature/003-projects-showcase` | **Date**: 2026-11-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-projects-showcase/spec.md`

## Summary

Implement the Portfolio section as three ordered, accessible groups containing exactly six approved project records, then provide a server-rendered detail route for each approved slug. Keep project facts in a centralized typed content model, filter publication status and field approval before any page or metadata is produced, and use shared card/detail components that render optional verified fields without project-specific branches. Reuse the current App Router, shared shell, design tokens, and test tools; add no data service or dependency.

## Technical Context

**Language/Version**: TypeScript 5.9 with strict mode; avoid `any`.

**Primary Dependencies**: Existing Next.js 16.4.2 App Router, React 19.3.1 Server Components, Tailwind CSS v4, current UI primitives, `next/image`, Vitest, React Testing Library, Playwright, and Axe integration. No new dependency is planned.

**Storage**: Typed local project content in source control. No database, CMS, or remote content service.

**Testing**: Existing `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:e2e`, and `@axe-core/playwright`.

**Target Platform**: Static-first Next.js application deployed on Vercel; modern browsers at 320px through ultrawide desktop.

**Project Type**: Single web application with a homepage project showcase and six public project detail routes.

**Performance Goals**: Preserve Lighthouse >= 90 for Performance, Accessibility, Best Practices, and SEO; LCP <= 2.5s, CLS <= 0.1, and field INP <= 200ms at p75 when measurable. The documented Feature 001 desktop Performance baseline is 89, below target and still open. Compare representative homepage/listing and project-detail runs on the same documented mobile and desktop profiles; record date or tool version, all category scores, lab LCP/CLS, and field INP availability. Never report a score below 90 as passing or use the existing baseline as evidence for Feature 003.

**Constraints**: WCAG 2.2 AA for applicable criteria; semantic headings and links; visible focus; 44px practical touch targets; reduced-motion support; no horizontal overflow at specified widths or 200% zoom; public fields require factual verification and separate publication approval; no exposure of drafts or sensitive material; Dava.X projects remain training experience, never commercial/client/production delivery; no changes to Features 001–002 beyond the explicitly required cross-route primary-navigation integration.

**Scale/Scope**: Exactly six initial projects grouped as Dava.X Trainee Program (Endava), Academic Projects (Technical University of Cluj-Napoca / UTCN), and Personal Projects. No category filtering, CMS, database, authentication, admin/editing UI, separate backend, or Features 004–006.

## Constitution Check

*Gate: pass before research. Rechecked after design below.*

| Principle | Plan response | Gate |
|---|---|---|
| I. Truthful, Useful Professional Story | Seed only confirmed titles, category/organization attribution, and user-provided facts. Require independent factual verification and publication approval per field; omit anything lacking either. Keep Dava.X projects unconditionally classified as training experience, not commercial or production delivery. | PASS |
| II. Accessible, Responsive Experience | Reuse semantic page shell and focus tokens; content-driven groups/cards/detail layouts support 320, 375, 768, 1024, 1440, and 1920px, keyboard operation, separate Axe and required manual review, reduced motion, image alternatives, and measurable 200% zoom checks. | PASS |
| III. Fast, Robust, Production-Ready Delivery | Keep pages static/server rendered, avoid client state and new dependencies, use optimized local images only when approved, and measure mobile/desktop Lighthouse against constitutional targets. Desktop 89 remains an open baseline issue, not a pass or waived target. | PASS WITH OPEN BASELINE ISSUE |
| IV. Maintainable, Secure Engineering | Add typed local records with independent verification and approval states; only pass an allowlisted public view to rendering components. No secrets or private material are permitted in project content, including drafts. Unknown/unpublished route data is excluded from static params, metadata, and serialized output. | PASS |
| V. Verifiable Changes and Clear Acceptance | Map schema, routes, content safety, navigation, SEO, accessibility, and performance to unit/E2E checks and project quickstart steps. Run the established quality gates and document only observed results. | PASS |

**Pre-design gate**: PASS. No scope, privacy, or architecture decision requires a constitution deviation. The historical desktop Performance score of 89 is recorded as unresolved and does not lower the >=90 target.

**Post-design gate**: PASS with the same open Lighthouse baseline issue. The public-field allowlist, static generation, route failure handling, accessible server-rendered UI, and cross-route navigation preserve the governing principles. No Feature 001–002 contract change is required beyond making their shared section links resolve from project routes to homepage anchors.

## Project Structure

### Documentation (this feature)

```text
specs/003-projects-showcase/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── ui-projects.md
```

### Source and tests

```text
src/
├── app/
│   ├── page.tsx                              # Replace only the #portfolio placeholder with ProjectsSection
│   └── projects/[slug]/
│       ├── page.tsx                          # Published project route and metadata
│       └── not-found.tsx                     # Project-scoped not-found presentation
├── components/
│   ├── layout/
│   │   ├── site-header.tsx                   # Add homepage-anchor context for detail routes
│   │   ├── primary-links.tsx                 # Preserve root-page fragments; support root-prefixed detail links
│   │   ├── responsive-mobile-navigation.tsx  # Preserve the current accessible menu behavior with route-aware hrefs
│   │   └── site-footer.tsx                   # Resolve shared section links to homepage from detail routes
│   ├── sections/
│   │   └── projects-section.tsx              # Ordered project groups at #portfolio
│   └── projects/
│       ├── project-category-group.tsx
│       ├── project-card.tsx
│       ├── project-technology-list.tsx
│       ├── project-media.tsx
│       ├── project-detail-layout.tsx
│       ├── case-study-section.tsx
│       └── project-navigation.tsx
├── content/
│   ├── types.ts                              # Add project types without changing existing profile/navigation contracts
│   └── projects.ts                           # The six curated records and approval metadata
└── lib/
    └── projects.ts                           # Ordered published-project lookup and safe public projection

tests/
├── components/
│   ├── project-card.test.tsx
│   ├── projects-section.test.tsx
│   └── project-detail.test.tsx
├── content/
│   └── projects.test.ts
├── lib/
│   ├── projects.test.ts
│   └── project-metadata.test.ts
└── e2e/
    ├── projects.spec.ts
    ├── project-details.spec.ts
    ├── project-publication.spec.ts
    ├── accessibility.spec.ts                 # Extend existing shared scan only as needed
    ├── no-js-navigation.spec.ts              # Extend for detail routes if needed
    └── hydration.spec.ts                     # Extend for fresh project route loads

public/projects/                              # Only approved authentic media; may remain empty
```

**Structure Decision**: Extend the existing single-app `src/` layout. Project schema and records remain in `src/content`; server-side filtering and lookup are isolated in one small `src/lib/projects.ts` module. Shared presentation components render by data shape, not by project identity. Route-aware header/footer hrefs and a server-rendered navigation-context marker are the shared-shell integration. Extend `src/lib/navigation-enhancement.ts` as the sole post-hydration state owner: it reads route context to select Portfolio on project details, while the homepage continues to use hash state with Home as its no-hash default. Keep the server-rendered initial current item aligned with that context so hydration is deterministic; do not add a second owner or React state. Tests remain in the planned `tests/components`, `tests/content`, `tests/lib`, and `tests/e2e` directories; route/browser checks use `tests/e2e`, with metadata helper tests under `tests/lib` rather than a new `tests/app` directory.

## Design and Implementation Decisions

### 1. Typed content and publication boundary

- Add project types alongside current content types: `ProjectId`, the fixed `ProjectSlug` values, `ProjectCategory`, attribution, `ProjectRecord`, optional `ProjectCaseStudy`, `ProjectTechnology`, `ProjectMedia`, `ProjectLink`, `VerificationStatus`, `PublicationApprovalStatus`, `ProjectField<T>`, record `PublicationStatus`, and the public `PublishedProject` projection.
- Model Dava.X category as the display label “Dava.X Trainee Program” with organization “Endava” and program attribution “Dava.X Trainee Program”. Model academic attribution as “Technical University of Cluj-Napoca (UTCN)”. Model Personal Projects without an unsupported organization.
- Store only the six approved public identities and category/attribution facts initially. Dava.X summaries may state the verified training-program context but those projects must never be framed as commercial client work, production deployments, or independently delivered Endava products, regardless of later technical verification. Distinguish training experience from commercial employment. Academic summaries and listed technologies/concepts require evidence and separate publication approval. AI Recipe initially has only title and personal category.
- Factual verification (`unverified|verified`, with source class `owner-confirmed|approved-project-documentation`) and publication approval (`unapproved|approved`) are independent typed conditions on each `ProjectField<T>`. A field is public only when both are positive; a record separately has `draft|approved` publication status. Apply this to summaries, technologies, contributions, architecture, media/screenshots, links, and SEO inputs. Essential identity fields also require both conditions. The server projection returns no status, source, notes, or raw draft values. Case-study pages, static params, and metadata consume only that projection.
- Never place credentials, secrets, teammate personal details, internal Endava files, or confidential material in either public fields or draft fields in the application content source. Internal project files are not copied into `public/` or rendered as media.
- Do not add placeholder prose for optional case-study data. The sparse AI Recipe page shows confirmed title/category, navigation, and only a neutral “details unavailable” notice if needed to make its sparse state clear.

### 2. Server-rendered showcase and case studies

- Replace the current Portfolio placeholder in `src/app/page.tsx` with `ProjectsSection`; preserve the unique `#portfolio` destination and every other section ID.
- Render exactly three category sections in the approved order, then card lists in the exact order in the specification. Category headings provide grouping; no tabs or filtering state are added.
- Keep `ProjectsSection`, category group, card, technology list, optional media, detail layout, case-study sections, and project navigation as Server Components. Reuse `Card`, `SectionHeading`, `ButtonLink`, CSS tokens, content-width utilities, and existing global styles. If browser image-load failure handling requires a client boundary, isolate it to the smallest media wrapper; preserve reserved dimensions, hide failed-image UI, and keep text/navigation server-rendered and usable.
- Keep card controls as separate semantic links (View Details, GitHub, Live Demo); do not make a card containing nested anchors clickable. Give repeated View Details links a project-specific accessible name while retaining the specified visible label.
- The reusable detail layout renders only present, approved case-study fields. Keep a single page `h1`, section headings at `h2`, and nested feature headings only when needed. Keep text measure readable and use normal document flow.

### 3. Route generation, lookup, and metadata

- Add `src/app/projects/[slug]/page.tsx`. Follow the installed Next.js 16.4.2 App Router conventions: route `params` are asynchronous; resolve them before lookup and metadata generation.
- `generateStaticParams` enumerates only approved records with eligible identity fields. Leave unknown dynamic params enabled so the route validates the slug against the public projection and calls `notFound()`; unknown and unpublished slugs never resolve to another record and are not statically generated.
- `generateMetadata` uses the same verified-and-approved projection as the page. Known titles/descriptions and Open Graph fields use only values satisfying both conditions. Unknown/unpublished slugs return not-found, expose no project details or draft metadata, and use generic non-project `noindex` metadata; do not reuse another project's metadata. Add canonical metadata only when `SITE_URL` is configured; never invent a deployment domain. Open Graph images require verified-and-approved authentic media.
- Project details are static local data: no request, cache, client fetch, or `loading` spinner is needed. Next's not-found path supplies the expected noindex response; add a project-scoped `not-found.tsx` only for consistent UI.

### 4. Navigation integration

- Homepage links remain the current fragments (`#home`, `#about`, `#portfolio`, `#contact`) and continue to use the existing hydration-safe `NavigationEnhancement` as the sole owner of post-hydration active state. The server-rendered links use Home current only for the homepage's no-hash initial state.
- Shared site header/footer links rendered on `/projects/[slug]` use root-prefixed destinations (`/#home`, `/#about`, `/#portfolio`, `/#contact`) and server-rendered route context. The same enhancer reads that context and sets Portfolio as the sole current destination on details; Home is not current there. It must preserve homepage hash/popstate behavior and select Portfolio after return to `/#portfolio`. Keep initial server markup consistent with route context, ordinary JavaScript-disabled links usable, and avoid a second state store, competing React state, or scroll tracking.
- Project “Back to Projects” links to `/#portfolio`. Ordinary anchors preserve no-JavaScript navigation and browser history. Existing homepage `aria-current="location"` behavior remains unchanged; returning to `/#portfolio` restores Portfolio as current.
- Preserve mobile menu breakpoints, full-screen dialog behavior, Escape/close handling, focus management, touch targets, and reduced-motion behavior. On a detail page the same menu links target the matching homepage section.

### 5. Responsive design, media, and motion

| CSS viewport | Project grid | Detail layout |
|---|---|---|
| 320px, 375px | Content-driven auto-fit grid; prefer 16rem minimum track, shrinking to one full-width track if gutters leave less room; natural wrapping | Single readable column; media, when present, remains within the text measure |
| 768px | Auto-fit adds columns only when each track meets preferred minimum; otherwise fewer columns | Single text column; media may use a wider contained frame |
| 1024px | Auto-fit adds columns only while text and actions remain readable; no forced column count | Centered content with bounded reading width |
| 1440px, 1920px | Content-driven grid within existing maximum content width; no ultrawide stretching | Bounded reading width; images remain proportionate |

- Use existing design tokens and mobile-first CSS; add no fixed desktop card widths or project-specific layout exceptions. Use natural card height, consistent internal spacing, and a stable media aspect ratio (4:3 or 16:10 selected during visual implementation and applied consistently to available thumbnails).
- Use `next/image` for verified local media with accurate intrinsic dimensions or a reserved fixed-ratio frame and responsive sizing. Do not request an absent image, preload optional media without measured LCP evidence, or make text depend on image success. On load failure, keep the reserved frame stable, suppress broken-image indicators, and preserve readable project text and usable navigation without substituting invented screenshots. Informative images need truthful alt text; decorative images use empty alt text.
- Use existing CSS hover/focus transitions only. Motion never reveals essential information, and the global reduced-motion rule removes or simplifies nonessential transitions.
- At 200% browser zoom, verify no information loss, unreadable cards, unreachable controls, horizontal overflow, overlap, clipping, or hidden focus. Follow quickstart's reproducible 1280x800 CSS viewport and browser zoom procedure and record effective viewport.

### 6. Visual direction

- Preserve Features 001–002 dark canvas, blue accent, Inter font, content width, radii, focus color, card/button patterns, and section rhythm. Use category eyebrow/labels and typography to distinguish groups; avoid new palettes or unrelated card art.
- Earlier screenshot references are unavailable according to Feature 002 review. Do not reconstruct them. Visually review at mobile and desktop against the approved system and document the unavailable comparison.

### 7. Performance and search metadata

- Keep all initial project data server-side and render listing/detail HTML on the server. No client-side filtering or interactive project state is needed. A narrowly scoped client media boundary is permitted only if necessary to handle image-load failure without broken-image UI; otherwise keep project UI server-rendered.
- Add no dependency or external call. Only approved local project images may be served. Keep card image dimensions reserved and detail text visible even if media fails.
- Support `SITE_URL` as an optional build environment setting solely for canonical/absolute metadata. Document it; if missing, omit canonical metadata rather than guessing a host. Do not add credentials or a real domain to source control.
- Run representative homepage and project-detail mobile/desktop Lighthouse audits against the Feature 001 profiles. Investigate actual bottlenecks and use evidence-based remediation. Preserve >=90 targets; report desktop 89 baseline as unresolved until a new compliant measurement exists.
- Publish external GitHub/Live Demo links only at exact verified, approved destinations. Review redirects before publication and when links are changed/reported; omit unavailable, unsafe, unexpected, or project-unrelated destinations. Do not guess URLs or add monitoring.

### 8. Test strategy

- **Content unit tests**: exactly six approved initial records; expected names, category/organization, group order, fixed slugs, uniqueness; verify unavailable optional fields stay absent and no unsupported AI Recipe fields are seeded.
- **Publication unit tests**: draft project is absent from public list and static params; exercise every combination of factual verification and publication approval; only verified+approved fields are public; no internal source/review metadata is projected; unsafe or credential-bearing links are omitted.
- **Component tests**: grouping/order and card links; optional badge/image/description/link omission; absent versus failed media states; mocked image-load failure hides broken-image UI while retaining a stable reserved frame and readable text; case-study section omission; informative/decorative alt behavior; sparse AI Recipe rendering; one page `h1` and logical heading hierarchy.
- **Route/integration tests**: all six direct routes, refresh, approved lookup, unknown and unpublished slugs return HTTP 404 without redirect and use generic `noindex` metadata; no static params for unpublished records; unique eligible metadata; canonical only with configured `SITE_URL`; no ineligible strings in HTML, metadata, or serialized props.
- **Playwright**: all six viewport widths for listing and representative detail page; page-level overflow/readability/action reachability; intercept an approved media request to force a failure and assert no broken-image UI, stable geometry, readable text, and usable navigation; test absent media separately; keyboard/focus; Axe on listing, detail, and not-found; reduced motion; no JavaScript; hydration diagnostics; detail Portfolio-only active state and homepage hash/history state synchronization. Browser zoom is additionally checked manually.
- **External links**: unit tests prove only exact verified-and-approved link values pass projection. Manually verify destination, source, approval, redirect/final destination and project match before publication and after edits/reports; record evidence or mark not applicable when no URLs are published. Do not add monitoring.
- **Regression**: run existing Feature 001 navigation and Feature 002 Hero/About suites unchanged. Any shared-shell href integration gets dedicated route-context coverage; do not change active-state ownership.
- **Quality gates**: typecheck, ESLint, Prettier, Vitest, Playwright, Axe, production build, and reproducible mobile/desktop Lighthouse. Manual screen-reader, keyboard, contrast, 200% zoom, and focus review is a separate release gate. Record date/environment/AT/viewport/evidence/results/failures/remediation/retest in quickstart. Unperformed required checks or unresolved WCAG 2.2 AA failures block release acceptance.

## Phase 0 Research Summary

See [research.md](./research.md) for decisions and alternatives. No unresolved planning questions remain.

## Phase 1 Design Artifacts

- Typed publication and public-projection rules: [data-model.md](./data-model.md)
- User-visible listing, detail, route, navigation, and metadata behavior: [contracts/ui-projects.md](./contracts/ui-projects.md)
- Reproducible local and release validation: [quickstart.md](./quickstart.md)

## Complexity Tracking

No constitution violations or complexity exceptions are proposed. Shared header/footer link context is the smallest integration needed for working navigation from `/projects/[slug]`. `src/lib/navigation-enhancement.ts` remains the sole post-hydration navigation-state owner and will be extended to consume server-rendered route context. On the homepage, preserve existing hash-based behavior, including Home as the default when no hash exists. On approved `/projects/[slug]` pages, Portfolio is the sole current destination, and only one navigation item may expose `aria-current` at a time. Keep server-rendered initial navigation state aligned with the route context to preserve hydration consistency; ordinary links must continue to work with JavaScript disabled, and browser history behavior and existing Feature 001/002 functionality must remain intact. Do not introduce a second navigation-state owner or unnecessary client-side state.
