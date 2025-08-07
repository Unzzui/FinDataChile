import { NextRequest, NextResponse } from 'next/server';
import { pgQuery } from '@/lib/pg';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get('userEmail');
    const recentOnly = searchParams.get('recentOnly') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail es requerido' },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        p.id,
        p.product_id,
        p.user_email,
        p.user_name,
        p.amount,
        p.status,
        p.created_at,
        pr.company_name,
        pr.sector,
        pr.year_range,
        pr.description,
        pr.price
      FROM purchases p
      JOIN products pr ON p.product_id = pr.id
      WHERE p.user_email = $1
      ORDER BY p.created_at DESC
    `;
    const params: any[] = [userEmail];
    if (recentOnly && limit) {
      query += ' LIMIT $2';
      params.push(limit);
    }

    const { rows: purchases } = await pgQuery(query, params);

    return NextResponse.json({
      success: true,
      purchases: purchases.map(purchase => ({
        id: purchase.id,
        product_id: purchase.product_id,
        company_name: purchase.company_name,
        sector: purchase.sector,
        year_range: purchase.year_range,
        price: purchase.price, // Usar el precio desde products
        description: purchase.description,
        status: purchase.status,
        created_at: purchase.created_at
      }))
    });

  } catch (error) {
    console.error('Error obteniendo compras:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 