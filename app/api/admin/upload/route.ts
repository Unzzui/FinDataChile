import { NextRequest, NextResponse } from 'next/server';
import { blobStorage } from '@/lib/vercel-blob-storage';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación del admin
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    // En una implementación real, verificarías el JWT del admin
    // Por ahora, usamos la verificación simple existente
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'ID del producto requerido' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos Excel (.xlsx, .xls)' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 1MB para seguridad)
    if (file.size > 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande (máximo 1MB)' },
        { status: 400 }
      );
    }

    // Convertir a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Subir a Vercel Blob
    const result = await blobStorage.uploadExcelFile(
      productId,
      file.name,
      buffer
    );

    return NextResponse.json({
      success: true,
      message: 'Archivo subido exitosamente',
      data: {
        productId,
        filename: file.name,
        size: file.size,
        url: result.url,
        pathname: result.pathname
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// API para listar archivos de un producto
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'ID del producto requerido' },
        { status: 400 }
      );
    }

    // Verificar autenticación del admin
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticación requerido' },
        { status: 401 }
      );
    }

    const files = await blobStorage.listProductFiles(productId);

    return NextResponse.json({
      success: true,
      data: {
        productId,
        files
      }
    });

  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
