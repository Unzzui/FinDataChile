'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function PaymentRedirectPage() {
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const url = searchParams.get('url');

    if (token && url) {
      // Crear y enviar el formulario automáticamente
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;

      // Agregar el token como campo oculto
      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);

      // Enviar el formulario automáticamente
      setTimeout(() => {
        form.submit();
      }, 1000);
    } else {
      setIsRedirecting(false);
    }
  }, [searchParams]);

  if (!isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
            <p className="text-gray-600">Faltan parámetros para la redirección</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Redirigiendo a WebPay</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Preparando formulario de pago...</p>
          <p className="text-sm text-gray-500">
            Serás redirigido automáticamente a Transbank WebPay
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 