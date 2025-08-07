import { NextRequest, NextResponse } from 'next/server'
import { clearCart } from '@/lib/database'
import { verifyUserToken } from '@/lib/user-auth'

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('userToken')?.value
    const payload = verifyUserToken(token)
    let userEmail = payload?.email || null
    if (!userEmail) {
      const guestId = request.cookies.get('guestId')?.value
      userEmail = guestId ? `guest:${guestId}` : null
    }
    if (!userEmail) {
      return NextResponse.json({ success: true, message: 'Nada para limpiar' })
    }

    await clearCart(userEmail)

    return NextResponse.json({ 
      success: true,
      message: 'Carrito limpiado'
    })
  } catch (error) {
    console.error('Error limpiando carrito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 