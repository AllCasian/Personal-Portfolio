import { certificationRecords, educationRecords } from '@/content/education'
import { experienceRecords } from '@/content/experience'
import { skillCategories } from '@/content/skills'
import {
  getPublishedProfessionalContent,
  validateProfessionalContentSource,
} from '@/lib/professional-content'

const expectedSkills = [
  [
    'Programming Languages',
    [
      'Python',
      'Java',
      'JavaScript',
      'TypeScript',
      'C/C++',
      'Kotlin',
      'PL/SQL',
      'VHDL',
      'Assembly',
      'HTML/CSS',
    ],
  ],
  [
    'Frontend & Mobile',
    ['React', 'Next.js', 'Angular', 'React Native', 'Expo', 'Tailwind CSS', 'NativeWind'],
  ],
  ['Backend', ['Node.js', 'Express', 'Spring Boot', 'Flask']],
  ['Databases', ['PostgreSQL', 'MySQL', 'MongoDB']],
  ['DevOps & Infrastructure', ['Docker', 'Traefik', 'Nginx', 'Linux', 'RabbitMQ']],
  ['Additional Technologies & Tools', ['Git', 'OpenGL', 'OpenCV', 'Arduino']],
] as const

describe('Feature 004 professional content', () => {
  it('contains the exact two experience entries in reverse chronological order', () => {
    expect(experienceRecords.map(({ id }) => id)).toEqual([
      'endava-junior-data-engineer',
      'core-elevating-media-software-engineer-intern',
    ])

    const [endava, core] = experienceRecords
    expect(endava.fields).toMatchObject({
      organization: { value: 'Endava' },
      role: { value: 'Junior Data Engineer' },
      program: { value: 'Dava.X Trainee Program' },
      startDate: { value: { month: 6, year: 2026 } },
      endDate: { value: { month: 10, year: 2026 } },
      status: { value: 'former' },
      location: { value: 'Cluj-Napoca, Romania' },
    })
    expect(core.fields).toMatchObject({
      organization: { value: 'Core Elevating Media' },
      role: { value: 'Software Engineer Intern' },
      startDate: { value: { month: 7, year: 2024 } },
      endDate: { value: { month: 8, year: 2024 } },
      status: { value: 'internship' },
      location: { value: 'Remote' },
    })
    expect(JSON.stringify(endava)).not.toMatch(
      /commercial client|production owner|independent assignment/i,
    )
  })

  it('contains the two education entries and three credentials with unknown values omitted', () => {
    expect(educationRecords.map(({ id }) => id)).toEqual([
      'technical-university-of-cluj-napoca',
      'liceul-teoretic-ioan-buteanu',
    ])
    expect(educationRecords[0].fields).toMatchObject({
      institution: { value: 'Technical University of Cluj-Napoca' },
      qualification: { value: 'Bachelor of Engineering' },
      fieldOfStudy: { value: 'Computer Engineering' },
      startDate: { value: { month: 10, year: 2021 } },
      endDate: { value: { month: 7, year: 2025 } },
      completionStatus: { value: 'graduated' },
    })
    expect('startDate' in educationRecords[1].fields).toBe(false)
    expect('endDate' in educationRecords[1].fields).toBe(false)
    expect(certificationRecords.map(({ fields }) => fields.name.value)).toEqual([
      'LLM Performance Engineering',
      'GenAI Essentials for Everyone',
      'Social Enterprise Manager',
    ])
    expect(
      certificationRecords.map(({ fields }) =>
        'issuer' in fields ? fields.issuer.value : undefined,
      ),
    ).toEqual(["O'Reilly", "O'Reilly", undefined])
  })

  it('contains each of the 33 CV-listed skills once in the fixed category and item order', () => {
    const actual = skillCategories.map(({ fields }) => [
      fields.name.value,
      fields.skills.map(({ fields: skillFields }) => skillFields.name.value),
    ])
    expect(actual).toEqual(expectedSkills)
    const names = actual.flatMap(([, items]) => items as readonly string[])
    expect(names).toHaveLength(33)
    expect(new Set(names).size).toBe(33)
  })

  it('validates source records and produces a public projection without workflow metadata', () => {
    const source = {
      experience: experienceRecords,
      education: educationRecords,
      certifications: certificationRecords,
      skillCategories,
    }
    expect(() => validateProfessionalContentSource(source)).not.toThrow()

    const published = getPublishedProfessionalContent(source)
    expect(published.experience.map(({ organization }) => organization)).toEqual([
      'Endava',
      'Core Elevating Media',
    ])
    expect(published.education).toHaveLength(2)
    expect(published.certifications).toHaveLength(3)
    expect(published.skillCategories.flatMap(({ skills }) => skills)).toHaveLength(33)
    expect(JSON.stringify(published)).not.toMatch(
      /verification|publication|approved|unverified|owner-confirmed/,
    )
  })

  it('omits an entire Endava record if its program attribution is not public', () => {
    const source = {
      experience: [
        {
          ...experienceRecords[0],
          fields: { ...experienceRecords[0].fields, program: undefined },
        },
        experienceRecords[1],
      ],
      education: educationRecords,
      certifications: certificationRecords,
      skillCategories,
    }
    const published = getPublishedProfessionalContent(source)
    expect(published.experience.map(({ organization }) => organization)).toEqual([
      'Core Elevating Media',
    ])
  })
})
