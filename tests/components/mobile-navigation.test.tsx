import { render, screen } from '@testing-library/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'

describe('MobileNavigation server markup', () => {
  it('exposes a progressive dialog trigger and visible no-JavaScript destinations', () => {
    const { container } = render(<MobileNavigation />)
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    const dialog = container.querySelector('dialog')

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', 'mobile-navigation-dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'mobile-navigation-title')
    expect(dialog?.querySelector('[data-menu-close]')).toHaveAccessibleName('Close menu')
    expect(container.querySelector('.no-js-mobile-links')).toHaveTextContent('Home')
    expect(container.querySelector('.no-js-mobile-links')).toHaveTextContent('Contact')
  })
})
