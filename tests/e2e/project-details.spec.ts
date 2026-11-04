import { expect, test } from '@playwright/test'

const approvedProjects = [
  ['drivewise', 'Drivewise'],
  ['smart-librarian', 'Smart Librarian'],
  ['etl-pipeline', 'ETL Pipeline'],
  ['automatic-guitar-tuner', 'Automatic Guitar Tuner'],
  ['energy-management-system', 'Energy Management System'],
  ['ai-recipe', 'AI Recipe'],
] as const

for (const [slug, title] of approvedProjects) {
  test(`${slug} opens directly, renders its identity, and survives refresh`, async ({ page }) => {
    const response = await page.goto(`/projects/${slug}`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to Projects' })).toHaveAttribute(
      'href',
      '/#portfolio',
    )

    await page.reload()
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
  })
}

test('unknown and malformed slugs return generic HTTP 404 pages with noindex', async ({ page }) => {
  for (const slug of ['not-a-project', 'unknown%2Fslug']) {
    const response = await page.goto(`/projects/${slug}`)
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1, name: 'Project not found' })).toBeVisible()
    const robots = page.locator('meta[name="robots"]')
    await expect(robots).toHaveCount(1)
    await expect(robots).toHaveAttribute('content', /noindex/i)
    await expect(page.locator('main')).not.toContainText(
      /SENTINEL|Drivewise|Smart Librarian|ETL Pipeline/i,
    )
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Project not found',
    )
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'The requested project is unavailable.',
    )
  }
})
