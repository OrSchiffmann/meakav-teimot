import type { Metadata, Viewport } from 'next'
import { Heebo, Rubik } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const heebo = Heebo({ subsets: ['hebrew', 'latin'], variable: '--font-body', weight: ['300', '400', '500', '700'] })
const rubik = Rubik({ subsets: ['hebrew', 'latin'], variable: '--font-heading', weight: ['500', '700', '800'] })

export const metadata: Metadata = {
  title: 'מעקב טעימות',
  description: 'מעקב תכנית טעימות לתינוקת',
}

export const viewport: Viewport = {
  themeColor: '#6B8E6B',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} ${rubik.variable}`} style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
