import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { upsertProduct } from '@/lib/database';
import { verifyAdminToken } from '@/lib/admin-auth';
import { blobStorage } from '@/lib/vercel-blob-storage'

interface ProcessedExcel {
  companyName: string;
  yearRange: string;
  startYear: number;
  endYear: number;
  sector: string;
  filePath: string;
  description: string;
  price: number;
}

// Función para extraer información del nombre del archivo
function parseFileName(filename: string): { companyName: string; startYear: number; endYear: number; isQuarterly: boolean } {
  // Ejemplo: COLBUN_SA_EEFF_Balance_Resultados_Flujos_Anual_2017-2024.xlsx
  // Ejemplo: COLBUN_SA_EEFF_Balance_Resultados_Flujos_Trimestral_2022-2024.xlsx
  const nameWithoutExt = filename.replace('.xlsx', '').replace('.xls', '');
  const parts = nameWithoutExt.split('_');
  
  // Buscar la empresa (primeras partes hasta EEFF)
  const eeffIndex = parts.findIndex(part => part === 'EEFF');
  const companyName = parts.slice(0, eeffIndex).join(' ');
  
  // Detectar si es trimestral o anual
  const isQuarterly = nameWithoutExt.toLowerCase().includes('trimestral');
  
  // Buscar años en el nombre (formato: 2017-2024)
  const yearMatch = nameWithoutExt.match(/(\d{4})-(\d{4})/);
  const startYear = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
  const endYear = yearMatch ? parseInt(yearMatch[2]) : new Date().getFullYear();
  
  return { companyName, startYear, endYear, isQuarterly };
}

// Función para determinar el sector basado en el nombre de la empresa
function determineSector(companyName: string): string {
  const name = companyName.toLowerCase();
  
  if (name.includes('banco') || name.includes('santander') || name.includes('estado')) {
    return 'Bancario';
  } else if (name.includes('falabella') || name.includes('ripley') || name.includes('cencosud')) {
    return 'Retail';
  } else if (name.includes('codelco') || name.includes('antofagasta') || name.includes('sqm')) {
    return 'Minería';
  } else if (name.includes('colbun') || name.includes('enel') || name.includes('engie')) {
    return 'Energía';
  } else if (name.includes('entel') || name.includes('movistar')) {
    return 'Telecomunicaciones';
  } else if (name.includes('afp')) {
    return 'AFP';
  } else if (name.includes('isapre')) {
    return 'Salud';
  } else if (name.includes('lan') || name.includes('latam')) {
    return 'Transporte';
  } else if (name.includes('ccu') || name.includes('embotelladora')) {
    return 'Consumo';
  } else if (name.includes('parque') || name.includes('mall')) {
    return 'Inmobiliario';
  }
  
  return 'Otros';
}

// Función para calcular precio basado en el rango de años
function calculatePrice(startYear: number, endYear: number): number {
  // Precios en CLP con tope de $2.000
  const years = endYear - startYear + 1
  let price = 1000
  if (years === 1) price = 1000
  else if (years <= 3) price = 1500
  else price = 2000
  return Math.min(2000, Math.max(500, price))
}

