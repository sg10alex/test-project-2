import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Corporate Services',
  description: 'Professional corporate services platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
