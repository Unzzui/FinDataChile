"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  FileSpreadsheet,
  Search,
  ShoppingCart,
  X,
  CreditCard,
  Building2,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  Download,
  User,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { usePayment } from "@/hooks/use-payment"
import { RequestCompany } from "@/components/request-company"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { CartManager } from "@/components/cart/cart-manager"
import { DownloadButton } from "@/components/download-button"
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

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("todos")
  const [selectedYearRange, setSelectedYearRange] = useState("todos")
  const [sortBy, setSortBy] = useState("relevance")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [showEmailDialog, setShowEmailDialog] = useState(false)

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
        toast({
          title: "Agregado al carrito",
          description: `${product.companyName} agregado correctamente`,
        })
      }
    } catch (error) {
      console.error('Error agregando al carrito:', error)
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



  const totalCart = cart.reduce((sum, item) => sum + item.price, 0)

  const getSectorColor = (sector: string) => {
    const colors: { [key: string]: string } = {
      Bancario: "bg-blue-100 text-blue-800",
      Retail: "bg-purple-100 text-purple-800",
      Minería: "bg-orange-100 text-orange-800",
      Energía: "bg-green-100 text-green-800",
      Telecomunicaciones: "bg-cyan-100 text-cyan-800",
      AFP: "bg-indigo-100 text-indigo-800",
      Salud: "bg-red-100 text-red-800",
      Transporte: "bg-yellow-100 text-yellow-800",
      Consumo: "bg-pink-100 text-pink-800",
      Inmobiliario: "bg-teal-100 text-teal-800",
    }
    return colors[sector] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Cart en navbar: ahora gestionado por SiteHeader -> CartWidget */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                Estados Financieros Históricos
                <span className="text-green-600 block mt-1">Datos Reales de la CMF</span>
              </h1>
              <p className="text-lg text-gray-700">
                Ahorra horas. Descarga al instante. Archivos Excel listos para analizar.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Datos reales CMF</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  <span>Descarga instantánea</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Actualizaciones regulares</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros y Búsqueda */}
        <section className="w-full py-4 md:py-8 bg-white border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col gap-4">
              {/* Búsqueda principal */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar empresa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>

                <div className="text-sm text-gray-500 text-center sm:text-left">
                  {isLoading ? "Cargando productos..." : `${filteredProducts.length} producto(s) encontrado(s)`}
                </div>
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="text-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los sectores</SelectItem>
                    {sectores.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYearRange} onValueChange={setSelectedYearRange}>
                  <SelectTrigger className="text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Años" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los años</SelectItem>
                    {yearRanges.map((yearRange) => (
                      <SelectItem key={yearRange} value={yearRange}>
                        {yearRange}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevancia</SelectItem>
                    <SelectItem value="name">Nombre (A-Z)</SelectItem>
                    <SelectItem value="priceLow">Precio (menor a mayor)</SelectItem>
                    <SelectItem value="priceHigh">Precio (mayor a menor)</SelectItem>
                    <SelectItem value="yearNew">Año más reciente</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedSector("todos")
                    setSelectedYearRange("todos")
                  }}
                  className="flex items-center gap-2 text-sm"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Limpiar</span>
                  <span className="sm:hidden">Reset</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Catálogo de Productos */}
        <section className="w-full py-8 md:py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando productos...</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-all border-2 hover:border-green-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base md:text-lg flex items-center gap-2">
                            <Building2 className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                            <span className="truncate">{product.companyName}</span>
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-2">
                            <Badge className={`text-xs ${getSectorColor(product.sector)}`}>{product.sector}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {product.yearRange}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${product.isQuarterly ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                              {product.isQuarterly ? 'Trimestral' : 'Anual'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-3 bg-white">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {product.isQuarterly ? 'Estados Trimestrales' : 'Estados Anuales'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Balance + Resultados + Flujos</p>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="font-extrabold text-green-700 text-base md:text-lg">${Number(product.price).toFixed(2)} USD</span>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => addToCartOptimized(product)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-8"
                              >
                                <span className="hidden sm:inline">Agregar al carrito</span>
                                <span className="sm:hidden">+</span>
                              </Button>
                              <DownloadButton
                                productId={product.id}
                                userEmail={userEmail}
                                size="sm"
                                className="text-xs px-3 py-1 h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center pt-2 border-t text-xs text-gray-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Datos oficiales de la CMF
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Sección de solicitud de empresas */}
            <div className="mt-8 md:mt-12">
              <RequestCompany />
            </div>
          </div>
        </section>
      </main>

      {/* Footer global ya incluido */}

      {/* Carrito Flotante */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => {
              // Verificar si hay email, si no, pedirlo
              if (!userEmail || userEmail.trim() === '') {
                setShowEmailDialog(true)
                return
              }
              setIsCheckoutOpen(true)
            }}
            className="bg-green-600 hover:bg-green-700 shadow-lg"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {cart.length} archivo(s) - ${totalCart} USD
          </Button>
        </div>
      )}



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
