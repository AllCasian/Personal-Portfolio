import { expect, test, type Locator, type Page } from '@playwright/test'

async function expectCurrentDestination(navigation: Locator, destination: string) {
  const current = navigation.locator('[data-section-link][aria-current="location"]')
  await expect(current).toHaveCount(1)
  await expect(current).toHaveAttribute('data-section-link', destination)
}

async function scrollAndSettle(page: Page, y: number) {
  await page.evaluate((target) => window.scrollTo({ top: target, behavior: 'instant' }), y)
  await page.waitForFunction((target) => window.scrollY === target, y)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}

test('homepage hash navigation and browser history keep the current destination synchronized', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const navigation = page.locator('nav[aria-label="Primary"]:visible').first()
  await expectCurrentDestination(navigation, 'home')

  await page.getByRole('link', { name: 'Portfolio', exact: true }).first().click()
  await expect(page).toHaveURL(/#portfolio$/)
  await expectCurrentDestination(navigation, 'portfolio')

  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expectCurrentDestination(navigation, 'home')
  await page.goForward()
  await expect(page).toHaveURL(/#portfolio$/)
  await expectCurrentDestination(navigation, 'portfolio')
})

test('navbar visibility follows scroll direction without owning the active destination', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const header = page.locator('.site-header')
  const navigation = page.locator('.desktop-nav')
  await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
  await expectCurrentDestination(navigation, 'home')

  await scrollAndSettle(page, 64)
  await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
  await scrollAndSettle(page, 71)
  await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
  await scrollAndSettle(page, 76)
  await expect(header).toHaveAttribute('data-nav-visibility', 'hidden')
  await expectCurrentDestination(navigation, 'home')

  await scrollAndSettle(page, 71)
  await expect(header).toHaveAttribute('data-nav-visibility', 'hidden')
  await scrollAndSettle(page, 64)
  await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
  await expectCurrentDestination(navigation, 'home')

  await scrollAndSettle(page, 16)
  await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
})

test('anchor and history navigation reveal the header and keep targets below it', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByRole('link', { name: 'Contact Me' }).click()
  await expect(page).toHaveURL(/#contact$/)
  const header = page.locator('.site-header')
  await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
  const contactHeading = page.getByRole('heading', { name: 'Contact', exact: true })
  const headerBottom = await header.evaluate((element) => element.getBoundingClientRect().bottom)
  const headingTop = await contactHeading.evaluate((element) => element.getBoundingClientRect().top)
  expect(headingTop).toBeGreaterThanOrEqual(headerBottom)
  await expectCurrentDestination(page.locator('.desktop-nav'), 'contact')

  await page.goBack()
  await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
  await page.goForward()
  await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
  await expectCurrentDestination(page.locator('.desktop-nav'), 'contact')
})

test('reduced motion preserves navbar direction behavior without a sliding transition', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const header = page.locator('.site-header')
  const currentY = await page.evaluate(() => window.scrollY)
  await scrollAndSettle(page, Math.max(120, currentY + 120))
  await expect(header).toHaveAttribute('data-nav-visibility', 'hidden')
  const transitionDuration = await header.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).transitionDuration),
  )
  expect(transitionDuration).toBeLessThanOrEqual(0.00001)
  await scrollAndSettle(page, 108)
  await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
  await expect(page.locator('.desktop-nav [aria-current="location"]')).toHaveAttribute(
    'data-section-link',
    'home',
  )
})

test('approved detail routes render Portfolio as sole current destination and restore homepage history', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const messages: string[] = []
  const hydrationMessage =
    /hydration|hydrating|server-rendered|server rendered|did not match|extra attributes/i
  page.on('console', (message) => {
    if (
      (message.type() === 'warning' || message.type() === 'error') &&
      hydrationMessage.test(message.text())
    ) {
      messages.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    if (hydrationMessage.test(error.message)) messages.push(error.message)
  })

  await page.goto('/projects/drivewise')
  const detailNavigation = page.locator('nav[aria-label="Primary"]:visible').first()
  await expectCurrentDestination(detailNavigation, 'portfolio')
  await expect(detailNavigation.locator('[data-section-link="home"]')).not.toHaveAttribute(
    'aria-current',
    'location',
  )
  await page.reload()
  await expectCurrentDestination(
    page.locator('nav[aria-label="Primary"]:visible').first(),
    'portfolio',
  )

  await page.getByRole('link', { name: 'About', exact: true }).first().click()
  await expect(page).toHaveURL(/\/#about$/)
  const homeNavigation = page.locator('nav[aria-label="Primary"]:visible').first()
  await expectCurrentDestination(homeNavigation, 'about')
  await page.goBack()
  await expect(page).toHaveURL(/\/projects\/drivewise$/)
  await expectCurrentDestination(
    page.locator('nav[aria-label="Primary"]:visible').first(),
    'portfolio',
  )
  await page.goForward()
  await expect(page).toHaveURL(/\/#about$/)
  await expectCurrentDestination(page.locator('nav[aria-label="Primary"]:visible').first(), 'about')
  expect(messages).toEqual([])
})

test('mobile navigation opens, closes, manages focus, and selects destinations through 1023px', async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 812 })
    await page.goto('/projects/drivewise')
    const trigger = page.getByRole('button', { name: 'Open menu' })
    await expect(trigger).toBeVisible()
    await expectCurrentDestination(page.locator('nav[aria-label="Primary"]').first(), 'portfolio')

    await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Primary navigation' })
    await expect(dialog).toBeVisible()
    await expectCurrentDestination(dialog.getByRole('navigation', { name: 'Primary' }), 'portfolio')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()

    await trigger.click()
    await page.getByRole('dialog').getByRole('link', { name: 'Portfolio', exact: true }).click()
    await expect(page).toHaveURL(/\/#portfolio$/)
    await trigger.click()
    const reopenedDialog = page.getByRole('dialog', { name: 'Primary navigation' })
    await expectCurrentDestination(
      reopenedDialog.getByRole('navigation', { name: 'Primary' }),
      'portfolio',
    )
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  }
})

test('desktop navigation is visible without wrapping at 1024px and 1440px', async ({ page }) => {
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/projects/drivewise')
    const navigation = page.locator('.desktop-nav')
    await expect(navigation).toBeVisible()
    await expectCurrentDestination(navigation, 'portfolio')
    const linksFit = await navigation.evaluate((element) => {
      const linkRects = [...element.querySelectorAll('a')].map((link) =>
        link.getBoundingClientRect(),
      )
      return linkRects.every((rect) => rect.top === linkRects[0]?.top)
    })
    expect(linksFit).toBe(true)
  }
})

test('primary navigation links remain available without JavaScript on project routes', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  })
  const page = await context.newPage()
  await page.goto('/projects/drivewise')
  const navigation = page.locator('nav[aria-label="Primary"]:visible').first()
  await expectCurrentDestination(navigation, 'portfolio')
  await expect(navigation.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/#home')
  await navigation.getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/#about$/)
  for (const destination of ['experience', 'education', 'skills']) {
    await page.goto('/projects/drivewise')
    const projectNav = page.locator('nav[aria-label="Primary"]:visible').first()
    const link = projectNav.getByRole('link', { name: new RegExp(`^${destination}$`, 'i') })
    await expect(link).toHaveAttribute('href', `/#${destination}`)
    await expect(projectNav.locator('[aria-current="location"]')).toHaveAttribute(
      'data-section-link',
      'portfolio',
    )
    await link.click()
    await expect(page).toHaveURL(new RegExp(`#${destination}$`))
    await expect(page.locator(`#${destination}`)).toBeVisible()
  }
  await context.close()
})
