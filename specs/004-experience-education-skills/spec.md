# Feature Specification: Experience, Education & Skills

- **Feature Branch**: `feature/004-experience-education-skills` (current branch; no branch change made during planning)
- **Created**: 2026-11-04
- **Status**: Draft
- **Input**: User-provided professional facts and Feature 004 requirements
## Clarifications

### Session 2026-11-04

- Q: Was the entire June–October 2026 Endava period part of the Dava.X Trainee Program? → A: Yes. All Endava experience in this period was training-program work; there was no separate commercial client assignment or professional project outside Dava.X.
- Q: How should Feature 004 refer to the Dava.X projects? → A: Keep their case studies in Feature 003. Feature 004 may briefly name Drivewise, AI Smart Librarian, and Data Integration ETL Pipeline without duplicating their full case studies.
- Q: May Feature 004 correct the existing About sentence that says Endava is current employment? → A: Yes. Update that sentence to state the Endava role ended in October 2026 while preserving the About section's layout, behavior, and all other approved content.

## User Scenarios & Testing

### User Story 1 - Review Professional Experience (Priority: P1)

As a recruiter or hiring manager, I want to understand Casian's verified work history and contributions so that I can assess relevant professional experience without confusing past employment with a current role.

**Why this priority**: Employment history is central to recruiter evaluation, and accurate dates and status prevent a misleading impression.

**Independent Test**: Review the Experience section and verify both entries, dates, ordering, location/work arrangement, and supplied contribution areas against the owner-provided facts.

**Acceptance Scenarios**:

1. **Given** the Experience section, **When** a visitor scans its entries, **Then** Endava (Junior Data Engineer, Dava.X Trainee Program, June–October 2026) appears before Core Elevating Media (Software Engineer Intern, July–August 2024), in reverse chronological order.
2. **Given** the Endava entry, **When** a visitor reads its status and dates, **Then** it is identified as Junior Data Engineer in the Dava.X Trainee Program, is clearly former employment ending October 2026, and is not presented as current.
3. **Given** either experience entry, **When** contribution details are available, **Then** they are concise, scannable, and limited to the verified information supplied for that employer.

---

### User Story 2 - Review Education (Priority: P1)

As a recruiter, I want to see verified academic background and any CV-listed certifications so that I can understand the developer's education without encountering invented dates or credentials.

**Why this priority**: Education and qualifications help provide context for the developer's professional background.

**Independent Test**: Review both education records and the certifications subsection; compare displayed names, dates, institutions, and status to the provided facts and confirm unknown values are omitted.

**Acceptance Scenarios**:

1. **Given** the Education section, **When** a visitor scans its entries, **Then** the completed Bachelor of Engineering in Computer Engineering at Technical University of Cluj-Napoca displays October 2021–July 2025 and Cluj-Napoca, Romania.
2. **Given** the Liceul Teoretic "Ioan Buteanu" entry, **When** the visitor reviews it, **Then** Mathematics and Computer Science, Somcuta Mare, Romania, and graduated status may be shown, while the unknown period is omitted.
3. **Given** the certifications subsection, **When** a visitor reviews it, **Then** it shows only the three CV-listed credential names and the known O'Reilly attribution for the first two, with no invented dates, issuer for Social Enterprise Manager, credential links, or verification claims.

---

### User Story 3 - Scan Technical Skills (Priority: P1)

As an engineering team member or recruiter, I want to scan the developer's technologies by meaningful category so that I can quickly identify relevant technical exposure without being shown unsupported proficiency claims.

**Why this priority**: A clear, honest skills inventory helps visitors assess fit while avoiding misleading ratings.

**Independent Test**: Compare the displayed grouped inventory with the supplied CV list, checking category assignments, exact inclusion, and the absence of proficiency scores, years, or endorsements.

**Acceptance Scenarios**:

