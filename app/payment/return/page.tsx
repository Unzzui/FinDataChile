'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type PaymentStatus = 'processing' | 'success' | 'error' | 'cancelled';

export const dynamic = 'force-dynamic';

function ReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Obtener parámetros de la URL
        const token_ws = searchParams.get('token_ws');
        const tbk_token = searchParams.get('tbk_token');
        const tbk_session_id = searchParams.get('tbk_session_id');
        const tbk_buy_order = searchParams.get('tbk_buy_order');

        console.log('Parámetros de retorno:', {
          token_ws,
          tbk_token,
          tbk_session_id,
          tbk_buy_order
        });

        // Si hay tbk_token, es una cancelación
        if (tbk_token) {
          // Limpiar buyOrder del localStorage en caso de cancelación
          localStorage.removeItem('currentBuyOrder');
          
          setStatus('cancelled');
          toast({
            title: "Pago cancelado",
            description: "La transacción fue cancelada por el usuario",
            variant: "destructive",
          });
          return;
        }

        // Si no hay token_ws, es un error
        if (!token_ws) {
          // Limpiar buyOrder del localStorage en caso de error
          localStorage.removeItem('currentBuyOrder');
          
          setStatus('error');
          toast({
            title: "Error en el pago",
            description: "No se recibió token de transacción",
            variant: "destructive",
          });
          return;
        }

        // Obtener buyOrder del localStorage si no viene en los parámetros
        const buyOrderFromStorage = localStorage.getItem('currentBuyOrder');
        const finalBuyOrder = tbk_buy_order || buyOrderFromStorage;
        
        // Procesar la transacción con el backend
        const response = await fetch('/api/payment/return', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token_ws,
            tbk_token,
            tbk_session_id,
            tbk_buy_order: finalBuyOrder
          }),
        });

        const result = await response.json();

        if (result.success && result.status === 'authorized') {
          setStatus('success');
          setPaymentDetails({
            amountClp: Number(result.amount || 0),
            buyOrder: result.buyOrder,
            timestamp: new Date().toLocaleString('es-CL')
          });
          
          // Limpiar buyOrder del localStorage
          localStorage.removeItem('currentBuyOrder');
          
          toast({
            title: "¡Pago exitoso!",
            description: "Tu transacción ha sido procesada correctamente",
          });
        } else {
          // Limpiar buyOrder del localStorage en caso de error o rechazo
          localStorage.removeItem('currentBuyOrder');
          
          if (result.status === 'rejected') {
            setStatus('error');
            toast({
              title: "Pago rechazado",
              description: result.reason || "La transacción fue rechazada",
              variant: "destructive",
            });
          } else {
            setStatus('error');
            toast({
              title: "Error en el pago",
              description: result.message || "Error procesando la transacción",
              variant: "destructive",
            });
          }
        }

      } catch (error) {
        // Limpiar buyOrder del localStorage en caso de error
        localStorage.removeItem('currentBuyOrder');
        
        console.error('Error procesando pago:', error);
        setStatus('error');
        toast({
          title: "Error en el pago",
          description: "Error interno del servidor",
          variant: "destructive",
        });
        
        // Redirigir a la página de error
        window.location.href = '/payment/error?reason=Error%20interno%20del%20servidor';
      }
    };

    processPayment();
  }, [searchParams, toast]);

  const handleDownload = () => {
    // Implementar descarga de archivos
    toast({
      title: "Descarga iniciada",
      description: "Los archivos se están descargando...",
    });
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleViewPurchases = () => {
    router.push('/compras');
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm md:max-w-md">
          <CardContent className="p-6 md:p-8 text-center">
            <Loader2 className="h-8 w-8 md:h-12 md:w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2">Procesando pago...</h2>
            <p className="text-gray-600 text-sm md:text-base">Verificando tu transacción con Transbank</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm md:max-w-md">
        <CardHeader className="text-center">
          {status === 'success' ? (
            <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-500 mx-auto mb-4" />
          ) : status === 'cancelled' ? (
            <XCircle className="h-12 w-12 md:h-16 md:w-16 text-yellow-500 mx-auto mb-4" />
          ) : (
            <XCircle className="h-12 w-12 md:h-16 md:w-16 text-red-500 mx-auto mb-4" />
          )}
          
          <CardTitle className={`text-xl md:text-2xl font-bold ${
            status === 'success' ? 'text-green-600' : 
            status === 'cancelled' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {status === 'success' && '¡Pago Exitoso!'}
            {status === 'cancelled' && 'Pago Cancelado'}
            {status === 'error' && 'Error en el Pago'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 md:space-y-6">
          {status === 'success' && paymentDetails && (
            <div className="space-y-3 text-center">
              <p className="text-gray-600 text-sm md:text-base">
                Tu transacción ha sido procesada correctamente
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Monto:</span>
                  <span className="font-bold text-green-600">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(paymentDetails.amountClp || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Referencia (USD):</span>
                  <span>
                    ${((paymentDetails.amountClp || 0) / 1000).toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Orden:</span>
                  <span className="text-xs text-gray-600 truncate">
                    {paymentDetails.buyOrder}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Fecha:</span>
                  <span className="text-xs text-gray-600">
                    {paymentDetails.timestamp}
                  </span>
                </div>
              </div>
            </div>
          )}

          {status === 'cancelled' && (
            <div className="text-center">
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                La transacción fue cancelada. Puedes intentar nuevamente cuando quieras.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Hubo un error procesando tu pago. Por favor, intenta nuevamente.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {status === 'success' && (
              <Button 
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-sm"
              >
                Descargar Archivos
              </Button>
            )}
            
            {status === 'success' && (
              <Button 
                onClick={handleViewPurchases}
                variant="outline" 
                className="w-full text-sm"
              >
                Ver Mis Compras
              </Button>
            )}
            
            <Button 
              onClick={handleGoHome}
              variant="ghost" 
              className="w-full text-sm"
            >
              Volver al Inicio
            </Button>
          </div>

          <div className="text-center text-xs md:text-sm text-gray-500">
            <p>Si tienes problemas, contacta soporte</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={null}>
      <ReturnContent />
    </Suspense>
  );
}