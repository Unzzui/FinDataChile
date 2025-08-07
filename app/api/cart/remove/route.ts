import { NextRequest, NextResponse } from 'next/server'
import { removeFromCart } from '@/lib/database'
import { verifyUserToken } from '@/lib/user-auth'

export async function DELETE(request: NextRequest) {
  try {
    const { productId } = await request.json()
    const token = request.cookies.get('userToken')?.value
    const payload = verifyUserToken(token)
    let userEmail = payload?.email || null
    if (!userEmail) {
      const guestId = request.cookies.get('guestId')?.value
      userEmail = guestId ? `guest:${guestId}` : null
    }
    if (!userEmail || !productId) {
      return NextResponse.json({ error: 'No autorizado o productId faltante' }, { status: 400 })
    }

    await removeFromCart(userEmail, productId)

    return NextResponse.json({ 
      success: true,
      message: 'Producto removido del carrito'
    })
  } catch (error) {
    console.error('Error removiendo del carrito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 