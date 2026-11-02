const sectionIds = new Set(['home', 'about', 'portfolio', 'contact'])

export function initializeNavigation(documentRoot: Document = document): () => void {
  const view = documentRoot.defaultView
  if (!view) return () => {}
  const browserWindow = view

  const dialogElement = documentRoot.getElementById('mobile-navigation-dialog')
  const triggerElement = documentRoot.getElementById('mobile-navigation-trigger')
  if (!(dialogElement instanceof browserWindow.HTMLDialogElement)) return () => {}
  if (!(triggerElement instanceof browserWindow.HTMLButtonElement)) return () => {}

  const dialog = dialogElement
  const trigger = triggerElement

  function syncCurrentDestination() {
    const hash = browserWindow.location.hash.slice(1)
    const current = sectionIds.has(hash) ? hash : 'home'

    documentRoot.querySelectorAll('[data-section-link]').forEach((link) => {
      const active = link.getAttribute('data-section-link') === current
      link.classList.toggle('is-active', active)

      if (active) {
        link.setAttribute('aria-current', 'location')
      } else {
        link.removeAttribute('aria-current')
      }
    })
  }

  function openDialog() {
    if (dialog.open) return
    dialog.showModal()
    trigger.setAttribute('aria-expanded', 'true')
    dialog.querySelector<HTMLElement>('[data-menu-close]')?.focus()
  }

  function handleDialogClick(event: MouseEvent) {
    if (!(event.target instanceof browserWindow.Element)) return

    const link = event.target.closest('[data-section-link], [data-menu-destination]')
    if (!link || !dialog.contains(link)) return

    const destination =
      link.getAttribute('data-section-link') ?? link.getAttribute('data-menu-destination')
    if (destination && sectionIds.has(destination)) {
      dialog.dataset.focusDestination = destination
    }

    dialog.close()
  }

  function handleDialogClose() {
    trigger.setAttribute('aria-expanded', 'false')
    const destination = dialog.dataset.focusDestination
    delete dialog.dataset.focusDestination

    browserWindow.setTimeout(() => {
      const heading = destination
        ? documentRoot.getElementById(destination)?.querySelector('h1, h2')
        : null

      if (heading instanceof browserWindow.HTMLElement) {
        heading.focus({ preventScroll: true })
      } else {
        trigger.focus()
      }
    }, 0)
  }

  trigger.addEventListener('click', openDialog)
  dialog.addEventListener('click', handleDialogClick)
  dialog.addEventListener('close', handleDialogClose)
  browserWindow.addEventListener('hashchange', syncCurrentDestination)
  browserWindow.addEventListener('popstate', syncCurrentDestination)
  syncCurrentDestination()
  documentRoot.documentElement.classList.add('has-js')

  return () => {
    trigger.removeEventListener('click', openDialog)
    dialog.removeEventListener('click', handleDialogClick)
    dialog.removeEventListener('close', handleDialogClose)
    browserWindow.removeEventListener('hashchange', syncCurrentDestination)
    browserWindow.removeEventListener('popstate', syncCurrentDestination)
    if (dialog.open) dialog.close()
    trigger.setAttribute('aria-expanded', 'false')
    documentRoot.documentElement.classList.remove('has-js')
  }
}
