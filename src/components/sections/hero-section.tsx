import { profile } from '@/content/profile'
import type { PublicContactProfile } from '@/content/contact-types'
import { HeroActions } from '@/components/sections/hero-actions'
import { OptionalPortrait } from '@/components/sections/optional-portrait'
import { PortraitFallback } from '@/components/sections/portrait-fallback'

export function HeroSection({ contactProfile }: { contactProfile: PublicContactProfile }) {
  return (
    <section className="hero content-width" id="home" aria-labelledby="hero-title" data-motion-hero>
      <div className="hero-copy">
        <p className="eyebrow">A personal software engineering portfolio</p>
        <h1 id="hero-title" tabIndex={-1}>
          <span
            className="hero-name"
            data-placeholder={profile.displayName.startsWith('Placeholder:')}
          >
            {profile.displayName}
          </span>
          <span
            className="hero-role"
            data-placeholder={profile.roleFocus.startsWith('Placeholder:')}
          >
            {profile.roleFocus}
          </span>
        </h1>
        <p className="hero-intro">{profile.introduction}</p>
        <HeroActions profile={contactProfile} />
      </div>
      {profile.portrait ? (
        <OptionalPortrait src={profile.portrait.src} alt={profile.portrait.alt} />
      ) : (
        <div className="portrait-frame" aria-hidden="true">
          <div className="portrait-orbit orbit-one" />
          <div className="portrait-orbit orbit-two" />
          <PortraitFallback />
        </div>
      )}
    </section>
  )
}
