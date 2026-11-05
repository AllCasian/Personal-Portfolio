import type { ProfileContent } from './types'

// Profile details were provided and confirmed by the portfolio owner.
export const profile: ProfileContent = {
  displayName: 'Casian Criste',
  roleFocus: 'Junior Data Engineer',
  portrait: {
    src: '/images/me1-2.jpg',
    alt: 'Casian Criste',
  },
  introduction:
    "I'm a Computer Engineering graduate with interests in software engineering, full-stack development, and data engineering.",
  aboutSummary: {
    education: 'I graduated in Computer Engineering from the Technical University of Cluj-Napoca.',
    experience:
      'I worked as a Junior Data Engineer in the Dava.X Trainee Program at Endava from June to October 2026.',
    interests:
      'My interests include software engineering, full-stack development, and data engineering.',
    competencies:
      'My technical background includes React, TypeScript, Java, Spring Boot, Python, SQL, and data engineering.',
    approach:
      "I'm interested in solving practical problems, writing maintainable code, and continually developing my technical skills.",
    direction:
      'I aim to grow as a software engineer while building on my data engineering experience.',
  },
}
