import { ExperienceEntry } from '@/components/experience/experience-entry'
import { SectionHeading } from '@/components/sections/section-heading'
import type { PublishedExperience } from '@/content/experience-education-skills-types'

export function ExperienceSection({ entries }: { entries: readonly PublishedExperience[] }) {
  return (
    <section
      className="professional-section content-width"
      id="experience"
      aria-labelledby="experience-title"
    >
      <SectionHeading eyebrow="Professional background" id="experience-title">
        Experience
      </SectionHeading>
      <div className="professional-entry-list">
        {entries.map((entry) => (
          <ExperienceEntry entry={entry} key={entry.id} />
        ))}
      </div>
    </section>
  )
}
