# Feature Specification: Projects Showcase & Project Details

**Feature Branch**: `003-projects-showcase`  
**Created**: 2026-11-02  
**Status**: Draft  
**Input**: User description: "Create a polished project showcase and individual project case studies for the existing software engineering portfolio, using six specified projects and verified content only."

## Clarifications

### Session 2026-11-02

- Q: Which organization should be associated with the academic project category? → A: Technical University of Cluj-Napoca (UTCN).
- Q: How should later verified project details be added to existing entries? → A: Through project content data without project-specific presentation changes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the Project Collection (Priority: P1)

As a recruiter, hiring manager, or engineering teammate, I want to scan a small, clearly grouped set of projects so I can quickly find work relevant to my interests.

**Why this priority**: The collection is the primary entry point to the developer's work and must make the six confirmed projects easy to discover.

**Independent Test**: Open the existing Portfolio destination and verify that exactly the six specified projects appear once each, grouped and ordered by category, with truthful public information and a working details action.

**Acceptance Scenarios**:

1. **Given** a visitor opens `#portfolio`, **When** the showcase loads, **Then** it contains exactly Drivewise, Smart Librarian, ETL Pipeline, Automatic Guitar Tuner, Energy Management System, and AI Recipe, with no additional project cards.
2. **Given** the collection is displayed, **When** the visitor scans it, **Then** projects are grouped in the order Professional Projects, Academic Projects, and Personal Projects; Dava.X projects are labeled “Dava.X Trainee Program” and identify Endava as the organization.
3. **Given** an academic project is displayed, **When** its context is read, **Then** it identifies Technical University of Cluj-Napoca (UTCN) as its organization.
4. **Given** a project has a public details page, **When** the visitor activates its View Details link, **Then** its matching project detail page opens and the URL identifies the project's stable slug.
5. **Given** optional details or media are unavailable, **When** a card is rendered, **Then** unavailable technologies, images, descriptions, and external links are omitted without empty controls or invented content.

---

### User Story 2 - Evaluate an Individual Project (Priority: P1)

As a recruiter or engineer, I want to read a project-specific case study so I can understand its verified purpose, engineering work, and the developer's confirmed contribution.

**Why this priority**: Project case studies demonstrate engineering capability more effectively than technology labels alone, while truthful boundaries protect the developer and former collaborators.

**Independent Test**: Directly open each of the six project URLs and confirm that the page presents its approved identity and category, shows only approved case-study sections, offers a clear route back to the collection, and handles unknown slugs as not found.

**Acceptance Scenarios**:

1. **Given** a visitor opens a known project URL directly, **When** the page loads, **Then** it displays the approved title and category and only the verified overview, motivation, solution, features, technologies, architecture decisions, challenges, contributions, media, and links available for that project.
2. **Given** a case-study field is absent or unapproved, **When** the detail page is rendered, **Then** that section is omitted; unavailable material is not inferred or filled with fabricated prose.
3. **Given** AI Recipe has only its confirmed name and personal-project category, **When** its card or detail page is rendered, **Then** only those confirmed facts and necessary navigation are shown, without assumptions about AI functionality, providers, technology, or deployment.
4. **Given** a visitor selects Back to Projects, **When** navigation completes, **Then** the visitor reaches the existing homepage Portfolio destination at `/#portfolio`.
5. **Given** a visitor opens an unknown or malformed slug, **When** the route is resolved, **Then** a not-found response is shown with no stale project content or metadata.

---

### User Story 3 - Understand Project Context and Authenticity (Priority: P1)

As a visitor, I want each project's category and context to be accurate so I can distinguish professional training work, academic work, and personal work without mistaking training projects for commercial products.

**Why this priority**: Accurate context is essential to a credible portfolio and to safe publication of work associated with an organization or academic setting.

**Independent Test**: Review all six project records and public pages against owner-provided facts and approved project documentation; confirm that each claim is supported and the Dava.X projects are described only as hands-on work completed during the Endava training program.

