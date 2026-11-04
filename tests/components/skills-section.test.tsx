import { render, screen, within } from '@testing-library/react'
import { SkillsSection } from '@/components/sections/skills-section'
import { getPublishedProfessionalContent } from '@/lib/professional-content'

describe('SkillsSection', () => {
  it('renders each approved skill once in fixed semantic category order', () => {
    const categories = getPublishedProfessionalContent().skillCategories
    render(<SkillsSection categories={categories} />)

    const section = screen.getByRole('region', { name: 'Skills' })
    expect(section).toHaveAttribute('id', 'skills')
    expect(
      within(section)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      'Programming Languages',
      'Frontend & Mobile',
      'Backend',
      'Databases',
      'DevOps & Infrastructure',
      'Additional Technologies & Tools',
    ])
    const labels = within(section)
      .getAllByRole('listitem')
      .map((item) => item.textContent)
    expect(labels).toHaveLength(33)
    expect(new Set(labels).size).toBe(33)
    expect(labels[0]).toBe('Python')
    expect(labels.at(-1)).toBe('Arduino')
    expect(section).not.toHaveTextContent(/%|proficiency|advanced|intermediate|beginner/i)
  })
})
