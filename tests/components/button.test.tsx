import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('exposes its accessible name and keyboard focus', async () => {
    const user = userEvent.setup()
    render(<Button>Continue</Button>)
    const button = screen.getByRole('button', { name: 'Continue' })
    await user.tab()
    expect(button).toHaveFocus()
    expect(button).toBeEnabled()
  })

  it('supports disabled state', () => {
    render(<Button disabled>Unavailable</Button>)
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled()
  })
})
