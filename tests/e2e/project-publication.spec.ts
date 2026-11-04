import { expect, test } from '@playwright/test'

const forbiddenSentinels = [
  'SENTINEL_UNVERIFIED_PROJECT_SUMMARY',
  'SENTINEL_UNAPPROVED_TECHNOLOGY',
  'SENTINEL_PRIVATE_CONTRIBUTION',
  'SENTINEL_DRAFT_METADATA',
]

test('public HTML and metadata do not contain draft or ineligible project sentinels', async ({
  page,
}) => {
  for (const path of ['/', '/projects/drivewise', '/projects/ai-recipe']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    const publicOutput = await page.content()
    for (const sentinel of forbiddenSentinels) {
      expect(publicOutput).not.toContain(sentinel)
    }
  }
})

test('unpublished-style unknown route does not reveal a stale project or draft metadata', async ({
  page,
}) => {
  const response = await page.goto('/projects/unpublished-sentinel')
  expect(response?.status()).toBe(404)
  const publicOutput = await page.content()
  for (const sentinel of forbiddenSentinels) {
    expect(publicOutput).not.toContain(sentinel)
  }
  await expect(page.locator('meta[name="robots"]')).toHaveCount(1)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Project not found',
  )
})
