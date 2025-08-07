import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PaymentParams {
  productIds: string[];
  customerEmail: string;
  customerName: string;
}

interface PaymentState {
  isProcessing: boolean;
  error: string | null;
  transactionId: string | null;
}

export const usePayment = () => {
  const [state, setState] = useState<PaymentState>({
    isProcessing: false,
    error: null,
    transactionId: null,
  });

  const { toast } = useToast();

  const initiatePayment = async (params: PaymentParams) => {
    setState({ isProcessing: true, error: null, transactionId: null });

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar pago');
      }

      const data = await response.json();

      if (data.success) {
        setState({
          isProcessing: false,
          error: null,
          transactionId: data.transactionId,
        });

        // Redirigir a WebPay
        toast({
          title: 'Pago iniciado',
          description: 'Redirigiendo a WebPay...',
        });

        // Guardar buyOrder en localStorage para recuperarlo después
        if (data.buyOrder) {
          localStorage.setItem('currentBuyOrder', data.buyOrder);
        }
        
        // Redirigir a nuestra página intermedia que creará el formulario
        window.location.href = `/payment/redirect?token=${data.token}&url=${encodeURIComponent(data.redirectUrl)}`;
      } else {
        throw new Error('Error al procesar pago');
      }
    } catch (error) {
      setState({
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        transactionId: null,
      });

      toast({
        title: 'Error en el pago',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      });
    }
  };

  const cancelPayment = async (transactionId: string) => {
    try {
      const response = await fetch('/api/payment/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: transactionId,
          reason: 'Usuario canceló el pago',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Pago cancelado',
          description: 'El pago ha sido cancelado exitosamente',
        });
      }
    } catch (error) {
      console.error('Error cancelando pago:', error);
    }
  };

  return {
    initiatePayment,
    cancelPayment,
    isProcessing: state.isProcessing,
    error: state.error,
    transactionId: state.transactionId,
  };
}; 