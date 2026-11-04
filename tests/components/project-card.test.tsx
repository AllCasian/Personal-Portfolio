import { render, screen } from '@testing-library/react'
import { projects } from '@/content/projects'
import type { ProjectRecord } from '@/content/project-types'
import { getPublishedProjects } from '@/lib/projects'
import { ProjectCard } from '@/components/projects/project-card'

describe('ProjectCard', () => {
  it('renders the project identity and a specific details link', () => {
    const project = getPublishedProjects()[0]
    render(<ProjectCard categoryLabel="Dava.X Trainee Program" project={project} />)

    expect(screen.getByRole('article')).toHaveTextContent('Drivewise')
    expect(screen.getByRole('link', { name: 'View details for Drivewise' })).toHaveAttribute(
      'href',
      '/projects/drivewise',
    )
    expect(screen.getByText('Dava.X Trainee Program')).toBeInTheDocument()
    expect(screen.getByText('Endava')).toBeInTheDocument()
  })

  it('omits unavailable optional fields and does not create empty controls', () => {
    const recipe = getPublishedProjects().find(({ id }) => id === 'ai-recipe')
    expect(recipe).toBeDefined()
    render(<ProjectCard categoryLabel="Personal Projects" project={recipe!} />)

    expect(screen.getByRole('heading', { name: 'AI Recipe' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View details for AI Recipe' })).toHaveAttribute(
      'href',
      '/projects/ai-recipe',
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('list', { name: 'Technologies and concepts' }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('renders external controls as separate links when approved data exists', () => {
    const original = getPublishedProjects()[0]
    const withLink = {
      ...original,
      links: [
        {
          kind: 'github' as const,
          href: 'https://github.com/owner/drivewise' as const,
          label: 'GitHub',
        },
      ],
    }
    render(<ProjectCard categoryLabel="Dava.X Trainee Program" project={withLink} />)

    expect(screen.getByRole('link', { name: 'View details for Drivewise' })).toHaveAttribute(
      'href',
      '/projects/drivewise',
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/owner/drivewise',
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'rel',
      'noreferrer noopener',
    )
    expect(projects).toHaveLength(6)
  })

  it('never places unverified or unapproved sentinels in HTML-bound card content', () => {
    const candidate: ProjectRecord = {
      ...projects[0],
      summary: {
        value: 'SENTINEL_PRIVATE_CARD_SUMMARY',
        verification: { status: 'unverified' },
        publication: { status: 'approved' },
      },
    }
    const publicProject = getPublishedProjects([candidate])[0]
    const { container } = render(
      <ProjectCard categoryLabel="Dava.X Trainee Program" project={publicProject} />,
    )
    expect(container.innerHTML).not.toContain('SENTINEL_PRIVATE_CARD_SUMMARY')
    expect(container).not.toHaveTextContent('SENTINEL_PRIVATE_CARD_SUMMARY')
  })
})
