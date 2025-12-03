import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  DollarSign, FileText, Calendar, User, LogOut, 
  PlusCircle, Eye, Clock, CheckCircle, XCircle, AlertCircle, Sprout 
} from 'lucide-react';
import type { User, Solicitud, Cronograma } from '../../App';

interface DashboardProps {
  user: User;
  solicitudes: Solicitud[];
  cronogramas: Cronograma[];
  onLogout: () => void;
  onNavigate: (page: 'nueva-solicitud') => void;
  onVerCronograma: (solicitudId: string) => void;
}

export function EmprendedorDashboard({ 
  user, 
  solicitudes, 
  cronogramas,
  onLogout, 
  onNavigate,
  onVerCronograma 
}: DashboardProps) {
  const solicitudesAprobadas = solicitudes.filter(s => s.estado === 'aprobado');
  const totalCreditos = solicitudesAprobadas.reduce((sum, s) => 
    sum + (s.datosSolicitud?.monto || 0), 0
  );

  // Calcular próximos pagos
  const proximosPagos = solicitudesAprobadas.flatMap(sol => {
    const cronograma = cronogramas.find(c => c.id === sol.cronogramaId);
    if (!cronograma) return [];
    const proximaCuota = cronograma.cuotas.find(c => !c.pagado);
    if (!proximaCuota) return [];
    return [{
      solicitudId: sol.id,
      monto: proximaCuota.total,
      fecha: proximaCuota.fecha,
      numeroCuota: proximaCuota.numero
    }];
  }).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const getEstadoBadge = (estado: Solicitud['estado']) => {
    const configs = {
      borrador: { label: 'Borrador', variant: 'secondary' as const, icon: FileText },
      enviado: { label: 'Enviado', variant: 'default' as const, icon: Clock },
      en_evaluacion: { label: 'En Evaluación', variant: 'default' as const, icon: AlertCircle },
      aprobado: { label: 'Aprobado', variant: 'default' as const, icon: CheckCircle, className: 'bg-green-600' },
      rechazado: { label: 'Rechazado', variant: 'destructive' as const, icon: XCircle },
      devuelto: { label: 'Devuelto', variant: 'secondary' as const, icon: AlertCircle }
    };
    return configs[estado];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg text-gray-900">VERMER</h1>
              <p className="text-sm text-gray-600">Panel de Emprendedor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-900">{user.nombre}</p>
              <p className="text-xs text-gray-600">{user.correo}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Summary Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Créditos</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl text-gray-900">${totalCreditos.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{solicitudesAprobadas.length} aprobado(s)</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Solicitudes Activas</span>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl text-gray-900">{solicitudes.length}</p>
                <p className="text-xs text-gray-500 mt-1">Total de solicitudes</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Próximo Pago</span>
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                {proximosPagos.length > 0 ? (
                  <>
                    <p className="text-3xl text-gray-900">${proximosPagos[0].monto.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{proximosPagos[0].fecha}</p>
                  </>
                ) : (
                  <p className="text-lg text-gray-400">Sin pagos pendientes</p>
                )}
              </Card>
            </div>

            {/* Actions */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl mb-1 text-gray-900">¿Necesitas financiamiento?</h2>
                  <p className="text-gray-600">Crea una nueva solicitud de crédito en minutos</p>
                </div>
                <Button 
                  onClick={() => onNavigate('nueva-solicitud')}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Nueva Solicitud
                </Button>
              </div>
            </Card>

            {/* Solicitudes List */}
            <Card className="p-6">
              <h2 className="text-xl mb-4 text-gray-900">Mis Solicitudes</h2>
              
              {solicitudes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No tienes solicitudes aún</p>
                  <p className="text-sm mt-2">Crea tu primera solicitud para comenzar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {solicitudes.map((solicitud) => {
                    const estadoConfig = getEstadoBadge(solicitud.estado);
                    const IconEstado = estadoConfig.icon;
                    
                    return (
                      <div 
                        key={solicitud.id}
                        className="border rounded-lg p-4 hover:border-green-200 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant={estadoConfig.variant} className={estadoConfig.className}>
                                <IconEstado className="w-3 h-3 mr-1" />
                                {estadoConfig.label}
                              </Badge>
                              <span className="text-sm text-gray-500">ID: {solicitud.id}</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Monto: </span>
                                <span className="text-gray-900">
                                  ${solicitud.datosSolicitud?.monto.toLocaleString() || 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Plazo: </span>
                                <span className="text-gray-900">
                                  {solicitud.datosSolicitud?.plazoMeses || 'N/A'} meses
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Negocio: </span>
                                <span className="text-gray-900">
                                  {solicitud.datosNegocio?.tipo || 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Fecha: </span>
                                <span className="text-gray-900">{solicitud.fechaCreacion}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2">
                            {solicitud.estado === 'aprobado' && solicitud.cronogramaId && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => onVerCronograma(solicitud.id)}
                                className="w-full sm:w-auto"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Cronograma
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="text-gray-900">Mi Perfil</h3>
                  <p className="text-sm text-gray-600">Emprendedor</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Nombre:</span>
                  <p className="text-gray-900">{user.nombre}</p>
                </div>
                <div>
                  <span className="text-gray-600">Correo:</span>
                  <p className="text-gray-900 break-words">{user.correo}</p>
                </div>
                <div>
                  <span className="text-gray-600">Teléfono:</span>
                  <p className="text-gray-900">{user.telefono}</p>
                </div>
                <div>
                  <span className="text-gray-600">Ubicación:</span>
                  <p className="text-gray-900">{user.municipio}, {user.departamento}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Editar Perfil
              </Button>
            </Card>

            {proximosPagos.length > 0 && (
              <Card className="p-6">
                <h3 className="mb-4 text-gray-900">Próximos Pagos</h3>
                <div className="space-y-3">
                  {proximosPagos.slice(0, 3).map((pago, idx) => (
                    <div key={idx} className="border-l-4 border-orange-500 pl-3 py-2">
                      <p className="text-sm text-gray-900">${pago.monto.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">Cuota #{pago.numeroCuota}</p>
                      <p className="text-xs text-gray-500">{pago.fecha}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
              <h3 className="mb-2 text-gray-900">¿Necesitas Ayuda?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contáctanos si tienes dudas sobre tu solicitud o cronograma de pagos.
              </p>
              <Button variant="outline" className="w-full">
                Soporte
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}