1. **Given** the Skills section, **When** a visitor scans its groups, **Then** every supplied technology appears in its designated category and no unprovided technology is added.
2. **Given** any listed skill, **When** it is displayed, **Then** it is presented as CV-listed experience without a proficiency level, percentage, progress bar, or years-of-experience claim.
3. **Given** a missing or unpublished skill value, **When** public content is generated, **Then** the value is omitted rather than shown as a placeholder or leaked draft.

---

### User Story 4 - Navigate and Use the Sections Accessibly (Priority: P1)

As a keyboard, touch, or assistive-technology user, I want to reach Experience, Education, and Skills predictably across screen sizes so that the new information remains usable alongside the existing portfolio.

**Why this priority**: New content must remain discoverable and must not regress the established navigation or accessible experience.

**Independent Test**: Navigate to each section by its destination link and direct fragment URL, use browser back/forward and JavaScript-disabled navigation, then review the sections at supported widths and 200% zoom.

**Acceptance Scenarios**:

1. **Given** any homepage route, **When** a visitor selects Experience, Education, or Skills, **Then** the matching `#experience`, `#education`, or `#skills` destination is reached and the established navigation owner identifies the current destination.
2. **Given** JavaScript is disabled or motion is reduced, **When** a visitor uses section navigation, **Then** all destinations and content remain available and usable.
3. **Given** a supported viewport or 200% zoom, **When** the visitor scans or operates the sections, **Then** content reflows without horizontal overflow, clipping, overlap, hidden focus, or unreachable controls.

---

### Edge Cases

- Endava's entire June–October 2026 period was within the Dava.X Trainee Program. It must not be divided into a separate commercial assignment, production role, or independent employment project.
- The Dava.X projects remain documented in Feature 003 as Drivewise, AI Smart Librarian, and Data Integration ETL Pipeline. Feature 004 may name them briefly but must not duplicate their full case studies.
- The high-school period is unknown and must be omitted without a public placeholder.
- Certification completion dates and credential links are unavailable; the issuer of Social Enterprise Manager is also unavailable. These optional details must be omitted.
- A field may have a verified source but lack publication approval, or approval without factual verification; either condition excludes it from public output.
- One category or optional detail may have no eligible values; its layout must remain understandable without empty labels or controls.
- A long skill name or experience contribution must wrap without clipping or forcing horizontal scrolling.
- Direct hash navigation, browser history, mobile navigation, and no-JavaScript anchor navigation must continue to work with the added destinations.
- Existing Home, About, Portfolio, Contact, Hero, About, and Projects content must remain present and function as before.

## Requirements

### Functional Requirements

