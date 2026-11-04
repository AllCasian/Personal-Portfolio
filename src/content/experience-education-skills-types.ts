export type VerificationStatus = 'unverified' | 'verified'
export type VerificationSource = 'owner-confirmed' | 'supporting-documentation'
export type PublicationApprovalStatus = 'unapproved' | 'approved'
export type RecordPublicationStatus = 'draft' | 'approved'

export interface ContentField<T> {
  readonly value: T
  readonly verification: {
    readonly status: VerificationStatus
    readonly source?: VerificationSource
  }
  readonly publication: {
    readonly status: PublicationApprovalStatus
  }
}

export interface ContentRecord<TFields> {
  readonly id: string
  readonly publicationStatus: RecordPublicationStatus
  readonly fields: TFields
}

export interface MonthYear {
  readonly month: number
  readonly year: number
}

export interface ExperienceFields {
  readonly organization: ContentField<string>
  readonly role: ContentField<string>
  readonly program?: ContentField<string>
  readonly startDate: ContentField<MonthYear>
  readonly endDate: ContentField<MonthYear>
  readonly status: ContentField<'former' | 'internship'>
  readonly location?: ContentField<string>
  readonly contributions?: readonly ContentField<string>[]
}

export type ExperienceRecord = ContentRecord<ExperienceFields>

export interface EducationFields {
  readonly institution: ContentField<string>
  readonly fieldOfStudy: ContentField<string>
  readonly qualification?: ContentField<string>
  readonly startDate?: ContentField<MonthYear>
  readonly endDate?: ContentField<MonthYear>
  readonly location?: ContentField<string>
  readonly completionStatus: ContentField<'graduated'>
}

export type EducationRecord = ContentRecord<EducationFields>

export interface CertificationFields {
  readonly name: ContentField<string>
  readonly issuer?: ContentField<string>
}

export type CertificationRecord = ContentRecord<CertificationFields>

export interface SkillFields {
  readonly name: ContentField<string>
}

export type SkillRecord = ContentRecord<SkillFields>

export interface SkillCategoryFields {
  readonly name: ContentField<string>
  readonly skills: readonly SkillRecord[]
}

export type SkillCategoryRecord = ContentRecord<SkillCategoryFields>

export interface PublishedExperience {
  readonly id: string
  readonly organization: string
  readonly role: string
  readonly program?: string
  readonly startDate: MonthYear
  readonly endDate: MonthYear
  readonly status: 'former' | 'internship'
  readonly location?: string
  readonly contributions: readonly string[]
}

export interface PublishedEducation {
  readonly id: string
  readonly institution: string
  readonly fieldOfStudy: string
  readonly qualification?: string
  readonly startDate?: MonthYear
  readonly endDate?: MonthYear
  readonly location?: string
  readonly completionStatus: 'graduated'
}

export interface PublishedCertification {
  readonly id: string
  readonly name: string
  readonly issuer?: string
}

export interface PublishedSkillCategory {
  readonly id: string
  readonly name: string
  readonly skills: readonly string[]
}

export interface ProfessionalContentSource {
  readonly experience: readonly ExperienceRecord[]
  readonly education: readonly EducationRecord[]
  readonly certifications: readonly CertificationRecord[]
  readonly skillCategories: readonly SkillCategoryRecord[]
}

export interface PublishedProfessionalContent {
  readonly experience: readonly PublishedExperience[]
  readonly education: readonly PublishedEducation[]
  readonly certifications: readonly PublishedCertification[]
  readonly skillCategories: readonly PublishedSkillCategory[]
}
