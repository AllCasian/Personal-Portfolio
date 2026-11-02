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
  readonly aboutSummary: AboutSummary
  readonly portrait?: { readonly src: string; readonly alt: string }
  readonly resume?: { readonly href: string; readonly label: string }
  readonly github?: { readonly href: string; readonly label: string }
  readonly linkedIn?: { readonly href: string; readonly label: string }
}

export type AboutSummary = {
  readonly education: string
  readonly experience: string
  readonly interests: string
  readonly competencies: string
  readonly approach: string
  readonly direction: string
}
