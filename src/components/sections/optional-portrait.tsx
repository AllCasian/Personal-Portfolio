'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PortraitFallback } from '@/components/sections/portrait-fallback'

type OptionalPortraitProps = {
  readonly src: string
  readonly alt: string
}

export function OptionalPortrait({ src, alt }: OptionalPortraitProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="portrait-frame">
      <div className="portrait-orbit orbit-one" />
      <div className="portrait-orbit orbit-two" />
      {failed ? (
        <PortraitFallback />
      ) : (
        <Image
          className="portrait-image"
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 76vw, (max-width: 1023px) 36vw, 430px"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
