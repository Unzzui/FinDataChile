import { NextRequest, NextResponse } from 'next/server'
import { verifyUserToken } from '@/lib/user-auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('userToken')?.value
  const payload = verifyUserToken(token)
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
  return NextResponse.json({ authenticated: true, user: { id: payload.sub, email: payload.email, name: payload.name } })
}


