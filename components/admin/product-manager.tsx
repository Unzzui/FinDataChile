"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Save, X, Loader2 } from "lucide-react"

interface Product {
  id: string;
  companyId: number;
  companyName: string;
  sector: string;
  yearRange: string;
  startYear: number;
  endYear: number;
  price: number;
  filePath: string;
  description: string;
  isActive: boolean;
  isQuarterly: boolean;
  createdAt: string;
  updatedAt: string;
}

export function ProductManager() {
  const [productList, setProductList] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const { toast } = useToast()

  // Cargar productos desde la API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/admin/products')
        if (response.ok) {
          const products = await response.json()
          // Transformar productos para incluir isQuarterly
          const transformedProducts = products.map((product: any) => ({
            id: product.id,
            companyId: product.company_id,
            companyName: product.company_name,
            sector: product.sector,
            yearRange: product.year_range,
            startYear: product.start_year,
            endYear: product.end_year,
            price: product.price,
            filePath: product.file_path,
            description: product.description,
            isActive: Boolean(product.is_active),
            isQuarterly: product.description.toLowerCase().includes('trimestral'),
            createdAt: product.created_at,
            updatedAt: product.updated_at
          }))
          setProductList(transformedProducts)
        } else {
          console.error('Error cargando productos:', response.status)
        }
      } catch (error) {
        console.error('Error cargando productos:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  const sectors = ['Bancario', 'Retail', 'Minería', 'Energía', 'Telecomunicaciones', 'AFP', 'Salud', 'Transporte', 'Consumo', 'Inmobiliario']

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `product-${Math.random().toString(36).substr(2, 9)}`,
      companyId: 0,
      companyName: '',
      sector: '',
      yearRange: '',
      startYear: 2024,
      endYear: 2024,
      price: 2,
      filePath: '',
      description: '',
      isActive: true,
      isQuarterly: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setEditingProduct(newProduct)
    setIsAddingProduct(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product })
    setIsAddingProduct(false)
  }

  const handleSaveProduct = async () => {
    if (!editingProduct) return

    try {
      if (isAddingProduct) {
        // Crear nuevo producto
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyName: editingProduct.companyName,
            sector: editingProduct.sector,
            yearRange: editingProduct.yearRange,
            startYear: editingProduct.startYear,
            endYear: editingProduct.endYear,
            price: editingProduct.price,
            filePath: editingProduct.filePath,
            description: editingProduct.description,
            isActive: editingProduct.isActive,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          // Recargar productos para obtener el ID generado
          const productsResponse = await fetch('/api/admin/products')
          if (productsResponse.ok) {
            const products = await productsResponse.json()
            setProductList(products)
          }
          toast({
            title: "Producto agregado",
            description: "El producto ha sido agregado exitosamente",
          })
        } else {
          const errorData = await response.json()
          toast({
            title: "Error",
            description: errorData.error || "No se pudo agregar el producto",
            variant: "destructive"
          })
          return
        }
      } else {
        // Actualizar producto existente
        const response = await fetch('/api/admin/products/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingProduct.id,
            companyName: editingProduct.companyName,
            sector: editingProduct.sector,
            yearRange: editingProduct.yearRange,
            startYear: editingProduct.startYear,
            endYear: editingProduct.endYear,
            price: editingProduct.price,
            filePath: editingProduct.filePath,
            description: editingProduct.description,
            isActive: editingProduct.isActive,
          }),
        })

        if (response.ok) {
          // Recargar productos para obtener los datos actualizados
          const productsResponse = await fetch('/api/admin/products')
          if (productsResponse.ok) {
            const products = await productsResponse.json()
            const transformedProducts = products.map((product: any) => ({
              id: product.id,
              companyId: product.company_id,
              companyName: product.company_name,
              sector: product.sector,
              yearRange: product.year_range,
              startYear: product.start_year,
              endYear: product.end_year,
              price: product.price,
              filePath: product.file_path,
              description: product.description,
              isActive: Boolean(product.is_active),
              isQuarterly: product.description.toLowerCase().includes('trimestral'),
              createdAt: product.created_at,
              updatedAt: product.updated_at
            }))
            setProductList(transformedProducts)
          }
          toast({
            title: "Producto actualizado",
            description: "El producto ha sido actualizado exitosamente",
          })
        } else {
          const errorData = await response.json()
          toast({
            title: "Error",
            description: errorData.error || "No se pudo actualizar el producto",
            variant: "destructive"
          })
          return
        }
      }

      setEditingProduct(null)
      setIsAddingProduct(false)
    } catch (error) {
      console.error('Error guardando producto:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive"
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProductList(prev => prev.filter(p => p.id !== productId))
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido eliminado exitosamente",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "No se pudo eliminar el producto",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error eliminando producto:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive"
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setIsAddingProduct(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Administración de Productos</h2>
        <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Formulario de edición */}
      {editingProduct && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {isAddingProduct ? "Agregar Producto" : "Editar Producto"}
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveProduct} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Guardar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Nombre de Empresa</Label>
                <Input
                  id="companyName"
                  value={editingProduct.companyName}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, companyName: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="sector">Sector</Label>
                <Select value={editingProduct.sector} onValueChange={(value: string) => setEditingProduct(prev => prev ? { ...prev, sector: value } : null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startYear">Año Inicio</Label>
                <Input
                  id="startYear"
                  type="number"
                  value={editingProduct.startYear}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, startYear: parseInt(e.target.value) } : null)}
                />
              </div>
              <div>
                <Label htmlFor="endYear">Año Fin</Label>
                <Input
                  id="endYear"
                  type="number"
                  value={editingProduct.endYear}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, endYear: parseInt(e.target.value) } : null)}
                />
              </div>
              <div>
                <Label htmlFor="price">Precio (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                />
              </div>
              <div>
                <Label htmlFor="filePath">Ruta del Archivo</Label>
                <Input
                  id="filePath"
                  value={editingProduct.filePath}
                  onChange={(e) => setEditingProduct(prev => prev ? { ...prev, filePath: e.target.value } : null)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
              />
            </div>
            <div className="flex items-center space-x-2">
                              <Switch
                  id="isActive"
                  checked={editingProduct.isActive}
                  onCheckedChange={(checked: boolean) => setEditingProduct(prev => prev ? { ...prev, isActive: checked } : null)}
                />
              <Label htmlFor="isActive">Producto Activo</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de productos */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Cargando productos...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {productList.map((product) => (
            <Card key={product.id} className={!product.isActive ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{product.companyName}</h3>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge variant="outline">{product.sector}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Rango: {product.yearRange}</span>
                      <span>Precio: ${product.price} USD</span>
                      <span>Archivo: {product.filePath}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {productList.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay productos disponibles</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 