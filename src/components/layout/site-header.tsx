import { ArrowUpRight } from 'lucide-react'
import { PrimaryLinks } from './primary-links'
import { ResponsiveMobileNavigation } from './responsive-mobile-navigation'

export function SiteHeader() {
  return (
    <header className="site-header content-width">
      <a href="#home" className="wordmark" aria-label="Your Name, home">
        <span>YN</span>
        <i aria-hidden="true" />
      </a>
      <nav className="desktop-nav" aria-label="Primary">
        <PrimaryLinks />
      </nav>
      <a className="header-action" href="#contact">
        Let&apos;s talk <ArrowUpRight aria-hidden="true" size={16} />
      </a>
      <ResponsiveMobileNavigation />
    </header>
  )
}
