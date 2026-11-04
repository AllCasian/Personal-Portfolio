import type { ProjectMedia as ProjectMediaData } from '@/content/project-types'
import { ProjectMediaImage } from './project-media-image'

export function ProjectMedia({ media }: { media?: readonly ProjectMediaData[] }) {
  if (!media?.length) return null

  return (
    <div className="project-media-list">
      {media.map((item) => (
        <div
          className="project-media-frame"
          key={item.src}
          style={{ aspectRatio: `${item.width} / ${item.height}` }}
        >
          <ProjectMediaImage media={item} />
        </div>
      ))}
    </div>
  )
}
