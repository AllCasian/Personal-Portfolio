# Research: Hero & About

**Date**: 2026-11-02  
**Feature**: [Hero & About](./spec.md)

## Decisions

### Existing App Router and server rendering

- **Decision**: Extend the existing statically rendered Home route. Keep the page shell, hero markup, HeroActions markup, About section, and normal links as Server Components. Keep the existing post-hydration navigation enhancer unchanged.
- **Rationale**: Hero and About content is static and needs no client state. Feature 001 already owns the header, footer, `#home`/`#about`/`#portfolio`/`#contact` targets, active navigation state, and progressive navigation behavior.
- **Alternatives considered**: Making the whole page or both sections Client Components would hydrate static content and increase browser JavaScript without adding visitor value; replacing navigation would duplicate an implemented and tested contract.
- **Sources**: [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components); local version guide `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`.

### Typed local content and placeholders

- **Decision**: Extend the current `ProfileContent` shape and add a nested `AboutSummary` with required editable fields for education, current experience, interests, general competencies, engineering approach, and professional direction. Represent resume, social destinations, and portrait as optional values. Keep required CTA labels and anchors in the UI contract rather than personal profile data.
- **Rationale**: The current typed local content file is the established source of truth and contains no verified identity or asset. Distinguishing required content from optional assets prevents empty controls and permits truthful placeholders without adding storage or runtime services.
- **Alternatives considered**: A CMS/database, generated biography, or separate content integration is unnecessary; storing the two stable section anchor links in a profile object would make navigation behavior editable as personal content.
- **Evidence**: `src/content/profile.ts`, `src/content/types.ts`, Feature 001 `data-model.md`, and the Feature 002 clarification decisions.

### Component boundaries and action hierarchy

- **Decision**: Extend `HeroSection`; add `HeroActions` to own View Projects, Contact Me, and conditional lower-emphasis resume/social links; add `AboutSection`; reuse existing `SectionHeading`, `ButtonLink`, content-width, tokens, and shared surface styles. Do not add a standalone `SocialLinks` component until there is a second real consumer.
- **Rationale**: The required and optional links share responsive placement and hierarchy, while the About section owns a different content structure. A combined action grouping avoids fragments without coupling personal data to presentation.
- **Alternatives considered**: One monolithic page component would mix all layout and content concerns; separate components for every link or About topic would add boundaries without reuse.
- **Evidence**: Existing component tree and clarified lower-emphasis rule.

### Optional portrait and failure behavior

- **Decision**: Preserve Feature 001's decorative no-photo placeholder whenever no verified portrait exists. For a verified local portrait, use `next/image` with intrinsic dimensions from a static import or explicit dimensions and a stable aspect-ratio frame. Give informative portraits meaningful text alternatives and decorative media an empty alternative. If the image fails, reveal the same fallback in the same frame.
- **Rationale**: Next.js image guidance states that intrinsic dimensions reserve the aspect ratio and prevent layout shift, and its image API documents that `onError` requires a Client Component. A tiny client leaf is justified only for the configured-image failure path; the current absent-photo path remains server-rendered.
- **Alternatives considered**: Remote images introduce an unnecessary image host and remote-pattern configuration. A broken image with a CSS background does not reliably replace the browser's failed-image display. A full client-side hero is unnecessary for one image event.
- **Sources**: [Next.js Image Optimization](https://nextjs.org/docs/app/getting-started/images), [Next.js Image Component `width`, `height`, and `onError`](https://nextjs.org/docs/app/api-reference/components/image); local guides `12-images.md` and `image.md` under `node_modules/next/dist/docs/01-app/`.

### Responsive composition and reference handling

- **Decision**: Reuse Feature 001's dark canvas, blue accents, Inter font, content width, shared action styles, and existing responsive CSS. Keep copy and required actions before portrait at 320–767 px. From 768 px, use side-by-side composition only when headline, copy, and CTAs remain readable; otherwise stack. Leave navigation's established 1024 px breakpoint unchanged.
- **Rationale**: The feature spec defines these constraints and preserves a fluid layout without locking it to a screenshot. Feature 001 has documented the visual identity, but the original screenshots are not available in the current workspace; no unseen design details are assumed.
- **Alternatives considered**: Copying fixed screenshot dimensions or changing the global navigation breakpoint would conflict with the approved responsive/navigation contracts.
- **Evidence**: Feature 001 `spec.md`, `contracts/ui-navigation.md`, `src/app/globals.css`, and Feature 002 `spec.md`.

### Motion and reduced motion

- **Decision**: Continue CSS for simple hover/focus feedback; add no motion dependency. Respect the existing reduced-motion CSS rule and keep all content visible and actions operable without animation.
- **Rationale**: These sections are primarily static, and the current design system already provides motion handling. Motion would add runtime weight without supporting an interaction that CSS cannot express.
- **Alternatives considered**: Motion for React or scroll-triggered reveals add JavaScript and could delay or hide essential content.
- **Evidence**: Feature 001 `research.md` and reduced-motion rules in `src/app/globals.css`.

### Verification and performance

- **Decision**: Add focused component tests and Playwright coverage for hero/about content, both CTA anchors, optional data, responsive widths, portrait failure, keyboard/a11y, no-JavaScript behavior, and hydration diagnostics. Run the existing repository quality gates and compare Lighthouse using Feature 001's documented mobile and desktop profiles.
- **Rationale**: Unit tests cover content contracts quickly; browser tests are needed for actual anchor/history state, viewport reflow, media failure, focus, and hydration. The latest Feature 001 performance results are the comparison baseline; desktop Performance is 89, mobile is 98, and field INP is not yet measurable.
- **Alternatives considered**: E2E-only tests are slower for static content; unit-only tests cannot show layout shifts, focus behavior, or browser navigation. Changing Lighthouse profiles would make before/after comparison unreliable.
- **Evidence**: Feature 001 `quickstart.md`, current `package.json`, `playwright.config.ts`, and `vitest.config.ts`.

## Resolved Unknowns

- No new dependency or infrastructure is required.
- No biography, links, resume, or portrait is currently verified in the repository; use placeholders for required copy and omit optional external resources. Retain the existing decorative portrait fallback.
- The original visual-reference screenshots are not locally accessible; use only Feature 001's documented direction and tokens.
- Exact image asset and its alternative text remain content inputs, not blockers to design or implementation.
