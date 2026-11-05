import { expect, test } from '@playwright/test'

const destinations = ['home', 'about', 'portfolio', 'contact'] as const

test('shared portrait branding remains accessible and dimension-stable on home and detail routes', async ({
  page,
}) => {
  for (const { route, width, expectedHref } of [
    { route: '/', width: 1440, expectedHref: '#home' },
    { route: '/projects/drivewise', width: 375, expectedHref: '/#home' },
  ]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(route)
    const homeLink = page.getByRole('banner').getByRole('link', { name: 'Portfolio home' })
    const avatar = homeLink.locator('[data-brand-avatar]')
    await expect(homeLink).toHaveAttribute('href', expectedHref)
    await expect(avatar).toHaveAttribute('alt', '')
    await expect(avatar).toHaveAttribute('sizes', '42px')
    await expect(avatar).toHaveAttribute('src', /me1-2\.jpg/)
    await expect(avatar).toHaveCSS('object-fit', 'cover')

    const beforeDecode = await homeLink.locator('.brand-mark').boundingBox()
    await avatar.evaluate((image) => (image as HTMLImageElement).decode())
    const afterDecode = await homeLink.locator('.brand-mark').boundingBox()
    expect(afterDecode).toEqual(beforeDecode)

    const circle = await homeLink.locator('.brand-mark').evaluate((element) => {
      const rect = element.getBoundingClientRect()
      return {
        width: rect.width,
        height: rect.height,
        borderRadius: getComputedStyle(element).borderRadius,
        imageCount: element.querySelectorAll('[data-brand-avatar]').length,
      }
    })
    expect(circle.width).toBe(circle.height)
    expect(circle.borderRadius).toBe('50%')
    expect(circle.imageCount).toBe(1)

    if (width < 1024) {
      await page.getByRole('button', { name: 'Open menu' }).click()
      const mobileAvatar = page.getByRole('dialog').locator('.brand-mark [data-brand-avatar]')
      await expect(mobileAvatar).toHaveAttribute('src', /me1-2\.jpg/)
      await expect(mobileAvatar).toHaveAttribute('alt', '')
    }
  }
})

test('primary destination state follows hash, activation, and browser history', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)

  for (const destination of ['about', 'portfolio', 'contact'] as const) {
    await page.goto(`/#${destination}`)
    await expect(page).toHaveURL(new RegExp(`#${destination}$`))
    await expect(
      page
        .getByRole('navigation', { name: 'Primary' })
        .getByRole('link', { name: new RegExp(`^${destination}$`, 'i') }),
    ).toHaveAttribute('aria-current', 'location')
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).locator('[aria-current="location"]'),
    ).toHaveCount(1)
  }

  await page.goto('/')
  for (const destination of destinations) {
    await nav.getByRole('link', { name: new RegExp(`^${destination}$`, 'i') }).click()
    await expect(page).toHaveURL(new RegExp(`#${destination}$`))
    await expect(
      nav.getByRole('link', { name: new RegExp(`^${destination}$`, 'i') }),
    ).toHaveAttribute('aria-current', 'location')
    await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
  }
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

