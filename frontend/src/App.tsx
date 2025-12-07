import { useState, useEffect } from "react";
import { Landing } from "./components/Landing";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { EmprendedorDashboard } from "./components/dashboard/EmprendedorDashboard";
import { SolicitudForm } from "./components/solicitud/SolicitudForm";
import { AdminPanel } from "./components/admin/AdminPanel";
import { CronogramaView } from "./components/cronograma/CronogramaView";
import { Toaster } from "./components/ui/sonner";

type Page =
  | "landing"
  | "login"
  | "register"
  | "dashboard"
  | "nueva-solicitud"
  | "admin"
  | "cronograma";
type UserRole = "emprendedor" | "evaluador" | null;

export interface User {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: "emprendedor" | "evaluador";
  departamento?: string;
  municipio?: string;
}

export interface Solicitud {
  id: string;
  emprendedorId: string;
  emprendedorNombre: string;
  estado:
    | "borrador"
    | "enviado"
    | "en_evaluacion"
    | "aprobado"
    | "rechazado"
    | "devuelto";
  fechaCreacion: string;
  datosPersonales?: {
    nombre: string;
    cedula: string;
    telefono: string;
    direccion: string;
    departamento: string;
    municipio: string;
  };
  datosNegocio?: {
    tipo: string;
    descripcion: string;
    ingresoMensual: number;
    produccion: string;
  };
  datosSolicitud?: {
    monto: number;
    plazoMeses: number;
    motivo: string;
  };
  documentos?: string[];
  scoreAutomatico?: number;
  cronogramaId?: string;
}

export interface Cronograma {
  id: string;
  solicitudId: string;
  cuotas: Cuota[];
  tasaInteres: number;
}

export interface Cuota {
  numero: number;
  fecha: string;
  capital: number;
  interes: number;
  total: number;
  saldo: number;
  pagado: boolean;
}

