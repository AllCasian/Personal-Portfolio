import { render, screen } from '@testing-library/react'
import { HeroActions } from '@/components/sections/hero-actions'

describe('HeroActions', () => {
  it('shows the required project and contact actions with their approved destinations', () => {
    render(<HeroActions />)
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute(
      'href',
      '#portfolio',
    )
    expect(screen.getByRole('link', { name: 'Contact Me' })).toHaveAttribute('href', '#contact')
  })

  it('omits unavailable resume and social resources', () => {
    render(<HeroActions />)
    expect(screen.queryByLabelText('Additional professional links')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /resume|github|linkedin/i })).not.toBeInTheDocument()
  })
})
