// Ejemplo de uso en el componente de upload de archivos del admin

import { clasificarEmpresaDesdeArchivo, obtenerSugerenciasEmpresa } from '@/lib/clasificador-empresas'

// En el evento de upload de archivo
const handleFileUpload = async (file: File) => {
  try {
    // Clasificar automáticamente basándose en el nombre del archivo
    const clasificacion = clasificarEmpresaDesdeArchivo(file.name)
    
    console.log('Clasificación automática:', {
      archivo: file.name,
      empresaDetectada: clasificacion.nombre,
      sector: clasificacion.sector,
      confianza: `${(clasificacion.confianza * 100).toFixed(1)}%`
    })

    // Si la confianza es alta (>80%), auto-completar los campos
    if (clasificacion.confianza > 0.8) {
      setCompanyName(clasificacion.nombre.replace(/_/g, ' '))
      setSector(clasificacion.sector)
      setIsAutoClassified(true)
    } else {
      // Si la confianza es media (40-80%), mostrar sugerencias
      if (clasificacion.confianza > 0.4) {
        const sugerencias = obtenerSugerenciasEmpresa(clasificacion.nombre)
        setSugerencias(sugerencias)
        setShowSugerencias(true)
      }
      
      // Llenar campos con lo detectado pero permitir edición
      setCompanyName(clasificacion.nombre.replace(/_/g, ' '))
      setSector(clasificacion.sector)
      setIsAutoClassified(false)
    }

  } catch (error) {
    console.error('Error en clasificación automática:', error)
  }
}

// Ejemplos de clasificación
const ejemplos = [
  {
    archivo: "AGRICOLA_NACIONAL_SAC_E_I_EEFF_Balance_Resultados_Flujos_Anual_2017-2020.xlsx",
    resultado: {
      nombre: "AGRICOLA_NACIONAL",
      sector: "Agricultura y Forestal", 
      confianza: 1.0
    }
  },
  {
    archivo: "BANCO_DE_CHILE_EEFF_Balance_Resultados_Flujos_Trimestral_2020-2023.xlsx",
    resultado: {
      nombre: "BANCO_DE_CHILE",
      sector: "Bancos y Servicios Financieros",
      confianza: 1.0
    }
  },
  {
    archivo: "COPEC_SA_EEFF_Estados_Financieros_Anual_2019-2022.xlsx",
    resultado: {
      nombre: "COPEC",
      sector: "Combustibles y Petróleo",
      confianza: 1.0
    }
  },
  {
    archivo: "NUEVA_EMPRESA_MINERA_EEFF_Balance_2023.xlsx",
    resultado: {
      nombre: "NUEVA_EMPRESA_MINERA",
      sector: "Minería",
      confianza: 0.6
    }
  }
]
