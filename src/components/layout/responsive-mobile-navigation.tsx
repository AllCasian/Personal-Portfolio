import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PrimaryLinks } from './primary-links'

export function ResponsiveMobileNavigation() {
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
              YN
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
            <PrimaryLinks />
          </nav>
          <a href="#contact" className="panel-note" data-menu-destination="contact">
            Start a conversation <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>
      </dialog>
      <nav className="no-js-mobile-links" aria-label="Primary">
        <PrimaryLinks />
      </nav>
    </>
  )
}