**Acceptance Scenarios**:

1. **Given** Drivewise, Smart Librarian, or ETL Pipeline is displayed, **When** its context is read, **Then** it is identified only as a hands-on software engineering project completed during the Dava.X Trainee Program at Endava. It is never described as a commercial client engagement, production deployment, or independently delivered Endava product. Training-program experience remains distinct from commercial employment, regardless of later verification of technical details.
2. **Given** Automatic Guitar Tuner or Energy Management System is displayed, **When** its description or technology terms are read, **Then** they are limited to information confirmed by project documentation or owner-provided facts.
3. **Given** responsibilities, outcomes, team size, business impact, deployment state, or implementation details are unverified, **When** public content is prepared, **Then** these claims are omitted and never inferred from a project name or technology list.
4. **Given** public project content is approved, **When** the page or its metadata is generated, **Then** no draft, non-approved, private, or sensitive detail appears in rendered content, metadata, or browser-visible page data.

---

### User Story 4 - Navigate Projects on Any Device (Priority: P1)

As a mobile or desktop visitor, I want project cards and case studies to adapt to my screen and remain accessible so I can explore work without layout or interaction barriers.

**Why this priority**: Visitors may arrive from any device, and project descriptions, links, and media must remain usable throughout the supported viewport range.

**Independent Test**: Inspect the project collection and a representative detail page at 320, 375, 768, 1024, 1440, and 1920 CSS pixel widths; use keyboard navigation, browser history, reduced motion, and 200% zoom.

**Acceptance Scenarios**:

1. **Given** a visitor uses any required viewport width, **When** cards or detail content reflow, **Then** there is no horizontal page overflow, clipped text, overlap, or inaccessible link.
2. **Given** a visitor is on a project detail page, **When** they select a primary site navigation destination, **Then** the link navigates to that destination on the homepage; the Portfolio destination resolves to `/#portfolio` and existing Feature 001 navigation state behavior remains authoritative.
3. **Given** a keyboard user navigates the collection or a detail page, **When** focus moves through links and controls, **Then** the order is logical, names are understandable, focus is visible, and every action is operable without a pointer.
4. **Given** reduced motion is requested, **When** a visitor browses or activates project links, **Then** any nonessential motion is removed or simplified without hiding or delaying information.
5. **Given** project media is absent, delayed, or fails, **When** a page is displayed, **Then** text and navigation remain usable and surrounding layout does not visibly shift.

---

### User Story 5 - Share and Find a Project (Priority: P2)

As a visitor or search engine, I want each project detail page to have a stable, descriptive URL and page metadata so that a specific case study can be opened and understood independently.

**Why this priority**: Direct access and descriptive metadata make project work easier to share and discover without making search-engine claims about unverified details.

**Independent Test**: Open each known URL directly and inspect its title, description, social-sharing metadata, canonical URL when the production site base is configured, and unknown-slug response.

**Acceptance Scenarios**:

1. **Given** a known project page is opened, **When** its document metadata is inspected, **Then** it has a unique descriptive title and meta description derived only from approved project information.
2. **Given** social-sharing metadata is generated, **When** no approved project image exists, **Then** no invented or unrelated image is referenced; available Open Graph information accurately identifies the project.
3. **Given** a production canonical base is configured, **When** project metadata is generated, **Then** the canonical URL resolves to that project's stable public URL; no domain is guessed when a base is not configured.

## Edge Cases

