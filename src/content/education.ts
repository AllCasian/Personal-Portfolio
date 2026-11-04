import type {
  CertificationRecord,
  ContentField,
  EducationRecord,
} from './experience-education-skills-types'

function confirmed<T>(value: T): ContentField<T> {
  return {
    value,
    verification: { status: 'verified', source: 'owner-confirmed' },
    publication: { status: 'approved' },
  }
}

export const educationRecords = [
  {
    id: 'technical-university-of-cluj-napoca',
    publicationStatus: 'approved',
    fields: {
      institution: confirmed('Technical University of Cluj-Napoca'),
      qualification: confirmed('Bachelor of Engineering'),
      fieldOfStudy: confirmed('Computer Engineering'),
      startDate: confirmed({ month: 10, year: 2021 }),
      endDate: confirmed({ month: 7, year: 2025 }),
      location: confirmed('Cluj-Napoca, Romania'),
      completionStatus: confirmed('graduated'),
    },
  },
  {
    id: 'liceul-teoretic-ioan-buteanu',
    publicationStatus: 'approved',
    fields: {
      institution: confirmed('Liceul Teoretic "Ioan Buteanu"'),
      fieldOfStudy: confirmed('Mathematics and Computer Science'),
      location: confirmed('Somcuta Mare, Romania'),
      completionStatus: confirmed('graduated'),
    },
  },
] as const satisfies readonly EducationRecord[]

export const certificationRecords = [
  {
    id: 'llm-performance-engineering',
    publicationStatus: 'approved',
    fields: {
      name: confirmed('LLM Performance Engineering'),
      issuer: confirmed("O'Reilly"),
    },
  },
  {
    id: 'genai-essentials-for-everyone',
    publicationStatus: 'approved',
    fields: {
      name: confirmed('GenAI Essentials for Everyone'),
      issuer: confirmed("O'Reilly"),
    },
  },
  {
    id: 'social-enterprise-manager',
    publicationStatus: 'approved',
    fields: {
      name: confirmed('Social Enterprise Manager'),
    },
  },
] as const satisfies readonly CertificationRecord[]
