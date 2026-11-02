import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NavigationEnhancement } from '@/components/layout/navigation-enhancement'
import './globals.css'

const inter = localFont({
  src: '../../public/fonts/inter-latin.woff2',
  display: 'optional',
  variable: '--font-inter',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Your Name — Software Engineer',
  description:
    'A personal software engineering portfolio. Replace this description with a verified introduction.',
}

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
