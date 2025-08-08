import { SubscriptionSurvey } from "@/components/subscription/subscription-survey"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Crown, ShieldCheck, BarChart3, CheckCircle2, LineChart, AlertTriangle, Calculator, Lock, Briefcase, Building2, Quote, Code, Database, Zap, Globe, Shield, Award } from "lucide-react"
import Link from "next/link"

export default function SuscripcionesPage() {
  const enabled = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true'
  return (
    <div className="min-h-screen bg-white">
      {/* Clean corporate background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Minimal corporate grid */}
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(0,0,0,0.01)_1px,transparent_1px)] [background-size:60px_60px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.03)_1px,transparent_1px)] [background-size:120px_120px]" />
      </div>
      <div className="container mx-auto px-4 py-12">

        {/* Simple Hero - Próximamente */}
        <section className="relative text-center mb-20">
          <div className="mb-8 flex justify-center">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-6 py-3 text-lg font-medium">
              <Award className="h-5 w-5 mr-2" />
              Próximamente disponible
            </Badge>
          </div>
          
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
              <span className="block text-slate-900">
                FinData Chile
              </span>
              <span className="block text-blue-600 text-3xl md:text-4xl font-bold mt-2">
                Suscripciones
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 font-light leading-relaxed">
            Acceso ilimitado a estados financieros estandarizados + API con análisis financieros automatizados.
            <br className="hidden md:block" />
            <span className="text-lg md:text-xl text-slate-500">Descargas sin límite, ratios calculados, alertas automáticas y más.</span>
          </p>
          
          {/* Enhanced value indicators */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-emerald-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-emerald-600 mb-1">+500</div>
                <p className="text-sm text-slate-600">empresas supervisadas</p>
              </div>
              <div className="bg-white border border-blue-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-blue-600 mb-1">CMF</div>
                <p className="text-sm text-slate-600">datos oficiales</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-slate-600 mb-1">Excel</div>
                <p className="text-sm text-slate-600">formato estándar</p>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Value Proposition */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Lo que incluirá la suscripción
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Acceso completo y sin límites a toda nuestra base de datos financiera
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg shrink-0">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Descargas ilimitadas</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Acceso completo a estados financieros de +500 empresas en formato Excel estandarizado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 rounded-lg shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">API con análisis automatizado</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Acceso programático con ratios financieros pre-calculados, scoring de riesgo y alertas automáticas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Horizontal Timeline */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Cronograma de lanzamiento</h2>
            <p className="text-lg text-slate-600">Cómo y cuándo estará disponible</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* Desktop Timeline */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-16 left-0 right-0 h-1 bg-slate-200 rounded-full"></div>
                <div className="absolute top-16 left-0 w-1/3 h-1 bg-emerald-500 rounded-full"></div>
                
                <div className="grid grid-cols-3 gap-8">
                  {/* Step 1 - Completed */}
                  <div className="relative text-center">
                    <div className="relative z-10 mx-auto w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <div className="bg-white border border-emerald-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-emerald-800 mb-2">Agosto 2025</h3>
                      <p className="text-sm font-medium text-emerald-700 mb-2">¡Disponible!</p>
                      <p className="text-sm text-slate-600">Tienda de archivos Excel individuales por empresa</p>
                    </div>
                  </div>
                  
                  {/* Step 2 - In Progress */}
                  <div className="relative text-center">
                    <div className="relative z-10 mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-xl font-bold text-white">2</span>
                    </div>
                    <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-blue-800 mb-2">Q4 2025</h3>
                      <p className="text-sm font-medium text-blue-700 mb-2">En desarrollo</p>
                      <p className="text-sm text-slate-600">Estudio de mercado para suscripciones y API</p>
                    </div>
                  </div>
                  
                  {/* Step 3 - Future */}
                  <div className="relative text-center">
                    <div className="relative z-10 mx-auto w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-xl font-bold text-white">3</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Q1 2026</h3>
                      <p className="text-sm font-medium text-slate-600 mb-2">Próximamente</p>
                      <p className="text-sm text-slate-600">Suscripciones + API con análisis automatizado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Timeline */}
            <div className="block md:hidden space-y-4">
              {/* Step 1 - Completed */}
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-emerald-800 mb-1">Agosto 2025</h3>
                    <p className="text-sm font-medium text-emerald-700 mb-2">¡Disponible!</p>
                    <p className="text-sm text-slate-600">Tienda de archivos Excel individuales por empresa</p>
                  </div>
                </div>
                {/* Connector line */}
                <div className="absolute left-6 top-12 w-0.5 h-6 bg-slate-200"></div>
              </div>
              
              {/* Step 2 - In Progress */}
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">2</span>
                  </div>
                  <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-800 mb-1">Q4 2025</h3>
                    <p className="text-sm font-medium text-blue-700 mb-2">En desarrollo</p>
                    <p className="text-sm text-slate-600">Estudio de mercado para suscripciones y API</p>
                  </div>
                </div>
                {/* Connector line */}
                <div className="absolute left-6 top-12 w-0.5 h-6 bg-slate-200"></div>
              </div>
              
              {/* Step 3 - Future */}
              <div className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">3</span>
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Q1 2026</h3>
                    <p className="text-sm font-medium text-slate-600 mb-2">Próximamente</p>
                    <p className="text-sm text-slate-600">Suscripciones + API con análisis automatizado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Survey Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">¿Te interesa esta suscripción?</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Tu feedback es clave para definir el precio, funcionalidades y fecha de lanzamiento
              </p>
            </div>
            
            <Card className="border-0 shadow-xl bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
      
              <CardContent className="p-8 lg:p-10">
                <div className="max-w-2xl mx-auto">
                  <SubscriptionSurvey />
                </div>
                
                {/* Benefits reminder */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="grid sm:grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="mx-auto w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">Acceso prioritario</p>
                      <p className="text-xs text-slate-500">Serás de los primeros en conocer el lanzamiento</p>
                    </div>
                    <div className="space-y-2">
                      <div className="mx-auto w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">Precio preferencial</p>
                      <p className="text-xs text-slate-500">Descuentos especiales para early adopters</p>
                    </div>
                    <div className="space-y-2">
                      <div className="mx-auto w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 text-slate-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">Funcionalidades personalizadas</p>
                      <p className="text-xs text-slate-500">Tu input influye en el desarrollo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Simple FAQ */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Preguntas frecuentes</h2>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="q1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">¿Cuándo estará disponible?</AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Planeamos lanzar en Q1 2026. Actualmente tenemos la tienda individual, y estamos estudiando la demanda para suscripciones.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">¿Qué empresas incluirá?</AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Todas las empresas que reportan a la CMF (+500), con históricos desde 2018 hasta la fecha.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">¿Cuál será el precio aproximado?</AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  Estamos evaluando diferentes modelos de precio. Tu respuesta en la encuesta nos ayudará a definirlo.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </div>
    </div>
  )
} 