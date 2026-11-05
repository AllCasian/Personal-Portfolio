import { ArrowUpRight, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { profile } from '@/content/profile'
import { PrimaryLinks } from './primary-links'
import type { NavigationContext } from '@/content/navigation'

export function ResponsiveMobileNavigation({ context = 'home' }: { context?: NavigationContext }) {
  const prefix = context === 'home' ? '' : '/'

  return (
    <>
      <Button
        id="mobile-navigation-trigger"
        className="menu-trigger"
        variant="ghost"
        aria-label="Open menu"
        aria-controls="mobile-navigation-dialog"
        aria-haspopup="dialog"
        aria-expanded="false"
        type="button"
      >
        <span>Menu</span>
        <Menu aria-hidden="true" size={19} />
      </Button>
      <dialog
        id="mobile-navigation-dialog"
        className="mobile-dialog"
        aria-labelledby="mobile-navigation-title"
      >
        <div className="mobile-panel">
          <div className="mobile-panel-top">
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
            <h2 id="mobile-navigation-title" className="sr-only">
              Primary navigation
            </h2>
            <form method="dialog">
              <Button variant="ghost" aria-label="Close menu" data-menu-close type="submit">
                <X aria-hidden="true" />
              </Button>
            </form>
          </div>
          <nav aria-label="Primary" className="mobile-links">
            <PrimaryLinks context={context} />
          </nav>
          <a href={`${prefix}#contact`} className="panel-note" data-menu-destination="contact">
            Start a conversation <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>
      </dialog>
      <noscript>
        <nav className="no-js-mobile-links" aria-label="Primary">
          <PrimaryLinks context={context} />
        </nav>
      </noscript>
    </>
  )
}
