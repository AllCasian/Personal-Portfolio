import { expect, test } from '@playwright/test'

const destinations = ['home', 'about', 'portfolio', 'contact'] as const

test('primary destination state follows hash, activation, and browser history', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)

  for (const destination of ['about', 'portfolio', 'contact'] as const) {
    await page.goto(`/#${destination}`)
    await expect(page).toHaveURL(new RegExp(`#${destination}$`))
    await expect(
      page
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: new RegExp(`^${destination}$`, 'i') }),
    ).toHaveAttribute('aria-current', 'location')
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).locator('[aria-current="location"]'),
    ).toHaveCount(1)
  }

  await page.goto('/')
  for (const destination of destinations) {
    await nav.getByRole('link', { name: new RegExp(`^${destination}$`, 'i') }).click()
    await expect(page).toHaveURL(new RegExp(`#${destination}$`))
    await expect(
      nav.getByRole('link', { name: new RegExp(`^${destination}$`, 'i') }),
    ).toHaveAttribute('aria-current', 'location')
    await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
  }
  await page.goBack()
  await expect(nav.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await page.goForward()
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'aria-current',
    'location',
  )
})

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`layout and navigation behave at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    )
    if (width < 1024) {
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
      await page.getByRole('button', { name: 'Open menu' }).click()
      const dialog = page.getByRole('dialog', { name: 'Primary navigation' })
      await expect(dialog).toBeVisible()
      await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused()
      await expect(dialog.getByRole('link', { name: 'Home' })).toBeVisible()
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).toBeVisible()
      await dialog.getByRole('link', { name: 'Portfolio' }).click()
      await expect(page).toHaveURL(/#portfolio$/)
      await expect(page.getByRole('heading', { level: 2, name: 'Portfolio' })).toBeFocused()
      await expect(page.getByRole('dialog')).toHaveCount(0)
    } else {
      await expect(
        page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home' }),
      ).toBeVisible()
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden()
    }
    if (width < 768) {
      const intro = await page
        .getByRole('heading', { level: 1 })
        .evaluate((el) => el.getBoundingClientRect().top)
      const portrait = await page
        .locator('.portrait-frame')
        .evaluate((el) => el.getBoundingClientRect().top)
      expect(intro).toBeLessThan(portrait)
    }
  })
}

test('desktop active styling is distinct from hover and focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#about')
  const about = page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'About' })
  const home = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home' })
  await expect(about).toHaveAttribute('aria-current', 'location')
  const activeIndicator = await about.evaluate(
    (element) => getComputedStyle(element, '::after').transform,
  )
  await home.hover()
  const hoverIndicator = await home.evaluate(
    (element) => getComputedStyle(element, '::after').transform,
  )
  expect(activeIndicator).not.toBe(hoverIndicator)
  await about.focus()
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toBeVisible()
  expect(
    await page.locator(':focus').evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe('solid')
  await expect(about).toHaveAttribute('aria-current', 'location')
})

test('mobile current location stays synchronized after open, selection, and close', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#about')
  await page.getByRole('button', { name: 'Open menu' }).click()
  let nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
  await nav.getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await page.getByRole('button', { name: 'Open menu' }).click()
  nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
})
