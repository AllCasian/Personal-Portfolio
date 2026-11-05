# Implementation Plan: Motion, Microinteractions & Visual Polish

**Branch**: `feature/006-motion-visual-polish` | **Date**: 2026-11-05 | **Spec**: [spec.md](spec.md)

**Input**: Approved Feature 006 specification and clarification decisions.

## Summary

Enhance the existing portfolio with a small CSS-first motion vocabulary and one fail-open scroll reveal enhancement. Keep content, routes, navigation state ownership, and publication projections unchanged. Existing pages and content remain Server Components. A small Client Component initializes a shared IntersectionObserver-based DOM enhancement after hydration; CSS transitions handle hover, focus, card feedback, and the Hero entrance. No animation dependency or new data model is required.

The Hero uses a static gradient accent by default; a moving shimmer is not justified by the current visual hierarchy and is not planned. Existing Feature 005 performance results establish context, while comparable production runs captured before implementation establish the baseline for all route/profile pairs.

## Technical Context

**Language/Version**: TypeScript 5.9.3, React 19.3.1, Next.js 16.4.2, Node/npm versions supplied by the repository environment and lockfile.

**Primary Dependencies**: Existing Next.js App Router, React, Tailwind CSS 4 imported from `src/app/globals.css`; no new runtime dependencies.

**Storage**: None. Feature 006 introduces no persistent domain data.

**Testing**: Vitest 5 with jsdom and React Testing Library; Playwright 1.64.1; existing Axe Playwright integration; Prettier, ESLint, TypeScript, production build, Lighthouse 13.5.

**Target Platform**: Next.js App Router production deployment on Vercel; current browser support follows the existing portfolio and progressive-enhancement contract.

**Project Type**: Single Next.js App Router web application.

**Performance Goals**: Preserve constitutional Lighthouse scores >=90 in Performance, Accessibility, Best Practices, and SEO. Do not worsen the Feature 005 baseline by more than 2 median Performance points, 200 ms median LCP, or 0.02 CLS. Keep content visible by default, avoid new dependencies/network requests, use one shared reveal observer, and target no more than 2 KiB gzip of incremental application-owned motion JavaScript.

**Constraints**: Server-first rendering; no hidden-by-default content; no hydration-dependent content visibility; no second navigation-state owner; honor `prefers-reduced-motion`; preserve keyboard focus, touch usability, responsive behavior, existing content and publication boundaries. Verify actual 200% browser zoom separately from viewport resizing.

**Scale/Scope**: One homepage with seven sections, six approved project detail routes, six project cards, and a small set of explicitly marked top-level content groups.

## Constitution Check

| Principle | Plan assessment |
|---|---|
| Truthful, useful professional story | Pass. No profile, project, contact, or publication data changes; visual effects cannot reveal filtered content. |
| Accessible, responsive experience | Pass with release evidence required. Reduced motion, visible focus, touch parity, contrast, WCAG 2.2 AA, six widths, and actual 200% zoom are explicit. Manual visual/accessibility evidence remains distinct from automated checks. |
| Fast, robust, production-ready delivery | Conditional until measured. No dependency or request is added; performance uses repeated comparable production Lighthouse runs. Existing sub-90 desktop scores remain open. |
| Maintainable, secure engineering | Pass. Existing Server Components stay server-rendered; one narrowly scoped Client Component initializes browser observation; no private data or client state is added. |
| Verifiable changes and clear acceptance | Pass. Unit/component/E2E, accessibility, visual, performance, and build evidence are specified in the verification guide. |

**Gate**: No constitutional deviation is proposed. Production release cannot be declared compliant unless current Lighthouse thresholds and all required manual checks pass.

## Repository Inspection and Integration Points

Inspected the installed Next.js 16.4.2 App Router documentation for Server/Client boundaries and CSS, the actual source components, styles, test setup, package scripts, and Feature 005 Lighthouse guide/reports.

