import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PortfolioActions } from '@/components/sections/portfolio-actions'

describe('PortfolioActions', () => {
  it('renders only projected actions with accessible labels and secure external links', () => {
    render(
      <PortfolioActions
        profile={{
          email: 'cristecasian@gmail.com',
          githubUrl: 'https://github.com/AllCasian',
          linkedinUrl: 'https://www.linkedin.com/in/casian-criste-b65582263/',
          instagramUrl: 'https://www.instagram.com/casiancriste',
        }}
      />,
    )
    const nav = screen.getByRole('navigation', { name: 'Contact actions' })
    const links = within(nav).getAllByRole('link')

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      'mailto:cristecasian@gmail.com',
      'https://github.com/AllCasian',
      'https://www.linkedin.com/in/casian-criste-b65582263/',
      'https://www.instagram.com/casiancriste',
    ])
    expect(within(nav).getByRole('link', { name: 'Send email' })).toHaveClass('button-primary')
    expect(
      within(nav).getByRole('link', { name: 'GitHub profile (opens in a new tab)' }),
    ).toHaveAttribute('rel', 'noopener noreferrer')
    expect(
      within(nav).getByRole('link', { name: 'LinkedIn profile (opens in a new tab)' }),
    ).toHaveAttribute('target', '_blank')
    expect(within(nav).getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    expect(within(nav).queryByRole('link', { name: /download cv/i })).not.toBeInTheDocument()
    expect(nav.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(4)
  })

  it('returns no markup when the public projection contains no eligible action', () => {
    const { container } = render(<PortfolioActions profile={{ ownerName: 'Casian Criste' }} />)
    expect(container.firstChild).toBeNull()
  })
})
