import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, FileSpreadsheet, Clock, Shield, Zap, Calculator, DollarSign, BarChart3, Database, Award, TrendingUp, Building2, Briefcase } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean corporate background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Minimal corporate grid */}
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(0,0,0,0.01)_1px,transparent_1px)] [background-size:60px_60px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.03)_1px,transparent_1px)] [background-size:120px_120px]" />
      </div>

      <main className="flex-1">
        {/* Corporate Hero Section */}
        <section className="relative text-center mb-20 pt-20 pb-16">
          <div className="container mx-auto px-4 md:px-6">
                     
            <div className="relative mb-8">
              <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 leading-none">
                <span className="block text-gray-900">
                  FinData Chile
                </span>
                <span className="block text-gray-600 text-3xl md:text-4xl font-light mt-2">
                  Datos financieros listos en 2 minutos
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-10 font-light leading-relaxed">
              Ahorra 3+ horas por archivo evitando la digitación manual desde la CMF.
              <br className="hidden md:block" />
              <span className="text-lg md:text-xl text-gray-500 font-light">Descarga los datos limpios, estandarizados y listos para analizar en Excel.</span>
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto -mt-6 mb-8">
              Nota: El tiempo considera ingresar tarjeta y confirmar en WebPay.
            </p>
            
            {/* Corporate value props */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="group cursor-default rounded-lg bg-white px-6 py-3 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="font-light text-gray-800">Descarga instantánea</span>
                </div>
              </div>
              <div className="group cursor-default rounded-lg bg-white px-6 py-3 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="font-light text-gray-800">Datos oficiales CMF</span>
                </div>
              </div>
              <div className="group cursor-default rounded-lg bg-white px-6 py-3 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-600" />
                  <span className="font-light text-gray-800">Formato Excel estandarizado</span>
                </div>
              </div>
            </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto mb-8">
              <Link href="/tienda">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-4 h-auto w-full font-light rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Download className="mr-2 h-5 w-5" />
                  Ir al Marketplace
                </Button>
              </Link>
              <a href="#ejemplo" className="w-full">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-gray-200 text-gray-700 hover:bg-gray-50 bg-white w-full font-light rounded-xl shadow-sm hover:border-gray-300 transition-all duration-300">
                  Ver Ejemplo
                </Button>
              </a>
            </div>

                        {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-light">
                <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
                <span>Datos supervisados CMF</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
                <span>+500 empresas disponibles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
                <span>Actualizaciones regulares</span>
              </div>
            </div>
          </div>
        </section>

        {/* Business Value Section */}
        <section className="mb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                Valor para su organización
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                Transforme cómo su equipo accede y analiza información financiera del mercado chileno
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Business Benefits */}
              <div className="space-y-6">
                <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg shrink-0 border border-gray-100">
                        <Clock className="h-8 w-8 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light text-gray-900 mb-3">Ahorro de tiempo significativo</h3>
                        <p className="text-gray-600 leading-relaxed mb-4 font-light">
                          Reduzca de 3+ horas a 30 segundos el tiempo necesario para obtener estados financieros estandarizados. 
                          Sus analistas pueden enfocarse en análisis estratégico en lugar de manipulación de datos.
                        </p>
                        <div className="text-sm text-gray-600 font-light">
                          ROI estimado: 95% en el primer uso
                        </div>
                      </div>
                    </div>
                  </CardContent>
              </Card>

                <Card className="border border-gray-200 bg-white shadow-sm rounded-xl">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg shrink-0">
                        <Shield className="h-8 w-8 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light text-gray-900 mb-3">Precisión y consistencia</h3>
                        <p className="text-gray-600 leading-relaxed mb-4 font-light">
                          Elimine errores de transcripción y garantice consistencia en el formato de datos. 
                          Todos los estados financieros siguen el mismo estándar, facilitando comparaciones y análisis.
                        </p>
                        <div className="text-sm text-gray-600 font-light">
                          Reducción del 100% en errores de digitación
                        </div>
                      </div>
                  </div>
                </CardContent>
              </Card>
            </div>

              {/* ROI Calculator */}
              <div className="relative">
                <Card className="border border-slate-200 bg-slate-50 shadow-lg">
                  <CardHeader className="bg-white border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <Calculator className="h-6 w-6 text-slate-600" />
                      <span className="font-semibold text-slate-800">Impacto económico por archivo</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-slate-200">
                        <span className="text-slate-600">Sueldo mensual de referencia</span>
                        <span className="font-semibold text-slate-800">$1.200.000 CLP</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-200">
                        <span className="text-slate-600">Horas laborales por mes (45 h/sem)</span>
                        <span className="font-semibold text-slate-800">≈ 180 h/mes</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-200">
                        <span className="text-slate-600">Costo por hora estimado</span>
                        <span className="font-semibold text-slate-800">$6.667 CLP</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-200">
                        <span className="text-slate-600">Tiempo actual por análisis</span>
                        <span className="font-semibold text-slate-800">3 – 5 horas</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-200">
                        <span className="text-slate-600">Costo equivalente actual</span>
                        <span className="font-semibold text-slate-800">$20.000 – $33.000 CLP</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-200">
                        <span className="text-slate-600">Tiempo con FinData</span>
                        <span className="font-semibold text-emerald-600">2 minutos (pago WebPay)</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-200">
                        <span className="text-slate-600">Precio FinData Chile</span>
                        <span className="font-semibold text-blue-600">Desde $2.000</span>
                      </div>
                      <div className="flex justify-between py-3 bg-blue-50 rounded-lg px-4 border border-blue-100">
                        <span className="font-semibold text-slate-700">Ahorro neto por archivo</span>
                        <span className="font-bold text-blue-600 text-lg">$18.000 – $31.000 CLP</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Cálculo basado en sueldo mensual $1.200.000, 180 h/mes y tiempo de pago WebPay de ~2 minutos.</p>
                    </div>
                  </CardContent>
                </Card>
                
                                <div className="text-center mt-6">
                  <Link href="/tienda">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300">
                      <Download className="mr-2 h-5 w-5" />
                      Ver en Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Highlight */}
        <section className="mb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-light text-gray-900">+500</div>
                  <p className="text-gray-600 font-light">empresas disponibles</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-light text-gray-900">3+ horas</div>
                  <p className="text-gray-600 font-light">ahorradas por archivo</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-light text-gray-900">2 min</div>
                  <p className="text-gray-600 font-light">pago WebPay e inicio de descarga</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Benefits Section */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="container mx-auto px-4 md:px-6 col-span-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">¿Por qué elegir FinData Chile?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                Profesionales que necesitan datos financieros rápidos y confiables confían en nosotros
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-gray-200 bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-4 border border-gray-100">
                    <Database className="h-8 w-8 text-gray-600" />
                  </div>
                  <CardTitle className="text-xl font-light text-gray-900">
                    Datos Estandarizados
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600 px-6 pb-8">
                  <p className="leading-relaxed mb-4 font-light">
                    <span className="font-medium text-gray-900">Estados financieros uniformes</span> de todas las empresas 
                    supervisadas por la CMF, listos para análisis inmediato.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1 font-light">
                    <div>Formato Excel consistente</div>
                    <div>3 hojas organizadas</div>
                    <div>Compatibilidad total</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-4 border border-gray-100">
                    <Shield className="h-8 w-8 text-gray-600" />
                  </div>
                  <CardTitle className="text-xl font-light text-gray-900">
                    Información Oficial
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600 px-6 pb-8">
                  <p className="leading-relaxed mb-4 font-light">
                    Datos <span className="font-medium text-gray-900">directos de la CMF</span> sin interpretaciones, 
                    garantizando precisión y confiabilidad total.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1 font-light">
                    <div>Fuente oficial verificada</div>
                    <div>Sin manipulación de datos</div>
                    <div>Trazabilidad completa</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-4 border border-gray-100">
                    <BarChart3 className="h-8 w-8 text-gray-600" />
                  </div>
                  <CardTitle className="text-xl font-light text-gray-900">
                    Análisis Eficiente
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600 px-6 pb-8">
                  <p className="leading-relaxed mb-4 font-light">
                    <span className="font-medium text-gray-900">Comparaciones directas</span> entre empresas 
                    y períodos, sin pérdida de tiempo en formateo manual.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1 font-light">
                    <div>Benchmarking inmediato</div>
                    <div>Análisis temporal simple</div>
                    <div>Ratios comparables</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        

        {/* Example File Section */}
        <section id="ejemplo" className="mb-16">
          <div className="container mx-auto px-4 md:px-6">
            <Card className="border border-slate-200 bg-white shadow-lg">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                    <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-slate-800">
                    ¿Qué incluye cada archivo?
                  </span>
                </CardTitle>
                <p className="text-slate-600 mt-2 text-lg">Ejemplo: banco-de-chile-2023.xlsx</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Hoja 1: Balance General
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Activos Corrientes',
                        'Activos No Corrientes', 
                        'Pasivos Corrientes',
                        'Pasivos No Corrientes',
                        'Patrimonio'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                          <span className="text-slate-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Hoja 2: Estado de Resultados
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Ingresos Operacionales',
                        'Costos de Ventas',
                        'Gastos Operacionales', 
                        'Resultado Operacional',
                        'Resultado del Ejercicio'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="text-slate-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      Hoja 3: Flujo de Efectivo
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Flujo Operacional',
                        'Flujo de Inversión',
                        'Flujo de Financiamiento',
                        'Variación de Efectivo',
                        'Efectivo Final'
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                          <span className="text-slate-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg shrink-0 border border-blue-200">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-800 mb-2">Formato profesional incluido</h5>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        Todas las cifras en miles de pesos chilenos (M$), organizadas por trimestre y año completo, 
                        con fórmulas Excel para cálculos automáticos y análisis comparativo.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

                {/* Simplified CTA Section */}
        <section className="mb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center bg-slate-50 rounded-2xl py-12 px-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Empiece ahora
              </h2>
              <p className="text-slate-600 mb-6 max-w-lg mx-auto">
                +500 empresas disponibles • Desde $2.000 CLP
              </p>
              
              <Link href="/tienda">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Download className="mr-2 h-5 w-5" />
                  Ver Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Corporate FAQ Section */}
        <section className="mb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Preguntas frecuentes</h2>
              <p className="text-lg text-slate-600">Respuestas a las consultas más comunes sobre FinData Chile</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="q1" className="border border-slate-200 rounded-lg bg-white shadow-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:bg-slate-50">
                    <span className="font-semibold text-slate-800">¿Qué empresas están disponibles?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-600">
                    Tenemos disponibles los estados financieros de más de 500 empresas chilenas que reportan a la CMF,
                    incluyendo todas las empresas del IPSA, bancos, AFP, seguros y empresas de servicios públicos.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q2" className="border border-slate-200 rounded-lg bg-white shadow-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:bg-slate-50">
                    <span className="font-semibold text-slate-800">¿Qué años están disponibles?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-600">
                    Disponemos de información desde 2018 hasta 2024 (último reporte disponible). Cada archivo
                    corresponde a un año específico de una empresa con datos trimestrales y anuales.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q3" className="border border-slate-200 rounded-lg bg-white shadow-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:bg-slate-50">
                    <span className="font-semibold text-slate-800">¿Cómo funciona la descarga?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-600">
                    Después del pago, recibirá inmediatamente un enlace de descarga por email. El archivo estará
                    disponible por 48 horas para descargar las veces que necesite desde cualquier dispositivo.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q4" className="border border-slate-200 rounded-lg bg-white shadow-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:bg-slate-50">
                    <span className="font-semibold text-slate-800">¿Los datos son confiables?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-600">
                    Absolutamente. Todos los datos provienen directamente de los reportes oficiales que las empresas presentan a la
                    CMF. Solo procesamos y organizamos la información para facilitar su uso, sin alterar los números originales.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q5" className="border border-slate-200 rounded-lg bg-white shadow-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:bg-slate-50">
                    <span className="font-semibold text-slate-800">¿Ofrecen descuentos corporativos?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-600">
                    Sí, ofrecemos descuentos especiales para compras de volumen (10+ archivos) y planes corporativos.
                    Contáctenos para obtener una cotización personalizada según sus necesidades.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q6" className="border border-slate-200 rounded-lg bg-white shadow-sm">
                  <AccordionTrigger className="text-left px-6 py-4 hover:bg-slate-50">
                    <span className="font-semibold text-slate-800">¿Qué formato tienen los archivos?</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-slate-600">
                    Todos los archivos están en formato Excel (.xlsx) con tres hojas organizadas: Balance General,
                    Estado de Resultados y Flujo de Efectivo. Incluyen fórmulas automáticas y formato profesional.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* Footer global */}
    </div>
  )
}
