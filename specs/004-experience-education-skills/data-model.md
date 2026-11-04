# Data Model: Experience, Education & Skills

**Feature**: [Experience, Education & Skills](./spec.md)

This is a static, owner-maintained content model. Raw source records stay server-side and separate from the public projection consumed by the section components.

## Shared Publication Contract

Feature 004 mirrors Feature 003's publication semantics without reusing its project-specific record types.

```ts
type VerificationStatus = 'unverified' | 'verified'
type VerificationSource = 'owner-confirmed' | 'supporting-documentation'
type PublicationApprovalStatus = 'unapproved' | 'approved'
type RecordPublicationStatus = 'draft' | 'approved'

interface ContentField<T> {
  value: T
  verification: { status: VerificationStatus; source?: VerificationSource }
  publication: { status: PublicationApprovalStatus }
}

interface ContentRecord<T> {
  id: string
  publicationStatus: RecordPublicationStatus
  fields: T
}
```

Verification source `owner-confirmed` is appropriate for the facts supplied by the portfolio owner. A supporting document may be used when one is provided. Verification and publication approval are independent. A record is eligible only when its record status is approved; each displayed field is eligible only when its own value is verified with a valid source and separately approved.

The server-side projection removes raw records, draft values, source/status/approval fields, TODOs, and review metadata. It returns only presentation fields that passed both gates. Required identity fields must all pass for the entry/category to appear. Ineligible optional fields are omitted individually. The projection must be completed before server rendering or any serialization. Raw content modules must not be imported into client components or client-side navigation code.

## Experience Entry

Each entry has an independently approved record and separately gated fields.

| Field | Shape | Required | Rules |
|---|---|---:|---|
| ID | Stable identifier | Yes | Unique within Experience. |
| Organization | `ContentField<string>` | Yes | Endava or Core Elevating Media. |
| Role | `ContentField<string>` | Yes | Exact owner-supplied role. |
| Program | Optional `ContentField<string>` | Conditional | Endava is Dava.X Trainee Program for the entire June–October 2026 period. |
| Start/end | `ContentField<{ month: number; year: number }>` | Yes | Both periods are known; order newest first. |
| Status | `ContentField<'former' \| 'internship'>` | Yes | Endava is former; internship remains identified as an internship. Never infer a current state. |
| Location/work arrangement | Optional `ContentField<string>` | No | Endava location is Cluj-Napoca, Romania; Core Elevating Media arrangement is Remote. |
| Contribution bullets | Ordered `ContentField<string>[]` | Yes | Each verified contribution is independently eligible and rendered as short scannable copy. No metrics or unsupported outcomes. |

Initial order and facts:

1. Endava — Junior Data Engineer — Dava.X Trainee Program — June 2026 to October 2026 — former — Cluj-Napoca, Romania.
2. Core Elevating Media — Software Engineer Intern — July 2024 to August 2024 — Remote.

Endava's entire employment period was within the training program. The record cannot encode a separate commercial client assignment, production responsibility, or independent professional project outside Dava.X. Full Dava.X case studies remain in Feature 003.

## Education Entry

| Field | Shape | Required | Rules |
|---|---|---:|---|
| ID | Stable identifier | Yes | Unique within Education. |
| Institution | `ContentField<string>` | Yes | Exact supplied institution name. |
| Qualification/field | `ContentField<string>` | Yes | UTCN: Bachelor of Engineering, Computer Engineering. High school: Mathematics and Computer Science. |
| Period | Optional `ContentField<{ start?: MonthYear; end?: MonthYear }>` | No | UTCN October 2021 to July 2025; no high-school period is supplied, so omit it. |
| Location | Optional `ContentField<string>` | No | UTCN: Cluj-Napoca, Romania; high school: Somcuta Mare, Romania. |
| Completion status | `ContentField<'graduated'>` | Yes | Both entries are completed. Do not add grades or awards. |
| Certifications | Ordered `CertificationRecord[]` | No | Optional subsection within Education; only the three supplied names and known O'Reilly issuer values. |

Education display order follows the specification: Technical University of Cluj-Napoca first, then Liceul Teoretic “Ioan Buteanu”. The high-school period is absent, not rendered as a placeholder.

## Certification Record

Each certification has independent record-level publication approval and a separately verified/approved name. Issuer is an optional field.

| Credential | Issuer | Omitted details |
|---|---|---|
| LLM Performance Engineering | O'Reilly | Completion date, verification URL, credential number. |
| GenAI Essentials for Everyone | O'Reilly | Completion date, verification URL, credential number. |
| Social Enterprise Manager | Unknown; omit issuer. | Completion date, verification URL, credential number, issuer. |

Do not infer a date, issuer, credential number, external link, or validation status. A certification may appear only as the CV-listed credential supplied by the owner and approved for publication.

## Skill Category and Item

Skill categories and their order are fixed in Feature 004. Every item is an independently approved record with a separately eligible public label. Preserve the order within each category exactly as listed below; a skill appears once in the Skills inventory.

| Order | Category | Ordered items |
|---:|---|---|
| 1 | Programming Languages | Python; Java; JavaScript; TypeScript; C/C++; Kotlin; PL/SQL; VHDL; Assembly; HTML/CSS |
| 2 | Frontend & Mobile | React; Next.js; Angular; React Native; Expo; Tailwind CSS; NativeWind |
| 3 | Backend | Node.js; Express; Spring Boot; Flask |
| 4 | Databases | PostgreSQL; MySQL; MongoDB |
| 5 | DevOps & Infrastructure | Docker; Traefik; Nginx; Linux; RabbitMQ |
| 6 | Additional Technologies & Tools | Git; OpenGL; OpenCV; Arduino |

The total inventory is 33 items. The model does not include levels, ratings, percentages, years, endorsements, or certification claims.

## Public Projection

`PublishedProfessionalContent` contains only eligible experience entries, education entries/certifications, and skill categories/items. It excludes verification source, verification status, approval status, record status, private notes, and ineligible values. Server-rendered components accept this projection; none needs browser state. Public metadata remains the existing static site metadata and receives no raw profile records.

## Dava.X Project Reference Boundary

Feature 003 currently uses the canonical titles “Smart Librarian” and “ETL Pipeline”. The latest Feature 004 clarification references “AI Smart Librarian” and “Data Integration ETL Pipeline”. Feature 004 must not silently rename Feature 003 records or duplicate project descriptions. The initial public Experience entry omits optional individual project names. If a later approved copy references them, resolve the title mismatch and read the names from the canonical published-project projection.
