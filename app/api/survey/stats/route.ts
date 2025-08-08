import { NextRequest, NextResponse } from 'next/server'
import { getSubscriptionSurveyStats } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // En producción podrías añadir autenticación aquí
    const stats = await getSubscriptionSurveyStats()

    return NextResponse.json({
      success: true,
      data: {
        total: stats.total,
        interested: stats.interested,
        notInterested: stats.total - stats.interested,
        interestRate: stats.total > 0 ? ((stats.interested / stats.total) * 100).toFixed(1) : '0',
        recentWeek: stats.recent
      }
    })

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
