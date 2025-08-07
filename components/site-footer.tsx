import Link from "next/link"
import { FileSpreadsheet } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full py-10 bg-gray-900 text-white mt-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-lg">FinData Chile</span>
            </div>
            <p className="text-gray-400 mb-3">
              Estados financieros de empresas chilenas, procesados y listos para usar.
            </p>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} FinData Chile. Todos los derechos reservados.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Información Legal</h4>
            <div className="text-sm text-gray-400 space-y-2">
              <p>
                <strong>Descargo de Responsabilidad:</strong> La información es pública y proviene de la CMF. Nosotros solo la procesamos y organizamos.
              </p>
              <p>
                Los usuarios deben verificar la exactitud y uso apropiado. No somos responsables por decisiones de inversión.
              </p>
              <div className="pt-3 space-y-1">
                <div>
                  <Link href="/terminos" className="text-green-400 hover:text-green-300 transition-colors">
                    Términos y Condiciones
                  </Link>
                </div>
                <div>
                  <Link href="/privacidad" className="text-green-400 hover:text-green-300 transition-colors">
                    Política de Privacidad
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


