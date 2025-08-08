import Marketplace from "../../marketplace"
import { pgQuery } from "@/lib/pg"
import { unstable_cache } from "next/cache"

export const revalidate = 120

type ProductRecord = {
  id: string
  company_name: string
  sector: string
  year_range: string
  start_year: number
  end_year: number
  price: number
  file_path: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

function transformProducts(rows: ProductRecord[]) {
  return rows.map((product) => ({
    id: product.id,
    companyName: product.company_name,
    sector: product.sector,
    yearRange: product.year_range,
    startYear: product.start_year,
    endYear: product.end_year,
    price: product.price,
    filePath: product.file_path,
    description: product.description,
    isActive: product.is_active,
    isQuarterly: product.description?.toLowerCase?.().includes("trimestral") ?? false,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }))
}

const getActiveProductsCached = unstable_cache(
  async () => {
    const { rows } = await pgQuery<ProductRecord>(
      "SELECT * FROM products WHERE is_active = true ORDER BY company_name"
    )
    return transformProducts(rows)
  },
  ["products:list:active"],
  { revalidate: 120, tags: ["products"] }
)

export default async function TiendaPage() {
  const products = await getActiveProductsCached()
  return <Marketplace initialProducts={products} />
}
