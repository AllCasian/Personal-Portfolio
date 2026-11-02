import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('landing page has no automated accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
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
