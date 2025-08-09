"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Trash2, FolderOpen, Cloud, Zap, Clock, Building2, Award } from "lucide-react"
import { clasificarEmpresaDesdeArchivo, type EmpresaInfo } from "@/lib/clasificador-empresas"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  empresaInfo?: EmpresaInfo
  isAutoClassified?: boolean
  productId?: string
  error?: string
  file?: File
  rut?: string
}

export function FileUploadManager() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const parseRutFromFileName = (filename: string): string | undefined => {
    // Caso común: 7-8 dígitos, guion, DV (número o K/k)
    let m = filename.match(/(\d{7,8})-([0-9kK])/)
    if (m) return `${m[1]}-${m[2].toUpperCase()}`
    // Fallback: limpiar y volver a buscar, por si hay separadores u otros símbolos
    const cleaned = filename.replace(/[^0-9kK-]/gi, ' ')
    m = cleaned.match(/(\d{7,8})-([0-9kK])/)
    if (m) return `${m[1]}-${m[2].toUpperCase()}`
    return undefined
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    const newFiles: UploadedFile[] = files.map(file => {
      // Clasificar automáticamente cada archivo
      const empresaInfo = clasificarEmpresaDesdeArchivo(file.name)
      const rut = parseRutFromFileName(file.name)
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: 'pending',
        progress: 0,
        empresaInfo,
        isAutoClassified: empresaInfo.confianza > 0.7, // Auto-clasificado si confianza > 70%
        file: file, // Guardar referencia al archivo real
        rut
      }
    })
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    
    // Mostrar información de clasificación
    const autoClassified = newFiles.filter(f => f.isAutoClassified).length
    const needsReview = newFiles.length - autoClassified
    
    if (autoClassified > 0) {
      toast({
        title: "Clasificación automática",
        description: `${autoClassified} archivos clasificados automáticamente${needsReview > 0 ? `, ${needsReview} necesitan revisión` : ''}`,
      })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const newFiles: UploadedFile[] = files.map(file => {
      // Clasificar automáticamente cada archivo
      const empresaInfo = clasificarEmpresaDesdeArchivo(file.name)
      const rut = parseRutFromFileName(file.name)
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: 'pending',
        progress: 0,
        empresaInfo,
        isAutoClassified: empresaInfo.confianza > 0.7,
        file: file, // Guardar referencia al archivo real
        rut
      }
    })
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    
    const autoClassified = newFiles.filter(f => f.isAutoClassified).length
    const needsReview = newFiles.length - autoClassified
    
    if (autoClassified > 0) {
      toast({
        title: "Clasificación automática",
        description: `${autoClassified} archivos clasificados automáticamente${needsReview > 0 ? `, ${needsReview} necesitan revisión` : ''}`,
      })
    }
  }

  const processFiles = async () => {
    if (uploadedFiles.length === 0) return

    setIsProcessing(true)
    
    try {
      // Procesar cada archivo individualmente para mostrar progreso
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        if (file.status !== 'pending' || !file.file) continue

        // Marcar como procesando
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing' } : f
        ))
        
        // Simular progreso visual
        for (let progress = 0; progress <= 90; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress } : f
          ))
        }

        try {
          // Preparar FormData con el archivo real
          const formData = new FormData()
          formData.append('file', file.file)
          formData.append('metadata', JSON.stringify({
            id: file.id,
            name: file.name,
            size: file.size,
            empresaInfo: file.empresaInfo,
            isAutoClassified: file.isAutoClassified,
            rut: file.rut
          }))

          // Llamar a la API para procesar el archivo
          const response = await fetch('/api/admin/process-files', {
            method: 'POST',
            body: formData // Enviar FormData en lugar de JSON
          })

          const result = await response.json()
          
          if (response.ok && result.success) {
            const processedFile = result.processedFiles[0]
            
            // Marcar como completado
            setUploadedFiles(prev => prev.map(f => 
              f.id === file.id ? { 
                ...f, 
                status: 'completed', 
                progress: 100,
                productId: processedFile.productId 
              } : f
            ))
            
          } else {
            // Error en el procesamiento
            setUploadedFiles(prev => prev.map(f => 
              f.id === file.id ? { 
                ...f, 
                status: 'error', 
                progress: 0,
                error: result.error || 'Error en el procesamiento'
              } : f
            ))
          }
          
        } catch (apiError) {
          console.error('Error llamando a la API:', apiError)
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'error', 
              progress: 0,
              error: 'Error de conexión con el servidor'
            } : f
          ))
        }
      }
      
      // Contar archivos completados después del procesamiento
      setTimeout(() => {
        setUploadedFiles(current => {
          const completedCount = current.filter(f => f.status === 'completed').length
          const errorCount = current.filter(f => f.status === 'error').length
          
          toast({
            title: "Procesamiento completado",
            description: `${completedCount} archivos procesados y guardados en la base de datos${errorCount > 0 ? `, ${errorCount} con errores` : ''}`,
          })
          
          return current
        })
      }, 100)
      
    } catch (error) {
      console.error('Error general en procesamiento:', error)
      toast({
        title: "Error",
        description: "Error general en el procesamiento de archivos",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <FileSpreadsheet className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Completado</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Procesando</Badge>
      default:
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  const getConfidenceBadge = (confianza: number) => {
    if (confianza >= 0.9) return <Badge className="bg-green-100 text-green-700">Alta confianza</Badge>
    if (confianza >= 0.7) return <Badge className="bg-yellow-100 text-yellow-700">Confianza media</Badge>
    if (confianza >= 0.5) return <Badge variant="outline">Baja confianza</Badge>
    return <Badge variant="secondary">Sin clasificar</Badge>
  }

  const formatCompanyNameForDisplay = (rawName: string): string => {
    if (!rawName) return 'Empresa no identificada'
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

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Subir Estados Financieros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zona de carga */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Arrastra archivos Excel aquí o haz clic para seleccionar
              </h3>
              <p className="text-gray-500 mb-4">
                Se aceptan archivos .xlsx, .xls - Los archivos se clasificarán automáticamente
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                Seleccionar archivos
              </Button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Lista de archivos */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Archivos cargados ({uploadedFiles.length})
              </h3>
              <div className="flex gap-2">
                {uploadedFiles.filter(f => f.status === 'completed').length > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {uploadedFiles.filter(f => f.status === 'completed').length} completados
                  </Badge>
                )}
                <Button
                  onClick={processFiles}
                  disabled={isProcessing || uploadedFiles.every(f => f.status === 'completed')}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Procesar archivos
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(file.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{file.name}</p>
                        {getStatusBadge(file.status)}
                      </div>
                      
                      {/* Información de clasificación automática */}
                      {file.empresaInfo && (
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatCompanyNameForDisplay(file.empresaInfo.nombre)} - {file.empresaInfo.sector}
                          </span>
                          {file.isAutoClassified && (
                            <div title="Clasificación automática">
                              <Award className="w-3 h-3 text-green-500" />
                            </div>
                          )}
                          {getConfidenceBadge(file.empresaInfo.confianza)}
                        </div>
                      )}

                      {/* RUT detectado desde el nombre de archivo */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded border">
                          {file.rut ? `RUT: ${file.rut}` : 'RUT no detectado en nombre de archivo'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        {file.status === 'processing' && (
                          <div className="flex items-center gap-2 flex-1 max-w-xs">
                            <Progress value={file.progress} className="flex-1" />
                            <span>{file.progress}%</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Mostrar información adicional según el estado */}
                      {file.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">{file.error}</p>
                        </div>
                      )}
                      
                      {file.productId && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm text-green-700">
                            Producto creado exitosamente: {file.productId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estadísticas de procesamiento */}
        {uploadedFiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {uploadedFiles.length}
              </div>
              <div className="text-sm text-gray-500">Total de archivos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {uploadedFiles.filter(f => f.status === 'processing').length}
              </div>
              <div className="text-sm text-gray-500">Procesando</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {uploadedFiles.filter(f => f.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {uploadedFiles.filter(f => f.isAutoClassified).length}
              </div>
              <div className="text-sm text-gray-500">Auto-clasificados</div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Procesamiento Automático</h4>
          <p className="text-sm text-blue-700 mb-2">
            Los archivos se clasifican automáticamente según el nombre del archivo para identificar la empresa y el sector. 
            Los archivos con alta confianza se procesan automáticamente, mientras que otros pueden requerir revisión manual.
          </p>
          <p className="text-sm text-blue-700">
            Al procesar, cada archivo se guarda en la base de datos como un producto con información extraída automáticamente: 
            empresa, sector, período, precio calculado y descripción generada.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
