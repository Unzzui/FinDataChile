import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://findatachile.com'
  const now = new Date().toISOString()

  const staticRoutes = ['/', '/tienda', '/compras', '/preguntas', '/terminos', '/privacidad'].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: p === '/' ? 1 : 0.8,
  }))

  return [...staticRoutes]
}