- **FR-001**: The homepage MUST provide three integrated sections in this order after the existing Portfolio section and before Contact: Professional Experience at `#experience`, Education at `#education`, and Technical Skills at `#skills`. Each ID MUST be unique and stable.
- **FR-002**: Professional Experience MUST contain exactly the two supplied entries, in reverse chronological order: Junior Data Engineer at Endava, within the Dava.X Trainee Program, June–October 2026, Cluj-Napoca, Romania; then Software Engineer Intern at Core Elevating Media, July–August 2024, remote.
- **FR-003**: The Endava entry MUST state former employment and identify Dava.X Trainee Program as the program for the entire June–October 2026 period. It MUST NOT imply current employment, commercial client delivery, production responsibilities, or an independent employment assignment outside Dava.X. Its verified description may cover SQL, PL/SQL, RDBMS, data modeling, ETL and data transformation; Python and Generative AI (RAG, embeddings, function calling, prompt engineering); foundational Data Science and Machine Learning; Git, GitHub, GitLab and collaborative workflows; Next.js, React, TypeScript and Tailwind CSS; and exposure to DevOps, Cloud, Agile/Scrum, ITIL and software delivery processes. It MUST NOT claim business metrics or outcomes not supplied. The Dava.X projects remain in Feature 003 as Drivewise, AI Smart Librarian, and Data Integration ETL Pipeline. Feature 004 MAY briefly name them but MUST NOT duplicate their full case studies, project-specific responsibilities, technologies, outcomes, or media.
- **FR-004**: The Core Elevating Media entry MUST identify the remote work arrangement and July–August 2024 period. Its verified contributions may cover full-stack React, Node.js, Express and SQL development; responsive interfaces; REST API integration and JWT authentication; Jest and Cypress unit, integration and end-to-end testing; and collaboration using Git and Jenkins CI. No other employer details or outcomes may be inferred.
- **FR-005**: Education MUST contain the two supplied entries: Bachelor of Engineering, Computer Engineering, Technical University of Cluj-Napoca, October 2021–July 2025, Cluj-Napoca, Romania, graduated; and Liceul Teoretic "Ioan Buteanu", Mathematics and Computer Science, Somcuta Mare, Romania, graduated. The latter's unknown period MUST be omitted; grades, awards, and other qualifications MUST NOT be invented.
- **FR-006**: Education MUST include a Certifications subsection for the three CV-listed credentials: “LLM Performance Engineering” and “GenAI Essentials for Everyone” with O'Reilly as the stated issuer, and “Social Enterprise Manager” without an inferred issuer. Completion dates, verification URLs, credential numbers, and additional qualifications MUST be omitted unless later supplied and approved. If a credential's name is not independently eligible under the verification and publication rules, that credential MUST be omitted without inventing replacement information.
- **FR-007**: Skills MUST present the complete supplied CV inventory in these fixed categories and order: Programming Languages; Frontend & Mobile; Backend; Databases; DevOps & Infrastructure; Additional Technologies & Tools. Within each category, preserve the item order supplied here. The inventory is exactly: Programming Languages—Python, Java, JavaScript, TypeScript, C/C++, Kotlin, PL/SQL, VHDL, Assembly, HTML/CSS; Frontend & Mobile—React, Next.js, Angular, React Native, Expo, Tailwind CSS, NativeWind; Backend—Node.js, Express, Spring Boot, Flask; Databases—PostgreSQL, MySQL, MongoDB; DevOps & Infrastructure—Docker, Traefik, Nginx, Linux, RabbitMQ; Additional Technologies & Tools—Git, OpenGL, OpenCV, Arduino. Each skill MUST appear once in this inventory. Categories are fixed for Feature 004; category configuration, filtering, and proficiency ranking are out of scope.
- **FR-008**: Skill names MUST be presented as a CV-derived inventory only. The feature MUST NOT imply advanced proficiency or add proficiency levels, years of experience, percentages, progress bars, certifications, or endorsements.
- **FR-009**: Publication eligibility MUST apply at both the entry level and field level. An experience, education, certification, or skill-category record MUST be approved for publication, and every public field within it MUST independently be factually verified and approved for publication. Factual verification and publication approval MUST remain separate conditions; verification MUST identify owner confirmation or an appropriate supporting source. A record-level approval MUST NOT authorize an unverified or individually unapproved field, and a field-level approval MUST NOT publish a draft record.
- **FR-010**: Unverified, unapproved, unknown, or draft values MUST remain internal draft/TODO data or unpublished, and MUST NOT appear in page HTML, metadata, static output, or browser-serialized data. Missing optional values, including the high-school period and certification dates/links, MUST be omitted without empty UI or fabricated placeholders.
- **FR-011**: The added section destinations MUST extend existing primary navigation in this order: Home, About, Portfolio, Experience, Education, Skills, Contact. Existing destinations MUST retain their labels, targets, and behavior. The existing navigation enhancer MUST remain the sole active-destination owner; exactly one primary link may expose `aria-current="location"` at a time.
- **FR-012**: On the homepage, Home MUST be current when no hash is present; a direct recognized hash, primary-link activation, refresh, and browser back/forward MUST synchronize the URL, visible active state, and accessible current-location indication for the matching destination. Passive scrolling between sections MUST NOT change the current destination; active state follows the URL/hash and existing history behavior. On approved `/projects/[slug]` pages, Portfolio MUST remain the sole current primary destination; links to the new sections MUST navigate to their corresponding root-prefixed homepage hashes, which then become current. Exactly one primary link may expose `aria-current="location"`. JavaScript-disabled navigation MUST retain ordinary, valid links to all homepage section IDs. No competing navigation-state owner may be introduced.
- **FR-013**: The sections MUST use semantic landmarks, a logical heading hierarchy, readable dates and locations, scannable contributions, categorized skill groups, accessible link names, visible focus, and sufficient contrast for applicable WCAG 2.2 AA criteria. Reduced-motion preferences MUST be respected.
- **FR-014**: Layouts MUST support 320, 375, 768, 1024, 1440, and 1920 CSS-pixel viewport widths and 200% browser zoom without horizontal overflow, clipped or overlapping content, loss of information, hidden focus, or unreachable controls. Text and technology names MUST wrap naturally. At 320–1023px, the existing full-screen mobile navigation MUST expose all seven destinations with keyboard access and visible focus; its panel MUST scroll vertically when the destinations do not fit the viewport. At 1024px and above, the seven primary links MUST remain uncompressed and unwrapped, consistent with the existing desktop navigation contract. Interactive targets MUST be at least 44 by 44 CSS pixels where practical.
- **FR-015**: Existing Feature 001–003 layouts, section structure, navigation contracts, project routes, hydration behavior, publication safety, responsive behavior, and no-JavaScript navigation MUST remain intact. The only allowed existing-copy change is to correct the Feature 002 About sentence that currently says the developer works at Endava, so it states the Junior Data Engineer role ended in October 2026 and was within the Dava.X Trainee Program. Preserve the About layout, behavior, and all other approved copy.
- **FR-016**: Content MUST remain readable and in the document when JavaScript or animation is unavailable. Interaction or animation MUST NOT be required to access essential experience, education, or skill information.
- **FR-017**: Feature 004 MUST preserve constitutional Lighthouse targets of at least 90 for Performance, Accessibility, Best Practices, and SEO, and Core Web Vitals targets of LCP at most 2.5 seconds, CLS at most 0.1, and field INP at most 200 milliseconds at the 75th percentile when measurable. Comparable mobile and desktop results and field-data availability MUST be recorded. Scores below target MUST remain open issues and MUST NOT be reported as passing. The recorded desktop Performance results (87 for the homepage collection and 89 for a representative project detail, compared with the Feature 001 baseline of 89) remain unresolved until a new measurement demonstrates compliance.
- **FR-018**: Acceptance MUST include automated checks for section content, entry ordering, exact skill inventory/category, optional-value omission, publication filtering, fragment/history navigation, accessibility automation, responsive widths, hydration stability, and production output. Manual keyboard, screen-reader, focus, contrast, zoom, and reduced-motion checks MUST be recorded separately with date, environment, actual results, evidence, and unresolved issues before release acceptance; they MUST NOT be claimed from automated results alone.

