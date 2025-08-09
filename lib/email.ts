import nodemailer from 'nodemailer'
import fs from 'fs/promises'
import path from 'path'

export interface CartEmailItem {
  companyName: string
  yearRange: string
  price: number
}

function createTransport() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) throw new Error('SMTP credentials are not configured')

  // Por defecto, usar Gmail. Si se requiere otro host, ampliar con variables SMTP_HOST/PORT/SECURE
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

export async function sendCartReminderEmail(to: string, items: CartEmailItem[]) {
  if (!to) return
  try {
    const transport = createTransport()
    const total = items.reduce((s, i) => s + Number(i.price || 0), 0)
  const itemsRows = items
      .map((i) => `
        <tr>
          <td style="padding:8px 0;color:#111;font-weight:600">${i.companyName}</td>
          <td style="padding:8px 0;color:#555;text-align:right">${i.yearRange}</td>
          <td style="padding:8px 0;color:#111;text-align:right">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(i.price || 0))}</td>
        </tr>
      `)
      .join('')

    const { html, text, attachments } = await buildBrandedEmail({
      title: 'Tu carrito te espera',
      preheader: 'Completa tu compra en FinData Chile',
      headerTitle: 'Tu Carrito',
      introHtml:
        '<p style="margin:0 0 12px 0;color:#333">Has agregado estos archivos a tu carrito:</p>',
      tableHtml: `
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          ${itemsRows}
          <tr><td colspan="3" style="border-top:1px solid #eee;padding-top:10px;color:#111;font-weight:bold;text-align:right">Total: ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(total)}</td></tr>
        </table>
      `,
      ctaPrimary: { text: 'Finalizar compra', url: process.env.NEXT_PUBLIC_BASE_URL || '#' },
    })

    await transport.sendMail({
      from: `FinData Chile <${process.env.SMTP_USER}>`,
      to,
      bcc: process.env.SMTP_BCC || process.env.SMTP_USER,
      // Para servidores que validan dominio, Reply-To igual al From
      replyTo: process.env.SMTP_USER,
      subject: 'Tu carrito en FinData Chile',
      html,
      text,
      attachments,
    })
    return true
  } catch {
    return false
  }
}

export async function sendPurchaseLinksEmail(
  to: string,
  links: { companyName: string; url: string }[],
  meta?: { amountClp?: number; buyOrder?: string },
  options?: { baseUrl?: string }
) {
  if (!to) return false
  try {
    const transport = createTransport()
    const itemsHtml = links
      .map(
        (l) =>
          `
      <tr>
        <td style="padding:10px 0">
          <div style="font-weight:600;color:#111;margin-bottom:4px">${l.companyName}</div>
          <a href="${l.url}" style="display:inline-block;padding:8px 12px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-size:14px">Descargar</a>
        </td>
      </tr>`
      )
      .join('')
    const parts: string[] = []
    if (meta?.buyOrder) parts.push(`Orden: ${meta.buyOrder}`)
    if (meta?.amountClp != null) parts.push(`Monto: ${new Intl.NumberFormat('es-CL').format(meta.amountClp)} CLP`)
    const intro = parts.length ? `<p style="margin:0 0 12px 0;color:#333">${parts.join(' · ')}</p>` : ''

    const { html, text, attachments } = await buildBrandedEmail({
      title: 'Tu compra está lista',
      preheader: 'Descarga tus archivos de FinData Chile',
      headerTitle: 'Compra Confirmada',
      introHtml: `${intro}<p style="margin:0 0 12px 0;color:#333">Tus archivos están disponibles en estos enlaces (válidos por tiempo limitado):</p>`,
      tableHtml: `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${itemsHtml}</table>`,
      ctaSecondary: { text: 'Ver mis compras', url: (options?.baseUrl || process.env.NEXT_PUBLIC_BASE_URL || '') + '/compras' },
    })

    const mail = {
      from: `FinData Chile <${process.env.SMTP_USER}>`,
      to,
      bcc: process.env.SMTP_BCC || process.env.SMTP_USER,
      // Para servidores que validan dominio, Reply-To igual al From
      replyTo: process.env.SMTP_USER,
      subject: 'Tus archivos de compra - FinData Chile',
      html,
      text,
      attachments,
    } as const

    // Copia para el equipo (notificación interna de compra)
    const internal = process.env.PURCHASE_NOTIFY_EMAIL
    if (internal) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const internalHtml = `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a">
            <div style="margin-bottom:12px"><img src="${baseUrl}/logo-horizontal.svg" alt="FinData Chile" width="140" height="46" style="display:block" /></div>
            <h2 style="margin:0 0 10px 0;color:#111">Nueva compra confirmada</h2>
            <p style="margin:0 0 6px 0"><strong>Orden:</strong> ${meta?.buyOrder || '-'}</p>
            <p style="margin:0 0 6px 0"><strong>Monto:</strong> ${new Intl.NumberFormat('es-CL').format(Number(meta?.amountClp || 0))} CLP</p>
            <p style="margin:0 0 6px 0"><strong>Cliente:</strong> ${to}</p>
            <p style="margin:0 0 10px 0"><strong>Ítems:</strong> ${links.length}</p>
            <ul style="margin:0;padding-left:18px;color:#334155">${links.map(l => `<li>${l.companyName}</li>`).join('')}</ul>
          </div>
        `
        await transport.sendMail({
          from: `FinData Chile <${process.env.SMTP_USER}>`,
          to: internal,
          subject: `[Compra] ${meta?.buyOrder || ''} - ${new Intl.NumberFormat('es-CL').format(Number(meta?.amountClp || 0))} CLP`,
          html: internalHtml,
          text: `Nueva compra\nOrden: ${meta?.buyOrder || '-'}\nMonto: ${new Intl.NumberFormat('es-CL').format(Number(meta?.amountClp || 0))} CLP\nCliente: ${to}\nItems: ${links.length}`,
        })
      } catch {}
    }

    await transport.sendMail(mail)
    return true
  } catch {
    return false
  }
}

