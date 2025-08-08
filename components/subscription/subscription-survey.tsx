"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, TrendingUp, Users, FileText, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SubscriptionSurvey() {
  const enabled = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true') : false
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  interests: [] as string[],
  useCase: "",
  })
  const { toast } = useToast()

  const handleSurveySubmit = async (wouldPay: boolean) => {
    // Si dice "No" y no ha llenado datos, solo enviar la respuesta negativa
    if (!wouldPay && (!formData.name || !formData.email)) {
      setIsLoading(true)
      
      try {
        const response = await fetch('/api/survey/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            wouldPay: false,
            name: 'Anónimo',
            email: 'anonimo@temp.com',
            interests: [],
            useCase: '',
          }),
        })

        if (!response.ok) {
          throw new Error('Error enviando respuesta')
        }

        toast({
          title: "¡Gracias por tu feedback!",
          description: "Tu respuesta nos ayuda a mejorar",
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
      return
    }

    // Para respuestas positivas o cuando ya tiene datos
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
          interests: formData.interests,
          useCase: formData.useCase,
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
      {!enabled && (
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            Próximamente
          </span>
        </div>
      )}
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
            $5.000 CLP
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">¿Qué te interesa?</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { key: 'ratios', label: 'Ratios financieros' },
                    { key: 'riesgo', label: 'Análisis de riesgo' },
                    { key: 'valoraciones', label: 'Valoraciones (DCF/Comparables)' },
                  ].map(opt => (
                    <label key={opt.key} className="flex items-center gap-2 rounded-md border p-2 hover:bg-gray-50 cursor-pointer">
                      <Checkbox
                        checked={formData.interests.includes(opt.key)}
                        onCheckedChange={(checked) => {
                          setFormData(prev => {
                            const exists = prev.interests.includes(opt.key)
                            return {
                              ...prev,
                              interests: checked
                                ? (exists ? prev.interests : [...prev.interests, opt.key])
                                : prev.interests.filter(i => i !== opt.key)
                            }
                          })
                        }}
                        aria-label={opt.label}
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">¿Para qué lo usarías? (opcional)</label>
                <textarea
                  value={formData.useCase}
                  onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                  placeholder="Ej: monitoreo de cartera, levantamiento de capital, due diligence, benchmarking, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500">Ayúdanos a priorizar las próximas funciones según tu caso de uso.</p>
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
      {/* Social proof & time savings */}
      <div className="max-w-3xl mx-auto mt-6 grid sm:grid-cols-3 gap-3 text-xs text-gray-600">
        <div className="rounded-md border bg-white p-3 text-center">
          <div className="font-semibold text-gray-900">Hasta 3+ horas</div>
          <div>ahorradas por reporte</div>
        </div>
        <div className="rounded-md border bg-white p-3 text-center">
          <div className="font-semibold text-gray-900">+500 empresas</div>
          <div>cobertura CMF</div>
        </div>
        <div className="rounded-md border bg-white p-3 text-center">
          <div className="font-semibold text-gray-900">Formato estándar</div>
          <div>listo para Excel</div>
        </div>
      </div>
    </div>
  )
} 