import type { PublicContactProfile } from '@/content/contact-types'
import { ButtonLink } from '@/components/ui/button'
import { CopyEmailAction } from './copy-email-action'
import { SectionHeading } from './section-heading'

export function ContactSection({ profile }: { profile: PublicContactProfile }) {
  const hasContactChannel = Boolean(profile.email || profile.githubUrl || profile.linkedinUrl)

  return (
    <section className="contact-section content-width" id="contact" aria-labelledby="contact-title">
      <SectionHeading id="contact-title" eyebrow="Get in touch">
        Contact
      </SectionHeading>
      <p className="contact-introduction" data-motion-reveal>
        Have an opportunity, a project idea, or just want to connect? I&apos;d love to hear from
        you.
      </p>

      {profile.email ? (
        <div className="contact-email-row" data-motion-reveal>
          <p className="contact-email" aria-label="Email address">
            {profile.email}
          </p>
          <div className="contact-actions">
            <ButtonLink href={`mailto:${profile.email}`}>Send email</ButtonLink>
            <CopyEmailAction email={profile.email} />
          </div>
        </div>
      ) : null}

      {profile.githubUrl || profile.linkedinUrl ? (
        <nav className="contact-social-links" aria-label="Social profiles" data-motion-reveal>
          {profile.githubUrl ? (
            <a
              className="text-link"
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
            >
              GitHub
            </a>
          ) : null}
          {profile.linkedinUrl ? (
            <a
              className="text-link"
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
            >
              LinkedIn
            </a>
          ) : null}
        </nav>
      ) : null}

      {!hasContactChannel ? (
        <p className="contact-unavailable" role="status">
          Contact links are unavailable right now.
        </p>
      ) : null}
    </section>
  )
}
