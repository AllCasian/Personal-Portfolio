import { ArrowUpRight } from 'lucide-react'
import { profile } from '@/content/profile'
import { ButtonLink } from '@/components/ui/button'

export function HeroActions() {
  const supportingLinks = [profile.resume, profile.github, profile.linkedIn].filter(
    (link): link is NonNullable<typeof link> => Boolean(link),
  )

  return (
    <div className="hero-action-group">
      <div className="hero-actions">
        <ButtonLink href="#portfolio">
          View Projects <ArrowUpRight aria-hidden="true" size={17} />
        </ButtonLink>
        <ButtonLink href="#contact" variant="secondary">
          Contact Me
        </ButtonLink>
      </div>
      {supportingLinks.length > 0 ? (
        <ul className="hero-supporting-links" aria-label="Additional professional links">
          {supportingLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
