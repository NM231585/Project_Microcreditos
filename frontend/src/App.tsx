import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import type { Solicitud, Page } from './types';
import { Landing } from "./components/Landing";
import { Register } from "./components/auth/Register";
import { EmprendedorDashboard } from "./components/dashboard/EmprendedorDashboard";
import { SolicitudForm } from "./components/solicitud/SolicitudForm";
import { AdminPanel } from "./components/admin/AdminPanel";
import { CronogramaView } from "./components/cronograma/CronogramaView";
import { Functionality } from "./components/funcionality/Funcionality";
import { Toaster } from "./components/ui/sonner";
import { solicitudesService } from "./services/api";
import { toast } from "sonner";

function App() {
  const { user, token, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState<string | null>(null);

  // Cargar solicitudes cuando hay usuario autenticado
  useEffect(() => {
    if (isAuthenticated && token && !authLoading) {
      loadSolicitudes();
    }
  }, [isAuthenticated, token, authLoading]);

  // Navegación automática después de login
  useEffect(() => {
    if (isAuthenticated && user && (currentPage === 'login' || currentPage === 'register' || currentPage === 'landing')) {
      setCurrentPage(user.rol === 'emprendedor' ? 'dashboard' : 'admin');
    }
  }, [isAuthenticated, user, currentPage]);

  const loadSolicitudes = async () => {
    if (!token) return;
    
    try {
      const response = await solicitudesService.getAll(token);
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      toast.error('Error al cargar solicitudes');
    }
  };

  const handleCreateSolicitud = async (solicitudData: any) => {
    if (!token) return;

    try {
      const response = await solicitudesService.create(token, solicitudData);
      toast.success('¡Solicitud creada exitosamente!');
      if (response.data.scoreAutomatico) {
        toast.info(`Score automático: ${response.data.scoreAutomatico}/100`);
      }
      await loadSolicitudes();
      setCurrentPage('dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear solicitud');
    }
  };

  const handleUpdateSolicitud = async (solicitudId: string, updates: Partial<Solicitud>) => {
    if (!token) return;

    try {
      await solicitudesService.update(token, solicitudId, updates);
      toast.success('Solicitud actualizada');
      await loadSolicitudes();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar solicitud');
    }
  };

  const handleAprobarSolicitud = async (solicitudId: string) => {
    if (!token) return;

    try {
      await solicitudesService.aprobar(token, solicitudId);
      toast.success('¡Solicitud aprobada y cronograma generado!');
      await loadSolicitudes();
    } catch (error: any) {
      toast.error(error.message || 'Error al aprobar solicitud');
    }
  };

  const handleVerCronograma = (solicitudId: string) => {
    setSelectedSolicitudId(solicitudId);
    setCurrentPage('cronograma');
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('landing');
    setSolicitudes([]);
  };

  const renderPage = () => {
    // Mostrar loading mientras se verifica autenticación
    if (authLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case "landing":
        return <Landing onNavigate={setCurrentPage} />;

      case "register":
        return <Register onNavigate={setCurrentPage} />;

      case "dashboard":
        return user ? (
          <EmprendedorDashboard
            user={user}
            solicitudes={solicitudes.filter((s) => s.emprendedorId === user.id)}
            onLogout={handleLogout}
            onNavigate={setCurrentPage}
            onVerCronograma={handleVerCronograma}
          />
        ) : null;

      case "nueva-solicitud":
        return user ? (
          <SolicitudForm
            user={user}
            onSubmit={handleCreateSolicitud}
            onCancel={() => setCurrentPage('dashboard')}
          />
        ) : null;

      case "admin":
        return user ? (
          <AdminPanel
            solicitudes={solicitudes}
            onLogout={handleLogout}
            onUpdateSolicitud={handleUpdateSolicitud}
            onAprobarSolicitud={handleAprobarSolicitud}
            onNavigate={setCurrentPage}
          />
        ) : null;

      case "cronograma":
        return user && selectedSolicitudId ? (
          <CronogramaView
            solicitudId={selectedSolicitudId}
            onBack={() =>
              setCurrentPage(user.rol === "emprendedor" ? "dashboard" : "admin")
            }
            userRole={user.rol}
          />
        ) : null;

      case "funcionality":
        return <Functionality onNavigate={setCurrentPage} />;

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