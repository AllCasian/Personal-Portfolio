import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { navigationItems } from '@/content/navigation'
import { SiteFooter } from '@/components/layout/site-footer'

describe('SiteFooter', () => {
  afterEach(() => vi.useRealTimers())

  it('renders an approved projected owner and all existing destinations', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 1))
    render(<SiteFooter ownerName="Casian Criste" />)

    const footer = screen.getByRole('contentinfo')
    const nav = within(footer).getByRole('navigation', { name: 'Footer navigation' })
    expect(within(nav).getAllByRole('link')).toHaveLength(navigationItems.length)
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(navigationItems.map((item) => item.label))
    expect(footer).toHaveTextContent('© 2026 Casian Criste. All rights reserved.')
    expect(nav.querySelector('[aria-current]')).toBeNull()
    expect(nav.querySelector('[data-section-link]')).toBeNull()
    expect(
      within(footer).queryByRole('navigation', { name: 'Contact actions' }),
    ).not.toBeInTheDocument()
    expect(footer.querySelector('.portfolio-actions')).toBeNull()
  })

  it('omits an ineligible owner and uses a year-only copyright', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 5, 1))
    render(<SiteFooter />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent('© 2026. All rights reserved.')
    expect(footer).not.toHaveTextContent('Casian Criste')
    expect(footer.querySelector('.portfolio-actions')).toBeNull()
  })

  it('renders a deterministic year immediately before and after year rollover', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 11, 31, 23, 59, 59))
    const { rerender } = render(<SiteFooter />)
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2025. All rights reserved.')

    vi.setSystemTime(new Date(2026, 0, 1, 0, 0, 0))
    rerender(<SiteFooter />)
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2026. All rights reserved.')
  })

  it('prefixes footer destinations on project pages without current-state semantics', () => {
    render(<SiteFooter context="project" ownerName="Casian Criste" />)
    const nav = screen.getByRole('navigation', { name: 'Footer navigation' })

    expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/#contact')
    expect(nav.querySelector('[aria-current]')).toBeNull()
  })
})
