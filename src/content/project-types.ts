export const projectIds = [
  'drivewise',
  'smart-librarian',
  'etl-pipeline',
  'automatic-guitar-tuner',
  'energy-management-system',
  'ai-recipe',
] as const

export type ProjectId = (typeof projectIds)[number]

export const projectSlugs = projectIds
export type ProjectSlug = (typeof projectSlugs)[number]

export const projectCategoryKeys = ['dava-x', 'academic', 'personal'] as const
export const projectCategories = projectCategoryKeys
export type ProjectCategory = (typeof projectCategoryKeys)[number]

export type VerificationSource = 'owner-confirmed' | 'approved-project-documentation'
export type VerificationStatus = 'unverified' | 'verified'
export type PublicationApprovalStatus = 'unapproved' | 'approved'
export type RecordPublicationStatus = 'draft' | 'approved'

export interface ProjectField<T> {
  readonly value: T
  readonly verification: {
    readonly status: VerificationStatus
    readonly source?: VerificationSource
  }
  readonly publication: {
    readonly status: PublicationApprovalStatus
    readonly reviewedOn?: string
  }
}

export interface ProjectAttribution {
  readonly organization: string
  readonly program?: string
}

export interface ProjectMedia {
  readonly src: `/projects/${string}`
  readonly width: number
  readonly height: number
  readonly alt: string
  readonly decorative?: boolean
}

export interface ProjectExternalLink {
  readonly kind: 'github' | 'live-demo'
  readonly href: `https://${string}`
  readonly label: string
}

export interface ProjectCaseStudy {
  readonly overview?: ProjectField<string>
  readonly motivation?: ProjectField<string>
  readonly solution?: ProjectField<string>
  readonly features?: ProjectField<readonly string[]>
  readonly architecture?: ProjectField<string>
  readonly challenges?: ProjectField<readonly string[]>
  readonly contributions?: ProjectField<readonly string[]>
}

export interface ProjectRecord {
  readonly id: ProjectId
  readonly publicationStatus: RecordPublicationStatus
  readonly slug: ProjectField<ProjectSlug>
  readonly title: ProjectField<string>
  readonly category: ProjectField<ProjectCategory>
  readonly attribution?: ProjectField<ProjectAttribution>
  readonly summary?: ProjectField<string>
  readonly technologies?: readonly ProjectField<string>[]
  readonly caseStudy?: ProjectCaseStudy
  readonly media?: readonly ProjectField<ProjectMedia>[]
  readonly links?: readonly ProjectField<ProjectExternalLink>[]
}

export interface PublishedProject {
  readonly id: ProjectId
  readonly slug: ProjectSlug
  readonly title: string
  readonly category: ProjectCategory
  readonly attribution?: ProjectAttribution
  readonly summary?: string
  readonly technologies?: readonly string[]
  readonly caseStudy?: {
    readonly overview?: string
    readonly motivation?: string
    readonly solution?: string
    readonly features?: readonly string[]
    readonly architecture?: string
    readonly challenges?: readonly string[]
    readonly contributions?: readonly string[]
  }
  readonly media?: readonly ProjectMedia[]
  readonly links?: readonly ProjectExternalLink[]
}
