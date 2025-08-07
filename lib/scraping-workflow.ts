import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

interface ScrapingJob {
  id: string;
  companyName: string;
  companyId: string;
  sector: string;
  status: 'pending' | 'scraping' | 'processing' | 'completed' | 'failed';
  startDate: Date;
  endDate?: Date;
  dataSource: string; // URL de la CMF
  outputPath?: string;
  error?: string;
}

interface ScrapedData {
  companyName: string;
  year: number;
  quarter: string;
  revenue: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  cashFlow: number;
  source: string;
  scrapedAt: Date;
}

// Configuración de directorios
const DIRECTORIES = {
  raw: 'data/raw', // Datos sin procesar del scraping
  processed: 'data/processed', // Datos procesados
  excel: 'public/excel-products', // Archivos Excel finales
  logs: 'data/logs', // Logs del scraping
  jobs: 'data/jobs', // Estado de trabajos de scraping
};

// Crear estructura de directorios
async function ensureDirectories() {
  for (const dir of Object.values(DIRECTORIES)) {
    const fullPath = path.join(process.cwd(), dir);
    try {
      await fs.access(fullPath);
    } catch {
      await fs.mkdir(fullPath, { recursive: true });
    }
  }
}

// Guardar datos raw del scraping
export async function saveRawData(companyName: string, data: ScrapedData[]): Promise<string> {
  await ensureDirectories();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${companyName}_raw_${timestamp}.json`;
  const filepath = path.join(process.cwd(), DIRECTORIES.raw, filename);
  
  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  return filepath;
}

// Procesar datos raw y crear Excel
export async function processRawData(rawDataPath: string, companyName: string): Promise<string> {
  try {
    // Leer datos raw
    const rawData = JSON.parse(await fs.readFile(rawDataPath, 'utf-8'));
    
    // Crear workbook
    const workbook = XLSX.utils.book_new();
    
    // Agrupar por año
    const groupedByYear = rawData.reduce((acc: any, item: ScrapedData) => {
      if (!acc[item.year]) acc[item.year] = [];
      acc[item.year].push(item);
      return acc;
    }, {});
    
    // Crear hojas por año
    for (const [year, data] of Object.entries(groupedByYear)) {
      const sheetData = (data as ScrapedData[]).map(item => ({
        'Año': item.year,
        'Trimestre': item.quarter,
        'Ingresos (USD)': item.revenue.toLocaleString(),
        'Ingresos Netos (USD)': item.netIncome.toLocaleString(),
        'Total Activos (USD)': item.totalAssets.toLocaleString(),
        'Total Pasivos (USD)': item.totalLiabilities.toLocaleString(),
        'Flujo de Efectivo (USD)': item.cashFlow.toLocaleString(),
        'Fuente': item.source,
        'Fecha Scraping': item.scrapedAt.toISOString(),
      }));
      
      const sheet = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, sheet, `${year}`);
    }
    
    // Crear hoja de resumen
    const summaryData = [
      { 'Métrica': 'Empresa', 'Valor': companyName },
      { 'Métrica': 'Total Registros', 'Valor': rawData.length },
      { 'Métrica': 'Años Cubiertos', 'Valor': Object.keys(groupedByYear).length },
      { 'Métrica': 'Fecha Procesamiento', 'Valor': new Date().toISOString() },
      { 'Métrica': 'Fuente Original', 'Valor': rawData[0]?.source || 'CMF' },
    ];
    
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
    
    // Guardar archivo Excel
    const excelFilename = `${companyName.replace(/\s+/g, '_')}_EEFF_${new Date().getFullYear()}.xlsx`;
    const excelPath = path.join(process.cwd(), DIRECTORIES.excel, excelFilename);
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    await fs.writeFile(excelPath, buffer);
    
    return excelPath;
    
  } catch (error) {
    console.error('Error procesando datos raw:', error);
    throw error;
  }
}

// Crear job de scraping
export async function createScrapingJob(job: Omit<ScrapingJob, 'id' | 'status' | 'startDate'>): Promise<string> {
  await ensureDirectories();
  
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const fullJob: ScrapingJob = {
    ...job,
    id: jobId,
    status: 'pending',
    startDate: new Date(),
  };
  
  const jobsPath = path.join(process.cwd(), DIRECTORIES.jobs, 'active_jobs.json');
  let jobs: ScrapingJob[] = [];
  
  try {
    const data = await fs.readFile(jobsPath, 'utf-8');
    jobs = JSON.parse(data);
  } catch {
    // Archivo no existe, empezar con array vacío
  }
  
  jobs.push(fullJob);
  await fs.writeFile(jobsPath, JSON.stringify(jobs, null, 2));
  
  return jobId;
}

// Actualizar estado de job
export async function updateJobStatus(jobId: string, status: ScrapingJob['status'], outputPath?: string, error?: string): Promise<void> {
  const jobsPath = path.join(process.cwd(), DIRECTORIES.jobs, 'active_jobs.json');
  let jobs: ScrapingJob[] = [];
  
  try {
    const data = await fs.readFile(jobsPath, 'utf-8');
    jobs = JSON.parse(data);
  } catch {
    return;
  }
  
  const jobIndex = jobs.findIndex(j => j.id === jobId);
  if (jobIndex !== -1) {
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      status,
      endDate: status === 'completed' || status === 'failed' ? new Date() : undefined,
      outputPath,
      error,
    };
    
    await fs.writeFile(jobsPath, JSON.stringify(jobs, null, 2));
  }
}

// Obtener jobs activos
export async function getActiveJobs(): Promise<ScrapingJob[]> {
  const jobsPath = path.join(process.cwd(), DIRECTORIES.jobs, 'active_jobs.json');
  
  try {
    const data = await fs.readFile(jobsPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Log de scraping
export async function logScraping(companyName: string, message: string, level: 'info' | 'error' | 'warning' = 'info'): Promise<void> {
  await ensureDirectories();
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    company: companyName,
    level,
    message,
  };
  
  const logPath = path.join(process.cwd(), DIRECTORIES.logs, `${companyName}_scraping.log`);
  const logLine = JSON.stringify(logEntry) + '\n';
  
  await fs.appendFile(logPath, logLine);
} 