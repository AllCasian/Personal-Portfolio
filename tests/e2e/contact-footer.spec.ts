import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const widths = [320, 375, 768, 1024, 1440, 1920]

test('Contact publishes one Email action and all approved social actions', async ({ page }) => {
  await page.goto('/')
  const contact = page.getByRole('region', { name: 'Contact' })
  await expect(contact.getByRole('link', { name: 'Send email' })).toHaveAttribute(
    'href',
    'mailto:cristecasian@gmail.com',
  )
  await expect(
    contact.getByRole('link', { name: 'GitHub profile (opens in a new tab)' }),
  ).toHaveAttribute('href', 'https://github.com/AllCasian')
  const linkedin = contact.getByRole('link', { name: 'LinkedIn profile (opens in a new tab)' })
  await expect(linkedin).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/casian-criste-b65582263/',
  )
  await expect(linkedin).toHaveAttribute('target', '_blank')
  await expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
  const instagram = contact.getByRole('link', { name: 'Instagram' })
  await expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/casiancriste')
  await expect(instagram).toHaveAttribute('target', '_blank')
  await expect(instagram).toHaveAttribute('rel', 'noopener noreferrer')
  await expect(contact.getByRole('link', { name: /email/i })).toHaveCount(1)
  await expect(contact.getByText('cristecasian@gmail.com')).toHaveCount(0)
  await expect(contact.getByRole('button', { name: /copy email/i })).toHaveCount(0)
  await expect(contact.getByRole('link', { name: /download cv/i })).toHaveCount(0)
})

test('Contact actions remain functional when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  const contact = page.getByRole('region', { name: 'Contact' })
  await expect(contact.getByRole('link', { name: 'Send email' })).toHaveAttribute(
    'href',
    'mailto:cristecasian@gmail.com',
  )
  await expect(contact.getByRole('button', { name: /copy email/i })).toHaveCount(0)
  await expect(
    contact.getByRole('link', { name: 'GitHub profile (opens in a new tab)' }),
  ).toBeVisible()
  await context.close()
})

test('Contact actions remain available with reduced motion and keep the Footer minimal', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#contact')
  const contact = page.getByRole('region', { name: 'Contact' })
  const actions = contact.getByRole('navigation', { name: 'Contact actions' })
  await expect(actions.getByRole('link')).toHaveCount(4)
  await expect(actions.getByRole('link', { name: 'Send email' })).toHaveAttribute(
    'href',
    'mailto:cristecasian@gmail.com',
  )
  const footer = page.getByRole('contentinfo')
  await expect(footer.locator('.portfolio-actions')).toHaveCount(0)
  await expect(footer.getByRole('navigation', { name: 'Footer navigation' })).toHaveCount(1)
})

test('Footer uses existing destinations without active-state ownership', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
  await expect(page.locator('#contact .portfolio-actions')).toHaveCount(1)
  await expect(footer.locator('.portfolio-actions')).toHaveCount(0)
  const nav = footer.getByRole('navigation', { name: 'Footer navigation' })
  await expect(nav.getByRole('link')).toHaveCount(7)
  await expect(footer).toContainText('© 2026 Casian Criste. All rights reserved.')
  await expect(nav.locator('[aria-current]')).toHaveCount(0)
  await expect(nav.locator('[data-section-link]')).toHaveCount(0)
  await nav.getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('.desktop-nav [aria-current="location"]')).toHaveAttribute(
    'data-section-link',
    'contact',
  )
  await page.goBack()
  await expect(page.locator('.desktop-nav [aria-current="location"]')).toHaveAttribute(
    'data-section-link',
    'home',
  )
  await page.goForward()
  await expect(page.locator('.desktop-nav [aria-current="location"]')).toHaveAttribute(
    'data-section-link',
    'contact',
  )
})

test('project detail Footer returns to homepage destinations without competing current state', async ({
  page,
}) => {
  await page.goto('/projects/drivewise')
  const primary = page.locator('.desktop-nav')
  await expect(primary.locator('[aria-current="location"]')).toHaveCount(1)
  await expect(primary.locator('[aria-current="location"]')).toHaveAttribute(
    'data-section-link',
    'portfolio',
  )
  const footerNav = page
    .getByRole('contentinfo')
    .getByRole('navigation', { name: 'Footer navigation' })
  await expect(footerNav.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
    'href',
    '/#portfolio',
  )
  await expect(footerNav.locator('[aria-current]')).toHaveCount(0)
  await footerNav.getByRole('link', { name: 'Portfolio' }).click()
  await expect(page).toHaveURL(/\/#portfolio$/)
  await expect(primary.locator('[aria-current="location"]')).toHaveAttribute(
    'data-section-link',
    'portfolio',
  )
})

test('Contact and Footer remain usable without overflow at every required width', async ({
  page,
}) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#contact')
    const dimensions = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      contact: document.querySelector('#contact')?.getBoundingClientRect().width ?? 0,
      footer: document.querySelector('.site-footer')?.getBoundingClientRect().width ?? 0,
    }))
    expect(dimensions.scroll, `overflow at ${width}px`).toBeLessThanOrEqual(dimensions.client)
    expect(dimensions.contact).toBeGreaterThan(0)
    expect(dimensions.footer).toBeGreaterThan(0)
    await expect(page.locator('#contact').getByRole('link', { name: 'Send email' })).toBeVisible()
    await expect(
      page
        .getByRole('navigation', { name: 'Footer navigation' })
        .getByRole('link', { name: 'Contact' }),
    ).toBeVisible()
  }
})

test('Contact and Footer pass configured automated accessibility checks', async ({ page }) => {
  await page.goto('/#contact')
  const homeResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .include('#contact, footer')
    .analyze()
  expect(homeResults.violations).toEqual([])

  await page.goto('/projects/drivewise')
  const detailResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .include('footer')
    .analyze()
  expect(detailResults.violations).toEqual([])
})

test('Contact actions reflow at viewport widths equivalent to 200% zoom', async ({ page }) => {
  for (const effectiveCssWidth of [320, 720]) {
    await page.setViewportSize({ width: effectiveCssWidth, height: 900 })
    await page.goto('/#contact')
    const dimensions = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    }))
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client)
    const emailAction = page.locator('#contact').getByRole('link', { name: 'Send email' })
    await expect(emailAction).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Footer navigation' })).toBeVisible()
    await emailAction.focus()
    await expect(emailAction).toBeFocused()
  }
})
