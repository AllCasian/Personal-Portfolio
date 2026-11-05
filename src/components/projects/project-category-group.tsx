import type { ProjectGroup } from '@/content/projects'
import type { PublishedProject } from '@/content/project-types'
import { ProjectCard } from './project-card'

export function ProjectCategoryGroup({
  group,
  projects,
}: {
  group: ProjectGroup
  projects: readonly PublishedProject[]
}) {
  if (!projects.length) return null

  return (
    <section
      className="project-category-group"
      aria-labelledby={`projects-${group.category}-title`}
    >
      <div className="project-category-heading">
        <div>
          <h3 id={`projects-${group.category}-title`}>{group.title}</h3>
          {group.categoryLabel !== group.title ? <p>{group.categoryLabel}</p> : null}
        </div>
        {'organization' in group ? <span>{group.organization}</span> : null}
      </div>
      <div className="project-grid" data-motion-stagger>
        {projects.map((project) => (
          <ProjectCard categoryLabel={group.categoryLabel} key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
