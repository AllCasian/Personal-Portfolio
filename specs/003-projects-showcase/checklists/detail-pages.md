# Project Detail Requirements Checklist: Projects Showcase & Project Details

**Purpose**: Review route, publication eligibility, detail content, navigation, and metadata requirements.  
**Created**: 2026-11-02  
**Feature**: [Specification](../spec.md) · [Plan](../plan.md) · [UI contract](../contracts/ui-projects.md)

**Note**: Reviewer-owned checklist for requirements quality, not implementation verification.
**Review Ownership**: A reviewer marks an item complete only when the written requirement is clear and sufficient.
**Marker Semantics**: `[x]` means requirements-quality review passed; it does not mean the application is implemented.

## Route and Content Requirements

- [x] CHK028 Is the `/projects/{slug}` route pattern and exact stable slug for every initial project explicit? [Completeness, Spec §FR-008, Data Model §Initial IDs and slugs]
- [x] CHK029 Are static-generation eligibility rules limited to approved projects, with runtime slug resolution restricted to the public projection? [Clarity, Plan §Route generation, Data Model §Validation Rules]
- [x] CHK030 Do unknown, malformed, and unpublished slugs have consistent not-found/status, no-stale-content, and no-stale-metadata requirements? [Consistency, Spec §US2/AC5, §FR-011, §FR-024, UI Contract §Project Detail Destinations]
- [x] CHK031 Are each optional case-study section's omission rules and the sparse-page behavior explicit for projects lacking verified details? [Completeness, Spec §US2/AC1–AC3, §FR-009–FR-010]
- [x] CHK032 Is Back to Projects explicitly defined as `/#portfolio` on every detail page? [Clarity, Spec §US2/AC4, §FR-009]
- [x] CHK033 Are direct route loads, refreshes, and browser history behavior covered as requirements rather than only listed as test-plan activities? [Coverage, Spec Edge Cases, User Story 4, Plan §Test strategy]
- [x] CHK034 Are unique title/description, Open Graph, optional authentic image, and configured canonical URL requirements based only on approved project fields? [Completeness, Spec §US5, §FR-023, §FR-024]
- [x] CHK035 Is the requirement that unknown/unpublished pages are `noindex` present in the authoritative spec and acceptance criteria, not only in the plan and UI contract? [Gap, Spec §FR-011, §FR-024, Plan §Route generation, UI Contract §Publication and Metadata]
- [x] CHK036 Is the primary-navigation `aria-current` state on a project detail route defined, including whether Home, Portfolio context, or no destination is current? [Ambiguity, Spec §FR-018, Feature 001 Navigation Contract §Navigation Landmarks, UI Contract §Shared Navigation]

## Notes

- CHK035 is a spec-to-plan/contract traceability concern. CHK036 is a cross-route active-location ambiguity; the existing no-hash Home rule was written for section navigation and its detail-route application is not stated.
- Checked items record requirements-quality completion only; implementation and manual results remain pending until actually verified.
