export interface Product {
  id: string;
  companyId: number;
  companyName: string;
  sector: string;
  yearRange: string;
  startYear: number;
  endYear: number;
  price: number;
  filePath: string;
  description: string;
  isQuarterly?: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  companyIds: number[];
  plan: 'monthly' | 'quarterly' | 'yearly';
  price: number;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  nextDelivery: Date;
  createdAt: Date;
}

// Productos reales (se cargan dinámicamente desde archivos JSON)
export const products: Product[] = [];

// Planes de suscripción
export const subscriptionPlans = {
  monthly: {
    name: 'Mensual',
    price: 15,
    description: 'Recibe estados financieros mensualmente',
    features: [
      'Estados financieros mensuales',
      'Hasta 5 empresas',
      'Notificaciones por email',
      'Acceso a archivos históricos'
    ]
  },
  quarterly: {
    name: 'Trimestral',
    price: 40,
    description: 'Recibe estados financieros trimestralmente',
    features: [
      'Estados financieros trimestrales',
      'Hasta 10 empresas',
      'Notificaciones por email',
      'Acceso a archivos históricos',
      'Análisis de tendencias'
    ]
  },
  yearly: {
    name: 'Anual',
    price: 150,
    description: 'Recibe estados financieros anualmente',
    features: [
      'Estados financieros anuales',
      'Empresas ilimitadas',
      'Notificaciones por email',
      'Acceso completo a archivos históricos',
      'Análisis de tendencias',
      'Reportes personalizados'
    ]
  }
};

// Funciones de gestión
export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCompany = (companyId: number): Product[] => {
  return products.filter(p => p.companyId === companyId && p.isActive);
};

export const getProductsBySector = (sector: string): Product[] => {
  return products.filter(p => p.sector === sector && p.isActive);
};

export const getAllActiveProducts = (): Product[] => {
  return products.filter(p => p.isActive);
};

export const calculateTotalPrice = (productIds: string[]): number => {
  return productIds.reduce((total, id) => {
    const product = getProductById(id);
    return total + (product?.price || 0);
  }, 0);
}; 