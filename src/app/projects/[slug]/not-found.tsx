import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/layout/skip-link'
import { ProjectNavigation } from '@/components/projects/project-navigation'

export default function ProjectNotFound() {
  return (
    <>
      <SkipLink />
      <SiteHeader context="none" />
      <main className="project-not-found content-width" id="main-content">
        <p className="eyebrow">404</p>
        <h1>Project not found</h1>
        <p>The requested project is unavailable.</p>
        <ProjectNavigation />
      </main>
      <SiteFooter context="none" />
    </>
  )
}
