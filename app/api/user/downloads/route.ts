import { NextRequest, NextResponse } from 'next/server';
import { getUserDownloadHistory } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email de usuario requerido' },
        { status: 400 }
      );
    }

    const downloads = await getUserDownloadHistory(userEmail);

    return NextResponse.json({
      success: true,
      downloads
    });

  } catch (error) {
    console.error('Error obteniendo descargas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 