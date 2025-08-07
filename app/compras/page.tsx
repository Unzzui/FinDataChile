'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Download, Search, Package, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

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
  const [loading, setLoading] = useState(false)
  const [downloadingAll, setDownloadingAll] = useState(false)
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

  const handleSearchWithEmail = async (userEmail: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user/purchases?userEmail=${encodeURIComponent(userEmail)}`)
      const data = await response.json()
      
      if (data.success) {
        setPurchases(data.purchases)
        if (data.purchases.length === 0) {
          toast({
            title: "Sin compras",
            description: "No se encontraron compras para este email"
          })
        }
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

  const handleSearch = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu email",
        variant: "destructive"
      })
      return
    }

    await handleSearchWithEmail(email)
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
        description: "No se pudo descargar el archivo",
        variant: "destructive"
      })
    }
  }

  const handleDownloadAll = async () => {
    if (purchases.length === 0) {
      toast({
        title: "No hay archivos",
        description: "No hay archivos para descargar",
        variant: "destructive"
      })
      return
    }

    setDownloadingAll(true)
    toast({
      title: "Generando archivo ZIP",
      description: `Preparando ${purchases.length} archivo(s)...`
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
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver al inicio</span>
              <span className="sm:hidden">Volver</span>
            </Button>
            <div></div> {/* Spacer */}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Mis Compras</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Ingresa tu email para ver tus compras y descargar archivos
          </p>
        </div>

        <Card className="mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Search className="h-4 w-4 md:h-5 md:w-5" />
              Buscar Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="min-w-[120px] text-sm"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="ml-2">
                    {loading ? 'Buscando...' : 'Buscar'}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {purchases.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold">
                Compras encontradas ({purchases.length})
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Total: ${purchases.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                </Badge>
                <Button
                  onClick={handleDownloadAll}
                  className="bg-green-600 hover:bg-green-700 text-xs"
                  size="sm"
                  disabled={downloadingAll}
                >
                  {downloadingAll ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  ) : (
                    <Download className="h-3 w-3 mr-1" />
                  )}
                  <span className="ml-1">
                    {downloadingAll ? 'Generando...' : 'Descargar ZIP'}
                  </span>
                </Button>
              </div>
            </div>

            {purchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-base md:text-lg truncate">{purchase.company_name}</h3>
                        <Badge variant={purchase.status === 'completed' ? 'default' : 'secondary'} className="text-xs w-fit">
                          {purchase.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-1 text-sm">
                        {purchase.sector} • {purchase.year_range}
                      </p>
                      {purchase.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {purchase.description}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <span>Precio: ${purchase.price.toLocaleString()}</span>
                        <span>
                          Comprado: {new Date(purchase.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => handleDownload(purchase.product_id, purchase.company_name)}
                        variant="outline"
                        size="sm"
                        className="text-xs flex-1 sm:flex-none"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Descargar</span>
                        <span className="sm:hidden">Desc</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {purchases.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No hay compras</h3>
              <p className="text-muted-foreground">
                Ingresa tu email para buscar tus compras o realiza una nueva compra
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 