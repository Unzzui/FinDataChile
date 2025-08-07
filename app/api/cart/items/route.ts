import { NextRequest, NextResponse } from 'next/server'
import { getCartItems } from '@/lib/database'
import { verifyUserToken } from '@/lib/user-auth'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    // Resolver usuario de cookie (userToken) o guestId
    const token = request.cookies.get('userToken')?.value
    const payload = verifyUserToken(token)
    let userEmail = payload?.email || null
    if (!userEmail) {
      const guestId = request.cookies.get('guestId')?.value
      userEmail = guestId ? `guest:${guestId}` : null
    }
    if (!userEmail) {
      // Crear guestId si no existe
      const existingGuest = request.cookies.get('guestId')?.value
      const newGuest = existingGuest || crypto.randomUUID()
      const res = NextResponse.json({ success: true, items: [] })
      if (!existingGuest) {
        res.cookies.set('guestId', newGuest, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
      }
      return res
    }

    const cartItemsRaw = await getCartItems(userEmail)
    const cartItems = cartItemsRaw.map((it: any) => ({
      ...it,
      price: Number(it.price),
    }))

    return NextResponse.json({ 
      success: true,
      items: cartItems
    })
  } catch (error) {
    console.error('Error obteniendo items del carrito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 