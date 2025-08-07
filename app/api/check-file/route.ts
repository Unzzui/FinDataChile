import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filePath } = body;

    if (!filePath) {
      return NextResponse.json(
        { error: 'Ruta de archivo requerida' },
        { status: 400 }
      );
    }

    // Construir ruta completa del archivo
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    try {
      // Verificar que el archivo existe
      await fs.access(fullPath);
      
      // Obtener información del archivo
      const stats = await fs.stat(fullPath);
      
      return NextResponse.json({
        exists: true,
        size: stats.size,
        lastModified: stats.mtime,
      });
      
    } catch (error) {
      return NextResponse.json({
        exists: false,
        error: 'Archivo no encontrado',
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error verificando archivo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 