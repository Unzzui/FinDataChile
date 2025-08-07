'use client'

import { useState, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts'
import { 
  DollarSign, Users, ShoppingCart, TrendingUp, TrendingDown,
  Calendar, Download, Eye, Star, Package, Activity,
  ArrowUpRight, ArrowDownRight, Plus, FileSpreadsheet
} from 'lucide-react'
import { format, subDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardStats {
  totalRevenue: number
  totalUsers: number
  totalProducts: number
  totalDownloads: number
  revenueGrowth: number
  userGrowth: number
  productGrowth: number
  downloadGrowth: number
}

interface SalesData {
  date: string
  revenue: number
  downloads: number
  users: number
}

interface ProductSales {
  name: string
  sales: number
  revenue: number
  color: string
}

interface RecentActivity {
  id: string
  type: 'purchase' | 'download' | 'user'
  description: string
  time: string
  amount?: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalDownloads: 0,
    revenueGrowth: 0,
    userGrowth: 0,
    productGrowth: 0,
    downloadGrowth: 0
  })

  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [productSalesData, setProductSalesData] = useState<ProductSales[]>([])
  const [recentActivityData, setRecentActivityData] = useState<RecentActivity[]>([])
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar datos reales desde la API
    const loadData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setStats(result.data.stats)
            setSalesData(result.data.salesData || [])
            setProductSalesData(result.data.productSales || [])
            setRecentActivityData(result.data.recentActivity || [])
          } else {
            console.error('Error loading stats:', result.error)
            // Mantener datos por defecto en caso de error
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
        // Mantener datos por defecto en caso de error
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
    
    // Recargar datos cada 30 segundos
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    prefix = '', 
    suffix = '' 
  }: {
    title: string
    value: number
    change: number
    icon: any
    prefix?: string
    suffix?: string
  }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">
              {prefix}{value.toLocaleString()}{suffix}
            </p>
            <div className="flex items-center mt-2">
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de tu negocio en tiempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Totales"
          value={stats.totalRevenue}
          change={stats.revenueGrowth}
          icon={DollarSign}
          prefix="$"
          suffix=" USD"
        />
        <StatCard
          title="Usuarios Activos"
          value={stats.totalUsers}
          change={stats.userGrowth}
          icon={Users}
        />
        <StatCard
          title="Productos"
          value={stats.totalProducts}
          change={stats.productGrowth}
          icon={Package}
        />
        <StatCard
          title="Descargas"
          value={stats.totalDownloads}
          change={stats.downloadGrowth}
          icon={Download}
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ingresos */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value}`, 
                    name === 'revenue' ? 'Ingresos' : 'Descargas'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de ventas por sector */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productSalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {productSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de barras y actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparación mensual */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comparación Últimos 7 Días</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" name="Ingresos ($)" />
                <Bar dataKey="downloads" fill="#10b981" name="Descargas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivityData.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'purchase' ? 'bg-green-100' :
                    activity.type === 'download' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'purchase' && <DollarSign className="h-4 w-4 text-green-600" />}
                    {activity.type === 'download' && <Download className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'user' && <Users className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      {activity.amount && (
                        <Badge variant="secondary" className="text-xs">
                          ${activity.amount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {recentActivityData.length === 0 && !isLoading && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay actividad reciente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Producto Más Vendido</p>
                <p className="font-semibold">
                  {productSalesData.length > 0 ? productSalesData[0].name : 'Sin datos'}
                </p>
                <p className="text-sm text-green-600">
                  {productSalesData.length > 0 ? `${productSalesData[0].sales} ventas` : 'Sin ventas'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Promedio Diario</p>
                <p className="font-semibold">
                  ${salesData.length > 0 
                    ? Math.round(salesData.reduce((sum, day) => sum + day.revenue, 0) / salesData.length) 
                    : 0} USD
                </p>
                <p className="text-sm text-blue-600">
                  {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth)}% vs anterior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Satisfacción</p>
                <p className="font-semibold">4.8/5.0</p>
                <p className="text-sm text-purple-600">Basado en 127 reseñas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
