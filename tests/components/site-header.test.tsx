import { render, screen } from '@testing-library/react'
import { SiteHeader } from '@/components/layout/site-header'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const { fill, ...imageProps } = props
    void fill
    return <img {...imageProps} alt={props.alt ?? ''} />
  },
}))

describe('SiteHeader brand avatar', () => {
  it('uses the existing portrait in the named home link without duplicating the asset', () => {
    render(<SiteHeader />)
    const homeLink = screen.getByRole('link', { name: 'Portfolio home' })
    const avatar = homeLink.querySelector('img')

    expect(homeLink).toHaveAttribute('href', '#home')
    expect(avatar).toHaveAttribute('src', '/images/me1-2.jpg')
    expect(avatar).toHaveAttribute('sizes', '42px')
    expect(avatar).toHaveAttribute('data-brand-avatar')
    expect(homeLink.querySelector('.brand-mark')).toContainElement(avatar)
    expect(homeLink).not.toHaveTextContent(/^P$/)
  })
})
