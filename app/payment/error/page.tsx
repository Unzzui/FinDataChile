'use client';

import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Evitar prerender y el error de CSR bailout en Vercel
export const dynamic = 'force-dynamic';

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Error en el procesamiento del pago';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-red-600">
            Pago Rechazado
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Tu transacción fue rechazada. No se realizó ningún cargo a tu tarjeta.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700 font-medium">Motivo del rechazo:</p>
              <p className="text-sm text-red-600">{reason}</p>
            </div>
            <p className="text-sm text-gray-500">
              Puedes intentar nuevamente con otra tarjeta o método de pago.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Intentar Nuevamente
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Si el problema persiste, contacta soporte</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={null}>
      <ErrorContent />
    </Suspense>
  );
}