- `src/app/layout.tsx` is the shared root layout and imports `src/app/globals.css`; it currently mounts the existing `NavigationEnhancement` client bootstrap.
- `src/app/page.tsx` composes the Hero, About, Projects, Experience, Education, Skills, Contact, and Footer using Server Components and public projections.
- `src/app/projects/[slug]/page.tsx` renders the six approved detail routes with the shared header/footer and server-side project projection; the project pages currently use ordinary anchors.
- `src/components/sections/hero-section.tsx`, `about-section.tsx`, `projects-section.tsx`, `experience-section.tsx`, `education-section.tsx`, `skills-section.tsx`, and `contact-section.tsx` contain the corresponding server-rendered areas.
- `src/components/projects/project-card.tsx`, `project-category-group.tsx`, `project-detail-layout.tsx`, and `case-study-section.tsx` are the card/detail integration points.
- `src/components/experience/experience-entry.tsx`, `src/components/education/education-entry.tsx`, and `src/components/skills/skill-category.tsx` are the repeated group integration points.
- `src/components/layout/site-footer.tsx`, `site-header.tsx`, and `primary-links.tsx` provide Footer and navigation links. `src/lib/navigation-enhancement.ts` remains the sole owner of post-hydration navigation active state; do not place reveal or animation state there.
- `src/app/globals.css` contains the current palette/layout variables, link/button transitions, card styles, responsive rules, `has-js` progressive enhancement rules, and global reduced-motion override. New motion tokens and CSS states belong here, reusing current color, line, radius, and focus tokens.
- Vitest uses `tests/**/*.test.{ts,tsx}` with jsdom and React Testing Library; Playwright uses `tests/e2e/` and an isolated production server through `npm.cmd run test:e2e`.
- No reference image files were found under the repository's `specs/` tree. Review against the implemented design tokens and existing visual identity; do not invent screenshot details.

## Architecture Decisions

### CSS-first visual feedback

Use `src/app/globals.css` for a small set of motion custom properties and class/state rules. Define named duration, easing, translation, stagger, and accent values once. Keep related transitions limited to transform, opacity, border/color, and background properties; avoid layout properties and avoid large persistent shadows/blur. Restrict pointer-hover-only effects to fine-pointer/hover-capable environments. Preserve the existing focus outline and add equivalent card focus feedback without suppressing it.

### Scroll reveal enhancement

Use a small `src/components/motion/motion-reveal-enhancement.tsx` Client Component in the root layout and a browser-only initializer in `src/lib/motion-reveal.ts`. It returns no rendered markup and owns no React state. Server Components opt in by adding a stable `data-motion-reveal` marker only to approved section headings/top-level groups. Optional sibling groups use a group marker and bounded stagger metadata/class convention.

The initializer MUST fail open:

1. If JavaScript is disabled, hydration has not run, reduced motion is requested, or IntersectionObserver is missing, no pending/hidden attribute is applied; all server-rendered content remains visible.
2. After initialization, consider only marked targets whose top edge is below the current viewport. Do not mark anything already visible, above the viewport, or at a direct hash target as pending.
3. Apply a pending state only to a below-fold target after the observer is available. Use one shared observer; on intersection, remove pending state, record the revealed state, and unobserve that target. A revealed target is never hidden or observed again during that document visit.
4. On focus within a pending group, immediately expose it. On observer construction/observe failure, viewport/zoom change edge cases, or reduced-motion preference becoming active, clear pending states and disconnect as needed.
5. Cleanup disconnects the observer and removes enhancement-only pending state. Never use a global class or the existing `has-js` marker as proof that a specific reveal is ready.

The only visibility styling is attached to the enhancement-only pending state; it is never present in server-rendered markup. Initial viewport items, deep-linked targets, unsupported browsers, and no-JavaScript users therefore remain visible. Fast scrolling is handled by normal observer entry; if the observer misses/fails, content remains or returns visible. Use CSS transitions for final state and no scroll-event listener or polling loop.

### Hero and heading treatment

Keep Hero sequence in CSS on existing markup: headline, introduction, then actions receive small, bounded transform/opacity transitions with no layout participation; content remains rendered and readable at all times. Finish the sequence within 700 ms and do not animate the full Hero continuously. Use a static gradient/highlight on the Hero headline as the default futuristic accent, with an optional restrained static Projects heading accent. Do not implement moving shimmer in the initial plan because the static treatment meets the hierarchy goal with lower motion and contrast risk.

