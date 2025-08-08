'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useDownload } from '@/hooks/use-download';
import { useToast } from '@/hooks/use-toast';

interface DownloadButtonProps {
  productId: string;
  userEmail: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function DownloadButton({ productId, userEmail, size = 'sm', className = '' }: DownloadButtonProps) {
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { downloadFile, isDownloading } = useDownload();
  const { toast } = useToast();

  useEffect(() => {
    const checkPurchase = async () => {
      if (!userEmail || !productId) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/has-purchased?userEmail=${encodeURIComponent(userEmail)}&productId=${productId}`);
        const data = await response.json();
        
        if (data.success) {
          setHasPurchased(data.hasPurchased);
        }
      } catch (error) {
        console.error('Error verificando compra:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkPurchase();
  }, [userEmail, productId]);

  const handleDownload = async () => {
    try {
      console.log('Iniciando descarga para producto:', productId, 'usuario:', userEmail);
      
      await downloadFile({
        productId,
        userEmail, // Agregar userEmail al parámetro
      });
      
      toast({
        title: "Descarga exitosa",
        description: "Archivo descargado correctamente",
      });
    } catch (error) {
      console.error('Error en descarga:', error);
      toast({
        title: "Error en la descarga",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  // No mostrar el botón si está verificando o si no ha comprado
  if (isChecking || !hasPurchased) {
    return null;
  }

  return (
    <Button
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
      className={`bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 ${className}`}
    >
      {isDownloading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
      ) : (
        <Download className="h-3 w-3 text-blue-700" />
      )}
    </Button>
  );
} 