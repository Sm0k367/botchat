import type { Metadata } from 'next'
import { Orbitron, Rajdhani } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700', '900']
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Sm0ken42O AI - 3D Cyber Chat',
  description: 'Fire 3D AI chat with media gen, glitch vibes, neon cyberpunk. Powered by Groq Llama3.',
  keywords: 'ai chat, 3d chat, cyberpunk, neon, glitch, sm0ken420',
  authors: [{ name: 'Sm0ken42O' }],
  creator: 'Sm0ken42O',
  themeColor: '#ff00ff',
  openGraph: {
    title: 'Sm0ken42O AI - 3D Cyber Chat',
    description: 'Ultimate 3D AI chat with full media generation.',
    url: 'https://your-vercel-app.vercel.app',
    siteName: 'Sm0ken42O AI',
    images: [
      {
        url: 'https://your-vercel-app.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sm0ken42O AI - 3D Cyber Chat',
    description: 'Fire 3D AI chat with media gen.',
    images: ['https://your-vercel-app.vercel.app/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen font-rajdhani antialiased',
        orbitron.variable,
        rajdhani.variable
      )}>
        {children}
      </body>
    </html>
  )
}
