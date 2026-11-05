import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { CopyEmailAction } from '@/components/sections/copy-email-action'

const email = 'cristecasian@gmail.com'

function setClipboard(clipboard: Clipboard | undefined): void {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: clipboard,
  })
}

describe('CopyEmailAction', () => {
  it('renders hidden and unfocusable before hydration', () => {
    const markup = renderToStaticMarkup(<CopyEmailAction email={email} />)

    expect(markup).toContain('hidden=""')
    expect(markup).toContain('data-copy-ready="false"')
    expect(markup).not.toContain('owner-confirmed')
  })

  it('copies the exact email and announces success without moving focus', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    setClipboard({ writeText } as unknown as Clipboard)
    render(<CopyEmailAction email={email} />)

    const button = await screen.findByRole('button', { name: 'Copy email' })
    await waitFor(() => expect(button).not.toHaveAttribute('hidden'))
    button.focus()
    fireEvent.click(button)

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Email copied'))
    expect(writeText).toHaveBeenCalledWith(email)
    expect(document.activeElement).toBe(button)
  })

  it('announces failure when the clipboard request is rejected', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'))
    setClipboard({ writeText } as unknown as Clipboard)
    render(<CopyEmailAction email={email} />)

    const button = await screen.findByRole('button', { name: 'Copy email' })
    await waitFor(() => expect(button).not.toHaveAttribute('hidden'))
    button.focus()
    fireEvent.click(button)

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Unable to copy email. Select it to copy manually.',
      ),
    )
    expect(document.activeElement).toBe(button)
  })

  it('announces failure when the Clipboard API is unsupported', async () => {
    setClipboard(undefined)
    render(<CopyEmailAction email={email} />)

    const button = await screen.findByRole('button', { name: 'Copy email' })
    await waitFor(() => expect(button).not.toHaveAttribute('hidden'))
    button.focus()
    fireEvent.click(button)

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Unable to copy email. Select it to copy manually.',
      ),
    )
    expect(document.activeElement).toBe(button)
  })

  it('keeps the control hidden while the local readiness gate is false', () => {
    const markup = renderToStaticMarkup(<CopyEmailAction email={email} />)
    expect(markup).toContain('hidden=""')
    expect(markup).toContain('data-copy-ready="false"')
  })
})
