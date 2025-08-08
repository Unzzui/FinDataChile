import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tipo de cambio CLP
let cachedClpRate: { value: number; at: number } | null = null
const RATE_TTL_MS = 10 * 60 * 1000 // 10 minutos

export async function getClpPerUsd(): Promise<number> {
  const now = Date.now()
  if (cachedClpRate && now - cachedClpRate.at < RATE_TTL_MS) return cachedClpRate.value
  // Intentar múltiples fuentes, fallback a 1000 si fallan todas
  const tryFetch = async (url: string, parse: (json: any) => number | null) => {
    try {
      const resp = await fetch(url)
      if (!resp.ok) return null
      const json = await resp.json()
      return parse(json)
    } catch {
      return null
    }
  }
  // Fuente 1: exchangerate.host (gratis)
  const r1 = await tryFetch('https://api.exchangerate.host/latest?base=USD&symbols=CLP', (j) => Number(j?.rates?.CLP) || null)
  const rate = r1 && isFinite(r1) && r1 > 0 ? r1 : 1000
  cachedClpRate = { value: rate, at: now }
  return rate
}
