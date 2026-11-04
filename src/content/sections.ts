import type { PortfolioSection } from './types'

export const sections = [
  { id: 'home', title: 'Home', state: 'content' },
  { id: 'about', title: 'About', state: 'content' },
  {
    id: 'portfolio',
    title: 'Portfolio',
    state: 'content',
    description: 'Selected work will be added here.',
  },
  { id: 'experience', title: 'Experience', state: 'content' },
  { id: 'education', title: 'Education', state: 'content' },
  { id: 'skills', title: 'Skills', state: 'content' },
  {
    id: 'contact',
    title: 'Contact',
    state: 'placeholder',
    description: 'Contact details will be added here.',
  },
] as const satisfies readonly PortfolioSection[]
