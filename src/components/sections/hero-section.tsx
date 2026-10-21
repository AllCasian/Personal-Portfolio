import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { profile } from '@/content/profile'
import { ButtonLink } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="hero content-width" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">A personal software engineering portfolio</p>
        <h1 id="hero-title" tabIndex={-1}>
          <span className="hero-name">{profile.displayName}</span>
          <span className="hero-role">{profile.roleFocus}</span>
        </h1>
        <p className="hero-intro">{profile.introduction}</p>
        <div className="hero-actions">
          <ButtonLink href={profile.primaryAction.href}>
            {profile.primaryAction.label}
            <ArrowUpRight aria-hidden="true" size={17} />
          </ButtonLink>
          <a className="text-link" href="#about">
            A little about me <ArrowDownRight aria-hidden="true" size={16} />
          </a>
        </div>
      </div>
      <div className="portrait-frame" aria-hidden="true">
        <div className="portrait-orbit orbit-one" />
        <div className="portrait-orbit orbit-two" />
        <div className="portrait-placeholder">
          <span>YN</span>
          <i>Portrait placeholder</i>
        </div>
      </div>
      <p className="hero-index" aria-hidden="true">
        01 <span /> INTRODUCTION
      </p>
    </section>
  )
}
