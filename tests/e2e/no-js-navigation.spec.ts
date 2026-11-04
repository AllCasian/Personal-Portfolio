import { expect, test } from '@playwright/test'

test('primary destinations remain visible and usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('region', { name: 'About' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View Projects' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Contact Me' })).toBeVisible()
  await page.getByRole('link', { name: 'View Projects' }).click()
  await expect(page).toHaveURL(/#portfolio$/)
  await page.getByRole('link', { name: 'Contact Me' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Home' })).toBeVisible()
  await expect(nav).toHaveCSS('position', 'fixed')
  await nav.getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/#about$/)
  await expect(page.getByRole('heading', { level: 2, name: 'About' })).toBeVisible()
  for (const destination of ['experience', 'education', 'skills']) {
    await nav.getByRole('link', { name: new RegExp(`^${destination}$`, 'i') }).click()
    await expect(page).toHaveURL(new RegExp(`#${destination}$`))
    await expect(page.locator(`#${destination}`)).toBeVisible()
  }
  await context.close()
})
