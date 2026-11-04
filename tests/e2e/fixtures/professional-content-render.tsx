import { renderToStaticMarkup } from 'react-dom/server'
import { EducationSection } from '@/components/sections/education-section'
import { ExperienceSection } from '@/components/sections/experience-section'
import { SkillsSection } from '@/components/sections/skills-section'
import type { ProfessionalContentSource } from '@/content/experience-education-skills-types'
import { getPublishedProfessionalContent } from '@/lib/professional-content'

export function renderProfessionalContentFixture(source: ProfessionalContentSource): {
  readonly html: string
  readonly serialized: string
} {
  const published = getPublishedProfessionalContent(source)
  const html = renderToStaticMarkup(
    <main>
      <ExperienceSection entries={published.experience} />
      <EducationSection certifications={published.certifications} entries={published.education} />
      <SkillsSection categories={published.skillCategories} />
    </main>,
  )

  return { html, serialized: JSON.stringify(published) }
}
