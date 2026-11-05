import { expect, test } from '@playwright/test'

test('Hero role preserves descenders, sequence timing, and About anchors', async ({ page }) => {
  for (const { width, height } of [
    { width: 375, height: 812 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await page.evaluate(() => document.getAnimations().forEach((animation) => animation.finish()))

    const role = page.locator('.hero-role')
    await expect(role).toHaveText('Junior Data Engineer')
    const metrics = await role.evaluate((element) => {
      const style = getComputedStyle(element)
      const probe = document.createElement('span')
      probe.className = 'hero-role'
      probe.textContent = 'gjpqy'
      probe.setAttribute('aria-hidden', 'true')
      Object.assign(probe.style, {
        position: 'fixed',
        left: '-10000px',
        top: '0',
        opacity: '0',
        whiteSpace: 'nowrap',
      })
      document.body.append(probe)
      const textNode = probe.firstChild!
      const range = document.createRange()
      const descenderBounds = [...'gjpqy'].map((character, index) => {
        range.setStart(textNode, index)
        range.setEnd(textNode, index + 1)
        const rect = range.getBoundingClientRect()
        return { character, width: rect.width, height: rect.height }
      })
      probe.remove()

      const roleBounds = element.getBoundingClientRect()
      const rangeForG = document.createRange()
      const actualText = element.firstChild!
      const gIndex = actualText.textContent!.indexOf('g')
      rangeForG.setStart(actualText, gIndex)
      rangeForG.setEnd(actualText, gIndex + 1)
      const gBounds = rangeForG.getBoundingClientRect()
      const ancestors: Array<{ overflow: string; clipPath: string }> = []
      let parent: Element | null = element
      while (parent) {
        const parentStyle = getComputedStyle(parent)
        ancestors.push({ overflow: parentStyle.overflow, clipPath: parentStyle.clipPath })
        parent = parent.parentElement
      }
      const timeInSeconds = (value: string) =>
        value.trim().endsWith('ms') ? Number.parseFloat(value) / 1000 : Number.parseFloat(value)
      const sequenceEnd = ['.hero-name', '.hero-role', '.hero-intro', '.hero-action-group'].map(
        (selector) => {
          const animation = getComputedStyle(document.querySelector(selector)!)
          return animation.animationName === 'none'
            ? 0
            : timeInSeconds(animation.animationDuration) + timeInSeconds(animation.animationDelay)
        },
      )

      return {
        fontSize: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight),
        roleBottom: roleBounds.bottom,
        gBottom: gBounds.bottom,
        descenderBounds,
        ancestors,
        maximumSequence: Math.max(...sequenceEnd),
      }
    })

    expect(metrics.lineHeight / metrics.fontSize).toBeGreaterThanOrEqual(1.1)
    expect(metrics.descenderBounds.every(({ width, height }) => width > 0 && height > 0)).toBe(true)
    expect(
      metrics.ancestors.every(
        ({ overflow, clipPath }) => overflow === 'visible' && clipPath === 'none',
      ),
    ).toBe(true)
    expect(metrics.maximumSequence).toBeLessThanOrEqual(0.7)
    await expect(page.locator('.hero-index')).toHaveCount(0)
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'About', exact: true })).toBeVisible()
  }

  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 812 : 900 })
    await page.goto('/')
    const role = page.locator('.hero-role')
    await expect(role).toBeVisible()
    await expect(role).toHaveText('Junior Data Engineer')
    const reducedStyles = await role.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        animationName: style.animationName,
        opacity: style.opacity,
        transform: style.transform,
      }
    })
    expect(reducedStyles).toEqual({ animationName: 'none', opacity: '1', transform: 'none' })
    await expect(page.locator('#about')).toBeVisible()
  }
})
test('direct Home and About anchors expose the matching current destination', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await page.goto('/')
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)

  await page.goto('/#about')
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
})

test('hero actions preserve anchor, active navigation, keyboard, and browser history behavior', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })

  const projects = page.getByRole('link', { name: 'View Projects' })
  await projects.focus()
  await expect(projects).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#portfolio$/)
  await expect(nav.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)

  await page.getByRole('link', { name: 'Contact Me' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)

  await page.goBack()
  await expect(nav.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await page.goForward()
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'aria-current',
    'location',
  )
})

test('Hero and Contact share the same approved social action destinations', async ({ page }) => {
  for (const width of [320, 375, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const heroActions = page.locator('#home .hero-social-actions')
    const contactActions = page.locator('#contact .contact-action-group')
    const [heroHrefs, contactHrefs] = await Promise.all([
      heroActions
        .locator('a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
      contactActions
        .locator('a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
    ])
    expect(heroHrefs).toEqual([
      'mailto:cristecasian@gmail.com',
      'https://github.com/AllCasian',
      'https://www.linkedin.com/in/casian-criste-b65582263/',
      'https://www.instagram.com/casiancriste',
    ])
    expect(contactHrefs).toEqual(heroHrefs)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    )
    await expect(heroActions.getByRole('link', { name: 'Download CV' })).toHaveCount(0)
    await heroActions.getByRole('link', { name: 'Instagram' }).focus()
    await expect(heroActions.getByRole('link', { name: 'Instagram' })).toBeFocused()
  }
})

for (const { width, height } of [
  { width: 375, height: 812 },
  { width: 1440, height: 900 },
]) {
  test(`SC-001 content is visible in the initial ${width}x${height} viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await expect(page.getByRole('img', { name: 'Casian Criste' })).toBeVisible()
    const initialPortrait = await page.locator('.portrait-frame').boundingBox()
    const settledPortrait = await page.locator('.portrait-frame').boundingBox()
    expect(settledPortrait).toEqual(initialPortrait)
    const required = [
      page.locator('.hero-name'),
      page.locator('.hero-role'),
      page.locator('.hero-intro'),
      page.getByRole('link', { name: 'View Projects' }),
      page.getByRole('link', { name: 'Contact Me' }),
    ]
    for (const locator of required) {
      await expect(locator).toBeVisible()
      const box = await locator.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.y).toBeGreaterThanOrEqual(0)
      expect(box!.y + box!.height).toBeLessThanOrEqual(height)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    )
    const [name, role, intro, projects, contact] = await Promise.all(
      required.map((locator) => locator.boundingBox()),
    )
    expect(name!.y + name!.height).toBeLessThanOrEqual(role!.y)
    expect(role!.y + role!.height).toBeLessThanOrEqual(intro!.y)
    expect(intro!.y + intro!.height).toBeLessThanOrEqual(projects!.y)
    const noOverlap =
      projects!.x + projects!.width <= contact!.x ||
      contact!.x + contact!.width <= projects!.x ||
      projects!.y + projects!.height <= contact!.y ||
      contact!.y + contact!.height <= projects!.y
    expect(noOverlap).toBe(true)
  })
}

test('mobile menu retains the active destination after selecting a hero action', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#about')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location')
  await nav.getByRole('link', { name: 'Home' }).click()
  await expect(page).toHaveURL(/#home$/)
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
})

test('reduced motion does not hide or gate hero/About content or actions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('region', { name: 'About' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View Projects' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Contact Me' })).toBeVisible()
})
