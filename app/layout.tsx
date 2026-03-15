import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Muse Noir',
  description: 'haunts your exams so you don\'t have to',
  manifest: '/manifest.json',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-[#0d0a1a] text-[#e2d9f3] antialiased">
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          minHeight: '100vh',
          position: 'relative',
        }}>
          {children}
        </div>
      </body>
    </html>
  )
}