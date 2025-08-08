"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  ShoppingCart,
  Building2,
  Download,
  User,
  X,
  CreditCard,
  Check,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { usePayment } from "@/hooks/use-payment"
import { RequestCompany } from "@/components/request-company"
import { clasificador } from '@/lib/clasificador-empresas'
// (El CartManager no se usa aquí)
import { DownloadButton } from "@/components/download-button"
import React from "react"
// Función para cargar productos desde la API
async function loadProductsFromAPI() {
  try {
    console.log('Iniciando carga de productos...');
    const response = await fetch('/api/products');
    console.log('Respuesta de API:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Error cargando productos: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Productos cargados:', data.length);
    return data;
  } catch (error) {
    console.error('Error cargando productos:', error);
    return [];
  }
}

interface CartItem {
  productId: string;
  productName: string;
  companyName: string;
  sector: string;
  yearRange: string;
  price: number;
}

// Skeleton simple para tarjetas (mejora de percepción de carga)
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 space-y-4 shadow-sm">
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="flex gap-2">
        <div className="h-4 bg-gray-200 w-16 rounded" />
        <div className="h-4 bg-gray-200 w-12 rounded" />
        <div className="h-4 bg-gray-200 w-14 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 w-full rounded" />
        <div className="h-3 bg-gray-200 w-5/6 rounded" />
        <div className="h-3 bg-gray-200 w-4/6 rounded" />
      </div>
      <div className="h-8 bg-gray-200 rounded" />
    </div>
  )
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("todos")
  const [selectedYearRange, setSelectedYearRange] = useState("todos")
  const [sortBy, setSortBy] = useState("relevance")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [usdToClpRate, setUsdToClpRate] = useState(1)

  // Función para cargar el carrito desde la base de datos
  const loadCartFromDB = async () => {
    try {
      const email = userEmail || 'guest'
      const response = await fetch(`/api/cart/items?userEmail=${encodeURIComponent(email)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Transformar los items del carrito al formato local
          const cartItems: CartItem[] = data.items.map((item: any) => ({
            productId: item.product_id,
            productName: item.description || '',
            companyName: item.company_name,
            sector: item.sector,
            yearRange: item.year_range,
            price: item.price,
          }))
          setCart(cartItems)
        }
      }
    } catch (error) {
      console.error('Error cargando carrito:', error)
    }
  }

  const [addedToCartId, setAddedToCartId] = useState<string | null>(null)

  // Función mejorada para verificar si una empresa es popular usando la base de datos completa
  const isEmpresaPopular = (companyName: string) => {
    const clasificacion = clasificador.clasificarEmpresa(companyName + '_EEFF.xlsx')
    // Una empresa es popular si tiene alta confianza en la clasificación (está en nuestra BD)
    return clasificacion.confianza > 0.8
  }

  // Función optimizada para agregar al carrito sin recargar todo
  const addToCartOptimized = async (product: typeof products[0]) => {
    try {
      const email = (userEmail && userEmail.trim() !== '' ? userEmail : 'guest')

      // Agregar a la base de datos (soporta invitado 'guest')
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: email,
          productId: product.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Solo proceder si realmente se agregó algo nuevo
        if (data.success && !data.alreadyExists) {
          // Agregar directamente al estado local sin recargar
          const newItem: CartItem = {
            productId: product.id,
            productName: product.description,
            companyName: product.companyName,
            sector: product.sector,
            yearRange: product.yearRange,
            price: product.price,
          }
          setCart((prev) => [...prev, newItem])
          // Notificar al widget del navbar
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cart:updated'))
          }
          
          // Feedback visual sutil en el botón
          setAddedToCartId(product.id)
          setTimeout(() => setAddedToCartId(null), 2000)
        } else if (data.alreadyExists) {
          // Producto ya estaba en el carrito, mostrar mensaje diferente
          toast({
            title: "Ya en el carrito",
            description: `${product.companyName} ya está en tu carrito`,
            variant: "default",
          })
        }
      }
    } catch (error) {
      console.error('Error agregando al carrito:', error)
      // Solo mostrar toast para errores
      toast({
        title: "Error",
        description: "No se pudo agregar al carrito",
        variant: "destructive"
      })
    }
  }
  const { toast } = useToast()
  const { initiatePayment, isProcessing } = usePayment()

  // Cargar email desde localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail && savedEmail.trim() !== '') {
      setUserEmail(savedEmail)
    }
  }, [])

  // Cargar carrito cuando cambie el email
  useEffect(() => {
    loadCartFromDB()
  }, [userEmail])

  // Cargar tipo de cambio CLP referencial
  useEffect(() => {
    setUsdToClpRate(1)
  }, [])

  // Guardar email en localStorage
  const saveUserEmail = (email: string) => {
    setUserEmail(email)
    localStorage.setItem('userEmail', email)
    setShowEmailDialog(false)
    
    // Sincronizar el carrito local con la base de datos después de guardar el email
    if (cart.length > 0) {
      // Agregar todos los items del carrito local a la base de datos
      cart.forEach(async (item) => {
        try {
          await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail: email,
              productId: item.productId,
            }),
          })
        } catch (error) {
          console.error('Error sincronizando carrito:', error)
        }
      })
    }
    
    toast({
      title: "Email guardado",
      description: "Tu email ha sido guardado para futuras compras"
    })
  }

  // Cargar productos al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const loadedProducts = await loadProductsFromAPI()
        console.log('Productos cargados desde API:', loadedProducts.length)
        console.log('Productos activos:', loadedProducts.filter((p: any) => p.isActive).length)
        console.log('Productos inactivos:', loadedProducts.filter((p: any) => !p.isActive).length)
        setProducts(loadedProducts)
      } catch (error) {
        console.error('Error cargando productos:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  const sectores = useMemo(() => [...new Set(products.map((p) => p.sector))], [products])
  const yearRanges = useMemo(() => [...new Set(products.map((p) => p.yearRange))], [products])

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSector = selectedSector === "todos" || product.sector === selectedSector
      const matchesYearRange = selectedYearRange === "todos" || product.yearRange === selectedYearRange
      const isActive = product.isActive
      
      return matchesSearch && matchesSector && matchesYearRange && isActive
    })

    // Ordenamiento
    const toYear = (yr: string) => {
      const parts = yr?.split('-')
      const end = parts && parts.length > 1 ? parseInt(parts[1], 10) : parseInt(parts?.[0] || '0', 10)
      return isNaN(end) ? 0 : end
    }
    if (sortBy === 'name') {
      filtered.sort((a: any, b: any) => a.companyName.localeCompare(b.companyName))
    } else if (sortBy === 'priceLow') {
      filtered.sort((a: any, b: any) => (a.price || 0) - (b.price || 0))
    } else if (sortBy === 'priceHigh') {
      filtered.sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
    } else if (sortBy === 'yearNew') {
      filtered.sort((a: any, b: any) => toYear(b.yearRange) - toYear(a.yearRange))
    }

    return filtered
  }, [searchTerm, selectedSector, selectedYearRange, sortBy, products])

  const addToCart = (product: typeof products[0]) => {
    const newItem: CartItem = {
      productId: product.id,
      productName: product.description,
      companyName: product.companyName,
      sector: product.sector,
      yearRange: product.yearRange,
      price: product.price,
    }
    setCart((prev) => [...prev, newItem])
  }

  const removeFromCart = async (productId: string) => {
    try {
      const email = userEmail || 'guest'
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: email, productId }),
      })

      if (response.ok) {
        // Recargar el carrito desde la base de datos
        await loadCartFromDB()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart:updated'))
        }
      }
    } catch (error) {
      console.error('Error removiendo del carrito:', error)
    }
  }



  const totalCart = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price || 0), 0), [cart])
  const totalClp = useMemo(() => Math.round(totalCart), [totalCart])
  const formatClp = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)

  const getSectorColor = (sector: string) => {
    return "bg-slate-100 text-slate-800 border border-slate-200"
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1">
        {/* Header simple */}
        <section className="w-full py-12 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-light text-gray-900">
                Catálogo de Empresas
              </h1>
              <p className="text-lg font-light text-gray-600">
                Selecciona las empresas que necesitas
              </p>
            </div>
          </div>
        </section>

        {/* Búsqueda y filtros minimalistas */}
        <section className="w-full py-8 bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col gap-6">
              {/* Búsqueda principal */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Buscar empresa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="text-sm text-gray-500">
                  {isLoading ? "Cargando..." : `${filteredProducts.length} empresas`}
                </div>
              </div>

              {/* Filtros simples */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="todos">Todos los sectores</option>
                  {sectores.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYearRange}
                  onChange={(e) => setSelectedYearRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="todos">Todos los años</option>
                  {yearRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="company">Empresa A-Z</option>
                  <option value="sector">Sector</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Catálogo con wow factor */}
        <section className="w-full py-12 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading && Array.from({ length: 9 }).map((_, i) => (
                <div key={`s-${i}`} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
              
              {!isLoading && filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sin resultados</h3>
                  <p className="text-gray-600 mb-6">
                    No encontramos empresas con esos criterios
                  </p>
                  <button
                    onClick={() => { setSearchTerm(""); setSelectedSector("todos"); setSelectedYearRange("todos"); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
              
              {!isLoading && filteredProducts.length > 0 && (
                filteredProducts.map((product, index) => (
                  <div key={product.id} className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all bg-white">
                    
                    {/* Badge inteligente de popularidad */}
                    {isEmpresaPopular(product.companyName) && (
                      <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium mb-4">
                        Popular
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                        {product.companyName}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                          {product.sector}
                        </span>
                        <span className="px-3 py-1 text-xs bg-gray-50 text-gray-700 rounded-full border border-gray-200">
                          {product.yearRange}
                        </span>
                        <span className="px-3 py-1 text-xs bg-green-50 text-emerald-700 rounded-full border border-emerald-200">
                          {product.isQuarterly ? 'Trimestral' : 'Anual'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {product.description}
                      </p>

                      {/* Beneficios limpios */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>Datos oficiales CMF</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>Formato Excel</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                          <span>3 estados financieros</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.isQuarterly ? 'Estados Trimestrales' : 'Estados Anuales'}
                            </div>
                            <div className="text-xs text-gray-600">
                              Balance + Resultados + Flujos
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-medium text-gray-900">
                              {formatClp(Number(product.price || 0))}
                            </div>
                            <div className="text-xs text-gray-500">
                              Por empresa
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => addToCartOptimized(product)}
                          className={`flex-1 px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-medium ${
                            addedToCartId === product.id 
                              ? 'bg-green-600 text-white' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {addedToCartId === product.id ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Agregado</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" />
                              <span>Agregar al carrito</span>
                            </>
                          )}
                        </button>
                        <DownloadButton
                          productId={product.id}
                          userEmail={userEmail}
                          className="px-4 py-3 border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                        />
                      </div>
                      
                      {/* Línea de confianza simple */}
                      <div className="mt-3 text-center">
                        <div className="text-xs text-gray-500">
                          Datos verificados • Formato Excel • Entrega inmediata
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Sección de solicitud de empresas */}
        <section className="w-full py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <RequestCompany />
          </div>
        </section>
      </main>

      {/* Footer global ya incluido */}

      {/* Carrito Flotante */}
      {cart.length > 0 && (
    <div className="fixed bottom-4 right-4 z-50 mb-[env(safe-area-inset-bottom)] mr-[env(safe-area-inset-right)]">
          <Button
            onClick={() => {
              // Verificar si hay email, si no, pedirlo
              if (!userEmail || userEmail.trim() === '') {
                setShowEmailDialog(true)
                return
              }
              // Ir a página dedicada de carrito
              window.location.href = '/carrito'
            }}
      className="bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 shadow-lg rounded-full backdrop-blur-md px-4 py-2 md:px-6 md:py-3"
          >
            <ShoppingCart className="h-5 w-5 mr-2 text-blue-700" />
            <span className="sm:hidden font-semibold">{cart.length} · {formatClp(totalCart)}</span>
            <span className="hidden sm:inline font-semibold">{cart.length} archivo(s) · {formatClp(totalCart)} · Ver carrito y pagar</span>
          </Button>
        </div>
      )}

      {/* Modal centrado del carrito */}
      <Dialog open={isCartDialogOpen} onOpenChange={setIsCartDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tu Carrito</DialogTitle>
            <DialogDescription>
              {cart.length === 0 ? "Tu carrito está vacío" : `${cart.length} archivo(s) seleccionado(s)`}
            </DialogDescription>
          </DialogHeader>

          {cart.length > 0 ? (
            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-2">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-slate-800">{item.companyName}</p>
                      <p className="text-xs text-slate-500">{item.yearRange} • {item.sector}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="font-semibold text-sm">{formatClp(Number(item.price || 0))}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        aria-label="Eliminar del carrito"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="flex justify-between items-center font-semibold text-sm text-slate-800">
                  <span>Total:</span>
                  <span>{formatClp(totalClp)}</span>
                </div>
                <p className="text-xs text-slate-500 text-right">Compra 100% segura con Transbank</p>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={async () => {
                  if (cart.length === 0) return
                  if (!userEmail || userEmail.trim() === '') {
                    setShowEmailDialog(true)
                    return
                  }
                  try {
                    await initiatePayment({
                      productIds: cart.map(c => c.productId),
                      customerEmail: userEmail,
                      customerName: "Usuario",
                    })
                  } catch (e) {}
                }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Pagar con WebPay
              </Button>
              <p className="text-xs text-slate-500 text-center">Entrega inmediata por email</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Agrega archivos a tu carrito para comenzar</p>
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
                onKeyPress={(e) => e.key === 'Enter' && saveUserEmail(e.currentTarget.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const emailInput = document.getElementById('email') as HTMLInputElement
                  if (emailInput && emailInput.value) {
                    saveUserEmail(emailInput.value)
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
    </div>
  )
}
