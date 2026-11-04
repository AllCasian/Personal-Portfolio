import { projects, projectGroups } from '@/content/projects'
import { validateProjectRecords } from '@/lib/projects'

describe('initial project content', () => {
  it('contains exactly six unique projects in approved category and display order', () => {
    expect(
      projects.map(({ id, slug, title, category }) => [
        id,
        slug.value,
        title.value,
        category.value,
      ]),
    ).toEqual([
      ['drivewise', 'drivewise', 'Drivewise', 'dava-x'],
      ['smart-librarian', 'smart-librarian', 'Smart Librarian', 'dava-x'],
      ['etl-pipeline', 'etl-pipeline', 'ETL Pipeline', 'dava-x'],
      ['automatic-guitar-tuner', 'automatic-guitar-tuner', 'Automatic Guitar Tuner', 'academic'],
      [
        'energy-management-system',
        'energy-management-system',
        'Energy Management System',
        'academic',
      ],
      ['ai-recipe', 'ai-recipe', 'AI Recipe', 'personal'],
    ])
    expect(projectGroups.map(({ category }) => category)).toEqual([
      'dava-x',
      'academic',
      'personal',
    ])
    expect(new Set(projects.map(({ id }) => id)).size).toBe(6)
    expect(new Set(projects.map(({ slug }) => slug.value)).size).toBe(6)
  })

  it('contains valid approved records and rejects duplicate or malformed identities', () => {
    expect(() => validateProjectRecords(projects)).not.toThrow()
    expect(() => validateProjectRecords([projects[0], projects[0]])).toThrow(/duplicate/i)
    expect(() =>
      validateProjectRecords([
        projects[0],
        { ...projects[1], slug: projects[0].slug } as (typeof projects)[number],
      ]),
    ).toThrow(/duplicate/i)
    expect(() =>
      validateProjectRecords([
        { ...projects[0], title: { ...projects[0].title, value: ' ' } },
      ] as unknown as typeof projects),
    ).toThrow(/title/i)
  })

  it('keeps AI Recipe limited to its confirmed identity and category', () => {
    const recipe = projects.find(({ id }) => id === 'ai-recipe')
    expect(recipe).toBeDefined()
    expect(recipe).not.toHaveProperty('summary')
    expect(recipe).not.toHaveProperty('technologies')
    expect(recipe).not.toHaveProperty('caseStudy')
    expect(recipe).not.toHaveProperty('media')
    expect(recipe).not.toHaveProperty('links')
  })

  it('classifies all Dava.X projects as training work only', () => {
    const traineeProjects = projects.filter(({ category }) => category.value === 'dava-x')
    expect(traineeProjects).toHaveLength(3)
    for (const project of traineeProjects) {
      expect(project.attribution?.value).toEqual({
        organization: 'Endava',
        program: 'Dava.X Trainee Program',
      })
      expect(project.summary?.value).toContain('Dava.X Trainee Program at Endava')
      expect(project.summary?.value).not.toMatch(
        /commercial client|production deployment|independently delivered/i,
      )
    }
  })
})
