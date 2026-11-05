import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { MotionRevealEnhancement } from '@/components/motion/motion-reveal-enhancement'
import * as motionReveal from '@/lib/motion-reveal'

describe('MotionRevealEnhancement', () => {
  it('renders no markup on the server', () => {
    expect(renderToString(<MotionRevealEnhancement />)).toBe('')
  })

  it('initializes the shared browser enhancer and cleans it up on unmount', () => {
    const cleanup = vi.fn()
    const initialize = vi.spyOn(motionReveal, 'initializeMotionReveals').mockReturnValue(cleanup)
    const { container, unmount } = render(<MotionRevealEnhancement />)

    expect(container).toBeEmptyDOMElement()
    expect(initialize).toHaveBeenCalledTimes(1)
    unmount()
    expect(cleanup).toHaveBeenCalledTimes(1)

    initialize.mockRestore()
  })
})
