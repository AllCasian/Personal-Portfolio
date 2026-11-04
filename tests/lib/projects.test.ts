import { projects } from '@/content/projects'
import type { ProjectField, ProjectRecord } from '@/content/project-types'
import { getPublishedProject, getPublishedProjects, isProjectFieldPublic } from '@/lib/projects'

function field<T>(
  value: T,
  verification: 'verified' | 'unverified' = 'verified',
  publication: 'approved' | 'unapproved' = 'approved',
): ProjectField<T> {
  return {
    value,
    verification: {
      status: verification,
      ...(verification === 'verified' ? { source: 'owner-confirmed' as const } : {}),
    },
    publication: { status: publication },
  }
}

describe('public project projection', () => {
  it('publishes only records and required identity fields that pass both independent gates', () => {
    const base = projects[0]
    for (const verification of ['verified', 'unverified'] as const) {
      for (const publication of ['approved', 'unapproved'] as const) {
        const candidate = {
          ...base,
          title: field(`title-${verification}-${publication}`, verification, publication),
        } satisfies ProjectRecord
        const output = getPublishedProjects([candidate])
        expect(output.length === 1).toBe(verification === 'verified' && publication === 'approved')
      }
    }

    expect(getPublishedProjects([{ ...base, publicationStatus: 'draft' }])).toEqual([])
    expect(getPublishedProject('drivewise')?.title).toBe('Drivewise')
    expect(getPublishedProject('not-a-project')).toBeUndefined()
  })

  it('omits optional fields unless their own verification and approval both pass', () => {
    const base = projects[0]
    const sentinel = 'SENTINEL_PRIVATE_OPTIONAL_DETAIL'
    for (const verification of ['verified', 'unverified'] as const) {
      for (const publication of ['approved', 'unapproved'] as const) {
        const candidate: ProjectRecord = {
          ...base,
          summary: field(sentinel, verification, publication),
        }
        const output = getPublishedProjects([candidate])
        const shouldPublish = verification === 'verified' && publication === 'approved'
        expect(JSON.stringify(output).includes(sentinel)).toBe(shouldPublish)
      }
    }

    const hidden = getPublishedProjects([
      {
        ...base,
        technologies: [
          field(sentinel, 'unverified'),
          field('unapproved-tech', 'verified', 'unapproved'),
        ],
        caseStudy: { overview: field(sentinel, 'verified', 'unapproved') },
        media: [
          field(
            { src: '/projects/internal.png', width: 320, height: 240, alt: sentinel },
            'unverified',
          ),
        ],
        links: [
          field(
            { kind: 'github', href: 'https://example.com/private', label: sentinel },
            'verified',
            'unapproved',
          ),
        ],
      },
    ])
    expect(JSON.stringify(hidden)).not.toContain(sentinel)
    expect(JSON.stringify(hidden)).not.toContain('unapproved-tech')
    expect(JSON.stringify(hidden)).not.toContain('private')
  })

  it('strips workflow metadata and never returns failed source values', () => {
    const output = getPublishedProjects()
    expect(output).toHaveLength(6)
    expect(JSON.stringify(output)).not.toMatch(
      /verification|publicationStatus|reviewedOn|owner-confirmed/,
    )
    expect(output[0]).not.toHaveProperty('publicationStatus')
    expect(output[0]).not.toHaveProperty('summary.verification')
  })

  it('accepts only exact safe HTTPS URLs and rejects placeholder or guessed destinations', () => {
    const base = projects[0]
    const candidates: ProjectRecord[] = [
      {
        ...base,
        links: [
          field({ kind: 'github', href: 'https://github.com/casian/drivewise', label: 'GitHub' }),
          field({ kind: 'live-demo', href: 'http://example.com', label: 'Live demo' } as never),
          field({
            kind: 'github',
            href: 'https://user:secret@example.com/repo',
            label: 'GitHub',
          } as never),
          field(
            { kind: 'github', href: 'https://example.com/guess', label: 'PLACEHOLDER: GitHub' },
            'unverified',
          ),
        ],
      },
    ]
    expect(getPublishedProjects(candidates)[0].links).toEqual([
      { kind: 'github', href: 'https://github.com/casian/drivewise', label: 'GitHub' },
    ])
  })

  it('reports eligibility for all factual-verification and publication-approval states', () => {
    expect(isProjectFieldPublic(field('both-positive'))).toBe(true)
    expect(isProjectFieldPublic(field('not-verified', 'unverified'))).toBe(false)
    expect(isProjectFieldPublic(field('not-approved', 'verified', 'unapproved'))).toBe(false)
    expect(isProjectFieldPublic(undefined)).toBe(false)
  })
})
