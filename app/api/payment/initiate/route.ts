import { NextRequest, NextResponse } from 'next/server';
import { transbankConfig, generateBuyOrder, generateSessionId, createWebpayPlusTransaction } from '@/lib/transbank-config';
import { pgQuery } from '@/lib/pg';
import { verifyUserToken } from '@/lib/user-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, customerEmail, customerName } = body;

    // Preferir usuario autenticado vía cookie
    const token = request.cookies.get('userToken')?.value
    const payload = verifyUserToken(token)
    const effectiveEmail = payload?.email || customerEmail
    const effectiveName = payload?.name || customerName || ''

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un producto' },
        { status: 400 }
      );
    }

    // Obtener productos desde la base de datos y calcular total
    let total = 0;
    
    const { getProductsByIds } = await import('@/lib/database')
    const priceRows = await getProductsByIds(productIds)
    // Bloquear productos ya comprados (si hay email efectivo)
    let filteredProductIds = productIds
    if (effectiveEmail) {
      const { rows: purchasedRows } = await pgQuery<{ product_id: string }>(
        `SELECT product_id FROM purchases WHERE user_email = $1 AND status = 'completed' AND product_id = ANY($2::text[])`,
        [effectiveEmail, productIds]
      )
      const purchasedSet = new Set(purchasedRows.map(r => r.product_id))
      filteredProductIds = productIds.filter(id => !purchasedSet.has(id))
    }
    const effectivePriceRows = priceRows.filter(r => filteredProductIds.includes(r.id))
    for (const row of effectivePriceRows) total += Number(row.price || 0)
    
    // Precios definidos en CLP en la BD. Transbank requiere CLP.
    const amount = Math.round(total)

    // Generar identificadores únicos
    const buyOrder = generateBuyOrder();
    const sessionId = generateSessionId();

    // Crear instancia de WebPay Plus
    const transaction = createWebpayPlusTransaction();

    // Crear transacción en Transbank
    // Construir returnUrl dinámicamente según el host de la solicitud
    const origin = request.nextUrl.origin;
    const dynamicReturnUrl = `${origin}/payment/return`;
    const createResponse = await transaction.create(
      buyOrder,
      sessionId,
      amount,
      dynamicReturnUrl
    );

    if (!createResponse || !createResponse.url || !createResponse.token) {
      throw new Error('Error al crear transacción en Transbank');
    }

    // Persistir transacción en BD (Postgres)
    await pgQuery(
      `INSERT INTO transactions (id, customer_email, customer_name, total_amount, status, transbank_token, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [buyOrder, effectiveEmail || '', effectiveName || '', amount, 'pending', createResponse.token]
    )

    // Guardar productos de la transacción para referencia en el retorno
    for (const pid of filteredProductIds) {
      const row = effectivePriceRows.find((r: any) => r.id === pid)
      const price = row ? Number(row.price || 0) : 0
      await pgQuery(
        `INSERT INTO transaction_products (transaction_id, product_id, price, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [buyOrder, pid, price]
      )
    }

    // En modo demo, simular respuesta exitosa
    if (transbankConfig.environment === 'integration') {
      console.log('Transacción creada en modo integración:', {
        buyOrder,
        sessionId,
        amount,
        token: createResponse.token,
        url: createResponse.url,
        returnUrl: dynamicReturnUrl
      });

      // Usar la URL correcta de Transbank para integración
      // Según la documentación, la URL debe ser la que devuelve la librería
      const correctUrl = createResponse.url;
      
      return NextResponse.json({
        success: true,
        redirectUrl: correctUrl,
        token: createResponse.token,
        transactionId: buyOrder,
        buyOrder: buyOrder, // Incluir buyOrder explícitamente
        amount: amount, // Devolver monto en pesos
        isTestMode: true, // Indicar que estamos en modo de prueba
      });
    }

    // En producción, redirigir inmediatamente
    return NextResponse.json({
      success: true,
      redirectUrl: createResponse.url,
      token: createResponse.token,
      transactionId: buyOrder,
      buyOrder: buyOrder, // Incluir buyOrder explícitamente
      amount: amount, // Devolver monto en pesos
    });

  } catch (error) {
    console.error('Error iniciando pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}