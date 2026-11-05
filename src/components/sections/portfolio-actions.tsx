import { Building2, Camera, Code2, Download, Mail } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PublicContactProfile } from '@/content/contact-types'

type PortfolioAction = {
  label: string
  visibleLabel?: string
  href: string
  icon: LucideIcon
  kind: 'primary' | 'secondary'
  external: boolean
  download?: boolean
}

type PortfolioActionsProps = {
  profile: PublicContactProfile
  className?: string
  label?: string
}

export function PortfolioActions({
  profile,
  className = '',
  label = 'Contact actions',
}: PortfolioActionsProps) {
  const actions: Array<PortfolioAction | undefined> = [
    profile.email
      ? {
          label: 'Send email',
          href: `mailto:${profile.email}`,
          icon: Mail,
          kind: 'primary',
          external: false,
        }
      : undefined,
    profile.githubUrl
      ? {
          label: 'GitHub profile (opens in a new tab)',
          visibleLabel: 'GitHub',
          href: profile.githubUrl,
          icon: Code2,
          kind: 'secondary',
          external: true,
        }
      : undefined,
    profile.linkedinUrl
      ? {
          label: 'LinkedIn profile (opens in a new tab)',
          visibleLabel: 'LinkedIn',
          href: profile.linkedinUrl,
          icon: Building2,
          kind: 'secondary',
          external: true,
        }
      : undefined,
    profile.instagramUrl
      ? {
          label: 'Instagram',
          visibleLabel: 'Instagram',
          href: profile.instagramUrl,
          icon: Camera,
          kind: 'secondary',
          external: true,
        }
      : undefined,
    profile.cvUrl
      ? {
          label: 'Download CV',
          visibleLabel: 'Download CV',
          href: profile.cvUrl,
          icon: Download,
          kind: 'secondary',
          external: false,
          download: true,
        }
      : undefined,
  ]
  const availableActions = actions.filter(
    (action): action is PortfolioAction => action !== undefined,
  )

  if (availableActions.length === 0) return null

  return (
    <nav className={`portfolio-actions ${className}`.trim()} aria-label={label} data-motion-reveal>
      {availableActions.map(
        ({ label: accessibleLabel, visibleLabel, href, icon: Icon, kind, external, download }) => (
          <a
            key={accessibleLabel}
            className={`button button-${kind} portfolio-action`}
            href={href}
            aria-label={accessibleLabel}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            {...(download ? { download: true } : {})}
          >
            <Icon aria-hidden="true" focusable="false" size={18} />
            <span>{visibleLabel ?? 'Email'}</span>
          </a>
        ),
      )}
    </nav>
  )
}
