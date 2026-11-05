import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const widths = [320, 375, 768, 1024, 1440, 1920]

test('Contact publishes only the confirmed links and the copy action enhances them', async ({
  page,
}) => {
  await page.goto('/')
  const contact = page.getByRole('region', { name: 'Contact' })
  await expect(contact.getByText('cristecasian@gmail.com')).toBeVisible()
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

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  const copy = contact.getByRole('button', { name: 'Copy email' })
  await expect(copy).toBeVisible()
  await copy.click()
  await expect(contact.getByRole('status')).toHaveText('Email copied')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('cristecasian@gmail.com')
  await expect(copy).toBeFocused()
})

test('copy action reports rejected and unsupported Clipboard API without moving focus', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'clipboard', {
      configurable: true,
      get: () => ({ writeText: () => Promise.reject(new Error('Permission denied')) }),
    })
  })
  await page.goto('/')
  const contact = page.getByRole('region', { name: 'Contact' })
  const button = contact.getByRole('button', { name: 'Copy email' })
  await button.focus()
  await button.click()
  await expect(contact.getByRole('status')).toHaveText(/Unable to copy email/)
  await expect(button).toBeFocused()

  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'clipboard', {
      configurable: true,
      get: () => undefined,
    })
  })
  await page.reload()
  const unsupportedButton = page
    .getByRole('region', { name: 'Contact' })
    .getByRole('button', { name: 'Copy email' })
  await unsupportedButton.click()
  await expect(page.getByRole('status')).toContainText('Unable to copy email')
  await expect(unsupportedButton).toBeFocused()
})

test('Copy Email stays out of interaction until local hydration is ready', async ({ page }) => {
  let releaseCopyChunk: (() => void) | undefined
  let markCopyChunkRequested: (() => void) | undefined
  const copyChunkRequested = new Promise<void>((resolve) => {
    markCopyChunkRequested = resolve
  })
  await page.route('**/_next/static/chunks/*.js', async (route) => {
    const response = await route.fetch()
    const body = await response.body()
    if (body.toString('utf8').includes('Copy email')) {
      markCopyChunkRequested?.()
      await new Promise<void>((resolve) => {
        releaseCopyChunk = resolve
      })
    }
    await route.fulfill({ response, body })
  })

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await copyChunkRequested
  await page.evaluate(() => document.documentElement.classList.add('has-js'))
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains('has-js')))
    .toBe(true)
  const button = page.locator('.copy-email-action')
  await expect(button).toHaveAttribute('hidden', '')
  expect(await button.evaluate((element) => getComputedStyle(element).display)).toBe('none')
  await button.evaluate((element) => (element as HTMLButtonElement).focus())
  await expect(button).not.toBeFocused()

  releaseCopyChunk?.()
  await expect(button).toBeVisible()
  expect(await button.getAttribute('data-copy-ready')).toBe('true')
})

test('Copy Email is hidden and unfocusable when JavaScript is disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  const contact = page.getByRole('region', { name: 'Contact' })
  await expect(contact.getByText('cristecasian@gmail.com')).toBeVisible()
  await expect(contact.getByRole('link', { name: 'Send email' })).toHaveAttribute(
    'href',
    'mailto:cristecasian@gmail.com',
  )
  await expect(contact.getByRole('button', { name: 'Copy email' })).toHaveCount(0)
  const hiddenButton = page.locator('.copy-email-action')
  expect(await hiddenButton.evaluate((button) => getComputedStyle(button).display)).toBe('none')
  await hiddenButton.evaluate((button) => (button as HTMLButtonElement).focus())
  await expect(hiddenButton).not.toBeFocused()
  await expect(
    contact.getByRole('link', { name: 'GitHub profile (opens in a new tab)' }),
  ).toBeVisible()
  await context.close()
})

test('Footer uses existing destinations without active-state ownership', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
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
    await expect(page.getByRole('link', { name: 'Send email' })).toBeVisible()
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
    await expect(page.getByRole('link', { name: 'Send email' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Copy email' })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Footer navigation' })).toBeVisible()
    await page.getByRole('link', { name: 'Send email' }).focus()
    await expect(page.getByRole('link', { name: 'Send email' })).toBeFocused()
  }
})
