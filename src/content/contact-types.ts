export type VerificationStatus = 'unverified' | 'verified'
export type VerificationSource = 'owner-confirmed' | 'unverified'
export type PublicationApprovalStatus = 'unapproved' | 'approved'
export type RecordPublicationStatus = 'draft' | 'approved'

export interface ContactField<T> {
  readonly value: T
  readonly verification: {
    readonly status: VerificationStatus
    readonly source?: VerificationSource
  }
  readonly publication: {
    readonly status: PublicationApprovalStatus
  }
}

export interface ContactSourceRecord {
  readonly id: 'portfolio-owner-contact'
  readonly publicationStatus: RecordPublicationStatus
  readonly fields: {
    readonly ownerName: ContactField<string>
    readonly email: ContactField<string>
    readonly githubUrl: ContactField<string>
    readonly linkedinUrl: ContactField<string>
  }
}

export interface PublicContactProfile {
  readonly ownerName?: string
  readonly email?: string
  readonly githubUrl?: string
  readonly linkedinUrl?: string
}
