import * as XLSX from 'xlsx';

interface FinancialData {
  year: number;
  quarter: string;
  revenue: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  cashFlow: number;
}

interface CompanyData {
  id: number;
  name: string;
  sector: string;
  availableFrom: number;
  financialData: FinancialData[];
}

// Datos de ejemplo para las empresas
const generateFinancialData = (companyName: string, startYear: number, years: number): FinancialData[] => {
  const data: FinancialData[] = [];
  
  for (let year = startYear; year <= 2024; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const baseRevenue = Math.random() * 1000000 + 500000;
      const baseAssets = Math.random() * 5000000 + 2000000;
      
      data.push({
        year,
        quarter: `Q${quarter}`,
        revenue: baseRevenue + (Math.random() * 200000),
        netIncome: baseRevenue * 0.15 + (Math.random() * 50000),
        totalAssets: baseAssets + (Math.random() * 1000000),
        totalLiabilities: baseAssets * 0.6 + (Math.random() * 500000),
        cashFlow: baseRevenue * 0.2 + (Math.random() * 100000)
      });
    }
  }
  
  return data;
};

export const companies: CompanyData[] = [
  {
    id: 1,
    name: "Banco de Chile",
    sector: "Bancario",
    availableFrom: 2014,
    financialData: generateFinancialData("Banco de Chile", 2014, 11)
  },
  {
    id: 2,
    name: "Banco Santander",
    sector: "Bancario",
    availableFrom: 2014,
    financialData: generateFinancialData("Banco Santander", 2014, 11)
  },
  {
    id: 3,
    name: "Banco Estado",
    sector: "Bancario",
    availableFrom: 2015,
    financialData: generateFinancialData("Banco Estado", 2015, 10)
  },
  {
    id: 4,
    name: "Falabella",
    sector: "Retail",
    availableFrom: 2014,
    financialData: generateFinancialData("Falabella", 2014, 11)
  },
  {
    id: 5,
    name: "Cencosud",
    sector: "Retail",
    availableFrom: 2014,
    financialData: generateFinancialData("Cencosud", 2014, 11)
  },
  {
    id: 6,
    name: "Ripley",
    sector: "Retail",
    availableFrom: 2016,
    financialData: generateFinancialData("Ripley", 2016, 9)
  },
  {
    id: 7,
    name: "Codelco",
    sector: "Minería",
    availableFrom: 2014,
    financialData: generateFinancialData("Codelco", 2014, 11)
  },
  {
    id: 8,
    name: "Antofagasta Minerals",
    sector: "Minería",
    availableFrom: 2014,
    financialData: generateFinancialData("Antofagasta Minerals", 2014, 11)
  },
  {
    id: 9,
    name: "Enel Chile",
    sector: "Energía",
    availableFrom: 2015,
    financialData: generateFinancialData("Enel Chile", 2015, 10)
  },
  {
    id: 10,
    name: "Engie Chile",
    sector: "Energía",
    availableFrom: 2016,
    financialData: generateFinancialData("Engie Chile", 2016, 9)
  },
  {
    id: 11,
    name: "Colbún",
    sector: "Energía",
    availableFrom: 2014,
    financialData: generateFinancialData("Colbún", 2014, 11)
  },
  {
    id: 12,
    name: "Entel",
    sector: "Telecomunicaciones",
    availableFrom: 2014,
    financialData: generateFinancialData("Entel", 2014, 11)
  },
  {
    id: 13,
    name: "Movistar Chile",
    sector: "Telecomunicaciones",
    availableFrom: 2015,
    financialData: generateFinancialData("Movistar Chile", 2015, 10)
  },
  {
    id: 14,
    name: "AFP Provida",
    sector: "AFP",
    availableFrom: 2014,
    financialData: generateFinancialData("AFP Provida", 2014, 11)
  },
  {
    id: 15,
    name: "AFP Habitat",
    sector: "AFP",
    availableFrom: 2014,
    financialData: generateFinancialData("AFP Habitat", 2014, 11)
  },
  {
    id: 16,
    name: "Isapre Colmena",
    sector: "Salud",
    availableFrom: 2016,
    financialData: generateFinancialData("Isapre Colmena", 2016, 9)
  },
  {
    id: 17,
    name: "Isapre Banmedica",
    sector: "Salud",
    availableFrom: 2015,
    financialData: generateFinancialData("Isapre Banmedica", 2015, 10)
  },
  {
    id: 18,
    name: "LAN Airlines",
    sector: "Transporte",
    availableFrom: 2014,
    financialData: generateFinancialData("LAN Airlines", 2014, 11)
  },
  {
    id: 19,
    name: "Copec",
    sector: "Energía",
    availableFrom: 2014,
    financialData: generateFinancialData("Copec", 2014, 11)
  },
  {
    id: 20,
    name: "SQM",
    sector: "Minería",
    availableFrom: 2014,
    financialData: generateFinancialData("SQM", 2014, 11)
  },
  {
    id: 21,
    name: "CCU",
    sector: "Consumo",
    availableFrom: 2014,
    financialData: generateFinancialData("CCU", 2014, 11)
  },
  {
    id: 22,
    name: "Embotelladora Andina",
    sector: "Consumo",
    availableFrom: 2015,
    financialData: generateFinancialData("Embotelladora Andina", 2015, 10)
  },
  {
    id: 23,
    name: "Parque Arauco",
    sector: "Inmobiliario",
    availableFrom: 2014,
    financialData: generateFinancialData("Parque Arauco", 2014, 11)
  },
  {
    id: 24,
    name: "Mall Plaza",
    sector: "Inmobiliario",
    availableFrom: 2016,
    financialData: generateFinancialData("Mall Plaza", 2016, 9)
  }
];

