import { projects } from '@/content/projects'
import { projectCategories, projectIds, projectSlugs } from '@/content/project-types'
import type {
  ProjectField,
  ProjectRecord,
  ProjectSlug,
  PublishedProject,
} from '@/content/project-types'

const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

function isField<T>(field: ProjectField<T> | undefined): field is ProjectField<T> {
  if (!field || typeof field !== 'object' || !('value' in field)) return false
  const verified = field.verification?.status === 'verified'
  const sourceValid =
    field.verification?.source === 'owner-confirmed' ||
    field.verification?.source === 'approved-project-documentation'
  const statusValid =
    field.verification?.status === 'verified' || field.verification?.status === 'unverified'
  const approvalValid =
    field.publication?.status === 'approved' || field.publication?.status === 'unapproved'

  return statusValid && approvalValid && (!verified || sourceValid)
}

export function isProjectFieldPublic<T>(
  field: ProjectField<T> | undefined,
): field is ProjectField<T> {
  return Boolean(
    field &&
    isField(field) &&
    field.verification.status === 'verified' &&
    field.publication.status === 'approved',
  )
}

function safeExternalUrl(href: string): boolean {
  try {
    const url = new URL(href)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}

function publicCaseStudy(record: ProjectRecord): PublishedProject['caseStudy'] {
  const source = record.caseStudy
  if (!source) return undefined

  const overview = isProjectFieldPublic(source.overview) ? source.overview.value : undefined
  const motivation = isProjectFieldPublic(source.motivation) ? source.motivation.value : undefined
  const solution = isProjectFieldPublic(source.solution) ? source.solution.value : undefined
  const features = isProjectFieldPublic(source.features) ? source.features.value : undefined
  const architecture = isProjectFieldPublic(source.architecture)
    ? source.architecture.value
    : undefined
  const challenges = isProjectFieldPublic(source.challenges) ? source.challenges.value : undefined
  const contributions = isProjectFieldPublic(source.contributions)
    ? source.contributions.value
    : undefined

  if (
    overview === undefined &&
    motivation === undefined &&
    solution === undefined &&
    features === undefined &&
    architecture === undefined &&
    challenges === undefined &&
    contributions === undefined
  ) {
    return undefined
  }

  return {
    ...(overview === undefined ? {} : { overview }),
    ...(motivation === undefined ? {} : { motivation }),
    ...(solution === undefined ? {} : { solution }),
    ...(features === undefined ? {} : { features }),
    ...(architecture === undefined ? {} : { architecture }),
    ...(challenges === undefined ? {} : { challenges }),
    ...(contributions === undefined ? {} : { contributions }),
  }
}

function projectToPublic(record: ProjectRecord): PublishedProject | undefined {
  if (record.publicationStatus !== 'approved') return undefined
  if (
    !isProjectFieldPublic(record.slug) ||
    !isProjectFieldPublic(record.title) ||
    !isProjectFieldPublic(record.category)
  ) {
    return undefined
  }
  if (record.category.value !== 'personal' && !isProjectFieldPublic(record.attribution)) {
    return undefined
  }

  const attribution = isProjectFieldPublic(record.attribution)
    ? record.attribution.value
    : undefined
  const summary = isProjectFieldPublic(record.summary) ? record.summary.value : undefined
  const technologies = record.technologies?.filter(isProjectFieldPublic).map(({ value }) => value)
  const media = record.media
    ?.filter(isProjectFieldPublic)
    .map(({ value }) => value)
    .filter(
      ({ src, width, height, alt }) =>
        src.startsWith('/projects/') &&
        Number.isFinite(width) &&
        width > 0 &&
        Number.isFinite(height) &&
        height > 0 &&
        hasText(alt),
    )
  const links = record.links
    ?.filter(isProjectFieldPublic)
    .map(({ value }) => value)
    .filter(({ href }) => safeExternalUrl(href))
  const caseStudy = publicCaseStudy(record)

  return {
    id: record.id,
    slug: record.slug.value,
    title: record.title.value,
    category: record.category.value,
    ...(attribution ? { attribution } : {}),
    ...(summary ? { summary } : {}),
    ...(technologies?.length ? { technologies } : {}),
    ...(caseStudy ? { caseStudy } : {}),
    ...(media?.length ? { media } : {}),
    ...(links?.length ? { links } : {}),
  }
}

export function validateProjectRecords(records: readonly ProjectRecord[]): void {
  const ids = new Set<string>()
  const slugs = new Set<string>()

  for (const record of records) {
    if (!record || typeof record !== 'object') throw new Error('Project record must be an object')
    if (!projectIds.includes(record.id)) throw new Error(`Invalid project id: ${String(record.id)}`)
    if (ids.has(record.id)) throw new Error(`Duplicate project id: ${record.id}`)
    ids.add(record.id)
    if (record.publicationStatus !== 'approved' && record.publicationStatus !== 'draft') {
      throw new Error(`Invalid publication status for ${record.id}`)
    }

    for (const [fieldName, field] of [
      ['slug', record.slug],
      ['title', record.title],
      ['category', record.category],
    ] as const) {
      if (!isField(field)) throw new Error(`Invalid ${fieldName} field for ${record.id}`)
      if (!hasText(field.value)) throw new Error(`${fieldName} must not be empty for ${record.id}`)
    }

    if (!projectSlugs.includes(record.slug.value)) {
      throw new Error(`Invalid project slug for ${record.id}`)
    }
    if (slugs.has(record.slug.value))
      throw new Error(`Duplicate project slug: ${record.slug.value}`)
    slugs.add(record.slug.value)
    if (!projectCategories.includes(record.category.value)) {
      throw new Error(`Invalid project category for ${record.id}`)
    }
    if (record.category.value !== 'personal' && !isField(record.attribution)) {
      throw new Error(`Missing attribution for ${record.id}`)
    }
  }
}

export function validateInitialProjectCatalog(records: readonly ProjectRecord[]): void {
  validateProjectRecords(records)
  if (records.length !== projectIds.length)
    throw new Error('Initial catalog must contain exactly six projects')

  for (const [index, id] of projectIds.entries()) {
    const record = records[index]
    if (record.id !== id || record.slug.value !== id) {
      throw new Error('Initial project records must keep the approved IDs, slugs, and order')
    }
  }
}

export function getPublishedProjects(
  records: readonly ProjectRecord[] = projects,
): readonly PublishedProject[] {
  validateProjectRecords(records)
  return records.flatMap((record) => {
    const project = projectToPublic(record)
    return project ? [project] : []
  })
}

export function getPublishedProject(
  slug: string,
  records: readonly ProjectRecord[] = projects,
): PublishedProject | undefined {
  return getPublishedProjects(records).find((project) => project.slug === (slug as ProjectSlug))
}

export function getPublishedProjectParams(
  records: readonly ProjectRecord[] = projects,
): { slug: ProjectSlug }[] {
  return getPublishedProjects(records).map(({ slug }) => ({ slug }))
}
