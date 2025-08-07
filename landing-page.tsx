import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, FileSpreadsheet, Clock, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Estados Financieros Listos para Usar
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Estados Financieros de Empresas Chilenas
                <span className="text-green-600 block mt-2">En 30 Segundos</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed">
                Olvídate de perder horas navegando en la CMF. Obtén los estados financieros ya procesados y listos para
                analizar en Excel.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link href="/tienda">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 h-auto w-full">
                    <Download className="mr-2 h-5 w-5" />
                    Ver Productos
                  </Button>
                </Link>
                <Link href="/tienda">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto border-gray-300 bg-transparent w-full">
                    Ver Ejemplo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Descarga Instantánea</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Datos Oficiales CMF</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Formato Excel</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section id="beneficios" className="w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir Finanzas Express?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ahorra tiempo y enfócate en lo que realmente importa: el análisis financiero.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Ahorra Horas de Trabajo</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    No más navegación compleja en la CMF. Lo que te tomaría horas, lo tienes en 30 segundos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Datos Limpios y Organizados</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Información procesada y estructurada, lista para tus análisis y modelos financieros.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Información Oficial</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Todos los datos provienen directamente de la CMF. Información confiable y actualizada.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Ejemplo de Archivo */}
        <section id="ejemplo" className="w-full py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Qué incluye cada archivo?</h2>
              <p className="text-xl text-gray-600">Ejemplo de contenido para Banco de Chile - Año 2023</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    banco-de-chile-2023.xlsx
                  </CardTitle>
                  <CardDescription>Archivo Excel con 3 hojas organizadas y datos listos para análisis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-600">Hoja 1: Balance General</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Activos Corrientes</li>
                        <li>• Activos No Corrientes</li>
                        <li>• Pasivos Corrientes</li>
                        <li>• Pasivos No Corrientes</li>
                        <li>• Patrimonio</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-600">Hoja 2: Estado de Resultados</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Ingresos Operacionales</li>
                        <li>• Costos de Ventas</li>
                        <li>• Gastos Operacionales</li>
                        <li>• Resultado Operacional</li>
                        <li>• Resultado del Ejercicio</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-600">Hoja 3: Flujo de Efectivo</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Flujo Operacional</li>
                        <li>• Flujo de Inversión</li>
                        <li>• Flujo de Financiamiento</li>
                        <li>• Variación de Efectivo</li>
                        <li>• Efectivo Final</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Formato:</strong> Todas las cifras en miles de pesos chilenos (M$), organizadas por
                      trimestre y año completo, con fórmulas Excel para cálculos automáticos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-green-600">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Obtén los Estados Financieros que Necesitas</h2>
              <p className="text-xl text-green-100">
                Más de 500 empresas disponibles. Descarga instantánea. Solo $2 USD por archivo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link href="/tienda">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto w-full">
                    <Download className="mr-2 h-5 w-5" />
                    Ver Productos
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-green-200">Pago seguro con PayPal • Descarga inmediata • Soporte 24/7</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">¿Qué empresas están disponibles?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Tenemos disponibles los estados financieros de más de 500 empresas chilenas que reportan a la CMF,
                    incluyendo todas las empresas del IPSA, bancos, AFP, seguros y empresas de servicios públicos.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">¿Qué años están disponibles?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Disponemos de información desde 2018 hasta 2024 (último reporte disponible). Cada archivo
                    corresponde a un año específico de una empresa.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">¿Cómo funciona la descarga?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Después del pago, recibirás inmediatamente un enlace de descarga por email. El archivo estará
                    disponible por 48 horas para descargar las veces que necesites.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">¿Los datos son confiables?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Sí, todos los datos provienen directamente de los reportes oficiales que las empresas presentan a la
                    CMF. Solo procesamos y organizamos la información para facilitar su uso.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">¿Ofrecen descuentos por volumen?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Sí, ofrecemos descuentos para compras de 10 o más archivos. Contáctanos a través del chat de soporte
                    para obtener un código de descuento personalizado.
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
