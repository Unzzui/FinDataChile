import empresasData from '@/lib/data/empresas-chilenas.json'

export interface EmpresaInfo {
  nombre: string
  sector: string
  confianza: number // 0-1, qué tan seguro está el algoritmo
}

export class ClasificadorEmpresas {
  private empresasPorSector: Record<string, string[]>
  private patronesBusqueda: Record<string, string[]>

  constructor() {
    this.empresasPorSector = empresasData.empresas
    this.patronesBusqueda = empresasData.mapeoSectores
  }

  /**
   * Extrae el nombre de la empresa desde el nombre del archivo Excel
   * Ejemplo: "AGRICOLA_NACIONAL_SAC_E_I_EEFF_Balance_Resultados_Flujos_Anual_2017-2020.xlsx" 
   * -> "AGRICOLA_NACIONAL"
   */
  private extraerNombreEmpresa(nombreArchivo: string): string {
    // Remover extensión
    const sinExtension = nombreArchivo.replace(/\.(xlsx|xls)$/i, '')
    
    // Patrones para extraer nombre de empresa
    const patrones = [
      /^([A-Z_]+?)(?:_SAC?(?:_E)?(?:_I)?)?_EEFF/,  // EMPRESA_SA_E_I_EEFF
      /^([A-Z_]+?)(?:_SA)?(?:_LTDA)?_EEFF/,        // EMPRESA_SA_EEFF
      /^([A-Z_]+?)_Balance_Resultados/,             // EMPRESA_Balance_Resultados
      /^([A-Z_]+?)_Estados_Financieros/,           // EMPRESA_Estados_Financieros
      /^([A-Z_]+?)_EEFF/,                          // EMPRESA_EEFF
      /^([A-Z_]+?)(?=_\d{4})/,                     // EMPRESA_2020 (antes del año)
    ]

    for (const patron of patrones) {
      const match = sinExtension.match(patron)
      if (match && match[1]) {
        return match[1].trim()
      }
    }

    // Si no encuentra patrón, tomar hasta el primer indicador de sufijo
    const sufijos = ['_EEFF', '_Balance', '_Estados', '_SA', '_LTDA', '_2017', '_2018', '_2019', '_2020', '_2021', '_2022', '_2023', '_2024']
    for (const sufijo of sufijos) {
      const index = sinExtension.indexOf(sufijo)
      if (index > 0) {
        return sinExtension.substring(0, index)
      }
    }

    return sinExtension
  }

  /**
   * Normaliza nombres para comparación (quita sufijos legales)
   */
  private normalizarNombre(nombre: string): string {
    return nombre
      .toUpperCase()
      .replace(/[^A-Z_]/g, '')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .replace(/_SAC?(_E)?(_I)?$/, '')
      .replace(/_SA$/, '')
      .replace(/_LTDA$/, '')
      .replace(/_CHILE$/, '')
      .replace(/_Y_/, '_')
  }

  /**
   * Encuentra coincidencias exactas en la base de datos
   */
  private buscarCoincidenciaExacta(nombreEmpresa: string): EmpresaInfo | null {
    const nombreNormalizado = this.normalizarNombre(nombreEmpresa)

    for (const [sector, empresas] of Object.entries(this.empresasPorSector)) {
      for (const empresa of empresas) {
        const empresaNormalizada = this.normalizarNombre(empresa)
        
        if (empresaNormalizada === nombreNormalizado) {
          return {
            nombre: empresa,
            sector,
            confianza: 1.0
          }
        }
      }
    }

    return null
  }

  /**
   * Busca coincidencias parciales usando palabras clave
   */
  private buscarCoincidenciaParcial(nombreEmpresa: string): EmpresaInfo | null {
    const nombreNormalizado = this.normalizarNombre(nombreEmpresa)
    const palabras = nombreNormalizado.split('_').filter(p => p.length > 2)

    let mejorCoincidencia: EmpresaInfo | null = null
    let mejorPuntaje = 0

    for (const [sector, empresas] of Object.entries(this.empresasPorSector)) {
      for (const empresa of empresas) {
        const empresaNormalizada = this.normalizarNombre(empresa)
        const palabrasEmpresa = empresaNormalizada.split('_').filter(p => p.length > 2)

        // Calcular similitud
        const coincidencias = palabras.filter(palabra => 
          palabrasEmpresa.some(pe => pe.includes(palabra) || palabra.includes(pe))
        )

        const puntaje = coincidencias.length / Math.max(palabras.length, palabrasEmpresa.length)

        if (puntaje > mejorPuntaje && puntaje > 0.5) {
          mejorPuntaje = puntaje
          mejorCoincidencia = {
            nombre: empresa,
            sector,
            confianza: puntaje * 0.8 // Reducir confianza para coincidencias parciales
          }
        }
      }
    }

    return mejorCoincidencia
  }

