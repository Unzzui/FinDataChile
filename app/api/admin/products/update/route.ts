import { NextRequest, NextResponse } from 'next/server';
import { pgQuery } from '@/lib/pg';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      companyName, 
      sector, 
      yearRange, 
      startYear, 
      endYear, 
      price, 
      filePath, 
      description, 
      isActive 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const { rows: existRows } = await pgQuery('SELECT * FROM products WHERE id = $1', [id]);
    const existingProduct = existRows[0]
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el producto
    await pgQuery(
      `UPDATE products SET 
        company_name = $1,
        sector = $2,
        year_range = $3,
        start_year = $4,
        end_year = $5,
        price = $6,
        file_path = $7,
        description = $8,
        is_active = $9,
        updated_at = NOW()
      WHERE id = $10`,
      [
        companyName,
        sector,
        yearRange,
        startYear,
        endYear,
        price,
        filePath,
        description,
        isActive,
        id
      ]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Producto actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 