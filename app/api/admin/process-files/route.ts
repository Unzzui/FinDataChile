import { NextRequest, NextResponse } from 'next/server'
import { upsertProduct } from '@/lib/database'
import { clasificarEmpresaDesdeArchivo } from '@/lib/clasificador-empresas'
import { VercelBlobStorage } from '@/lib/vercel-blob-storage'

const blobStorage = new VercelBlobStorage()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const metadataStr = formData.get('metadata') as string
    
    if (!file) {
      return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
    }

    let metadata
    try {
      metadata = JSON.parse(metadataStr)
    } catch {
      return NextResponse.json({ error: 'Metadata inválida' }, { status: 400 })
    }

    try {
      // Clasificar empresa automáticamente (antes de subir para generar ID)
      const empresaInfo = clasificarEmpresaDesdeArchivo(file.name)
      
      // Extraer información del nombre del archivo
      const fileInfo = extractFileInfo(file.name)
      
      // Generar ID único para el producto
      const productId = generateProductId(empresaInfo.nombre, fileInfo.yearRange)
      
      // Convertir archivo a buffer para subir
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Subir archivo a Vercel Blob Storage
      console.log('Subiendo archivo a Vercel Blob Storage:', file.name)
      const uploadResult = await blobStorage.uploadExcelFile(productId, file.name, buffer)
      
      console.log('Archivo subido exitosamente:', uploadResult.url)
      
      // Crear objeto producto para la base de datos
      const product = {
        id: productId,
        companyId: generateCompanyId(empresaInfo.nombre),
        companyName: formatCompanyName(empresaInfo.nombre),
        sector: empresaInfo.sector,
        yearRange: fileInfo.yearRange,
        startYear: fileInfo.startYear,
        endYear: fileInfo.endYear,
        price: determinePrice(fileInfo.periodType, fileInfo.yearRange),
        filePath: uploadResult.url, // Usar la URL de Vercel Blob Storage
        description: generateDescription(formatCompanyName(empresaInfo.nombre), fileInfo),
        isQuarterly: fileInfo.periodType === 'trimestral',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Guardar en base de datos
      await upsertProduct(product)
      
      return NextResponse.json({
        success: true,
        processedFiles: [{
          ...metadata,
          productId: productId,
          empresaInfo,
          fileInfo,
          uploadUrl: uploadResult.url,
          success: true
        }],
        totalProcessed: 1,
        totalErrors: 0
      })
      
    } catch (error) {
      console.error(`Error procesando archivo ${file.name}:`, error)
      return NextResponse.json({
        success: false,
        processedFiles: [{
          ...metadata,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido'
        }],
        totalProcessed: 0,
        totalErrors: 1
      })
    }

  } catch (error) {
    console.error('Error en procesamiento de archivos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para formatear nombre de empresa para mostrar
function formatCompanyName(rawName: string): string {
  return rawName
    .replace(/_/g, ' ') // Reemplazar guiones bajos con espacios
    .replace(/\b\w/g, letter => letter.toUpperCase()) // Capitalizar primera letra de cada palabra
    .replace(/\bSa\b/g, 'S.A.') // Formatear S.A.
    .replace(/\bSac\b/g, 'S.A.C.') // Formatear S.A.C.
    .replace(/\bLtda\b/g, 'Ltda.') // Formatear Ltda.
    .replace(/\bEeff\b/g, '') // Remover EEFF
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .trim() // Remover espacios al inicio y final
}
function extractFileInfo(filename: string) {
  // Remover extensión
  const nameWithoutExt = filename.replace(/\.(xlsx|xls)$/i, '')
  
  // Detectar tipo de período
  const isQuarterly = /trimestral/i.test(nameWithoutExt)
  const periodType = isQuarterly ? 'trimestral' : 'anual'
  
  // Extraer rango de años
  const yearMatch = nameWithoutExt.match(/(\d{4})-(\d{4})/)
  let startYear = 2020
  let endYear = 2024
  let yearRange = '2020-2024'
  
  if (yearMatch) {
    startYear = parseInt(yearMatch[1])
    endYear = parseInt(yearMatch[2])
    yearRange = `${startYear}-${endYear}`
  }
  
  return {
    periodType,
    isQuarterly,
    startYear,
    endYear,
    yearRange
  }
}

// Función para generar ID de producto único
function generateProductId(companyName: string, yearRange: string): string {
  const cleanName = companyName.replace(/[^A-Z0-9_]/g, '').substring(0, 20)
  const timestamp = Date.now().toString().slice(-6)
  return `${cleanName}_${yearRange.replace('-', '_')}_${timestamp}`
}

// Función para generar ID de empresa
function generateCompanyId(companyName: string): number {
  // Crear un hash simple del nombre de la empresa
  let hash = 0
  for (let i = 0; i < companyName.length; i++) {
    const char = companyName.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convertir a 32bit integer
  }
  return Math.abs(hash) % 100000 // Asegurar que sea positivo y no muy largo
}

// Función para determinar precio basado en tipo y rango
function determinePrice(periodType: string, yearRange: string): number {
  // Precio fijo máximo de 2000 pesos por producto
  return 2000
}

// Función para generar descripción
function generateDescription(companyName: string, fileInfo: any): string {
  const periodText = fileInfo.isQuarterly ? 'trimestrales' : 'anuales'
  return `Estados financieros ${periodText} de ${companyName} período ${fileInfo.yearRange}. Incluye Balance General, Estado de Resultados y Flujo de Efectivo.`
}