async function buildBrandedEmail(args: {
  title: string
  preheader?: string
  headerTitle?: string
  introHtml?: string
  tableHtml?: string
  ctaPrimary?: { text: string; url: string }
  ctaSecondary?: { text: string; url: string }
}) {
  const pre = args.preheader
    ? `<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0">${args.preheader}</span>`
    : ''

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Intentar incrustar el logo como attachment inline (cid)
  let headerImg = ''
  const attachments: Array<{ filename: string; content: Buffer | string; contentType: string; cid: string }> = []
  try {
    const logoPath = path.resolve(process.cwd(), 'public', 'logo-horizontal.svg')
    const svg = await fs.readFile(logoPath)
    attachments.push({ filename: 'logo-horizontal.svg', content: svg, contentType: 'image/svg+xml', cid: 'logo-horizontal' })
    headerImg = `<img src="cid:logo-horizontal" alt="FinData Chile" width="140" height="46" style="display:block" />`
  } catch {
    // Fallback a URL pública si no se pudo leer el archivo
    headerImg = `<img src="${baseUrl}/logo-horizontal.svg" alt="FinData Chile" width="140" height="46" style="display:block" />`
  }

  const html = `
  <!doctype html>
  <html>
    <body style="margin:0;padding:0;background:#f6f7f9">
      ${pre}
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f7f9;padding:24px 0">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="background:#ffffff;border-radius:12px;padding:24px 28px;font-family:Arial,Helvetica,sans-serif">
               <tr>
                <td style="padding-bottom:12px">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                       <td>${headerImg}</td>
                       <td style="padding-left:12px;vertical-align:middle">
                         <div style="font-size:12px;color:#2563eb;margin-top:2px">${args.title}</div>
                       </td>
                    </tr>
                  </table>
                </td>
              </tr>
              ${args.headerTitle ? `<tr><td style="font-size:16px;font-weight:700;color:#111;padding:6px 0 8px 0">${args.headerTitle}</td></tr>` : ''}
              ${args.introHtml ? `<tr><td>${args.introHtml}</td></tr>` : ''}
              ${args.tableHtml ? `<tr><td style="padding-top:6px">${args.tableHtml}</td></tr>` : ''}
              <tr><td style="padding-top:16px">
                 ${
                   args.ctaPrimary
                     ? `<a href="${args.ctaPrimary.url}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:600">${args.ctaPrimary.text}</a>`
                     : ''
                 }
                ${
                  args.ctaSecondary
                     ? `<a href="${args.ctaSecondary.url}" style="display:inline-block;margin-left:10px;color:#2563eb;text-decoration:none;font-weight:600">${args.ctaSecondary.text} →</a>`
                    : ''
                }
              </td></tr>
              <tr><td style="padding-top:20px;border-top:1px solid #eee;color:#888;font-size:12px">
                <div>Si necesitas ayuda, contáctanos respondiendo este correo.</div>
                <div style="margin-top:4px">© ${new Date().getFullYear()} FinData Chile</div>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `

  const text = `${args.title}\n${args.preheader || ''}`

  return {
    html,
    text,
    attachments,
  }
}


