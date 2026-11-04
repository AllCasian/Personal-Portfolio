import { navigationItems, type NavigationContext } from '@/content/navigation'

export function PrimaryLinks({ context = 'home' }: { context?: NavigationContext }) {
  const current = context === 'project' ? 'portfolio' : context === 'home' ? 'home' : undefined
  const prefix = context === 'home' ? '' : '/'

  return (
    <>
      {navigationItems.map((item) => (
        <a
          className={`nav-link${item.sectionId === current ? ' is-active' : ''}`}
          href={`${prefix}${item.href}`}
          key={item.sectionId}
          data-section-link={item.sectionId}
          aria-current={item.sectionId === current ? 'location' : undefined}
        >
          {item.label}
        </a>
      ))}
    </>
  )
}
