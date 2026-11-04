import { EducationEntry } from '@/components/education/education-entry'
import { SectionHeading } from '@/components/sections/section-heading'
import { Card } from '@/components/ui/card'
import type {
  PublishedCertification,
  PublishedEducation,
} from '@/content/experience-education-skills-types'

export function EducationSection({
  entries,
  certifications,
}: {
  entries: readonly PublishedEducation[]
  certifications: readonly PublishedCertification[]
}) {
  return (
    <section
      className="professional-section content-width"
      id="education"
      aria-labelledby="education-title"
    >
      <SectionHeading eyebrow="Education & learning" id="education-title">
        Education
      </SectionHeading>
      <div className="education-content">
        <div className="professional-entry-list">
          {entries.map((entry) => (
            <EducationEntry entry={entry} key={entry.id} />
          ))}
        </div>
        {certifications.length > 0 ? (
          <div className="certifications">
            <h3>Certifications</h3>
            <ul className="certification-list">
              {certifications.map((certification) => (
                <li key={certification.id}>
                  <Card className="certification-entry">
                    <p>{certification.name}</p>
                    {certification.issuer ? <span>{certification.issuer}</span> : null}
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
