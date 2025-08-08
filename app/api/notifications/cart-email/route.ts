import { NextRequest, NextResponse } from 'next/server'
import { getCartItems } from '@/lib/database'
import { sendCartReminderEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any))
    const userEmail = body?.userEmail as string | undefined
    if (!userEmail) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const items = await getCartItems(userEmail)
    if (!items || items.length === 0) {
      return NextResponse.json({ success: true, message: 'No hay items en el carrito' })
    }

    const ok = await sendCartReminderEmail(
      userEmail,
      items.map((it: any) => ({
        companyName: it.company_name,
        yearRange: it.year_range,
        price: Number(it.price || 0),
      }))
    )

    return NextResponse.json({ success: ok })
  } catch (error) {
    console.error('Error enviando correo de carrito:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}


