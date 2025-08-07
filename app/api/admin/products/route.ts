import { NextRequest, NextResponse } from 'next/server';
import { pgQuery } from '@/lib/pg';

// GET - Obtener todos los productos
export async function GET() {
  try {
    const { rows: products } = await pgQuery('SELECT * FROM products ORDER BY company_name');
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, sector, yearRange, startYear, endYear, price, filePath, description, isActive } = body;

    const productId = `${companyName.toLowerCase().replace(/\s+/g, '-')}-${startYear}-${endYear}-${yearRange.includes('Trimestral') ? 'trimestral' : 'anual'}`;
    await pgQuery(
      `INSERT INTO products (
        id, company_id, company_name, sector, year_range, 
        start_year, end_year, price, file_path, description, 
        is_active, created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())`,
      [
        productId,
        Math.floor(Math.random() * 1000) + 1,
        companyName,
        sector,
        yearRange,
        startYear,
        endYear,
        price,
        filePath,
        description,
        isActive,
      ]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Producto creado exitosamente',
      productId 
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    // Obtener información del producto antes de eliminarlo
    const { rows: prodRows } = await pgQuery('SELECT * FROM products WHERE id = $1', [productId]);
    const product = prodRows[0]
    
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el producto y relaciones
    await pgQuery('DELETE FROM cart_items WHERE product_id = $1', [productId]);
    await pgQuery('DELETE FROM purchases WHERE product_id = $1', [productId]);
    await pgQuery('DELETE FROM download_history WHERE product_id = $1', [productId]);
    await pgQuery('DELETE FROM products WHERE id = $1', [productId]);

    return NextResponse.json({ 
      success: true, 
      message: 'Producto eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 