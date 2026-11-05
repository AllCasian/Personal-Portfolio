'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type CopyStatus = 'success' | 'failure' | null

export function CopyEmailAction({ email }: { email: string }) {
  const [ready, setReady] = useState(false)
  const [status, setStatus] = useState<CopyStatus>(null)

  useEffect(() => {
    const readinessTimer = window.setTimeout(() => setReady(true), 0)
    return () => window.clearTimeout(readinessTimer)
  }, [])

  async function copyEmail() {
    if (!ready) return

    try {
      const clipboard = navigator.clipboard
      if (!clipboard?.writeText) throw new Error('Clipboard API is unavailable')
      await clipboard.writeText(email)
      setStatus('success')
    } catch {
      setStatus('failure')
    }
  }

  return (
    <>
      <Button
        className="copy-email-action"
        variant="secondary"
        type="button"
        hidden={!ready}
        data-copy-ready={ready}
        onClick={copyEmail}
      >
        Copy email
      </Button>
      <span className="copy-email-status" role="status" aria-live="polite" aria-atomic="true">
        {status === 'success'
          ? 'Email copied'
          : status === 'failure'
            ? 'Unable to copy email. Select it to copy manually.'
            : ''}
      </span>
    </>
  )
}
