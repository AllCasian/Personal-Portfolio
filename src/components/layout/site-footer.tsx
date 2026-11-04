import type { NavigationContext } from '@/content/navigation'

export function SiteFooter({ context = 'home' }: { context?: NavigationContext }) {
  const prefix = context === 'home' ? '' : '/'

  return (
    <footer className="site-footer content-width">
      <a href={`${prefix}#home`} className="footer-brand" aria-label="Portfolio home">
        Portfolio<span> · Software engineering</span>
      </a>
      <p>
        Personal portfolio foundation <span>© {new Date().getFullYear()}</span>
      </p>
    </footer>
  )
}
