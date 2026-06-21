import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Release Management Dashboard',
  description: 'Track GitHub & GitLab releases with real-time milestone and issue tracking',
  viewport: 'width=device-width, initial-scale=1',
  authors: [{ name: 'RMD Team' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  )
}
