import { NextRequest, NextResponse } from 'next/server';
import { blobStorage } from '@/lib/vercel-blob-storage';
import { pgQuery } from '@/lib/pg';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    const token = searchParams.get('token');

    if (!userEmail || !token) {
      return NextResponse.json(
        { error: 'Email y token requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario haya comprado el producto
    const purchaseResult = await pgQuery(
      'SELECT * FROM purchases WHERE user_email = $1 AND product_id = $2 AND status = $3',
      [userEmail, productId, 'completed']
    );

    if (!purchaseResult.rows || purchaseResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No tienes acceso a este producto' },
        { status: 403 }
      );
    }

    // Obtener información del producto para el nombre del archivo
    const productResult = await pgQuery(
      'SELECT company_name FROM products WHERE id = $1',
      [productId]
    );

    if (!productResult.rows || productResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const product = productResult.rows[0];

    // Registrar la descarga
    await pgQuery(
      'INSERT INTO download_history (user_email, product_id, downloaded_at) VALUES ($1, $2, NOW())',
      [userEmail, productId]
    );

    // Obtener URL de descarga desde Vercel Blob
    const filename = `${product.company_name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
    const downloadUrl = await blobStorage.getDownloadUrl(productId, filename);

    // Redirigir a la URL de descarga de Vercel Blob
    return NextResponse.redirect(downloadUrl);

  } catch (error) {
    console.error('Error downloading file:', error);
    
    if (error instanceof Error && error.message === 'File not found') {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
