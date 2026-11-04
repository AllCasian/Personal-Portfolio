import { projectGroups } from '@/content/projects'
import { getPublishedProjects } from '@/lib/projects'
import { SectionHeading } from './section-heading'
import { ProjectCategoryGroup } from '@/components/projects/project-category-group'

export function ProjectsSection() {
  const projects = getPublishedProjects()

  return (
    <section
      className="projects-section content-width"
      id="portfolio"
      aria-labelledby="portfolio-title"
    >
      <SectionHeading eyebrow="Selected projects" id="portfolio-title">
        Portfolio
      </SectionHeading>
      <div className="project-groups">
        {projectGroups.map((group) => (
          <ProjectCategoryGroup
            group={group}
            key={group.category}
            projects={projects.filter((project) => project.category === group.category)}
          />
        ))}
      </div>
    </section>
  )
}
