import type { PortfolioSection } from './types'

export const sections = [
  { id: 'home', title: 'Home', state: 'content' },
  { id: 'about', title: 'About', state: 'placeholder', description: 'About section coming soon.' },
  {
    id: 'portfolio',
    title: 'Portfolio',
    state: 'placeholder',
    description: 'Selected work will be added here.',
  },
  {
    id: 'contact',
    title: 'Contact',
    state: 'placeholder',
    description: 'Contact details will be added here.',
  },
] as const satisfies readonly PortfolioSection[]
