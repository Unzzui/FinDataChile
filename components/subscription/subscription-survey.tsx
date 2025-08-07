"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, TrendingUp, Users, FileText, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SubscriptionSurvey() {
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const { toast } = useToast()

  const handleSurveySubmit = async (wouldPay: boolean) => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa tu nombre y email",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          wouldPay,
          name: formData.name,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        throw new Error('Error enviando respuesta')
      }

      const result = await response.json()
      
      toast({
        title: "¡Gracias por tu opinión!",
        description: wouldPay 
          ? "Nos pondremos en contacto cuando esté disponible" 
          : "Tu feedback nos ayuda a mejorar",
      })
      
      setHasSubmitted(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar tu respuesta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (hasSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Gracias por tu interés!
          </h3>
          <p className="text-gray-600">
            Te notificaremos cuando la suscripción premium esté disponible.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Plan Premium */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Plan Premium
          </CardTitle>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <Star className="h-3 w-3 mr-1" />
              Próximamente
            </Badge>
          </div>
          <div className="text-4xl font-bold text-purple-600 mb-2">
            $7 USD
            <span className="text-lg font-normal text-gray-600">/mes</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg mb-4">Incluye:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Estados financieros anuales</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Empresas ilimitadas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Notificaciones por email</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Acceso completo a archivos históricos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Análisis de tendencias</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Reportes personalizados</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg mb-4">Beneficios exclusivos:</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-900">Acceso Prioritario</h5>
                    <p className="text-sm text-gray-600">Nuevos estados financieros 24h antes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-900">Soporte Dedicado</h5>
                    <p className="text-sm text-gray-600">Atención personalizada por email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-900">Descargas Ilimitadas</h5>
                    <p className="text-sm text-gray-600">Sin restricciones de descarga</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-900">Análisis Avanzado</h5>
                    <p className="text-sm text-gray-600">Herramientas de análisis profesional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Encuesta */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">¿Te interesaría este plan?</CardTitle>
          <p className="text-gray-600">
            Ayúdanos a entender tu interés en la suscripción premium
          </p>
        </CardHeader>
        <CardContent className="text-center">
          {!showForm ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowForm(true)}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Sí, me interesa
                </Button>
                
                <Button
                  onClick={() => handleSurveySubmit(false)}
                  disabled={isLoading}
                  variant="outline"
                  size="lg"
                >
                  No por ahora
                </Button>
              </div>
              
              <p className="text-xs text-gray-500">
                Tu respuesta nos ayuda a mejorar el servicio
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSurveySubmit(true); }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tu nombre completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tu Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  size="lg"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 