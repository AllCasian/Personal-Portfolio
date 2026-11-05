import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { profile } from '@/content/profile'
import { PrimaryLinks } from './primary-links'
import { ResponsiveMobileNavigation } from './responsive-mobile-navigation'
import type { NavigationContext } from '@/content/navigation'

export function SiteHeader({ context = 'home' }: { context?: NavigationContext }) {
  const prefix = context === 'home' ? '' : '/'

  return (
    <header className="site-header content-width" data-navigation-context={context}>
      <a href={`${prefix}#home`} className="wordmark" aria-label="Portfolio home">
        <span className="brand-mark" aria-hidden="true">
          {profile.portrait ? (
            <Image
              src={profile.portrait.src}
              alt=""
              fill
              sizes="42px"
              className="brand-avatar-image"
              data-brand-avatar
            />
          ) : null}
        </span>
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