### Server/client boundaries

All page, section, card, detail, contact, Footer, and navigation components remain Server Components. Only `MotionRevealEnhancement` is a new Client Component, imported by `src/app/layout.tsx`, and its browser-only work is an effect that calls the standalone initializer. The existing `NavigationEnhancement` remains separate and remains the only navigation-state owner. No route-state, active-link, publication, or clipboard logic changes are planned.

## Proposed File Responsibilities

### Project Structure

```text
src/
├── app/
│   ├── layout.tsx                         # Mount the isolated reveal enhancer
│   └── globals.css                        # Shared motion tokens and visual states
├── components/
│   ├── motion/
│   │   └── motion-reveal-enhancement.tsx  # Client-only effect bootstrap; no rendered UI
│   ├── sections/                          # Existing server-rendered section components,
│   │                                       # with opt-in reveal hooks where selected
│   ├── projects/                          # Existing server-rendered cards and case studies
│   ├── experience/                        # Existing entry components
│   ├── education/                         # Existing entry components
│   ├── skills/                             # Existing category component
│   └── layout/                             # Existing Footer and navigation, CSS polish only
└── lib/
    └── motion-reveal.ts                   # Shared observer initializer and cleanup

tests/
├── lib/motion-reveal.test.ts
├── components/motion-reveal-enhancement.test.tsx
└── e2e/motion-visual-polish.spec.ts

specs/006-motion-visual-polish/
├── plan.md
├── research.md
├── quickstart.md
└── contracts/ui-motion.md
```

No Feature 006 data model is planned because there are no new domain records, persisted preferences, or content fields. Existing server component trees and test directories are extended in place; no section or project-specific implementation is introduced.

### Existing files to update during implementation

| File | Planned responsibility |
|---|---|
| `src/app/layout.tsx` | Mount the isolated reveal enhancer beside the existing navigation enhancer; preserve server-rendered document markup. |
| `src/app/globals.css` | Add named motion tokens, Hero sequence/accent, reveal pending/final styles, card and link transitions, hover capability guards, and reduced-motion overrides. |
| `src/components/sections/hero-section.tsx` | Add only semantic-safe styling hooks for the Hero sequence/accent; no content or semantics change. |
| `src/components/sections/about-section.tsx` | Mark the selected top-level About content group for optional reveal. |
| `src/components/sections/projects-section.tsx` and `src/components/projects/project-category-group.tsx` | Mark selected headings/groups; define bounded sibling group hooks for cards. |
| `src/components/projects/project-card.tsx` | Add reveal hook if approved by the visual pass; retain links, content and semantics. |
| `src/components/projects/project-detail-layout.tsx` and `src/components/projects/case-study-section.tsx` | Mark only selected top-level header/case-study blocks, avoiding nested repeated reveal. |
| `src/components/sections/experience-section.tsx`, `src/components/experience/experience-entry.tsx` | Mark section/group or entry reveal targets without changing content order. |
| `src/components/sections/education-section.tsx`, `src/components/education/education-entry.tsx` | Mark section/group or entry reveal targets; include certifications only as a top-level group. |
| `src/components/skills/skill-category.tsx` | Add a reveal hook to the category group; badges remain noninteractive. |
| `src/components/sections/contact-section.tsx` | Add an optional section-content reveal hook; preserve the public profile props and clipboard boundary. |
| `src/components/layout/site-footer.tsx`, `src/components/layout/primary-links.tsx` | CSS-only hover/focus polish; no reveal hook in Footer/navigation and no active-state changes. |
| `src/lib/motion-reveal.ts` *(new)* | Initialize and clean up one fail-open observer; no React state or navigation ownership. |
| `src/components/motion/motion-reveal-enhancement.tsx` *(new)* | Minimal Client Component that initializes the browser enhancement after hydration. |

### Test files to add/update

