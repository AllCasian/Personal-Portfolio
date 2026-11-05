import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('landing page has no automated accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
  await expect(page.getByRole('region', { name: 'Experience' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Education' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Skills' })).toBeVisible()
})

test('composed Hero and About page has no axe violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
})

test('open mobile navigation has no automated accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})

test('Escape closes mobile navigation and restores focus to its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Open menu' })
  await trigger.click()
  await expect(page.getByRole('dialog', { name: 'Primary navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await expect(trigger).toBeFocused()
})

test('reduced motion preserves mobile navigation operation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const dialog = page.getByRole('dialog', { name: 'Primary navigation' })
  await expect(dialog).toBeVisible()
  const animationDuration = await dialog.locator('.mobile-panel').evaluate((element) => {
    const duration = getComputedStyle(element).animationDuration
    return duration.endsWith('ms')
      ? Number.parseFloat(duration)
      : Number.parseFloat(duration) * 1000
  })
  expect(animationDuration).toBeLessThanOrEqual(0.01)
  await dialog.getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/#about$/)
  await expect(page.getByRole('heading', { level: 2, name: 'About' })).toBeFocused()
})

test('reduced motion leaves Hero and About content and actions available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('region', { name: 'About' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View Projects' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Contact Me' })).toBeVisible()
})

test('project collection has no configured WCAG 2.2 AA Axe violations', async ({ page }) => {
  await page.goto('/#portfolio')
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(page.locator('[data-motion-reveal-state="pending"]')).toHaveCount(0)
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})

test('motion reveal and focused card states introduce no configured Axe violations', async ({
  page,
}) => {
  await page.goto('/#portfolio')
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(page.locator('[data-motion-reveal-state="pending"]')).toHaveCount(0)
  await page.getByRole('link', { name: 'View details for Drivewise' }).focus()
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
  await expect(page.locator(':focus')).toBeVisible()
})

test('project detail and project not-found pages have no configured Axe violations', async ({
  page,
}) => {
  const tags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']
  await page.goto('/projects/drivewise')
  const detailResults = await new AxeBuilder({ page }).withTags(tags).analyze()
  expect(detailResults.violations).toEqual([])

  await page.goto('/projects/not-a-project')
  const notFoundResults = await new AxeBuilder({ page }).withTags(tags).analyze()
  expect(notFoundResults.violations).toEqual([])
})

test('project cards and detail actions are keyboard reachable with visible focus', async ({
  page,
}) => {
  await page.goto('/#portfolio')
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toBeVisible()
  const outline = await focused.evaluate((element) => getComputedStyle(element).outlineStyle)
  expect(outline).not.toBe('none')

  await page.getByRole('link', { name: 'View details for Drivewise' }).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/projects\/drivewise$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Drivewise' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to Projects' }).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/#portfolio$/)
})

test('project content and actions remain available under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#portfolio')
  await expect(page.getByRole('heading', { level: 2, name: 'Portfolio' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View details for AI Recipe' })).toBeVisible()
  const duration = await page
    .locator('.project-card')
    .first()
    .evaluate((element) => {
      const value = getComputedStyle(element).transitionDuration.split(',')[0]
      return value.endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000
    })
  expect(duration).toBeLessThanOrEqual(0.01)
})
