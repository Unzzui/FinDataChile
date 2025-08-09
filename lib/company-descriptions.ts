import descriptions from '@/lib/data/company-descriptions.json'

function normalizeName(name: string): string {
  return (name || '')
    .toUpperCase()
    .replace(/[^A-Z0-9_ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/_/g, ' ')
    .trim()
}

export function findCompanyDescription(companyName: string): string | null {
  if (!companyName) return null
  const normalized = normalizeName(companyName)
  // Exact key match
  if ((descriptions as any)[companyName]) return (descriptions as any)[companyName]
  if ((descriptions as any)[normalized]) return (descriptions as any)[normalized]

  // Normalized key match over all entries
  for (const [key, value] of Object.entries(descriptions as Record<string, string>)) {
    if (normalizeName(key) === normalized) return value
  }
  return null
}


