'use client'

import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { PrimaryLinks } from './primary-links'

type MobileNavigationPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNavigationPanel({ open, onOpenChange }: MobileNavigationPanelProps) {
  const pendingFocus = useRef<string | null>(null)
  const reducedMotion = useReducedMotion()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogContent
            asChild
            forceMount
            id="mobile-navigation-dialog"
            onCloseAutoFocus={(event) => {
              event.preventDefault()
              const targetId = pendingFocus.current
              pendingFocus.current = null
              window.setTimeout(() => {
                if (targetId) {
                  document
                    .getElementById(targetId)
                    ?.querySelector<HTMLElement>('h1, h2')
                    ?.focus({ preventScroll: true })
                } else {
                  document
                    .getElementById('mobile-navigation-trigger')
                    ?.focus({ preventScroll: true })
                }
              }, 0)
            }}
          >
            <motion.div
              className="mobile-panel"
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: 'easeOut' }}
            >
              <div className="mobile-panel-top">
                <span className="brand-mark" aria-hidden="true">
                  YN
                </span>
                <DialogTitle className="sr-only">Primary navigation</DialogTitle>
                <Button variant="ghost" aria-label="Close menu" onClick={() => onOpenChange(false)}>
                  <X aria-hidden="true" />
                </Button>
              </div>
              <nav aria-label="Primary" className="mobile-links">
                <PrimaryLinks
                  current
                  onNavigate={(sectionId) => {
                    pendingFocus.current = sectionId
                    onOpenChange(false)
                  }}
                />
              </nav>
              <a href="#contact" className="panel-note" onClick={() => onOpenChange(false)}>
                Start a conversation <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            </motion.div>
          </DialogContent>
        ) : null}
      </AnimatePresence>
    </Dialog>
  )
}
