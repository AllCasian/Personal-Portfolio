import { ArrowUpRight } from 'lucide-react'
import { PrimaryLinks } from './primary-links'
import { ResponsiveMobileNavigation } from './responsive-mobile-navigation'
import type { NavigationContext } from '@/content/navigation'

export function SiteHeader({ context = 'home' }: { context?: NavigationContext }) {
  const prefix = context === 'home' ? '' : '/'

  return (
    <header className="site-header content-width" data-navigation-context={context}>
      <a href={`${prefix}#home`} className="wordmark" aria-label="Portfolio home">
        <span aria-hidden="true">P</span>
        <i aria-hidden="true" />
      </a>
      <nav className="desktop-nav" aria-label="Primary">
        <PrimaryLinks context={context} />
      </nav>
      <a className="header-action" href={`${prefix}#contact`}>
        Let&apos;s talk <ArrowUpRight aria-hidden="true" size={16} />
      </a>
      <ResponsiveMobileNavigation context={context} />
    </header>
  )
}
