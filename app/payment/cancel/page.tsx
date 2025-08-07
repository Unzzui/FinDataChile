'use client';

import { useEffect } from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentCancelPage() {
  useEffect(() => {
    // Limpiar buyOrder del localStorage en caso de cancelación
    localStorage.removeItem('currentBuyOrder');
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-yellow-600">
            Pago Cancelado
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              La transacción fue cancelada. No se realizó ningún cargo a tu tarjeta.
            </p>
            <p className="text-sm text-gray-500">
              Puedes intentar nuevamente cuando quieras.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                Continuar Comprando
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Si tienes problemas, contacta soporte</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 