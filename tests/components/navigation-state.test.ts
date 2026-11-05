import { initializeNavigation } from '@/lib/navigation-enhancement'
import { vi } from 'vitest'

function mountScrollableNavigation() {
  const scrollHeightDescriptor = Object.getOwnPropertyDescriptor(
    document.documentElement,
    'scrollHeight',
  )
  const innerHeightDescriptor = Object.getOwnPropertyDescriptor(window, 'innerHeight')
  const scrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY')
  document.documentElement.className = ''
  document.body.innerHTML = `
    <header class="site-header" data-navigation-context="home">
      <a href="#home" data-section-link="home">Home</a>
      <button id="mobile-navigation-trigger" aria-expanded="false"></button>
      <dialog id="mobile-navigation-dialog"><button data-menu-close></button></dialog>
      <nav aria-label="Primary"><a href="#portfolio" data-section-link="portfolio">Portfolio</a></nav>
    </header>
  `
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: 2400,
  })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
  Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 })

  let pendingFrame: FrameRequestCallback | undefined
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    pendingFrame = callback
    return 1
  })
  const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

  return {
    header: document.querySelector<HTMLElement>('.site-header')!,
    cancelFrame,
    scrollTo(y: number) {
      Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: y })
      window.dispatchEvent(new Event('scroll'))
      const callback = pendingFrame
      pendingFrame = undefined
      callback?.(0)
    },
    dispose() {
      vi.restoreAllMocks()
      if (scrollHeightDescriptor)
        Object.defineProperty(document.documentElement, 'scrollHeight', scrollHeightDescriptor)
      else Reflect.deleteProperty(document.documentElement, 'scrollHeight')
      if (innerHeightDescriptor) Object.defineProperty(window, 'innerHeight', innerHeightDescriptor)
      else Reflect.deleteProperty(window, 'innerHeight')
      if (scrollYDescriptor) Object.defineProperty(window, 'scrollY', scrollYDescriptor)
      else Reflect.deleteProperty(window, 'scrollY')
    },
  }
}

