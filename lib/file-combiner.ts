import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { getProductById } from './product-management';

export async function combineExcelFiles(productIds: string[]): Promise<{ buffer: Buffer; fileName: string }> {
  try {
    // Crear un nuevo workbook
    const combinedWorkbook = XLSX.utils.book_new();
    
    let sheetIndex = 1;
    
    for (const productId of productIds) {
      const product = getProductById(productId);
      if (!product) continue;

      try {
        // Leer el archivo original
        const filePath = path.join(process.cwd(), 'public', product.filePath);
        const fileBuffer = await fs.readFile(filePath);
        
        // Leer el workbook original
        const originalWorkbook = XLSX.read(fileBuffer, { type: 'buffer' });
        
        // Copiar cada hoja al workbook combinado
        for (const sheetName of originalWorkbook.SheetNames) {
          const sheet = originalWorkbook.Sheets[sheetName];
          const newSheetName = `${product.companyName}_${sheetName}`;
          
          // Agregar la hoja al workbook combinado
          XLSX.utils.book_append_sheet(combinedWorkbook, sheet, newSheetName);
        }
        
        console.log(`Archivo ${product.companyName} agregado al combo`);
      } catch (error) {
        console.error(`Error procesando archivo ${productId}:`, error);
        
        // Si no se puede leer el archivo, crear una hoja de información
        const infoSheet = XLSX.utils.json_to_sheet([
          {
            'Empresa': product?.companyName || 'Desconocida',
            'Sector': product?.sector || 'N/A',
            'Período': product?.yearRange || 'N/A',
            'Estado': 'Archivo no disponible',
            'Nota': 'Este archivo no pudo ser incluido en el combo'
          }
        ]);
        
        XLSX.utils.book_append_sheet(
          combinedWorkbook, 
          infoSheet, 
          `${product?.companyName || 'Info'}_Error`
        );
      }
    }
    
    // Crear hoja de resumen
    const summaryData = productIds.map(productId => {
      const product = getProductById(productId);
      return {
        'ID Producto': productId,
        'Empresa': product?.companyName || 'N/A',
        'Sector': product?.sector || 'N/A',
        'Período': product?.yearRange || 'N/A',
        'Precio': product?.price || 0,
        'Estado': product ? 'Incluido' : 'No encontrado'
      };
    });
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(combinedWorkbook, summarySheet, 'Resumen_Productos');
    
    // Generar el archivo combinado
    const combinedBuffer = XLSX.write(combinedWorkbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Crear nombre de archivo
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Estados_Financieros_Combinados_${timestamp}.xlsx`;
    
    return { buffer: combinedBuffer, fileName };
    
  } catch (error) {
    console.error('Error combinando archivos:', error);
    
    // Fallback: crear archivo de error
    const errorWorkbook = XLSX.utils.book_new();
    const errorSheet = XLSX.utils.json_to_sheet([
      {
        'Error': 'No se pudieron combinar los archivos',
        'Fecha': new Date().toISOString(),
        'Productos Solicitados': productIds.join(', '),
        'Contacto': 'Soporte técnico'
      }
    ]);
    
    XLSX.utils.book_append_sheet(errorWorkbook, errorSheet, 'Error');
    
    const errorBuffer = XLSX.write(errorWorkbook, { type: 'buffer', bookType: 'xlsx' });
    const fileName = `Error_Combinacion_${Date.now()}.xlsx`;
    
    return { buffer: errorBuffer, fileName };
  }
} 