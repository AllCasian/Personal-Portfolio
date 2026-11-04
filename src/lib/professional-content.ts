import { certificationRecords, educationRecords } from '@/content/education'
import { experienceRecords } from '@/content/experience'
import type {
  CertificationRecord,
  ContentField,
  EducationRecord,
  ExperienceRecord,
  MonthYear,
  ProfessionalContentSource,
  PublishedCertification,
  PublishedEducation,
  PublishedExperience,
  PublishedProfessionalContent,
  PublishedSkillCategory,
  RecordPublicationStatus,
  SkillCategoryRecord,
  SkillRecord,
  VerificationSource,
  VerificationStatus,
  PublicationApprovalStatus,
} from '@/content/experience-education-skills-types'
import { skillCategories } from '@/content/skills'

const verificationSources: readonly VerificationSource[] = [
  'owner-confirmed',
  'supporting-documentation',
]
const verificationStatuses: readonly VerificationStatus[] = ['unverified', 'verified']
const approvalStatuses: readonly PublicationApprovalStatus[] = ['unapproved', 'approved']
const recordStatuses: readonly RecordPublicationStatus[] = ['draft', 'approved']

const professionalContentSource: ProfessionalContentSource = {
  experience: experienceRecords,
  education: educationRecords,
  certifications: certificationRecords,
  skillCategories,
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isContentField(value: unknown): value is ContentField<unknown> {
  if (!isObject(value) || !('value' in value)) return false
  if (!isObject(value.verification) || !isObject(value.publication)) return false

  const verification = value.verification
  const publication = value.publication
  const validVerificationStatus = verificationStatuses.includes(
    verification.status as VerificationStatus,
  )
  const validSource = verificationSources.includes(verification.source as VerificationSource)
  const validPublicationStatus = approvalStatuses.includes(
    publication.status as PublicationApprovalStatus,
  )

  return (
    validVerificationStatus &&
    validPublicationStatus &&
    (verification.status !== 'verified' || validSource) &&
    (verification.source === undefined || validSource)
  )
}

function assertField(value: unknown, path: string, optional = false): void {
  if (value === undefined && optional) return
  if (!isContentField(value)) throw new Error(`Invalid professional content field: ${path}`)
}

function assertRecordHeader(
  value: unknown,
  path: string,
): asserts value is {
  id: string
  publicationStatus: RecordPublicationStatus
  fields: Record<string, unknown>
} {
  if (
    !isObject(value) ||
    typeof value.id !== 'string' ||
    value.id.trim().length === 0 ||
    !recordStatuses.includes(value.publicationStatus as RecordPublicationStatus) ||
    !isObject(value.fields)
  ) {
    throw new Error(`Invalid professional content record: ${path}`)
  }
}

function assertUniqueRecordIds(records: readonly unknown[], path: string): void {
  const ids = new Set<string>()
  records.forEach((record, index) => {
    assertRecordHeader(record, `${path}[${index}]`)
    if (ids.has(record.id)) throw new Error(`Duplicate professional content id: ${record.id}`)
    ids.add(record.id)
  })
}

function validMonthYear(value: MonthYear): boolean {
  return (
    isObject(value) &&
    Number.isInteger(value.month) &&
    value.month >= 1 &&
    value.month <= 12 &&
    Number.isInteger(value.year) &&
    value.year > 0
  )
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function publicText(field: ContentField<string> | undefined): string | undefined {
  if (!field || !isPublicField(field) || !hasText(field.value)) return undefined
  return field.value.trim()
}

function publicMonthYear(field: ContentField<MonthYear> | undefined): MonthYear | undefined {
  if (!field || !isPublicField(field) || !validMonthYear(field.value)) return undefined
  return { month: field.value.month, year: field.value.year }
}

function isPublicField<T>(field: ContentField<T> | undefined): field is ContentField<T> {
  return Boolean(
    field &&
    isContentField(field) &&
    field.verification.status === 'verified' &&
    field.publication.status === 'approved',
  )
}

export function validateProfessionalContentSource(source: ProfessionalContentSource): void {
  const collections: readonly [string, readonly unknown[]][] = [
    ['experience', source.experience],
    ['education', source.education],
    ['certifications', source.certifications],
    ['skill categories', source.skillCategories],
  ]

  for (const [name, records] of collections) {
    if (!Array.isArray(records)) throw new Error(`Professional content ${name} must be an array`)
    assertUniqueRecordIds(records, name)
  }

  for (const [index, record] of source.experience.entries()) {
    const path = `experience[${index}]`
    const fields = record.fields
    assertField(fields.organization, `${path}.organization`)
    assertField(fields.role, `${path}.role`)
    assertField(fields.program, `${path}.program`, true)
    assertField(fields.startDate, `${path}.startDate`)
    assertField(fields.endDate, `${path}.endDate`)
    assertField(fields.status, `${path}.status`)
    assertField(fields.location, `${path}.location`, true)
    if (fields.contributions !== undefined) {
      if (!Array.isArray(fields.contributions)) {
        throw new Error(`Invalid professional content field: ${path}.contributions`)
      }
      fields.contributions.forEach((field, fieldIndex) =>
        assertField(field, `${path}.contributions[${fieldIndex}]`),
      )
    }
  }

  for (const [index, record] of source.education.entries()) {
    const path = `education[${index}]`
    const fields = record.fields
    assertField(fields.institution, `${path}.institution`)
    assertField(fields.fieldOfStudy, `${path}.fieldOfStudy`)
    assertField(fields.qualification, `${path}.qualification`, true)
    assertField(fields.startDate, `${path}.startDate`, true)
    assertField(fields.endDate, `${path}.endDate`, true)
    assertField(fields.location, `${path}.location`, true)
    assertField(fields.completionStatus, `${path}.completionStatus`)
  }

  for (const [index, record] of source.certifications.entries()) {
    const path = `certifications[${index}]`
    assertField(record.fields.name, `${path}.name`)
    assertField(record.fields.issuer, `${path}.issuer`, true)
  }

  const skillIds = new Set<string>()
  for (const [categoryIndex, category] of source.skillCategories.entries()) {
    const path = `skillCategories[${categoryIndex}]`
    assertField(category.fields.name, `${path}.name`)
    if (!Array.isArray(category.fields.skills)) {
      throw new Error(`Invalid skill list: ${path}.skills`)
    }
    for (const [skillIndex, skill] of category.fields.skills.entries()) {
      assertRecordHeader(skill, `${path}.skills[${skillIndex}]`)
      if (skillIds.has(skill.id)) throw new Error(`Duplicate professional content id: ${skill.id}`)
      skillIds.add(skill.id)
      assertField(skill.fields.name, `${path}.skills[${skillIndex}].name`)
    }
  }
}

function toPublishedExperience(record: ExperienceRecord): PublishedExperience | undefined {
  if (record.publicationStatus !== 'approved') return undefined

  const organization = publicText(record.fields.organization)
  const role = publicText(record.fields.role)
  const startDate = publicMonthYear(record.fields.startDate)
  const endDate = publicMonthYear(record.fields.endDate)
  const statusField = record.fields.status
  const status = isPublicField(statusField) ? statusField.value : undefined
  const program = publicText(record.fields.program)

  if (!organization || !role || !startDate || !endDate || !status) return undefined
  if (organization === 'Endava' && program !== 'Dava.X Trainee Program') return undefined

  const location = publicText(record.fields.location)
  const contributions = (record.fields.contributions ?? [])
    .map(publicText)
    .filter((value): value is string => value !== undefined)

  return {
    id: record.id,
    organization,
    role,
    startDate,
    endDate,
    status,
    contributions,
    ...(program ? { program } : {}),
    ...(location ? { location } : {}),
  }
}

function toPublishedEducation(record: EducationRecord): PublishedEducation | undefined {
  if (record.publicationStatus !== 'approved') return undefined

  const institution = publicText(record.fields.institution)
  const fieldOfStudy = publicText(record.fields.fieldOfStudy)
  const completionStatus = record.fields.completionStatus
  if (!institution || !fieldOfStudy || !isPublicField(completionStatus)) return undefined

  const qualification = publicText(record.fields.qualification)
  const startDate = publicMonthYear(record.fields.startDate)
  const endDate = publicMonthYear(record.fields.endDate)
  const location = publicText(record.fields.location)

  return {
    id: record.id,
    institution,
    fieldOfStudy,
    completionStatus: completionStatus.value,
    ...(qualification ? { qualification } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    ...(location ? { location } : {}),
  }
}

function toPublishedCertification(record: CertificationRecord): PublishedCertification | undefined {
  if (record.publicationStatus !== 'approved') return undefined
  const name = publicText(record.fields.name)
  if (!name) return undefined

  const issuer = publicText(record.fields.issuer)
  return { id: record.id, name, ...(issuer ? { issuer } : {}) }
}

function toPublishedSkillCategory(record: SkillCategoryRecord): PublishedSkillCategory | undefined {
  if (record.publicationStatus !== 'approved') return undefined
  const name = publicText(record.fields.name)
  if (!name) return undefined

  const skills = record.fields.skills.flatMap((skill: SkillRecord) => {
    if (skill.publicationStatus !== 'approved') return []
    const skillName = publicText(skill.fields.name)
    return skillName ? [skillName] : []
  })

  if (skills.length === 0) return undefined
  return { id: record.id, name, skills }
}

export function getPublishedProfessionalContent(
  source: ProfessionalContentSource = professionalContentSource,
): PublishedProfessionalContent {
  validateProfessionalContentSource(source)

  return {
    experience: source.experience.flatMap((record) => {
      const published = toPublishedExperience(record)
      return published ? [published] : []
    }),
    education: source.education.flatMap((record) => {
      const published = toPublishedEducation(record)
      return published ? [published] : []
    }),
    certifications: source.certifications.flatMap((record) => {
      const published = toPublishedCertification(record)
      return published ? [published] : []
    }),
    skillCategories: source.skillCategories.flatMap((record) => {
      const published = toPublishedSkillCategory(record)
      return published ? [published] : []
    }),
  }
}