### Key Entities

- **Experience entry**: An employer, role, date range, employment status, optional location/work arrangement, concise responsibilities/contributions, and eligible related technologies.
- **Education entry**: Institution, qualification or field of study, dates when known, location, and completion status.
- **Certification record**: Optional CV-listed credential name and only the issuer information explicitly supplied; date, verification link, and other details are optional and currently unavailable.
- **Skill category and item**: A named category with an ordered list of CV-listed technology names; no proficiency claims are part of the entity.
- **Publication field**: A fact with independent factual-verification and publication-approval states; only eligible fields enter public presentation.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Exactly two experience entries appear once each and in reverse chronological order; Endava is identified as Junior Data Engineer in the Dava.X Trainee Program, labeled former, and shows June–October 2026, with no separate commercial or production assignment implied.
- **SC-002**: All supplied responsibility/contribution areas for both employers are represented in concise scannable content, with no invented metrics, client work, production status, or outcomes.
- **SC-003**: Both supplied education entries appear with their confirmed names, fields, locations, dates when known, and graduated status; the unknown high-school period is absent from public output.
- **SC-004**: The Education certifications subsection contains exactly the three supplied credential names and known O'Reilly attribution, with no invented date, link, credential number, issuer, or verification claim.
- **SC-005**: All 33 supplied technology names appear exactly once in the six fixed categories and item order specified in FR-007; no duplicate, unsupplied technology, or proficiency rating appears.
- **SC-006**: Any field without both factual verification and publication approval is absent from rendered HTML, metadata, static output, and serialized public content; each missing optional value creates no empty or misleading control.
- **SC-007**: All seven primary destinations resolve to the matching unique homepage section; direct hash, refresh, activation, back/forward, accessible current-location indication, and no-JavaScript behavior remain correct with exactly one current destination. Passive scrolling does not change current state, and approved project detail pages keep Portfolio as the sole current destination until navigation returns to a homepage hash.
- **SC-008**: At 320, 375, 768, 1024, 1440, and 1920 CSS pixels and at 200% browser zoom, all three sections remain readable and operable without horizontal overflow, clipping, overlap, information loss, or unreachable controls.
- **SC-009**: Automated accessibility scans report no configured WCAG 2.2 AA violations on the updated homepage, and required manual keyboard, screen-reader, focus, contrast, zoom, and reduced-motion checks are separately documented before release acceptance.
- **SC-010**: Existing Feature 001–003 structure, project routes, navigation behavior, hydration stability, and publication boundaries pass their existing regression checks after integration; the only existing-copy difference is the authorized About sentence correction describing Endava as former employment ending October 2026.
- **SC-011**: Production mobile and desktop quality audits record Performance, Accessibility, Best Practices, and SEO results plus lab LCP/CLS; field INP is recorded only when sufficient real-user data exists, otherwise as “not yet measurable.” No below-target result is represented as a pass.

