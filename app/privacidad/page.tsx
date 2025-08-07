import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock, Eye, Users, Database, FileText, Settings, AlertTriangle, CheckCircle, ArrowLeft, Mail, Clock, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidad - FinData Chile',
  description: 'Política de privacidad y protección de datos de FinData Chile - Cumplimiento Ley 19.628',
  keywords: 'privacidad, protección datos, Ley 19.628, GDPR, FinData Chile',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-indigo-100 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Volver al inicio
              </Link>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Shield className="h-12 w-12" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
              Política de Privacidad
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-4 leading-relaxed">
              Su privacidad es nuestra prioridad. Protección total de datos conforme a la legislación chilena.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Ley N° 19.628 Chile</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Actualizada: 7 agosto 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">Navegación rápida</span>
            </div>
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <a href="#introduccion" className="text-gray-600 hover:text-indigo-600 transition-colors">Introducción</a>
              <a href="#recopilacion" className="text-gray-600 hover:text-indigo-600 transition-colors">Recopilación</a>
              <a href="#uso" className="text-gray-600 hover:text-indigo-600 transition-colors">Uso</a>
              <a href="#derechos" className="text-gray-600 hover:text-indigo-600 transition-colors">Sus Derechos</a>
              <a href="#seguridad" className="text-gray-600 hover:text-indigo-600 transition-colors">Seguridad</a>
              <a href="#contacto" className="text-gray-600 hover:text-indigo-600 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 text-center">
            <div className="p-3 bg-indigo-100 rounded-xl w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ley 19.628</h3>
            <p className="text-gray-600 text-sm">Cumplimiento total con normativa chilena de protección de datos</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 text-center">
            <div className="p-3 bg-green-100 rounded-xl w-fit mx-auto mb-4">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Cifrado SSL</h3>
            <p className="text-gray-600 text-sm">Transmisión segura con cifrado de grado bancario</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 text-center">
            <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-4">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Almacén Seguro</h3>
            <p className="text-gray-600 text-sm">Servidores protegidos con respaldos automáticos</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 text-center">
            <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-4">
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Control Total</h3>
            <p className="text-gray-600 text-sm">Ejercita todos sus derechos sobre sus datos personales</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          
          {/* Introducción */}
          <section id="introduccion" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl shrink-0">
                <FileText className="h-7 w-7 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Introducción y Compromiso
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4"></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                En <strong>FinData Chile</strong> consideramos la privacidad como un derecho fundamental. 
                Esta política describe detalladamente cómo recopilamos, utilizamos, almacenamos y protegemos 
                su información personal cuando utiliza nuestros servicios, en estricto cumplimiento con:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Normativas Nacionales
                  </h4>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• <strong>Ley N° 19.628</strong> sobre Protección de la Vida Privada</li>
                    <li>• <strong>Ley N° 20.584</strong> derechos y deberes de pacientes</li>
                    <li>• <strong>Normativas CMF</strong> sobre protección de datos financieros</li>
                    <li>• <strong>Reglamentos SERNAC</strong> protección del consumidor</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Estándares Internacionales
                  </h4>
                  <ul className="space-y-2 text-green-800 text-sm">
                    <li>• <strong>ISO 27001</strong> sistemas de gestión de seguridad</li>
                    <li>• <strong>GDPR</strong> reglamento europeo de protección de datos</li>
                    <li>• <strong>SOC 2 Type II</strong> controles de seguridad y disponibilidad</li>
                    <li>• <strong>CCPA</strong> ley de privacidad del consumidor de California</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Nuestro Compromiso con Usted
                </h4>
                <p className="text-indigo-100">
                  Nos comprometemos a ser <strong>transparentes, responsables y seguros</strong> en el manejo 
                  de su información personal. Nunca vendemos, alquilamos o compartimos sus datos con terceros 
                  para fines comerciales sin su consentimiento explícito.
                </p>
              </div>
            </div>
          </section>

          {/* Información que Recopilamos */}
          <section id="recopilacion" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl shrink-0">
                <Database className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Información que Recopilamos
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4"></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Datos de Registro */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-blue-900">Datos de Registro</h4>
                  </div>
                  <ul className="space-y-3 text-blue-800 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Nombre completo</strong> para personalización</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Email</strong> para comunicaciones esenciales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Empresa</strong> para estadísticas sectoriales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Teléfono</strong> para soporte prioritario</span>
                    </li>
                  </ul>
                </div>

                {/* Datos de Pago */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-green-900">Datos de Pago</h4>
                  </div>
                  <ul className="space-y-3 text-green-800 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Transbank tokens</strong> (no guardamos tarjetas)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Historial de compras</strong> para facturación</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Datos de facturación</strong> para cumplimiento fiscal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>RUT/Tax ID</strong> para facturas electrónicas</span>
                    </li>
                  </ul>
                </div>

                {/* Datos de Uso */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-semibold text-purple-900">Datos de Uso</h4>
                  </div>
                  <ul className="space-y-3 text-purple-800 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Páginas visitadas</strong> para análisis UX</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Productos descargados</strong> para recomendaciones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>Configuraciones</strong> para personalización</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                      <span><strong>IP y dispositivo</strong> para seguridad</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-3">Principio de Minimización de Datos</h4>
                    <p className="text-amber-800 mb-3">
                      Recopilamos únicamente los datos <strong>estrictamente necesarios</strong> para proporcionar nuestros servicios. 
                      No solicitamos información adicional innecesaria.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">Solo lo necesario</span>
                      <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">Propósito específico</span>
                      <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">Tiempo limitado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sus Derechos */}
          <section id="derechos" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-xl shrink-0">
                <Settings className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Sus Derechos Fundamentales
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-4"></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Bajo la legislación chilena e internacional, usted tiene derechos irrenunciables sobre sus datos personales. 
                En FinData Chile facilitamos el ejercicio de estos derechos de manera <strong>gratuita, rápida y sencilla</strong>.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Derechos de Acceso y Control */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="h-6 w-6 text-blue-500" />
                    Derechos de Acceso y Control
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-blue-900">Derecho de Acceso</h5>
                        <p className="text-sm text-blue-800">Solicitar copia completa de todos sus datos que tenemos almacenados</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-blue-900">Derecho de Rectificación</h5>
                        <p className="text-sm text-blue-800">Corregir inmediatamente datos inexactos, incompletos o desactualizados</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-blue-900">Derecho de Portabilidad</h5>
                        <p className="text-sm text-blue-800">Recibir sus datos en formato estructurado para transferir a otro servicio</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Derechos de Eliminación y Oposición */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-red-500" />
                    Derechos de Eliminación y Oposición
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-red-900">Derecho al Olvido</h5>
                        <p className="text-sm text-red-800">Solicitar eliminación completa de sus datos cuando ya no sean necesarios</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-red-900">Derecho de Oposición</h5>
                        <p className="text-sm text-red-800">Oponerse al tratamiento de sus datos para fines específicos</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-red-900">Derecho de Limitación</h5>
                        <p className="text-sm text-red-800">Restringir el procesamiento mientras se resuelven disputas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cómo Ejercer sus Derechos */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 rounded-2xl">
                <div className="text-center mb-6">
                  <Mail className="h-10 w-10 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold mb-2">¿Cómo Ejercer sus Derechos?</h4>
                  <p className="text-indigo-100">Proceso simple y gratuito en 3 pasos</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <h5 className="font-semibold mb-2">Contacte</h5>
                    <p className="text-sm text-indigo-100">Envíe email a privacidad@findatachile.com con su solicitud</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <h5 className="font-semibold mb-2">Verificamos</h5>
                    <p className="text-sm text-indigo-100">Confirmamos su identidad de forma segura en 24 horas</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <h5 className="font-semibold mb-2">Ejecutamos</h5>
                    <p className="text-sm text-indigo-100">Procesamos su solicitud en máximo 30 días hábiles</p>
                  </div>
                </div>
                
                <div className="text-center mt-6 pt-6 border-t border-white/20">
                  <p className="text-indigo-100 mb-4">
                    <strong>Tiempo de respuesta garantizado:</strong> 72 horas para confirmación inicial
                  </p>
                  <a 
                    href="mailto:privacidad@findatachile.com" 
                    className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    Ejercer mis Derechos
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section id="seguridad" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-xl shrink-0">
                <Lock className="h-7 w-7 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Seguridad y Protección Avanzada
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4"></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                La seguridad de sus datos es nuestra máxima prioridad. Implementamos múltiples capas de protección 
                con tecnología de grado bancario y monitoreo 24/7.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-1">Cifrado SSL/TLS</h4>
                  <p className="text-xs text-blue-800">256-bit encryption</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-900 mb-1">Firewall WAF</h4>
                  <p className="text-xs text-green-800">Cloudflare Protection</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-1">Backup Diario</h4>
                  <p className="text-xs text-purple-800">Múltiples ubicaciones</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-orange-900 mb-1">Monitoreo 24/7</h4>
                  <p className="text-xs text-orange-800">Alertas automáticas</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">Certificaciones y Cumplimiento</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>ISO 27001 - Gestión de Seguridad de la Información</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>SOC 2 Type II - Controles de Seguridad</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>PCI DSS Level 1 - Seguridad de Pagos</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>GDPR Compliance - Protección de Datos EU</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Ley 19.628 Chile - Protección Vida Privada</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>CCPA Compliance - Privacidad California</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section id="contacto" className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-3">Centro de Privacidad y Protección de Datos</h2>
              <p className="text-indigo-100 text-lg">Estamos aquí para proteger sus derechos y resolver sus consultas</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-white" />
                  <h4 className="font-semibold text-white">Oficial de Privacidad</h4>
                </div>
                <div className="space-y-2 text-indigo-100 text-sm">
                  <p><strong className="text-white">Email:</strong> privacidad@findatachile.com</p>
                  <p><strong className="text-white">Respuesta:</strong> 24-72 horas</p>
                  <p><strong className="text-white">Especialidad:</strong> Derechos ARCO, GDPR, Ley 19.628</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="h-6 w-6 text-white" />
                  <h4 className="font-semibold text-white">Soporte Técnico</h4>
                </div>
                <div className="space-y-2 text-indigo-100 text-sm">
                  <p><strong className="text-white">Email:</strong> soporte@findatachile.com</p>
                  <p><strong className="text-white">Respuesta:</strong> 2-4 horas hábiles</p>
                  <p><strong className="text-white">Especialidad:</strong> Configuración cuenta, seguridad</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-white" />
                  <h4 className="font-semibold text-white">Incidentes de Seguridad</h4>
                </div>
                <div className="space-y-2 text-indigo-100 text-sm">
                  <p><strong className="text-white">Email:</strong> seguridad@findatachile.com</p>
                  <p><strong className="text-white">Respuesta:</strong> Inmediata (24/7)</p>
                  <p><strong className="text-white">Especialidad:</strong> Vulnerabilidades, brechas</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="grid md:grid-cols-2 gap-6 text-indigo-100 text-sm">
                <div>
                  <h5 className="font-semibold text-white mb-2">Horarios de Atención</h5>
                  <ul className="space-y-1">
                    <li>• <strong>Consultas generales:</strong> Lunes a Viernes 9:00-18:00 CLT</li>
                    <li>• <strong>Urgencias de privacidad:</strong> 24/7 por email</li>
                    <li>• <strong>Incidentes de seguridad:</strong> 24/7 respuesta inmediata</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-2">Datos de la Empresa</h5>
                  <ul className="space-y-1">
                    <li>• <strong>Razón Social:</strong> FinData Chile SpA</li>
                    <li>• <strong>Dirección:</strong> Santiago, Región Metropolitana, Chile</li>
                    <li>• <strong>DPO:</strong> Oficial de Protección de Datos certificado</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* CTA Final */}
        <div className="text-center mt-16 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Su Privacidad, Nuestra Prioridad</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Únase a miles de profesionales que confían en FinData Chile para obtener datos financieros 
              con la máxima protección de privacidad y seguridad de grado bancario.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/registro" 
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Shield className="h-4 w-4 mr-2" />
                Crear Cuenta Segura
              </Link>
              <Link 
                href="/tienda" 
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Ver Productos
              </Link>
              <a 
                href="mailto:privacidad@findatachile.com" 
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all duration-300"
              >
                <Mail className="h-4 w-4 mr-2" />
                Consultas de Privacidad
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
            <Link href="/terminos" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/tienda" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Explorar Productos
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Iniciar Sesión
            </Link>
            <a href="mailto:privacidad@findatachile.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Contactar DPO
            </a>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Esta política cumple con la Ley N° 19.628 de Chile, GDPR de la Unión Europea y CCPA de California. 
              <br />
              Última revisión legal: 7 de agosto de 2025 | Próxima revisión programada: febrero 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
