# Publication Safety Requirements Checklist: Projects Showcase & Project Details

**Purpose**: Review whether verification, approval, draft/public states, and sensitive-content protections are distinct and testable.  
**Created**: 2026-11-02  
**Feature**: [Specification](../spec.md) · [Plan](../plan.md) · [Data model](../data-model.md) · [UI contract](../contracts/ui-projects.md)

**Note**: Reviewer-owned checklist for requirements quality, not implementation verification.
**Review Ownership**: A reviewer marks an item complete only when the written requirement is clear and sufficient.
**Marker Semantics**: `[x]` means requirements-quality review passed; it does not mean the application is implemented.

## Requirement Completeness, Consistency, and Security

- [x] CHK009 Does the content model distinguish evidence-backed verification from editorial/publication approval, rather than treating an approved field as proof that its claim is true? [Gap, Data Model §PublicationApproval, Spec §FR-007, §FR-015]
- [x] CHK010 Are record-level draft/approved states and optional field-level approval states defined without ambiguity about which state controls public eligibility? [Clarity, Spec §FR-012–FR-015, Data Model §PublicationApproval]
- [x] CHK011 Is the publication invariant explicit that a field must be both verified and approved before it can appear publicly? [Completeness, Spec §FR-007, §FR-013, Data Model §Validation Rules]
- [x] CHK012 Are draft records and unapproved fields explicitly excluded from category lists, generated routes, page metadata, rendered HTML, and browser-visible data? [Coverage, Spec §FR-011, §FR-013, Plan §Route generation, UI Contract §Publication and Metadata]
- [x] CHK013 Are missing optional fields omitted, while any permitted neutral notice for a sparse detail page is clearly bounded and never presented as a factual project claim? [Clarity, Spec §FR-007, §FR-009–FR-010]
- [x] CHK014 Are unsupported descriptions, technologies, contributions, architecture, team sizes, outcomes, metrics, deployment claims, GitHub URLs, and demos all prohibited or approval-gated? [Coverage, Spec §FR-003–FR-007, §FR-015, §FR-017]
- [x] CHK015 Is the Dava.X rule consistent between the categorical user constraint and the exception in FR-003 that permits commercial or production claims if later verified? [Conflict, Spec §FR-003, User Story 3/AC1]
- [x] CHK016 Are internal Endava materials and other confidential/third-party information prohibited from public fields and drafts, with media-publication permission addressed? [Security, Spec §FR-013, §FR-016, Data Model §PublicationApproval]
- [x] CHK017 Are screenshot authenticity, public-use approval, alternative text, and handling of missing/failed media specified as publication requirements rather than visual implementation assumptions? [Completeness, Spec §FR-016, Data Model §Project media]
- [x] CHK018 Are external URL requirements clear for HTTPS, credentials, exact destination, unsafe redirects, and resources that become unavailable after publication? [Edge Case, Spec §FR-017, Spec Edge Cases, Data Model §Validation Rules]
- [x] CHK019 Does each publication-safety rule have an objectively assessable acceptance condition covering both content and metadata/serialization exposure? [Acceptance Criteria, Spec §US3/AC4, §FR-013, §SC-003–SC-004]

## Notes

- The verification/approval, Dava.X classification, and link redirect concerns are resolved in the current specification and data model.
- Each checked item records requirements-quality completion only; implementation and manual results remain pending until actually verified.
