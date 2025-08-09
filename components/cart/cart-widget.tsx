"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { CreditCard, ShoppingCart, X, CheckCircle, ShieldCheck, Clock } from "lucide-react"
import { usePayment } from "@/hooks/use-payment"
import { getClpPerUsd } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  product_id: string
  company_name: string
  year_range: string
  sector?: string
  price: number
}

export function CartWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string>("")
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [recommended, setRecommended] = useState<any[]>([])
  const { initiatePayment, isProcessing } = usePayment()
  const { toast } = useToast()
  const pathname = usePathname()

  const [usdToClpRate, setUsdToClpRate] = useState(1)
  
  // Función para calcular precios con descuentos por paquetes
  const calculatePackagePrice = (itemCount: number) => {
    if (itemCount >= 5) {
      // Para 5 o más: precio base de paquete 5 + items adicionales a precio reducido
      const extraItems = itemCount - 5
      return 9900 + (extraItems * 1900) // Items adicionales a $1.900 c/u
    } else if (itemCount >= 3) {
      // Para 3-4: precio base de paquete 3 + items adicionales a precio reducido  
      const extraItems = itemCount - 3
      return 6900 + (extraItems * 2200) // Items adicionales a $2.200 c/u
    }
    return itemCount * 2900 // Precio individual
  }

  // Función para calcular ahorros
  const calculateSavings = (itemCount: number) => {
    const individualPrice = itemCount * 2900
    const packagePrice = calculatePackagePrice(itemCount)
    return individualPrice - packagePrice
  }

  const totalClp = useMemo(() => calculatePackagePrice(items.length), [items])
  const totalSavings = useMemo(() => calculateSavings(items.length), [items])
  const formatClp = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)

  const loadCart = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cart/items`)
      const data = await response.json()
      if (data.success) {
        setItems(
          (data.items || []).map((it: any) => ({
            product_id: it.product_id,
            company_name: it.company_name,
            year_range: it.year_range,
            sector: it.sector,
            price: Number(it.price),
          }))
        )
      }
    } catch (err) {
      // noop
    } finally {
      setLoading(false)
    }
  }

  const loadRecommendations = async () => {
    try {
      // Solo recomendar cuando haya al menos un ítem en el carrito
      if (items.length === 0) {
        setRecommended([])
        return
      }
      const resp = await fetch('/api/products')
      if (!resp.ok) return
      const products = await resp.json()
      const inCartIds = new Set(items.map(i => i.product_id))
      const firstSector = (products.find((p: any) => inCartIds.has(p.id))?.sector) || items[0]?.sector
      const candidates = products
        .filter((p: any) => p.isActive && !inCartIds.has(p.id))
        .sort((a: any, b: any) => {
          const aMatch = a.sector === firstSector ? 1 : 0
          const bMatch = b.sector === firstSector ? 1 : 0
          return bMatch - aMatch
        })
        .slice(0, 3)
      setRecommended(candidates)
    } catch {}
  }

  useEffect(() => {
    // CLP nativo
    setUsdToClpRate(1)
    
    // Intentar obtener email autenticado desde API; fallback a localStorage (temporal)
    fetch('/api/auth/me').then(async (r) => {
      if (r.ok) {
        const data = await r.json()
        if (data?.authenticated && data.user?.email) {
          setUserEmail(data.user.email)
          return
        }
      }
      const saved = localStorage.getItem("userEmail")
      if (saved) setUserEmail(saved)
    }).finally(() => {
      loadCart()
    })

    const onUpdated = () => loadCart()
    window.addEventListener("cart:updated", onUpdated as EventListener)
    const onOpen = () => setIsOpen(true)
    window.addEventListener('cart:open', onOpen as EventListener)
    window.addEventListener('focus', onUpdated as EventListener)
    const onCartOpenRequest = () => setIsOpen(true)
    window.addEventListener('cart:open-request', onCartOpenRequest as EventListener)
    return () => {
      window.removeEventListener("cart:updated", onUpdated as EventListener)
      window.removeEventListener('cart:open', onOpen as EventListener)
      window.removeEventListener('focus', onUpdated as EventListener)
      window.removeEventListener('cart:open-request', onCartOpenRequest as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isOpen) loadCart()
    if (isOpen) loadRecommendations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Re-cargar carrito al cambiar de ruta (p.ej., volver del flujo de pago)
  useEffect(() => {
    loadCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const removeFromCart = async (productId: string) => {
    try {
      let resp = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      if (!resp.ok) {
        // inicializar guestId si faltaba y reintentar
        await fetch('/api/cart/items')
        resp = await fetch('/api/cart/remove', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
      }
      await loadCart()
      window.dispatchEvent(new CustomEvent('cart:updated'))
    } catch (e) {}
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({ title: "Carrito vacío", description: "Agrega productos antes de pagar", variant: "destructive" })
      return
    }

    if (!userEmail || userEmail.trim() === '') {
      setShowEmailDialog(true)
      return
    }

    try {
      await initiatePayment({
        productIds: items.map(i => i.product_id),
        customerEmail: userEmail,
        customerName: "Usuario",
      })
    } catch (e) {}
  }

  const addRecommendedToCart = async (product: any) => {
    try {
      const resp = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      })
      if (resp.ok) {
        const data = await resp.json()
        if (data.alreadyPurchased) {
          toast({ title: 'Ya comprado', description: `${product.companyName} ya está en tus compras` })
        } else {
          await loadCart()
          window.dispatchEvent(new CustomEvent('cart:updated'))
          toast({ title: 'Agregado al carrito', description: `${product.companyName} agregado correctamente`, variant: 'success' })
          await loadRecommendations()
        }
      }
    } catch {}
  }

  const saveEmailAndSync = async (email: string) => {
    setUserEmail(email)
    localStorage.setItem('userEmail', email)
    setShowEmailDialog(false)
    // opcional: sincronizar los productos del invitado al email
    try {
      const guestResp = await fetch(`/api/cart/items`)
      const guestData = await guestResp.json()
      if (guestData.success && Array.isArray(guestData.items)) {
        for (const it of guestData.items) {
          await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: it.product_id })
          })
        }
      }
      // Enviar email de recordatorio de carrito
      try {
        await fetch('/api/notifications/cart-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: email }),
        })
      } catch {}
    } catch {}
    window.dispatchEvent(new CustomEvent('cart:updated'))
    toast({ title: "Email guardado", description: "Tu email ha sido guardado para futuras compras" })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="relative bg-white text-slate-800 border-slate-200 hover:bg-slate-50 text-xs md:text-sm">
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="sm:hidden">({items.length})</span>
            {items.length > 0 && (
              <Badge className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-sky-600 text-white text-xs px-1 py-0.5">
                {items.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
          <DialogContent className="max-w-md w-[calc(100%-1.5rem)] p-4 sm:p-6 flex flex-col max-h-[85vh] sm:max-h-[80vh] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Tu Carrito</DialogTitle>
            <DialogDescription>
              {items.length === 0 ? "Tu carrito está vacío" : `${items.length} archivo(s) seleccionado(s)`}
            </DialogDescription>
          </DialogHeader>

          {/* Aviso de descuento visible al abrir */}
          {items.length > 0 && items.length < 5 && (
            <div className="rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-2.5 text-[12px] text-amber-900 mb-2">
              {items.length < 3 ? (
                <>Agrega <span className="font-semibold">{3 - items.length}</span> archivo(s) para el <span className="font-semibold">Paquete 3</span> por <span className="font-semibold">$6.900</span>. Archivos adicionales a <span className="font-semibold">$2.200</span> c/u.</>
              ) : (
                <>Agrega <span className="font-semibold">{5 - items.length}</span> archivo(s) para el <span className="font-semibold">Paquete 5</span> por <span className="font-semibold">$9.900</span>. Archivos adicionales a <span className="font-semibold">$1.900</span> c/u.</>
              )}
            </div>
          )}

          {items.length > 0 ? (
            <div className="flex flex-col flex-1 min-h-0 gap-3">
              {/* Lista de items con scroll controlado */}
              <div className="overflow-y-auto space-y-2 max-h-[25vh] flex-shrink-0">
                {items.map((item, idx) => (
                  <div key={`${item.product_id}-${idx}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-800">{item.company_name}</p>
                      <p className="text-xs text-slate-500">{item.year_range}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">$2.900</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product_id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="flex-shrink-0" />

              {/* Sección de totales compacta */}
              <div className="space-y-2 flex-shrink-0">
                {/* Mostrar precio individual vs paquete */}
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>Individual ({items.length} × $2.900):</span>
                  <span className={items.length >= 3 ? "line-through" : ""}>{formatClp(items.length * 2900)}</span>
                </div>
                
                {/* Mostrar descuento aplicado */}
                {items.length >= 3 && (
                  <>
                    <div className="flex justify-between items-center text-xs text-green-600">
                      <span>
                        {items.length >= 5 ? (
                          items.length > 5 ? 
                            `Paquete 5 ($9.900) + ${items.length - 5} × $1.900:` :
                            `Descuento Paquete 5:`
                        ) : (
                          items.length > 3 ?
                            `Paquete 3 ($6.900) + ${items.length - 3} × $2.200:` :
                            `Descuento Paquete 3:`
                        )}
                      </span>
                      <span>-{formatClp(totalSavings)}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center font-semibold text-sm text-slate-800 pt-1 border-t">
                  <span>Total:</span>
                  <span className="text-green-600">{formatClp(totalClp)}</span>
                </div>
                
                {totalSavings > 0 && (
                  <p className="text-xs text-green-600 text-center">
                    ¡Ahorras {formatClp(totalSavings)}!
                  </p>
                )}
              </div>

              {/* Botón de pago */}
              <Button 
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg flex-shrink-0"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Pagar con WebPay
              </Button>

              {/* Iconos de confianza compactos */}
              <div className="flex justify-center gap-4 text-[10px] text-slate-500 flex-shrink-0">
                <div className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Seguro</div>
                <div className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Oficial</div>
                <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> Inmediato</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Agrega archivos a tu carrito para comenzar</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para ingresar email */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ingresa tu Email</DialogTitle>
            <DialogDescription>
              Necesitamos tu email para guardar tus compras y permitirte descargar archivos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                onKeyPress={(e) => e.key === 'Enter' && saveEmailAndSync(e.currentTarget.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const emailInput = document.getElementById('email') as HTMLInputElement
                  if (emailInput && emailInput.value) {
                    saveEmailAndSync(emailInput.value)
                  }
                }}
                className="flex-1"
              >
                Guardar Email
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEmailDialog(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


