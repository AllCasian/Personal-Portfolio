# UI Contract: Experience, Education & Skills

- **Feature**: [Experience, Education & Skills](../spec.md)
- **Navigation contract**: [Feature 001 UI Navigation](../../001-portfolio-foundation/contracts/ui-navigation.md)
- **Projects contract**: [Feature 003 Projects UI](../../003-projects-showcase/contracts/ui-projects.md)
This contract adds three sections to the homepage and extends existing navigation. It preserves the site shell, Home, About, Portfolio, Contact, project routes, and the existing post-hydration navigation owner.

## Homepage Section Order and Structure

After the existing Hero, About, and Portfolio content, render:

1. Professional Experience — `#experience`
2. Education — `#education`
3. Technical Skills — `#skills`
4. Existing Contact placeholder — `#contact`

Each destination is unique and has a visible, programmatically associated heading. Use semantic section/landmark structure and a logical heading hierarchy. Existing section IDs and existing content remain intact except the explicitly approved About copy correction described below.

### Experience

- Show Endava first, followed by Core Elevating Media.
- Endava is “Junior Data Engineer” in the “Dava.X Trainee Program”, June–October 2026, Cluj-Napoca, Romania, and labeled former.
- The entire Endava period is training-program work. Do not imply commercial client delivery, production ownership, or a separate professional project outside Dava.X.
- Core Elevating Media is “Software Engineer Intern”, July–August 2024, Remote.
- Present only the verified contributions in short bullets or concise grouped statements. Avoid invented results and metrics.
- Use a restrained timeline or structured cards. Reading order follows the dates/content order and remains clear without decorative lines or motion.
- The three Dava.X case studies remain in Feature 003. Feature 004's initial public copy omits individual project names because Feature 003 and the latest clarification currently differ on two project titles. Do not duplicate case studies.

### Education and Certifications

- Show Technical University of Cluj-Napoca before Liceul Teoretic “Ioan Buteanu”.
- Show the completed Bachelor of Engineering in Computer Engineering, October 2021–July 2025, Cluj-Napoca, Romania.
- Show Mathematics and Computer Science, graduated, Somcuta Mare, Romania for high school; omit its unknown dates.
- Include a Certifications subsection under Education with the three CV-listed names. Show O'Reilly for the first two only. Omit dates, links, credential numbers, and unknown issuers.

### Skills

- Show the six fixed categories and all 33 items in the specification's exact order.
- Use text lists or restrained text chips. Do not use proficiency bars, ratings, unsupported levels, excessive logos, or category filtering.
- If a skill/category record is draft or any required field is unapproved/unverified, omit the ineligible entry and avoid an empty control or fabricated replacement.

## About Content Correction

The current About experience sentence says the developer currently works at Endava. Change only that sentence to state that the Junior Data Engineer role at Endava was within the Dava.X Trainee Program and ended in October 2026. Keep the About section's markup structure, layout, behavior, and all other approved copy unchanged. This correction is authorized by the Feature 004 clarification and is required to avoid a stale employment claim.

## Navigation and Active State

Primary navigation order is Home, About, Portfolio, Experience, Education, Skills, Contact. All existing labels and destinations remain unchanged; the three new entries target their matching fragments.

- The existing `src/lib/navigation-enhancement.ts` remains the sole post-hydration active-state owner.
- On `/` with no hash, Home is current. With a recognized hash, its matching destination is current. Exactly one primary link exposes `aria-current="location"`.
- Hash change and browser back/forward update current state. Passive scrolling does not change it.
- On `/projects/[slug]`, Portfolio remains the sole current destination. Shared links to new sections use root-prefixed homepage hashes.
- Navigation is fully server-rendered as ordinary links. With JavaScript unavailable, all destinations remain valid and usable.
- At 320–1023px, the existing full-screen menu provides all seven destinations, retains its keyboard/focus behavior, and scrolls vertically if the links exceed viewport height. At 1024px and above, desktop links remain unwrapped and uncompressed.

## Responsive and Accessibility Requirements

- Reuse established colors, typography, spacing, card surfaces, focus styles, and section heading patterns. Do not invent screenshot details; the approved design system is the source of truth.
- At 320, 375, 768, 1024, 1440, and 1920 CSS pixels, content wraps naturally with no horizontal overflow, clipping, overlap, or unreachable controls.
- At 200% browser zoom, preserve information, readable entries, reachable links, and visible focus without unintended horizontal scrolling.
- Keep logical DOM reading order, semantic headings/lists, meaningful names, visible focus, and applicable WCAG 2.2 AA contrast. Aim for 44×44 CSS-pixel targets where practical.
- Respect reduced motion; no motion is required to reveal or understand the content.
- Automated Axe checks and browser keyboard assertions are separate from manual keyboard, screen-reader, focus, contrast, zoom, and reduced-motion reviews. Manual results require actual date/environment/evidence and remain open until performed.

## Publication Boundary

An entry/category record must be approved, and each field must be independently verified with an allowed source and separately approved. The public projection strips approval and verification metadata and excludes all draft or ineligible values before HTML rendering. Raw records must not be imported into client components, page metadata, navigation data, or serialized props. Unknown facts are omitted without public TODOs/placeholders.
