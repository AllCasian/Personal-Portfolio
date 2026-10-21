# UI Contract: Portfolio Navigation

**Feature**: [Portfolio Foundation](../spec.md)

This is a user-facing interaction contract, not a network API. All behavior applies to the header navigation unless noted.

## Navigation Landmarks

- The page exposes one primary navigation landmark with a concise accessible name and links to every primary in-page section.
- The footer may expose a separate, named secondary navigation landmark. Repeated links use consistent labels and destinations.
- Each link points to an existing, uniquely identified section or a confirmed external destination.
- Keyboard order follows the visible reading order. Focus indicators remain visible against all backgrounds.
- The primary destinations are exactly Home → hero, About → titled placeholder, Portfolio → titled placeholder, and Contact → titled placeholder; Home alone contains feature content.
- The current destination is determined from the initial URL/hash and anchor/history navigation, not viewport scrolling. With no hash, Home is current. Exactly one primary link exposes `aria-current="location"`; active styling is distinct from hover and keyboard focus.

## Desktop

- At widths of 1024 CSS pixels and above, show uncompressed, unwrapped primary links in the header.
- Links work with pointer, touch, and keyboard activation and follow normal in-page anchor behavior.
- Direct loading of a section anchor leaves the section heading visible and unobscured.

## Mobile Full-Screen Panel

- At widths of 320–1023 CSS pixels, a button with the accessible name “Open menu” opens the full-screen navigation panel; its expanded state is exposed programmatically.
- Opening the panel moves focus to an appropriate panel control or first link and keeps keyboard focus within the modal panel while it is open.
- The panel contains a visible, keyboard-operable close control with an accessible name, such as “Close menu”.
- Escape and the close control close the panel. Choosing a section link closes the panel, navigates to the section, and moves focus to its heading.
- Escape and explicit close return focus to the menu trigger.
- Background content cannot be activated while the modal panel is open. The panel has a clear heading or accessible name.
- Motion communicates the open/close transition only. Reduced-motion settings remove or simplify movement without changing functionality.

## Progressive Enhancement

- Server-rendered HTML contains all primary links and valid section destinations.
- If JavaScript is unavailable, navigation links remain visible and usable inline; do not render a menu trigger that cannot open the panel.
- If JavaScript is available, the responsive full-screen panel may replace the inline narrow-screen presentation after hydration, without hiding links before the enhanced behavior is available.
- Navigation remains functional if animation is unavailable or disabled.

## Visual and Input Requirements

- Interactive targets aim for at least 44 by 44 CSS pixels where practical.
- Focus, hover, active, and expanded states are visually distinct and meet applicable WCAG 2.2 AA contrast requirements.
- The panel, labels, and controls fit at 320 CSS pixels and 200% zoom without page-level horizontal overflow.
