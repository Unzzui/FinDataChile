import { NextRequest, NextResponse } from 'next/server';
import { pgQuery } from '@/lib/pg';
import { blobStorage } from '@/lib/vercel-blob-storage';
import { revalidateTag } from 'next/cache';

// DELETE - Eliminar producto por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { error: 'ID del producto es requerido' },
        { status: 400 }
      );
    }

    // Obtener información del producto antes de eliminarlo
    const { rows: prodRows } = await pgQuery('SELECT * FROM products WHERE id = $1', [productId]);
    const product = prodRows[0];
    
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Intentar eliminar archivos asociados en Vercel Blob
    try {
      // 1) Si hay un file_path concreto, borrar ese archivo
      if (product.file_path) {
        const parts = String(product.file_path).split('/');
        const filename = parts[parts.length - 1];
        if (filename) {
          await blobStorage.deleteFile(productId, filename);
        }
      }
      // 2) Defensa en profundidad: listar por prefijo y borrar todos los archivos del producto
      const files = await blobStorage.listProductFiles(productId);
      for (const f of files) {
        if (f.filename) {
          await blobStorage.deleteFile(productId, f.filename as string);
        }
      }
    } catch (blobError) {
      console.warn(`No se pudieron eliminar archivos del producto ${productId} en Blob:`, blobError);
      // No interrumpir la eliminación en BD por errores del storage
    }

    // Eliminar el producto y relaciones en BD
    await pgQuery('DELETE FROM cart_items WHERE product_id = $1', [productId]);
    await pgQuery('DELETE FROM purchases WHERE product_id = $1', [productId]);
    await pgQuery('DELETE FROM download_history WHERE product_id = $1', [productId]);
    await pgQuery('DELETE FROM products WHERE id = $1', [productId]);

    try { revalidateTag('products'); } catch {}

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
