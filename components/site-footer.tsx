import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, FileText, Shield, Building, TrendingUp, ExternalLink } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="relative w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white mt-16">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>
      
      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Columna 1: Logo y descripción */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-6 group">
              <Image 
                src="/logo-horizontal-light.svg" 
                alt="FinData Chile" 
                width={200} 
                height={60} 
                className="transition-transform duration-200 group-hover:scale-105"
                priority 
              />
            </Link>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              Plataforma especializada en estados financieros de empresas chilenas. 
              Datos procesados, verificados y listos para análisis profesional.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Building className="h-3 w-3" />
              <span>Datos oficiales de la CMF</span>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="font-semibold mb-4 text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              Productos
            </h4>
            <nav className="space-y-3">
              <Link 
                href="/tienda" 
                className="block text-sm text-slate-300 hover:text-blue-400 transition-all duration-200 hover:translate-x-1 transform hover:underline"
              >
                Catálogo de Empresas
              </Link>
              <Link 
                href="/suscripciones" 
                className="block text-sm text-slate-300 hover:text-blue-400 transition-all duration-200 hover:translate-x-1 transform hover:underline"
              >
                Planes y Suscripciones
              </Link>
              <Link 
                href="/compras" 
                className="block text-sm text-slate-300 hover:text-blue-400 transition-all duration-200 hover:translate-x-1 transform hover:underline"
              >
                Mis Compras
              </Link>
              <Link 
                href="/perfil" 
                className="block text-sm text-slate-300 hover:text-blue-400 transition-all duration-200 hover:translate-x-1 transform hover:underline"
              >
                Mi Perfil
              </Link>
            </nav>
          </div>

          {/* Columna 3: Información legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              Legal
            </h4>
            <nav className="space-y-3">
              <Link 
                href="/terminos" 
                className="block text-sm text-slate-300 hover:text-emerald-400 transition-all duration-200 hover:translate-x-1 transform hover:underline"
              >
                Términos y Condiciones
              </Link>
              <Link 
                href="/privacidad" 
                className="block text-sm text-slate-300 hover:text-emerald-400 transition-all duration-200 hover:translate-x-1 transform hover:underline"
              >
                Política de Privacidad
              </Link>
              <Link 
                href="https://www.cmfchile.cl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-slate-300 hover:text-emerald-400 transition-all duration-200 hover:translate-x-1 transform hover:underline"
              >
                Fuente: CMF Chile
                <ExternalLink className="h-3 w-3" />
              </Link>
            </nav>
          </div>

          {/* Columna 4: Contacto y descargo */}
          <div>
            <h4 className="font-semibold mb-4 text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" />
              Soporte
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <Link 
                href="mailto:contacto@findatachile.com"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
              >
                <Mail className="h-3 w-3 text-slate-400" />
                <span>contacto@findatachile.com</span>
              </Link>
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 text-slate-400 mt-0.5" />
                <span className="text-xs">Santiago, Chile</span>
              </div>
            </div>
            
            {/* Descargo de responsabilidad compacto */}
            <div className="mt-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Descargo:</strong> Información pública de la CMF, 
                procesada para facilitar análisis. Los usuarios deben verificar datos y 
                son responsables de sus decisiones de inversión.
              </p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} FinData Chile. Todos los derechos reservados.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Plataforma desarrollada para facilitar el acceso a información financiera pública.
              </p>
            </div>
            
            {/* Badges de confianza */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-900/30 rounded-full border border-emerald-700/50">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-300 font-medium">Datos Verificados</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 rounded-full border border-blue-700/50">
                <Shield className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-blue-300 font-medium">Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-5 pointer-events-none -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
    </footer>
  )
}


