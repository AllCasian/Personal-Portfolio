import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/sections/hero-section'

describe('HeroSection', () => {
  it('presents editable identity, role focus, primary action, and no unconfirmed portrait', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your Name')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Software Engineer')
    expect(screen.getByRole('link', { name: /explore portfolio/i })).toHaveAttribute(
      'href',
      '#portfolio',
    )
    expect(screen.getByText('Portrait placeholder')).toBeInTheDocument()
  })
})
