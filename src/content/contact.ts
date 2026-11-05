import type { ContactField, ContactSourceRecord } from './contact-types'

function ownerConfirmed<T>(value: T): ContactField<T> {
  return {
    value,
    verification: { status: 'verified', source: 'owner-confirmed' },
    publication: { status: 'approved' },
  }
}

export const contactRecord = {
  id: 'portfolio-owner-contact',
  publicationStatus: 'approved',
  fields: {
    ownerName: ownerConfirmed('Casian Criste'),
    email: ownerConfirmed('cristecasian@gmail.com'),
    githubUrl: ownerConfirmed('https://github.com/AllCasian'),
    linkedinUrl: ownerConfirmed('https://www.linkedin.com/in/casian-criste-b65582263/'),
    instagramUrl: ownerConfirmed('https://www.instagram.com/casiancriste'),
  },
} as const satisfies ContactSourceRecord
