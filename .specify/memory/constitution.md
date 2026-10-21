# Personal Software Engineering Portfolio Constitution

## Core Principles

### I. Truthful, Useful Professional Story
The portfolio MUST present the developer's identity, experience, technical skills, and selected projects clearly to recruiters and engineering teams. Professional experience, results, metrics, endorsements, project details, and links MUST be verifiable and MUST NOT be fabricated. Missing personal information MUST use clearly editable placeholders until confirmed. Content MUST be stored separately from presentation where practical so it can be reviewed and updated without changing component structure.

### II. Accessible, Responsive Experience
The site MUST use mobile-first responsive design and support viewport widths from 320 CSS pixels through ultrawide desktop without horizontal overflow. It MUST target WCAG 2.2 AA for applicable criteria, with semantic HTML, accessible names, keyboard-operable navigation and controls, visible focus indicators, and sufficient contrast. Interactive targets MUST be at least 44 by 44 CSS pixels where practical. The experience MUST respect `prefers-reduced-motion`; motion MUST serve usability or communication. Screenshots supplied as design references guide identity, atmosphere, color, typography, and recognizable concepts, but MUST NOT override sound hierarchy, spacing, contrast, alignment, navigation, content density, accessibility, or responsive behavior. If a reference is unavailable, its details MUST NOT be invented; document a provisional design or request the reference.

### III. Fast, Robust, Production-Ready Delivery
The site MUST prioritize fast loading, stable layout, and responsive interaction across representative devices. Targets are Lighthouse scores of at least 90 for Performance, Accessibility, Best Practices, and SEO, and Core Web Vitals of LCP at most 2.5 seconds, CLS at most 0.1, and INP at most 200 milliseconds at the 75th percentile where measurable. Images, fonts, and JavaScript bundles MUST be optimized. Features MUST account for loading, empty, success, and error states where applicable. The application MUST be suitable for production deployment on Vercel; requirements MUST not be claimed as met without verification.

### IV. Maintainable, Secure Engineering
TypeScript strict mode MUST be enabled, and `any` MUST be avoided. Components MUST be composable and responsibilities separated; content and presentation MUST remain distinct. Server Components MUST be the default where the framework supports them, and Client Components MUST be limited to interactions or browser capabilities that require them. Use semantic HTML and progressive enhancement. Dependencies and abstractions MUST be justified by a concrete need. Secrets, credentials, and private information MUST NOT be committed or exposed in client code. Prefer the simplest implementation that meets the requirements.

### V. Verifiable Changes and Clear Acceptance
Every feature MUST have explicit, reviewable acceptance criteria. Meaningful logic MUST have unit or component tests, and critical user journeys MUST have end-to-end coverage. ESLint, Prettier, type checking, and production builds MUST be enforced as project quality gates. Changes MUST be reviewed against their specification and acceptance criteria; tests, builds, accessibility, performance, and deployment claims MUST reflect observed results. Technical and design decisions with lasting impact MUST be documented.

## Product and Experience Standards

The portfolio MUST have a clear information hierarchy, readable typography, consistent spacing, and coherent design tokens for color, typography, spacing, shadows, and radii. Navigation MUST make the main content discoverable and usable by keyboard, touch, and pointer. Avoid visual clutter, intrusive popups, scroll hijacking, and animation without a user benefit. Quality targets are goals to validate on representative pages and devices; measured results and known gaps MUST be recorded instead of assumed.

## Engineering and Delivery Standards

The Spec Kit workflow MUST guide feature work through specification, planning, task generation, analysis, implementation, and convergence. Feature specifications MUST define behavior and acceptance criteria before implementation. Plans and task lists MUST identify relevant design and technical decisions. Implementation MUST follow the approved artifacts or document necessary deviations. Convergence MUST check the delivered code against the specification, plan, and tasks. Deployment configuration MUST support Vercel production requirements without adding infrastructure that the portfolio does not need.

## Governance

This constitution governs product, design, engineering, and delivery decisions for the portfolio. Feature specifications, plans, tasks, implementation, review, and convergence MUST check applicable principles. A deviation MUST be explicit in the relevant Spec Kit artifact, state its rationale and impact, and identify any compensating action; deviations do not silently waive accessibility, truthful content, or secret-handling rules.

Amendments MUST update this document and its version together. MAJOR increments indicate removal or incompatible redefinition of a principle; MINOR increments indicate a new principle or materially expanded governance; PATCH increments indicate clarifications and non-semantic refinements. Record the amendment date and summarize material changes. During review, verify that changed work follows the constitution, acceptance criteria are met, and validation claims have evidence. Resolve conflicts in favor of the more protective applicable requirement or amend the governing artifacts explicitly.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date is not recorded | **Last Amended**: 2026-10-14
