import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/sections/section-heading'

describe('content primitives', () => {
  it('renders card content semantically', () => {
    render(
      <Card>
        <p>Placeholder copy</p>
      </Card>,
    )
    expect(screen.getByText('Placeholder copy')).toBeVisible()
  })

  it('provides a section-level heading', () => {
    render(<SectionHeading>About</SectionHeading>)
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeVisible()
  })
})
