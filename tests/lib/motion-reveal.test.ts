import { initializeMotionReveals } from '@/lib/motion-reveal'

class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  static shouldThrowOnObserve = false
  readonly root: Element | Document | null = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]
  callback: IntersectionObserverCallback
  observed: Element[] = []
  disconnected = false
  unobserved: Element[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe = (target: Element) => {
    if (MockIntersectionObserver.shouldThrowOnObserve) throw new Error('observe failed')
    this.observed.push(target)
  }

  unobserve = (target: Element) => {
    this.unobserved.push(target)
  }

  disconnect = () => {
    this.disconnected = true
  }

  takeRecords = () => []

  trigger(target: Element) {
    const entry = {
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
      time: 0,
    } as IntersectionObserverEntry

    this.callback([entry], this)
  }
}

function setTop(element: HTMLElement, top: number) {
  element.getBoundingClientRect = () =>
    ({
      top,
      bottom: top + 20,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect
}

function setReducedMotion(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const media = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    setMatches(next: boolean) {
      this.matches = next
      for (const listener of listeners) listener({ matches: next } as MediaQueryListEvent)
    },
  }

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockReturnValue(media),
  })

  return media
}

describe('initializeMotionReveals', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = []
    MockIntersectionObserver.shouldThrowOnObserve = false
    document.body.innerHTML = `
      <section id="visible" data-motion-reveal>Visible group</section>
      <section id="below" data-motion-reveal>Below-fold group</section>
      <section id="above" data-motion-reveal>Above-fold group</section>
    `
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 })
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: MockIntersectionObserver,
    })
    setReducedMotion(false)
    setTop(document.querySelector<HTMLElement>('#visible')!, 20)
    setTop(document.querySelector<HTMLElement>('#below')!, 120)
    setTop(document.querySelector<HTMLElement>('#above')!, -40)
  })

  it('keeps server and initially visible content free of pending reveal state', () => {
    const visible = document.querySelector<HTMLElement>('#visible')!
    const pending = document.querySelector<HTMLElement>('#below')!
    const cleanup = initializeMotionReveals()

    expect(visible).not.toHaveAttribute('data-motion-reveal-state')
    expect(pending).toHaveAttribute('data-motion-reveal-state', 'pending')
    expect(MockIntersectionObserver.instances[0].observed).toEqual([pending])
    cleanup()
  })

  it('reveals only below-viewport targets once and unobserves them', () => {
    const below = document.querySelector<HTMLElement>('#below')!
    const cleanup = initializeMotionReveals()
    const observer = MockIntersectionObserver.instances[0]

    observer.trigger(below)
    observer.trigger(below)

    expect(below).toHaveAttribute('data-motion-reveal-state', 'revealed')
    expect(observer.unobserved).toEqual([below])
    expect(document.querySelector('#above')).not.toHaveAttribute('data-motion-reveal-state')
    cleanup()
  })

  it('fails open when IntersectionObserver is unavailable', () => {
    Object.defineProperty(window, 'IntersectionObserver', { configurable: true, value: undefined })
    const cleanup = initializeMotionReveals()

    expect(document.querySelector('#below')).not.toHaveAttribute('data-motion-reveal-state')
    expect(MockIntersectionObserver.instances).toHaveLength(0)
    cleanup()
  })

  it('fails open when observer construction throws', () => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: class {
        constructor() {
          throw new Error('construction failed')
        }
      },
    })
    const cleanup = initializeMotionReveals()

    expect(document.querySelector('#below')).not.toHaveAttribute('data-motion-reveal-state')
    cleanup()
  })

  it('clears pending states if observing a target throws', () => {
    MockIntersectionObserver.shouldThrowOnObserve = true
    const cleanup = initializeMotionReveals()

    expect(document.querySelector('#below')).not.toHaveAttribute('data-motion-reveal-state')
    expect(MockIntersectionObserver.instances[0].disconnected).toBe(true)
    MockIntersectionObserver.shouldThrowOnObserve = false
    cleanup()
  })

  it('does not initialize reveals when reduced motion is already requested', () => {
    setReducedMotion(true)
    const cleanup = initializeMotionReveals()

    expect(document.querySelector('#below')).not.toHaveAttribute('data-motion-reveal-state')
    expect(MockIntersectionObserver.instances).toHaveLength(0)
    cleanup()
  })

  it('exposes pending content immediately if reduced motion is enabled during the visit', () => {
    const below = document.querySelector('#below')!
    const media = setReducedMotion(false)
    const cleanup = initializeMotionReveals()

    media.setMatches(true)

    expect(below).not.toHaveAttribute('data-motion-reveal-state', 'pending')
    expect(MockIntersectionObserver.instances[0].disconnected).toBe(true)
    cleanup()
  })

  it('permanently exposes a pending group when a descendant receives focus', () => {
    const below = document.querySelector<HTMLElement>('#below')!
    below.innerHTML = '<a href="#destination">Continue</a>'
    const cleanup = initializeMotionReveals()

    below.querySelector('a')!.focus()

    expect(below).toHaveAttribute('data-motion-reveal-state', 'revealed')
    expect(MockIntersectionObserver.instances[0].unobserved).toContain(below)
    cleanup()
  })

  it('does not pend a direct hash destination', () => {
    window.history.replaceState(null, '', '#deep-link')
    const below = document.querySelector<HTMLElement>('#below')!
    below.id = 'deep-link'
    const cleanup = initializeMotionReveals()

    expect(below).not.toHaveAttribute('data-motion-reveal-state')
    cleanup()
    window.history.replaceState(null, '', window.location.pathname)
  })

  it('clears temporary pending states when the enhancement is cleaned up', () => {
    const below = document.querySelector<HTMLElement>('#below')!
    const cleanup = initializeMotionReveals()

    cleanup()

    expect(below).not.toHaveAttribute('data-motion-reveal-state', 'pending')
    expect(MockIntersectionObserver.instances[0].disconnected).toBe(true)
  })
})
