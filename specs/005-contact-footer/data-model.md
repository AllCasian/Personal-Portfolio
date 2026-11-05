# Data Model: Contact & Footer

**Feature**: [Contact & Footer](spec.md)

## Purpose and Boundary

Store the owner-confirmed contact source values separately from the server-rendered components. The source record includes publication-review state for eligibility decisions. Only a minimal public projection may reach UI rendering. Review states and provenance are never public fields.

## Types

Conceptual TypeScript contract (descriptive only; implementation belongs to the application task phase):

```ts
type Verification = {
  status: 'verified' | 'unverified'
  source: 'owner-confirmed' | 'unverified'
}

type Publication = 'approved' | 'unapproved'

type ContactField<T> = {
  value: T
  verification: Verification
  publication: Publication
}

type ContactSourceRecord = {
  id: 'portfolio-owner-contact'
  publication: Publication
  ownerName: ContactField<string>
  email: ContactField<string>
  githubUrl: ContactField<string>
  linkedinUrl: ContactField<string>
}

type PublicContactProfile = {
  ownerName?: string
  email?: string
  githubUrl?: string
  linkedinUrl?: string
}
```

The source type may reuse equivalent primitives already established in the repository if that avoids redundant declarations, while keeping the Contact domain and public DTO explicit. The implementation must not import a broader professional or project record merely to avoid this small model.

## Initial Record

The initial source record has record-level publication status `approved`. Each field below is independently marked factual verification `verified`, with source `owner-confirmed`, and publication `approved`:

| Field | Exact value |
|---|---|
| Owner name | `Casian Criste` |
| Email | `cristecasian@gmail.com` |
| GitHub URL | `https://github.com/AllCasian` |
| LinkedIn URL | `https://www.linkedin.com/in/casian-criste-b65582263/` |

No phone number, physical address, other social profile, or resume URL is represented in the initial record.

## Public Projection Rules

1. If the record is not publication-approved, return an empty public profile.
2. For each individual field, include its value only when factual verification is `verified` and field publication is `approved`.
3. Do not serialize the source record, verification source/status, publication status, reviewer notes, or sentinel values.
4. Validate the mail address and exact known profile destinations at the content boundary; do not normalize the approved external URLs to alternate destinations.
5. Components consume only `PublicContactProfile`. The copy action receives only the eligible email string, never the full profile or source record. `SiteFooter.ownerName` is supplied only from `PublicContactProfile.ownerName`; it must not hardcode the source value.
6. Omit absent/ineligible actions. When no eligible contact channel exists, render the neutral availability message specified by FR-007.

## Eligibility Matrix

| Record approved | Field verified | Field approved | Public field |
|---|---|---|---|
| No | Yes | Yes | Omitted |
| Yes | No | Yes | Omitted |
| Yes | Yes | No | Omitted |
| Yes | No | No | Omitted |
| Yes | Yes | Yes | Included |

Tests must cover the full matrix and prove ineligible sentinels, including owner-name values, are absent from server-rendered Contact/Footer output and generated public artifacts. A test-only Next fixture may be served only by an isolated test process; it must not create a production/public draft-preview route or enter the production build.

## Footer Owner and Copyright

- When `PublicContactProfile.ownerName` is present, render `© [year] Casian Criste. All rights reserved.`
- When `ownerName` is absent because its verification, field approval, or record approval gate failed, omit the owner attribution and render `© [year]. All rights reserved.`
- The Footer must never use a literal owner-name fallback. The initial approved owner name remains visible because it passes the projection.
- The current year is computed once in the server-rendered Footer and is independent of contact publication state.
- Automated Footer tests freeze the system clock and assert deterministic year output immediately before and after a calendar-year boundary.

## Derived Values and Non-Data

- `mailto:cristecasian@gmail.com` is derived from the eligible email field; it is not a separate unreviewed contact source.
- Footer year is generated once on the server from the current calendar year and is not stored in the contact record.
- Copy feedback (`Email copied` or a concise failure message) is transient interaction state local to the copy client leaf; it is not content or persisted data.
- Footer navigation derives from existing `navigationItems` rather than contact data.
