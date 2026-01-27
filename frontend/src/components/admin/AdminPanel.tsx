import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import logo from "../../assets/9ff15ae8c40c117941b9a2e4108fd0cf3e6a7edf.png";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  FileText, TrendingUp, LogOut, Eye, Users,
  CheckCircle, XCircle, AlertCircle, RotateCcw, DollarSign, Sprout, Loader2 
} from 'lucide-react';
import { Logo } from '../Logo';
import type { Solicitud, Cronograma } from '../../types';
import { toast } from 'sonner';

interface AdminPanelProps {
  solicitudes: Solicitud[];
  cronogramas: Cronograma[];
  onLogout: () => void;
  onUpdateSolicitud: (id: string, updates: Partial<Solicitud>) => Promise<void>;
  onAprobarSolicitud: (id: string) => Promise<void>;
  onNavigate: (page: string) => void;
}

export function AdminPanel({ 
  solicitudes, 
  cronogramas,
  onLogout, 
  onUpdateSolicitud,
  onAprobarSolicitud 
}: AdminPanelProps) {
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [comentario, setComentario] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [loading, setLoading] = useState(false);

  const solicitudesPendientes = solicitudes.filter(s => 
    s.estado === 'enviado' || s.estado === 'en_evaluacion'
  );

  const solicitudesAprobadas = solicitudes.filter(s => s.estado === 'aprobado');
  const solicitudesRechazadas = solicitudes.filter(s => s.estado === 'rechazado');

  const totalDesembolsado = solicitudesAprobadas.reduce((sum, s) => 
    sum + (s.datosSolicitud?.monto || 0), 0
  );

  const handleVerDetalle = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowDialog(true);
    setComentario('');
  };

  const handleAprobar = async () => {
    if (selectedSolicitud) {
      setLoading(true);
      try {
        await onAprobarSolicitud(selectedSolicitud.id);
        setShowDialog(false);
      } catch (error) {
        // Error ya manejado en App.tsx
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRechazar = async () => {
    if (selectedSolicitud) {
      setLoading(true);
      try {
        await onUpdateSolicitud(selectedSolicitud.id, { estado: 'rechazado' });
        toast.error(`Solicitud rechazada`);
        setShowDialog(false);
      } catch (error) {
        // Error ya manejado en App.tsx
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDevolver = async () => {
    if (selectedSolicitud && comentario) {
      setLoading(true);
      try {
        await onUpdateSolicitud(selectedSolicitud.id, { estado: 'devuelto' });
        toast.info(`Solicitud devuelta para corrección`);
        setShowDialog(false);
      } catch (error) {
        // Error ya manejado en App.tsx
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Agrega un comentario para devolver la solicitud');
    }
  };

  const handleIniciarEvaluacion = async (id: string) => {
    setLoading(true);
    try {
      await onUpdateSolicitud(id, { estado: 'en_evaluacion' });
      toast.info('Evaluación iniciada');
    } catch (error) {
      // Error ya manejado
    } finally {
      setLoading(false);
    }
  };

  const getSolicitudesFiltradas = () => {
    if (filtroEstado === 'todas') return solicitudes;
    if (filtroEstado === 'pendientes') return solicitudesPendientes;
    return solicitudes.filter(s => s.estado === filtroEstado);
  };

  const getScoreBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 80) return <Badge className="bg-green-600">Score: {score} - Excelente</Badge>;
    if (score >= 60) return <Badge variant="default">Score: {score} - Bueno</Badge>;
    return <Badge variant="secondary">Score: {score} - Regular</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo responsivo */}
          <div>
              <img src={logo} alt="Logo" className="w-20" />
          </div>
          <Button variant="outline" size="sm" onClick={onLogout} className="text-xs sm:text-sm">
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Solicitudes Totales</span>
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl text-gray-900">{solicitudes.length}</p>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Pendientes</span>
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <p className="text-2xl sm:text-3xl text-gray-900">{solicitudesPendientes.length}</p>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Aprobadas</span>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <p className="text-2xl sm:text-3xl text-gray-900">{solicitudesAprobadas.length}</p>
          </Card>

          <Card className="p-4 sm:p-6 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Total Desembolsado</span>
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <p className="text-2xl sm:text-3xl text-gray-900">${totalDesembolsado.toLocaleString()}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="solicitudes" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="solicitudes" className="text-xs sm:text-sm">Solicitudes</TabsTrigger>
            <TabsTrigger value="reportes" className="text-xs sm:text-sm">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="solicitudes">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-2xl text-gray-900">Bandeja de Solicitudes</h2>
                <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                  <Button
                    variant={filtroEstado === 'todas' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroEstado('todas')}
                    className="text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Todas
                  </Button>
                  <Button
                    variant={filtroEstado === 'pendientes' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroEstado('pendientes')}
                    className="text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Pendientes ({solicitudesPendientes.length})
                  </Button>
                  <Button
                    variant={filtroEstado === 'aprobado' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroEstado('aprobado')}
                    className="text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Aprobadas
                  </Button>
                  <Button
                    variant={filtroEstado === 'rechazado' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroEstado('rechazado')}
                    className="text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    Rechazadas
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {getSolicitudesFiltradas().map((solicitud) => (
                  <div
                    key={solicitud.id}
                    className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={
                            solicitud.estado === 'aprobado' ? 'default' :
                            solicitud.estado === 'rechazado' ? 'destructive' :
                            'secondary'
                          } className={solicitud.estado === 'aprobado' ? 'bg-green-600' : ''}>
                            {solicitud.estado.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {getScoreBadge(solicitud.scoreAutomatico)}
                          <span className="text-sm text-gray-500">ID: {solicitud.id}</span>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Emprendedor:</span>
                            <p className="text-gray-900">{solicitud.emprendedorNombre}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Monto:</span>
                            <p className="text-gray-900">${solicitud.datosSolicitud?.monto.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Plazo:</span>
                            <p className="text-gray-900">{solicitud.datosSolicitud?.plazoMeses} meses</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Tipo:</span>
                            <p className="text-gray-900">{solicitud.datosNegocio?.tipo}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Ingreso:</span>
                            <p className="text-gray-900">${solicitud.datosNegocio?.ingresoMensual}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Ubicación:</span>
                            <p className="text-gray-900">
                              {solicitud.datosPersonales?.municipio}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Fecha:</span>
                            <p className="text-gray-900">{solicitud.fechaCreacion}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Documentos:</span>
                            <p className="text-gray-900">{solicitud.documentos?.length || 0} archivo(s)</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerDetalle(solicitud)}
                          className="flex-1 lg:flex-none"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalle
                        </Button>
                        {solicitud.estado === 'enviado' && (
                          <Button
                            size="sm"
                            onClick={() => handleIniciarEvaluacion(solicitud.id)}
                            className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700"
                          >
                            Iniciar Evaluación
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {getSolicitudesFiltradas().length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>No hay solicitudes en esta categoría</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reportes">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl mb-6 text-gray-900">Cartera por Estado</h2>
                <div className="space-y-4">
                  {[
                    { estado: 'Aprobadas', count: solicitudesAprobadas.length, color: 'bg-green-500' },
                    { estado: 'En Evaluación', count: solicitudesPendientes.length, color: 'bg-orange-500' },
                    { estado: 'Rechazadas', count: solicitudesRechazadas.length, color: 'bg-red-500' },
                  ].map((item) => (
                    <div key={item.estado} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-gray-700 flex-1">{item.estado}</span>
                      <span className="text-gray-900">{item.count}</span>
                      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color}`}
                          style={{ width: `${(item.count / solicitudes.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl mb-6 text-gray-900">Volumen por Región</h2>
                <div className="space-y-3">
                  {Array.from(new Set(solicitudes.map(s => s.datosPersonales?.departamento))).map(dep => {
                    const count = solicitudes.filter(s => s.datosPersonales?.departamento === dep).length;
                    return (
                      <div key={dep} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-gray-900">{dep}</span>
                        <Badge variant="secondary">{count} solicitudes</Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl mb-6 text-gray-900">Métricas Generales</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">Tasa de Aprobación</p>
                    <p className="text-2xl text-blue-900">
                      {solicitudes.length > 0 
                        ? Math.round((solicitudesAprobadas.length / solicitudes.length) * 100) 
                        : 0}%
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 mb-1">Monto Promedio</p>
                    <p className="text-2xl text-green-900">
                      ${solicitudesAprobadas.length > 0
                        ? Math.round(totalDesembolsado / solicitudesAprobadas.length)
                        : 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud</DialogTitle>
            <DialogDescription>
              Revisa la información completa y toma una decisión
            </DialogDescription>
          </DialogHeader>

          {selectedSolicitud && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">ID de Solicitud</p>
                  <p className="text-gray-900">{selectedSolicitud.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <Badge className="mt-1">{selectedSolicitud.estado}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="text-gray-900">{selectedSolicitud.fechaCreacion}</p>
                </div>
              </div>

              {/* Score */}
              {selectedSolicitud.scoreAutomatico && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">Score Automático</p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl text-blue-900">{selectedSolicitud.scoreAutomatico}</div>
                    <div className="flex-1">
                      <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600"
                          style={{ width: `${selectedSolicitud.scoreAutomatico}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Datos Personales */}
              <div>
                <h3 className="mb-3 text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Datos Personales
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Nombre:</span>
                    <p className="text-gray-900">{selectedSolicitud.datosPersonales?.nombre}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Cédula:</span>
                    <p className="text-gray-900">{selectedSolicitud.datosPersonales?.cedula}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Teléfono:</span>
                    <p className="text-gray-900">{selectedSolicitud.datosPersonales?.telefono}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Ubicación:</span>
                    <p className="text-gray-900">
                      {selectedSolicitud.datosPersonales?.municipio}, {selectedSolicitud.datosPersonales?.departamento}
                    </p>
                  </div>
                </div>
              </div>

              {/* Datos del Negocio */}
              <div>
                <h3 className="mb-3 text-gray-900 flex items-center gap-2">
                  <Sprout className="w-5 h-5" />
                  Datos del Negocio
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <p className="text-gray-900">{selectedSolicitud.datosNegocio?.tipo}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Descripción:</span>
                    <p className="text-gray-900">{selectedSolicitud.datosNegocio?.descripcion}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-600">Ingreso Mensual:</span>
                      <p className="text-gray-900">${selectedSolicitud.datosNegocio?.ingresoMensual}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Producción:</span>
                      <p className="text-gray-900">{selectedSolicitud.datosNegocio?.produccion}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos de Solicitud */}
              <div>
                <h3 className="mb-3 text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Solicitud de Crédito
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-600">Monto Solicitado:</span>
                      <p className="text-2xl text-gray-900">${selectedSolicitud.datosSolicitud?.monto.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Plazo:</span>
                      <p className="text-2xl text-gray-900">{selectedSolicitud.datosSolicitud?.plazoMeses} meses</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Motivo:</span>
                    <p className="text-gray-900">{selectedSolicitud.datosSolicitud?.motivo}</p>
                  </div>
                </div>
              </div>

              {/* Documentos */}
              <div>
                <h3 className="mb-3 text-gray-900">Documentos Adjuntos</h3>
                {selectedSolicitud.documentos && selectedSolicitud.documentos.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSolicitud.documentos.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{doc}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No se adjuntaron documentos</p>
                )}
              </div>

              {/* Comentario para devolver */}
              {selectedSolicitud.estado === 'en_evaluacion' && (
                <div>
                  <h3 className="mb-3 text-gray-900">Comentarios (opcional para devolver)</h3>
                  <Textarea
                    placeholder="Agrega comentarios sobre correcciones necesarias..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {/* Actions */}
              {/* Solicitud en estado BORRADOR o ENVIADO */}
              {(selectedSolicitud.estado === 'borrador' || selectedSolicitud.estado === 'enviado') && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleIniciarEvaluacion(selectedSolicitud.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Iniciando...
                      </>
                    ) : (
                      'Iniciar Evaluación'
                    )}
                  </Button>
                </div>
              )}

              {/* Solicitud en estado EN_EVALUACION */}
              {selectedSolicitud.estado === 'en_evaluacion' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleDevolver}
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4 mr-2" />
                    )}
                    Devolver
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRechazar}
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    Rechazar
                  </Button>
                  <Button
                    onClick={handleAprobar}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Aprobar
                  </Button>
                </div>
              )}

              {/* Solicitud APROBADA o RECHAZADA - Solo mostrar info */}
              {(selectedSolicitud.estado === 'aprobado' || selectedSolicitud.estado === 'rechazado') && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 text-center">
                    {selectedSolicitud.estado === 'aprobado' 
                      ? '✅ Esta solicitud ya fue aprobada' 
                      : '❌ Esta solicitud fue rechazada'}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}