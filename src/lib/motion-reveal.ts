const revealSelector = '[data-motion-reveal]'
const revealStateAttribute = 'data-motion-reveal-state'

export function initializeMotionReveals(documentRoot: Document = document): () => void {
  const browserWindow = documentRoot.defaultView as Window | null
  if (!browserWindow) return () => {}
  const view = browserWindow as Window & typeof globalThis

  let reduceMotion: MediaQueryList
  try {
    reduceMotion = view.matchMedia('(prefers-reduced-motion: reduce)')
  } catch {
    return () => {}
  }

  if (reduceMotion.matches) return () => {}

  const targets = Array.from(documentRoot.querySelectorAll<HTMLElement>(revealSelector))
  if (targets.length === 0 || view.innerHeight <= 0) return () => {}

  const pending = new Set<HTMLElement>()
  let observer: IntersectionObserver | undefined
  let active = true

  function clearPending() {
    for (const target of pending) target.removeAttribute(revealStateAttribute)
    pending.clear()
  }

  function expose(target: HTMLElement) {
    if (!pending.delete(target)) return
    target.setAttribute(revealStateAttribute, 'revealed')
    try {
      observer?.unobserve(target)
    } catch {
      clearPending()
      observer?.disconnect()
    }
  }

  function failOpen() {
    clearPending()
    observer?.disconnect()
  }

  function targetForCurrentHash() {
    const id = view.location.hash.slice(1)
    if (!id) return null

    try {
      return documentRoot.getElementById(decodeURIComponent(id))
    } catch {
      return null
    }
  }

  function exposeHashTarget() {
    const hashTarget = targetForCurrentHash()
    if (!hashTarget) return

    for (const target of pending) {
      if (target === hashTarget || target.contains(hashTarget) || hashTarget.contains(target)) {
        expose(target)
      }
    }
  }

  function handleFocusIn(event: FocusEvent) {
    if (!(event.target instanceof view.Element)) return
    const target = event.target.closest<HTMLElement>(revealSelector)
    if (target) expose(target)
  }

  function handleReducedMotionChange(event: MediaQueryListEvent) {
    if (!event.matches) return
    failOpen()
  }

  function handleIntersections(entries: IntersectionObserverEntry[]) {
    if (!active) return

    try {
      const intersecting = new Set(
        entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target)
          .filter((target): target is HTMLElement => target instanceof view.HTMLElement),
      )

      for (const target of pending) {
        if (intersecting.has(target) || target.getBoundingClientRect().bottom <= 0) expose(target)
      }
    } catch {
      failOpen()
    }
  }

  function cleanup() {
    active = false
    observer?.disconnect()
    clearPending()
    documentRoot.removeEventListener('focusin', handleFocusIn)
    view.removeEventListener('hashchange', exposeHashTarget)
    view.removeEventListener('resize', failOpen)
    if (typeof reduceMotion.removeEventListener === 'function') {
      reduceMotion.removeEventListener('change', handleReducedMotionChange)
    } else {
      reduceMotion.removeListener(handleReducedMotionChange)
    }
  }

  try {
    if (typeof view.IntersectionObserver !== 'function') return () => {}
    const sharedObserver = new view.IntersectionObserver(handleIntersections)
    observer = sharedObserver

    const hashTarget = targetForCurrentHash()
    for (const target of targets) {
      const bounds = target.getBoundingClientRect()
      const isBelowViewport = bounds.top > view.innerHeight
      const containsDirectTarget =
        hashTarget !== null &&
        (target === hashTarget || target.contains(hashTarget) || hashTarget.contains(target))

      if (!isBelowViewport || containsDirectTarget) continue

      target.setAttribute(revealStateAttribute, 'pending')
      pending.add(target)
      sharedObserver.observe(target)
    }

    documentRoot.addEventListener('focusin', handleFocusIn)
    view.addEventListener('hashchange', exposeHashTarget)
    view.addEventListener('resize', failOpen, { once: true })
    if (typeof reduceMotion.addEventListener === 'function') {
      reduceMotion.addEventListener('change', handleReducedMotionChange)
    } else {
      reduceMotion.addListener(handleReducedMotionChange)
    }
  } catch {
    failOpen()
    cleanup()
    return () => {}
  }
  return cleanup
}
