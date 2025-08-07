// lib/vercel-blob-storage.ts
import { put, del, list } from '@vercel/blob';

interface UploadResult {
  url: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
}

export class VercelBlobStorage {
  private token: string;

  constructor() {
    this.token = process.env.BLOB_READ_WRITE_TOKEN!;
    if (!this.token) {
      throw new Error('BLOB_READ_WRITE_TOKEN is required');
    }
  }

  /**
   * Sube un archivo Excel al storage privado
   */
  async uploadExcelFile(
    productId: string, 
    filename: string, 
    buffer: Buffer
  ): Promise<UploadResult> {
    try {
      const pathname = `paid/${productId}/${filename}`;
      
      const blob = await put(pathname, buffer, {
        access: 'private', // Solo accesible con token
        token: this.token,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      return {
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        contentDisposition: `attachment; filename="${filename}"`
      };
    } catch (error) {
      console.error('Error uploading file to Vercel Blob:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Obtiene la URL de descarga de un archivo (firmada temporalmente)
   */
  async getDownloadUrl(productId: string, filename: string): Promise<string> {
    try {
      const pathname = `paid/${productId}/${filename}`;
      
      // Listar archivos para verificar existencia
      const { blobs } = await list({
        prefix: `paid/${productId}/`,
        token: this.token,
      });

      const file = blobs.find(blob => blob.pathname === pathname);
      
      if (!file) {
        throw new Error('File not found');
      }

      return file.downloadUrl; // URL firmada temporalmente
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error('Failed to get download URL');
    }
  }

  /**
   * Elimina un archivo del storage
   */
  async deleteFile(productId: string, filename: string): Promise<void> {
    try {
      const pathname = `paid/${productId}/${filename}`;
      
      await del(pathname, {
        token: this.token,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Lista todos los archivos de un producto
   */
  async listProductFiles(productId: string) {
    try {
      const { blobs } = await list({
        prefix: `paid/${productId}/`,
        token: this.token,
      });

      return blobs.map(blob => ({
        filename: blob.pathname.split('/').pop(),
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        url: blob.url,
        downloadUrl: blob.downloadUrl
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list files');
    }
  }

  /**
   * Obtiene estadísticas de uso del storage
   */
  async getStorageStats() {
    try {
      const { blobs } = await list({
        prefix: 'paid/',
        token: this.token,
      });

      const totalFiles = blobs.length;
      const totalSize = blobs.reduce((sum, blob) => sum + (blob.size || 0), 0);
      const totalSizeGB = totalSize / (1024 * 1024 * 1024);
      const estimatedCost = totalSizeGB * 0.15; // $0.15 por GB/mes

      return {
        totalFiles,
        totalSize,
        totalSizeGB: Number(totalSizeGB.toFixed(4)),
        estimatedMonthlyCost: Number(estimatedCost.toFixed(4))
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      throw new Error('Failed to get storage stats');
    }
  }
}

// Instancia singleton
export const blobStorage = new VercelBlobStorage();
