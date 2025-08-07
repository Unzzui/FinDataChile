import crypto from 'crypto'

const USER_JWT_SECRET = process.env.USER_JWT_SECRET || 'dev-user-secret-change-me'

export interface UserPayload {
  sub: string
  email: string
  name?: string
  iat?: number
  exp?: number
}

function base64url(input: Buffer | string) {
  return (typeof input === 'string' ? Buffer.from(input) : input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export function createUserToken(payload: Omit<UserPayload, 'iat' | 'exp'>, ttlSeconds = 60 * 60 * 24 * 30) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const nowSec = Math.floor(Date.now() / 1000)
  const fullPayload: UserPayload = { ...payload, iat: nowSec, exp: nowSec + ttlSeconds }
  const headerPart = base64url(JSON.stringify(header))
  const payloadPart = base64url(JSON.stringify(fullPayload))
  const data = `${headerPart}.${payloadPart}`
  const signature = base64url(crypto.createHmac('sha256', USER_JWT_SECRET).update(data).digest())
  return `${data}.${signature}`
}

export function verifyUserToken(token: string | undefined | null): UserPayload | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [headerPart, payloadPart, signaturePart] = parts
  const data = `${headerPart}.${payloadPart}`
  const expected = base64url(crypto.createHmac('sha256', USER_JWT_SECRET).update(data).digest())
  if (signaturePart !== expected) return null
  try {
    const json = Buffer.from(payloadPart.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
    const payload: UserPayload = JSON.parse(json)
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) return null
    return payload
  } catch {
    return null
  }
}


