import profiles from '@/lib/data/company-profiles.json'
import { normalizeCompanyName } from '@/lib/company-utils'

export type CompanyProfile = Record<string, string>

export function findCompanyProfile(companyName: string): CompanyProfile | null {
  try {
    const normalized = normalizeCompanyName(companyName)
    // Exact match
    if ((profiles as any)[companyName]) return (profiles as any)[companyName] as CompanyProfile
    // Normalized key match
    for (const [key, value] of Object.entries(profiles as Record<string, CompanyProfile>)) {
      if (normalizeCompanyName(key) === normalized) return value
    }
  } catch {}
  return null
}


