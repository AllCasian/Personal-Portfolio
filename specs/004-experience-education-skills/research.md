# Research: Experience, Education & Skills

- **Feature**: [spec.md](./spec.md)
- **Date**: 2026-11-04
This feature uses established repository patterns and owner-confirmed local content. No new service, package, external data source, or infrastructure is required.

## Decisions

### R1. Curated content remains local and separate from presentation

- **Decision**: Store Experience, Education/Certifications, and Skills in centralized typed content modules under `src/content/`; render them through small section and item components.
- **Rationale**: The existing profile and projects follow the same source/presentation split. Static facts do not need a CMS or database.
- **Alternatives considered**: A CMS/database would introduce operational and publication workflow complexity without a user-editing requirement. Embedding content in JSX would make review and maintenance harder.

### R2. Verification and publication are gated at record and field levels

- **Decision**: Mirror Feature 003's independent verification and approval semantics. Each entry/category/item has record-level publication eligibility, and each public field has its own verification source/status and publication approval. Build a server-side public projection and pass only its allowlisted DTOs to presentation components.
- **Rationale**: Approval cannot establish truth, and verification cannot grant publication permission. Filtering before rendering prevents drafts and approval metadata from entering HTML or client bundles.
- **Alternatives considered**: One Boolean for a whole section cannot safely omit an ineligible field within an otherwise approved entry. Passing raw records and hiding values in components risks leakage.

### R3. Keep Feature 004 types and projection isolated from Feature 003 project types

- **Decision**: Use Feature 004-specific content contracts and one small profile-content projection/validation module. Reuse the publication rules, not the project-specific `ProjectRecord` schema or service.
- **Rationale**: Experience, education, skills, and project case studies have different identities and lifecycles. A profile-specific model avoids coupling the project catalog to employment history.
- **Alternatives considered**: Generalizing Feature 003's project domain types would widen scope and could regress existing project routes. Repeating a projection implementation per section would duplicate identical rules.

### R4. Keep the six skill categories and their item order fixed

- **Decision**: Use the exact six categories and item sequence in FR-007. Render skills as accessible text lists or restrained text chips, without logos, levels, ratings, or user-configurable categories.
- **Rationale**: The approved inventory is finite and ordered; plain text is responsive, readable, and avoids implying unsupported proficiency.
- **Alternatives considered**: Runtime category configuration and filtering add state and maintenance work with no stated user need. Logo-heavy grids add visual weight and inconsistent meaning.

### R5. Extend the existing navigation owner for the seven destinations

- **Decision**: Add Experience, Education, and Skills to `src/content/navigation.ts`, section definitions, and the recognized section set in `src/lib/navigation-enhancement.ts`. Keep the enhancer as the only post-hydration active-state owner. Preserve URL/hash and browser-history behavior; passive scroll does not set current state.
- **Rationale**: Feature 001–003 establish URL-driven navigation, exactly one current destination, and a route-context rule that keeps Portfolio current on project details.
- **Alternatives considered**: A second React state owner or scroll observer would compete with the approved contract and risk hydration/history regressions.

### R6. Keep the seven-link menu usable at the existing breakpoints

- **Decision**: Retain the full-screen mobile menu at 320–1023px and desktop navigation at 1024px and above. The mobile panel uses its existing vertical scrolling behavior; desktop links remain unwrapped and uncompressed.
- **Rationale**: This preserves Feature 001 breakpoints and keyboard/focus behavior while allowing all seven destinations to remain reachable.
- **Alternatives considered**: A new menu controller or alternate breakpoint would change the shared navigation contract. Hiding links is not acceptable.

### R7. Correct only the stale Endava About sentence

- **Decision**: Update the existing `src/content/profile.ts` About experience sentence to describe the Junior Data Engineer role at Endava as former employment from June through October 2026 within Dava.X. Preserve the About section structure, layout, other approved copy, and Hero behavior.
- **Rationale**: The current sentence says the developer currently works at Endava, contradicting the confirmed end date. The constitution requires a truthful professional story. The owner explicitly approved this single-sentence correction during planning clarification.
- **Alternatives considered**: Leaving the current-employment claim would publish a known false fact. Rewriting the About section or changing its layout is outside the clarification.

### R8. Keep Dava.X case studies in Feature 003 and avoid title duplication

- **Decision**: Feature 004 does not need to mention individual Dava.X project names. If a brief reference is later required, use the existing public project records and omit optional names until the title discrepancy is reconciled. Do not rename Feature 003 records or duplicate case studies.
- **Rationale**: Feature 003 currently uses “Smart Librarian” and “ETL Pipeline”; the latest Feature 004 clarification uses “AI Smart Librarian” and “Data Integration ETL Pipeline.” The Feature 004 user input explicitly says to treat this as an unresolved naming discrepancy.
- **Alternatives considered**: Hard-coding the new titles in Feature 004 would duplicate potentially stale names. Renaming Feature 003 projects is outside this plan.

### R9. Omit unavailable optional facts

- **Decision**: Do not display high-school attendance dates, credential completion dates/numbers/URLs, the Social Enterprise Manager issuer, or skill levels/years. Keep unknown values in internal TODO/draft state only when needed for maintenance; omit them from the public projection.
- **Rationale**: These facts are not required to satisfy the user stories and were not supplied.
- **Alternatives considered**: Public placeholders would add clutter and could imply factual claims.

### R10. Preserve Feature 003 performance evidence and thresholds

- **Decision**: Compare comparable production Lighthouse runs with the existing evidence. Keep the constitutional score and Core Web Vitals targets unchanged; the homepage desktop score 87 and representative project-detail score 89 remain below target and open.
- **Rationale**: Feature 003 documents the actual runs and explicitly leaves desktop Performance unresolved. Feature 004 cannot treat those results as a pass or attribute them to new sections.
- **Alternatives considered**: Lowering targets or making speculative optimization changes would conflict with the constitution and the current request.

## Open Integration Note

The approved clarification authorizes a one-sentence About content correction. Planning can include that exact copy change without changing Feature 002 structure or behavior. The Feature 003 project-name mismatch remains non-blocking because project references are optional and the plan omits those names from Feature 004's initial public content.