| File | Planned coverage |
|---|---|
| `tests/lib/motion-reveal.test.ts` *(new)* | Mocked observer and media preference; pending selection, reveal-once, fail-open, cleanup, preference change, and no-JS/no-observer behavior. |
| `tests/components/motion-reveal-enhancement.test.tsx` *(new)* | Component remains markup-free and does not render motion content/state on the server or in initial render. |
| `tests/components/project-card.test.tsx` *(existing)* | Preserve card identity/actions and add semantic/hook regression checks only if the reveal marker changes rendered structure. |
| `tests/e2e/motion-visual-polish.spec.ts` *(new)* | Scroll/reveal once, rapid scroll, direct hash, delayed scripts, no-JS, unsupported observer, reduced motion, card hover/focus, all six details routes, and navigation/contact regressions. |
| `tests/e2e/accessibility.spec.ts`, `tests/e2e/responsive.spec.ts` *(existing)* | Retain current scans and assert motion states do not introduce violations or overflow. |

No `data-model.md` is needed: this feature adds no domain entities or persistent user data. The test fixture details remain test-only and do not add a public route.

## Data Flow and Behavior Contract

1. Existing Server Components render all existing content, actions, routes, publication-filtered values, and stable semantic structure.
2. Server markup includes only opt-in `data-motion-reveal` hooks; it contains no hidden state, private data, or client-derived styling state.
3. After hydration, the small enhancer calls the initializer. It checks reduced-motion preference and observer availability before adding pending state to eligible below-fold nodes.
4. Intersection reveals clear the pending state once. CSS supplies the final visual transition. Other effects use CSS pseudo-classes and existing active/focus semantics only.
5. On all failure/no-JavaScript paths, markup remains fully visible and all original navigation/contact actions work normally.

## Performance Budget and Measurement

- Add no runtime dependency and no external font/image/network request.
- Keep motion-specific client JavaScript to one shared enhancer/initializer, targeting <=2 KiB gzip incremental application-owned code; document measured emitted-chunk delta from production build. If the target is exceeded, simplify or justify before accepting the increase.
- Create one observer per document visit, observe only opted-in elements, unobserve after first reveal, and do not add scroll listeners, polling, per-frame React updates, or animation state managers.
- Limit continuous work: no infinite shimmer, large persistent blur, or repeating card animation. Prefer transform/opacity for movement and avoid layout-triggering properties.
- Capture a pre-change production baseline before implementation for `/` and `/projects/drivewise` on mobile and desktop using the Feature 005 quickstart profile (Lighthouse 13.5, Chrome 156; mobile 412x823 CSS px/DPR 1.75, desktop 1440x900/DPR 1, documented throttling and CPU settings). Feature 005 has two mobile samples per route and three desktop samples; capture a third comparable mobile sample before code changes so each profile has at least three.
- After implementation, run at least three audits per route/profile against the same built output/server lifecycle/browser/settings. Record all four Lighthouse categories, LCP, CLS, TBT, run variance, and LCP element/subparts where available. Compare medians against the newly completed pre-change series. Investigate a median loss >2 Performance points, >200 ms LCP, or >0.02 CLS. A score below 90 remains a constitutional release issue even if there is no feature regression. The previous Drivewise 81 run is an outlier; retain it as variance context, not as sole baseline.
- Lab Lighthouse does not establish field INP. Do not claim INP or production readiness without field data and all release evidence.

## Test and Visual Verification Strategy

**Automated**:

- Unit-test the initializer with deterministic mocked IntersectionObserver and `matchMedia` behavior.
- Component-test that markup is initially visible and enhancement does not add content or semantics.
- Playwright-test user-observable reveal completion and once-only behavior using DOM/state readiness rather than fixed sleeps; test rapid scroll, anchor jumps, all six direct detail routes, navigation active state, contact projection/clipboard readiness, and reduced motion.
- Run no-JavaScript contexts and delay/block application scripts to prove content and actions remain available before hydration. Initialize a browser with IntersectionObserver unavailable to prove fail-open behavior.
- Test pointer hover only where hover/fine pointer is available; test equivalent keyboard focus and touch-sized viewports without requiring hover.
- Run existing Axe coverage on homepage, project detail, and open mobile navigation; keep manual reviews separate.
- Run `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd test`, `npm.cmd run test:e2e`, and `npm.cmd run build`.

