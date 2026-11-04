import { render, screen, within } from '@testing-library/react'
import { EducationSection } from '@/components/sections/education-section'
import { getPublishedProfessionalContent } from '@/lib/professional-content'

describe('EducationSection', () => {
  it('renders approved education and credentials with optional fields omitted', () => {
    const content = getPublishedProfessionalContent()
    render(<EducationSection entries={content.education} certifications={content.certifications} />)

    const section = screen.getByRole('region', { name: 'Education' })
    expect(section).toHaveAttribute('id', 'education')
    const headings = within(section).getAllByRole('heading', { level: 3 })
    expect(headings[0]).toHaveTextContent('Technical University of Cluj-Napoca')
    expect(headings[1]).toHaveTextContent('Liceul Teoretic')
    const entries = within(section).getAllByRole('article').slice(0, 2)
    expect(entries).toHaveLength(2)
    expect(entries[0]).toHaveTextContent('Technical University of Cluj-Napoca')
    expect(entries[0]).toHaveTextContent('October 2021 – July 2025')
    expect(entries[1]).toHaveTextContent('Liceul Teoretic "Ioan Buteanu"')
    expect(entries[1]).not.toHaveTextContent(/202\d/)
    expect(within(section).getByRole('heading', { name: 'Certifications' })).toBeVisible()
    expect(within(section).getByText('LLM Performance Engineering')).toBeVisible()
    expect(within(section).getByText('GenAI Essentials for Everyone')).toBeVisible()
    expect(within(section).getByText('Social Enterprise Manager')).toBeVisible()
    expect(section).not.toHaveTextContent(/TODO|unapproved|draft/)
    expect(headings).toHaveLength(3)
  })
})
