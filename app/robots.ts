import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://findatachile.com'
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/tienda', '/compras', '/preguntas', '/terminos', '/privacidad'],
      disallow: ['/admin', '/api'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}


