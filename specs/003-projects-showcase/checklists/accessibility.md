# Accessibility Requirements Checklist: Projects Showcase & Project Details

**Purpose**: Review accessibility requirements and manual/automated acceptance coverage.  
**Created**: 2026-11-02  
**Feature**: [Specification](../spec.md) · [Plan](../plan.md) · [UI contract](../contracts/ui-projects.md) · [Quickstart](../quickstart.md)

**Note**: Reviewer-owned checklist for requirements quality, not implementation verification.
**Review Ownership**: A reviewer marks an item complete only when the written requirement is clear and sufficient.
**Marker Semantics**: `[x]` means requirements-quality review passed; it does not mean the application is implemented.

## Non-Functional Requirements and Scenario Coverage

- [x] CHK045 Are semantic landmarks, one page-level `h1`, nested category/card headings, and detail-section heading order explicitly specified? [Completeness, Spec §FR-021, Plan §Server-rendered showcase]
- [x] CHK046 Are repeated View Details links required to have project-distinguishing accessible names, and are optional external links required to identify their destination? [Clarity, Spec §FR-007, §FR-017, UI Contract §Portfolio Destination]
- [x] CHK047 Are keyboard order, activation, visible and unobscured focus, and navigation into/out of project details specified for pointer-free use? [Coverage, Spec User Story 4/AC3, §FR-021, UI Contract §Shared Navigation]
- [x] CHK048 Are contrast thresholds and the states/content to which they apply clear enough to assess WCAG 2.2 AA objectively? [Measurability, Spec §FR-021, Plan §Accessibility]
- [x] CHK049 Are informative/decorative alt rules, missing-image behavior, and failed-media accessibility defined consistently? [Edge Case, Spec §FR-016, Plan §Responsive design, UI Contract §Responsive, Visual, and Accessibility Behavior]
- [x] CHK050 Are reduced-motion and practical touch-target requirements explicit and aligned with the constitution? [Consistency, Constitution Principle II, Spec §FR-021, Plan §Responsive design]
- [x] CHK051 Is screen-reader navigation and interpretation of category groups, project links, detail sections, and media included in normative acceptance criteria? [Gap, Spec §US4/AC3, §FR-021, §SC-006, Quickstart §Manual accessibility review]
- [x] CHK052 Does the specification require manual keyboard, screen-reader, contrast, zoom, and reduced-motion review to be documented separately from Axe, without claiming success before execution? [Acceptance Criteria, Spec §SC-006, Plan §Test strategy, Quickstart §Manual accessibility review]
- [x] CHK053 Are automated Axe checks explicitly separate from manual accessibility review, with both scopes and outcomes distinguishable? [Consistency, Spec §SC-006, Plan §Test strategy, UI Contract §Validation Contract]

## Notes

- Manual screen-reader, keyboard, contrast, zoom, and focus checks are explicit acceptance gates, separate from Axe; results remain pending until performed.
- Checked items record requirements-quality completion only; implementation and manual results remain pending until actually verified.
