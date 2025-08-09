import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ToasterProvider } from '@/components/providers/toaster-provider'
import '@/lib/init-db'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'FinData Chile — Estados Financieros Oficiales CMF',
    template: '%s — FinData Chile',
  },
  description: 'Compra y descarga estados financieros históricos de empresas chilenas (CMF) en formato Excel: Balance, Resultados y Flujos. Entrega inmediata.',
  applicationName: 'FinData Chile',
  generator: 'FinData',
  keywords: ['estados financieros', 'CMF', 'Excel', 'empresas chilenas', 'balances', 'resultados', 'flujos', 'FinData Chile'],
  openGraph: {
    type: 'website',
    url: '/',
    title: 'FinData Chile — Estados Financieros Oficiales CMF',
    description: 'Compra y descarga estados financieros históricos de empresas chilenas (CMF) en formato Excel. Entrega inmediata.',
    siteName: 'FinData Chile',
    images: [{ url: '/logo-horizontal.png' as any, width: 1200, height: 630, alt: 'FinData Chile' }],
    locale: 'es_CL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinData Chile — Estados Financieros',
    description: 'Estados financieros históricos de empresas chilenas en Excel',
    images: ['/logo-horizontal.png' as any],
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ToasterProvider />
      </body>
    </html>
  )
}
