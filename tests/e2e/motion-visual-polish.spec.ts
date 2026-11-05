import { expect, test } from '@playwright/test'

const approvedProjects = [
  ['drivewise', 'Drivewise'],
  ['smart-librarian', 'Smart Librarian'],
  ['etl-pipeline', 'ETL Pipeline'],
  ['automatic-guitar-tuner', 'Automatic Guitar Tuner'],
  ['energy-management-system', 'Energy Management System'],
  ['ai-recipe', 'AI Recipe'],
] as const

test('server HTML renders reveal candidates without pending or hidden state', async ({ page }) => {
  const response = await page.request.get('/')
  const html = await response.text()

  expect(response.ok()).toBe(true)
  expect(html).toContain('data-motion-reveal')
  expect(html).not.toMatch(/\sdata-motion-reveal-state="(?:pending|revealed)"/)
  expect(html).toContain('id="portfolio"')
  expect(html).toContain('id="contact"')
})

test('reveals are one-time, quick-scroll safe, and project groups use bounded stagger', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 520 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/has-js/)

  const pending = page.locator('[data-motion-reveal-state="pending"]')
  await expect(pending.first()).toBeAttached()

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(pending).toHaveCount(0)
  const revealed = page.locator('[data-motion-reveal-state="revealed"]')
  await expect(revealed.first()).toBeAttached()
  const cardDelays = await page
    .locator('.project-card')
    .evaluateAll((cards) =>
      cards.slice(0, 3).map((card) => getComputedStyle(card).transitionDelay.split(',')[0].trim()),
    )
  const delayMilliseconds = cardDelays.map((delay) => {
    const value = parseFloat(delay)
    return delay.endsWith('ms') ? value : value * 1000
  })
  expect(delayMilliseconds).toEqual([0, 60, 120])
  expect(delayMilliseconds[2]).toBeLessThanOrEqual(300)

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(revealed.first()).toBeAttached()
  await expect(page.getByRole('link', { name: 'View details for Drivewise' })).toBeVisible()
})

test('direct portfolio hash keeps its heading and project content immediately available', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#portfolio')

  await expect(page.locator('html')).toHaveClass(/has-js/)
  await expect(page.getByRole('heading', { level: 2, name: 'Portfolio' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Drivewise' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View details for Drivewise' })).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: 'Primary' }).locator('[aria-current]'),
  ).toHaveCount(1)
})

test('all six project cards keep distinct links and coordinated hover/focus affordances', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#portfolio')
  const cards = page.locator('.project-card')
  await expect(cards).toHaveCount(6)

  for (let index = 0; index < approvedProjects.length; index += 1) {
    const [slug, title] = approvedProjects[index]
    const card = cards.nth(index)
    const detailsLink = card.getByRole('link', { name: `View details for ${title}` })
    const initialLayout = await card.evaluate((element) => ({
      top: (element as HTMLElement).offsetTop,
      height: (element as HTMLElement).offsetHeight,
    }))

    await expect(detailsLink).toHaveAttribute('href', `/projects/${slug}`)
    await card.hover()
    await expect(card).toHaveCSS('border-color', 'rgb(128, 149, 255)')
    await expect
      .poll(() =>
        card.evaluate((element) => ({
          top: (element as HTMLElement).offsetTop,
          height: (element as HTMLElement).offsetHeight,
        })),
      )
      .toEqual(initialLayout)

    await page.mouse.move(0, 0)
    await detailsLink.evaluate((link) =>
      (link as HTMLElement).focus({ focusVisible: true } as FocusOptions),
    )
    await expect(detailsLink).toBeFocused()
    await expect(card).toHaveCSS('border-color', 'rgb(128, 149, 255)')
    await expect(detailsLink).toHaveCSS('outline-style', 'solid')
  }
})

test('touch users can open project details without hover styling', async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: String(test.info().project.use.baseURL),
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
  })
  const page = await context.newPage()
  await page.goto('/#portfolio')
  const link = page.getByRole('link', { name: 'View details for Drivewise' })
  const box = await link.boundingBox()
  expect(box).not.toBeNull()
  await link.tap()
  await expect(page).toHaveURL(/\/projects\/drivewise$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Drivewise' })).toBeVisible()
  await context.close()
})

