import { renderToStaticMarkup } from 'react-dom/server'
import { vi } from 'vitest'
import { projects } from '@/content/projects'
import type {
  ProjectField,
  ProjectRecord,
  PublicationApprovalStatus,
  VerificationStatus,
} from '@/content/project-types'
import { ProjectDetailLayout } from '@/components/projects/project-detail-layout'
import { createProjectMetadata } from '@/lib/project-metadata'
import { getPublishedProjectParams, getPublishedProjects } from '@/lib/projects'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const { fill, ...imageProps } = props
    void fill
    return <img {...imageProps} alt={props.alt ?? ''} />
  },
}))

function field<T>(
  value: T,
  verificationStatus: VerificationStatus,
  approvalStatus: PublicationApprovalStatus,
): ProjectField<T> {
  return {
    value,
    verification: {
      status: verificationStatus,
      ...(verificationStatus === 'verified' ? { source: 'owner-confirmed' as const } : {}),
    },
    publication: { status: approvalStatus },
  }
}

describe('project publication boundary through server rendering', () => {
  it.each([
    ['verified and approved', 'verified', 'approved', true],
    ['verified and unapproved', 'verified', 'unapproved', false],
    ['unverified and approved', 'unverified', 'approved', false],
    ['unverified and unapproved', 'unverified', 'unapproved', false],
  ] as const)(
    'renders sentinel summary only when it is %s',
    (_label, verificationStatus, approvalStatus, isPublic) => {
      const sentinel = `SENTINEL_${verificationStatus}_${approvalStatus}_SUMMARY`
      const candidate: ProjectRecord = {
        ...projects[0],
        summary: field(sentinel, verificationStatus, approvalStatus),
      }
      const [published] = getPublishedProjects([candidate])

      expect(published).toBeDefined()
      const html = renderToStaticMarkup(<ProjectDetailLayout project={published!} />)
      const metadata = createProjectMetadata(published)
      const routeParams = getPublishedProjectParams([candidate])
      const serialized = JSON.stringify({ published, metadata, routeParams })

      expect(html.includes(sentinel)).toBe(isPublic)
      expect(JSON.stringify(metadata).includes(sentinel)).toBe(isPublic)
      expect(serialized.includes(sentinel)).toBe(isPublic)
      expect(routeParams).toEqual([{ slug: 'drivewise' }])

      if (!isPublic) {
        expect(html).not.toContain(sentinel)
        expect(JSON.stringify(metadata)).not.toContain(sentinel)
        expect(serialized).not.toContain(sentinel)
        expect(metadata.description).toBe('A project case study in Dava.X Trainee Program.')
      }
    },
  )

  it('excludes an entirely unpublished project from rendering, metadata, and static routes', () => {
    const sentinel = 'SENTINEL_UNPUBLISHED_PROJECT'
    const unpublished: ProjectRecord = {
      ...projects[0],
      publicationStatus: 'draft',
      title: field(sentinel, 'verified', 'approved'),
      summary: field(sentinel, 'verified', 'approved'),
    }
    const publicProjects = getPublishedProjects([unpublished])
    const routeParams = getPublishedProjectParams([unpublished])
    const metadata = createProjectMetadata(publicProjects[0])
    const serverHtml = publicProjects
      .map((project) => renderToStaticMarkup(<ProjectDetailLayout project={project} />))
      .join('')
    const serialized = JSON.stringify({ publicProjects, routeParams, metadata })

    expect(publicProjects).toEqual([])
    expect(routeParams).toEqual([])
    expect(metadata).toMatchObject({
      title: 'Project not found',
      description: 'The requested project is unavailable.',
      openGraph: {
        title: 'Project not found',
        description: 'The requested project is unavailable.',
      },
    })
    expect(serverHtml).not.toContain(sentinel)
    expect(JSON.stringify(metadata)).not.toContain(sentinel)
    expect(serialized).not.toContain(sentinel)
  })
})
