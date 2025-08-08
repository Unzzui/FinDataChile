import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

function createTransport() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) throw new Error('SMTP credentials are not configured')
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true
  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, email, years, message } = body || {}
    if (!companyName || !email) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const notify = process.env.PURCHASE_NOTIFY_EMAIL
    const sender = process.env.SMTP_USER
    const recipients = [notify, sender].filter(Boolean) as string[]

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a">
        <h2 style="margin:0 0 12px 0;color:#111">Nueva Solicitud de Estados Financieros</h2>
        <p style="margin:0 0 8px 0"><strong>Empresa:</strong> ${companyName}</p>
        <p style="margin:0 0 8px 0"><strong>Email solicitante:</strong> ${email}</p>
        ${years ? `<p style="margin:0 0 8px 0"><strong>Años de interés:</strong> ${years}</p>` : ''}
        ${message ? `<p style="margin:0 0 8px 0"><strong>Mensaje:</strong> ${message}</p>` : ''}
      </div>
    `

    const transport = createTransport()
    await transport.sendMail({
      from: `FinData Chile <${sender}>`,
      to: recipients.join(', '),
      subject: `Solicitud de Estados Financieros - ${companyName}`,
      // Para proveedores como Namecheap/Jellyfish, el Reply-To debe ser del mismo dominio que From
      replyTo: sender,
      html,
      text: `Nueva solicitud\nEmpresa: ${companyName}\nEmail: ${email}\nAños: ${years || '-'}\nMensaje: ${message || '-'}`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error enviando solicitud:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}