- A project has only a confirmed name and category, as with the initial AI Recipe record.
- A project has a title and category but no verified description or case-study fields.
- A project name, description, technology, or approved link changes or duplicates another record.
- A slug is unknown, malformed, has different casing, or belongs to a draft record.
- An optional project image is missing, delayed, invalid, lacks an approved alternative text, or has an unexpected aspect ratio.
- An external repository or demo URL is unavailable, redirects to an unexpected resource, is unsafe, or no longer corresponds to the approved project.
- A case study contains confidential organization, teammate, academic, credential, or user information.
- A title or case-study section is long, translated, or viewed at 200% browser zoom or a 320 CSS pixel viewport.
- A visitor opens a project detail page directly, reloads it, follows browser back/forward, or selects a primary navigation item from the detail route.
- A public project has no optional details; the page must remain intentional and navigable without manufacturing a case study.
- No visual reference screenshot is available; only the established design system may guide visual decisions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The existing Portfolio destination MUST contain exactly the six initial projects: Drivewise, Smart Librarian, ETL Pipeline, Automatic Guitar Tuner, Energy Management System, and AI Recipe. Each MUST appear once and no additional project may appear in the initial collection.
- **FR-002**: Projects MUST be grouped and ordered as Professional Projects, Academic Projects, then Personal Projects. Within those groups, the default order MUST be Drivewise, Smart Librarian, ETL Pipeline; Automatic Guitar Tuner, Energy Management System; AI Recipe.
- **FR-003**: Drivewise, Smart Librarian, and ETL Pipeline MUST use the category label “Dava.X Trainee Program” and identify Endava as the organization. Their context MUST describe hands-on software engineering projects completed during that professional training program. They MUST NOT be described or framed as commercial client engagements, production deployments, or independently delivered Endava products, even if technical details are later verified. Training-program experience MUST remain distinct from commercial employment.
- **FR-004**: The Automatic Guitar Tuner MUST be represented as an academic hardware/software project for automatic guitar tuning using frequency detection and motor-controlled tuning mechanisms. Embedded systems, Arduino, audio signal processing, stepper motor control, Python, and web-based monitoring MAY be displayed only when confirmed by project documentation or owner-provided information; details about implementation, features, and contribution require the same verification.
- **FR-005**: The Energy Management System MUST be represented as an academic distributed software application focused on energy monitoring and device management. React, Java, Spring Boot, PostgreSQL, microservices, RabbitMQ, Docker, and WebSockets MAY be displayed only as confirmed technologies or concepts; specific features, architecture, and personal contributions require verification.
- **FR-006**: AI Recipe MUST be represented as a personal project with the confirmed project name. No AI provider or model, generation feature, nutrition calculation, image recognition, recommendation behavior, technology, or deployment status may be implied without verification.
- **FR-007**: Each project card MUST identify its title and category and provide a View Details action to its stable project URL. A concise description, technology terms, authentic project image, GitHub link, and Live Demo link MUST appear only when verified and approved. Missing optional information MUST be omitted without empty controls or fabricated content.
- **FR-008**: Project detail pages MUST be addressable at `/projects/{slug}` using a unique, stable, human-readable slug. All six initial project records MUST have unique slugs; the initial slugs MUST be `drivewise`, `smart-librarian`, `etl-pipeline`, `automatic-guitar-tuner`, `energy-management-system`, and `ai-recipe` respectively.
- **FR-009**: A known project detail page MUST display its approved title and category, provide a Back to Projects link to `/#portfolio`, and display only approved, available overview, problem or motivation, solution, feature, technology, architecture decision, engineering challenge, personal contribution, media, GitHub, or live-demo information. Each optional section MUST disappear when its content is missing or unapproved.
- **FR-010**: When a project has no verified case-study content beyond its title and category, its detail page MUST remain navigable and clearly identified, and MUST NOT invent narrative content to fill space. A neutral, visibly identified notice that case-study details are unavailable may be used only when needed to explain the sparse page.
- **FR-011**: Unknown, malformed, or unpublished project slugs MUST produce an appropriate not-found response, MUST NOT render project details or project-specific metadata, and MUST NOT be indexable. Public static route generation MUST include approved projects only; unknown or unpublished slugs MUST NOT produce public static pages.
- **FR-012**: Project content MUST be separate from presentation and represented by a strongly typed model supporting stable ID, unique slug, title, one of the three categories, optional organization/program attribution, summaries, technologies/concepts, media, external links, case-study sections, and publication metadata. Each content field MUST carry independent factual-verification and publication-approval states. Factual verification MUST distinguish `unverified` from `verified` and record a source class (`owner-confirmed` or `approved-project-documentation`). Publication approval MUST distinguish `unapproved` from `approved`. Record publication eligibility MUST distinguish `draft` from `approved`.
- **FR-013**: A project record MUST be eligible for public listing, static route generation, or metadata only when its record publication state is `approved` and each required identity field is both factually `verified` and publication `approved`. An optional field MUST be rendered only when its own factual-verification state is `verified` and publication-approval state is `approved`; otherwise omit it. The public projection MUST omit status, source, review metadata, draft values, and all unapproved or unverified content. These exclusions apply to static generation, metadata, rendered HTML, and browser-serialized data. Private information, credentials, secrets, and confidential third-party details MUST NOT be entered into project content, including drafts.
- **FR-014**: Essential project identity fields MUST be non-empty. If an essential field is unavailable or unverified for a future record, use a neutral, clearly marked placeholder only when the project record must be represented; the placeholder MUST identify the missing field and verification status and MUST NOT imply an engineering claim. Missing optional information MUST be omitted rather than replaced with placeholders. For the six initial projects, use only the supplied confirmed names and categories where further details are unavailable.
- **FR-015**: Every public claim MUST have a recorded verification source class of owner confirmation or approved project documentation and independent publication approval. Employment context, responsibilities, individual contribution, technologies, architecture, team size, outcomes, business impact, certifications, deployment status, permissions, and external URLs MUST NOT be inferred from a title or category. Verification source and approval metadata MUST remain server-side and MUST NOT be serialized to public output.
- **FR-016**: Project media MUST be authentic, approved for public use, appropriately sized, and accompanied by meaningful alternative text when informative or empty alternative text when decorative. Missing or failed media MUST NOT show broken-image indicators, create a visible layout shift, or cause essential project information to be unavailable.
- **FR-017**: GitHub and Live Demo links MUST point only to the exact factually verified and publication-approved resource for that project. Before publication and whenever a link is reviewed or reported as changed, its destination MUST be checked. Omit a link that is unavailable, unsafe, no longer project-relevant, or redirects to an unexpected destination unless that destination is separately verified and approved. Never guess or substitute a URL. No automated monitoring service or external-link infrastructure is required.
- **FR-018**: The showcase MUST integrate with the existing `#portfolio` destination and preserve all Feature 001 homepage navigation contracts. From a project detail route, primary navigation MUST link to the corresponding homepage destinations. On an approved `/projects/{slug}` detail page, Portfolio MUST be the sole primary destination exposing `aria-current="location"`; Home MUST NOT be current merely because the detail URL has no hash. Returning to `/#portfolio` MUST restore the existing Portfolio current state. Existing homepage hash/history behavior, hydration timing, active-state ownership, and no-JavaScript navigation MUST remain unchanged; the existing navigation-state architecture remains the sole post-hydration owner.
- **FR-019**: The project showcase and detail pages MUST extend the established Features 001–002 visual identity, design tokens, typography, spacing, section patterns, and accessible interaction states. Supplied screenshots are inspirational references only. If unavailable, their details MUST NOT be invented; decisions MUST follow the approved design system.
- **FR-020**: The showcase and project detail pages MUST adapt at 320, 375, 768, 1024, 1440, and 1920 CSS pixel widths and at 200% browser zoom without horizontal overflow, clipped content, overlapping elements, information loss, hidden focus indicators, or unreachable actions. At 200% zoom, content MUST reflow, cards remain readable, and all controls remain operable. Project media MUST preserve a stable proportion.
- **FR-021**: Project pages MUST use semantic landmarks, a logical heading hierarchy, clear accessible link names, keyboard-operable actions, visible focus indicators, applicable WCAG 2.2 AA contrast, and practical touch targets of at least 44 by 44 CSS pixels where feasible. Reduced-motion preferences MUST be respected; motion MUST NOT be necessary to reveal or understand content. Manual screen-reader, keyboard, focus order/visibility, contrast, and 200% zoom reviews MUST be completed and documented before release acceptance; automated Axe results MUST NOT substitute for manual review.
- **FR-022**: Project listing and detail content MUST remain available as meaningful page content without client-side interaction. No hydration-dependent behavior may be required to read project descriptions or follow standard links. Fresh loads MUST not introduce hydration mismatch warnings or errors.
- **FR-023**: Each approved project detail page MUST have a unique descriptive title and meta description based solely on fields that are both factually verified and publication approved, plus appropriate Open Graph metadata. If no approved project summary exists, metadata MUST use only the approved title/category in neutral wording and MUST NOT infer project functionality. Open Graph images MUST be included only when authentic media is both verified and approved. Canonical metadata MUST use the configured production site base when available and MUST NOT guess an unconfigured domain. Unknown or unpublished routes MUST NOT expose draft metadata and MUST use generic noindex metadata.
- **FR-024**: Unknown, malformed, and unpublished project URLs MUST return not-found behavior and MUST NOT reuse another project's content or metadata. Their responses MUST be non-indexable. Unpublished projects MUST NOT be included in public static route generation.
- **FR-025**: Feature 003 MUST preserve the constitution's Lighthouse targets of at least 90 in Performance, Accessibility, Best Practices, and SEO and Core Web Vitals targets of LCP at most 2.5 seconds, CLS at most 0.1, and field INP at most 200 milliseconds at the 75th percentile when measurable. Reproducible mobile and desktop measurements MUST document date or tool version, device/testing profile, all category scores, lab LCP/CLS, and field INP only when sufficient field data exists; otherwise INP MUST be recorded as “not yet measurable.” The known Feature 001 desktop Performance score of 89 MUST remain documented as an open issue until a new measurement demonstrates compliance. Scores below 90 MUST NOT be reported as passing; unresolved gaps MUST be reported as open release issues.
- **FR-026**: Feature 003 MUST NOT introduce a CMS, database, admin dashboard, authentication, project editing interface, separate backend, Features 004–006, contact form, analytics dashboard, or infrastructure without a justified requirement.
- **FR-027**: Automatic Guitar Tuner and Energy Management System MUST be categorized as Academic Projects and identify Technical University of Cluj-Napoca (UTCN) as the organization. This association MUST NOT imply university endorsement or approval of the project unless that claim is separately verified.
- **FR-028**: Adding or updating verified project descriptions, technology/concept terms, approved images, links, or case-study sections for an existing project MUST be possible through its content record without requiring project-specific changes to the shared card or detail presentation. A new project-specific presentation variant is out of scope unless a separately approved requirement justifies it.
- **FR-029**: Before release acceptance, a manual accessibility review MUST cover screen-reader navigation, keyboard interaction, focus order and visibility, color contrast, and 200% browser zoom for the showcase and representative project detail pages. Record date, environment, assistive technology, viewport/zoom, results, and evidence. Each failure MUST be recorded with severity, requirement reference, remediation status, and retest evidence. Any unresolved applicable WCAG 2.2 AA failure MUST block release acceptance. If a required manual check cannot be performed, it MUST remain pending and MUST block release acceptance. Automated Axe checks are a separate requirement and MUST NOT count as manual evidence.

