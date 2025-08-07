"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Calendar, Users, TrendingUp, FileText } from "lucide-react"
import { subscriptionPlans } from "@/lib/product-management"
import { usePayment } from "@/hooks/use-payment"
import { useToast } from "@/hooks/use-toast"

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerName, setCustomerName] = useState("")
  const { initiatePayment, isProcessing } = usePayment()
  const { toast } = useToast()

  const handleSubscribe = async (planKey: string) => {
    if (!customerEmail || !customerName) {
      toast({
        title: "Información requerida",
        description: "Por favor completa tu nombre y email",
        variant: "destructive",
      })
      return
    }

    const plan = subscriptionPlans[planKey as keyof typeof subscriptionPlans]
    if (!plan) return

    try {
      await initiatePayment({
        productIds: [`subscription-${planKey}`],
        customerEmail,
        customerName,
      })
    } catch (error) {
      console.error("Error iniciando suscripción:", error)
    }
  }

  const getPlanIcon = (planKey: string) => {
    switch (planKey) {
      case 'monthly':
        return <Calendar className="h-6 w-6" />
      case 'quarterly':
        return <TrendingUp className="h-6 w-6" />
      case 'yearly':
        return <Star className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Planes de Suscripción</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Recibe estados financieros automáticamente cuando estén disponibles. 
          Elige el plan que mejor se adapte a tus necesidades.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(subscriptionPlans).map(([planKey, plan]) => (
          <Card 
            key={planKey} 
            className={`relative ${selectedPlan === planKey ? 'ring-2 ring-blue-500' : ''}`}
          >
            {planKey === 'quarterly' && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
                Más Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                {getPlanIcon(planKey)}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <p className="text-gray-600 text-sm">{plan.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/mes</span>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <Button
                onClick={() => handleSubscribe(planKey)}
                disabled={isProcessing}
                className={`w-full ${
                  planKey === 'quarterly' 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  `Suscribirse - $${plan.price}/mes`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>• Cancelación en cualquier momento</p>
        <p>• Acceso inmediato a archivos históricos</p>
        <p>• Notificaciones automáticas por email</p>
      </div>
    </div>
  )
} 