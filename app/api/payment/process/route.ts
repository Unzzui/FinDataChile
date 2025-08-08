import { NextRequest, NextResponse } from 'next/server';
import { getProductById, calculateTotalPrice } from '@/lib/product-management';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { combineExcelFiles } from '@/lib/file-combiner';
import { createPurchase } from '@/lib/database';

interface PaymentData {
  productIds: string[];
  customerEmail: string;
  customerName: string;
  transactionId: string;
  amount: number;
}

// Configuración de email (reemplazar con tus datos)
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'tu-email@gmail.com',
    pass: process.env.SMTP_PASS || 'tu-password-app',
  },
};

// Función para enviar archivo por email
async function sendFileByEmail(paymentData: PaymentData, fileBuffer: Buffer, fileName: string) {
  try {
    const transporter = nodemailer.createTransport(emailConfig);

    const mailOptions = {
      from: emailConfig.auth.user,
      to: paymentData.customerEmail,
      subject: `Estados Financieros - Pago Confirmado`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">¡Pago Confirmado!</h2>
          <p>Hola ${paymentData.customerName},</p>
          <p>Tu pago ha sido procesado exitosamente. Adjunto encontrarás los archivos Excel solicitados.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalles del pedido:</h3>
            <p><strong>ID de Transacción:</strong> ${paymentData.transactionId}</p>
            <p><strong>Total pagado:</strong> ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(paymentData.amount || 0))}</p>
            <p><strong>Archivos incluidos:</strong> ${paymentData.productIds.length}</p>
          </div>
          
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p>¡Gracias por tu compra!</p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: fileBuffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente a:', paymentData.customerEmail);
  } catch (error) {
    console.error('Error enviando email:', error);
    throw new Error('Error enviando archivo por email');
  }
}

// Función para generar archivo combinado
async function generateCombinedFile(productIds: string[]): Promise<{ buffer: Buffer; fileName: string }> {
  try {
    // Usar la función real para combinar archivos Excel
    return await combineExcelFiles(productIds);
  } catch (error) {
    console.error('Error combinando archivos:', error);
    
    // Fallback: crear archivo de ejemplo
    const demoContent = `
      Estados Financieros Combinados
      Generado automáticamente después del pago
      Productos: ${productIds.join(', ')}
      Fecha: ${new Date().toISOString()}
      Nota: Error combinando archivos, contacta soporte
    `;

    const buffer = Buffer.from(demoContent, 'utf-8');
    const fileName = `estados_financieros_${Date.now()}.txt`;

    return { buffer, fileName };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, customerEmail, customerName, transactionId, amount } = body;

    // Validar datos
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un producto' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Datos del cliente requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el total coincide
    const expectedTotal = calculateTotalPrice(productIds);
    if (amount !== expectedTotal) {
      return NextResponse.json(
        { error: 'El monto no coincide con los productos' },
        { status: 400 }
      );
    }

    // Verificar que todos los productos existen y están activos
    const products = productIds.map(id => getProductById(id)).filter(Boolean);
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Uno o más productos no encontrados' },
        { status: 400 }
      );
    }

    // Crear datos del pago
    const paymentData: PaymentData = {
      productIds,
      customerEmail,
      customerName,
      transactionId,
      amount,
    };

    // Generar archivo combinado
    const { buffer, fileName } = await generateCombinedFile(productIds);

    // Enviar por email
    await sendFileByEmail(paymentData, buffer, fileName);

    // Guardar compras en la base de datos
    for (const product of products) {
      if (product) {
        await createPurchase(
          customerEmail,
          customerName,
          product.id,
          product.price
        );
      }
    }

    console.log('Compras registradas en la base de datos');

    return NextResponse.json({
      success: true,
      message: 'Pago procesado y archivo enviado exitosamente',
      transactionId,
      emailSent: true,
    });

  } catch (error) {
    console.error('Error procesando pago:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 