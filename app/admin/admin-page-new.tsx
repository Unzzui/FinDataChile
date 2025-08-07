'use client'

import { useState, useEffect } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { ProductManager } from "@/components/admin/product-manager"
import { FileUploadManager } from "@/components/admin/file-upload-manager"
import { SurveyStats } from "@/components/admin/survey-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogoutButton } from "@/components/admin/logout-button"
import { LoginForm } from "@/components/admin/login-form"
import RealStats from "@/components/admin/real-stats"
import PurchaseManager from "@/components/admin/purchase-manager"
import { TestPaymentSimulator } from "@/components/payment/test-payment-simulator"
import { BarChart3, Package, Upload, Users, DollarSign, Settings } from "lucide-react"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación al cargar
    const authStatus = localStorage.getItem('adminAuthenticated')
    setIsAuthenticated(authStatus === 'true')
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">FinData Chile</p>
              </div>
            </div>
            <LogoutButton onLogout={handleLogout} />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Subir Archivos
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Ventas
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <ProductManager />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <FileUploadManager />
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <PurchaseManager />
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <RealStats />
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <SurveyStats />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Configuración del Sistema</h3>
              <div className="space-y-6">
                <TestPaymentSimulator />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
