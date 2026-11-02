import { initializeNavigation } from '@/lib/navigation-enhancement'

describe('progressive navigation state', () => {
  it('synchronizes current locations from direct hashes and browser history', () => {
    document.documentElement.className = ''
    document.body.innerHTML = `
      <button id="mobile-navigation-trigger" aria-expanded="false"></button>
      <dialog id="mobile-navigation-dialog"><button data-menu-close></button></dialog>
      <nav aria-label="Primary">${['home', 'about', 'portfolio', 'contact']
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
})
