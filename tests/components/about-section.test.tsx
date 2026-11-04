import { render, screen } from '@testing-library/react'
import { AboutSection } from '@/components/sections/about-section'

describe('AboutSection', () => {
  it('presents all six concise topics under the About destination', () => {
    render(<AboutSection />)
    expect(screen.getByRole('region', { name: 'About' })).toHaveAttribute('id', 'about')
    for (const topic of [
      'Education',
      'Professional background',
      'Engineering interests',
      'Technical perspective',
      'How I work',
      'Professional direction',
    ]) {
      expect(screen.getByRole('heading', { level: 3, name: topic })).toBeVisible()
    }
    expect(
      screen.getByText(
        'I graduated in Computer Engineering from the Technical University of Cluj-Napoca.',
      ),
    ).toBeVisible()
    expect(
      screen.getByText(
        'I worked as a Junior Data Engineer in the Dava.X Trainee Program at Endava from June to October 2026.',
      ),
    ).toBeVisible()
    expect(
      screen.getByText(
        'My interests include software engineering, full-stack development, and data engineering.',
      ),
    ).toBeVisible()
    expect(
      screen.getByText(
        'My technical background includes React, TypeScript, Java, Spring Boot, Python, SQL, and data engineering.',
      ),
    ).toBeVisible()
    expect(
      screen.getByText(
        "I'm interested in solving practical problems, writing maintainable code, and continually developing my technical skills.",
      ),
    ).toBeVisible()
    expect(
      screen.getByText(
        'I aim to grow as a software engineer while building on my data engineering experience.',
      ),
    ).toBeVisible()
    expect(screen.queryByText(/^Placeholder:/)).not.toBeInTheDocument()
    const wordCount = screen
      .getByRole('region', { name: 'About' })
      .textContent?.trim()
      .split(/\s+/).length
    expect(wordCount).toBeLessThanOrEqual(150)
  })
})
