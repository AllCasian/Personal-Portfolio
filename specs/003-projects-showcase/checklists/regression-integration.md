# Regression & Integration Requirements Checklist: Projects Showcase & Project Details

**Purpose**: Review how the written design preserves Features 001–002 and their shared shell contracts.  
**Created**: 2026-11-02  
**Feature**: [Specification](../spec.md) · [Plan](../plan.md) · [Feature 001 navigation](../../001-portfolio-foundation/contracts/ui-navigation.md) · [Feature 002 UI](../../002-hero-about/contracts/hero-about.md)

**Note**: Reviewer-owned checklist for requirements quality, not implementation verification.
**Review Ownership**: A reviewer marks an item complete only when the written requirement is clear and sufficient.
**Marker Semantics**: `[x]` means requirements-quality review passed; it does not mean the application is implemented.

## Cross-Feature Consistency

- [x] CHK063 Does the spec preserve the Feature 001 `#portfolio` destination while replacing only its placeholder content? [Consistency, Spec §FR-001, §FR-018, Feature 001 Navigation Contract §Navigation Landmarks]
- [x] CHK064 Are homepage section fragments unchanged while detail-route section links target the actual homepage anchors? [Completeness, Spec §US4/AC2, §FR-018, Plan §Navigation integration]
- [x] CHK065 Are hash/history synchronization and `aria-current="location"` ownership explicitly preserved without introducing competing active-state logic? [Consistency, Spec §FR-018, Feature 001 Navigation Contract §Navigation Landmarks, Feature 002 UI Contract §Accessibility]
- [x] CHK066 Is the current-location meaning on a project detail URL consistent with the existing no-hash Home default and accurately specified for assistive technology? [Ambiguity, Feature 001 Navigation Contract §Navigation Landmarks, Spec §FR-018, UI Contract §Shared Navigation]
- [x] CHK067 Are Feature 001 mobile-menu breakpoint, open/close, focus, Escape, and no-JavaScript contracts retained for links originating on detail pages? [Coverage, Feature 001 Navigation Contract §Mobile Full-Screen Panel and §Progressive Enhancement, UI Contract §Shared Navigation]
- [x] CHK068 Do project pages leave Feature 002 Home and About content, order, IDs, CTAs, and visual treatment unchanged? [Regression, Spec §FR-019, Plan §Project Structure, Quickstart §Local review]
- [x] CHK069 Are existing design tokens, focus/hover/active states, and reduced-motion behavior reused rather than redefined by project-specific UI? [Consistency, Constitution Principle II, Spec §FR-019, Plan §Visual direction]
- [x] CHK070 Are server-rendered/no-JavaScript content and hydration stability requirements explicit for both homepage integration and direct detail routes? [Coverage, Spec §FR-022, §SC-008, Plan §Test strategy]

## Notes

- Detail-route Portfolio current state, one-current-item rule, homepage return behavior, and the existing single state owner are specified.
- Checked items record requirements-quality completion only; implementation and manual results remain pending until actually verified.
