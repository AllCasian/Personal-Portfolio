import type {
  ContentField,
  SkillCategoryRecord,
  SkillRecord,
} from './experience-education-skills-types'

function confirmed<T>(value: T): ContentField<T> {
  return {
    value,
    verification: { status: 'verified', source: 'owner-confirmed' },
    publication: { status: 'approved' },
  }
}

function skill(id: string, name: string): SkillRecord {
  return {
    id,
    publicationStatus: 'approved',
    fields: { name: confirmed(name) },
  }
}

export const skillCategories = [
  {
    id: 'programming-languages',
    publicationStatus: 'approved',
    fields: {
      name: confirmed('Programming Languages'),
      skills: [
        skill('python', 'Python'),
        skill('java', 'Java'),
        skill('javascript', 'JavaScript'),
        skill('typescript', 'TypeScript'),
        skill('c-cpp', 'C/C++'),
        skill('kotlin', 'Kotlin'),
        skill('plsql', 'PL/SQL'),
        skill('vhdl', 'VHDL'),
        skill('assembly', 'Assembly'),
        skill('html-css', 'HTML/CSS'),
      ],
    },
  },
  {
    id: 'frontend-mobile',
    publicationStatus: 'approved',
    fields: {
      name: confirmed('Frontend & Mobile'),
      skills: [
        skill('react', 'React'),
        skill('nextjs', 'Next.js'),
        skill('angular', 'Angular'),
        skill('react-native', 'React Native'),
        skill('expo', 'Expo'),
        skill('tailwind-css', 'Tailwind CSS'),
        skill('nativewind', 'NativeWind'),
      ],
    },
  },
  {
    id: 'backend',
    publicationStatus: 'approved',
    fields: {
      name: confirmed('Backend'),
      skills: [
        skill('nodejs', 'Node.js'),
        skill('express', 'Express'),
        skill('spring-boot', 'Spring Boot'),
        skill('flask', 'Flask'),
      ],
    },
  },
  {
    id: 'databases',
    publicationStatus: 'approved',
    fields: {
      name: confirmed('Databases'),
      skills: [
        skill('postgresql', 'PostgreSQL'),
        skill('mysql', 'MySQL'),
        skill('mongodb', 'MongoDB'),
      ],
    },
  },
  {
    id: 'devops-infrastructure',
    publicationStatus: 'approved',
    fields: {
      name: confirmed('DevOps & Infrastructure'),
      skills: [
        skill('docker', 'Docker'),
        skill('traefik', 'Traefik'),
        skill('nginx', 'Nginx'),
        skill('linux', 'Linux'),
        skill('rabbitmq', 'RabbitMQ'),
      ],
    },
  },
  {
    id: 'additional-technologies-tools',
    publicationStatus: 'approved',
    fields: {
      name: confirmed('Additional Technologies & Tools'),
      skills: [
        skill('git', 'Git'),
        skill('opengl', 'OpenGL'),
        skill('opencv', 'OpenCV'),
        skill('arduino', 'Arduino'),
      ],
    },
  },
] as const satisfies readonly SkillCategoryRecord[]
