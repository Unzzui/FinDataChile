"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, Users, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SurveyStats {
  total: number
  positive: number
  negative: number
  positivePercentage: string
  responses: Array<{
    id: string
    wouldPay: boolean
    name: string
    email: string
    timestamp: string
    userAgent?: string
    ip?: string
  }>
}

export function SurveyStats() {
  const [stats, setStats] = useState<SurveyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/survey/submit')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        throw new Error('Error cargando estadísticas')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2">Cargando estadísticas...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No hay datos disponibles</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Respuestas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Interesados</p>
                <p className="text-2xl font-bold">{stats.positive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">No Interesados</p>
                <p className="text-2xl font-bold">{stats.negative}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">% Interesados</p>
                <p className="text-2xl font-bold">{stats.positivePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas respuestas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Últimas Respuestas</CardTitle>
            <Button onClick={loadStats} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.responses.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No hay respuestas aún</p>
          ) : (
            <div className="space-y-3">
              {stats.responses.map((response) => (
                <div key={response.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={response.wouldPay ? "default" : "secondary"}>
                      {response.wouldPay ? "Sí" : "No"}
                    </Badge>
                    <div className="text-sm">
                      <div className="font-medium">{response.name}</div>
                      <div className="text-gray-500">{response.email}</div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {new Date(response.timestamp).toLocaleString('es-CL')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {response.ip}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Análisis */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Interés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Interpretación:</h4>
              <p className="text-sm text-gray-600">
                {parseFloat(stats.positivePercentage) >= 70 
                  ? "Excelente nivel de interés. Considera lanzar el plan premium pronto."
                  : parseFloat(stats.positivePercentage) >= 50
                  ? "Buen nivel de interés. Considera ajustar el precio o beneficios."
                  : "Bajo nivel de interés. Revisa el precio y beneficios del plan."
                }
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Recomendaciones:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mínimo 50 respuestas para análisis confiable</li>
                <li>• Objetivo: 60-70% de interés positivo</li>
                <li>• Considera encuestas adicionales sobre precio</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 