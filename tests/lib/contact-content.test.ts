import { describe, expect, it } from 'vitest'
import type { ContactField, ContactSourceRecord } from '@/content/contact-types'
import { projectPublicContact } from '@/lib/contact-content'

const privateDetails = {
  ownerName: 'OWNER_NAME_PRIVATE_SENTINEL',
  email: 'EMAIL_PRIVATE_SENTINEL@example.invalid',
  githubUrl: 'https://github.com/private-sentinel',
  linkedinUrl: 'https://www.linkedin.com/in/private-sentinel/',
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
  },
): ContactSourceRecord {
  return { id: 'portfolio-owner-contact', publicationStatus, fields }
}

describe('projectPublicContact', () => {
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
