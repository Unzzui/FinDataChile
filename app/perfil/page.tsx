"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  ShoppingBag, 
  Download, 
  LogOut, 
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  email: string
  name: string
  created_at: string
}

interface Purchase {
  id: number
  product_id: string
  amount: number
  created_at: string
  company_name: string
  sector: string
  year_range: string
  is_quarterly: boolean
}

interface Download {
  id: number
  product_id: string
  downloaded_at: string
  company_name: string
  sector: string
  year_range: string
  is_quarterly: boolean
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [downloads, setDownloads] = useState<Download[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Obtener usuario del localStorage
      const userData = localStorage.getItem("user")
      if (!userData) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const user = JSON.parse(userData)
      setUser(user)

      // Cargar compras reales del usuario
      const purchasesResponse = await fetch(`/api/user/purchases?userId=${user.id}`)
      if (purchasesResponse.ok) {
        const purchasesData = await purchasesResponse.json()
        setPurchases(purchasesData.purchases || [])
      }

      // Cargar historial de descargas
      const downloadsResponse = await fetch(`/api/user/downloads?userId=${user.id}`)
      if (downloadsResponse.ok) {
        const downloadsData = await downloadsResponse.json()
        setDownloads(downloadsData.downloads || [])
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    // Limpiar sesión
    localStorage.removeItem('user')
    toast({
      title: "Sesión cerrada",
      description: "Has salido de tu cuenta",
    })
    // Redirigir al home
    window.location.href = '/'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Acceso requerido</h2>
            <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tu perfil</p>
            <Link href="/login">
              <Button>Iniciar Sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
              <p className="text-gray-600">Gestiona tus compras y descargas</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Información del usuario */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <p className="text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Miembro desde</label>
                <p className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('es-CL')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de compras y descargas */}
        <Tabs defaultValue="purchases" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="purchases">Mis Compras</TabsTrigger>
            <TabsTrigger value="downloads">Descargas</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Historial de Compras
                </CardTitle>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No tienes compras aún
                  </p>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{purchase.company_name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{purchase.sector}</Badge>
                              <Badge variant="outline">{purchase.year_range}</Badge>
                              <Badge variant="outline" className={purchase.is_quarterly ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}>
                                {purchase.is_quarterly ? 'Trimestral' : 'Anual'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Comprado el {new Date(purchase.created_at).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${purchase.amount}</p>
                            <Button size="sm" className="mt-2">
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Historial de Descargas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {downloads.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No has descargado archivos aún
                  </p>
                ) : (
                  <div className="space-y-4">
                    {downloads.map((download) => (
                      <div key={download.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{download.company_name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{download.sector}</Badge>
                              <Badge variant="outline">{download.year_range}</Badge>
                              <Badge variant="outline" className={download.is_quarterly ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}>
                                {download.is_quarterly ? 'Trimestral' : 'Anual'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Descargado el {new Date(download.downloaded_at).toLocaleDateString('es-CL')}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 