**Manual visual/accessibility review**:

- Capture before/after at 375x812 and 1440x900 for Hero, all homepage sections, Footer, and one detail route. Review motion hierarchy, content timing, text/contrast, focus visibility, hover/focus parity, touch behavior, and clipping. Repository reference screenshots are unavailable; compare to Feature 001–005 design tokens and existing page composition, and record that limitation.
- Verify actual Chrome browser zoom at 200%, not DPR or viewport simulation, at narrow and desktop window widths. Check visible content, focus, overflow, clipping, and reachable links.
- Test `prefers-reduced-motion` in browser settings and verify static accent/focus treatments. Record browser, date, steps, results, and issues in this feature's quickstart.
- Do not mark Feature 004/005 manual tasks complete based on Feature 006 checks.

## Requirement Traceability

| Specification | Plan coverage |
|---|---|
| FR-001–FR-003 | Existing-scope boundary, CSS-first architecture, motion vocabulary and named tokens. |
| FR-004–FR-008 | Reveal eligibility/once-only/fail-open rules; bounded stagger; CSS Hero sequence; static typography accent. |
| FR-009–FR-012 | Card hover/focus/touch contract and restrained cross-section intensity hierarchy. |
| FR-013–FR-014, FR-020 | CSS-only navigation polish; existing enhancer remains sole state owner; links/history/routes unchanged. |
| FR-015–FR-019 | Visible-by-default progressive enhancement, reduced motion, focus/contrast, responsive/zoom checks. |
| FR-021–FR-022 | Contact/footer publication projection and Features 001–005 output remain unchanged. |
| FR-023–FR-024 | Existing tokens, noninteractive semantics, automated and manual visual/accessibility evidence. |
| FR-025–FR-027 | Lighthouse threshold, comparable regression protocol, and independent release-debt ownership. |
| SC-001–SC-003 | Reveal completion, order, once-only behavior and bounded stagger tests. |
| SC-004–SC-006 | Reduced motion, no-JS/delayed init, card focus/hover/touch tests. |
| SC-007–SC-009 | Axe/regression checks, responsive and zoom review, six project routes/navigation assertions. |
| SC-010 | Documented before/after manual visual review at 375px and 1440px. |
| SC-011–SC-012 | Repeated production Lighthouse runs, median comparison, and open target reporting. |

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| A post-hydration reveal state hides content unexpectedly | Add pending state only to currently below-viewport opt-in elements after observer support is confirmed; clear on focus, reduced motion, or failure. Keep SSR markup visible. |
| Anchor navigation or fast scrolling reaches pending content | Never pend visible/anchor-target nodes; observer reveals on entry; browser-level tests cover deep links and rapid movement. |
| Motion creates focus obscurity or touch-only information | Preserve outline; test focus parity; limit hover treatment to hover-capable input; keep actions visible without hover. |
| Extra client code harms low desktop score | One tiny enhancer, no dependencies/network request, record chunk delta, repeated Lighthouse baseline and post-change medians. |
| Visual effects increase contrast risk | Reuse current high-contrast tokens; test text and controls in default/hover/focus/reduced states; static accent is default. |
| Historical Lighthouse variance obscures regressions | Capture a third mobile pre-change sample, use three-run medians and same profile/server/browser, document outliers. |

## Constitution Re-check

The design preserves server-rendered truthful content and all publication gates. Motion is optional, the default server document is visible without JavaScript, and no navigation state is added. Accessibility and responsiveness are release requirements with automated and manual evidence. Performance remains conditional until comparable measurements are recorded; existing desktop scores below 90 remain open. No constitution change or waiver is proposed.

## Complexity Tracking

No constitutional violations or new dependencies are proposed. The isolated reveal initializer is the minimum browser-side mechanism needed for once-only viewport entry behavior; CSS-only interaction feedback is used everywhere else.
