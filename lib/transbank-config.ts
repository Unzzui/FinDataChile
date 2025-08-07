import WebpayPlus from 'transbank-sdk/dist/es6/transbank/webpay/webpay_plus';

// Configuración para Transbank (WebPay) para Chile
export const transbankConfig = {
  // Configuración de entorno
  environment: process.env.TRANSBANK_ENVIRONMENT || 'integration', // 'integration' | 'production'
  // Credenciales (exigir variables de entorno; no hardcodear valores)
  commerceCode: process.env.TRANSBANK_COMMERCE_CODE || '',
  apiKey: process.env.TRANSBANK_API_KEY || '',
  // URLs de la API de Transbank
  baseUrl: 'https://webpay3gint.transbank.cl',
  productionUrl: 'https://webpay3g.transbank.cl',
  // URLs de retorno
  returnUrl: (process.env.NEXT_PUBLIC_BASE_URL || '') + '/payment/return',
  cancelUrl: (process.env.NEXT_PUBLIC_BASE_URL || '') + '/payment/cancel',
  // Configuración de la aplicación
  sessionId: '',
  amount: 0,
  buyOrder: '',
};

// Crear instancia de WebPay Plus con configuración
export const createWebpayPlusTransaction = () => {
  if (!transbankConfig.commerceCode || !transbankConfig.apiKey) {
    throw new Error('Transbank credentials are not configured. Set TRANSBANK_COMMERCE_CODE and TRANSBANK_API_KEY');
  }
  if (transbankConfig.environment === 'integration') {
    return WebpayPlus.Transaction.buildForIntegration(transbankConfig.commerceCode, transbankConfig.apiKey);
  }
  return WebpayPlus.Transaction.buildForProduction(transbankConfig.commerceCode, transbankConfig.apiKey);
};

// Generar orden de compra única (máximo 26 caracteres para Transbank)
export const generateBuyOrder = () => {
  const timestamp = Date.now().toString().slice(-8); // Últimos 8 dígitos
  const random = Math.random().toString(36).substr(2, 4); // 4 caracteres aleatorios
  return `ORDER${timestamp}${random}`.toUpperCase();
};

// Generar session ID único (más corto)
export const generateSessionId = () => {
  const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos
  const random = Math.random().toString(36).substr(2, 3); // 3 caracteres aleatorios
  return `SESS${timestamp}${random}`.toUpperCase();
};

// Obtener URL base según ambiente
export const getTransbankUrl = () => {
  return transbankConfig.environment === 'integration' 
    ? transbankConfig.baseUrl 
    : transbankConfig.productionUrl;
}; 