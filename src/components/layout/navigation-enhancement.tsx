'use client'

import { useEffect } from 'react'
import { initializeNavigation } from '@/lib/navigation-enhancement'

export function NavigationEnhancement() {
  useEffect(() => initializeNavigation(), [])

  return null
}
