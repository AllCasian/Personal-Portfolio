import type { PublicContactProfile } from '@/content/contact-types'
import { PortfolioActions } from './portfolio-actions'
import { SectionHeading } from './section-heading'

export function ContactSection({ profile }: { profile: PublicContactProfile }) {
  const hasContactChannel = Boolean(
    profile.email || profile.githubUrl || profile.linkedinUrl || profile.instagramUrl,
  )

  return (
    <section className="contact-section content-width" id="contact" aria-labelledby="contact-title">
      <SectionHeading id="contact-title" eyebrow="Get in touch">
        Contact
      </SectionHeading>
      <p className="contact-introduction" data-motion-reveal>
        Have an opportunity, a project idea, or just want to connect? I&apos;d love to hear from
        you.
      </p>

      <PortfolioActions profile={profile} className="contact-action-group" />

      {!hasContactChannel ? (
        <p className="contact-unavailable" role="status">
          Contact links are unavailable right now.
        </p>
      ) : null}
    </section>
  )
}
