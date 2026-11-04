# Showcase UX Requirements Checklist: Projects Showcase & Project Details

**Purpose**: Review whether project discovery, cards, category structure, optional content, and visual hierarchy are specified clearly for visitors.  
**Created**: 2026-11-02  
**Feature**: [Specification](../spec.md) · [Plan](../plan.md) · [UI contract](../contracts/ui-projects.md)

**Note**: Reviewer-owned checklist for requirements quality, not implementation verification.
**Review Ownership**: A reviewer marks an item complete only when the written requirement is clear and sufficient.
**Marker Semantics**: `[x]` means requirements-quality review passed; it does not mean the application is implemented.

## Requirement Completeness and Usability

- [x] CHK020 Is the showcase explicitly integrated at the existing `#portfolio` destination without changing the other homepage anchors? [Consistency, Spec §FR-001, §FR-018, UI Contract §Portfolio Destination]
- [x] CHK021 Are the three category labels and organization/program attribution visible and distinct enough to communicate training, academic, and personal context? [Clarity, Spec §FR-002–FR-005, §FR-027]
- [x] CHK022 Is the exact project ordering specified consistently, including ordering within each category? [Consistency, Spec §FR-002, Plan §Server-rendered showcase, UI Contract §Portfolio Destination]
- [x] CHK023 Are card essentials and optional fields distinguished clearly: title/category/details action required; verified summary, technologies, media, GitHub, and demo conditional? [Completeness, Spec §FR-007, UI Contract §Portfolio Destination]
- [x] CHK024 Are technology/concept labels required to communicate only verified information without implying unsupported implementation or expertise? [Clarity, Spec §FR-004–FR-007, §FR-015]
- [x] CHK025 Are sparse and partial content states specified so the AI Recipe card/detail page stays understandable without filler or empty optional controls? [Edge Case, Spec §FR-006–FR-010, UI Contract §Portfolio Destination]
- [x] CHK026 Is the initial no-filter decision explicit, justified by the six-item catalog, and consistent across spec, research, plan, and contract? [Consistency, Spec Assumptions, Research §Use the existing category groups without filters, UI Contract §Portfolio Destination]
- [x] CHK027 Are recruiter-facing hierarchy, readable summaries, CTA clarity, and consistency with the established design system described with enough reviewable criteria? [Measurability, Spec User Story 1, §FR-019, Plan §Visual direction]

## Notes

- The specification and plan clearly exclude filters and provide ordered groups. The degree of visual hierarchy beyond those structures remains partly qualitative.
- All items remain unchecked by checklist lifecycle policy; see the review report for requirements-quality findings.