### Key Entities *(include if data involves)*

- **Project**: One curated project with a stable identity, slug, title, category, optional organization and verified description, optional approved case-study sections, technology/concept terms, optional media and external links, and publication/approval status.
- **Project Category**: One of the three fixed public groups: Dava.X Trainee Program, Academic Projects, or Personal Projects. Dava.X projects identify Endava; academic projects identify Technical University of Cluj-Napoca (UTCN). These organization labels do not imply commercial delivery, university endorsement, or production deployment.
- **Case-study section**: An optional approved explanation of a project's overview, motivation/problem, solution, features, architecture decisions, challenges, or personal contribution.
- **Project media**: An optional authentic project image or screenshot with approval status, accessible alternative text, and stable display proportions.
- **Project link**: An optional exact, verified, approved GitHub or Live Demo destination belonging to one project.
- **Publication approval**: The state determining whether a project identity and its individual public fields may be presented. Public rendering includes approved fields only and excludes draft/private material.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Portfolio destination displays exactly six unique project cards, each once, in the specified category and default order.
- **SC-002**: All six project detail URLs open directly and display the matching approved title and category; an unknown slug returns not found rather than another project's content.
- **SC-003**: Every displayed project claim, technology term, image, or external link has both a recorded verified source and publication approval; no unverified or unapproved case-study claim is rendered.
- **SC-004**: Missing optional descriptions, details, media, and links produce no empty cards controls, broken links, or broken-image indicators; all detail pages remain clearly identified and navigable.
- **SC-005**: At 320, 375, 768, 1024, 1440, and 1920 CSS pixel widths and at the documented 200% browser-zoom condition, the listing and representative detail page have no horizontal overflow, information loss, clipping, overlap, hidden focus, or unreachable action; every project card remains readable and wraps naturally.
- **SC-006**: Automated Axe checks report no WCAG 2.2 AA violations on the listing, representative detail, and not-found states. Separately, before release acceptance, dated manual screen-reader, keyboard, focus order/visibility, contrast, and zoom reviews have recorded evidence; unresolved applicable WCAG 2.2 AA failures or unperformed required checks remain release blockers.
- **SC-007**: Each approved project detail page has unique, accurate metadata derived only from verified and approved fields; canonical URLs, when configured, point to the matching project URL. Unknown and unpublished URLs return not found, are non-indexable, expose no project-specific draft metadata, and are absent from public static route generation.
- **SC-008**: Fresh direct loads of the project listing and detail pages produce no hydration warnings or errors; project text and standard links remain usable without client-side interaction.
- **SC-009**: Reproducible mobile and desktop Lighthouse runs record all four category scores plus lab LCP/CLS and INP availability. No score below the constitution's 90 target is reported as passing, and the previous desktop baseline of 89 remains identified as an open issue until a new measurement confirms compliance.
- **SC-010**: Type checking, linting, formatting, component tests, responsive and accessibility browser tests, and production build complete successfully before implementation is declared verified; results are recorded without claiming checks that were not run.
- **SC-011**: The two academic project entries identify Technical University of Cluj-Napoca (UTCN), and adding an approved optional field to an existing project record requires no project-specific presentation variant.
- **SC-012**: No Dava.X trainee project is represented as commercial client or production work regardless of later verification; project training experience remains explicitly distinct from commercial employment.

