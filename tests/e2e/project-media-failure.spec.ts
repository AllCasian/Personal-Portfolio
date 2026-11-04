import { expect, test } from '@playwright/test'
import { startProjectMediaFixtureServer } from './project-media-fixture-server'

test.describe('project media failure in an isolated browser fixture', () => {
  let fixtureOrigin: string
  let closeFixture: (() => Promise<void>) | undefined

  test.beforeAll(async () => {
    const fixture = await startProjectMediaFixtureServer()
    fixtureOrigin = fixture.origin
    closeFixture = fixture.close
  })

  test.afterAll(async () => {
    await closeFixture?.()
  })

  test('failed media keeps its reserved frame, project content, and navigation usable', async ({
    page,
  }) => {
    let releaseImageFailure: (() => Promise<void>) | undefined
    let markImageRequested: (() => void) | undefined
    const imageRequested = new Promise<void>((resolve) => {
      markImageRequested = resolve
    })
    const imageUrl = `${fixtureOrigin}/projects/__feature003_test_only_failed_image__.png`

    await page.setViewportSize({ width: 375, height: 812 })
    await page.route(imageUrl, async (route) => {
      markImageRequested?.()
      await new Promise<void>((resolve) => {
        releaseImageFailure = async () => {
          await route.fulfill({ status: 404, contentType: 'image/png', body: '' })
          resolve()
        }
      })
    })

    await page.goto(`${fixtureOrigin}/tests/e2e/fixtures/project-media-harness.html`, {
      waitUntil: 'domcontentloaded',
    })
    await imageRequested

    await expect(page.getByRole('heading', { level: 1, name: 'Drivewise' })).toBeVisible()
    await expect(page.getByText(/Hands-on software engineering project completed/)).toBeVisible()
    await expect(
      page.getByRole('img', { name: 'Isolated test image that will fail to load' }),
    ).toBeVisible()
    await expect(page.locator('#fixture-root')).toHaveAttribute(
      'data-fixture-media-published',
      'false',
    )

    const frame = page.locator('.project-media-frame')
    const beforeFailure = await frame.boundingBox()
    expect(beforeFailure).not.toBeNull()
    const layoutShiftCount = await page.evaluate(() => window.__projectMediaLayoutShifts.length)

    await releaseImageFailure?.()
    await expect(frame).toBeVisible()
    await expect(frame.locator('[data-media-failed="true"]')).toBeHidden()
    await expect(page.locator('.project-media-frame img')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1, name: 'Drivewise' })).toBeVisible()
    await expect(page.getByText(/Hands-on software engineering project completed/)).toBeVisible()

    const afterFailure = await frame.boundingBox()
    expect(afterFailure).not.toBeNull()
    expect(afterFailure?.width).toBeCloseTo(beforeFailure!.width, 1)
    expect(afterFailure?.height).toBeCloseTo(beforeFailure!.height, 1)
    const newLayoutShifts = await page.evaluate((previousCount) => {
      return window.__projectMediaLayoutShifts.slice(previousCount)
    }, layoutShiftCount)
    expect(newLayoutShifts).toEqual([])

    const backLink = page.getByRole('link', { name: 'Back to Projects' })
    await expect(backLink).toHaveAttribute('href', '/#portfolio')
    await page.route(`${fixtureOrigin}/`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html lang="en"><body><main id="portfolio"><h1>Portfolio</h1></main></body></html>',
      }),
    )
    await backLink.click()
    await expect(page).toHaveURL(`${fixtureOrigin}/#portfolio`)
    await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible()
  })
})
