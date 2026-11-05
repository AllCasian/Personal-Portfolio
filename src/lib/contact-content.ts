import { contactRecord } from '@/content/contact'
import type {
  ContactField,
  ContactSourceRecord,
  PublicContactProfile,
} from '@/content/contact-types'

function isPublicField<T>(field: ContactField<T> | undefined): field is ContactField<T> {
  return Boolean(
    field && field.verification.status === 'verified' && field.publication.status === 'approved',
  )
}

function publicText(field: ContactField<string> | undefined): string | undefined {
  if (!field || !isPublicField(field) || field.value.trim().length === 0) return undefined
  return field.value
}

function publicHttpsUrl(field: ContactField<string> | undefined): string | undefined {
  const value = publicText(field)
  if (!value) return undefined

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return undefined
    return value
  } catch {
    return undefined
  }
}

export function projectPublicContact(record: ContactSourceRecord): PublicContactProfile {
  if (record.publicationStatus !== 'approved') return {}

  const ownerName = publicText(record.fields.ownerName)
  const email = publicText(record.fields.email)
  const githubUrl = publicHttpsUrl(record.fields.githubUrl)
  const linkedinUrl = publicHttpsUrl(record.fields.linkedinUrl)
  const instagramUrl = publicHttpsUrl(record.fields.instagramUrl)
  const cvUrl = publicHttpsUrl(record.fields.cvUrl)

  return {
    ...(ownerName ? { ownerName } : {}),
    ...(email ? { email } : {}),
    ...(githubUrl ? { githubUrl } : {}),
    ...(linkedinUrl ? { linkedinUrl } : {}),
    ...(instagramUrl ? { instagramUrl } : {}),
    ...(cvUrl ? { cvUrl } : {}),
  }
}

export function getPublishedContactProfile(): PublicContactProfile {
  return projectPublicContact(contactRecord)
}
