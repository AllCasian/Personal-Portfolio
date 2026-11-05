import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { SkipLink } from '@/components/layout/skip-link'
import { ProjectDetailLayout } from '@/components/projects/project-detail-layout'
import { getPublishedProject, getPublishedProjectParams } from '@/lib/projects'
import { createProjectMetadata } from '@/lib/project-metadata'
import { getPublishedContactProfile } from '@/lib/contact-content'

export const dynamicParams = true

type ProjectPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getPublishedProjectParams()
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  return createProjectMetadata(getPublishedProject(slug), process.env.SITE_URL)
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getPublishedProject(slug)
  if (!project) notFound()
  const contactProfile = getPublishedContactProfile()

  return (
    <>
      <SkipLink />
      <SiteHeader context="project" />
      <main id="main-content">
        <ProjectDetailLayout project={project} />
      </main>
      <SiteFooter context="project" ownerName={contactProfile.ownerName} />
    </>
  )
}
