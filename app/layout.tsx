import type { Metadata } from 'next'
import './globals.css'
import AIChatWidget from './components/AIChatWidget'

export const metadata: Metadata = {
  title: 'War Room - DRZ Deal',
  description: 'Strategic overview for Zamakhshary / Saudi Arabia deal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-cream min-h-screen">
        {children}
        <AIChatWidget />
      </body>
    </html>
  )
}
