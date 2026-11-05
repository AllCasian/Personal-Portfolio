import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { PublicContactProfile } from '@/content/contact-types'
import { ContactSection } from '@/components/sections/contact-section'
import { getPublishedContactProfile } from '@/lib/contact-content'

const approvedProfile: PublicContactProfile = {
  ownerName: 'Casian Criste',
  email: 'cristecasian@gmail.com',
  githubUrl: 'https://github.com/AllCasian',
  linkedinUrl: 'https://www.linkedin.com/in/casian-criste-b65582263/',
}

describe('ContactSection', () => {
  it('renders the approved content, selectable email, and secure external links', () => {
    const { container } = render(<ContactSection profile={approvedProfile} />)
    const section = container.querySelector('#contact')

    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('aria-labelledby', 'contact-title')
    expect(within(section as HTMLElement).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Contact',
    )
    expect(
      within(section as HTMLElement).getByText(/Have an opportunity, a project idea/),
    ).toBeVisible()

    const emailText = within(section as HTMLElement).getByText('cristecasian@gmail.com')
    expect(emailText).toBeVisible()
    expect(emailText).not.toHaveAttribute('href')

    const emailLink = within(section as HTMLElement).getByRole('link', { name: 'Send email' })
    expect(emailLink).toHaveAttribute('href', 'mailto:cristecasian@gmail.com')

    const github = within(section as HTMLElement).getByRole('link', {
      name: 'GitHub profile (opens in a new tab)',
    })
    expect(github).toHaveAttribute('href', 'https://github.com/AllCasian')
    expect(github).toHaveAttribute('target', '_blank')
    expect(github).toHaveAttribute('rel', 'noopener noreferrer')

    const linkedin = within(section as HTMLElement).getByRole('link', {
      name: 'LinkedIn profile (opens in a new tab)',
    })
    expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/casian-criste-b65582263/')
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('omits ineligible values without empty links or inactive controls', () => {
    render(<ContactSection profile={{ ownerName: 'Casian Criste' }} />)
    const section = screen.getByRole('region', { name: 'Contact' })

    expect(within(section).queryByRole('link')).not.toBeInTheDocument()
    expect(within(section).queryByRole('button')).not.toBeInTheDocument()
    expect(within(section).getByText('Contact links are unavailable right now.')).toBeVisible()
  })

  it('does not render review metadata from its public profile input', () => {
    render(<ContactSection profile={approvedProfile} />)
    const section = screen.getByRole('region', { name: 'Contact' })

    expect(section).not.toHaveTextContent(/approved|unapproved|verified|owner-confirmed|draft/i)
    expect(within(section).queryByTestId('contact-source-record')).not.toBeInTheDocument()
  })

  it('renders only the public projection from the approved source record', () => {
    const profile = getPublishedContactProfile()
    const { container } = render(<ContactSection profile={profile} />)
    const output = container.textContent ?? ''

    expect(output).toContain('cristecasian@gmail.com')
    expect(output).toContain('GitHub')
    expect(output).toContain('LinkedIn')
    expect(output).not.toMatch(/owner-confirmed|verified|unapproved|publicationStatus/i)
  })
})
