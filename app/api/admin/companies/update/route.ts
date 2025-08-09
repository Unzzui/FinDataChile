import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { pgQuery } from '@/lib/pg'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('adminToken')?.value
    if (!(await verifyAdminToken(adminToken))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const id = Number(body?.id)
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    const fields: string[] = []
    const params: any[] = []
    let idx = 1
    const setField = (col: string, val: any) => {
      fields.push(`${col} = $${idx++}`)
      params.push(val)
    }

    if (typeof body.razon_social === 'string') setField('razon_social', body.razon_social)
    if (typeof body.ticker === 'string' || body.ticker === null) setField('ticker', body.ticker)
    if (typeof body.descripcion_empresa === 'string' || body.descripcion_empresa === null) setField('descripcion_empresa', body.descripcion_empresa)
    if (typeof body.sitio_empresa === 'string' || body.sitio_empresa === null) setField('sitio_empresa', body.sitio_empresa)

    if (fields.length === 0) return NextResponse.json({ error: 'Sin campos para actualizar' }, { status: 400 })

    params.push(id)
    await pgQuery(
      `UPDATE companies SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx}`,
      params
    )

    try { revalidateTag('products') } catch {}

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error actualizando company:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}


