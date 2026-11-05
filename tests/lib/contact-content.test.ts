import { describe, expect, it } from 'vitest'
import type { ContactField, ContactSourceRecord } from '@/content/contact-types'
import { projectPublicContact } from '@/lib/contact-content'

const privateDetails = {
  ownerName: 'OWNER_NAME_PRIVATE_SENTINEL',
  email: 'EMAIL_PRIVATE_SENTINEL@example.invalid',
  githubUrl: 'https://github.com/private-sentinel',
  linkedinUrl: 'https://www.linkedin.com/in/private-sentinel/',
  instagramUrl: 'https://www.instagram.com/private-sentinel',
} as const

function field<T>(
  value: T,
  verification: ContactField<T>['verification']['status'],
  publication: ContactField<T>['publication']['status'],
): ContactField<T> {
  return {
    value,
    verification: {
      status: verification,
      ...(verification === 'verified' ? { source: 'owner-confirmed' as const } : {}),
    },
    publication: { status: publication },
  }
}

function record(
  publicationStatus: ContactSourceRecord['publicationStatus'] = 'approved',
  fields: ContactSourceRecord['fields'] = {
    ownerName: field<string>(privateDetails.ownerName, 'verified', 'approved'),
    email: field<string>(privateDetails.email, 'verified', 'approved'),
    githubUrl: field<string>(privateDetails.githubUrl, 'verified', 'approved'),
    linkedinUrl: field<string>(privateDetails.linkedinUrl, 'verified', 'approved'),
    instagramUrl: field<string>(privateDetails.instagramUrl, 'verified', 'approved'),
  },
): ContactSourceRecord {
  return { id: 'portfolio-owner-contact', publicationStatus, fields }
}

describe('projectPublicContact', () => {
  it('projects Instagram only when its approved-record field is verified and publication approved', () => {
    const source = record('approved', {
      ...record().fields,
      instagramUrl: field(privateDetails.instagramUrl, 'verified', 'approved'),
    })

    expect(projectPublicContact(source)).toHaveProperty('instagramUrl', privateDetails.instagramUrl)
  })

  it.each([
    ['unverified', 'approved'],
    ['verified', 'unapproved'],
  ] as const)(
    'omits Instagram when factual verification is %s and publication is %s',
    (verification, publication) => {
      const source = record('approved', {
        ...record().fields,
        instagramUrl: field(privateDetails.instagramUrl, verification, publication),
      })

      const projected = projectPublicContact(source)
      expect(projected).not.toHaveProperty('instagramUrl')
      expect(JSON.stringify(projected)).not.toContain(privateDetails.instagramUrl)
    },
  )

  it('publishes only a verified and approved field on an approved record', () => {
    const source = record('approved', {
      ownerName: field('Casian Criste', 'verified', 'approved'),
      email: field(privateDetails.email, 'verified', 'unapproved'),
      githubUrl: field(privateDetails.githubUrl, 'unverified', 'approved'),
      linkedinUrl: field(privateDetails.linkedinUrl, 'unverified', 'unapproved'),
    })

    const published = projectPublicContact(source)

    expect(published).toEqual({ ownerName: 'Casian Criste' })
    expect(JSON.stringify(published)).not.toContain(privateDetails.email)
    expect(JSON.stringify(published)).not.toContain(privateDetails.githubUrl)
    expect(JSON.stringify(published)).not.toContain(privateDetails.linkedinUrl)
    expect(published).not.toHaveProperty('publicationStatus')
    expect(published).not.toHaveProperty('verification')
    expect(published).not.toHaveProperty('publication')
  })

  it('excludes all individually eligible values when the record is unpublished', () => {
    const published = projectPublicContact(record('draft'))

    expect(published).toEqual({})
    for (const value of Object.values(privateDetails)) {
      expect(JSON.stringify(published)).not.toContain(value)
    }
  })
})
