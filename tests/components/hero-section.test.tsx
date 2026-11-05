import { render, screen, within } from '@testing-library/react'
import HomePage from '@/app/page'
import { HeroSection } from '@/components/sections/hero-section'

describe('HeroSection', () => {
  it('renders the confirmed identity, role, and concise professional introduction', () => {
    render(<HeroSection />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Casian Criste')
    expect(heading).toHaveTextContent('Junior Data Engineer')
    expect(
      screen.getByText(
        "I'm a Computer Engineering graduate with interests in software engineering, full-stack development, and data engineering.",
      ),
    ).toBeVisible()
    expect(screen.getByRole('img', { name: 'Casian Criste' })).toBeVisible()
    expect(screen.queryByText(/^Placeholder:/)).not.toBeInTheDocument()
  })

  it('composes exactly one page H1 and a subordinate About section while preserving destinations', () => {
    render(<HomePage />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeVisible()
    expect(document.querySelector('#home')).toBeInTheDocument()
    expect(document.querySelector('#about')).toBeInTheDocument()
    expect(document.querySelector('#portfolio')).toBeInTheDocument()
    expect(document.querySelector('#contact')).toBeInTheDocument()
    expect(
      within(document.querySelector('#about') as HTMLElement).getAllByRole('heading', {
        level: 3,
      }),
    ).toHaveLength(6)
  })
})
