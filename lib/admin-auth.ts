const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev-secret-change-me'

interface AdminPayload {
  sub: string
  iat: number
  exp: number
}

function base64urlFromBytes(bytes: Uint8Array) {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function base64urlString(input: string) {
  if (typeof btoa !== 'undefined') {
    return btoa(input).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  }
  // Node fallback
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function hmacSha256Sign(data: string, secret: string): Promise<string> {
  if (typeof crypto !== 'undefined' && (crypto as any).subtle) {
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(data))
    return base64urlFromBytes(new Uint8Array(sigBuf))
  } else {
    const { createHmac } = await import('crypto')
    const sig = createHmac('sha256', secret).update(data).digest()
    return sig.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  }
}

export async function createAdminToken(subject: string, ttlSeconds = 60 * 60 * 24) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload: AdminPayload = { sub: subject, iat: now, exp: now + ttlSeconds }
  const headerPart = base64urlString(JSON.stringify(header))
  const payloadPart = base64urlString(JSON.stringify(payload))
  const data = `${headerPart}.${payloadPart}`
  const signaturePart = await hmacSha256Sign(data, ADMIN_JWT_SECRET)
  return `${data}.${signaturePart}`
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [headerPart, payloadPart, signaturePart] = parts
  const data = `${headerPart}.${payloadPart}`
  const expected = await hmacSha256Sign(data, ADMIN_JWT_SECRET)
  if (signaturePart !== expected) return false
  try {
    const json = typeof atob !== 'undefined'
      ? atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'))
      : Buffer.from(payloadPart.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
    const payload: AdminPayload = JSON.parse(json)
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) return false
    return true
  } catch {
    return false
  }
}


