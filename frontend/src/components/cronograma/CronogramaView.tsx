import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { 
  ChevronLeft, Calendar, DollarSign, CheckCircle, 
  Clock, TrendingUp, AlertCircle, Loader2, Wallet 
} from 'lucide-react';
import type { Cronograma, Cuota } from '../../types';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import { cronogramasService } from '../../services/api';
import { PaymentModal } from '../payment/PaymentModal';

interface CronogramaViewProps {
  solicitudId: string;
  onBack: () => void;
  userRole: 'emprendedor' | 'evaluador';
}

export function CronogramaView({ 
  solicitudId, 
  onBack,
  userRole 
}: CronogramaViewProps) {
  const { token } = useAuth();
  const [cronograma, setCronograma] = useState<Cronograma | null>(null);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedCuota, setSelectedCuota] = useState<Cuota | null>(null);

  useEffect(() => {
    loadCronograma();
  }, [solicitudId]);

  const loadCronograma = async () => {
    if (!token) {
      console.error('No token available');
      return;
    }
    
    console.log('Loading cronograma for solicitudId:', solicitudId);
    setLoading(true);
    try {
      const response = await cronogramasService.getBySolicitud(token, solicitudId);
      console.log('Cronograma response:', response);
      setCronograma(response.data);
    } catch (error: any) {
      console.error('Error loading cronograma:', error);
      toast.error('Error al cargar cronograma: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarPago = async (cuotaId: number) => {
    if (!token || !cronograma) return;

    setProcesando(true);
    try {
      await cronogramasService.marcarCuotaPagada(token, cronograma.id, cuotaId);
      toast.success(`Pago de cuota registrado`);
      await loadCronograma(); // Recargar cronograma
    } catch (error: any) {
      toast.error(error.message || 'Error al marcar pago');
    } finally {
      setProcesando(false);
    }
  };

  const handleOpenPayment = (cuota: Cuota) => {
    setSelectedCuota(cuota);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedCuota) return;
    await handleMarcarPago(selectedCuota.id);
    setPaymentModalOpen(false);
    setSelectedCuota(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando cronograma...</p>
        </div>
      </div>
    );
  }

  if (!cronograma) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">No se encontró el cronograma</p>
          <Button onClick={onBack} className="mt-4">Volver</Button>
        </div>
      </div>
    );
  }

  const cuotasPagadas = cronograma.cuotas.filter(c => c.pagado).length;
  const totalCuotas = cronograma.cuotas.length;
  const progreso = (cuotasPagadas / totalCuotas) * 100;
  
  const totalPagado = cronograma.cuotas
    .filter(c => c.pagado)
    .reduce((sum, c) => sum + Number(c.total), 0);

  const totalAPagar = cronograma.cuotas
    .reduce((sum, c) => sum + Number(c.total), 0);

  const proximaCuota = cronograma.cuotas.find(c => !c.pagado);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl mb-2 text-gray-900">Cronograma de Pagos</h1>
          <p className="text-gray-600">Solicitud #{solicitudId}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monto Total</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl text-gray-900">${cronograma.montoTotal.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Capital prestado</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total a Pagar</span>
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl text-gray-900">${totalAPagar.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Capital + Intereses</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progreso</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl text-gray-900">{cuotasPagadas}/{totalCuotas}</p>
            <p className="text-xs text-gray-500 mt-1">Cuotas pagadas</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Próximo Pago</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            {proximaCuota ? (
              <>
                <p className="text-3xl text-gray-900">${Number(proximaCuota.total).toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(proximaCuota.fechaVencimiento).toLocaleDateString()}</p>
              </>
            ) : (
              <p className="text-lg text-green-600">¡Pagado!</p>
            )}
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl text-gray-900">Progreso de Pago</h2>
            <Badge className="bg-green-600">{progreso.toFixed(0)}% Completado</Badge>
          </div>
          <Progress value={progreso} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Pagado: ${totalPagado.toFixed(2)}</span>
            <span>Pendiente: ${(totalAPagar - totalPagado).toFixed(2)}</span>
          </div>
        </Card>

        {/* Próxima Cuota Alert */}
        {proximaCuota && (
          <Card className="p-6 mb-8 bg-orange-50 border-orange-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="mb-2 text-orange-900">Próximo Pago Pendiente</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-orange-700">Cuota #{proximaCuota.numero}</span>
                    <p className="text-orange-900">${Number(proximaCuota.total).toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-orange-700">Fecha de Vencimiento</span>
                    <p className="text-orange-900">{new Date(proximaCuota.fechaVencimiento).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-orange-700">Capital + Interés</span>
                    <p className="text-orange-900">
                      ${Number(proximaCuota.capital).toFixed(2)} + ${Number(proximaCuota.interes).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Loan Details */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl mb-4 text-gray-900">Detalles del Crédito</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-gray-600">Monto del Crédito</span>
              <p className="text-gray-900">${cronograma.montoTotal.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Plazo</span>
              <p className="text-gray-900">{cronograma.plazoMeses} meses</p>
            </div>
            <div>
              <span className="text-gray-600">Tasa de Interés</span>
              <p className="text-gray-900">{cronograma.tasaInteres}% anual</p>
            </div>
          </div>
        </Card>

        {/* Payment Schedule Table */}
        <Card className="p-6">
          <h2 className="text-xl mb-4 text-gray-900">Tabla de Amortización</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Cuota</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Capital</TableHead>
                  <TableHead className="text-right">Interés</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cronograma.cuotas.map((cuota) => (
                  <TableRow 
                    key={cuota.numero}
                    className={cuota.pagado ? 'bg-green-50' : ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {cuota.pagado && <CheckCircle className="w-4 h-4 text-green-600" />}
                        <span>#{cuota.numero}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(cuota.fechaVencimiento).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${Number(cuota.capital).toFixed(2)}</TableCell>
                    <TableCell className="text-right">${Number(cuota.interes).toFixed(2)}</TableCell>
                    <TableCell className="text-right">${Number(cuota.total).toFixed(2)}</TableCell>
                    <TableCell className="text-right">${Number(cuota.saldo).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      {cuota.pagado ? (
                        <Badge className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Pagado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {!cuota.pagado && cuota.numero === proximaCuota?.numero && (
                        <div className="flex gap-2 justify-center">
                          {userRole === 'emprendedor' && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenPayment(cuota)}
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={procesando}
                            >
                              <Wallet className="w-4 h-4 mr-2" />
                              Pagar en Línea
                            </Button>
                          )}
                          {userRole === 'evaluador' && (
                            <Button
                              size="sm"
                              onClick={() => handleMarcarPago(cuota.id)}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={procesando}
                            >
                              {procesando ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Procesando...
                                </>
                              ) : (
                                'Marcar Pago'
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Row */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Capital</span>
                <p className="text-gray-900">
                  ${cronograma.cuotas.reduce((sum, c) => sum + Number(c.capital), 0).toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total Intereses</span>
                <p className="text-gray-900">
                  ${cronograma.cuotas.reduce((sum, c) => sum + Number(c.interes), 0).toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total a Pagar</span>
                <p className="text-lg text-gray-900">${totalAPagar.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-600">Total Pagado</span>
                <p className="text-lg text-green-600">${totalPagado.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Footer */}
        <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
          <h3 className="mb-2 text-blue-900">Información Importante</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Los pagos se aplican primero a intereses y luego a capital</li>
            <li>Las cuotas vencen el día indicado de cada mes</li>
            <li>Los pagos anticipados ayudan a reducir el saldo e intereses futuros</li>
            <li>Contacta a nuestro equipo si tienes dudas sobre tu cronograma</li>
          </ul>
        </Card>
      </div>

      {/* Payment Modal */}
      {selectedCuota && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedCuota(null);
          }}
          cuota={{
            numero: selectedCuota.numero,
            monto: Number(selectedCuota.total),
            fechaVencimiento: selectedCuota.fechaVencimiento
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
