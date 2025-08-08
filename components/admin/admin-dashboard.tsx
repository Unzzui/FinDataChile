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

interface SurveyStats {
  total: number
  interested: number
  notInterested: number
  interestRate: string
  recentWeek: number
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

  const [surveyStats, setSurveyStats] = useState<SurveyStats>({
    total: 0,
    interested: 0,
    notInterested: 0,
    interestRate: '0',
    recentWeek: 0
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
        // Cargar estadísticas generales
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
          }
        }

        // Cargar estadísticas de la encuesta de suscripciones
        const surveyResponse = await fetch('/api/survey/stats')
        if (surveyResponse.ok) {
          const surveyResult = await surveyResponse.json()
          if (surveyResult.success) {
            setSurveyStats(surveyResult.data)
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
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
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <Icon className="h-full w-full" />
      </div>
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {prefix}{value.toLocaleString('es-CL')}{suffix}
            </p>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                change >= 0 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {Math.abs(change)}%
              </div>
              <span className="text-xs text-slate-500">vs mes anterior</span>
            </div>
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="space-y-8">
          <div className="bg-white border-b border-slate-200/60 -mx-6 -mt-6 px-6 pt-6 pb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-64"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <Card key={i} className="animate-pulse border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="h-20 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white border-b border-slate-200/60 -mx-6 -mt-6 px-6 pt-6 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-lg text-slate-600">
                Resumen completo de tu negocio en tiempo real
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Actualizado hace pocos segundos
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-36 h-11 border-slate-200 bg-white shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Ingresos Totales"
            value={stats.totalRevenue}
            change={stats.revenueGrowth}
            icon={DollarSign}
            suffix=" CLP"
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

        {/* Enhanced Subscription Survey Statistics */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="border-b border-purple-100/50 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-slate-900 font-bold">Suscripciones Premium</span>
                <p className="text-sm font-normal text-slate-600 mt-1">Resultados de la encuesta de mercado</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
                <div className="text-3xl font-black text-blue-700">{surveyStats.total}</div>
                <div className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Respuestas</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50">
                <div className="text-3xl font-black text-emerald-700">{surveyStats.interested}</div>
                <div className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Interesados</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/50">
                <div className="text-3xl font-black text-red-700">{surveyStats.notInterested}</div>
                <div className="text-sm font-medium text-red-600 uppercase tracking-wide">No Interesados</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
                <div className="text-3xl font-black text-purple-700">{surveyStats.interestRate}%</div>
                <div className="text-sm font-medium text-purple-600 uppercase tracking-wide">Tasa de Interés</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200/50">
                <div className="text-3xl font-black text-orange-700">{surveyStats.recentWeek}</div>
                <div className="text-sm font-medium text-orange-600 uppercase tracking-wide">Esta Semana</div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-lg">Distribución de Respuestas</h4>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded shadow-sm"></div>
                    <span className="font-medium text-slate-700">Interesados ({surveyStats.interestRate}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded shadow-sm"></div>
                    <span className="font-medium text-slate-700">No Interesados ({surveyStats.total > 0 ? (100 - parseFloat(surveyStats.interestRate)).toFixed(1) : 0}%)</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="flex h-12 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                  {surveyStats.total > 0 && (
                    <>
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg"
                        style={{ width: `${(surveyStats.interested / surveyStats.total) * 100}%` }}
                        title={`${surveyStats.interested} interesados (${surveyStats.interestRate}%)`}
                      >
                        {surveyStats.interested > 0 && surveyStats.interested}
                      </div>
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg"
                        style={{ width: `${(surveyStats.notInterested / surveyStats.total) * 100}%` }}
                        title={`${surveyStats.notInterested} no interesados`}
                      >
                        {surveyStats.notInterested > 0 && surveyStats.notInterested}
                      </div>
                    </>
                  )}
                  {surveyStats.total === 0 && (
                    <div className="bg-slate-200 w-full flex items-center justify-center text-slate-500 font-medium">
                      Esperando primeras respuestas...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="border-b border-blue-100/50 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 font-bold">Tendencia de Ingresos</span>
                  <p className="text-sm font-normal text-slate-600 mt-1">Evolución mensual</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/30">
            <CardHeader className="border-b border-emerald-100/50 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-slate-900 font-bold">Actividad Reciente</span>
                  <p className="text-sm font-normal text-slate-600 mt-1">Últimas transacciones</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivityData.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'purchase' ? 'bg-emerald-100' :
                      activity.type === 'download' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'purchase' && <DollarSign className="h-4 w-4 text-emerald-600" />}
                      {activity.type === 'download' && <Download className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'user' && <Users className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-900">{activity.description}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                    {activity.amount && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        +{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(activity.amount)}
                      </Badge>
                    )}
                  </div>
                ))}
                {recentActivityData.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Activity className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                    <p>No hay actividad reciente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-emerald-50/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Mejor Producto</p>
                  <p className="font-black text-slate-900 text-lg">
                    {productSalesData.length > 0 ? productSalesData[0].name : 'N/A'}
                  </p>
                  <p className="text-sm text-emerald-600 font-semibold">
                    {productSalesData.length > 0 ? `${productSalesData[0].sales} ventas` : 'Sin datos'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Promedio Diario</p>
                  <p className="font-black text-slate-900 text-lg">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(
                      salesData.length > 0 
                        ? Math.round(salesData.reduce((sum, day) => sum + day.revenue, 0) / salesData.length) 
                        : 0
                    )}
                  </p>
                  <p className="text-sm text-blue-600 font-semibold">
                    {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth)}% vs anterior
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}