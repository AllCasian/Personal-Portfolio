import { render, screen, within } from '@testing-library/react'
import { ProjectsSection } from '@/components/sections/projects-section'

describe('ProjectsSection', () => {
  it('renders exactly six cards in the three approved groups and order', () => {
    const { container } = render(<ProjectsSection />)
    const section = container.querySelector('#portfolio')
    expect(section).toBeInTheDocument()

    const groups = within(section as HTMLElement).getAllByRole('region')
    expect(
      groups.map((group) => within(group).getByRole('heading', { level: 3 }).textContent),
    ).toEqual(['Professional Projects', 'Academic Projects', 'Personal Projects'])
    expect(within(section as HTMLElement).getAllByRole('article')).toHaveLength(6)
    expect(
      within(section as HTMLElement)
        .getAllByRole('heading', { level: 4 })
        .map((heading) => heading.textContent),
    ).toEqual([
      'Drivewise',
      'Smart Librarian',
      'ETL Pipeline',
      'Automatic Guitar Tuner',
      'Energy Management System',
      'AI Recipe',
    ])
    expect(within(groups[0]).getAllByText('Endava').length).toBeGreaterThan(1)
    expect(
      within(groups[1]).getAllByText('Technical University of Cluj-Napoca (UTCN)').length,
    ).toBeGreaterThan(1)
    expect(within(groups[2]).queryByText('Endava')).not.toBeInTheDocument()
  })

  it('keeps the existing homepage destinations and does not add filtering controls', () => {
    render(<ProjectsSection />)
    expect(screen.getByRole('region', { name: 'Portfolio' })).toBeInTheDocument()
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })
})
