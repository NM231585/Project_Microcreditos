import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, Clock, Shield, ChevronRight, Sprout } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: 'login' | 'register') => void;
}

export function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-green-700">VERMER</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => onNavigate('login')}>
              Iniciar Sesión
            </Button>
            <Button onClick={() => onNavigate('register')} className="bg-green-600 hover:bg-green-700">
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl mb-6 text-gray-900">
            Financiamiento Digital para Emprendedores Rurales
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Accede a microcréditos de forma rápida y sencilla. Impulsa tu negocio con el apoyo que necesitas, diseñado especialmente para pequeños productores y emprendedores rurales.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-lg px-8"
              onClick={() => onNavigate('register')}
            >
              Solicitar Crédito
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
            >
              Ver Cómo Funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="container mx-auto px-4 py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">
            Proceso Simple en 3 Pasos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center border-2 hover:border-green-200 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-700">1</span>
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Regístrate</h3>
              <p className="text-gray-600">
                Crea tu cuenta en minutos con tus datos básicos y la información de tu negocio.
              </p>
            </Card>
            <Card className="p-6 text-center border-2 hover:border-green-200 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-700">2</span>
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Solicita tu Crédito</h3>
              <p className="text-gray-600">
                Completa el formulario con el monto que necesitas y adjunta los documentos requeridos.
              </p>
            </Card>
            <Card className="p-6 text-center border-2 hover:border-green-200 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-700">3</span>
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Recibe tu Aprobación</h3>
              <p className="text-gray-600">
                Nuestro equipo evalúa tu solicitud y recibes una respuesta en 48 horas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">
            ¿Por Qué Elegirnos?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="mb-2 text-gray-900">Proceso 100% Digital</h4>
                <p className="text-gray-600">
                  Sin necesidad de visitas presenciales. Todo desde tu celular o computadora.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
              <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="mb-2 text-gray-900">Respuesta Rápida</h4>
                <p className="text-gray-600">
                  Evaluación en 48 horas y desembolso inmediato tras aprobación.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="mb-2 text-gray-900">Tasas Justas</h4>
                <p className="text-gray-600">
                  Intereses competitivos diseñados para apoyar el crecimiento de tu negocio.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg hover:bg-white/50 transition-colors">
              <Sprout className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="mb-2 text-gray-900">Enfoque Rural</h4>
                <p className="text-gray-600">
                  Entendemos las necesidades específicas de emprendedores y productores rurales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-4 py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl text-center mb-12 text-gray-900">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            <Card className="p-6">
              <h4 className="mb-2 text-gray-900">¿Qué documentos necesito?</h4>
              <p className="text-gray-600">
                Necesitas tu cédula de identidad, comprobantes de ingreso del negocio y fotos del emprendimiento o producción.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="mb-2 text-gray-900">¿Cuánto tiempo toma la aprobación?</h4>
              <p className="text-gray-600">
                Nuestro equipo evalúa cada solicitud en un plazo máximo de 48 horas hábiles.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="mb-2 text-gray-900">¿Cuál es el monto mínimo y máximo?</h4>
              <p className="text-gray-600">
                Ofrecemos créditos desde $500 hasta $10,000, dependiendo de tu capacidad de pago y necesidades.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="mb-2 text-gray-900">¿Qué plazos de pago existen?</h4>
              <p className="text-gray-600">
                Puedes elegir plazos desde 3 hasta 24 meses, con cuotas mensuales fijas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">VERMER</span>
              </div>
              <p className="text-gray-400">
                Impulsando el desarrollo rural a través del financiamiento accesible.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +591 800-12345</li>
                <li>✉️ info@vermer.com</li>
                <li>📍 Santa Cruz, Bolivia</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Síguenos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 VERMER. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}