export const generateExcelFile = (companyId: number, startYear: number, endYear: number): Buffer => {
  const company = companies.find(c => c.id === companyId);
  if (!company) {
    throw new Error('Empresa no encontrada');
  }

  // Filtrar datos por rango de años
  const filteredData = company.financialData.filter(
    data => data.year >= startYear && data.year <= endYear
  );

  // Crear workbook
  const workbook = XLSX.utils.book_new();

  // Hoja 1: Estado de Resultados
  const incomeStatementData = filteredData.map(data => ({
    'Año': data.year,
    'Trimestre': data.quarter,
    'Ingresos (USD)': data.revenue.toLocaleString(),
    'Ingresos Netos (USD)': data.netIncome.toLocaleString(),
    'Margen Neto (%)': ((data.netIncome / data.revenue) * 100).toFixed(2)
  }));

  const incomeStatementSheet = XLSX.utils.json_to_sheet(incomeStatementData);
  XLSX.utils.book_append_sheet(workbook, incomeStatementSheet, 'Estado de Resultados');

  // Hoja 2: Balance General
  const balanceSheetData = filteredData.map(data => ({
    'Año': data.year,
    'Trimestre': data.quarter,
    'Total Activos (USD)': data.totalAssets.toLocaleString(),
    'Total Pasivos (USD)': data.totalLiabilities.toLocaleString(),
    'Patrimonio Neto (USD)': (data.totalAssets - data.totalLiabilities).toLocaleString(),
    'Ratio Deuda/Activos': (data.totalLiabilities / data.totalAssets).toFixed(2)
  }));

  const balanceSheetSheet = XLSX.utils.json_to_sheet(balanceSheetData);
  XLSX.utils.book_append_sheet(workbook, balanceSheetSheet, 'Balance General');

  // Hoja 3: Flujo de Efectivo
  const cashFlowData = filteredData.map(data => ({
    'Año': data.year,
    'Trimestre': data.quarter,
    'Flujo de Efectivo Operacional (USD)': data.cashFlow.toLocaleString(),
    'Flujo de Efectivo Libre (USD)': (data.cashFlow * 0.8).toLocaleString(),
    'Ratio Flujo/Ingresos': ((data.cashFlow / data.revenue) * 100).toFixed(2)
  }));

  const cashFlowSheet = XLSX.utils.json_to_sheet(cashFlowData);
  XLSX.utils.book_append_sheet(workbook, cashFlowSheet, 'Flujo de Efectivo');

  // Hoja 4: Resumen Ejecutivo
  const summaryData = [
    { 'Métrica': 'Empresa', 'Valor': company.name },
    { 'Métrica': 'Sector', 'Valor': company.sector },
    { 'Métrica': 'Período Analizado', 'Valor': `${startYear} - ${endYear}` },
    { 'Métrica': 'Total Registros', 'Valor': filteredData.length },
    { 'Métrica': 'Promedio Ingresos (USD)', 'Valor': (filteredData.reduce((sum, d) => sum + d.revenue, 0) / filteredData.length).toLocaleString() },
    { 'Métrica': 'Promedio Activos (USD)', 'Valor': (filteredData.reduce((sum, d) => sum + d.totalAssets, 0) / filteredData.length).toLocaleString() },
    { 'Métrica': 'Promedio Flujo de Efectivo (USD)', 'Valor': (filteredData.reduce((sum, d) => sum + d.cashFlow, 0) / filteredData.length).toLocaleString() }
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen Ejecutivo');

  // Generar buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

export const getCompanyById = (id: number) => {
  return companies.find(c => c.id === id);
};

export const getAvailableYears = (companyId: number) => {
  const company = getCompanyById(companyId);
  if (!company) return [];
  
  const years = [...new Set(company.financialData.map(d => d.year))];
  return years.sort();
}; 