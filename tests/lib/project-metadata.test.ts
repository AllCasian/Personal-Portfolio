import { generateStaticParams } from '@/app/projects/[slug]/page'
import { projects } from '@/content/projects'
import type { ProjectRecord } from '@/content/project-types'
import { getPublishedProjectParams, getPublishedProjects } from '@/lib/projects'
import { createProjectMetadata } from '@/lib/project-metadata'

describe('project metadata and static routes', () => {
  it('generates exactly the approved stable route slugs', () => {
    expect(generateStaticParams()).toEqual([
      { slug: 'drivewise' },
      { slug: 'smart-librarian' },
      { slug: 'etl-pipeline' },
      { slug: 'automatic-guitar-tuner' },
      { slug: 'energy-management-system' },
      { slug: 'ai-recipe' },
    ])
  })

  it('generates unique titles and descriptions using eligible public project facts', () => {
    const metadata = getPublishedProjects().map((project) => createProjectMetadata(project))
    expect(new Set(metadata.map(({ title }) => title)).size).toBe(6)
    expect(metadata.every(({ description }) => Boolean(description))).toBe(true)
    expect(metadata[5].description).toBe('A project case study in Personal Projects.')
    expect(metadata.every(({ openGraph }) => !openGraph?.images)).toBe(true)
  })

  it('adds canonical metadata only for a valid configured HTTPS site base', () => {
    const project = getPublishedProjects()[0]
    expect(createProjectMetadata(project, 'https://portfolio.example').alternates?.canonical).toBe(
      'https://portfolio.example/projects/drivewise',
    )
    expect(createProjectMetadata(project).alternates).toBeUndefined()
    expect(createProjectMetadata(project, 'http://portfolio.example').alternates).toBeUndefined()
    expect(createProjectMetadata(project, 'not-a-url').alternates).toBeUndefined()
  })

  it('returns generic noindex metadata for an unavailable or unpublished project', () => {
    const draft = { ...projects[0], publicationStatus: 'draft' } satisfies ProjectRecord
    const publicDrafts = getPublishedProjects([draft])
    expect(publicDrafts).toEqual([])
    expect(getPublishedProjectParams([draft])).toEqual([])

    const metadata = createProjectMetadata(publicDrafts[0])
    expect(metadata).toMatchObject({
      title: 'Project not found',
      description: 'The requested project is unavailable.',
    })
    expect(JSON.stringify(metadata)).not.toContain('Drivewise')
  })

  it('does not expose unapproved sentinels through metadata inputs', () => {
    const base = projects[0]
    const draft: ProjectRecord = {
      ...base,
      summary: {
        value: 'SENTINEL_DRAFT_METADATA',
        verification: { status: 'verified', source: 'owner-confirmed' },
        publication: { status: 'unapproved' },
      },
    }
    const [publicProject] = getPublishedProjects([draft])
    const metadata = createProjectMetadata(publicProject)
    expect(JSON.stringify(metadata)).not.toContain('SENTINEL_DRAFT_METADATA')
  })
})
