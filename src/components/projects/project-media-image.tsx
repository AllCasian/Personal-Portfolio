'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { ProjectMedia } from '@/content/project-types'

export function ProjectMediaImage({ media }: { media: ProjectMedia }) {
  const [failed, setFailed] = useState(false)

  if (failed) return <span data-media-failed="true" hidden aria-hidden="true" />

  return (
    <Image
      src={media.src}
      alt={media.decorative ? '' : media.alt}
      fill
      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 560px"
      onError={() => setFailed(true)}
    />
  )
}