## Assumptions

- The facts in this request and the clarification session are owner-confirmed and approved as the initial source for Feature 004. Each fact remains subject to the project's separate verification and publication-approval gates; no approval of one field authorizes unrelated fields.
- The three sections appear after Portfolio and before Contact, in Experience, Education, Skills order. Their navigation links are added to the established primary navigation while existing destinations and behaviors remain unchanged.
- Certifications are included in scope as a subsection within Education because the owner supplied them as CV-listed credentials. The supplied O'Reilly attribution applies only to the first two titles. “Social Enterprise Manager” is displayed without issuer information.
- The existing About section's layout and behavior remain intact. Feature 004 corrects only the outdated Endava employment sentence to state the role ended in October 2026; all other approved Hero/About content remains unchanged. Feature 004 provides detailed sections without duplicating long narrative paragraphs. Dava.X project case studies remain in Feature 003; Feature 004 may include only a brief identifying reference to the three projects.
- Existing Feature 001–003 design tokens and navigation enhancer remain authoritative. No screenshot reference was attached to this request; no unavailable visual details are inferred.
- The prior desktop Lighthouse Performance shortfall remains an open issue; Feature 004 does not lower any constitutional target.
- No database, CMS, account system, certification verification service, or new infrastructure is needed.

### Unresolved Optional Facts

These facts are not required to publish the specified content and MUST remain omitted until confirmed:

- Attendance dates for Liceul Teoretic "Ioan Buteanu".
- Completion dates, credential numbers, and verification URLs for the three CV-listed certifications.
- The issuer of “Social Enterprise Manager.”
- Proficiency levels or years of experience for any skill; neither is included in this feature.

No unresolved factual question blocks specification or implementation planning because the corresponding information is optional and has an explicit omission rule.
