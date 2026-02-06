import type { Page } from "../../types";
import { Button } from "../ui/button";
import { Logo } from "../Logo";
import image2 from "../images/PrincipalImg.webp";
import logo from "../../assets/9ff15ae8c40c117941b9a2e4108fd0cf3e6a7edf.png";
import pago from "../images/pago.jpeg";

interface FunctionalityProps {
  onNavigate: (page: Page) => void;
}

export function Functionality({ onNavigate }: FunctionalityProps) {
  const pasos = [
    {
      id: 1,
      titulo: "Crea tu cuenta",
      descripcion:
        "Regístrate en pocos minutos con tus datos básicos y verifica tu identidad de forma segura.",
      icono: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      titulo: "Completa tu perfil",
      descripcion:
        "Sube la documentación necesaria y completa tu información financiera para la evaluación.",
      icono: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8" />
          <path d="M14 19l2 2l4 -4" />
          <path d="M9 8h4" />
          <path d="M9 12h2" />
        </svg>
      ),
    },
    {
      id: 3,
      titulo: "Solicita tu crédito",
      descripcion:
        "Elige el monto, el plazo de pago y envía tu solicitud. Recibirás una respuesta en tiempo récord.",
      icono: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      titulo: "Recibe tu dinero",
      descripcion:
        "Una vez aprobada, transferimos el dinero directamente a tu cuenta bancaria de inmediato.",
      icono: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];
  return (
    <body className="min-w-[320px] ">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo responsivo: isotipo en móvil, imaginotipo en tablet+ */}
          <div>
            <img src={logo} alt="Logo" className="w-20" />
          </div>
          <p className="hidden text-center sm:text-sm md:text-sm lg:text-sm sm:block">
            Sembrando confianza, cosechando el futuro de tu emprendimiento
            rural.
          </p>

          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => onNavigate("login")}
              className="text-sm sm:text-base px-3 sm:px-4"
            >
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => onNavigate("register")}
              className="bg-green-600 hover:bg-green-700 text-sm sm:text-base px-3 sm:px-4"
            >
              Registrarse
            </Button>
          </div>
        </div>
      </header>
      <section className="py-6 px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-2 min-w-[320px]">
        <div className="max-w-7xl xl:max-w-8xl 2xl:max-w-[1600px] bg-gray-50 p-6 sm:p-10 md:p-12 lg:p-10 xl:p-8 shadow-2xl rounded-xl mx-auto">
          {/* Hero con fondo */}
          <div
            className="text-center mb-12 w-full bg-cover bg-center rounded-lg p-7 sm:p-10 md:p-16 lg:p-12 xl:p-10"
            style={{
              backgroundImage: `
          linear-gradient(rgba(34, 100, 34, 0.85), rgba(34, 100, 34, 0.85)),
          url(${image2})
        `,
            }}
          >
            <img
              src={logo}
              alt="Logo"
              className="w-50 sm:w-55 md:w-48 lg:w-64 mx-auto mb-3"
            />
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white max-w-5xl mx-auto">
              Financiamos el futuro del campo. En Vermer apoyamos a
              emprendedores y productores rurales con microcréditos a medida
              para que sus proyectos nunca dejen de crecer.
            </p>
          </div>

          {/* Título */}
          <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl font-bold text-center text-green-600 mb-4">
            ¿Cómo Funciona Nuestra Plataforma?
          </h3>
          <p className="text-center text-gray-700 mb-8 text-base sm:text-lg md:text-xl lg:text-2xl">
            Obtén tu crédito en cuatro sencillos pasos, sin complicaciones ni
            filas.
          </p>

          {/* Grid de pasos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {pasos.map((paso) => (
              <div
                key={paso.id}
                className="relative bg-white p-6 sm:p-8 lg:p-6 xl:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="absolute top-3 right-3 text-3xl sm:text-4xl md:text-5xl font-bold text-green-600">
                  0{paso.id}
                </div>
                <div className="relative">
                  <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                    {paso.icono}
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2">
                    {paso.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed">
                    {paso.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Botón CTA */}
          <div className="mt-10 sm:mt-16 text-center mt-10 mb-10">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-6 
      sm:px-8 lg:px-10 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1
      text-sm sm:text-base md:text-lg lg:text-xl"
              onClick={() => onNavigate("register")}
            >
              Comenzar mi solicitud ahora
            </button>
          </div>
          <section className=" py-12 px-6 md:px-12 rounded-lg ">
            {" "}
            <div className="max-w-3xl mx-auto text-center">
              {" "}
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl font-bold text-center text-green-600 mb-4">
                {" "}
                ¿Cómo evaluamos las solicitudes de crédito?{" "}
              </h2>{" "}
              <p className="text-gray-600 mb-10">
                {" "}
                Ofrecemos una plataforma "llave en mano" diseñada
                específicamente para la realidad rural. No es solo un
                formulario, es un motor de evaluación crediticia adaptado:{" "}
              </p>{" "}
            </div>{" "}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {" "}
              {/* Paso 1 */}{" "}
              <div className="flex flex-col items-center text-center">
                {" "}
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-green-600 rounded-full text-xl font-bold mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-user-dollar"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h3" />
                    <path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
                    <path d="M19 21v1m0 -8v1" />
                  </svg>
                </div>{" "}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {" "}
                  Perfilado Inteligente{" "}
                </h3>{" "}
                <p className="text-gray-600 text-sm">
                  {" "}
                  Capturamos datos que los bancos ignoran. Además de identidad y
                  domicilio, registramos el volumen de producción en kg .{" "}
                </p>{" "}
              </div>{" "}
              {/* Paso 2 */}{" "}
              <div className="flex flex-col items-center text-center">
                {" "}
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-green-600 rounded-full text-xl font-bold mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-building-bank"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 21l18 0" />
                    <path d="M3 10l18 0" />
                    <path d="M5 6l7 -3l7 3" />
                    <path d="M4 10l0 11" />
                    <path d="M20 10l0 11" />
                    <path d="M8 14l0 3" />
                    <path d="M12 14l0 3" />
                    <path d="M16 14l0 3" />
                  </svg>
                </div>{" "}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {" "}
                  Capacidad de pago{" "}
                </h3>{" "}
                <p className="text-gray-600 text-sm">
                  {" "}
                  Analizamos tus ingresos y gastos para determinar si puedes
                  asumir el crédito, asi como el plazo que se ajusta a tu flujo
                  de caja.{" "}
                </p>{" "}
              </div>{" "}
              {/* Paso 3 */}{" "}
              <div className="flex flex-col items-center text-center">
                {" "}
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-green-600 rounded-full text-xl font-bold mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-credit-card"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -8" />
                    <path d="M3 10l18 0" />
                    <path d="M7 15l.01 0" />
                    <path d="M11 15l2 0" />
                  </svg>
                </div>{" "}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {" "}
                  Metodos de Pago{" "}
                </h3>{" "}
                <p className="text-gray-600 text-sm">
                  {" "}
                  VEMER integra una pasarela de pagos completa. El usuario
                  recibe su dinero en cuenta, y para pagar sus cuotas mensuales,
                  le damos todas las facilidades modernas{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="mt-12 text-center">
              {" "}
              <p className="text-gray-700 font-medium">
                {" "}
                Con estos pasos buscamos ofrecerte un crédito responsable y
                adaptado a tus necesidades.{" "}
              </p>{" "}
            </div>{" "}
            <div className="mt-12 text-center px-50 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Ejemplo visual del proceso{" "}
              </h3>
              <p className="text-center text-gray-600">
                Si pides $1,000 a 12 meses: Tu cuota es fija (siempre pagas lo
                mismo). Al principio, tu cuota cubre más intereses, y al final,
                pagas casi puro capital. Tasa: 12% anual (1% mensual). Total
                transparencia en tu tabla de amortización."
              </p>
              <img src={pago} alt="" />
            </div>
          </section>

          <div className="text-center mt-7 sm:mt-9">
            <button
              onClick={() => onNavigate("landing")}
              className="text-xl sm:text-xl text-gray-600 hover:text-gray-900 hover:underline"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </section>
    </body>
  );
}
