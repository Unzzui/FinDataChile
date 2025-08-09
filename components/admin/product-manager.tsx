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
import { Plus, Edit, Trash2, Save, X, Loader2, Package, TrendingUp, DollarSign, Calendar, Building, Filter, Search, BarChart3, Grid3X3, List, CheckSquare, Square } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
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
          setFilteredProducts(transformedProducts)
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

  // Efecto para filtrar productos
  useEffect(() => {
    let filtered = productList

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por sector
    if (selectedSector !== 'all') {
      filtered = filtered.filter(product => product.sector === selectedSector)
    }

    // Filtrar por estado
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(product => 
        selectedStatus === 'active' ? product.isActive : !product.isActive
      )
    }

    setFilteredProducts(filtered)
  }, [productList, searchTerm, selectedSector, selectedStatus])

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
  price: 2000,
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
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProductList(prev => prev.filter(p => p.id !== productId))
        setSelectedProducts(prev => prev.filter(id => id !== productId)) // También remover de seleccionados
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

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    const filteredProductIds = filteredProducts.map(p => p.id)
    const selectedFilteredProducts = selectedProducts.filter(id => filteredProductIds.includes(id))
    
    if (selectedFilteredProducts.length === filteredProducts.length) {
      // Si todos los productos filtrados están seleccionados, deseleccionar solo los filtrados
      setSelectedProducts(prev => prev.filter(id => !filteredProductIds.includes(id)))
    } else {
      // Si no todos están seleccionados, seleccionar todos los filtrados
      setSelectedProducts(prev => {
        const newSelected = [...prev]
        filteredProductIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id)
          }
        })
        return newSelected
      })
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return

    try {
      const deletePromises = selectedProducts.map(async (productId) => {
        const response = await fetch(`/api/admin/products/${productId}`, { 
          method: 'DELETE' 
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Error eliminando producto ${productId}: ${errorData.error || 'Error desconocido'}`)
        }
        
        return response.json()
      })
      
      await Promise.all(deletePromises)
      
      setProductList(prev => prev.filter(p => !selectedProducts.includes(p.id)))
      setSelectedProducts([])
      
      toast({
        title: "Éxito",
        description: `${selectedProducts.length} productos eliminados correctamente`
      })
    } catch (error) {
      console.error('Error eliminando productos:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron eliminar algunos productos",
        variant: "destructive"
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setIsAddingProduct(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white border-b border-slate-200/60 -mx-6 -mt-6 px-6 pt-6 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Gestión de Productos
              </h1>
              <p className="text-lg text-slate-600">
                Administra el catálogo completo de productos financieros
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-slate-700">{filteredProducts.length} productos</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium text-slate-700">{filteredProducts.filter(p => p.isActive).length} activos</span>
                </div>
                {selectedProducts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-slate-700">{selectedProducts.length} seleccionados</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Delete Selected Button */}
              {selectedProducts.length > 0 && (
                <Button
                  onClick={handleDeleteSelected}
                  variant="destructive"
                  className="h-11"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar ({selectedProducts.length})
                </Button>
              )}

              <Button 
                onClick={handleAddProduct} 
                className="h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Buscar productos</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por empresa, sector o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-slate-200 bg-white shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Sector</Label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="border-slate-200 bg-white shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los sectores</SelectItem>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Estado</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="border-slate-200 bg-white shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Estadísticas</Label>
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    {Math.round((filteredProducts.filter(p => p.isActive).length / Math.max(filteredProducts.length, 1)) * 100)}% activos
                  </span>
                </div>
              </div>
            </div>
            
            {/* Select All Checkbox */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={(() => {
                      const filteredProductIds = filteredProducts.map(p => p.id)
                      const selectedFilteredProducts = selectedProducts.filter(id => filteredProductIds.includes(id))
                      return selectedFilteredProducts.length === filteredProducts.length && filteredProducts.length > 0
                    })()}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm font-medium text-slate-700">
                    Seleccionar todos ({filteredProducts.length} productos)
                  </Label>
                </div>
                {selectedProducts.length > 0 && (
                  <span className="text-sm text-slate-600">
                    {(() => {
                      const filteredProductIds = filteredProducts.map(p => p.id)
                      const selectedFilteredProducts = selectedProducts.filter(id => filteredProductIds.includes(id))
                      return `${selectedFilteredProducts.length} de ${filteredProducts.length} seleccionados (${selectedProducts.length} total)`
                    })()}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulario de edición */}
        {editingProduct && (
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  {isAddingProduct ? "Agregar Producto" : "Editar Producto"}
                </div>
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
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Empresa</Label>
                    <Input
                      value={editingProduct.companyName}
                      onChange={(e) => setEditingProduct({ ...editingProduct, companyName: e.target.value })}
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                  <div>
                    <Label>Sector</Label>
                    <Select 
                      value={editingProduct.sector} 
                      onValueChange={(value) => setEditingProduct({ ...editingProduct, sector: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="Descripción del producto"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Año Inicio</Label>
                      <Input
                        type="number"
                        value={editingProduct.startYear}
                        onChange={(e) => setEditingProduct({ ...editingProduct, startYear: parseInt(e.target.value) || 2024 })}
                      />
                    </div>
                    <div>
                      <Label>Año Fin</Label>
                      <Input
                        type="number"
                        value={editingProduct.endYear}
                        onChange={(e) => setEditingProduct({ ...editingProduct, endYear: parseInt(e.target.value) || 2024 })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Precio (CLP)</Label>
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label>Ruta del Archivo</Label>
                    <Input
                      value={editingProduct.filePath}
                      onChange={(e) => setEditingProduct({ ...editingProduct, filePath: e.target.value })}
                      placeholder="storage/uploads/..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editingProduct.isActive}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                    />
                    <Label htmlFor="isActive">Producto activo</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de productos mejorada */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}`}>
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/30 ${
                selectedProducts.includes(product.id) ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              <CardContent className={viewMode === 'grid' ? 'p-6' : 'p-4'}>
                <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'items-start justify-between'}`}>
                  {/* Checkbox de selección */}
                  <div className={`flex items-start gap-3 ${viewMode === 'grid' ? 'mb-4' : 'flex-1'}`}>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleSelectProduct(product.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      {viewMode === 'grid' ? (
                        /* Vista Grid */
                        <>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                              <Building className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{product.companyName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                <span className="text-sm text-slate-600">{product.yearRange}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant={product.isActive ? "default" : "secondary"} className="font-medium">
                              {product.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                              {product.sector}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">{product.description}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-emerald-500" />
                              <span className="font-semibold text-slate-700">
                                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(product.price || 0))}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-slate-500" />
                              <span className="text-slate-600 truncate">{product.filePath || 'Sin archivo'}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Vista Lista */
                        <>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-1.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                              <Building className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">{product.companyName}</h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-slate-500" />
                                  {product.yearRange}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-emerald-500" />
                                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(product.price || 0))}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={product.isActive ? "default" : "secondary"} className="font-medium text-xs">
                              {product.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 text-xs">
                              {product.sector}
                            </Badge>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-1">{product.description}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className={`flex gap-2 ${viewMode === 'grid' ? 'mt-4 justify-end' : 'ml-6'}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditProduct(product)}
                      className="hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Package className="h-8 w-8 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay productos disponibles</h3>
                    <p className="text-slate-600 mb-4">
                      {searchTerm || selectedSector !== 'all' || selectedStatus !== 'all' 
                        ? 'No se encontraron productos que coincidan con los filtros aplicados.'
                        : 'Aún no hay productos en el catálogo.'
                      }
                    </p>
                    {(searchTerm || selectedSector !== 'all' || selectedStatus !== 'all') && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedSector('all')
                          setSelectedStatus('all')
                        }}
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 