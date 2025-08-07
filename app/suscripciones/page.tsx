import { SubscriptionSurvey } from "@/components/subscription/subscription-survey"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SuscripcionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Suscripción Premium</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Próximamente - Acceso ilimitado a estados financieros
          </p>
        </div>

        <SubscriptionSurvey />

        {/* Información adicional */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Actualizaciones Automáticas</h3>
              <p className="text-gray-600">
                Recibe notificaciones por email cuando nuevos estados financieros estén disponibles.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Análisis de Tendencias</h3>
              <p className="text-gray-600">
                Acceso a análisis históricos y proyecciones basadas en datos reales.
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Soporte Prioritario</h3>
              <p className="text-gray-600">
                Atención personalizada para suscriptores con consultas específicas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 