import type { Metadata } from 'next'
import { projectGroups } from '@/content/projects'
import type { PublishedProject } from '@/content/project-types'

const unavailableMetadata: Metadata = {
  title: 'Project not found',
  description: 'The requested project is unavailable.',
  openGraph: {
    title: 'Project not found',
    description: 'The requested project is unavailable.',
  },
}

function canonicalBase(siteUrl?: string): URL | undefined {
  if (!siteUrl) return undefined
  try {
    const url = new URL(siteUrl)
    if (url.protocol !== 'https:' || url.username || url.password) return undefined
    return url
  } catch {
    return undefined
  }
}

export function createProjectMetadata(
  project: PublishedProject | undefined,
  siteUrl?: string,
): Metadata {
  if (!project) return unavailableMetadata

  const group = projectGroups.find(({ category }) => category === project.category)
  const description =
    project.summary ?? `A project case study in ${group?.categoryLabel ?? 'software engineering'}.`
  const title = `${project.title} — ${group?.categoryLabel ?? 'Project'}`
  const base = canonicalBase(siteUrl)
  const image = project.media?.[0]

  return {
    title,
    description,
    ...(base
      ? { alternates: { canonical: new URL(`/projects/${project.slug}`, base).toString() } }
      : {}),
    openGraph: {
      type: 'article',
      title,
      description,
      ...(image
        ? { images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] }
        : {}),
    },
  }
}
