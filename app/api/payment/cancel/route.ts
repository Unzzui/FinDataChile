import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirigir a página de cancelación
  return NextResponse.redirect(new URL('/payment/cancel', request.url));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, reason } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token de transacción no proporcionado' },
        { status: 400 }
      );
    }

    console.log('Transacción cancelada:', {
      token,
      reason: reason || 'Cancelación por usuario',
      timestamp: new Date().toISOString()
    });

    // En una implementación real, aquí podrías:
    // 1. Actualizar el estado de la transacción en tu base de datos
    // 2. Liberar los productos del carrito
    // 3. Enviar notificación al usuario

    return NextResponse.json({
      success: true,
      status: 'cancelled',
      message: 'Transacción cancelada exitosamente',
      redirectUrl: '/'
    });

  } catch (error) {
    console.error('Error cancelando transacción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 