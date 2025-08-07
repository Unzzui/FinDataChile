import { NextRequest, NextResponse } from 'next/server';
import { pgQuery } from '@/lib/pg';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get('userEmail');
    const productId = searchParams.get('productId');

    if (!userEmail || !productId) {
      return NextResponse.json(
        { error: 'userEmail y productId son requeridos' },
        { status: 400 }
      );
    }

    const { rows } = await pgQuery(
      'SELECT id FROM purchases WHERE user_email = $1 AND product_id = $2',
      [userEmail, productId]
    );

    return NextResponse.json({
      success: true,
      hasPurchased: rows.length > 0
    });

  } catch (error) {
    console.error('Error verificando compra:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 