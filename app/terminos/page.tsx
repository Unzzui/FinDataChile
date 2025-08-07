import { Metadata } from 'next'
import Link from 'next/link'
import { FileSpreadsheet, Shield, Scale, CreditCard, Users, Lock, Gavel, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - FinData Chile',
  description: 'Términos y condiciones de uso de la plataforma FinData Chile - Datos financieros empresariales de Chile',
  keywords: 'términos, condiciones, legal, FinData Chile, datos financieros, CMF',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Back Button */}
            <div className="mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Volver al inicio
              </Link>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Scale className="h-12 w-12" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Términos y Condiciones
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4 leading-relaxed">
              Marco legal para el uso de la plataforma FinData Chile
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Última actualización: 7 de agosto de 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Navegación rápida</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#aceptacion" className="text-gray-600 hover:text-blue-600 transition-colors">Aceptación</a>
              <a href="#servicio" className="text-gray-600 hover:text-blue-600 transition-colors">Servicio</a>
              <a href="#pagos" className="text-gray-600 hover:text-blue-600 transition-colors">Pagos</a>
              <a href="#uso" className="text-gray-600 hover:text-blue-600 transition-colors">Uso</a>
              <a href="#contacto" className="text-gray-600 hover:text-blue-600 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Protección Legal</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Marco jurídico completo que protege tanto a usuarios como a la plataforma, 
              asegurando un uso responsable y transparente.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Pagos Seguros</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Procesamiento seguro mediante Transbank, con protección completa 
              de datos financieros y políticas claras de reembolso.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Derechos del Usuario</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Derechos claros sobre el uso de datos, acceso a productos 
              y garantías de servicio con soporte especializado.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          
          {/* Sección 1 */}
          <section id="aceptacion" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl shrink-0">
                <Gavel className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  1. Aceptación de los Términos
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4"></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Al acceder y utilizar la plataforma <strong>FinData Chile</strong>, usted acepta automáticamente estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, debe cesar inmediatamente el uso de nuestros servicios.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Importante</h4>
                    <p className="text-blue-800 text-sm">
                      Estos términos constituyen un acuerdo legal vinculante entre usted y FinData Chile. 
                      Le recomendamos leer detenidamente todo el documento antes de usar nuestros servicios.
                    </p>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Al crear una cuenta, confirma haber leído y aceptado estos términos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>El uso continuado implica aceptación de futuras modificaciones</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Debe ser mayor de 18 años o contar con autorización legal</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Sección 2 */}
          <section id="servicio" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-xl shrink-0">
                <FileSpreadsheet className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  2. Descripción del Servicio
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4"></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>FinData Chile</strong> es una plataforma tecnológica especializada que proporciona acceso 
                organizado y procesado a información financiera pública de empresas chilenas, disponible 
                originalmente en la Comisión para el Mercado Financiero (CMF).
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Servicios Incluidos
                  </h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                      <span>Estados financieros en formato Excel optimizado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                      <span>Datos sectoriales y comparativos de mercado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                      <span>Información actualizada periódicamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></span>
                      <span>Herramientas de análisis financiero</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-500" />
                    Modalidades de Acceso
                  </h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                      <span>Compras individuales por empresa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                      <span>Suscripciones mensuales y anuales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                      <span>Paquetes sectoriales especializados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                      <span>Acceso empresarial con múltiples usuarios</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">Fuente de Información</h4>
                    <p className="text-amber-800 text-sm">
                      Toda la información financiera proviene de fuentes públicas oficiales (CMF, SVS). 
                      FinData Chile se encarga únicamente del procesamiento, organización y presentación 
                      de estos datos para facilitar su análisis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Secciones 3-10 mejoradas */}
          <section id="registro" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl shrink-0">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  3. Registro y Cuenta de Usuario
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Para acceder a nuestros servicios premium, debe crear una cuenta proporcionando información 
                precisa, completa y actualizada. La veracidad de estos datos es fundamental para 
                garantizar la seguridad y calidad del servicio.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Sus Responsabilidades
                  </h4>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Mantener absoluta confidencialidad de credenciales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Proporcionar información veraz y actualizada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Notificar inmediatamente uso no autorizado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Asumir responsabilidad por actividades en su cuenta</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-500" />
                    Nuestros Compromisos
                  </h4>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>Protección avanzada de datos personales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>Cifrado de extremo a extremo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>Monitoreo 24/7 de seguridad</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>Soporte técnico especializado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="pagos" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-xl shrink-0">
                <CreditCard className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  4. Pagos y Facturación
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-4"></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Seguridad Transbank</h4>
                  <p className="text-sm text-gray-600">Procesamiento 100% seguro con tecnología bancaria certificada</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Múltiples Métodos</h4>
                  <p className="text-sm text-gray-600">Tarjetas de crédito, débito y transferencias bancarias</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Garantía 7 días</h4>
                  <p className="text-sm text-gray-600">Política de reembolso completo dentro de 7 días</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Información Importante sobre Precios
                </h4>
                <ul className="space-y-2 text-blue-100">
                  <li>• Todos los precios están expresados en <strong>pesos chilenos (CLP)</strong></li>
                  <li>• <strong>IVA incluido</strong> en todos los productos y servicios</li>
                  <li>• Los pagos son procesados <strong>inmediatamente</strong> tras confirmación</li>
                  <li>• <strong>Factura electrónica</strong> enviada automáticamente por email</li>
                  <li>• Reembolsos procesados en <strong>5-7 días hábiles</strong></li>
                </ul>
              </div>
            </div>
          </section>

          <section id="uso" className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-orange-100 rounded-xl shrink-0">
                <AlertTriangle className="h-7 w-7 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  5. Uso Permitido y Prohibiciones
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4"></div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-green-700 mb-4 flex items-center gap-2 text-lg">
                    <CheckCircle className="h-6 w-6" />
                    Usos Permitidos y Recomendados
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-green-900">Análisis Financiero Profesional</h5>
                        <p className="text-sm text-green-800">Due diligence, evaluación crediticia, análisis de inversiones</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-green-900">Investigación de Mercado</h5>
                        <p className="text-sm text-green-800">Estudios sectoriales, benchmarking competitivo, análisis de tendencias</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-green-900">Uso Académico y Educativo</h5>
                        <p className="text-sm text-green-800">Investigación universitaria, casos de estudio, material educativo</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-700 mb-4 flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-6 w-6" />
                    Actividades Estrictamente Prohibidas
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-red-900">Reventa o Redistribución</h5>
                        <p className="text-sm text-red-800">Comercializar, sublicenciar o distribuir datos sin autorización expresa</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-red-900">Acceso No Autorizado</h5>
                        <p className="text-sm text-red-800">Intentar vulnerar seguridad, hacer ingeniería inversa o acceder ilegalmente</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="font-medium text-red-900">Compartir Credenciales</h5>
                        <p className="text-sm text-red-800">Facilitar acceso a terceros mediante credenciales compartidas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contacto" className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                  <Scale className="h-8 w-8" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-3">¿Necesita Asistencia Legal?</h2>
              <p className="text-blue-100 text-lg">Nuestro equipo está disponible para resolver sus consultas</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="font-semibold text-white mb-4">Contacto Directo</h4>
                <div className="space-y-3 text-blue-100">
                  <p><strong className="text-white">Email Legal:</strong> legal@findatachile.com</p>
                  <p><strong className="text-white">Soporte General:</strong> soporte@findatachile.com</p>
                  <p><strong className="text-white">Dirección:</strong> Santiago, Chile</p>
                  <p><strong className="text-white">Horario:</strong> Lunes a Viernes, 9:00 - 18:00 CLT</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="font-semibold text-white mb-4">Tiempo de Respuesta</h4>
                <div className="space-y-3 text-blue-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span><strong className="text-white">Consultas urgentes:</strong> 24 horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span><strong className="text-white">Consultas generales:</strong> 48 horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span><strong className="text-white">Temas legales:</strong> 72 horas</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* CTA Final */}
        <div className="text-center mt-16 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Listo para comenzar?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Al aceptar estos términos, tendrá acceso a la plataforma más completa de datos financieros de Chile
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/registro" 
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Crear Cuenta Gratuita
            </Link>
            <Link 
              href="/tienda" 
              className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              Ver Productos
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
            <Link href="/privacidad" className="text-gray-600 hover:text-blue-600 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/tienda" className="text-gray-600 hover:text-blue-600 transition-colors">
              Explorar Productos
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
