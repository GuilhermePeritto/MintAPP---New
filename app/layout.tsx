'use client'

import { LanguageProvider } from '@/components/language-provider'
import { MobileNav } from '@/components/mobile-nav'
import { ThemeProvider } from "@/components/theme-provider"
import { usePathname } from 'next/navigation'
import { Header } from './components/header'
import InstallPWA from './components/InstallPWA'
import './globals.css'

/* export const metadata: Metadata = {
  title: 'Gamer Hub',
  description: 'Your ultimate gaming destination',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
} */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const showHeader = pathname !== '/' && !pathname.startsWith('/signup')
  const showMobileNav = showHeader // Show mobile nav on the same pages as the header

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Gamer Hub" />
        <meta name="application-name" content="Gamer Hub" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Your ultimate gaming destination" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              {showHeader && <Header />}
              <main className="flex-grow pb-16 md:pb-0">{children}</main>
              {showMobileNav && <MobileNav />}
            </div>
            <InstallPWA />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

