import { promises as fs } from 'fs';
import path from 'path';
import { Product } from './product-management';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');
const TRANSACTIONS_FILE = path.join(process.cwd(), 'data', 'transactions.json');
const SUBSCRIPTIONS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json');

// Asegurar que el directorio data existe
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Leer productos desde archivo JSON
export async function loadProducts(): Promise<Product[]> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Archivo de productos no encontrado, usando productos por defecto');
    return [];
  }
}

// Guardar productos en archivo JSON
export async function saveProducts(products: Product[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Agregar nuevo producto
export async function addProduct(product: Product): Promise<void> {
  const products = await loadProducts();
  products.push(product);
  await saveProducts(products);
}

// Actualizar producto
export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  const products = await loadProducts();
  const index = products.findIndex(p => p.id === productId);
  
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date() };
    await saveProducts(products);
  }
}

// Eliminar producto
export async function deleteProduct(productId: string): Promise<void> {
  const products = await loadProducts();
  const filteredProducts = products.filter(p => p.id !== productId);
  await saveProducts(filteredProducts);
}

// Obtener productos por sector
export async function getProductsBySector(sector: string): Promise<Product[]> {
  const products = await loadProducts();
  return products.filter(p => p.sector === sector && p.isActive);
}

// Obtener productos activos
export async function getActiveProducts(): Promise<Product[]> {
  const products = await loadProducts();
  return products.filter(p => p.isActive);
}

// Guardar transacción
export async function saveTransaction(transaction: any): Promise<void> {
  await ensureDataDirectory();
  let transactions = [];
  
  try {
    const data = await fs.readFile(TRANSACTIONS_FILE, 'utf-8');
    transactions = JSON.parse(data);
  } catch {
    // Archivo no existe, empezar con array vacío
  }
  
  transactions.push(transaction);
  await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
}

// Guardar suscripción
export async function saveSubscription(subscription: any): Promise<void> {
  await ensureDataDirectory();
  let subscriptions = [];
  
  try {
    const data = await fs.readFile(SUBSCRIPTIONS_FILE, 'utf-8');
    subscriptions = JSON.parse(data);
  } catch {
    // Archivo no existe, empezar con array vacío
  }
  
  subscriptions.push(subscription);
  await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
} 