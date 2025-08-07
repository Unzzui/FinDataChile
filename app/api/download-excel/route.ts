import { NextRequest, NextResponse } from 'next/server';
import { generateExcelFile, getCompanyById } from '@/lib/excel-generator';
import { verifyUserToken } from '@/lib/user-auth';
import { blobStorage } from '@/lib/vercel-blob-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userEmail } = body;

    // Validar parámetros
    if (!productId) {
      return NextResponse.json(
        { error: 'productId es requerido' },
        { status: 400 }
      );
    }

    // Si hay sesión de usuario, usarla por sobre lo que envíe el cliente
    const token = request.cookies.get('userToken')?.value
    const payload = verifyUserToken(token)
    const effectiveEmail = payload?.email || userEmail
    if (!effectiveEmail) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    // Verificar compra
    const { canUserDownload } = await import('@/lib/database');
    const canDownload = await canUserDownload(effectiveEmail, productId);
    if (!canDownload) {
      return NextResponse.json(
        { error: 'No tienes permiso para descargar este archivo. Debes comprarlo primero.' },
        { status: 403 }
      );
    }

    // Obtener información del producto
    const { getProductById } = await import('@/lib/database');
    const product = await getProductById(productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Descargar desde Vercel Blob mediante URL firmada temporal
    const originalFileName = product.file_path.split('/').pop()
    const downloadUrl = await blobStorage.getDownloadUrl(product.id, originalFileName)
    const fileResp = await fetch(downloadUrl)
    if (!fileResp.ok) {
      return NextResponse.json({ error: 'Archivo no disponible' }, { status: 404 })
    }
    const fileBuffer = Buffer.from(await fileResp.arrayBuffer())
    const fileName = originalFileName

    // Registrar descarga si hay userEmail
    if (userEmail) {
      const { recordDownload } = await import('@/lib/database');
      await recordDownload(effectiveEmail, productId);
    }

    // Retornar archivo como descarga
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error descargando archivo Excel:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 