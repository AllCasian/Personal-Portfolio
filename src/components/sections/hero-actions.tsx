import { ArrowUpRight } from 'lucide-react'
import type { PublicContactProfile } from '@/content/contact-types'
import { ButtonLink } from '@/components/ui/button'
import { PortfolioActions } from './portfolio-actions'

export function HeroActions({ profile }: { profile: PublicContactProfile }) {
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
      <PortfolioActions
        profile={profile}
        className="hero-social-actions"
        label="Hero contact and social actions"
      />
    </div>
  )
}