for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
  test(`layout and navigation behave at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    )
    if (width < 1024) {
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
      const header = page.locator('.site-header')
      const trigger = page.getByRole('button', { name: 'Open menu' })
      await page.evaluate(() => window.scrollTo(0, 200))
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      )
      await expect(header).toHaveAttribute('data-nav-visibility', 'hidden')
      await trigger.focus()
      await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
      await trigger.click()
      const dialog = page.getByRole('dialog', { name: 'Primary navigation' })
      await expect(dialog).toBeVisible()
      await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused()
      await expect(dialog.getByRole('link', { name: 'Home' })).toBeVisible()
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).toBeVisible()
      await expect(header).toHaveAttribute('data-nav-visibility', 'visible')
      await dialog.getByRole('link', { name: 'Portfolio' }).click()
      await expect(page).toHaveURL(/#portfolio$/)
      await expect(page.getByRole('heading', { level: 2, name: 'Portfolio' })).toBeFocused()
      await expect(page.getByRole('dialog')).toHaveCount(0)
    } else {
      await expect(
        page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home' }),
      ).toBeVisible()
      await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden()
    }
    if (width < 768) {
      const intro = await page
        .getByRole('heading', { level: 1 })
        .evaluate((el) => el.getBoundingClientRect().top + window.scrollY)
      const portrait = await page
        .locator('.portrait-frame')
        .evaluate((el) => el.getBoundingClientRect().top + window.scrollY)
      expect(intro).toBeLessThan(portrait)
    }

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('region', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'View Projects' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact Me' })).toBeVisible()
    const heroGeometry = await page.evaluate(() => {
      const hero = document.querySelector('#home')!.getBoundingClientRect()
      const about = document.querySelector('#about')!.getBoundingClientRect()
      const h1 = document.querySelector('h1')!.getBoundingClientRect()
      const actions = document.querySelector('.hero-action-group')!.getBoundingClientRect()
      const portrait = document.querySelector('.portrait-frame')!.getBoundingClientRect()
      return {
        heroRight: hero.right,
        aboutRight: about.right,
        headingRight: h1.right,
        actionsBottom: actions.bottom,
        portraitTop: portrait.top,
      }
    })
    expect(heroGeometry.heroRight).toBeLessThanOrEqual(width)
    expect(heroGeometry.aboutRight).toBeLessThanOrEqual(width)
    expect(heroGeometry.headingRight).toBeLessThanOrEqual(width)
    if (width < 768) expect(heroGeometry.actionsBottom).toBeLessThan(heroGeometry.portraitTop)
    if (width <= 767) {
      await expect(page.locator('.hero-copy')).toHaveCSS('text-align', 'center')
      await expect(page.locator('#contact > .section-heading')).toHaveCSS('text-align', 'center')
      const actionCenter = await page
        .locator('#contact .contact-action-group')
        .evaluate((element) => {
          const rect = element.getBoundingClientRect()
          return rect.left + rect.width / 2
        })
      expect(Math.abs(actionCenter - width / 2)).toBeLessThanOrEqual(2)
    }
  })
}

test('mobile action pills retain touch size, visible focus, and natural wrapping', async ({
  page,
}) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 812 })
    await page.goto('/#contact')
    const actions = page.locator('#contact .contact-action-group a')
    await expect(actions).toHaveCount(4)
    const bounds = await actions.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
          outline: getComputedStyle(element).outlineStyle,
        }
      }),
    )
    expect(
      bounds.every(
        ({ width: w, height, left, right }) =>
          w >= 44 && height >= 44 && left >= 0 && right <= width,
      ),
    ).toBe(true)
    await actions.first().focus()
    await expect(actions.first()).toBeFocused()
    await expect(actions.first()).toHaveCSS('outline-style', 'solid')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    )
  }
})

test('mobile centering leaves dense project and timeline copy readable', async ({ page }) => {
  for (const width of [320, 375, 390, 768]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#portfolio')
    const homeCopyAlignment = await page
      .locator('.project-summary')
      .first()
      .evaluate((element) => getComputedStyle(element).textAlign)
    expect(homeCopyAlignment).not.toBe('center')
    const timelineAlignment = await page
      .locator('.professional-contributions')
      .first()
      .evaluate((element) => getComputedStyle(element).textAlign)
    expect(timelineAlignment).not.toBe('center')

    await page.goto('/projects/drivewise')
    const detailAlignment = await page
      .locator('.project-detail-copy > p')
      .first()
      .evaluate((element) => getComputedStyle(element).textAlign)
    expect(detailAlignment).not.toBe('center')
  }
})

test('motion targets and focus affordances stay within supported responsive widths', async ({
  page,
}) => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/#portfolio')
    await expect(page.getByRole('link', { name: 'View details for Drivewise' })).toBeVisible()

    const bounds = await page.locator('[data-motion-reveal]').evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect()
        return { left: rect.left, right: rect.right, width: rect.width }
      }),
    )
    expect(bounds.length).toBeGreaterThan(0)
    expect(
      bounds.every(
        ({ left, right, width: elementWidth }) =>
          elementWidth >= 0 && left >= -1 && right <= width + 1,
      ),
    ).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    )

    const details = page.getByRole('link', { name: 'View details for Drivewise' })
    await details.evaluate((link) =>
      (link as HTMLElement).focus({ focusVisible: true } as FocusOptions),
    )
    await expect(details).toBeFocused()
    await expect(details).toHaveCSS('outline-style', 'solid')
  }
})

test('desktop active styling is distinct from hover and focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#about')
  const about = page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'About' })
  const home = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home' })
  await expect(about).toHaveAttribute('aria-current', 'location')
  const activeIndicator = await about.evaluate(
    (element) => getComputedStyle(element, '::after').transform,
  )
  await home.hover()
  const hoverIndicator = await home.evaluate(
    (element) => getComputedStyle(element, '::after').transform,
  )
  expect(activeIndicator).not.toBe(hoverIndicator)
  await about.focus()
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toBeVisible()
  expect(
    await page.locator(':focus').evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe('solid')
  await expect(about).toHaveAttribute('aria-current', 'location')
})

test('mobile current location stays synchronized after open, selection, and close', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#about')
  await page.getByRole('button', { name: 'Open menu' }).click()
  let nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
  await nav.getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await page.getByRole('button', { name: 'Open menu' }).click()
  nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'aria-current',
    'location',
  )
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
})
