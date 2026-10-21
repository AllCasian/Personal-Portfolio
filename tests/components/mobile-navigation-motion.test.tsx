import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNavigation } from '@/components/layout/mobile-navigation'

describe('reduced motion navigation', () => {
  it('opens the mobile panel without motion when the preference requests it', async () => {
    const media = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    vi.stubGlobal('matchMedia', media)
    const user = userEvent.setup()
    render(<MobileNavigation />)
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const panel = await screen.findByRole('dialog', { name: 'Primary navigation' })
    await waitFor(() => expect(panel).toHaveStyle({ transform: 'none' }))
    expect(media).toHaveBeenCalledWith('(prefers-reduced-motion)')
    vi.unstubAllGlobals()
  })
})
