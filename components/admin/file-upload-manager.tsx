"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Trash2, FolderOpen } from "lucide-react"

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  productId?: string;
}

export function FileUploadManager() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No hay archivos",
        description: "Selecciona archivos Excel para subir",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Crear FormData con los archivos
      const formData = new FormData()
      const fileElements = fileInputRef.current?.files
      
      if (fileElements) {
        for (let i = 0; i < fileElements.length; i++) {
          formData.append('files', fileElements[i])
        }
      }

      // Enviar archivos al servidor
      const response = await fetch('/api/admin/process-excel', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error procesando archivos')
      }

      const result = await response.json()

      // Actualizar estado de archivos
      setUploadedFiles(prev => prev.map(file => ({
        ...file,
        status: 'completed',
        progress: 100,
        productId: `product-${Math.random().toString(36).substr(2, 9)}`,
      })))

      toast({
        title: "Archivos procesados",
        description: `${result.processed} archivos procesados exitosamente`,
      })

    } catch (error) {
      console.error('Error subiendo archivos:', error)
      
      setUploadedFiles(prev => prev.map(file => ({
        ...file,
        status: 'error',
        error: error instanceof Error ? error.message : 'Error desconocido',
      })))

      toast({
        title: "Error procesando archivos",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    }

    setIsUploading(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const clearAll = () => {
    setUploadedFiles([])
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return <FileSpreadsheet className="h-4 w-4 text-gray-500" />
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carga Masiva de Archivos Excel</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar Archivos
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0 || isUploading}
            className="bg-green-600 hover:bg-green-700"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Procesar Archivos
          </Button>
          <Button
            onClick={clearAll}
            variant="outline"
            disabled={uploadedFiles.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar Todo
          </Button>
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

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Archivos Seleccionados ({uploadedFiles.length})
              <Badge variant="outline">
                {uploadedFiles.filter(f => f.status === 'completed').length} completados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(file.status)}>
                        {file.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {file.status === 'processing' && (
                    <Progress value={file.progress} className="w-full" />
                  )}
                  
                  {file.error && (
                    <p className="text-sm text-red-600 mt-2">{file.error}</p>
                  )}
                  
                  {file.productId && (
                    <p className="text-sm text-green-600 mt-2">
                      Producto creado: {file.productId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Carga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Formato Requerido:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Archivos Excel (.xlsx, .xls)</li>
                <li>• Nombre: EMPRESA_EEFF_AÑO.xlsx</li>
                <li>• Ejemplo: COLBUN_SA_EEFF_2024.xlsx</li>
                <li>• Múltiples hojas por año</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Proceso Automático:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Detección automática de empresa</li>
                <li>• Procesamiento de datos</li>
                <li>• Creación de productos</li>
                <li>• Actualización de catálogo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 