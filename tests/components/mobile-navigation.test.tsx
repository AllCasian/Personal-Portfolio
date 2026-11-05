import { render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MobileNavigation } from '@/components/layout/mobile-navigation'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const { fill, ...imageProps } = props
    void fill
    return <img {...imageProps} alt={props.alt ?? ''} />
  },
}))

describe('MobileNavigation server markup', () => {
  it('exposes a progressive dialog trigger and server-rendered no-JavaScript destinations', () => {
    const { container } = render(<MobileNavigation />)
    const trigger = screen.getByRole('button', { name: 'Open menu' })
    const dialog = container.querySelector('dialog')

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', 'mobile-navigation-dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'mobile-navigation-title')
    expect(dialog?.querySelector('[data-menu-close]')).toHaveAccessibleName('Close menu')
    const serverMarkup = renderToStaticMarkup(<MobileNavigation />)
    expect(serverMarkup).toContain('<noscript>')
    expect(serverMarkup).toContain('no-js-mobile-links')
    expect(serverMarkup).toContain('Home')
    expect(serverMarkup).toContain('Contact')
    const mobileBrand = container.querySelector('.brand-mark')
    expect(mobileBrand?.querySelector('img')).toHaveAttribute('src', '/images/me1-2.jpg')
    expect(mobileBrand?.querySelector('img')).toHaveAttribute('alt', '')
    expect(mobileBrand).not.toHaveTextContent('YN')
  })
})
