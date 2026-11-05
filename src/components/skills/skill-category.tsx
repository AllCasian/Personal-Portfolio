import type { PublishedSkillCategory } from '@/content/experience-education-skills-types'

export function SkillCategory({ category }: { category: PublishedSkillCategory }) {
  return (
    <article className="skill-category" data-motion-reveal>
      <h3>{category.name}</h3>
      <ul className="skill-list">
        {category.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </article>
  )
}