function App() {
  const [currentPage, setCurrentPage] =
    useState<Page>("landing");
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(
    [],
  );
  const [cronogramas, setCronogramas] = useState<Cronograma[]>(
    [],
  );
  const [selectedSolicitudId, setSelectedSolicitudId] =
    useState<string | null>(null);

  // Initialize with mock data
  useEffect(() => {
    const mockSolicitudes: Solicitud[] = [
      {
        id: "1",
        emprendedorId: "emp1",
        emprendedorNombre: "María González",
        estado: "aprobado",
        fechaCreacion: "2025-10-15",
        datosPersonales: {
          nombre: "María González",
          cedula: "12345678",
          telefono: "555-0101",
          direccion: "Calle Principal 123",
          departamento: "Santa Cruz",
          municipio: "Warnes",
        },
        datosNegocio: {
          tipo: "Agricultura",
          descripcion: "Producción de hortalizas orgánicas",
          ingresoMensual: 2500,
          produccion: "500kg mensuales de verduras variadas",
        },
        datosSolicitud: {
          monto: 5000,
          plazoMeses: 12,
          motivo:
            "Ampliación de invernadero y compra de semillas",
        },
        scoreAutomatico: 85,
        cronogramaId: "cron1",
      },
      {
        id: "2",
        emprendedorId: "emp1",
        emprendedorNombre: "María González",
        estado: "en_evaluacion",
        fechaCreacion: "2025-11-01",
        datosPersonales: {
          nombre: "María González",
          cedula: "12345678",
          telefono: "555-0101",
          direccion: "Calle Principal 123",
          departamento: "Santa Cruz",
          municipio: "Warnes",
        },
        datosNegocio: {
          tipo: "Ganadería",
          descripcion: "Crianza de pollos",
          ingresoMensual: 3000,
          produccion: "200 pollos mensuales",
        },
        datosSolicitud: {
          monto: 3000,
          plazoMeses: 6,
          motivo:
            "Compra de alimento y mejora de instalaciones",
        },
        scoreAutomatico: 78,
      },
    ];
    setSolicitudes(mockSolicitudes);

    // Mock cronograma
    const mockCronograma: Cronograma = {
      id: "cron1",
      solicitudId: "1",
      tasaInteres: 12,
      cuotas: generateCuotas(5000, 12, 12),
    };
    setCronogramas([mockCronograma]);
  }, []);

  const generateCuotas = (
    monto: number,
    meses: number,
    tasaAnual: number,
  ): Cuota[] => {
    const tasaMensual = tasaAnual / 12 / 100;
    const cuotaFija =
      (monto *
        (tasaMensual * Math.pow(1 + tasaMensual, meses))) /
      (Math.pow(1 + tasaMensual, meses) - 1);
    const cuotas: Cuota[] = [];
    let saldoPendiente = monto;

    for (let i = 0; i < meses; i++) {
      const interes = saldoPendiente * tasaMensual;
      const capital = cuotaFija - interes;
      saldoPendiente -= capital;

      const fecha = new Date("2025-11-15");
      fecha.setMonth(fecha.getMonth() + i + 1);

      cuotas.push({
        numero: i + 1,
        fecha: fecha.toISOString().split("T")[0],
        capital: Math.round(capital * 100) / 100,
        interes: Math.round(interes * 100) / 100,
        total: Math.round(cuotaFija * 100) / 100,
        saldo:
          Math.round(Math.max(0, saldoPendiente) * 100) / 100,
        pagado: i < 2,
      });
    }

    return cuotas;
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.rol === "emprendedor") {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage("admin");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
  };

  const handleCreateSolicitud = (solicitud: Solicitud) => {
    setSolicitudes((prev) => [...prev, solicitud]);
    setCurrentPage("dashboard");
  };

  const handleUpdateSolicitud = (
    solicitudId: string,
    updates: Partial<Solicitud>,
  ) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === solicitudId ? { ...s, ...updates } : s,
      ),
    );
  };

  const handleAprobarSolicitud = (solicitudId: string) => {
    const solicitud = solicitudes.find(
      (s) => s.id === solicitudId,
    );
    if (solicitud?.datosSolicitud) {
      const cronograma: Cronograma = {
        id: `cron${Date.now()}`,
        solicitudId: solicitudId,
        tasaInteres: 12,
        cuotas: generateCuotas(
          solicitud.datosSolicitud.monto,
          solicitud.datosSolicitud.plazoMeses,
          12,
        ),
      };
      setCronogramas((prev) => [...prev, cronograma]);
      handleUpdateSolicitud(solicitudId, {
        estado: "aprobado",
        cronogramaId: cronograma.id,
      });
    }
  };

  const handleVerCronograma = (solicitudId: string) => {
    setSelectedSolicitudId(solicitudId);
    setCurrentPage("cronograma");
  };

  const handleMarcarPago = (
    cronogramaId: string,
    cuotaNumero: number,
  ) => {
    setCronogramas((prev) =>
      prev.map((c) => {
        if (c.id === cronogramaId) {
          return {
            ...c,
            cuotas: c.cuotas.map((cuota) =>
              cuota.numero === cuotaNumero
                ? { ...cuota, pagado: true }
                : cuota,
            ),
          };
        }
        return c;
      }),
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <Landing onNavigate={setCurrentPage} />;
      case "login":
        return (
          <Login
            onLogin={handleLogin}
            onNavigate={setCurrentPage}
          />
        );
      case "register":
        return (
          <Register
            onRegister={(user) => {
              setCurrentUser(user);
              setCurrentPage("dashboard");
            }}
            onNavigate={setCurrentPage}
          />
        );
      case "dashboard":
        return currentUser ? (
          <EmprendedorDashboard
            user={currentUser}
            solicitudes={solicitudes.filter(
              (s) => s.emprendedorId === currentUser.id,
            )}
            cronogramas={cronogramas}
            onLogout={handleLogout}
            onNavigate={setCurrentPage}
            onVerCronograma={handleVerCronograma}
          />
        ) : null;
      case "nueva-solicitud":
        return currentUser ? (
          <SolicitudForm
            user={currentUser}
            onSubmit={handleCreateSolicitud}
            onCancel={() => setCurrentPage("dashboard")}
          />
        ) : null;
      case "admin":
        return currentUser ? (
          <AdminPanel
            solicitudes={solicitudes}
            cronogramas={cronogramas}
            onLogout={handleLogout}
            onUpdateSolicitud={handleUpdateSolicitud}
            onAprobarSolicitud={handleAprobarSolicitud}
            onNavigate={setCurrentPage}
          />
        ) : null;
      case "cronograma":
        const solicitud = solicitudes.find(
          (s) => s.id === selectedSolicitudId,
        );
        const cronograma = cronogramas.find(
          (c) => c.id === solicitud?.cronogramaId,
        );
        return currentUser && solicitud && cronograma ? (
          <CronogramaView
            solicitud={solicitud}
            cronograma={cronograma}
            onBack={() =>
              setCurrentPage(
                currentUser.rol === "emprendedor"
                  ? "dashboard"
                  : "admin",
              )
            }
            onMarcarPago={handleMarcarPago}
            userRole={currentUser.rol}
          />
        ) : null;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}

export default App;