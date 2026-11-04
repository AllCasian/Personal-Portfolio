# Performance & SEO Requirements Checklist: Projects Showcase & Project Details

**Purpose**: Review performance targets, reproducibility, metadata, canonical URLs, and publication-safe indexing.  
**Created**: 2026-11-02  
**Feature**: [Specification](../spec.md) · [Plan](../plan.md) · [Research](../research.md) · [Quickstart](../quickstart.md)

**Note**: Reviewer-owned checklist for requirements quality, not implementation verification.
**Review Ownership**: A reviewer marks an item complete only when the written requirement is clear and sufficient.
**Marker Semantics**: `[x]` means requirements-quality review passed; it does not mean the application is implemented.

## Non-Functional Requirements and Search Metadata

- [x] CHK054 Are Server Components, static content, limited client JavaScript, and the reason no client-side category filter is needed stated consistently as architectural decisions? [Consistency, Plan §Technical Context, §Server-rendered showcase, Research §Keep the feature Server Component-first]
- [x] CHK055 Are static generation and image optimization requirements scoped to approved content, with absent media causing no unnecessary request or layout shift? [Completeness, Spec §FR-016, §FR-022, Plan §Route generation and §Responsive design]
- [x] CHK056 Are dependency and network-request constraints explicit and aligned with the constitution's simplicity/performance principles? [Consistency, Constitution Principles III–IV, Spec §FR-026, Plan §Technical Context]
- [x] CHK057 Are all four Lighthouse thresholds (>=90), LCP, CLS, and measurable field INP targets stated with no exception that counts a below-target score as passing? [Clarity, Constitution Principle III, Spec §FR-025, §SC-009]
- [x] CHK058 Is the existing desktop Performance score of 89 documented as an unresolved baseline issue, without lowering the target or treating it as a Feature 003 result? [Consistency, Plan §Technical Context, Spec §FR-025, Quickstart §Lighthouse and performance]
- [x] CHK059 Are mobile/desktop profiles, representative routes, tool/date, category scores, lab LCP/CLS, and field-INP availability required in reproducible performance reporting? [Measurability, Spec §FR-025, §SC-009, Plan §Test strategy, Quickstart §Lighthouse and performance]
- [x] CHK060 Are unique titles/descriptions, Open Graph data, and conditional canonical metadata defined for public routes using only approved content? [Completeness, Spec §FR-023, §SC-007]
- [x] CHK061 Is indexing behavior for unpublished/unknown pages normatively specified in the authoritative spec, not only in the plan/UI contract? [Gap, Spec §FR-011, §FR-024, Plan §Route generation, UI Contract §Publication and Metadata]
- [x] CHK062 Are detail-route metadata and Open Graph fallback rules explicit when approved project descriptions or images are absent? [Edge Case, Spec §FR-007, §FR-023, UI Contract §Publication and Metadata]

## Notes

- Constitutional numeric targets and the historical 89 desktop result are stated. Unknown and unpublished routes are explicitly noindex in the specification and acceptance criteria.
- Checked items record requirements-quality completion only; implementation and manual results remain pending until actually verified.
