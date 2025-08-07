'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TestPaymentSimulator() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const simulatePayment = async (shouldReject: boolean = false) => {
    setIsProcessing(true);
    
    try {
      // Crear un token que simule rechazo si es necesario
      const baseToken = '01abe78b7273a6cb0bc616739eb188730e918366e038cfe2edb3000667ac2e0d';
      const token = shouldReject ? baseToken + '_simulate_reject' : baseToken;
      
      // Simular el retorno de Transbank
      const response = await fetch('/api/payment/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token_ws: token,
          tbk_token: null,
          tbk_session_id: 'SESS376990K76',
          tbk_buy_order: 'ORDER52223152IPKK'
        }),
      });

      const result = await response.json();
      
      if (result.success && result.status === 'authorized') {
        toast({
          title: "Simulación exitosa",
          description: "Pago simulado como exitoso",
        });
        
        // Redirigir a la página de éxito
        window.location.href = `/payment/success?amount=${result.amount}&buyOrder=${result.buyOrder}`;
      } else {
        toast({
          title: "Simulación de rechazo",
          description: "Pago simulado como rechazado",
          variant: "destructive",
        });
        
        // Redirigir a inicio
        window.location.href = '/';
      }
      
    } catch (error) {
      console.error('Error en simulación:', error);
      toast({
        title: "Error en simulación",
        description: "Error al simular el pago",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Simulador de Pagos (Modo Integración)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          <p>Este simulador permite probar el flujo de pagos en modo integración.</p>
          <p>Útil para probar tanto pagos exitosos como rechazos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => simulatePayment(false)}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Simular Pago Exitoso
          </Button>
          
          <Button
            onClick={() => simulatePayment(true)}
            disabled={isProcessing}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Simular Pago Rechazado
          </Button>
        </div>

        {isProcessing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Procesando simulación...</p>
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Instrucciones:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Pago Exitoso:</strong> Simula una transacción aprobada</li>
            <li>• <strong>Pago Rechazado:</strong> Simula una transacción rechazada</li>
            <li>• Los resultados se procesan como si vinieran de Transbank</li>
            <li>• Útil para probar el flujo completo del sistema</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 