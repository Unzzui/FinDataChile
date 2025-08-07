import { NextRequest, NextResponse } from 'next/server';
import { pgQuery } from '@/lib/pg';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const showAll = searchParams.get('showAll') === 'true';
    
    const query = showAll ? 'SELECT * FROM products ORDER BY company_name' : 'SELECT * FROM products WHERE is_active = true ORDER BY company_name';
    const { rows: products } = await pgQuery(query);
    
    console.log('Productos encontrados en BD:', products.length);
    console.log('Productos por sector:', products.reduce((acc, p) => {
      acc[p.sector] = (acc[p.sector] || 0) + 1;
      return acc;
    }, {} as any));
    
    if (showAll) {
      console.log('Productos activos:', products.filter(p => p.is_active).length);
      console.log('Productos inactivos:', products.filter(p => !p.is_active).length);
    }
    
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
      description: product.description,
      isActive: product.is_active,
      isQuarterly: product.description.toLowerCase().includes('trimestral'),
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));
    
    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error cargando productos:', error);
    return NextResponse.json([], { status: 500 });
  }
} 