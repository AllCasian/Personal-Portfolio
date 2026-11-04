import { describe, expect, it } from 'vitest'
import type {
  ContentField,
  ProfessionalContentSource,
  PublicationApprovalStatus,
  VerificationStatus,
} from '@/content/experience-education-skills-types'
import { certificationRecords, educationRecords } from '@/content/education'
import { experienceRecords } from '@/content/experience'
import { skillCategories } from '@/content/skills'
import {
  getPublishedProfessionalContent,
  validateProfessionalContentSource,
} from '@/lib/professional-content'

function field<T>(
  value: T,
  verificationStatus: VerificationStatus,
  publicationStatus: PublicationApprovalStatus,
): ContentField<T> {
  return {
    value,
    verification: {
      status: verificationStatus,
      ...(verificationStatus === 'verified' ? { source: 'owner-confirmed' as const } : {}),
    },
    publication: { status: publicationStatus },
  }
}

function sourceWithExperience(
  experience: ProfessionalContentSource['experience'],
): ProfessionalContentSource {
  return {
    experience,
    education: educationRecords,
    certifications: certificationRecords,
    skillCategories,
  }
}

describe('professional public projection', () => {
  it.each([
    ['verified and approved', 'verified', 'approved', true],
    ['verified and unapproved', 'verified', 'unapproved', false],
    ['unverified and approved', 'unverified', 'approved', false],
    ['unverified and unapproved', 'unverified', 'unapproved', false],
  ] as const)(
    'includes a contribution only when it is %s',
    (_label, verificationStatus, publicationStatus, isPublic) => {
      const sentinel = `SENTINEL_${verificationStatus}_${publicationStatus}_CONTRIBUTION`
      const base = experienceRecords[0]
      const candidate = {
        ...base,
        fields: {
          ...base.fields,
          contributions: [field(sentinel, verificationStatus, publicationStatus)],
        },
      }
      const published = getPublishedProfessionalContent(sourceWithExperience([candidate]))
      const output = JSON.stringify(published)

      expect(output.includes(sentinel)).toBe(isPublic)
      expect(published.experience[0].contributions.includes(sentinel)).toBe(isPublic)
      expect(output).not.toContain('"verification"')
      expect(output).not.toContain('"publication"')
      expect(output).not.toContain('owner-confirmed')
    },
  )

  it('withholds a draft record even when all fields are verified and approved', () => {
    const sentinel = 'SENTINEL_DRAFT_EXPERIENCE'
    const base = experienceRecords[0]
    const draft = {
      ...base,
      publicationStatus: 'draft' as const,
      fields: {
        ...base.fields,
        organization: field(sentinel, 'verified', 'approved'),
        program: field('Dava.X Trainee Program', 'verified', 'approved'),
      },
    }
    const published = getPublishedProfessionalContent(sourceWithExperience([draft]))
    expect(JSON.stringify(published)).not.toContain(sentinel)
    expect(published.experience).toEqual([])
  })

  it('rejects duplicate records and malformed verification metadata', () => {
    expect(() =>
      validateProfessionalContentSource(
        sourceWithExperience([experienceRecords[0], experienceRecords[0]]),
      ),
    ).toThrow(/Duplicate/)

    const invalid = {
      ...experienceRecords[0],
      fields: {
        ...experienceRecords[0].fields,
        role: {
          ...experienceRecords[0].fields.role,
          verification: { status: 'verified' as const },
        },
      },
    }
    expect(() => validateProfessionalContentSource(sourceWithExperience([invalid]))).toThrow(
      /Invalid professional content field/,
    )
  })
})
