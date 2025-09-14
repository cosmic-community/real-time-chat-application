import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Real-Time Chat App | Cosmic',
  description: 'Modern real-time chat application built with Next.js and Cosmic CMS',
  keywords: 'chat, messaging, real-time, nextjs, cosmic, cms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get bucket slug for the cosmic badge
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}