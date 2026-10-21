import { Card } from '@/components/ui/card'
import type { PortfolioSection } from '@/content/types'
import { SectionHeading } from './section-heading'

export function SectionPlaceholder({ section }: { section: PortfolioSection }) {
  return (
    <section
      className="placeholder-section content-width"
      id={section.id}
      aria-labelledby={`${section.id}-title`}
    >
      <SectionHeading id={`${section.id}-title`}>{section.title}</SectionHeading>
      <Card className="placeholder-card">
        <p>{section.description}</p>
      </Card>
    </section>
  )
}
