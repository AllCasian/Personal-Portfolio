import { siteMetadata } from '@/lib/site-metadata'
import type {
  ContentField,
  ExperienceRecord,
  ProfessionalContentSource,
} from '@/content/experience-education-skills-types'
import { educationRecords, certificationRecords } from '@/content/education'
import { experienceRecords } from '@/content/experience'
import { skillCategories } from '@/content/skills'
import { renderProfessionalContentFixture } from '../e2e/fixtures/professional-content-render'

function field<T>(value: T, verified: boolean, approved: boolean): ContentField<T> {
  return {
    value,
    verification: {
      status: verified ? 'verified' : 'unverified',
      ...(verified ? { source: 'owner-confirmed' as const } : {}),
    },
    publication: { status: approved ? 'approved' : 'unapproved' },
  }
}

function sentinelExperience(): ExperienceRecord {
  return {
    id: 'fixture-visible-experience',
    publicationStatus: 'approved',
    fields: {
      organization: field('Sentinel Test Organization', true, true),
      role: field('Sentinel Test Role', true, true),
      program: field('Sentinel Public Training Program', true, true),
      startDate: field({ month: 1, year: 2025 }, true, true),
      endDate: field({ month: 2, year: 2025 }, true, true),
      status: field('former', true, true),
      contributions: [
        field('SENTINEL_VERIFIED_APPROVED_VISIBLE', true, true),
        field('SENTINEL_VERIFIED_UNAPPROVED_HIDDEN', true, false),
        field('SENTINEL_UNVERIFIED_APPROVED_HIDDEN', false, true),
        field('SENTINEL_UNVERIFIED_UNAPPROVED_HIDDEN', false, false),
      ],
    },
  }
}

function testSource(): ProfessionalContentSource {
  const unpublishedRecord: ExperienceRecord = {
    ...sentinelExperience(),
    id: 'SENTINEL_UNAPPROVED_RECORD_ID_HIDDEN',
    publicationStatus: 'draft',
    fields: {
      ...sentinelExperience().fields,
      organization: field('SENTINEL_UNAPPROVED_RECORD_HIDDEN', true, true),
    },
  }

  return {
    experience: [...experienceRecords, sentinelExperience(), unpublishedRecord],
    education: educationRecords,
    certifications: certificationRecords,
    skillCategories,
  }
}

describe('professional content public rendering boundary', () => {
  it('renders only eligible sentinels through the public projection and server render path', () => {
    const { html, serialized } = renderProfessionalContentFixture(testSource())
    const publicOutput = `${html}\n${serialized}\n${JSON.stringify(siteMetadata)}`

    expect(publicOutput).toContain('SENTINEL_VERIFIED_APPROVED_VISIBLE')
    expect(publicOutput).not.toContain('SENTINEL_VERIFIED_UNAPPROVED_HIDDEN')
    expect(publicOutput).not.toContain('SENTINEL_UNVERIFIED_APPROVED_HIDDEN')
    expect(publicOutput).not.toContain('SENTINEL_UNVERIFIED_UNAPPROVED_HIDDEN')
    expect(publicOutput).not.toContain('SENTINEL_UNAPPROVED_RECORD_HIDDEN')
    expect(publicOutput).not.toContain('SENTINEL_UNAPPROVED_RECORD_ID_HIDDEN')
    expect(publicOutput).not.toContain('owner-confirmed')
    expect(publicOutput).not.toContain('unverified')
    expect(publicOutput).not.toContain('unapproved')
  })
})
