import type { Metadata } from 'next'
import { pgQuery } from '@/lib/pg'
import { findCompanyDescription } from '@/lib/company-descriptions'
import { findCompanyProfile, type CompanyProfile } from '@/lib/company-profiles'
import { normalizeCompanyName } from '@/lib/company-utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'

type CompanyRow = {
  id: number
  razon_social: string
  rut: string | null
  rut_numero: number | null
  rut_dv: string | null
  rut_cmf: string | null
  razon_social_cmf: string | null
  nombre_fantasia: string | null
  vigencia: string | null
  telefono: string | null
  fax: string | null
  domicilio: string | null
  region: string | null
  ciudad: string | null
  comuna: string | null
  email_contacto: string | null
  sitio_web_cmf: string | null
  codigo_postal: string | null
  ticker: string | null
  descripcion_empresa: string | null
  sitio_empresa: string | null
  filing_marzo: string | null
  filing_junio: string | null
  filing_septiembre: string | null
  filing_diciembre: string | null
}

type ProductRow = { id: string; year_range: string; price: number; sector: string }

function formatDateValue(d: any): string | null {
  if (!d) return null
  try {
    const date = d instanceof Date ? d : new Date(d)
    if (isNaN(date.getTime())) return null
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  const { rows } = await pgQuery<{ razon_social: string }>(
    "SELECT DISTINCT c.razon_social FROM companies c JOIN products p ON p.company_id = c.id AND p.is_active = true ORDER BY c.razon_social LIMIT 200"
  )
  return rows.map((r) => ({ slug: normalizeCompanyName(r.razon_social).toLowerCase().replace(/\s+/g, '-') }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)
  const title = company?.companyName ? `${company.companyName} — Perfil y Estados Financieros` : 'Empresa — FinData Chile'
  const description = company?.description || 'Perfil de empresa y estados financieros en FinData Chile.'
  return {
    title,
    description,
    alternates: { canonical: `/empresa/${slug}` },
    openGraph: { title, description, url: `/empresa/${slug}` },
  }
}

async function getCompanyBySlug(slug: string) {
  // Buscar por slug comparando por razón social y también por alias, de forma independiente
  const { rows: companyRows } = await pgQuery<CompanyRow>(
    `SELECT DISTINCT c.*
     FROM companies c
     LEFT JOIN company_aliases a ON a.company_id = c.id
     WHERE (
       -- Match por razón social
       btrim(
         regexp_replace(
           LOWER(translate(c.razon_social, 'ÁÉÍÓÚÜÑáéíóúüñ.&', 'AEIOUUNaeiouun--')),
           '[^a-z0-9]+', '-', 'g'
         )
       , '-') = $1
       OR btrim(
         regexp_replace(
           regexp_replace(
             LOWER(translate(c.razon_social, 'ÁÉÍÓÚÜÑáéíóúüñ.&', 'AEIOUUNaeiouun--')),
             '[^a-z0-9]+', '-', 'g'
           ),
           '(-s-a(?:-[a-z0-9]+)*)$', '', 'g'
         )
       , '-') = $1
       -- Match por alias
       OR (
         a.alias IS NOT NULL AND (
           btrim(
             regexp_replace(
               LOWER(translate(a.alias, 'ÁÉÍÓÚÜÑáéíóúüñ.&', 'AEIOUUNaeiouun--')),
               '[^a-z0-9]+', '-', 'g'
             )
           , '-') = $1
           OR btrim(
             regexp_replace(
               regexp_replace(
                 LOWER(translate(a.alias, 'ÁÉÍÓÚÜÑáéíóúüñ.&', 'AEIOUUNaeiouun--')),
                 '[^a-z0-9]+', '-', 'g'
               ),
               '(-s-a(?:-[a-z0-9]+)*)$', '', 'g'
             )
           , '-') = $1
         )
       )
     )
     LIMIT 1`,
    [slug]
  )
  const company = companyRows[0]
  if (!company) {
    // Fallback más permisivo: coincide por prefijo con sufijos legales
    const { rows: loose } = await pgQuery<CompanyRow>(
      `SELECT DISTINCT c.*
       FROM companies c
       LEFT JOIN company_aliases a ON a.company_id = c.id
       WHERE (
         -- razón social que empieza con el slug (permitiendo sufijos como s-a, ltda, etc.)
         btrim(
           regexp_replace(
             LOWER(translate(c.razon_social, 'ÁÉÍÓÚÜÑáéíóúüñ.&', 'AEIOUUNaeiouun--')),
             '[^a-z0-9]+', '-', 'g'
           )
         , '-') LIKE ($1 || '%')
         OR (
           a.alias IS NOT NULL AND btrim(
             regexp_replace(
               LOWER(translate(a.alias, 'ÁÉÍÓÚÜÑáéíóúüñ.&', 'AEIOUUNaeiouun--')),
               '[^a-z0-9]+', '-', 'g'
             )
           , '-') LIKE ($1 || '%')
         )
       )
       ORDER BY c.razon_social
       LIMIT 1`,
      [slug]
    )
    if (!loose[0]) return null
    const looseCompany = loose[0]
    // Reemplazar para el resto de la función
    return await (async () => {
      const { rows: prods } = await pgQuery<ProductRow>(
        `SELECT id, year_range, price, sector
         FROM products WHERE company_id = $1 AND is_active = true
         ORDER BY year_range DESC`,
        [looseCompany.id]
      )
      const prices = prods.map((p) => Number(p.price || 0))
      const priceMin = prices.length ? Math.min(...prices) : 0
      const priceMax = prices.length ? Math.max(...prices) : 0
      const sector = prods[0]?.sector || ''
      const description = looseCompany.descripcion_empresa || findCompanyDescription(looseCompany.razon_social) || ''
      const profile = findCompanyProfile(looseCompany.razon_social)
      return {
        companyName: looseCompany.razon_social,
        sector,
        description,
        profile,
        filing_marzo: formatDateValue(looseCompany.filing_marzo),
        filing_junio: formatDateValue(looseCompany.filing_junio),
        filing_septiembre: formatDateValue(looseCompany.filing_septiembre),
        filing_diciembre: formatDateValue(looseCompany.filing_diciembre),
        ticker: looseCompany.ticker,
        products: prods.map((p) => ({ id: p.id, yearRange: p.year_range, price: Number(p.price || 0) })),
        priceMin,
        priceMax,
      }
    })()
  }

  // Productos activos de la empresa
  const { rows: prods } = await pgQuery<ProductRow>(
    `SELECT id, year_range, price, sector
     FROM products WHERE company_id = $1 AND is_active = true
     ORDER BY year_range DESC`,
    [company.id]
  )
  const prices = prods.map((p) => Number(p.price || 0))
  const priceMin = prices.length ? Math.min(...prices) : 0
  const priceMax = prices.length ? Math.max(...prices) : 0
  const sector = prods[0]?.sector || ''

  // Descripción priorizando DB; fallback a descripciones auxiliares
  const description = company.descripcion_empresa || findCompanyDescription(company.razon_social) || ''
  const profile = findCompanyProfile(company.razon_social)

  return {
    companyName: company.razon_social,
    sector,
    description,
    profile,
    filing_marzo: formatDateValue(company.filing_marzo),
    filing_junio: formatDateValue(company.filing_junio),
    filing_septiembre: formatDateValue(company.filing_septiembre),
    filing_diciembre: formatDateValue(company.filing_diciembre),
    ticker: company.ticker,
    products: prods.map((p) => ({ id: p.id, yearRange: p.year_range, price: Number(p.price || 0) })),
    priceMin,
    priceMax,
  }
}

function formatClp(v: number) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(Number(v || 0)))
}

