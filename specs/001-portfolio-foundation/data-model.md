# Data Model: Portfolio Foundation

**Feature**: [Portfolio Foundation](./spec.md)

The foundation has no persistent or user-submitted data. The following are read-only content structures maintained as typed local content. They contain only public display information.

## Profile Content

Represents the concise identity and introduction displayed in the hero.

| Field | Shape | Rules |
|---|---|---|
| display name | text | Required for a complete launch; use an editable placeholder until verified. |
| role focus | text | Required for the hero message; must reflect confirmed information or an editable placeholder. |
| introduction | text | Short, readable, and factually verified; avoid invented results or experience. |
| portrait | optional local image reference and alternative text | Omit when unavailable; display a designed placeholder. Alternative text must express the image's relevant meaning or be empty if decorative. |
| primary action | label and destination | Destination must be valid and point to an available section or verified contact route. |

Profile content is presented by the hero and has no authentication, lifecycle, or remote synchronization behavior.

## Portfolio Section

Represents an in-page destination. For this feature, sections below the hero are titled placeholders only.

| Field | Shape | Rules |
|---|---|---|
| id | stable unique slug | Unique within the page; also used as the anchor identifier. |
| title | short text | Required; clearly names the destination. |
| state | `placeholder` | All below-hero destinations remain placeholders in this scope. |
| content | optional display text | Empty or neutral helper text only; no fabricated professional claims or deferred feature content. |

## Navigation Item

Represents a visible link to a portfolio section or verified external destination.

| Field | Shape | Rules |
|---|---|---|
| label | short text | Required, descriptive, and understandable without surrounding iconography. |
| href | local anchor or verified URL | Must resolve to an existing section or confirmed destination. |
| kind | `section` or `external` | External links are included only when their destination is confirmed. |
| order | integer | Determines consistent reading and display order. |

Navigation links correspond to the named Portfolio Sections. Header and footer navigation may reference the same section identifiers.

## Data Relationships and Constraints

- Each section navigation item references exactly one section identifier or one confirmed external destination.
- Section identifiers are unique; link labels should remain unique within a navigation landmark when practical.
- No project, employment, education, contact-submission, or account entities are introduced by this feature.
- Data is public presentation content, not secrets. Never place private credentials or personal data intended to remain private in client-visible content.
