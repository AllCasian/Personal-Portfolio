'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { navigationItems } from '@/content/navigation'

export function PrimaryLinks({
  onNavigate,
  current = true,
}: {
  onNavigate?: (sectionId: string) => void
  current?: boolean
}) {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const update = () => {
      const hash = window.location.hash.slice(1)
      setActive(navigationItems.some((item) => item.sectionId === hash) ? hash : 'home')
    }
    update()
    window.addEventListener('hashchange', update)
    window.addEventListener('popstate', update)
    return () => {
      window.removeEventListener('hashchange', update)
      window.removeEventListener('popstate', update)
    }
  }, [])

  return (
    <>
      {navigationItems.map((item) => (
        <Link
          className={`nav-link${active === item.sectionId ? ' is-active' : ''}`}
          href={item.href}
          key={item.sectionId}
          aria-current={current && active === item.sectionId ? 'location' : undefined}
          onClick={() => {
            setActive(item.sectionId)
            onNavigate?.(item.sectionId)
          }}
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}
