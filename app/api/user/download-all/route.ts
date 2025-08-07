import { NextRequest, NextResponse } from 'next/server';
// removed getDatabase (SQLite). All data comes from Postgres helpers
import { verifyUserToken } from '@/lib/user-auth';
import { promises as fs } from 'fs';
import path from 'path';
import archiver from 'archiver';
import { blobStorage } from '@/lib/vercel-blob-storage';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('userToken')?.value
    const payload = verifyUserToken(token)
    const userEmail = payload?.email
    if (!userEmail) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { getUserPurchasedFiles } = await import('@/lib/database')
    const purchases = await getUserPurchasedFiles(userEmail)

    if (purchases.length === 0) {
      return NextResponse.json(
        { error: 'No tienes archivos para descargar' },
        { status: 404 }
      );
    }

    // Crear archivo ZIP
    const archive = archiver('zip', {
      zlib: { level: 9 } // Máxima compresión
    });

    // Crear stream para el ZIP
    const chunks: Buffer[] = [];
    archive.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    // Agregar archivos al ZIP
    for (const purchase of purchases) {
      try {
        const originalFileName = purchase.file_path.split('/').pop()
        const downloadUrl = await blobStorage.getDownloadUrl(purchase.product_id, originalFileName)
        const resp = await fetch(downloadUrl)
        if (!resp.ok) {
          console.warn(`Archivo no disponible: ${purchase.product_id}`)
          continue
        }
        const fileBuffer = Buffer.from(await resp.arrayBuffer())
        const fileName = `${purchase.company_name}_${purchase.year_range}.xlsx`
        archive.append(fileBuffer, { name: fileName })
        
      } catch (error) {
        console.error(`Error agregando archivo al ZIP: ${purchase.company_name}`, error);
      }
    }

    // Finalizar el ZIP
    await archive.finalize();

    // Combinar chunks en un buffer
    const zipBuffer = Buffer.concat(chunks);

    // Crear nombre del archivo ZIP
    const zipFileName = `FinData_Chile_${userEmail}_${new Date().toISOString().split('T')[0]}.zip`;

    // Registrar descarga
    for (const purchase of purchases) {
      try {
        const { recordDownload } = await import('@/lib/database');
        await recordDownload(userEmail, purchase.product_id);
      } catch (error) {
        console.error('Error registrando descarga:', error);
      }
    }

    // Retornar archivo ZIP
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFileName}"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generando ZIP:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 