import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Muse Noir',
  description: 'haunts your exams so you don\'t have to',
  manifest: '/manifest.json',
  themeColor: '#0d0a1a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Muse Noir',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0d0a1a" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-[#0d0a1a] text-[#e2d9f3] antialiased">
        {children}
      </body>
    </html>
  )
}