import { expect, test } from '@playwright/test'

test('direct Home and About anchors expose the matching current destination', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await page.goto('/')
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)

  await page.goto('/#about')
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
})

test('hero actions preserve anchor, active navigation, keyboard, and browser history behavior', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })

  const projects = page.getByRole('link', { name: 'View Projects' })
  await projects.focus()
  await expect(projects).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#portfolio$/)
  await expect(nav.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)

  await page.getByRole('link', { name: 'Contact Me' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)

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

for (const { width, height } of [
  { width: 375, height: 812 },
  { width: 1440, height: 900 },
]) {
  test(`SC-001 content is visible in the initial ${width}x${height} viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await expect(page.getByRole('img', { name: 'Casian Criste' })).toBeVisible()
    const initialPortrait = await page.locator('.portrait-frame').boundingBox()
    const settledPortrait = await page.locator('.portrait-frame').boundingBox()
    expect(settledPortrait).toEqual(initialPortrait)
    const required = [
      page.locator('.hero-name'),
      page.locator('.hero-role'),
      page.locator('.hero-intro'),
      page.getByRole('link', { name: 'View Projects' }),
      page.getByRole('link', { name: 'Contact Me' }),
    ]
    for (const locator of required) {
      await expect(locator).toBeVisible()
      const box = await locator.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.y).toBeGreaterThanOrEqual(0)
      expect(box!.y + box!.height).toBeLessThanOrEqual(height)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    )
    const [name, role, intro, projects, contact] = await Promise.all(
      required.map((locator) => locator.boundingBox()),
    )
    expect(name!.y + name!.height).toBeLessThanOrEqual(role!.y)
    expect(role!.y + role!.height).toBeLessThanOrEqual(intro!.y)
    expect(intro!.y + intro!.height).toBeLessThanOrEqual(projects!.y)
    const noOverlap =
      projects!.x + projects!.width <= contact!.x ||
      contact!.x + contact!.width <= projects!.x ||
      projects!.y + projects!.height <= contact!.y ||
      contact!.y + contact!.height <= projects!.y
    expect(noOverlap).toBe(true)
  })
}

test('mobile menu retains the active destination after selecting a hero action', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#about')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location')
  await nav.getByRole('link', { name: 'Home' }).click()
  await expect(page).toHaveURL(/#home$/)
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
})

test('reduced motion does not hide or gate hero/About content or actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('region', { name: 'About' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View Projects' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Contact Me' })).toBeVisible()
})
