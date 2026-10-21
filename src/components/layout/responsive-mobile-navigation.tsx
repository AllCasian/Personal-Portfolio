'use client'

import { useEffect, useState, useSyncExternalStore, type ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { PrimaryLinks } from './primary-links'

const mobileQuery = '(max-width: 1023px)'

type MobileNavigationPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function subscribeToViewport(onChange: () => void) {
  const query = window.matchMedia?.(mobileQuery)
  query?.addEventListener('change', onChange)
  return () => query?.removeEventListener('change', onChange)
}

function getViewportSnapshot() {
  return window.matchMedia?.(mobileQuery).matches ?? window.innerWidth < 1024
}

function getServerSnapshot() {
  return false
}

function MobileNavigationFallback() {
  return (
    <nav className="no-js-mobile-links" aria-label="Primary">
      <PrimaryLinks />
    </nav>
  )
}

export function ResponsiveMobileNavigation() {
  const isNarrowViewport = useSyncExternalStore(
    subscribeToViewport,
    getViewportSnapshot,
    getServerSnapshot,
  )

  useEffect(() => {
    document.documentElement.classList.add('has-js')
    return () => document.documentElement.classList.remove('has-js')
  }, [])

  if (!isNarrowViewport) return <MobileNavigationFallback />
  return <MobileMenuController />
}

function MobileMenuController() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasFailedToLoad, setHasFailedToLoad] = useState(false)
  const [Panel, setPanel] = useState<ComponentType<MobileNavigationPanelProps> | null>(null)
  const openMenu = async () => {
    if (isLoading) return

    if (!Panel) {
      setIsLoading(true)
      try {
        const module = await import('./mobile-navigation-panel')
        setPanel(() => module.MobileNavigationPanel)
      } catch {
        document.documentElement.classList.remove('has-js')
        setHasFailedToLoad(true)
      } finally {
        setIsLoading(false)
      }
    }

    setIsOpen(true)
  }

  if (hasFailedToLoad) return <MobileNavigationFallback />

  return (
    <>
      <Button
        id="mobile-navigation-trigger"
        className="menu-trigger"
        variant="ghost"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-busy={isLoading}
        onClick={() => void openMenu()}
      >
        <span>Menu</span>
        <Menu aria-hidden="true" size={19} />
      </Button>
      {Panel ? <Panel open={isOpen} onOpenChange={setIsOpen} /> : null}
      <nav className="no-js-mobile-links" aria-label="Primary">
        <PrimaryLinks />
      </nav>
    </>
  )
}