  /**
   * Clasifica usando patrones de palabras clave por sector
   */
  private clasificarPorPatrones(nombreEmpresa: string): EmpresaInfo | null {
    const nombreNormalizado = this.normalizarNombre(nombreEmpresa)

    for (const [sector, patrones] of Object.entries(this.patronesBusqueda)) {
      for (const patron of patrones) {
        if (nombreNormalizado.includes(patron)) {
          return {
            nombre: nombreEmpresa,
            sector: this.mapearSectorKey(sector),
            confianza: 0.6
          }
        }
      }
    }

    return null
  }

  /**
   * Mapea las claves de sector a nombres legibles
   */
  private mapearSectorKey(sectorKey: string): string {
    const mapeo: Record<string, string> = {
      'agricultura': 'Agricultura y Forestal',
      'mineria': 'Minería',
      'retail': 'Retail y Comercio',
      'bancos': 'Bancos y Servicios Financieros',
      'telecomunicaciones': 'Telecomunicaciones',
      'energia': 'Energía y Utilities',
      'combustibles': 'Combustibles y Petróleo',
      'alimentos': 'Alimentos y Bebidas',
      'transporte': 'Transporte y Logística',
      'construccion': 'Construcción e Inmobiliario',
      'pesquero': 'Pesquero y Acuicultura',
      'salud': 'Salud e Isapres',
      'seguros': 'Seguros',
      'entretenimiento': 'Entretenimiento y Medios',
      'servicios': 'Servicios y Otros',
      'manufactura': 'Manufactura y Industria',
      'educacion': 'Educación'
    }

    return mapeo[sectorKey] || 'Otros'
  }

  /**
   * Método principal para clasificar una empresa basándose en el nombre del archivo
   */
  public clasificarEmpresa(nombreArchivo: string): EmpresaInfo {
    const nombreEmpresa = this.extraerNombreEmpresa(nombreArchivo)

    // 1. Buscar coincidencia exacta
    const exacta = this.buscarCoincidenciaExacta(nombreEmpresa)
    if (exacta) return exacta

    // 2. Buscar coincidencia parcial
    const parcial = this.buscarCoincidenciaParcial(nombreEmpresa)
    if (parcial && parcial.confianza > 0.7) return parcial

    // 3. Clasificar por patrones
    const porPatron = this.clasificarPorPatrones(nombreEmpresa)
    if (porPatron) return porPatron

    // 4. Si no encuentra nada, devolver como "Otros"
    return {
      nombre: nombreEmpresa,
      sector: 'Otros',
      confianza: 0.1
    }
  }

  /**
   * Obtiene sugerencias de empresas similares
   */
  public obtenerSugerencias(nombreEmpresa: string, limite: number = 5): EmpresaInfo[] {
    const nombreNormalizado = this.normalizarNombre(nombreEmpresa)
    const sugerencias: EmpresaInfo[] = []

    for (const [sector, empresas] of Object.entries(this.empresasPorSector)) {
      for (const empresa of empresas) {
        const empresaNormalizada = this.normalizarNombre(empresa)
        
        // Calcular similitud simple (Levenshtein básico)
        const similitud = this.calcularSimilitud(nombreNormalizado, empresaNormalizada)
        
        if (similitud > 0.3) {
          sugerencias.push({
            nombre: empresa,
            sector,
            confianza: similitud
          })
        }
      }
    }

    return sugerencias
      .sort((a, b) => b.confianza - a.confianza)
      .slice(0, limite)
  }

  /**
   * Cálculo básico de similitud entre strings
   */
  private calcularSimilitud(str1: string, str2: string): number {
    const len1 = str1.length
    const len2 = str2.length
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null))

    for (let i = 0; i <= len1; i++) matrix[0][i] = i
    for (let j = 0; j <= len2; j++) matrix[j][0] = j

    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        )
      }
    }

    const distance = matrix[len2][len1]
    return 1 - distance / Math.max(len1, len2)
  }

  /**
   * Obtiene todos los sectores disponibles
   */
  public obtenerSectores(): string[] {
    return Object.keys(this.empresasPorSector)
  }

  /**
   * Obtiene todas las empresas de un sector específico
   */
  public obtenerEmpresasPorSector(sector: string): string[] {
    return this.empresasPorSector[sector] || []
  }
}

// Instancia singleton para usar en toda la aplicación
export const clasificador = new ClasificadorEmpresas()

// Función helper para uso directo
export function clasificarEmpresaDesdeArchivo(nombreArchivo: string): EmpresaInfo {
  return clasificador.clasificarEmpresa(nombreArchivo)
}

// Función para obtener sugerencias
export function obtenerSugerenciasEmpresa(nombreEmpresa: string): EmpresaInfo[] {
  return clasificador.obtenerSugerencias(nombreEmpresa)
}
