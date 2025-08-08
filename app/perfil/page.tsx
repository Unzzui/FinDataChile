"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User as UserIcon, ShoppingBag, ArrowLeft, Search, Download, Package, LayoutGrid, List as ListIcon, LogOut, ShieldCheck, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AuthUser { email: string; name?: string }
interface Purchase { id: number; product_id: string; created_at: string; company_name: string; sector: string; year_range: string; price: number; description?: string; status?: string }

export default function PerfilPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [emailLookup, setEmailLookup] = useState("")
  const [activeEmail, setActiveEmail] = useState("")
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [downloadingAll, setDownloadingAll] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const { toast } = useToast()
  const pageSize = 12

  const formatClp = (v: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v)
  const totalPurchasesClp = useMemo(() => purchases.reduce((sum, p) => sum + Number(p.price || 0), 0), [purchases])
  const purchaseCount = purchases.length
  const lastPurchaseDate = useMemo(() => {
    if (purchases.length === 0) return null
    const max = purchases.reduce((m, p) => (new Date(p.created_at).getTime() > new Date(m.created_at).getTime() ? p : m))
    return new Date(max.created_at)
  }, [purchases])

  useEffect(() => {
    const init = async () => {
      try {
        const r = await fetch('/api/auth/me')
        if (r.ok) {
          const data = await r.json()
          if (data?.authenticated) {
            const u = { email: data.user?.email as string, name: data.user?.name as string }
            setAuthUser(u)
            setActiveEmail(u.email)
            setEmailLookup(u.email)
          } else {
            // Redirigir a login si no está autenticado
            window.location.href = '/login'
          }
        }
      } catch {}
      setIsLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!activeEmail) { setPurchases([]); return }
      try {
        const resp = await fetch(`/api/user/purchases?userEmail=${encodeURIComponent(activeEmail)}`)
        if (resp.ok) {
          const data = await resp.json()
          setPurchases(data.purchases || [])
        }
      } catch (e) {
        toast({ title: 'Error', description: 'No se pudieron cargar las compras', variant: 'destructive' })
      }
    }
    load()
  }, [activeEmail])

  const earliestPurchaseDate = useMemo(() => {
    if (purchases.length === 0) return null
    const min = purchases.reduce((m, p) => (new Date(p.created_at).getTime() < new Date(m.created_at).getTime() ? p : m))
    return new Date(min.created_at)
  }, [purchases])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    window.location.href = '/'
  }

  const handleSearch = async () => {
    if (!emailLookup.trim()) {
      toast({ title: 'Email requerido', description: 'Ingresa tu email para buscar compras', variant: 'destructive' })
      return
    }
    setActiveEmail(emailLookup.trim())
  }

  const handleDownload = async (productId: string, companyName: string) => {
    try {
      setDownloadingId(productId)
      toast({ title: 'Preparando descarga...', description: companyName })
      const response = await fetch('/api/download-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userEmail: activeEmail }),
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
        toast({ title: 'Descarga exitosa', description: 'El archivo se descargó correctamente' })
      } else {
        throw new Error('Error en la descarga')
      }
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo descargar el archivo', variant: 'destructive' })
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDownloadAll = async () => {
    if (purchases.length === 0) {
      toast({ title: 'No hay archivos', description: 'No hay archivos para descargar', variant: 'destructive' })
      return
    }
    setDownloadingAll(true)
    toast({ title: 'Generando archivo ZIP', description: `Preparando ${purchases.length} archivo(s)...` })
    try {
      const response = await fetch('/api/user/download-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: activeEmail }),
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const contentDisposition = response.headers.get('content-disposition')
        const fileName = contentDisposition ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') : `FinData_Chile_${activeEmail}_${new Date().toISOString().split('T')[0]}.zip`
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast({ title: 'Descarga completada', description: `Se descargó el ZIP con ${purchases.length} archivo(s)` })
      } else {
        const err = await response.json()
        throw new Error(err.error || 'Error en la descarga')
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Hubo un problema durante la descarga', variant: 'destructive' })
    } finally {
      setDownloadingAll(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4 font-light rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gray-100 text-gray-600">{(authUser?.name || authUser?.email || '?').charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="text-2xl font-light text-gray-900 truncate">Mi Perfil</h1>
                  <p className="text-sm text-gray-600 truncate font-light">{authUser?.name || '—'} • {authUser?.email || '—'}</p>
                </div>
              </div>
              {authUser && (
                <Button onClick={handleLogout} variant="outline" className="text-gray-600 font-light rounded-lg border-gray-200 hover:bg-gray-50"> <LogOut className="h-4 w-4 mr-2" /> Cerrar Sesión </Button>
              )}
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                <p className="text-xs text-gray-500 font-light">Compras</p>
                <p className="text-lg font-light text-gray-900">{purchaseCount}</p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 border">
                <p className="text-xs text-gray-500">Total gastado</p>
                <p className="text-lg font-semibold text-gray-900">{formatClp(totalPurchasesClp)}</p>
              </div>
              <div className="rounded-lg bg-white/70 p-3 border">
                <p className="text-xs text-gray-500">Última compra</p>
                <p className="text-lg font-semibold text-gray-900">{lastPurchaseDate ? lastPurchaseDate.toLocaleDateString('es-CL') : '—'}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-[12px] text-gray-700">
              <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-green-600" /> Pago seguro Transbank</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-600" /> Datos oficiales CMF</span>
            </div>
          </div>
        </div>
        {/* Mis Compras (estilo unificado con /compras) */}
        <div className="space-y-6">

          {activeEmail && (() => {
            const pageCount = Math.max(1, Math.ceil(purchases.length / pageSize))
            const start = (currentPage - 1) * pageSize
            const end = start + pageSize
            const pageItems = purchases.slice(start, end)

            return (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h2 className="text-lg md:text-xl font-semibold">Compras encontradas ({purchases.length})</h2>
                  <div className="flex items-center gap-2">
                    <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} className="h-8 w-8" aria-label="Vista de tarjetas">
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} className="h-8 w-8" aria-label="Vista de lista">
                      <ListIcon className="h-4 w-4" />
                    </Button>
                    <Badge variant="secondary" className="text-xs">Total: {formatClp(totalPurchasesClp)}</Badge>
                    <Button onClick={handleDownloadAll} className="bg-green-600 hover:bg-green-700 text-xs" size="sm" disabled={downloadingAll}>
                      {downloadingAll ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" /> : <Download className="h-3 w-3 mr-1" />}
                      <span className="ml-1">{downloadingAll ? 'Generando...' : 'Descargar ZIP'}</span>
                    </Button>
                  </div>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pageItems.map((purchase) => (
                      <Card key={purchase.id}>
                        <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-base md:text-lg truncate flex-1">{purchase.company_name}</h3>
                              <Badge variant="secondary" className="text-xs w-fit">completado</Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">{purchase.sector} • {purchase.year_range}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Precio: {formatClp(Number(purchase.price || 0))}</span>
                              <span>Compra: {new Date(purchase.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-end">
                              <Button onClick={() => handleDownload(purchase.product_id, purchase.company_name)} variant="outline" size="sm" className="text-xs" disabled={downloadingId === purchase.product_id}>
                                {downloadingId === purchase.product_id ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" /> : <Download className="h-3 w-3 mr-1" />}
                                {downloadingId === purchase.product_id ? 'Preparando...' : 'Descargar'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pageItems.map((purchase) => (
                      <Card key={purchase.id}>
                        <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h3 className="font-semibold text-base md:text-lg truncate">{purchase.company_name}</h3>
                                <Badge variant="secondary" className="text-xs w-fit">completado</Badge>
                              </div>
                              <p className="text-muted-foreground mb-1 text-sm">{purchase.sector} • {purchase.year_range}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                <span>Precio: {formatClp(Number(purchase.price || 0))}</span>
                                <span>Compra: {new Date(purchase.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Button onClick={() => handleDownload(purchase.product_id, purchase.company_name)} variant="outline" size="sm" className="text-xs flex-1 sm:flex-none" disabled={downloadingId === purchase.product_id}>
                                {downloadingId === purchase.product_id ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" /> : <Download className="h-3 w-3 mr-1" />}
                                {downloadingId === purchase.product_id ? 'Preparando...' : <><span className="hidden sm:inline">Descargar</span><span className="sm:hidden">Desc</span></>}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Paginación */}
                {purchases.length > pageSize && (
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Anterior</Button>
                    <span className="text-xs text-muted-foreground">Página {currentPage} de {pageCount}</span>
                    <Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}>Siguiente</Button>
                  </div>
                )}
              </div>
            )
          })()}

          {!activeEmail && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay compras</h3>
                <p className="text-muted-foreground">Ingresa tu email para buscar tus compras o realiza una nueva compra</p>
              </CardContent>
            </Card>
          )}

          {/* Ayuda y FAQ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>¿Necesitas ayuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>Estamos para ayudarte. Escríbenos y responderemos a la brevedad.</p>
                <div className="flex gap-2">
                  <a href="https://wa.me/56930532461" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-green-600 hover:bg-green-700">WhatsApp</Button>
                  </a>
                  <a href="mailto:soporte@findatachile.cl">
                    <Button variant="outline">Email</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Preguntas frecuentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">¿Cómo recibo mis archivos?</p>
                  <p>Tras el pago, enviamos un correo con enlaces de descarga. También quedan en “Mis Compras”.</p>
                </div>
                <div>
                  <p className="font-medium">¿Qué contienen los Excel?</p>
                  <p>Balance, Resultados y Flujos, anuales o trimestrales según el producto.</p>
                </div>
                <div>
                  <p className="font-medium">¿No me llegó el correo?</p>
                  <p>Revisa spam/promociones. Si no aparece, contáctanos y lo reenviamos.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}