import { NextResponse } from 'next/server';
import { pgQuery } from '@/lib/pg';
import { findCompanyDescription } from '@/lib/company-descriptions'

export const revalidate = 120

export async function GET() {
  try {
    const { rows: products } = await pgQuery('SELECT * FROM products WHERE is_active = true ORDER BY company_name');
    
    // logs reducidos en producción
    
    // Transformar los productos al formato esperado
    const transformedProducts = products.map(product => ({
      id: product.id,
      companyName: product.company_name,
      sector: product.sector,
      yearRange: product.year_range,
      startYear: product.start_year,
      endYear: product.end_year,
      price: product.price,
      filePath: product.file_path,
      description: findCompanyDescription(product.company_name) || (product.description || '').replace(/Estados\s+financieros\s+.*?\.|Incluye\s+Balance\s+General,\s+Estado\s+de\s+Resultados\s+y\s+Flujo\s+de\s+Efectivo\./gi, '').trim(),
      isActive: product.is_active,
      isQuarterly: product.description.toLowerCase().includes('trimestral'),
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));
    
    const res = NextResponse.json(transformedProducts)
    // Cache-Control para CDN/navegador (Next API en Vercel)
    res.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=120')
    return res
  } catch (error) {
    console.error('Error cargando productos:', error);
    return NextResponse.json([], { status: 500 });
  }
} 