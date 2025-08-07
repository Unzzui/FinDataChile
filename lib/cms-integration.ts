// Integración con CMS Headless (ejemplo con Strapi)

interface CMSConfig {
  baseUrl: string;
  apiToken: string;
}

const cmsConfig: CMSConfig = {
  baseUrl: process.env.STRAPI_URL || 'http://localhost:1337',
  apiToken: process.env.STRAPI_API_TOKEN || '',
};

// Obtener productos desde CMS
export async function getProductsFromCMS(): Promise<any[]> {
  try {
    const response = await fetch(`${cmsConfig.baseUrl}/api/products?populate=*`, {
      headers: {
        'Authorization': `Bearer ${cmsConfig.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo productos del CMS');
    }

    const data = await response.json();
    return data.data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
    }));
  } catch (error) {
    console.error('Error conectando con CMS:', error);
    return [];
  }
}

// Crear producto en CMS
export async function createProductInCMS(productData: any): Promise<any> {
  try {
    const response = await fetch(`${cmsConfig.baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cmsConfig.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: productData,
      }),
    });

    if (!response.ok) {
      throw new Error('Error creando producto en CMS');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
}

// Actualizar producto en CMS
export async function updateProductInCMS(productId: string, updates: any): Promise<any> {
  try {
    const response = await fetch(`${cmsConfig.baseUrl}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${cmsConfig.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: updates,
      }),
    });

    if (!response.ok) {
      throw new Error('Error actualizando producto en CMS');
    }

    return await response.json();
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
} 