import type { ProjectField, ProjectRecord } from './project-types'

function confirmed<T>(value: T): ProjectField<T> {
  return {
    value,
    verification: { status: 'verified', source: 'owner-confirmed' },
    publication: { status: 'approved' },
  }
}

export const projectGroups = [
  {
    category: 'dava-x',
    title: 'Professional Projects',
    categoryLabel: 'Dava.X Trainee Program',
    organization: 'Endava',
  },
  {
    category: 'academic',
    title: 'Academic Projects',
    categoryLabel: 'Academic Projects',
    organization: 'Technical University of Cluj-Napoca (UTCN)',
  },
  {
    category: 'personal',
    title: 'Personal Projects',
    categoryLabel: 'Personal Projects',
  },
] as const
export type ProjectGroup = (typeof projectGroups)[number]

export const projects: readonly ProjectRecord[] = [
  {
    id: 'drivewise',
    publicationStatus: 'approved',
    slug: confirmed('drivewise'),
    title: confirmed('Drivewise'),
    category: confirmed('dava-x'),
    attribution: confirmed({ organization: 'Endava', program: 'Dava.X Trainee Program' }),
    summary: confirmed(
      'Hands-on software engineering project completed during the Dava.X Trainee Program at Endava.',
    ),
  },
  {
    id: 'smart-librarian',
    publicationStatus: 'approved',
    slug: confirmed('smart-librarian'),
    title: confirmed('Smart Librarian'),
    category: confirmed('dava-x'),
    attribution: confirmed({ organization: 'Endava', program: 'Dava.X Trainee Program' }),
    summary: confirmed(
      'Hands-on software engineering project completed during the Dava.X Trainee Program at Endava.',
    ),
  },
  {
    id: 'etl-pipeline',
    publicationStatus: 'approved',
    slug: confirmed('etl-pipeline'),
    title: confirmed('ETL Pipeline'),
    category: confirmed('dava-x'),
    attribution: confirmed({ organization: 'Endava', program: 'Dava.X Trainee Program' }),
    summary: confirmed(
      'Hands-on software engineering project completed during the Dava.X Trainee Program at Endava.',
    ),
  },
  {
    id: 'automatic-guitar-tuner',
    publicationStatus: 'approved',
    slug: confirmed('automatic-guitar-tuner'),
    title: confirmed('Automatic Guitar Tuner'),
    category: confirmed('academic'),
    attribution: confirmed({ organization: 'Technical University of Cluj-Napoca (UTCN)' }),
    summary: confirmed(
      'An academic hardware and software project for automatic guitar tuning using frequency detection and motor-controlled tuning mechanisms.',
    ),
  },
  {
    id: 'energy-management-system',
    publicationStatus: 'approved',
    slug: confirmed('energy-management-system'),
    title: confirmed('Energy Management System'),
    category: confirmed('academic'),
    attribution: confirmed({ organization: 'Technical University of Cluj-Napoca (UTCN)' }),
    summary: confirmed(
      'An academic distributed software application focused on energy monitoring and device management.',
    ),
  },
  {
    id: 'ai-recipe',
    publicationStatus: 'approved',
    slug: confirmed('ai-recipe'),
    title: confirmed('AI Recipe'),
    category: confirmed('personal'),
  },
]
