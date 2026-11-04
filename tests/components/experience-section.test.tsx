import { render, screen, within } from '@testing-library/react'
import { ExperienceSection } from '@/components/sections/experience-section'
import { getPublishedProfessionalContent } from '@/lib/professional-content'

describe('ExperienceSection', () => {
  it('renders approved experience in reverse chronological order with semantic structure', () => {
    const content = getPublishedProfessionalContent()
    render(<ExperienceSection entries={content.experience} />)

    const section = screen.getByRole('region', { name: 'Experience' })
    expect(section).toHaveAttribute('id', 'experience')
    const entries = within(section).getAllByRole('article')
    expect(entries).toHaveLength(2)
    expect(entries[0]).toHaveTextContent('Endava')
    expect(entries[0]).toHaveTextContent('Dava.X Trainee Program')
    expect(entries[0]).toHaveTextContent('June 2026 – October 2026')
    expect(entries[0]).toHaveTextContent('Former')
    expect(entries[1]).toHaveTextContent('Core Elevating Media')
    expect(entries[1]).toHaveTextContent('July 2024 – August 2024')
    expect(within(entries[1]).getByText('Work arrangement')).toBeVisible()
    expect(within(entries[1]).getByText('Remote')).toBeVisible()
    expect(within(section).getAllByRole('heading', { level: 3 })).toHaveLength(2)
    expect(within(section).getAllByRole('list').length).toBeGreaterThan(0)
    expect(section).not.toHaveTextContent(/commercial client|production deployment/i)
    expect(section).not.toHaveTextContent(/draft|approved|verified/)
  })

  it('omits unavailable optional details instead of rendering empty labels', () => {
    const content = getPublishedProfessionalContent()
    render(<ExperienceSection entries={content.experience} />)
    expect(screen.queryByText('Website')).not.toBeInTheDocument()
    expect(screen.queryByText('Location:')).not.toBeInTheDocument()
  })
})
