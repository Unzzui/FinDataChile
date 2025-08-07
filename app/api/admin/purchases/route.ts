import { NextRequest, NextResponse } from 'next/server';
import { pgQuery } from '@/lib/pg';

// GET - Obtener compras por email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    
    if (userEmail) {
      // Obtener compras de un usuario específico
      const { rows: purchases } = await pgQuery(`
        SELECT 
          p.*,
          pr.company_name,
          pr.sector,
          pr.description,
          pr.file_path
        FROM purchases p
        JOIN products pr ON p.product_id = pr.id
        WHERE p.user_email = $1
        ORDER BY p.created_at DESC
      `, [userEmail]);
      
      return NextResponse.json({
        success: true,
        purchases
      });
    } else {
      // Obtener todas las compras con información del producto
      const { rows: purchases } = await pgQuery(`
        SELECT 
          p.*,
          pr.company_name,
          pr.sector,
          pr.description,
          pr.file_path
        FROM purchases p
        JOIN products pr ON p.product_id = pr.id
        ORDER BY p.created_at DESC
      `);
      
      return NextResponse.json({
        success: true,
        purchases
      });
    }

  } catch (error) {
    console.error('Error obteniendo compras:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Agregar compra manualmente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, productId } = body;

    if (!userEmail || !productId) {
      return NextResponse.json(
        { error: 'userEmail y productId son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const { rows: prodRows } = await pgQuery('SELECT * FROM products WHERE id = $1', [productId]);
    const product = prodRows[0]
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Crear la compra
    const { rows: inserted } = await pgQuery(
      `INSERT INTO purchases (user_email, product_id, amount, status, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
      [userEmail, productId, product.price, 'completed']
    )

    return NextResponse.json({
      success: true,
      message: 'Compra agregada exitosamente',
      purchaseId: inserted[0]?.id
    });

  } catch (error) {
    console.error('Error agregando compra:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar compra
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const purchaseId = searchParams.get('purchaseId');
    
    if (!purchaseId) {
      return NextResponse.json(
        { error: 'purchaseId es requerido' },
        { status: 400 }
      );
    }

    // Eliminar la compra
    await pgQuery('DELETE FROM purchases WHERE id = $1', [purchaseId]);

    return NextResponse.json({
      success: true,
      message: 'Compra eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando compra:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 