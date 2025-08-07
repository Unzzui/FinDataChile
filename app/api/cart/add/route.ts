import { NextRequest, NextResponse } from 'next/server'
import { addToCart } from '@/lib/database'
import { verifyUserToken } from '@/lib/user-auth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { userEmail, productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'productId es requerido' },
        { status: 400 }
      )
    }

    // Resolver usuario desde cookie; si no existe, guest per-device
    const token = request.cookies.get('userToken')?.value
    const payload = verifyUserToken(token)
    let email = payload?.email
    let guestIdToSet: string | null = null
    if (!email) {
      const guestId = request.cookies.get('guestId')?.value || crypto.randomUUID()
      guestIdToSet = !request.cookies.get('guestId')?.value ? guestId : null
      email = `guest:${guestId}`
    }

    const success = await addToCart(email, productId)

    const res = NextResponse.json({ 
      success,
      message: success ? 'Producto agregado al carrito' : 'Producto ya está en el carrito'
    })
    if (guestIdToSet) {
      res.cookies.set('guestId', guestIdToSet, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
    }
    return res
  } catch (error) {
    console.error('Error agregando al carrito:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 