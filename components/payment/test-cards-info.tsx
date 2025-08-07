'use client';

import { useState } from 'react';
import { CreditCard, Info, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TestCard {
  type: string;
  number: string;
  cvv: string;
  result: string;
  color: string;
}

const testCards: TestCard[] = [
  {
    type: 'VISA',
    number: '4051 8856 0044 6623',
    cvv: '123',
    result: 'Aprobada',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    type: 'AMEX',
    number: '3700 0000 0002 032',
    cvv: '1234',
    result: 'Aprobada',
    color: 'bg-green-100 text-green-800'
  },
  {
    type: 'MASTERCARD',
    number: '5186 0595 5959 0568',
    cvv: '123',
    result: 'Rechazada',
    color: 'bg-red-100 text-red-800'
  },
  {
    type: 'Redcompra',
    number: '4051 8842 3993 7763',
    cvv: '',
    result: 'Aprobada',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    type: 'Redcompra',
    number: '4511 3466 6003 7060',
    cvv: '',
    result: 'Aprobada',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    type: 'Redcompra',
    number: '5186 0085 4123 3829',
    cvv: '',
    result: 'Rechazada',
    color: 'bg-red-100 text-red-800'
  },
  {
    type: 'Prepago VISA',
    number: '4051 8860 0005 6590',
    cvv: '123',
    result: 'Aprobada',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    type: 'Prepago MASTERCARD',
    number: '5186 1741 1062 9480',
    cvv: '123',
    result: 'Rechazada',
    color: 'bg-red-100 text-red-800'
  }
];

export function TestCardsInfo() {
  const [copiedCard, setCopiedCard] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, cardType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCard(cardType);
      toast({
        title: "Copiado",
        description: `${cardType} copiado al portapapeles`,
      });
      setTimeout(() => setCopiedCard(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          Tarjetas de Prueba - Transbank WebPay
        </CardTitle>
        <p className="text-sm text-gray-600">
          Usa estas tarjetas para probar el sistema de pagos. Para autenticación usa RUT: 11.111.111-1 y clave: 123
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testCards.map((card, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{card.type}</span>
                </div>
                <Badge className={card.color}>
                  {card.result}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Número:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(card.number.replace(/\s/g, ''), card.type)}
                    className="h-6 px-2"
                  >
                    {copiedCard === card.type ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <code className="block text-sm bg-gray-100 p-2 rounded">
                  {card.number}
                </code>
                
                {card.cvv && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CVV:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(card.cvv, `${card.type}-CVV`)}
                        className="h-6 px-2"
                      >
                        {copiedCard === `${card.type}-CVV` ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <code className="block text-sm bg-gray-100 p-2 rounded">
                      {card.cvv}
                    </code>
                  </>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                <p>• Cualquier fecha de expiración</p>
                <p>• Resultado: {card.result}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Información Importante:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Estas son tarjetas de prueba para el ambiente de integración</li>
            <li>• Para autenticación bancaria usa: RUT 11.111.111-1, Clave 123</li>
            <li>• En producción, usarás tarjetas reales de tus clientes</li>
            <li>• Los montos de prueba no generan cargos reales</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 