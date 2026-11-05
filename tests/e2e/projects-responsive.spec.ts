import { expect, test } from '@playwright/test'

const viewportWidths = [320, 375, 768, 1024, 1440, 1920] as const

test('collection and detail layouts reflow without overflow, clipping, or unreachable actions', async ({
  page,
}) => {
  for (const width of viewportWidths) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#portfolio')

    const collectionMetrics = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }))
    expect(collectionMetrics.document).toBeLessThanOrEqual(collectionMetrics.viewport)
    expect(collectionMetrics.body).toBeLessThanOrEqual(collectionMetrics.viewport)

    const cards = page.locator('.project-card')
    await expect(cards).toHaveCount(6)
    for (const card of await cards.all()) {
      await expect(card).toBeVisible()
      await expect(card.getByRole('link', { name: /View details for/ })).toBeVisible()
      const hasOverflow = await card.evaluate(
        (element) => element.scrollWidth > element.clientWidth + 1,
      )
      expect(hasOverflow).toBe(false)
    }
    await page.screenshot({ path: `test-results/projects-list-${width}.png`, fullPage: true })

    await page.goto('/projects/automatic-guitar-tuner')
    const detailMetrics = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }))
    expect(detailMetrics.document).toBeLessThanOrEqual(detailMetrics.viewport)
    expect(detailMetrics.body).toBeLessThanOrEqual(detailMetrics.viewport)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to Projects' })).toBeVisible()
    await page.screenshot({ path: `test-results/projects-detail-${width}.png`, fullPage: true })
  }
})

test('absent approved media creates no image request or empty media frame', async ({ page }) => {
  await page.goto('/projects/ai-recipe')
  const imageRequests: string[] = []
  page.on('request', (request) => {
    if (request.resourceType() === 'image') imageRequests.push(request.url())
  })
  await page.reload()
  expect(await page.locator('.project-media-frame').count()).toBe(0)
  expect(await page.locator('img').count()).toBe(0)
  expect(imageRequests).toEqual([])
})
