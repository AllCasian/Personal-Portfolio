import type { ProfileContent } from './types'

// Replace these clearly marked values with verified profile information before launch.
export const profile = {
  displayName: 'Your Name',
  roleFocus: 'Software Engineer',
  introduction: 'Add a concise, verified introduction about your professional focus here.',
  primaryAction: { label: 'Explore portfolio', href: '#portfolio' },
} as const satisfies ProfileContent
