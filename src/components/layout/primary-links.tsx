import { navigationItems } from '@/content/navigation'

export function PrimaryLinks() {
  return (
    <>
      {navigationItems.map((item) => (
        <a
          className={`nav-link${item.sectionId === 'home' ? ' is-active' : ''}`}
          href={item.href}
          key={item.sectionId}
          data-section-link={item.sectionId}
          aria-current={item.sectionId === 'home' ? 'location' : undefined}
        >
          {item.label}
        </a>
      ))}
    </>
  )
}
