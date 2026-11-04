# Data Model: Projects Showcase & Project Details

**Feature**: [Projects Showcase & Project Details](./spec.md)

Six curated records live in typed local content, separate from presentation. Public renderers, route generation, and metadata consume only a server-created `PublishedProject` projection, never raw content records.

## Project Categories and Attribution

| Category key | Display group/category | Organization | Program | Projects |
|---|---|---|---|---|
| `dava-x` | Dava.X Trainee Program | Endava | Dava.X Trainee Program | Drivewise, Smart Librarian, ETL Pipeline |
| `academic` | Academic Projects | Technical University of Cluj-Napoca (UTCN) | — | Automatic Guitar Tuner, Energy Management System |
| `personal` | Personal Projects | — | — | AI Recipe |

Dava.X projects are hands-on software engineering projects developed during a professional training program at Endava. They must never be represented as commercial client engagements, production deployments, or independently delivered Endava products, regardless of later factual verification. Keep training experience distinct from commercial employment. UTCN attribution does not imply institutional endorsement.

## Typed Content Contracts

```ts
type VerificationStatus = "unverified" | "verified";
type VerificationSource = "owner-confirmed" | "approved-project-documentation";
type PublicationApprovalStatus = "unapproved" | "approved";
type RecordPublicationStatus = "draft" | "approved";

interface ProjectField<T> {
  value: T;
  verification: {
    status: VerificationStatus;
    source?: VerificationSource; // required when status is verified
  };
  publication: {
    status: PublicationApprovalStatus;
    reviewedOn?: string; // internal ISO date
  };
}
```

Factual verification and public-display approval are independent conditions. A field is eligible for public output only if `verification.status === "verified"`, a valid `verification.source` is present, and `publication.status === "approved"`. Record eligibility is separate: the record must have `publicationStatus: "approved"`. The conjunction is required; approval does not establish truth, and verification does not grant publication permission.

The same `ProjectField<T>` rule applies to summaries; each technology/concept; overview, motivation/problem, solution, features, architecture, challenges and contributions; screenshots/media and alt text; GitHub and Live Demo URLs and labels; and all project-specific SEO values including descriptions and Open Graph values. Required identity fields (title, category, slug and attribution where applicable) must also be verified and approved before public use. Any required identity lacking either condition makes the record ineligible for public generation and rendering.

### Required-identity placeholder boundary

FR-014 permits a neutral, explicitly identified placeholder only for a future required identity field when that future record must be represented. The current six project identities and categories are confirmed; no placeholders are allowed or needed for these records. This feature's `ProjectField<T>` represents factual values only and does not model or render placeholder text as project content. If a future project has an unavailable required identity, it is not eligible for public output under this six-record implementation. Supporting a future public placeholder requires a separate specification/model change and a distinct placeholder type/state; placeholder text must never be marked factually verified or rendered as a verified engineering claim.

### `ProjectRecord` — internal curated record

| Field | Type | Required | Rules |
|---|---|---:|---|
| `id` | stable project ID | Yes | Unique; stable when copy changes. |
| `slug` | stable slug | Yes | Unique and matches one of the six specified initial slugs. |
| `title` | `ProjectField<string>` | Yes | Confirmed identity; no inference from implementation details. |
| `category` | `ProjectField<ProjectCategory>` | Yes | One of the three fixed groups. |
| `attribution` | optional `ProjectField<Attribution>` | Conditional | Endava + Dava.X program, UTCN institution, or absent if unsupported. |
| `summary` | optional `ProjectField<string>` | No | Omit unless verified and approved. |
| `technologies` | optional `ProjectField<readonly Technology[]>` | No | Each term individually verified and approved; avoid implying architecture or use not established by evidence. |
| `caseStudy` | optional fields of `ProjectField<string or readonly string[]>` | No | Sections are independently optional and independently gated. |
| `media` | optional `ProjectField<readonly ProjectMedia[]>` | No | Authentic assets only; public-use approval, accurate alternative text and dimensions required. Never publish internal materials. |
| `links` | optional `ProjectField<readonly ProjectLink[]>` | No | Exact HTTPS destination, project correspondence and publication approval required. |
| `publicationStatus` | `RecordPublicationStatus` | Yes | A draft record is never listed, generated, resolved or indexed publicly. |

Initial IDs and slugs:

| ID | Slug | Title | Category |
|---|---|---|---|
| `drivewise` | `drivewise` | Drivewise | Dava.X Trainee Program |
| `smart-librarian` | `smart-librarian` | Smart Librarian | Dava.X Trainee Program |
| `etl-pipeline` | `etl-pipeline` | ETL Pipeline | Dava.X Trainee Program |
| `automatic-guitar-tuner` | `automatic-guitar-tuner` | Automatic Guitar Tuner | Academic Projects |
| `energy-management-system` | `energy-management-system` | Energy Management System | Academic Projects |
| `ai-recipe` | `ai-recipe` | AI Recipe | Personal Projects |

### `PublishedProject` — public presentation projection

This shape contains only identity and optional field values that passed both conditions. It excludes verification status/source, publication approval/status, review dates, notes, drafts, and raw values that failed eligibility. Projection occurs on the server before rendering, metadata generation, or serialization. `ProjectCard`, detail components, `generateStaticParams`, and `generateMetadata` accept only this public shape.

Unverified or unapproved fields must not enter rendered HTML, route params, page metadata, Open Graph tags, static output, or browser-visible serialized props. Do not put secrets, credentials, private information, teammate details, confidential material, or internal Endava documents in content files, including drafts.

## Validation and Publication Rules

- The initial public projection contains exactly six approved records once each, in specification category and within-category order.
- IDs and slugs are non-empty and unique; the six initial slugs are fixed.
- A record becomes public only when record status is approved and all required identity fields are verified and approved.
- Every optional field is omitted unless that field's value is verified from an allowed source and separately approved for publication. No placeholder is used for optional missing information.
- The initial AI Recipe record contains only its confirmed name and Personal Projects category. No provider/model, functionality, technology, deployment, summary or image is populated.
- Academic project facts and technologies appear only to the extent individually verified and approved. Category attribution does not imply endorsement.
- No Dava.X project may be described as commercial/client or production work, or an independently delivered Endava product, regardless of verification of technical details.
- A GitHub or Live Demo link is published only as the exact verified and approved URL for the project. Review redirects before publication and when a link changes or is reported. Omit destinations that are unavailable, unsafe, unexpectedly redirected, or no longer project-related. Never guess a substitute; no monitoring service is added.
- A media item requires authenticity, verification, public-use approval, local asset path, stable dimensions/frame and accurate informative/decorative alt handling. Missing media produces no request. If a present asset fails to load, suppress broken-image UI, retain the reserved frame without layout shift, and preserve readable project text and usable navigation; never substitute an invented screenshot.
- `generateStaticParams` includes approved records only. Unknown, malformed, or unpublished slugs return not-found, are non-indexable, and reveal no project-specific or draft metadata. No static route is emitted for an unpublished record.
- Canonical URLs require a configured site base. Never invent an origin. Unknown/unpublished metadata is generic and `noindex`.

## Data Flow

```text
Typed local ProjectRecord values
        |
        v
Server eligibility projection
  record approved AND field verified AND field approved
        +--> ordered public catalog --> #portfolio cards
        +--> approved slug lookup ----> /projects/[slug]
        +--> same lookup ------------> metadata / static params
        +--> absent/draft slug ------> not-found, generic noindex metadata
```

Adding verified and approved content for an existing project uses the same model and shared renderer without project-specific presentation changes.
