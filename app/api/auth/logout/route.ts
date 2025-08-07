import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest) {
  const res = NextResponse.json({ success: true })
  res.cookies.set('userToken', '', { path: '/', httpOnly: true, maxAge: 0 })
  return res
}


