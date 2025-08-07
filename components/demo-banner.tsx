import { AlertCircle, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Modo Demostración - Descargas Gratuitas Disponibles
          </span>
          <Badge className="bg-green-100 text-green-800">
            <Download className="h-3 w-3 mr-1" />
            Descarga Directa
          </Badge>
        </div>
        <p className="text-xs text-blue-600 text-center mt-1">
          Los archivos Excel se generan con datos de ejemplo. Sistema de pagos próximamente.
        </p>
      </div>
    </div>
  )
} 