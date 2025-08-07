import { useState } from 'react';

interface DownloadParams {
  productId: string;
  userEmail?: string;
}

interface DownloadState {
  isDownloading: boolean;
  error: string | null;
}

export const useDownload = () => {
  const [state, setState] = useState<DownloadState>({
    isDownloading: false,
    error: null,
  });

  const downloadFile = async (params: DownloadParams) => {
    setState({ isDownloading: true, error: null });

    try {
      const response = await fetch('/api/download-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: params.productId,
          userEmail: params.userEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al descargar archivo');
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'estados_financieros.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setState({ isDownloading: false, error: null });
    } catch (error) {
      setState({ 
        isDownloading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      });
    }
  };

  return {
    downloadFile,
    isDownloading: state.isDownloading,
    error: state.error,
  };
}; 