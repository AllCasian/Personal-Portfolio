import type { NavigationContext } from '@/content/navigation'
import { navigationItems } from '@/content/navigation'

type SiteFooterProps = {
  context?: NavigationContext
  ownerName?: string
}

export function SiteFooter({ context = 'home', ownerName }: SiteFooterProps) {
  const prefix = context === 'home' ? '' : '/'
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer content-width">
      <div className="site-footer-content">
        <a href={`${prefix}#home`} className="footer-brand" aria-label="Portfolio home">
          Portfolio<span> · Software engineering</span>
        </a>
        <nav aria-label="Footer navigation" className="footer-navigation">
          {navigationItems.map((item) => (
            <a key={item.sectionId} href={`${prefix}${item.href}`}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="footer-copyright">
        © {year}
        {ownerName ? ` ${ownerName}.` : '.'} All rights reserved.
      </p>
    </footer>
  )
}
