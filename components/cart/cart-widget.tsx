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
  const totalClp = useMemo(() => items.reduce((sum, i) => sum + Math.round(Number(i.price || 0)), 0), [items])
  const formatClp = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)

  const effectiveEmail = userEmail?.trim() || "guest"

  const loadCart = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cart/items?userEmail=${encodeURIComponent(effectiveEmail)}`)
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
    return () => {
      window.removeEventListener("cart:updated", onUpdated as EventListener)
      window.removeEventListener('cart:open', onOpen as EventListener)
      window.removeEventListener('focus', onUpdated as EventListener)
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
      await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: effectiveEmail, productId })
      })
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
      const email = (userEmail && userEmail.trim() !== '' ? userEmail : 'guest')
      const resp = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email, productId: product.id })
      })
      if (resp.ok) {
        await loadCart()
        window.dispatchEvent(new CustomEvent('cart:updated'))
        toast({ title: 'Agregado al carrito', description: `${product.companyName} agregado correctamente`, variant: 'success' })
        // refrescar recomendaciones para evitar duplicar
        await loadRecommendations()
      }
    } catch {}
  }

  const saveEmailAndSync = async (email: string) => {
    setUserEmail(email)
    localStorage.setItem('userEmail', email)
    setShowEmailDialog(false)
    // opcional: sincronizar los productos del invitado al email
    try {
      const guestResp = await fetch(`/api/cart/items?userEmail=guest`)
      const guestData = await guestResp.json()
      if (guestData.success && Array.isArray(guestData.items)) {
        for (const it of guestData.items) {
          await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail: email, productId: it.product_id })
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
          <DialogContent className="max-w-md w-[calc(100%-1.5rem)]">
          <DialogHeader>
            <DialogTitle>Tu Carrito</DialogTitle>
            <DialogDescription>
              {items.length === 0 ? "Tu carrito está vacío" : `${items.length} archivo(s) seleccionado(s)`}
            </DialogDescription>
          </DialogHeader>

          {items.length > 0 ? (
            <div className="space-y-4">
              <div className="max-h-[55vh] overflow-y-auto space-y-2">
                {items.map((item, idx) => (
                  <div key={`${item.product_id}-${idx}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-800">{item.company_name}</p>
                      <p className="text-xs text-slate-500">{item.year_range}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{formatClp(Number(item.price || 0))}</span>
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

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center font-semibold text-sm text-slate-800">
                  <span>Total:</span>
                  <span>{formatClp(totalClp)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Pago seguro Transbank</div>
                  <div className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Datos oficiales CMF</div>
                  <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-sky-600" /> Entrega inmediata</div>
                </div>
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
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

              <p className="text-xs text-slate-500 text-center">Compra 100% segura. Recibirás enlaces de descarga por email.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Agrega archivos a tu carrito para comenzar</p>
            </div>
          )}

          {items.length > 0 && recommended.length > 0 && (
            <div className="mt-2 border-t pt-3">
              <p className="text-xs font-semibold mb-2 text-gray-700">También te puede interesar</p>
              <div className="space-y-2">
                {recommended.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                    <div className="min-w-0 pr-2">
                      <p className="text-sm font-medium truncate">{p.companyName}</p>
                      <p className="text-[11px] text-gray-500 truncate">{p.yearRange} • {p.sector}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatClp(Number(p.price || 0))}</span>
                      <Button size="sm" className="h-7 px-3 bg-green-600 hover:bg-green-700" onClick={() => addRecommendedToCart(p)}>
                        Añadir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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


