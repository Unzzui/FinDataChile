import { NextRequest, NextResponse } from 'next/server'
import { upsertProduct } from '@/lib/database'
import { clasificarEmpresaDesdeArchivo } from '@/lib/clasificador-empresas'
import { VercelBlobStorage } from '@/lib/vercel-blob-storage'
import { pgQuery } from '@/lib/pg'

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
      // Parse RUT desde metadata (prioridad) o nombre de archivo
      function parseRut(raw: string | null | undefined) {
        if (!raw) return { rutNumero: null as number | null, dv: null as string | null }
        const m = String(raw).trim().match(/^(\d{7,8})-([0-9kK])$/)
        if (!m) return { rutNumero: null, dv: null }
        return { rutNumero: parseInt(m[1], 10), dv: m[2].toUpperCase() }
      }
      function parseRutFromFileName(name: string) {
        const m = name.match(/(\d{7,8})-([0-9kK])/)
        if (!m) return { rutNumero: null as number | null, dv: null as string | null }
        return { rutNumero: parseInt(m[1], 10), dv: m[2].toUpperCase() }
      }
      async function findOrCreateCompanyByRut(rutNumero: number, dv: string, razonSocialFallback: string) {
        const existing = await pgQuery<{ id: number; razon_social: string }>(
          'SELECT id, razon_social FROM companies WHERE rut_numero = $1 AND rut_dv = $2 LIMIT 1',
          [rutNumero, dv]
        )
        if (existing.rows[0]) return existing.rows[0]
        const inserted = await pgQuery<{ id: number; razon_social: string }>(
          `INSERT INTO companies (razon_social, rut, rut_numero, rut_dv, rut_sin_guion, rut_cmf)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, razon_social`,
          [
            razonSocialFallback || `Empresa ${rutNumero}-${dv}`,
            `${rutNumero}-${dv}`,
            rutNumero,
            dv,
            String(rutNumero),
            `${rutNumero} - ${dv}`,
          ]
        )
        return inserted.rows[0]
      }

      const rutFromMeta = parseRut(metadata?.rut)
      const rutFromName = parseRutFromFileName(file.name)
      
      // Extraer información del nombre del archivo
      const fileInfo = extractFileInfo(file.name)
      
      // Resolver empresa por RUT si está disponible; si no, clasificar por nombre
      const clasif = clasificarEmpresaDesdeArchivo(file.name)
      let companyName = formatCompanyName(clasif.nombre)
      let companyId: number | null = null
      const rutNumero = rutFromMeta.rutNumero || rutFromName.rutNumero
      const dv = rutFromMeta.dv || rutFromName.dv
      if (rutNumero && dv) {
        try {
          const found = await findOrCreateCompanyByRut(rutNumero, dv, companyName)
          companyId = found.id
          companyName = found.razon_social || companyName
        } catch {}
      }

      // Generar ID único para el producto
      const productId = generateProductId((rutNumero && dv) ? `${rutNumero}-${dv}` : companyName, fileInfo.yearRange)
      
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
        companyId: companyId ?? generateCompanyId(companyName),
        companyName,
        sector: clasif.sector,
        yearRange: fileInfo.yearRange,
        startYear: fileInfo.startYear,
        endYear: fileInfo.endYear,
        price: determinePrice(fileInfo.periodType, fileInfo.yearRange),
        filePath: uploadResult.url, // Usar la URL de Vercel Blob Storage
         description: generateShortDescription(formatCompanyName(clasif.nombre), clasif.sector),
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
          empresaInfo: clasif,
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
  // Precio individual aplicando psicología de precios (terminado en .900)
  return 2900
}

// Función para generar descripción
function generateShortDescription(companyName: string, sector: string): string {
  const sectorSnippet = sector ? ` (${sector})` : ''
  return `${companyName}${sectorSnippet}. Estados financieros oficiales en formato Excel.`
}
