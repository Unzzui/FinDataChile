import { NextRequest, NextResponse } from 'next/server'
import { saveSubscriptionSurvey } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, wouldPay, interests = [], useCase = '' } = body

    // Validaciones básicas
    if (!name || !email || typeof wouldPay !== 'boolean') {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Validar email básico (excepto para respuestas anónimas)
    if (email !== 'anonimo@temp.com') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Email inválido' },
          { status: 400 }
        )
      }
    }

    // Obtener información adicional de la request
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Guardar en la base de datos PostgreSQL
    const surveyId = await saveSubscriptionSurvey(
      name.trim(),
      email.toLowerCase().trim(),
      wouldPay,
      Array.isArray(interests) ? interests : [],
      useCase.trim(),
      ipAddress,
      userAgent
    )

    console.log(`Nueva encuesta guardada - ID: ${surveyId}, Email: ${email}, Interesado: ${wouldPay}, Intereses: ${interests.length}`)

    return NextResponse.json({
      success: true,
      message: wouldPay 
        ? 'Gracias por tu interés! Te contactaremos cuando esté disponible.' 
        : 'Gracias por tu feedback!',
      id: surveyId
    })

  } catch (error) {
    console.error('Error en survey submit:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

// Método OPTIONS para CORS si es necesario
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 