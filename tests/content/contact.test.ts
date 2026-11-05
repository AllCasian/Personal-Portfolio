import { describe, expect, it } from 'vitest'
import { contactRecord } from '@/content/contact'
import { getPublishedContactProfile } from '@/lib/contact-content'
import { sections } from '@/content/sections'

describe('approved contact source', () => {
  it('contains only the four owner-confirmed public values', () => {
    expect(contactRecord.publicationStatus).toBe('approved')
    expect(contactRecord.fields.ownerName.value).toBe('Casian Criste')
    expect(contactRecord.fields.email.value).toBe('cristecasian@gmail.com')
    expect(contactRecord.fields.githubUrl.value).toBe('https://github.com/AllCasian')
    expect(contactRecord.fields.linkedinUrl.value).toBe(
      'https://www.linkedin.com/in/casian-criste-b65582263/',
    )

    for (const field of Object.values(contactRecord.fields)) {
      expect(field.verification).toEqual({ status: 'verified', source: 'owner-confirmed' })
      expect(field.publication).toEqual({ status: 'approved' })
    }
    expect(Object.keys(contactRecord.fields)).toEqual([
      'ownerName',
      'email',
      'githubUrl',
      'linkedinUrl',
    ])
  })

  it('preserves the exact approved profile destinations without rewriting them', () => {
    const profile = getPublishedContactProfile()

    expect(profile).toEqual({
      ownerName: 'Casian Criste',
      email: 'cristecasian@gmail.com',
      githubUrl: 'https://github.com/AllCasian',
      linkedinUrl: 'https://www.linkedin.com/in/casian-criste-b65582263/',
    })
    for (const destination of [profile.githubUrl, profile.linkedinUrl]) {
      expect(destination).toMatch(/^https:\/\//)
      expect(new URL(destination ?? '').protocol).toBe('https:')
    }
    expect(profile).not.toHaveProperty('phone')
    expect(profile).not.toHaveProperty('address')
    expect(profile).not.toHaveProperty('twitterUrl')
    expect(profile).not.toHaveProperty('instagramUrl')
    expect(profile).not.toHaveProperty('resumeUrl')
  })

  it('retains exactly one Contact section entry at the existing destination', () => {
    const matchingSections = sections.filter((section) => section.id === 'contact')

    expect(matchingSections).toHaveLength(1)
    expect(matchingSections[0]).toMatchObject({ id: 'contact', title: 'Contact', state: 'content' })
  })
})
