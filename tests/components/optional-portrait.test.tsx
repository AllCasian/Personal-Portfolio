import { fireEvent, render, screen } from '@testing-library/react'
import { OptionalPortrait } from '@/components/sections/optional-portrait'

describe('OptionalPortrait', () => {
  it('uses an accessible image and falls back without changing its frame on load failure', () => {
    const { container } = render(
      <OptionalPortrait src="/images/verified-portrait.jpg" alt="Developer" />,
    )
    const frame = container.querySelector('.portrait-frame')
    expect(frame).toBeInTheDocument()
    const image = screen.getByRole('img', { name: 'Developer' })
    fireEvent.error(image)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Abstract visual')).toBeInTheDocument()
    expect(container.querySelector('.portrait-frame')).toBe(frame)
  })
})
