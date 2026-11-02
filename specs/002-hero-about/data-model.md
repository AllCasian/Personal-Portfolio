# Data Model: Hero & About

**Feature**: [Hero & About](./spec.md)

This feature adds no persistence or user-submitted data. Public, read-only profile content remains in the existing typed local content source and is separate from the section presentation.

## Professional Profile

Represents the developer identity and short introduction shown in the Home hero.

| Field | Shape | Required | Rules |
|---|---|---:|---|
| display name | non-empty text | Yes | Full name when verified; otherwise use a neutral, transparent plain-text placeholder prefixed `Placeholder:` that names the field and unverified status. |
| role focus | non-empty text | Yes | Broad professional engineering role, not a single technology/tool; if unavailable or unverified, use the same explicitly marked placeholder format. |
| introduction | non-empty text | Yes | One or two authored sentences, value-oriented and free of generic marketing clichés; includes one short verified focus phrase. If required authored content is unavailable, use an explicitly marked placeholder string instead. |
| about summary | `AboutSummary` | Yes | Six concise topic fields, approximately 150 words total or fewer; unavailable or unverified required topics use explicitly marked placeholders. |
| portrait | `PortraitAsset` | No | Verified local image only. Missing data selects the existing decorative fallback. |
| resume | `ResumeLink` | No | Exact available, verified local file and accessible label; absence produces no link. |
| GitHub | verified URL | No | Exact verified profile URL; absence produces no link. |
| LinkedIn | verified URL | No | Exact verified profile URL; absence produces no link. |

## AboutSummary

Concise information arranged by topic, not a detailed history or catalog.

| Field | Shape | Rules |
|---|---|---|
| education summary | text | Brief, verified education context or explicit editable placeholder; no invented institution, qualification, or date. |
| current experience summary | text | Brief, verified current professional experience or explicit editable placeholder; no invented employer, title, dates, or outcomes. |
| interests | text | Verified software engineering interests; do not assert unconfirmed specialization. |
| general competencies | text | A high-level summary only; no exhaustive skills inventory reserved for Feature 004. |
| engineering approach | text | Concise, factual description of working principles; avoid unsupported praise or generic claims. |
| professional direction | text | Broad, verified direction or explicit placeholder; do not present a narrow technology as the whole professional identity. |

## Optional Resources

| Entity | Fields | Rules |
|---|---|---|
| `PortraitAsset` | local asset reference, alternative text, intrinsic dimensions or equivalent metadata | Use `next/image`; text alternative describes informative content, or is empty for decorative media. Fixed-ratio frame remains stable on load/error. |
| `ResumeLink` | local destination, accessible label | Include only when a real verified resume is present in the repository. No empty href or placeholder link. |
| `SocialProfile` | exact verified HTTPS URL, accessible label | GitHub and LinkedIn are independently optional. No invented or placeholder URL. |

## UI Contract Values

The required hero actions are fixed navigation behavior, not profile fields:

| Action | Label | Destination |
|---|---|---|
| Primary | View Projects | `#portfolio` |
| Secondary | Contact Me | `#contact` |

Both resolve to the existing titled placeholders until their respective features are implemented. The existing navigation enhancer remains responsible for `aria-current`, hash/history synchronization, and active navigation styling.

## Relationships and State Rules

- The profile contains exactly one About summary; the page renders it at the existing unique `#about` destination.
- The profile's role focus and introduction belong to the `#home` hero.
- **String-field placeholder contract**: Preserve the existing `ProfileContent` string fields and the six string-valued About topic fields; do not add a placeholder flag or new data layer. For any required string whose information is unavailable or unverified, store a neutral plain-text value beginning with the exact marker `Placeholder:` and naming the missing field/status. Render the value as visible text in the semantic reading order so assistive technology receives the same fallback; do not hide the marker in CSS, `aria-hidden`, or generated content. Authored biography sentence rules do not apply to this marked placeholder. Remove the marker only when the value is replaced with verified authored content. This convention makes the placeholder state observable to component tests while remaining compatible with the existing string types.
- Placeholder strings MUST not invent or imply employment history, qualifications, achievements, technical expertise, professional metrics, or personal details. Use them only for unavailable/unverified required information. Omit unavailable optional resources rather than showing placeholder links or optional copy.
- Resume, social URLs, and portrait are absent until verified; missing optional values do not create empty controls, failed URLs, or a placeholder photograph.
- If portrait data exists, a failed image resolves visually to the existing decorative fallback without changing the frame's dimensions. When portrait data does not exist, the fallback is server-rendered directly.
- This model creates no employment timeline, education history, skills catalog, contact-submission data, account data, API, or remote synchronization.
- Content is public; do not put secrets, private contact data, or credentials in these values.
