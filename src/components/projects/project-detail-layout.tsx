import type { PublishedProject } from '@/content/project-types'
import { ProjectMedia } from './project-media'
import { ProjectNavigation } from './project-navigation'
import { ProjectTechnologyList } from './project-technology-list'
import { CaseStudySection } from './case-study-section'
import { projectGroups } from '@/content/projects'

const caseStudySections = [
  ['overview', 'Overview'],
  ['motivation', 'Motivation'],
  ['solution', 'Solution'],
  ['features', 'Features'],
  ['architecture', 'Architecture'],
  ['challenges', 'Engineering challenges'],
  ['contributions', 'Contributions'],
] as const

export function ProjectDetailLayout({ project }: { project: PublishedProject }) {
  const group = projectGroups.find(({ category }) => category === project.category)
  const hasCaseStudy = Object.values(project.caseStudy ?? {}).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value),
  )
  const hasPublicNarrative = Boolean(project.summary || hasCaseStudy)

  return (
    <article className="project-detail content-width">
      <header className="project-detail-header" data-motion-reveal>
        <p className="project-category">{group?.categoryLabel ?? 'Project'}</p>
        <h1>{project.title}</h1>
        <p className="project-context">
          {project.attribution?.program ? `${project.attribution.program} · ` : ''}
          {project.attribution?.organization ?? 'Personal project'}
        </p>
      </header>
      <div className={`project-detail-content${project.media?.length ? ' has-media' : ''}`}>
        <div className="project-detail-copy">
          {project.summary ? <p className="project-summary">{project.summary}</p> : null}
          {!hasPublicNarrative ? (
            <p className="project-summary">
              Further case-study details are not available for public display.
            </p>
          ) : null}
          {caseStudySections.map(([key, title]) => {
            const content = project.caseStudy?.[key]
            return content ? <CaseStudySection content={content} key={key} title={title} /> : null
          })}
          <ProjectTechnologyList technologies={project.technologies} />
          {project.links?.length ? (
            <ul className="project-detail-links" aria-label="Project links">
              {project.links.map((link) => (
                <li key={`${link.kind}-${link.href}`}>
                  <a href={link.href} rel="noreferrer noopener" target="_blank">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <ProjectNavigation />
        </div>
        <ProjectMedia media={project.media} />
      </div>
    </article>
  )
}
