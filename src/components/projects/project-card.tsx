import { Card } from '@/components/ui/card'
import type { PublishedProject } from '@/content/project-types'
import { ProjectMedia } from './project-media'
import { ProjectTechnologyList } from './project-technology-list'

export function ProjectCard({
  project,
  categoryLabel,
}: {
  project: PublishedProject
  categoryLabel: string
}) {
  return (
    <Card className="project-card" data-motion-reveal>
      <ProjectMedia media={project.media} />
      <div className="project-card-body">
        <p className="project-category">{categoryLabel}</p>
        <h4>{project.title}</h4>
        {project.attribution ? (
          <p className="project-organization">{project.attribution.organization}</p>
        ) : null}
        {project.summary ? <p className="project-summary">{project.summary}</p> : null}
        <ProjectTechnologyList technologies={project.technologies} />
        <div className="project-card-actions">
          <a className="text-link" href={`/projects/${project.slug}`}>
            View details for {project.title}
          </a>
          {project.links?.map((link) => (
            <a
              className="project-external-link"
              href={link.href}
              key={`${link.kind}-${link.href}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </Card>
  )
}
