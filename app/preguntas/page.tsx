import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PreguntasPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="w-full py-12 bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Preguntas y Respuestas</h1>
          <p className="text-slate-600">Resolvemos las dudas más frecuentes sobre FinData Chile</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-10">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem value="q1" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">¿Cómo compro y descargo un archivo?</AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    Agrega el producto al carrito, paga con WebPay y recibirás un correo con los enlaces de descarga. También podrás verlos en "Mis Compras".
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">¿Qué incluye cada archivo?</AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    Un Excel estandarizado con Balance, Estado de Resultados y Flujo de Efectivo del período seleccionado.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">¿De dónde provienen los datos?</AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    De reportes oficiales de la CMF. Solo estandarizamos y organizamos la información para su análisis.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">¿Puedo solicitar una empresa que no esté disponible?</AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    Sí. Usa el formulario "Solicitar Estados Financieros" en la tienda y te avisaremos cuando esté lista.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q5" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">¿Ofrecen facturación o boleta?</AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    Sí. Tras la compra puedes solicitar la documentación correspondiente respondiendo al correo de confirmación.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


