'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Trash2, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Purchase {
  id: number
  user_email: string
  product_id: string
  company_name: string
  sector: string
  description: string
  price: number
  status: string
  created_at: string
}

interface Product {
  id: string
  company_name: string
  sector: string
  description: string
  price: number
}

export default function PurchaseManager() {
  const [email, setEmail] = useState('')
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [allPurchases, setAllPurchases] = useState<Purchase[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPurchase, setNewPurchase] = useState({ userEmail: '', productId: '' })
  const { toast } = useToast()

  // Cargar productos
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error cargando productos:', error)
    }
  }

  const handleSearch = async () => {
    if (!email.trim()) {
      // Si no hay email, cargar todas las compras
      await loadAllPurchases()
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/purchases?userEmail=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.success) {
        setPurchases(data.purchases)
        setAllPurchases([])
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al buscar compras",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error buscando compras:', error)
      toast({
        title: "Error",
        description: "No se pudo buscar las compras",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAllPurchases = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/purchases')
      const data = await response.json()
      
      if (data.success) {
        setAllPurchases(data.purchases)
        setPurchases([])
      }
    } catch (error) {
      console.error('Error cargando todas las compras:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePurchase = async (purchaseId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta compra?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/purchases?purchaseId=${purchaseId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Compra eliminada",
          description: "La compra ha sido eliminada exitosamente"
        })
        // Recargar compras
        if (email.trim()) {
          handleSearch()
        } else {
          loadAllPurchases()
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al eliminar la compra",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error eliminando compra:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la compra",
        variant: "destructive"
      })
    }
  }

  const handleAddPurchase = async () => {
    if (!newPurchase.userEmail || !newPurchase.productId) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/admin/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPurchase)
      })
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Compra agregada",
          description: "La compra ha sido agregada exitosamente"
        })
        setNewPurchase({ userEmail: '', productId: '' })
        setShowAddForm(false)
        // Recargar compras
        if (email.trim()) {
          handleSearch()
        } else {
          loadAllPurchases()
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Error al agregar la compra",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error agregando compra:', error)
      toast({
        title: "Error",
        description: "No se pudo agregar la compra",
        variant: "destructive"
      })
    }
  }

  const handleDownload = async (productId: string, companyName: string) => {
    try {
      const response = await fetch('/api/download-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId,
          userEmail: 'admin' // Para descargas administrativas
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${companyName}_EEFF.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Descarga exitosa",
          description: "El archivo se descargó correctamente"
        })
      } else {
        toast({
          title: "Error en la descarga",
          description: "No se pudo descargar el archivo",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error descargando archivo:', error)
      toast({
        title: "Error en la descarga",
        description: "Hubo un problema al descargar el archivo",
        variant: "destructive"
      })
    }
  }

  const displayPurchases = email.trim() ? purchases : allPurchases

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Gestión de Compras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email">Email del usuario</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa el email o deja vacío para ver todas"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEmail('')
                  loadAllPurchases()
                }}
              >
                Ver Todas
              </Button>
            </div>
          </div>

          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Compra Manual
          </Button>

          {showAddForm && (
            <Card className="border-2">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newEmail">Email del usuario</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      value={newPurchase.userEmail}
                      onChange={(e) => setNewPurchase({...newPurchase, userEmail: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newProduct">Producto</Label>
                    <Select 
                      value={newPurchase.productId} 
                      onValueChange={(value: string) => setNewPurchase({...newPurchase, productId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.company_name} - {product.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddPurchase}>
                    Agregar Compra
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false)
                      setNewPurchase({ userEmail: '', productId: '' })
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Compras {email.trim() ? `de ${email}` : 'Totales'} ({displayPurchases.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayPurchases.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {loading ? 'Cargando...' : 'No se encontraron compras'}
            </p>
          ) : (
            <div className="space-y-4">
              {displayPurchases.map((purchase) => (
                <div key={purchase.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{purchase.company_name}</span>
                        <Badge variant="secondary">{purchase.sector}</Badge>
                        <Badge variant="outline">
                          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(purchase.price || 0))}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{purchase.description}</p>
                      <p className="text-sm text-gray-500">
                        Comprado por: {purchase.user_email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(purchase.created_at).toLocaleString('es-CL')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(purchase.product_id, purchase.company_name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePurchase(purchase.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 