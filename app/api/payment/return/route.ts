import { NextRequest, NextResponse } from 'next/server';
import { createWebpayPlusTransaction, transbankConfig } from '@/lib/transbank-config';
import { createPurchase, clearCart } from '@/lib/database';
import { sendPurchaseLinksEmail } from '@/lib/email'
import { createUserToken } from '@/lib/user-auth'
import { blobStorage } from '@/lib/vercel-blob-storage'
import { pgQuery } from '@/lib/pg';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token_ws, tbk_token, tbk_session_id, tbk_buy_order } = body;

    // Determinar qué token usar (token_ws para éxito, tbk_token para cancelación)
    const token = token_ws || tbk_token;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de transacción no proporcionado' },
        { status: 400 }
      );
    }

    // Crear instancia de WebPay Plus
    const transaction = createWebpayPlusTransaction();

    // Si es una cancelación (tbk_token presente)
    if (tbk_token) {
      console.log('Transacción cancelada por el usuario');
      
      return NextResponse.json({
        success: false,
        status: 'cancelled',
        message: 'Transacción cancelada por el usuario',
        redirectUrl: '/'
      });
    }

    // Si es una transacción exitosa, confirmar con Transbank
    try {
      console.log('Obteniendo estado de transacción con Transbank...');
      
      // IMPORTANTE: Confirmar transacción con commit (no status)
      const commitResponse = await transaction.commit(token_ws);
      console.log('Respuesta real de Transbank (commit):', commitResponse);
      
      // Validar transacción autorizada (ignorar vci para decisión)
      if (commitResponse.status === 'AUTHORIZED' && Number(commitResponse.response_code) === 0) {
        console.log('Transacción autorizada por Transbank (status: INITIALIZED, vci: TSY)');
        
        // Registrar la compra en la base de datos
        try {
          // Recuperar transacción pendiente
          const { rows: txRows } = await pgQuery('SELECT * FROM transactions WHERE transbank_token = $1 AND status = $2', [token_ws, 'pending'])
          const tx = txRows[0]
          if (!tx) {
            return NextResponse.json({ success: false, status: 'error', message: 'Transacción no encontrada' }, { status: 400 })
          }

          // Validar montos
          if (tx.total_amount && commitResponse.amount && Number(tx.total_amount) !== Number(commitResponse.amount)) {
            return NextResponse.json({ success: false, status: 'error', message: 'Monto no coincide' }, { status: 400 })
          }

          const email = tx.customer_email
          // Obtener productos comprados según transacción (no depender del carrito)
          const { rows: txProducts } = await pgQuery('SELECT product_id FROM transaction_products WHERE transaction_id = $1', [tx.id])
          const productIds: string[] = (txProducts || []).map((r: any) => r.product_id)
          
          // Fallback: si no hay, usar carrito del usuario
          let itemsToProcess = productIds
          if (!itemsToProcess.length) {
            const { rows: userCartItems } = await pgQuery('SELECT product_id FROM cart_items WHERE user_email = $1', [email])
            itemsToProcess = (userCartItems || []).map((r: any) => r.product_id)
          }

          // Registrar cada producto como una compra (evitando duplicados)
          for (const productId of itemsToProcess) {
            // Si ya existe una compra completada previa, saltar
            const { rows: existingPurchase } = await pgQuery(
              "SELECT id FROM purchases WHERE user_email = $1 AND product_id = $2 AND status = 'completed' LIMIT 1",
              [email, productId]
            )
            if (existingPurchase.length > 0) continue
            const { rows: prodRows } = await pgQuery('SELECT price FROM products WHERE id = $1', [productId])
            const product = prodRows[0]
            if (product && product.price != null) {
              await createPurchase(
                email,
                tx.customer_name || 'Usuario',
                productId,
                product.price
              );
            }
          }

          // Marcar transacción como completada
          await pgQuery('UPDATE transactions SET status = $1, completed_at = NOW() WHERE id = $2', ['completed', tx.id])

          // Limpiar el carrito
          await clearCart(email);
          const guestId = request.cookies.get('guestId')?.value
          if (guestId) {
            await clearCart(`guest:${guestId}`)
          }
          
          console.log('Compra registrada exitosamente');

          // Enviar correo de forma no bloqueante con enlaces de descarga
          ;(async () => {
            try {
              const links: { companyName: string; url: string }[] = []
              const origin = new URL(request.url).origin
              const token = createUserToken({ sub: String(tx.id || email), email })
              for (const pid of itemsToProcess) {
                const { rows } = await pgQuery('SELECT company_name, file_path FROM products WHERE id = $1', [pid])
                const pr = rows[0] as any
                if (!pr?.file_path) continue
                // Enviar enlace a nuestra API que valida compra y genera URL firmada
                const apiUrl = `${origin}/api/download/${encodeURIComponent(pid)}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
                links.push({ companyName: pr.company_name, url: apiUrl })
              }
              if (links.length) {
                await sendPurchaseLinksEmail(email, links, { amountClp: Number(tx.total_amount || 0), buyOrder: tx.id })
              }
            } catch (mailError) {
              console.warn('No se pudo enviar correo de compra:', mailError)
            }
          })()
          
          return NextResponse.json({
            success: true,
            status: 'authorized',
            message: 'Pago procesado exitosamente',
            amount: tx.total_amount,
            buyOrder: tx.id || commitResponse.buy_order || tbk_buy_order,
            redirectUrl: '/payment/success'
          });
        } catch (error) {
          console.error('Error registrando compra:', error);
          // Fallback: mantener monto en CLP
          return NextResponse.json({
            success: true,
            status: 'authorized',
            message: 'Pago procesado exitosamente',
            amount: commitResponse.amount,
            buyOrder: commitResponse.buy_order || tbk_buy_order,
            redirectUrl: '/payment/success'
          });
        }
      } else {
        // Transacción no autorizada (commit no devuelve aprobado)
        const rejectionReason = 'Transacción no autorizada'
        return NextResponse.json({
          success: false,
          status: 'rejected',
          message: 'Pago rechazado',
          reason: rejectionReason,
          buyOrder: commitResponse.buy_order || tbk_buy_order,
          redirectUrl: `/payment/error?reason=${encodeURIComponent(rejectionReason)}`
        });
      }
    } catch (statusError) {
      console.error('Error obteniendo estado de Transbank:', statusError);
      
      return NextResponse.json({
        success: false,
        status: 'error',
        message: 'Error al confirmar transacción con Transbank',
        buyOrder: tbk_buy_order,
        redirectUrl: '/payment/error?reason=Error%20en%20el%20procesamiento%20del%20pago'
      });
    }

  } catch (error) {
    console.error('Error procesando retorno de pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Manejar retorno por GET (redirección desde Transbank)
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token_ws');
  const tbkToken = searchParams.get('tbk_token');

  if (token) {
    // Pago exitoso
    return NextResponse.redirect(new URL(`/payment/success?token=${token}`, request.url));
  } else if (tbkToken) {
    // Pago cancelado
    return NextResponse.redirect(new URL('/payment/cancel', request.url));
  }

  return NextResponse.redirect(new URL('/payment/error', request.url));
} 