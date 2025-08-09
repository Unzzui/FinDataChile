import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { pgQuery } from '@/lib/pg'

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!(await verifyAdminToken(adminToken))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 500)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0)
    const hasTicker = /^(1|true)$/i.test(searchParams.get('hasTicker') || '')
    const missingTicker = /^(1|true)$/i.test(searchParams.get('missingTicker') || '')
    const hasDescription = /^(1|true)$/i.test(searchParams.get('hasDescription') || '')
    const missingDescription = /^(1|true)$/i.test(searchParams.get('missingDescription') || '')
    const sort = (searchParams.get('sort') || 'name_asc').toLowerCase()
    const hasProducts = /^(1|true)$/i.test(searchParams.get('hasProducts') || '')

    const filters: string[] = []
    const params: any[] = []
    let idx = 1
    if (q) {
      filters.push(`(
        c.razon_social ILIKE $${idx} OR c.ticker ILIKE $${idx} OR c.rut ILIKE $${idx} OR
        CAST(c.rut_numero AS TEXT) ILIKE $${idx} OR c.rut_dv ILIKE $${idx} OR a.alias ILIKE $${idx}
      )`)
      params.push(`%${q}%`)
      idx++
    }
    if (hasTicker && !missingTicker) filters.push('c.ticker IS NOT NULL AND c.ticker <> \'\'')
    if (missingTicker && !hasTicker) filters.push('(c.ticker IS NULL OR c.ticker = \'\')')
    if (hasDescription && !missingDescription) filters.push('c.descripcion_empresa IS NOT NULL AND c.descripcion_empresa <> \'\'')
    if (missingDescription && !hasDescription) filters.push('(c.descripcion_empresa IS NULL OR c.descripcion_empresa = \'\')')
    if (hasProducts) filters.push('EXISTS (SELECT 1 FROM products p WHERE p.company_id = c.id AND p.is_active = true)')

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''

    let orderBy = 'ORDER BY c.razon_social ASC'
    if (sort === 'name_desc') orderBy = 'ORDER BY c.razon_social DESC'
    else if (sort === 'updated_desc') orderBy = 'ORDER BY c.updated_at DESC NULLS LAST'
    else if (sort === 'updated_asc') orderBy = 'ORDER BY c.updated_at ASC NULLS FIRST'

    const baseFrom = `FROM companies c LEFT JOIN company_aliases a ON a.company_id = c.id`

    const { rows } = await pgQuery(
      `SELECT c.id, c.razon_social, c.rut, c.rut_numero, c.rut_dv, c.ticker, c.descripcion_empresa, c.sitio_empresa
       ${baseFrom}
       ${where}
       ${orderBy}
       LIMIT ${limit} OFFSET ${offset}`,
      params
    )
    const { rows: countRows } = await pgQuery(
      `SELECT COUNT(DISTINCT c.id)::int AS total ${baseFrom} ${where}`,
      params
    )
    const total = countRows?.[0]?.total ?? 0

    return NextResponse.json({ success: true, items: rows, total })
  } catch (error) {
    console.error('Error listando companies:', error)
    return NextResponse.json({ success: false, items: [] }, { status: 500 })
  }
}


