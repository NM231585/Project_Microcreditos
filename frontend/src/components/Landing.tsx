import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, Clock, Shield, ChevronRight, Sprout } from 'lucide-react';
import { Logo } from './Logo';
import logo from "../assets/9ff15ae8c40c117941b9a2e4108fd0cf3e6a7edf.png";

// Props de la componente Landing 
interface LandingProps {
  onNavigate: (page: 'login' | 'register' | 'funcionality') => void;
}

export function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo responsivo: isotipo en móvil, imaginotipo en tablet+ */}
        
           <img src={logo} alt="Logo" className="w-20" />
                  
          <p className="hidden text-center sm:text-sm md:text-sm lg:text-sm sm:block">
             Sembrando confianza, cosechando el futuro de tu emprendimiento rural.</p>
          <div className="flex gap-2 sm:gap-3 ">
            <Button variant="ghost" onClick={() => onNavigate('login')} className="text-sm sm:text-base px-3 sm:px-4">
              Iniciar Sesión
            </Button>
            <Button onClick={() => onNavigate('register')} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base px-3 sm:px-4">
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 text-gray-900 px-4">
            Financiamiento Digital para Emprendedores Rurales
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Accede a microcréditos de forma rápida y sencilla. Impulsa tu negocio con el apoyo que necesitas, diseñado especialmente para pequeños productores y emprendedores rurales.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
              onClick={() => onNavigate('register')}
            >
              Solicitar Crédito
              <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto"
              onClick={() => onNavigate('funcionality')}
            >
              Ver Cómo Funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl text-center mb-8 sm:mb-12 text-gray-900 px-4">
            Proceso Simple en 3 Pasos
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-6 text-center border-2 hover:border-green-200 transition-colors">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl text-green-700">1</span>
              </div>
              <h3 className="text-lg sm:text-xl mb-3 text-gray-900">Regístrate</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Crea tu cuenta en minutos con tus datos básicos y la información de tu negocio.
              </p>
            </Card>
            <Card className="p-6 text-center border-2 hover:border-green-200 transition-colors">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl text-green-700">2</span>
              </div>
              <h3 className="text-lg sm:text-xl mb-3 text-gray-900">Solicita tu Crédito</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Completa el formulario con el monto que necesitas y adjunta los documentos requeridos.
              </p>
            </Card>
            <Card className="p-6 text-center border-2 hover:border-green-200 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl text-green-700">3</span>
              </div>
              <h3 className="text-lg sm:text-xl mb-3 text-gray-900">Recibe tu Aprobación</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Nuestro equipo evalúa tu solicitud y recibes una respuesta en 48 horas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl text-center mb-8 sm:mb-12 text-gray-900 px-4">
            ¿Por Qué Elegirnos?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex gap-3 sm:gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="mb-1 sm:mb-2 text-gray-900">Proceso 100% Digital</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  Sin necesidad de visitas presenciales. Todo desde tu celular o computadora.
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="mb-1 sm:mb-2 text-gray-900">Respuesta Rápida</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  Evaluación en 48 horas y desembolso inmediato tras aprobación.
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="mb-1 sm:mb-2 text-gray-900">Tasas Justas</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  Intereses competitivos diseñados para apoyar el crecimiento de tu negocio.
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="mb-1 sm:mb-2 text-gray-900">Enfoque Rural</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  Entendemos las necesidades específicas de emprendedores y productores rurales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl text-center mb-8 sm:mb-12 text-gray-900 px-4">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <Card className="p-4 sm:p-6">
              <h4 className="mb-1 sm:mb-2 text-gray-900">¿Qué documentos necesito?</h4>
              <p className="text-sm sm:text-base text-gray-600">
                Necesitas tu cédula de identidad, comprobantes de ingreso del negocio y fotos del emprendimiento o producción.
              </p>
            </Card>
            <Card className="p-4 sm:p-6">
              <h4 className="mb-1 sm:mb-2 text-gray-900">¿Cuánto tiempo toma la aprobación?</h4>
              <p className="text-sm sm:text-base text-gray-600">
                Nuestro equipo evalúa cada solicitud en un plazo máximo de 48 horas hábiles.
              </p>
            </Card>
            <Card className="p-4 sm:p-6">
              <h4 className="mb-1 sm:mb-2 text-gray-900">¿Cuál es el monto mínimo y máximo?</h4>
              <p className="text-sm sm:text-base text-gray-600">
                Ofrecemos créditos desde $500 hasta $10,000, dependiendo de tu capacidad de pago y necesidades.
              </p>
            </Card>
            <Card className="p-4 sm:p-6">
              <h4 className="mb-1 sm:mb-2 text-gray-900">¿Qué plazos de pago existen?</h4>
              <p className="text-sm sm:text-base text-gray-600">
                Puedes elegir plazos desde 3 hasta 24 meses, con cuotas mensuales fijas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <Logo variant="full" size="sm" className="mb-4 brightness-0 invert" />
              <p className="text-sm sm:text-base text-gray-400">
                Impulsando el desarrollo rural a través del financiamiento accesible.
              </p>
            </div>
            <div>
              <h4 className="mb-3 sm:mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li>📞 +503 2222-2222</li>
                <li>✉️ info@vemer.com</li>
                <li>📍 El Salvador, San Salvador</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 sm:mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 sm:mb-4">Síguenos</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-400">
            <p>&copy; 2025 VEMER. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}