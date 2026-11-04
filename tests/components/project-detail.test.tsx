import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { getPublishedProjects } from '@/lib/projects'
import { ProjectDetailLayout } from '@/components/projects/project-detail-layout'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const { fill, ...imageProps } = props
    void fill
    return <img {...imageProps} alt={props.alt ?? ''} />
  },
}))

describe('ProjectDetailLayout', () => {
  it('shows verified training and academic context without implying endorsement or commercial delivery', () => {
    const published = getPublishedProjects()
    const drivewise = published.find(({ id }) => id === 'drivewise')
    const tuner = published.find(({ id }) => id === 'automatic-guitar-tuner')
    expect(drivewise).toBeDefined()
    expect(tuner).toBeDefined()

    const { rerender } = render(<ProjectDetailLayout project={drivewise!} />)
    expect(screen.getByText('Dava.X Trainee Program · Endava')).toBeInTheDocument()
    expect(
      screen.getByText(
        /Hands-on software engineering project completed during the Dava.X Trainee Program/,
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/commercial client|production deployment|independently delivered/i),
    ).not.toBeInTheDocument()

    rerender(<ProjectDetailLayout project={tuner!} />)
    expect(screen.getByText('Academic Projects')).toBeInTheDocument()
    expect(screen.getByText('Technical University of Cluj-Napoca (UTCN)')).toBeInTheDocument()
  })

  it('omits missing case-study sections and keeps sparse projects navigable', () => {
    const project = getPublishedProjects().find(({ id }) => id === 'ai-recipe')
    expect(project).toBeDefined()
    render(<ProjectDetailLayout project={project!} />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'AI Recipe' })).toBeInTheDocument()
    expect(
      screen.getByText('Further case-study details are not available for public display.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Architecture' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Projects' })).toHaveAttribute(
      'href',
      '/#portfolio',
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders only the supplied accessible media alternative and preserves layout after failure', () => {
    const project = getPublishedProjects()[0]
    const withMedia = {
      ...project,
      media: [
        {
          src: '/projects/drivewise.png' as const,
          width: 800,
          height: 600,
          alt: 'Drivewise interface screenshot',
        },
      ],
    }
    const { container } = render(<ProjectDetailLayout project={withMedia} />)
    const image = screen.getByRole('img', { name: 'Drivewise interface screenshot' })
    const frame = container.querySelector('.project-media-frame')
    expect(frame).toHaveStyle({ aspectRatio: '800 / 600' })

    fireEvent.error(image)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('.project-media-frame')).toBe(frame)
    expect(frame?.querySelector('[data-media-failed="true"]')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Drivewise' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Projects' })).toBeInTheDocument()
  })

  it('uses empty alt text only for explicitly decorative media', () => {
    const project = getPublishedProjects()[0]
    const withMedia = {
      ...project,
      media: [
        {
          src: '/projects/decoration.png' as const,
          width: 480,
          height: 360,
          alt: '',
          decorative: true,
        },
      ],
    }
    const { container } = render(<ProjectDetailLayout project={withMedia} />)
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })
})
