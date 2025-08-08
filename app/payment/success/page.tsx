'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccessPage() {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Limpiar buyOrder del localStorage en caso de éxito
    localStorage.removeItem('currentBuyOrder');
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount');
    const buyOrder = urlParams.get('buyOrder');
    if (amount && buyOrder) {
      setPaymentDetails({
        amountClp: Number(amount),
        buyOrder,
        timestamp: new Date().toLocaleString('es-CL')
      });
    }
  }, []);

  const handleDownloadFiles = async () => {
    try {
      setDownloading(true)
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
      toast({ title: 'Preparando ZIP', description: 'Generando tus archivos...' })
      const resp = await fetch('/api/user/download-all', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail })
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err?.error || 'No fue posible generar el ZIP')
      }
      const blob = await resp.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      const cd = resp.headers.get('content-disposition') || ''
      const match = cd.match(/filename="(.+)"/)
      const filename = match?.[1] || 'Compras_FinData_Chile.zip'
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({ title: 'ZIP descargado', description: 'Tus archivos fueron descargados en un ZIP' })
    } catch (error) {
      console.error('Error descargando archivos:', error);
      toast({
        title: "Error en la descarga",
        description: "Hubo un problema al descargar los archivos",
        variant: "destructive",
      });
    } finally {
      setDownloading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm md:max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-500" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold text-green-600">
            ¡Pago Exitoso!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 md:space-y-6">
          {paymentDetails && (
            <div className="space-y-3 text-center">
              <p className="text-gray-600 text-sm md:text-base">
                Tu transacción ha sido procesada correctamente
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Monto (CLP):</span>
                  <span className="font-bold text-green-600">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(paymentDetails.amountClp || 0)}
                  </span>
                </div>
                {/* Referencia USD removida: el monto de Transbank es CLP oficial */}
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

          <div className="space-y-3">
            <Button 
              onClick={handleDownloadFiles}
              className="w-full bg-green-600 hover:bg-green-700 text-sm"
              disabled={downloading}
            >
              {downloading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {downloading ? 'Generando...' : 'Descargar Archivos'}
            </Button>
            
            <Link href="/compras">
              <Button variant="outline" className="w-full text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver Mis Compras
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="w-full text-sm">
                Volver al Inicio
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs md:text-sm text-gray-500">
            <p>Recibirás un correo con los detalles de tu compra</p>
            <p>Si tienes problemas, contacta soporte</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 