## Assumptions

- The six project names, categories, and the project facts explicitly listed in the request are owner-provided and approved for use as the initial public facts. No additional claim is implied by that approval.
- Technical University of Cluj-Napoca (UTCN) is the organization associated with the two academic projects; this does not imply institutional endorsement.
- The three Dava.X projects may share the factual training-program context description; project-specific responsibilities, technologies, architecture, and results remain unavailable until verified.
- Automatic Guitar Tuner and Energy Management System may show only the listed project scope and technologies/concepts that are confirmed by owner-provided information or project documentation.
- AI Recipe initially has only its title and Personal Projects category; its card and detail route may show those facts without optional description or case-study sections.
- Each initial project has an approved public identity and category. Optional fields are approved independently; future drafts or unapproved fields are excluded from public output.
- Six projects are sufficiently few to scan as grouped sections; category filters or tabs are unnecessary for the initial release and are excluded unless later evidence shows a usability need.
- Existing Feature 001–002 shell, design tokens, navigation enhancer, and typed local content approach remain the foundation. Planning may select implementation details without changing these product contracts.
- Original visual reference screenshots are not accessible in the current workspace; use the established design system as the visual source of truth without inferring screenshot details.
- The last documented Feature 001 desktop Lighthouse Performance baseline is 89, below the constitution target; this remains open until new evidence establishes otherwise.
- Feature 003 has no user-submitted data or need for persistent storage, account access, or a content administration service.
