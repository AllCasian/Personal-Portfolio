const sectionIds = new Set([
  'home',
  'about',
  'portfolio',
  'experience',
  'education',
  'skills',
  'contact',
])

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
  const header = documentRoot.querySelector<HTMLElement>('.site-header')
  const navigationContext = documentRoot.querySelector<HTMLElement>('[data-navigation-context]')
    ?.dataset.navigationContext
  let previousScrollY = browserWindow.scrollY
  let directionBaselineY = previousScrollY
  let scrollDirection = 0
  let pendingFrame: number | null = null
  let initialAnchorPending = Boolean(browserWindow.location.hash)

  function setHeaderVisibility(visible: boolean) {
    if (!header) return
    header.dataset.navVisibility = visible ? 'visible' : 'hidden'
  }

  function resetVisibilityBaseline() {
    previousScrollY = browserWindow.scrollY
    directionBaselineY = previousScrollY
    scrollDirection = 0
  }

  function navigationIsLocked() {
    return Boolean(
      header?.contains(documentRoot.activeElement) ||
      dialog.open ||
      trigger.getAttribute('aria-expanded') === 'true',
    )
  }

  function updateVisibilityFromScroll() {
    pendingFrame = null
    const currentScrollY = Math.max(0, browserWindow.scrollY)
    const isShortPage = documentRoot.documentElement.scrollHeight <= browserWindow.innerHeight

    if (currentScrollY <= 16 || isShortPage || navigationIsLocked()) {
      setHeaderVisibility(true)
      resetVisibilityBaseline()
      return
    }

    if (initialAnchorPending) {
      setHeaderVisibility(true)
      resetVisibilityBaseline()
      const target = documentRoot.getElementById(browserWindow.location.hash.slice(1))
      const targetTop = target?.getBoundingClientRect().top
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0
      if (
        targetTop !== undefined &&
        currentScrollY > 16 &&
        targetTop >= headerBottom &&
        targetTop <= browserWindow.innerHeight
      ) {
        initialAnchorPending = false
      }
      return
    }

    const movement = currentScrollY - previousScrollY
    if (movement === 0) return

    const nextDirection = Math.sign(movement)
    if (nextDirection !== scrollDirection) {
      scrollDirection = nextDirection
      directionBaselineY = previousScrollY
    }
    previousScrollY = currentScrollY

    if (Math.abs(currentScrollY - directionBaselineY) < 12) return
    if (currentScrollY <= 64) {
      if (scrollDirection < 0) setHeaderVisibility(true)
      else directionBaselineY = currentScrollY
      return
    }

    setHeaderVisibility(scrollDirection < 0)
  }

  function queueVisibilityUpdate() {
    if (pendingFrame !== null) return
    pendingFrame = browserWindow.requestAnimationFrame(updateVisibilityFromScroll)
  }

  function revealForInteraction() {
    setHeaderVisibility(true)
    resetVisibilityBaseline()
  }

  function revealForLocationChange() {
    initialAnchorPending = false
    revealForInteraction()
    syncCurrentDestination()
  }

  function syncCurrentDestination() {
    const hash = browserWindow.location.hash.slice(1)
    const current =
      navigationContext === 'project'
        ? 'portfolio'
        : navigationContext === 'none'
          ? undefined
          : sectionIds.has(hash)
            ? hash
            : 'home'

    documentRoot.querySelectorAll('[data-section-link]').forEach((link) => {
      const active = current !== undefined && link.getAttribute('data-section-link') === current
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

  function handleHeaderFocus() {
    revealForInteraction()
  }

  function handleViewportResize() {
    if (documentRoot.documentElement.scrollHeight <= browserWindow.innerHeight) {
      revealForInteraction()
    }
  }

  trigger.addEventListener('click', openDialog)
  dialog.addEventListener('click', handleDialogClick)
  dialog.addEventListener('close', handleDialogClose)
  header?.addEventListener('focusin', handleHeaderFocus)
  browserWindow.addEventListener('scroll', queueVisibilityUpdate, { passive: true })
  browserWindow.addEventListener('resize', handleViewportResize)
  browserWindow.addEventListener('hashchange', revealForLocationChange)
  browserWindow.addEventListener('popstate', revealForLocationChange)
  setHeaderVisibility(true)
  syncCurrentDestination()
  documentRoot.documentElement.classList.add('has-js')

  return () => {
    trigger.removeEventListener('click', openDialog)
    dialog.removeEventListener('click', handleDialogClick)
    dialog.removeEventListener('close', handleDialogClose)
    header?.removeEventListener('focusin', handleHeaderFocus)
    browserWindow.removeEventListener('scroll', queueVisibilityUpdate)
    browserWindow.removeEventListener('resize', handleViewportResize)
    browserWindow.removeEventListener('hashchange', revealForLocationChange)
    browserWindow.removeEventListener('popstate', revealForLocationChange)
    if (pendingFrame !== null) browserWindow.cancelAnimationFrame(pendingFrame)
    pendingFrame = null
    if (dialog.open) dialog.close()
    trigger.setAttribute('aria-expanded', 'false')
    header?.removeAttribute('data-nav-visibility')
    documentRoot.documentElement.classList.remove('has-js')
  }
}
