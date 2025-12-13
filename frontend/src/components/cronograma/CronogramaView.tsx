import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Progress } from '../ui/progress';
import { 
  ChevronLeft, Calendar, DollarSign, CheckCircle, 
  Clock, TrendingUp, AlertCircle 
} from 'lucide-react';
import type { Solicitud, Cronograma } from '../../App';
import { toast } from 'sonner';

interface CronogramaViewProps {
  solicitud: Solicitud;
  cronograma: Cronograma;
  onBack: () => void;
  onMarcarPago: (cronogramaId: string, cuotaNumero: number) => void;
  userRole: 'emprendedor' | 'evaluador';
}

export function CronogramaView({ 
  solicitud, 
  cronograma, 
  onBack,
  onMarcarPago,
  userRole 
}: CronogramaViewProps) {
  const cuotasPagadas = cronograma.cuotas.filter(c => c.pagado).length;
  const totalCuotas = cronograma.cuotas.length;
  const progreso = (cuotasPagadas / totalCuotas) * 100;
  
  const totalPagado = cronograma.cuotas
    .filter(c => c.pagado)
    .reduce((sum, c) => sum + c.total, 0);

  const totalAPagar = cronograma.cuotas
    .reduce((sum, c) => sum + c.total, 0);

  const proximaCuota = cronograma.cuotas.find(c => !c.pagado);

  const handleMarcarPago = (cuotaNumero: number) => {
    onMarcarPago(cronograma.id, cuotaNumero);
    toast.success(`Pago de cuota #${cuotaNumero} registrado`);
  };

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
          <p className="text-gray-600">Solicitud #{solicitud.id} - {solicitud.emprendedorNombre}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Monto Total</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl text-gray-900">${solicitud.datosSolicitud?.monto.toLocaleString()}</p>
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
                <p className="text-3xl text-gray-900">${proximaCuota.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{proximaCuota.fecha}</p>
              </>
            ) : (
              <p className="text-lg text-green-600">Pagado</p>
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
                    <p className="text-orange-900">${proximaCuota.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-orange-700">Fecha de Vencimiento</span>
                    <p className="text-orange-900">{proximaCuota.fecha}</p>
                  </div>
                  <div>
                    <span className="text-orange-700">Capital + Interés</span>
                    <p className="text-orange-900">
                      ${proximaCuota.capital.toFixed(2)} + ${proximaCuota.interes.toFixed(2)}
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
              <p className="text-gray-900">${solicitud.datosSolicitud?.monto.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Plazo</span>
              <p className="text-gray-900">{solicitud.datosSolicitud?.plazoMeses} meses</p>
            </div>
            <div>
              <span className="text-gray-600">Tasa de Interés</span>
              <p className="text-gray-900">{cronograma.tasaInteres}% anual</p>
            </div>
            <div>
              <span className="text-gray-600">Tipo de Negocio</span>
              <p className="text-gray-900">{solicitud.datosNegocio?.tipo}</p>
            </div>
            <div>
              <span className="text-gray-600">Fecha de Aprobación</span>
              <p className="text-gray-900">{solicitud.fechaCreacion}</p>
            </div>
            <div>
              <span className="text-gray-600">Motivo</span>
              <p className="text-gray-900">{solicitud.datosSolicitud?.motivo.substring(0, 30)}...</p>
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
                  {userRole === 'emprendedor' && <TableHead className="text-center">Acción</TableHead>}
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
                        {cuota.fecha}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${cuota.capital.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${cuota.interes.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${cuota.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${cuota.saldo.toFixed(2)}</TableCell>
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
                    {userRole === 'emprendedor' && (
                      <TableCell className="text-center">
                        {!cuota.pagado && cuota.numero === proximaCuota?.numero && (
                          <Button
                            size="sm"
                            onClick={() => handleMarcarPago(cuota.numero)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Marcar Pago
                          </Button>
                        )}
                      </TableCell>
                    )}
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
                  ${cronograma.cuotas.reduce((sum, c) => sum + c.capital, 0).toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total Intereses</span>
                <p className="text-gray-900">
                  ${cronograma.cuotas.reduce((sum, c) => sum + c.interes, 0).toFixed(2)}
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
    </div>
  );
}
