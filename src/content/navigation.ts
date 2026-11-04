import type { NavigationItem } from './types'

export type NavigationContext = 'home' | 'project' | 'none'

export const navigationItems = [
  { label: 'Home', href: '#home', sectionId: 'home', order: 1 },
  { label: 'About', href: '#about', sectionId: 'about', order: 2 },
  { label: 'Portfolio', href: '#portfolio', sectionId: 'portfolio', order: 3 },
  { label: 'Contact', href: '#contact', sectionId: 'contact', order: 4 },
] as const satisfies readonly NavigationItem[]