test('Hero sequence is ordered, bounded, stable, and reduced motion is immediate', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const hero = page.locator('#home')
  const initial = await hero.evaluate((element) => {
    const name = element.querySelector('.hero-name')!
    const role = element.querySelector('.hero-role')!
    const intro = element.querySelector('.hero-intro')!
    const actions = element.querySelector('.hero-action-group')!
    const style = (node: Element) => getComputedStyle(node)
    const box = (node: Element) => {
      const rect = node.getBoundingClientRect()
      return { top: rect.top + window.scrollY, height: rect.height }
    }
    const animationEnd = (node: Element) => {
      const computed = style(node)
      return parseFloat(computed.animationDelay) + parseFloat(computed.animationDuration)
    }
    const rootStyles = getComputedStyle(document.documentElement)

    return {
      order: [box(name).top, box(role).top, box(intro).top, box(actions).top],
      offsets: [box(name), box(role), box(intro), box(actions)],
      animationEnd: Math.max(...[name, role, intro, actions].map(animationEnd)),
      interactionDuration: rootStyles.getPropertyValue('--motion-duration-interaction').trim(),
      revealDuration: rootStyles.getPropertyValue('--motion-duration-reveal').trim(),
      staggerStep: rootStyles.getPropertyValue('--motion-stagger-step').trim(),
      accent: style(role).backgroundImage,
      iterationCount: style(role).animationIterationCount,
    }
  })
  expect(initial.order[0]).toBeLessThan(initial.order[1])
  expect(initial.order[1]).toBeLessThan(initial.order[2])
  expect(initial.order[2]).toBeLessThan(initial.order[3])
  expect(initial.animationEnd).toBeLessThanOrEqual(0.7)
  const toMilliseconds = (value: string) => {
    const amount = parseFloat(value)
    return value.endsWith('ms') ? amount : amount * 1000
  }
  expect(toMilliseconds(initial.interactionDuration)).toBe(220)
  expect(toMilliseconds(initial.revealDuration)).toBe(420)
  expect(toMilliseconds(initial.staggerStep)).toBe(60)
  expect(initial.accent).toContain('linear-gradient')
  expect(initial.iterationCount).toBe('1')
  await expect(page.getByRole('link', { name: 'View Projects' })).toBeVisible()

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('[data-motion-reveal-state="pending"]')).toHaveCount(0)
  await expect
    .poll(() => page.locator('.hero-role').evaluate((element) => getComputedStyle(element).opacity))
    .toBe('1')
  await expect(page.locator('.hero-role')).toHaveCSS('transform', 'none')
  await expect(page.locator('.hero-role')).toHaveCSS('animation-name', 'none')
  await expect(page.getByRole('link', { name: 'View Projects' })).toBeVisible()
})

test('server-rendered motion content and existing actions work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: String(test.info().project.use.baseURL),
    javaScriptEnabled: false,
  })
  const page = await context.newPage()
  const response = await page.goto('/')
  const html = await response?.text()

  expect(html).toContain('data-motion-reveal')
  expect(html).not.toMatch(/\sdata-motion-reveal-state="(?:pending|revealed)"/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View Projects' })).toHaveAttribute(
    'href',
    '#portfolio',
  )
  await expect(page.getByRole('link', { name: 'View details for Drivewise' })).toBeVisible()
  await context.close()
})

test('delayed or blocked motion JavaScript leaves content visible before hydration', async ({
  page,
}) => {
  await page.route('**/_next/static/chunks/**', async (route) => {
    await route.abort()
  })
  const response = await page.goto('/')
  const html = await response?.text()

  expect(html).not.toMatch(/\sdata-motion-reveal-state="(?:pending|revealed)"/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View Projects' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View details for Drivewise' })).toBeVisible()
})

test('IntersectionObserver initialization failure fails open', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeObserver = window.IntersectionObserver
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: class extends NativeObserver {
        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          if (!options) throw new Error('motion observer initialization failed')
          super(callback, options)
        }
      },
    })
  })
  await page.setViewportSize({ width: 1440, height: 520 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/has-js/)
  await expect(page.locator('[data-motion-reveal-state="pending"]')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Drivewise' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View details for Drivewise' })).toBeVisible()
})

test('an unavailable IntersectionObserver leaves reveal content visible', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      value: undefined,
    })
  })
  await page.setViewportSize({ width: 1440, height: 520 })
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/has-js/)
  await expect(page.locator('[data-motion-reveal-state="pending"]')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Drivewise' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View details for Drivewise' })).toBeVisible()
})

test('all project detail routes retain content and the existing Portfolio navigation owner', async ({
  page,
}) => {
  for (const [slug, title] of approvedProjects) {
    const response = await page.goto(`/projects/${slug}`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
    const nav = page.getByRole('navigation', { name: 'Primary' })
    await expect(nav.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
      'aria-current',
      'location',
    )
    await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
  }
})

test('project detail browser history returns to the correct portfolio hash state', async ({
  page,
}) => {
  await page.goto('/#portfolio')
  await page.getByRole('link', { name: 'View details for Drivewise' }).click()
  await expect(page).toHaveURL(/\/projects\/drivewise$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/#portfolio$/)
  await expect(
    page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Portfolio' }),
  ).toHaveAttribute('aria-current', 'location')
})
