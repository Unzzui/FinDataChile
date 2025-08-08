'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Download, Search, Package, ArrowLeft, LayoutGrid, List as ListIcon, Building, Calendar, DollarSign, FileSpreadsheet, Clock, Filter, TrendingUp, Archive, User, Mail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Purchase {
  id: number
  product_id: string
  company_name: string
  sector: string
  year_range: string
  price: number
  description: string
  status: string
  created_at: string
}

export default function ComprasPage() {
  const [email, setEmail] = useState('')
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadingAll, setDownloadingAll] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const pageSize = 12
  const { toast } = useToast()
  const router = useRouter()

  // Cargar email automáticamente desde localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      // Buscar compras automáticamente
      handleSearchWithEmail(savedEmail)
    }
  }, [])

  // Filtrar compras cuando cambien los filtros
  useEffect(() => {
    let filtered = purchases

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(purchase => 
        purchase.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por sector
    if (selectedSector !== 'all') {
      filtered = filtered.filter(purchase => purchase.sector === selectedSector)
    }

    // Filtrar por estado
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(purchase => purchase.status === selectedStatus)
    }

    setFilteredPurchases(filtered)
  }, [purchases, searchTerm, selectedSector, selectedStatus])

  // Obtener sectores únicos
  const sectors = [...new Set(purchases.map(p => p.sector))].filter(Boolean)

  const handleSearchWithEmail = async (searchEmail: string) => {
    if (!searchEmail.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu email",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/user/purchases?userEmail=${encodeURIComponent(searchEmail)}`)
      
      if (!response.ok) {
        throw new Error('Error al buscar compras')
      }

      const data = await response.json()
      
      if (data.success) {
        setPurchases(data.purchases || [])
        localStorage.setItem('userEmail', searchEmail)
        toast({
          title: "Compras encontradas",
          description: `Se encontraron ${data.purchases?.length || 0} compras`,
        })
      } else {
        setPurchases([])
        toast({
          title: "Sin compras",
          description: "No se encontraron compras para este email",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Error al buscar las compras",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    handleSearchWithEmail(email)
  }

  const handleDownload = async (productId: string, companyName: string) => {
    try {
      setDownloadingId(productId)
      toast({ title: 'Preparando descarga...', description: companyName })
      const response = await fetch('/api/download-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId,
          userEmail: email 
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
        throw new Error('Error en la descarga')
      }
    } catch (error) {
      console.error('Error descargando:', error)
      toast({
        title: "Error",
        description: "Hubo un problema durante la descarga",
        variant: "destructive"
      })
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDownloadAll = async () => {
    if (purchases.length === 0) {
      toast({
        title: "Sin archivos",
        description: "No hay compras para descargar",
        variant: "destructive"
      })
      return
    }

    setDownloadingAll(true)
    toast({
      title: "Iniciando descarga masiva",
      description: "Preparando ZIP con todos los archivos..."
    })

    try {
      const response = await fetch('/api/user/download-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userEmail: email 
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        
        // Obtener el nombre del archivo desde los headers
        const contentDisposition = response.headers.get('content-disposition')
        const fileName = contentDisposition 
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') 
          : `FinData_Chile_${email}_${new Date().toISOString().split('T')[0]}.zip`
        
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Descarga completada",
          description: `Se descargó el archivo ZIP con ${purchases.length} archivo(s)`
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error en la descarga')
      }
    } catch (error) {
      console.error('Error en descarga masiva:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema durante la descarga",
        variant: "destructive"
      })
    } finally {
      setDownloadingAll(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header simple */}
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-8 text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </Button>
          
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Mis Compras
          </h1>
          <p className="text-gray-600">
            Administra tus documentos financieros
          </p>
        </div>

        {/* Buscador minimalista */}
        <div className="mb-10">
          <div className="max-w-md">
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="px-6 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? '...' : 'Buscar'}
              </Button>
            </div>
          </div>
        </div>

        {/* Estadísticas simples */}
        {purchases.length > 0 && (
          <div className="flex gap-8 mb-10 pb-6 border-b border-gray-200">
            <div>
              <div className="text-2xl font-light text-gray-900">{purchases.length}</div>
              <div className="text-sm text-gray-600">Compras</div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-900">
                ${purchases.reduce((sum, p) => sum + Number(p.price || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-2xl font-light text-gray-900">
                {purchases.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Disponibles</div>
            </div>
          </div>
        )}

        {/* Filtros simples */}
        {purchases.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Buscar empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-64"
                />
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Todos los sectores</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
                <Button
                  onClick={handleDownloadAll}
                  disabled={downloadingAll}
                  className="ml-4 bg-blue-600 text-white hover:bg-blue-700"
                >
                  {downloadingAll ? 'Generando...' : 'Descargar Todo'}
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-8">
              {filteredPurchases.length} de {purchases.length} compras
            </p>

            {/* Lista simple */}
            {(() => {
              const pageCount = Math.max(1, Math.ceil(filteredPurchases.length / pageSize))
              const start = (currentPage - 1) * pageSize
              const end = start + pageSize
              const pageItems = filteredPurchases.slice(start, end)

              return (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pageItems.map((purchase) => (
                        <div key={purchase.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-medium text-gray-900 text-lg">
                              {purchase.company_name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded ${
                              purchase.status === 'completed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {purchase.status === 'completed' ? 'Disponible' : 'Pendiente'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <div>{purchase.sector}</div>
                            <div>{purchase.year_range}</div>
                            <div className="font-medium text-gray-900">${purchase.price.toLocaleString()}</div>
                            <div className="text-xs">{new Date(purchase.created_at).toLocaleDateString()}</div>
                          </div>

                          <button
                            onClick={() => handleDownload(purchase.product_id, purchase.company_name)}
                            disabled={downloadingId === purchase.product_id}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                          >
                            {downloadingId === purchase.product_id ? 'Descargando...' : 'Descargar'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pageItems.map((purchase) => (
                        <div key={purchase.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium text-gray-900 text-lg">
                                  {purchase.company_name}
                                </h3>
                                <span className={`px-2 py-1 text-xs rounded ${
                                  purchase.status === 'completed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {purchase.status === 'completed' ? 'Disponible' : 'Pendiente'}
                                </span>
                              </div>
                              <div className="flex gap-6 text-sm text-gray-600">
                                <span>{purchase.sector}</span>
                                <span>{purchase.year_range}</span>
                                <span className="font-medium text-gray-900">${purchase.price.toLocaleString()}</span>
                                <span className="text-xs">{new Date(purchase.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDownload(purchase.product_id, purchase.company_name)}
                              disabled={downloadingId === purchase.product_id}
                              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                              {downloadingId === purchase.product_id ? 'Descargando...' : 'Descargar'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Paginación simple */}
                  {filteredPurchases.length > pageSize && (
                    <div className="flex items-center justify-center gap-4 mt-10">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        ← Anterior
                      </button>
                      <span className="text-sm text-gray-600">
                        {currentPage} de {pageCount}
                      </span>
                      <button
                        disabled={currentPage === pageCount}
                        onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}

        {/* Estado vacío simple */}
        {purchases.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay compras
            </h3>
            <p className="text-gray-600 mb-6">
              Ingresa tu email para buscar tus compras
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => router.push('/tienda')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Ir a la Tienda
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/perfil')}
                className="border-gray-300 hover:bg-gray-50"
              >
                Mi Perfil
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}