function getNextFilingDates(baseDate = new Date()) {
  const year = baseDate.getFullYear()
  // Fechas de referencia (ajustables) según ejemplo del usuario
  const q1 = new Date(year, 4, 30) // 30/05/Y
  const q2 = new Date(year, 8, 12) // 12/09/Y
  const q3 = new Date(year, 10, 28) // 28/11/Y
  const annual = new Date(year + 1, 2, 31) // 31/03/Y+1
  const fmt = (d: Date) => d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return {
    headers: ['Intermedio (Marzo)', 'Intermedio (Junio)', 'Intermedio (Septiembre)', 'Anual (Diciembre)'],
    dates: [fmt(q1), fmt(q2), fmt(q3), fmt(annual)],
  }
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)
  if (!company) return <div className="max-w-5xl mx-auto px-6 py-16">Empresa no encontrada</div>
  const filingDb = {
    headers: ['Intermedio (Marzo)', 'Intermedio (Junio)', 'Intermedio (Septiembre)', 'Anual (Diciembre)'],
    dates: [company.filing_marzo, company.filing_junio, company.filing_septiembre, company.filing_diciembre]
  }
  const filing = filingDb.dates.some(Boolean) ? filingDb : getNextFilingDates()
  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="relative rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-100 opacity-60 blur-3xl" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
                <span>Empresa</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">{company.companyName}</h1>
              <div className="text-sm text-gray-600 mb-4">{company.sector}</div>
              {company.description && <p className="text-gray-700 max-w-3xl leading-relaxed">{company.description}</p>}
              {company.ticker && (
                <div className="mt-2 text-xs text-slate-600">Ticker: <span className="font-medium text-slate-900">{company.ticker}</span></div>
              )}
            </div>
            <div className="shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
                  <div className="text-[11px] text-slate-500">Desde</div>
                  <div className="text-base font-medium text-slate-900">{formatClp(company.priceMin)}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
                  <div className="text-[11px] text-slate-500">Hasta</div>
                  <div className="text-base font-medium text-slate-900">{formatClp(company.priceMax)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/tienda">
              <Button className="bg-blue-600 hover:bg-blue-700">Explorar en Tienda</Button>
            </Link>
            <Link href="/compras">
              <Button variant="outline">Ver Mis Compras</Button>
            </Link>
            <Button variant="outline" className="opacity-60 cursor-not-allowed" disabled>
              Próximamente: Métricas y Ratios
            </Button>
          </div>
        </div>

        {/* Sección info & próximos informes */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Lista de productos */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-light text-slate-900 mb-4">Estados financieros disponibles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {company.products.map((p) => (
                  <div key={p.id} className="group rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-blue-200 transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{p.yearRange}</div>
                        <div className="text-xs text-slate-600">Balance + Resultados + Flujos</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-medium text-slate-900">{formatClp(p.price)}</div>
                        <div className="mt-2 flex gap-2 justify-end">
                          <AddToCartButton productId={p.id} size="sm" />
                          <Link href="/tienda" className="text-xs text-blue-600 hover:underline self-center">Ver en tienda</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {/* Próximos informes */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 text-sm font-medium text-slate-900">Próximos informes financieros</div>
              <div className="p-5 text-sm">
                <div className="grid grid-cols-2 gap-4 text-slate-700">
                  {filing.headers.map((h, i) => (
                    <div key={h} className="space-y-1">
                      <div className="text-xs text-slate-500">{h}</div>
                      <div className="font-medium">{filing.dates[i]}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-slate-500">Fechas referenciales sujetas a cambios según publicación oficial.</div>
              </div>
            </div>

        {company.profile && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Información de la empresa</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {Object.entries(company.profile as CompanyProfile).map(([key, value]) => (
                value ? (
                  <div key={key} className="flex justify-between gap-3">
                    <div className="text-gray-500">{key}</div>
                    <div className="text-gray-900 text-right break-words max-w-[60%]">
                      {key.toLowerCase().includes('sitio') ? (
                        <a href={value} target="_blank" className="text-blue-600 hover:underline">{value}</a>
                      ) : (
                        value
                      )}
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        )}
          </div>
        </div>

      </div>
    </div>
  )
}


