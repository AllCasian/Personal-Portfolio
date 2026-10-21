export type PortfolioSection = {
  readonly id: string
  readonly title: string
  readonly state: 'content' | 'placeholder'
  readonly description?: string
}

export type NavigationItem = {
  readonly label: string
  readonly href: `#${string}`
  readonly sectionId: string
  readonly order: number
}

export type ProfileContent = {
  readonly displayName: string
  readonly roleFocus: string
  readonly introduction: string
  readonly primaryAction: { readonly label: string; readonly href: `#${string}` }
  readonly portrait?: { readonly src: string; readonly alt: string }
}
