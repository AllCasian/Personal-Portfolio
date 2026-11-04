import { SectionHeading } from '@/components/sections/section-heading'
import { SkillCategory } from '@/components/skills/skill-category'
import type { PublishedSkillCategory } from '@/content/experience-education-skills-types'

export function SkillsSection({ categories }: { categories: readonly PublishedSkillCategory[] }) {
  return (
    <section
      className="professional-section content-width"
      id="skills"
      aria-labelledby="skills-title"
    >
      <SectionHeading eyebrow="Technical toolkit" id="skills-title">
        Skills
      </SectionHeading>
      <div className="skill-category-grid">
        {categories.map((category) => (
          <SkillCategory category={category} key={category.id} />
        ))}
      </div>
    </section>
  )
}
