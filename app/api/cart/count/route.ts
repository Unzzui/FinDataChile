import { NextRequest, NextResponse } from 'next/server'
import { verifyUserToken } from '@/lib/user-auth'
import { pgQuery } from '@/lib/pg'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('userToken')?.value
    const payload = verifyUserToken(token)
    let userEmail = payload?.email || null
    if (!userEmail) {
      const guestId = request.cookies.get('guestId')?.value
      userEmail = guestId ? `guest:${guestId}` : null
    }

    if (!userEmail) {
      const existingGuest = request.cookies.get('guestId')?.value
      const newGuest = existingGuest || crypto.randomUUID()
      const res = NextResponse.json({ success: true, count: 0 })
      if (!existingGuest) {
        res.cookies.set('guestId', newGuest, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 })
      }
      return res
    }

    const { rows } = await pgQuery<{ count: string }>(
      'SELECT COUNT(*) as count FROM cart_items WHERE user_email = $1',
      [userEmail]
    )
    const count = parseInt(rows?.[0]?.count || '0', 10)
    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error('Error obteniendo conteo del carrito:', error)
    return NextResponse.json({ success: false, count: 0 }, { status: 500 })
  }
}