// Función para analizar el contenido del Excel
async function analyzeExcelContent(filePath: string): Promise<{ startYear: number; endYear: number; sheets: string[] }> {
  try {
    console.log(`Intentando leer archivo: ${filePath}`);
    
    // Verificar que el archivo existe
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      throw new Error(`El archivo no existe: ${filePath}`);
    }
    
    // Obtener estadísticas del archivo
    const stats = await fs.stat(filePath);
    console.log(`Tamaño del archivo: ${stats.size} bytes`);
    
    if (stats.size === 0) {
      throw new Error('El archivo está vacío');
    }
    
    // Leer el archivo como buffer primero
    const fileBuffer = await fs.readFile(filePath);
    console.log(`Buffer leído: ${fileBuffer.length} bytes`);
    
    // Usar XLSX.read con el buffer en lugar de XLSX.readFile
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    
    console.log(`Hojas encontradas: ${sheetNames.join(', ')}`);
    
    // Buscar años en los nombres de las hojas
    const years: number[] = [];
    sheetNames.forEach(sheetName => {
      const yearMatch = sheetName.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        years.push(parseInt(yearMatch[1]));
      }
    });
    
    console.log(`Años encontrados en hojas: ${years.join(', ')}`);
    
    const startYear = years.length > 0 ? Math.min(...years) : new Date().getFullYear();
    const endYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();
    
    console.log(`Rango de años determinado: ${startYear}-${endYear}`);
    
    return {
      startYear,
      endYear,
      sheets: sheetNames,
    };
  } catch (error) {
    console.error('Error analizando Excel:', error);
    const currentYear = new Date().getFullYear();
    return {
      startYear: currentYear,
      endYear: currentYear,
      sheets: [],
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Defensa en profundidad: verificar cookie adminToken además del middleware
    const adminToken = request.cookies.get('adminToken')?.value
    if (!(await verifyAdminToken(adminToken))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron archivos' },
        { status: 400 }
      );
    }

               const processedFiles: ProcessedExcel[] = [];
           const errors: string[] = [];
           const productsToAdd: any[] = [];

    // No se requiere conexión directa; usaremos helpers a Postgres
    
    // Usaremos Vercel Blob para almacenamiento privado

    const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50MB
    const allowedExt = ['.xlsx', '.xls']

    function sanitizeName(name: string) {
      return name
        .replace(/[^A-Za-z0-9._-]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')
    }

    for (const file of files) {
      try {
        console.log(`Procesando archivo: ${file.name}`);
        const ext = path.extname(file.name).toLowerCase()
        if (!allowedExt.includes(ext)) {
          throw new Error('Extensión no permitida. Solo .xlsx y .xls')
        }
        
        // Leer archivo en memoria (sin escribir a disco, compatible con Vercel)
        const ab = await file.arrayBuffer()
        if (ab.byteLength > MAX_SIZE_BYTES) {
          throw new Error('Archivo demasiado grande (máx 50MB)')
        }
        const buffer = Buffer.from(ab)

                       // Analizar archivo
               const { companyName, startYear: fileNameStartYear, endYear: fileNameEndYear, isQuarterly } = parseFileName(file.name);
               console.log(`Empresa detectada: ${companyName}`);
               console.log(`Años del nombre del archivo: ${fileNameStartYear}-${fileNameEndYear}`);
               console.log(`Tipo: ${isQuarterly ? 'Trimestral' : 'Anual'}`);
               
               // Usar los años del nombre del archivo en lugar de analizar el contenido
               const startYear = fileNameStartYear;
               const endYear = fileNameEndYear;
               console.log(`Años finales: ${startYear}-${endYear}`);
        
        // Determinar sector
        const sector = determineSector(companyName);
        console.log(`Sector determinado: ${sector}`);
        
        // Calcular precio
        const price = Math.min(2000, Math.max(500, calculatePrice(startYear, endYear)));
        console.log(`Precio calculado: $${price}`);
        
        // Subir a Vercel Blob en carpeta privada por producto
        const safeFinalName = sanitizeName(file.name)
        const upload = await blobStorage.uploadExcelFile(
          `${companyName.toLowerCase().replace(/\s+/g, '-')}-${startYear}-${endYear}-${isQuarterly ? 'trimestral' : 'anual'}`,
          safeFinalName,
          buffer
        )
        const finalRelativePath = upload.pathname // p.ej. paid/<productId>/<filename>
        console.log(`Archivo subido a blob: ${finalRelativePath}`)
        
        // No se requiere limpieza: no escribimos a disco en serverless

                       // Crear producto
        const productId = `${companyName.toLowerCase().replace(/\s+/g, '-')}-${startYear}-${endYear}-${isQuarterly ? 'trimestral' : 'anual'}`;
               
               const product = {
                 id: productId,
                 companyId: Math.floor(Math.random() * 1000) + 1,
                 companyName,
                 sector,
                 yearRange: `${startYear}-${endYear}`,
                 startYear,
                 endYear,
                 price,
          filePath: finalRelativePath,
                 description: `Estados Financieros ${isQuarterly ? 'Trimestrales' : 'Anuales'} ${startYear}-${endYear} - ${companyName}`,
                 isQuarterly,
                 isActive: true,
                 createdAt: new Date(),
                 updatedAt: new Date(),
               };

                       // Agregar producto a la lista para procesar duplicados
               productsToAdd.push(product);
               console.log(`Producto procesado: ${product.id}`);

        processedFiles.push({
          companyName,
          yearRange: `${startYear}-${endYear}`,
          startYear,
          endYear,
          sector,
          filePath: finalRelativePath,
          description: product.description,
          price,
        });

      } catch (error) {
        console.error(`Error procesando ${file.name}:`, error);
        errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        
        // No se requiere limpieza: no escribimos a disco en serverless
      }
    }

               // Eliminar duplicados y mantener solo el producto con más años por empresa
           const uniqueProducts = new Map();
           
           for (const product of productsToAdd) {
             const key = `${product.companyName}-${product.isQuarterly ? 'trimestral' : 'anual'}`;
             const existingProduct = uniqueProducts.get(key);
             
             if (!existingProduct || (product.endYear - product.startYear) > (existingProduct.endYear - existingProduct.startYear)) {
               uniqueProducts.set(key, product);
             }
           }
           
           // Guardar productos únicos en la base de datos (SQLite o Postgres)
           for (const product of uniqueProducts.values()) {
             try {
               await upsertProduct({
                 id: product.id,
                 companyId: product.companyId,
                 companyName: product.companyName,
                 sector: product.sector,
                 yearRange: product.yearRange,
                 startYear: product.startYear,
                 endYear: product.endYear,
                 price: product.price,
                 filePath: product.filePath,
                 description: product.description,
                 isQuarterly: product.isQuarterly,
                 isActive: product.isActive,
                 createdAt: new Date(),
                 updatedAt: new Date(),
               })
               console.log(`Producto guardado/actualizado en BD: ${product.id}`)
             } catch (dbError) {
               console.error(`Error guardando producto ${product.id}:`, dbError);
               errors.push(`Error guardando ${product.companyName}: ${dbError instanceof Error ? dbError.message : 'Error de base de datos'}`);
             }
           }
           
           return NextResponse.json({
             success: true,
             processed: processedFiles.length,
             uniqueProducts: uniqueProducts.size,
             errors: errors.length,
             files: processedFiles,
             errorDetails: errors,
           });

  } catch (error) {
    console.error('Error procesando archivos Excel:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 