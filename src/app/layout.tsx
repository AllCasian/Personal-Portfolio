import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NavigationEnhancement } from '@/components/layout/navigation-enhancement'
import { siteMetadata } from '@/lib/site-metadata'
import './globals.css'

const inter = localFont({
  src: '../../public/fonts/inter-latin.woff2',
  display: 'optional',
  variable: '--font-inter',
  weight: '100 900',
})

export const metadata: Metadata = siteMetadata

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <NavigationEnhancement />
      </body>
    </html>
  )
}
