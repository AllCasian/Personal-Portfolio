import { render, screen } from '@testing-library/react'
import { HeroActions } from '@/components/sections/hero-actions'

const approvedProfile = {
  email: 'cristecasian@gmail.com',
  githubUrl: 'https://github.com/AllCasian',
  linkedinUrl: 'https://www.linkedin.com/in/casian-criste-b65582263/',
  instagramUrl: 'https://www.instagram.com/casiancriste',
}

describe('HeroActions', () => {
  it('shows the required project and contact actions with their approved destinations', () => {
    render(<HeroActions profile={approvedProfile} />)
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute(
      'href',
      '#portfolio',
    )
    expect(screen.getByRole('link', { name: 'Contact Me' })).toHaveAttribute('href', '#contact')
    expect(
      screen.getByRole('navigation', { name: 'Hero contact and social actions' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/casiancriste',
    )
  })

  it('omits unavailable resume and social resources', () => {
    render(<HeroActions profile={{ email: 'cristecasian@gmail.com' }} />)
    expect(screen.queryByRole('link', { name: /resume|download cv/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Send email' })).toHaveAttribute(
      'href',
      'mailto:cristecasian@gmail.com',
    )
  })
})
