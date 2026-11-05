# Data Model: Feature 007

Feature 007 adds no persistent storage or backend model. It extends the existing owner contact content record and the public projection already used by Features 003–005. Presentation-only state (navbar visibility and responsive layout) is not part of contact data.

## Existing Contact Source Record

`src/content/contact-types.ts` defines `ContactField<T>` with independent factual verification and publication approval, plus `ContactSourceRecord.publicationStatus`. `src/content/contact.ts` holds owner-confirmed values. The server-only presentation boundary is `projectPublicContact` in `src/lib/contact-content.ts`.

| Source field | Meaning | Publication condition |
|---|---|---|
| `ownerName` | Portfolio owner attribution | Contact record approved; field verified and approved; nonempty text. |
| `email` | Email destination and visible action label | Record approved; field verified and approved; nonempty text. Render as `mailto:`. |
| `githubUrl` | GitHub profile destination | Record approved; field verified and approved; valid HTTPS URL. |
| `linkedinUrl` | LinkedIn profile destination | Record approved; field verified and approved; valid HTTPS URL. |
| `instagramUrl` (new) | Instagram profile destination | Record approved; field verified and approved; valid HTTPS URL. Approved value: `https://www.instagram.com/casiancriste`. |
| `cvUrl` (optional future field) | Public download URL for a real CV document | Omitted entirely until an actual document is present, checked for currency, and explicitly approved. When added, record and field must satisfy the same independent eligibility checks and URL validation. |

All currently approved exact values remain in the existing content source. Components do not define alternate copies of these destinations.

## Public Projection

Extend `PublicContactProfile` only with optional, public-safe strings: `instagramUrl?: string` and, in the future if needed, `cvUrl?: string`. `projectPublicContact` returns an empty projection for an unapproved record. For an approved record, each field is evaluated independently; a field is included only if it is factually verified, publication approved, nonempty, and (for URLs) HTTPS without embedded username/password. Review metadata (`verification`, `publication`, source, and record status) never enters the projection.

The homepage obtains the projection server-side and supplies it to Hero and Contact. Shared action markup accepts only `PublicContactProfile`; it must not accept `ContactSourceRecord`. This prevents draft or review data from being serialized into Client Component props. No client action component is required by this feature.

## Action View

The action family is derived from whichever optional public fields exist. Email is rendered as one ordinary `mailto:` link; GitHub, LinkedIn, and Instagram are external links with the established secure attributes. No action is created for a missing field. The current CV value is absent, so Download CV is not rendered. The user-facing Copy Email control is retired, but the email source field and all eligibility checks remain.

No separate persisted action list or duplicated URL configuration is justified. A small presentational Server Component may receive the public profile and render available actions; action order/emphasis is a view concern.

## Navbar State

Navbar visibility is ephemeral browser presentation state initialized and cleaned up by the existing navigation enhancement. It is not serialized, stored with content, or used to decide current navigation destination. The existing URL/hash/history state remains the single authority for active destination. Visibility thresholds and focus/menu locks are defined in [the UI contract](contracts/ui-final-ui-refinements.md).
