# Personal Portfolio

A responsive personal software engineering portfolio built with Next.js App Router, React Server Components, TypeScript, and Tailwind CSS v4. The current scope contains the global page shell, editable Home hero and About summary, four primary anchor destinations, and Portfolio and Contact placeholders.

## Requirements

- Node.js 22 LTS (Node 22.21.0 was used for implementation verification)
- npm 10 or a compatible npm release

## Run locally

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the local URL printed by Next.js. No environment variables are required.

If npm cannot read its user-level cache, keep `package-lock.json` unchanged and use a project-specific cache outside `node_modules`:

```powershell
$projectNpmCache = Join-Path $PWD '.npm-cache-recovery'
npm.cmd ci --cache $projectNpmCache
```

## Quality commands

```powershell
npm.cmd run lint
npm.cmd run format:check
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:e2e
npm.cmd run start
```

Playwright requires its Chromium browser. Install it once with `npm.cmd exec playwright -- install chromium` in PowerShell. Build before running E2E tests; `npm.cmd run test:e2e` starts the production server when port 3000 is free and stops only the server it started. It reuses an existing server only when the portfolio route is recognized; it does not stop an unrelated service using that port.

## Edit the visible content

- Update `src/content/profile.ts` with a verified full name, broad professional role, concise introduction, and the six About summary fields (education, current experience, interests, general competencies, engineering approach, and professional direction).
- Keep required values as neutral `Placeholder:` strings until the owner verifies them. Replace each marker only with verified authored information; do not use placeholders to imply facts.
- The View Projects (`#portfolio`) and Contact Me (`#contact`) actions are fixed UI behavior and are not profile fields.
- Update `src/content/navigation.ts` only when the approved primary section destinations change.
- Keep `src/content/sections.ts` aligned with the four supported anchors. Portfolio and Contact remain placeholders; About is rendered from the typed profile summary.
- Add the optional portrait, resume, GitHub, or LinkedIn entry only after its exact content or destination is verified. Use a local portrait and appropriate alternative text; if absent or if the image fails, the decorative fallback remains. Unavailable optional links are omitted.

Do not publish unverified personal claims, contact details, social profiles, project descriptions, or resume links. There are no secrets or private configuration values in the site.

## Architecture

`src/app` owns the document shell, route, and design tokens. `src/components/layout` contains the header, navigation enhancement, skip link, and footer. `src/components/sections` contains the hero and destination patterns. Public content is typed and kept in `src/content`; shared small utilities live in `src/lib`. Vitest/React Testing Library tests are under `tests/components`, and Playwright tests are under `tests/e2e`.

Server Components are used by default. Client-side code is limited to URL-aware navigation state and responsive menu behavior. The modal navigation and transition code is loaded only when a mobile visitor opens the menu.

## Deploy to Vercel

1. Import the repository in Vercel and keep the detected Next.js framework preset.
2. Use the repository root as the project root; no build environment variables are required.
3. Review the generated Preview deployment at the required viewport widths and with keyboard and reduced-motion settings.
4. Do not promote a production build until the manual accessibility review, Lighthouse target gaps, and final personal content are addressed or explicitly accepted.

The project is statically rendered where possible and uses no database, CMS, external API, or separate backend.
