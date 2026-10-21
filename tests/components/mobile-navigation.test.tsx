import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNavigation } from '@/components/layout/mobile-navigation'

describe('MobileNavigation', () => {
  it('opens an accessible dialog and returns focus when closed', async () => {
    const user = userEvent.setup()
    render(<MobileNavigation />)
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    const dialog = await screen.findByRole('dialog', { name: 'Primary navigation' })
    expect(dialog).toBeVisible()
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeVisible()
    for (let index = 0; index < 7; index += 1) await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())

    await user.click(trigger)
    const reopenedDialog = await screen.findByRole('dialog', { name: 'Primary navigation' })
    await user.click(screen.getByRole('button', { name: 'Close menu' }))
    await waitFor(() => expect(reopenedDialog).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('closes after selecting a destination', async () => {
    const user = userEvent.setup()
    render(<MobileNavigation />)
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(await screen.findByRole('link', { name: 'About' }))
    expect(window.location.hash).toBe('#about')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
