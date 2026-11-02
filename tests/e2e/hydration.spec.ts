import { expect, test } from '@playwright/test'

test('initial page load has no React hydration warnings or errors', async ({ page }) => {
  const hydrationMessages: string[] = []
  const hydrationMessage =
    /hydration|hydrating|server-rendered|server rendered|did not match|extra attributes/i

  page.on('console', (message) => {
    if (
      (message.type() === 'warning' || message.type() === 'error') &&
      hydrationMessage.test(message.text())
    ) {
      hydrationMessages.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    if (hydrationMessage.test(error.message)) hydrationMessages.push(error.message)
  })

  const response = await page.goto('/')
  const serverHtml = await response?.text()
  expect(serverHtml).toMatch(/<html\b[^>]*>/)
  expect(serverHtml).not.toMatch(/<html\b[^>]*\bhas-js\b/)
  await expect(page.locator('html')).toHaveClass(/has-js/)
  expect(hydrationMessages).toEqual([])
})
