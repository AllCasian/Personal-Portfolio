import { expect, test } from '@playwright/test'

test('homepage presents seven primary destinations and integrated sections in order', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const navigation = page.locator('.desktop-nav')
  await expect(navigation.getByRole('link')).toHaveCount(7)
  expect(await navigation.getByRole('link').allTextContents()).toEqual([
    'Home',
    'About',
    'Portfolio',
    'Experience',
    'Education',
    'Skills',
    'Contact',
  ])

  const headings = await page
    .locator('main > .section-stack > section > .section-heading h2')
    .allTextContents()
  expect(headings).toEqual(['Portfolio', 'Experience', 'Education', 'Skills', 'Contact'])
  await expect(page.getByRole('region', { name: 'Experience' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Education' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Skills' })).toBeVisible()

  for (const destination of ['experience', 'education', 'skills']) {
    await page.goto(`/#${destination}`)
    await expect(page).toHaveURL(new RegExp(`#${destination}$`))
    await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute(
      'data-section-link',
      destination,
    )
  }

  for (const [label, destination] of [
    ['Experience', 'experience'],
    ['Education', 'education'],
    ['Skills', 'skills'],
  ] as const) {
    await navigation.getByRole('link', { name: label }).click()
    await expect(page).toHaveURL(new RegExp(`#${destination}$`))
    const current = navigation.locator('[aria-current="location"]')
    await expect(current).toHaveCount(1)
    await expect(current).toHaveAttribute('data-section-link', destination)
  }

  await page.goBack()
  await expect(page).toHaveURL(/#education$/)
  await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute(
    'data-section-link',
    'education',
  )
  await page.goForward()
  await expect(page).toHaveURL(/#skills$/)
  await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute(
    'data-section-link',
    'skills',
  )
})

test('professional sections reflow without horizontal overflow at supported widths', async ({
  page,
}) => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#experience')
    const layout = await page.evaluate(() => {
      const sections = [...document.querySelectorAll('#experience, #education, #skills')]
      const main = document.querySelector('main')
      const body = document.body
      const viewportWidth = document.documentElement.clientWidth
      const boxes = sections.map((section) => {
        const rect = section.getBoundingClientRect()
        return { left: rect.left, right: rect.right, width: rect.width, height: rect.height }
      })
      return {
        overflow: Math.max(body.scrollWidth, main?.scrollWidth ?? 0) > viewportWidth,
        boxes,
      }
    })
    expect(layout.overflow, `horizontal overflow at ${width}px`).toBe(false)
    expect(layout.boxes).toHaveLength(3)
    expect(layout.boxes.every((box) => box.width > 0 && box.height > 0)).toBe(true)
    expect(layout.boxes.every((box) => box.left >= 0 && box.right <= width)).toBe(true)
  }
})

test('mobile menu exposes all destinations and remains vertically scrollable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Open menu' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Primary navigation' })
  const links = dialog.getByRole('navigation', { name: 'Primary' }).getByRole('link')
  await expect(links).toHaveCount(7)
  await expect(links.last()).toBeVisible()
  const panel = dialog.locator('.mobile-panel')
  const canScroll = await panel.evaluate((element) => element.scrollHeight > element.clientHeight)
  expect(canScroll).toBe(true)
  await dialog.getByRole('link', { name: 'Skills' }).click()
  await expect(page).toHaveURL(/#skills$/)
  await page.getByRole('button', { name: 'Open menu' }).click()
  const nav = page.getByRole('dialog').getByRole('navigation', { name: 'Primary' })
  await expect(nav.locator('[aria-current="location"]')).toHaveAttribute(
    'data-section-link',
    'skills',
  )
})