describe('progressive navigation state', () => {
  it('keeps the header visible through the 16px top region and until 12px intentional travel beyond 64px', () => {
    const fixture = mountScrollableNavigation()
    const cleanup = initializeNavigation()

    fixture.scrollTo(64)
    expect(fixture.header).toHaveAttribute('data-nav-visibility', 'visible')
    fixture.scrollTo(71)
    expect(fixture.header).toHaveAttribute('data-nav-visibility', 'visible')
    fixture.scrollTo(76)
    expect(fixture.header).toHaveAttribute('data-nav-visibility', 'hidden')
    fixture.scrollTo(16)
    expect(fixture.header).toHaveAttribute('data-nav-visibility', 'visible')

    cleanup()
    fixture.dispose()
  })

  it('ignores sub-threshold reversals and reveals after 12px upward travel', () => {
    const fixture = mountScrollableNavigation()
    const cleanup = initializeNavigation()

    fixture.scrollTo(100)
    expect(fixture.header).toHaveAttribute('data-nav-visibility', 'hidden')
    fixture.scrollTo(95)
    expect(fixture.header).toHaveAttribute('data-nav-visibility', 'hidden')
    fixture.scrollTo(88)
    expect(fixture.header).toHaveAttribute('data-nav-visibility', 'visible')

    cleanup()
    fixture.dispose()
  })

  it('stays visible on short pages and cancels a pending animation frame during cleanup', () => {
    const fixture = mountScrollableNavigation()
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 700,
    })
    const cleanup = initializeNavigation()

    fixture.scrollTo(200)
    expect(fixture.header).toHaveAttribute('data-nav-visibility', 'visible')

    window.dispatchEvent(new Event('scroll'))
    cleanup()
    expect(fixture.cancelFrame).toHaveBeenCalled()
    fixture.dispose()
  })

  it('uses server-rendered project route context instead of incorrectly defaulting to Home', () => {
    document.documentElement.className = ''
    document.body.innerHTML = `
      <header data-navigation-context="project"></header>
      <button id="mobile-navigation-trigger" aria-expanded="false"></button>
      <dialog id="mobile-navigation-dialog"><button data-menu-close></button></dialog>
      <nav aria-label="Primary">${[
        'home',
        'about',
        'portfolio',
        'experience',
        'education',
        'skills',
        'contact',
      ]
        .map((id) => `<a href="/#${id}" data-section-link="${id}">${id}</a>`)
        .join('')}</nav>
    `
    window.history.replaceState(null, '', '/projects/drivewise')
    const cleanup = initializeNavigation()

    const navigation = document.querySelector('nav[aria-label="Primary"]')
    expect(navigation?.querySelector('[aria-current="location"]')).toHaveTextContent('portfolio')
    expect(navigation?.querySelectorAll('[aria-current="location"]')).toHaveLength(1)
    expect(navigation?.querySelector('[data-section-link="home"]')).not.toHaveAttribute(
      'aria-current',
    )

    cleanup()
    window.history.replaceState(null, '', '/')
  })

  it('synchronizes current locations from direct hashes and browser history', () => {
    document.documentElement.className = ''
    document.body.innerHTML = `
      <button id="mobile-navigation-trigger" aria-expanded="false"></button>
      <dialog id="mobile-navigation-dialog"><button data-menu-close></button></dialog>
      <nav aria-label="Primary">${[
        'home',
        'about',
        'portfolio',
        'experience',
        'education',
        'skills',
        'contact',
      ]
        .map((id) => `<a href="#${id}" data-section-link="${id}">${id}</a>`)
        .join('')}</nav>
      <nav aria-label="Primary">${['home', 'about', 'portfolio', 'contact']
        .map((id) => `<a href="#${id}" data-section-link="${id}">${id}</a>`)
        .join('')}</nav>
    `
    window.history.replaceState(null, '', '/#about')
    const cleanup = initializeNavigation()

    const primaryNavigations = [...document.querySelectorAll('nav[aria-label="Primary"]')]
    for (const navigation of primaryNavigations) {
      expect(navigation.querySelector('[aria-current="location"]')).toHaveTextContent('about')
      expect(navigation.querySelectorAll('[aria-current="location"]')).toHaveLength(1)
    }

    window.history.pushState(null, '', '/#contact')
    window.dispatchEvent(new PopStateEvent('popstate'))

    for (const navigation of primaryNavigations) {
      expect(navigation.querySelector('[aria-current="location"]')).toHaveTextContent('contact')
      expect(navigation.querySelectorAll('[aria-current="location"]')).toHaveLength(1)
    }

    cleanup()
  })

  it('supports all seven direct hashes while leaving passive scrolling out of state updates', () => {
    document.documentElement.className = ''
    document.body.innerHTML = `
      <button id="mobile-navigation-trigger" aria-expanded="false"></button>
      <dialog id="mobile-navigation-dialog"><button data-menu-close></button></dialog>
      <nav aria-label="Primary">${[
        'home',
        'about',
        'portfolio',
        'experience',
        'education',
        'skills',
        'contact',
      ]
        .map((id) => `<a href="#${id}" data-section-link="${id}">${id}</a>`)
        .join('')}</nav>
    `

    for (const destination of [
      'home',
      'about',
      'portfolio',
      'experience',
      'education',
      'skills',
      'contact',
    ]) {
      window.history.replaceState(null, '', `/#${destination}`)
      const cleanup = initializeNavigation()
      const navigation = document.querySelector('nav[aria-label="Primary"]')
      expect(navigation?.querySelectorAll('[aria-current="location"]')).toHaveLength(1)
      expect(navigation?.querySelector('[aria-current="location"]')).toHaveAttribute(
        'data-section-link',
        destination,
      )
      window.dispatchEvent(new Event('scroll'))
      expect(navigation?.querySelector('[aria-current="location"]')).toHaveAttribute(
        'data-section-link',
        destination,
      )
      cleanup()
    }
    window.history.replaceState(null, '', '/')
  })
})
