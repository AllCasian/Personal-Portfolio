import { createRoot } from 'react-dom/client'
import { getPublishedProjects } from '@/lib/projects'
import { ProjectDetailLayout } from '@/components/projects/project-detail-layout'

declare global {
  interface Window {
    __projectMediaLayoutShifts: number[]
  }
}

const rootElement = document.getElementById('fixture-root')
if (!rootElement) throw new Error('Project media test root is missing')

window.__projectMediaLayoutShifts = []
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((entries) => {
    for (const entry of entries.getEntries()) {
      const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
      if (!layoutShift.hadRecentInput && typeof layoutShift.value === 'number') {
        window.__projectMediaLayoutShifts.push(layoutShift.value)
      }
    }
  })

  try {
    observer.observe({ type: 'layout-shift', buffered: true })
  } catch {
    // The geometry assertion remains available in browsers without layout-shift entries.
  }
}

const drivewise = getPublishedProjects().find((project) => project.id === 'drivewise')
if (!drivewise) throw new Error('Verified Drivewise fixture record is missing')

const failedFixtureSrc = '/projects/__feature003_test_only_failed_image__.png' as const
const fixtureProject = {
  ...drivewise,
  media: [
    {
      src: failedFixtureSrc,
      width: 800,
      height: 600,
      alt: 'Isolated test image that will fail to load',
    },
  ],
}

rootElement.dataset.fixtureMediaPublished = String(
  getPublishedProjects().some((project) =>
    project.media?.some((media) => media.src === failedFixtureSrc),
  ),
)

createRoot(rootElement).render(<ProjectDetailLayout project={fixtureProject} />)
