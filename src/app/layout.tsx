import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Loader } from '~/components/loader'
import { ReactQueryProvider } from '~/components/react-query-provider'
import { ScreenSize } from '~/components/screen-size'
import { ThemeProvider } from '~/components/theme-provider'
import { Toaster } from '~/components/ui/sonner'
import { env } from '~/env'
import { siteConfig } from '~/lib/siteConfig'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            <Loader />
            {children}
            {env.APP_ENV === 'development' ? <ScreenSize /> : null}
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
