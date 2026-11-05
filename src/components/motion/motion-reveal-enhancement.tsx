'use client'

import { useEffect } from 'react'
import { initializeMotionReveals } from '@/lib/motion-reveal'

export function MotionRevealEnhancement() {
  useEffect(() => initializeMotionReveals(), [])

  return null
}
