# Content & Data Model Requirements Checklist: Projects Showcase & Project Details

**Purpose**: Review the completeness, clarity, consistency, and testability of project identity, categorization, ordering, and content-model requirements.  
**Created**: 2026-11-02  
**Feature**: [Specification](../spec.md) · [Data model](../data-model.md) · [Plan](../plan.md)

**Note**: Reviewer-owned checklist for requirements quality, not implementation verification.
**Review Ownership**: A reviewer marks an item complete only when the written requirement is clear and sufficient.
**Marker Semantics**: `[x]` means requirements-quality review passed; it does not mean the application is implemented.

## Requirement Completeness and Clarity

- [x] CHK001 Does the specification constrain the initial public catalog to exactly the six named projects, each appearing once? [Completeness, Spec §FR-001, §SC-001]
- [x] CHK002 Are stable project IDs and unique, human-readable slugs defined for all six records, including their relationship to public URLs? [Clarity, Spec §FR-008, Data Model §Initial IDs and slugs]
- [x] CHK003 Are all category and organization/program assignments explicit, including Endava/Dava.X and UTCN attribution without implying endorsement? [Consistency, Spec §FR-003, §FR-027, Data Model §Project Categories and Attribution]
- [x] CHK004 Is the category order and within-category project order deterministic across the specification, plan, data model, and UI contract? [Consistency, Spec §FR-002, Plan §Server-rendered showcase, UI Contract §Portfolio Destination]
- [x] CHK005 Are project records explicitly typed, centralized, and separate from presentation, with a clear public projection? [Completeness, Spec §FR-012, Plan §Typed content and publication boundary, Data Model §Entities]
- [x] CHK006 Does the model define optional verified summaries, technology/concept terms, media, links, and reusable case-study sections without project-specific fields that force bespoke presentation? [Completeness, Spec §FR-007–FR-009, §FR-012, Data Model §ProjectRecord]
- [x] CHK007 Is the rule that approved content can be added to existing records without project-specific presentation changes stated consistently as a requirement and acceptance criterion? [Clarity, Spec §FR-028, §SC-011, Plan §Typed content and publication boundary]
- [x] CHK008 Are sparse and incomplete records, especially AI Recipe with only a confirmed title/category, specified without requiring fabricated summaries or empty optional UI? [Edge Case, Spec §FR-006–FR-010, UI Contract §Portfolio Destination]

## Notes

- All items remain unchecked because the checklist is reviewer-owned; the accompanying review report separately classifies adequate requirements and gaps.
- This checklist evaluates written requirements only, not record presence or application behavior.
