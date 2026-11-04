import type { ContentField, ExperienceRecord } from './experience-education-skills-types'

function confirmed<T>(value: T): ContentField<T> {
  return {
    value,
    verification: { status: 'verified', source: 'owner-confirmed' },
    publication: { status: 'approved' },
  }
}

export const experienceRecords = [
  {
    id: 'endava-junior-data-engineer',
    publicationStatus: 'approved',
    fields: {
      organization: confirmed('Endava'),
      role: confirmed('Junior Data Engineer'),
      program: confirmed('Dava.X Trainee Program'),
      startDate: confirmed({ month: 6, year: 2026 }),
      endDate: confirmed({ month: 10, year: 2026 }),
      status: confirmed('former'),
      location: confirmed('Cluj-Napoca, Romania'),
      contributions: [
        confirmed(
          'Worked with SQL, PL/SQL, RDBMS, data modeling, ETL pipelines, and data transformation.',
        ),
        confirmed(
          'Explored Python and Generative AI topics including RAG, embeddings, function calling, and prompt engineering.',
        ),
        confirmed('Studied foundational Data Science and Machine Learning concepts.'),
        confirmed('Used Git, GitHub, and GitLab in collaborative development workflows.'),
        confirmed('Built with Next.js, React, TypeScript, and Tailwind CSS.'),
        confirmed(
          'Gained exposure to DevOps, Cloud, Agile/Scrum, ITIL, and software delivery processes.',
        ),
      ],
    },
  },
  {
    id: 'core-elevating-media-software-engineer-intern',
    publicationStatus: 'approved',
    fields: {
      organization: confirmed('Core Elevating Media'),
      role: confirmed('Software Engineer Intern'),
      startDate: confirmed({ month: 7, year: 2024 }),
      endDate: confirmed({ month: 8, year: 2024 }),
      status: confirmed('internship'),
      location: confirmed('Remote'),
      contributions: [
        confirmed('Developed full-stack software using React, Node.js, Express, and SQL.'),
        confirmed(
          'Built responsive user interfaces and integrated REST APIs with JWT authentication.',
        ),
        confirmed('Wrote unit, integration, and end-to-end tests using Jest and Cypress.'),
        confirmed('Collaborated using Git and Jenkins CI.'),
      ],
    },
  },
] as const satisfies readonly ExperienceRecord[]
