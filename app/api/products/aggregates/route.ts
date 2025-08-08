import { NextResponse } from 'next/server'
import { pgQuery } from '@/lib/pg'

export const revalidate = 120

export async function GET() {
  try {
    const [sectorsRes, yearRangesRes, countsRes] = await Promise.all([
      pgQuery<{ sector: string }>(
        `SELECT DISTINCT sector FROM products WHERE is_active = true ORDER BY sector`
      ),
      pgQuery<{ year_range: string }>(
        `SELECT DISTINCT year_range FROM products WHERE is_active = true ORDER BY year_range`
      ),
      pgQuery<{ sector: string; count: string }>(
        `SELECT sector, COUNT(*)::text as count FROM products WHERE is_active = true GROUP BY sector ORDER BY sector`
      ),
    ])

    const sectors = sectorsRes.rows.map(r => r.sector)
    const yearRanges = yearRangesRes.rows.map(r => r.year_range)
    const countsBySector = Object.fromEntries(countsRes.rows.map(r => [r.sector, parseInt(r.count, 10)]))

    const res = NextResponse.json({ sectors, yearRanges, countsBySector })
    res.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=120')
    return res
  } catch (error) {
    console.error('Error obteniendo agregados de productos:', error)
    return NextResponse.json({ sectors: [], yearRanges: [], countsBySector: {} }, { status: 500 })
  }
}


