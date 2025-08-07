import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Función para cargar productos desde JSON
async function loadProducts() {
  try {
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const productsData = await fs.readFile(productsPath, 'utf-8');
    return JSON.parse(productsData);
  } catch (error) {
    console.error('Error cargando productos:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      );
    }

    // Obtener información del producto
    const products = await loadProducts();
    const product = products.find((p: any) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: 'Producto no disponible' },
        { status: 400 }
      );
    }

    // Construir ruta del archivo
    const filePath = path.join(process.cwd(), 'public', product.filePath);
    
    try {
      // Verificar que el archivo existe
      await fs.access(filePath);
    } catch (error) {
      console.error(`Archivo no encontrado: ${filePath}`);
      return NextResponse.json(
        { 
          error: 'Archivo no encontrado en el servidor',
          details: `El archivo ${product.filePath} no existe. Contacta al administrador.`
        },
        { status: 404 }
      );
    }

    // Leer el archivo
    const fileBuffer = await fs.readFile(filePath);
    
    // Crear nombre de archivo para descarga
    const fileName = `${product.companyName.replace(/\s+/g, '_')}_${product.yearRange}.xlsx`;

    // Por seguridad, se deshabilita esta ruta genérica.
    // Usa /api/download-excel que valida compra del usuario.
    return NextResponse.json({ error: 'Descarga no permitida' }, { status: 403 });

  } catch (error) {
    console.error('Error descargando archivo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 