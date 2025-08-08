"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ShieldCheck, Clock, CreditCard, ShoppingCart } from "lucide-react"
import { usePayment } from "@/hooks/use-payment"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface CartItem {
  product_id: string
  company_name: string
  sector: string
  year_range: string
  price: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [userEmail, setUserEmail] = useState("")
  const [recommended, setRecommended] = useState<any[]>([])
  const { initiatePayment, isProcessing } = usePayment()
  const { toast } = useToast()

  const total = useMemo(() => items.reduce((s, i) => s + Number(i.price || 0), 0), [items])
  const formatClp = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)

  useEffect(() => {
    const saved = localStorage.getItem('userEmail')
    if (saved) setUserEmail(saved)
  }, [])

  const load = async (email: string) => {
    const resp = await fetch(`/api/cart/items`)
    const data = await resp.json()
    if (data.success) setItems(data.items || [])
  }

  useEffect(() => {
    load(userEmail)
    loadRecommendations()
  }, [userEmail])

  const remove = async (productId: string) => {
    await fetch('/api/cart/remove', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
    await load(userEmail)
    window.dispatchEvent(new CustomEvent('cart:updated'))
  }

  const loadRecommendations = async () => {
    try {
      const resp = await fetch('/api/products')
      if (!resp.ok) return
      const products = await resp.json()
      const inCart = new Set(items.map(i => i.product_id))
      const firstSector = items[0]?.sector
      const recs = products
        .filter((p: any) => p.isActive && !inCart.has(p.id))
        .sort((a: any, b: any) => {
          const aMatch = a.sector === firstSector ? 1 : 0
          const bMatch = b.sector === firstSector ? 1 : 0
          return bMatch - aMatch
        })
        .slice(0, 6)
      setRecommended(recs)
    } catch {}
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
          await load(userEmail)
          window.dispatchEvent(new CustomEvent('cart:updated'))
          toast({ title: 'Agregado al carrito', description: `${product.companyName} agregado correctamente`, variant: 'success' })
          await loadRecommendations()
        }
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 py-12 pb-24">
        {/* Header elegante */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Tu Carrito
          </h1>
          <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto">
            Revisa tus archivos seleccionados y finaliza tu compra de forma segura
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-light text-gray-900 mb-3">Tu carrito está vacío</h2>
              <p className="text-gray-600 font-light mb-6">
                Explora nuestro catálogo de estados financieros
              </p>
              <Link href="/tienda">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white font-light px-8 py-3 rounded-xl">
                  Explorar productos
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                Productos seleccionados ({items.length})
              </h2>
              
              {items.map((item: any) => (
                <div key={item.product_id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 pr-4 flex-1">
                      <h3 className="text-lg font-light text-gray-900 mb-2">{item.company_name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 font-light">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{item.year_range}</span>
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{item.sector}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-light text-gray-900">{formatClp(Number(item.price || 0))}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => remove(item.product_id)}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 font-light"
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Productos recomendados */}
              {recommended.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-light text-gray-900">También te puede interesar</h2>
                    <Link href="/tienda" className="text-gray-600 hover:text-gray-900 font-light hover:underline">
                      Ver todos →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommended.map((p) => (
                      <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-base font-light text-gray-900 mb-1">{p.companyName}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="bg-gray-100 px-2 py-1 rounded-full">{p.yearRange}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded-full">{p.sector}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-light text-gray-900">{formatClp(Number(p.price || 0))}</span>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 text-white hover:bg-blue-700 font-light px-4 py-2 rounded-lg" 
                              onClick={() => addRecommendedToCart(p)}
                            >
                              Añadir
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Panel lateral de resumen */}
            <div className="relative">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-8">
                <h3 className="text-xl font-light text-gray-900 mb-6">Resumen de compra</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 font-light">
                    <span>Subtotal</span>
                    <span>{formatClp(total)}</span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between text-lg font-light text-gray-900">
                    <span>Total</span>
                    <span>{formatClp(total)}</span>
                  </div>
                </div>

                {/* Iconos de confianza */}
                <div className="grid grid-cols-1 gap-3 mb-6 text-xs text-gray-600 font-light">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                    <span>Pago seguro Transbank</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                    <span>Datos oficiales CMF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Entrega inmediata</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-light py-3 rounded-xl" 
                  disabled={isProcessing} 
                  onClick={async () => {
                    if (!userEmail || userEmail.trim() === '') {
                      alert('Por favor ingresa tu email en el marketplace para continuar')
                      return
                    }
                    await initiatePayment({
                      productIds: items.map((i) => i.product_id),
                      customerEmail: userEmail,
                      customerName: 'Usuario',
                    })
                  }}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pagar con WebPay
                    </div>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4 font-light">
                  Recibirás los enlaces por email al completar la compra
                </p>
              </div>

              {/* FAQ y políticas */}
              <div className="space-y-6 mt-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h4 className="text-lg font-light text-gray-900 mb-4">Preguntas frecuentes</h4>
                  <div className="space-y-4 text-sm text-gray-600 font-light">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">¿Cómo recibo mis archivos?</p>
                      <p>Tras el pago, te enviamos un correo con los enlaces de descarga. También quedan disponibles en "Mis Compras".</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">¿Qué contienen los Excel?</p>
                      <p>Estados financieros Balance, Resultados y Flujos, anuales o trimestrales según corresponda.</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">¿Qué pasa si no recibo el correo?</p>
                      <p>Revisa spam/promociones. Si no aparece, contáctanos y reenviamos el correo.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h4 className="text-lg font-light text-gray-900 mb-3">Política de devoluciones</h4>
                  <p className="text-sm text-gray-600 font-light">
                    Debido a la naturaleza digital, no realizamos devoluciones una vez descargados los archivos. 
                    Si hubo un error, contáctanos y lo resolveremos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barra fija móvil */}
        {items.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 flex items-center justify-between gap-4 shadow-lg pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="text-sm font-light">
              <div className="text-gray-600">Total</div>
              <div className="text-gray-900 font-medium text-lg">{formatClp(total)}</div>
            </div>
            <Button 
              className="bg-gray-900 hover:bg-gray-800 text-white font-light px-6 py-3 rounded-xl" 
              disabled={isProcessing} 
              onClick={async () => {
                if (!userEmail || userEmail.trim() === '') { 
                  alert('Por favor ingresa tu email en el marketplace para continuar'); 
                  return 
                }
                await initiatePayment({ 
                  productIds: items.map((i) => i.product_id), 
                  customerEmail: userEmail, 
                  customerName: 'Usuario' 
                })
              }}
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              Pagar con WebPay
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
