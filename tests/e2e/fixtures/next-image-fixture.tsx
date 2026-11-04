import type { ImgHTMLAttributes } from 'react'

type NextImageFixtureProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean
  sizes?: string
}

export default function NextImageFixture({ fill, sizes, ...imageProps }: NextImageFixtureProps) {
  void fill
  void sizes
  return <img {...imageProps} alt={imageProps.alt ?? ''} />
}
