import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
// Eliminamos dependencia de SQLite en producción
import { pgQuery } from '@/lib/pg'

export async function POST(request: NextRequest) {
  const adminToken = request.cookies.get('adminToken')?.value
  if (!verifyAdminToken(adminToken)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    // Este endpoint ya no depende de SQLite; mantenerlo temporalmente para migraciones manuales si conservas el archivo local.
    return NextResponse.json({ success: true, note: 'Migración ya realizada. Endpoint desactivado tras retirar SQLite.' })

    
  } catch (error) {
    console.error('Error migrando datos:', error)
    return NextResponse.json({ error: 'Error migrando datos' }, { status: 500 })
  }
}


