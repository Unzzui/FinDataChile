'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Lock, ArrowRight } from 'lucide-react';

export default function TestPaymentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cardNumber: '4051 8856 0044 6623',
    cardHolder: 'TARJETA HABIENTE',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    rut: '11.111.111-1',
    password: '123'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular procesamiento de pago
    console.log('Procesando pago con datos:', formData);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirigir a la página de éxito
    router.push('/payment/return?token_ws=01abd3c1437b92b132a3e48049152eb84c916b077e0429ace1cb408fa9f0efba&tbk_session_id=SESS178399XS2&tbk_buy_order=ORDER524833672EDW');
  };

  const handleCancel = () => {
    router.push('/payment/cancel');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-blue-600">WebPay Plus</span>
          </div>
          <CardTitle className="text-lg">Pago Seguro</CardTitle>
          <p className="text-sm text-gray-600">Transbank - Ambiente de Integración</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Información de la transacción */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Detalles de la Transacción</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Producto:</span>
                  <span>Estados Financieros COLBUN SA</span>
                </div>
                <div className="flex justify-between">
                  <span>Monto:</span>
                  <span className="font-bold">$3.00 USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Orden:</span>
                  <span className="text-xs">ORDER524833672EDW</span>
                </div>
              </div>
            </div>

            {/* Datos de la tarjeta */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                  placeholder="0000 0000 0000 0000"
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardHolder">Titular</Label>
                  <Input
                    id="cardHolder"
                    value={formData.cardHolder}
                    onChange={(e) => setFormData({...formData, cardHolder: e.target.value})}
                    placeholder="NOMBRE APELLIDO"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mes</Label>
                  <Select value={formData.expiryMonth} onValueChange={(value: string) => setFormData({...formData, expiryMonth: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                        <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Año</Label>
                  <Select value={formData.expiryYear} onValueChange={(value: string) => setFormData({...formData, expiryYear: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Autenticación bancaria */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Autenticación Bancaria</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="rut">RUT</Label>
                  <Input
                    id="rut"
                    value={formData.rut}
                    onChange={(e) => setFormData({...formData, rut: e.target.value})}
                    placeholder="11.111.111-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Clave</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="space-y-3 pt-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Confirmar Pago
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>Esta es una simulación del formulario de Transbank</p>
              <p>En producción, este formulario sería servido por Transbank</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 