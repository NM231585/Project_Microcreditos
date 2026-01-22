import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  CreditCard, Building2, QrCode, CheckCircle, Loader2,
  X, AlertCircle
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cuota: {
    numero: number;
    monto: number;
    fechaVencimiento: string;
  };
  onPaymentSuccess: () => void;
}

type PaymentMethod = 'card' | 'transfer' | 'qr';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export function PaymentModal({ isOpen, onClose, cuota, onPaymentSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    // Simular procesamiento de pago (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPaymentStatus('success');
    
    // Esperar 1.5 segundos antes de cerrar y ejecutar callback
    setTimeout(() => {
      onPaymentSuccess();
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setPaymentStatus('idle');
    setCardData({ number: '', name: '', expiry: '', cvv: '' });
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pagar Cuota #{cuota.numero}</span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {paymentStatus === 'success' ? (
          <div className="py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h3>
            <p className="text-gray-600">Tu pago de ${cuota.monto.toFixed(2)} ha sido procesado correctamente.</p>
          </div>
        ) : (
          <>
            {/* Resumen de Pago */}
            <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-700">Monto a pagar</p>
                  <p className="text-3xl font-bold text-blue-900">${cuota.monto.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">Vencimiento</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {new Date(cuota.fechaVencimiento).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Selector de Método de Pago */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Selecciona método de pago</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedMethod('card')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    selectedMethod === 'card'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${selectedMethod === 'card' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${selectedMethod === 'card' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Tarjeta
                  </span>
                </button>

                <button
                  onClick={() => setSelectedMethod('transfer')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    selectedMethod === 'transfer'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building2 className={`w-6 h-6 ${selectedMethod === 'transfer' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${selectedMethod === 'transfer' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Transferencia
                  </span>
                </button>

                <button
                  onClick={() => setSelectedMethod('qr')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    selectedMethod === 'qr'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <QrCode className={`w-6 h-6 ${selectedMethod === 'qr' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${selectedMethod === 'qr' ? 'text-blue-600' : 'text-gray-600'}`}>
                    Código QR
                  </span>
                </button>
              </div>
            </div>

            {/* Formulario según método seleccionado */}
            <div className="mb-6">
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del titular
                    </label>
                    <input
                      type="text"
                      placeholder="JUAN PEREZ"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de expiración
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      <strong>Modo de demostración:</strong> Este es un pago simulado con fines educativos. No se procesará ningún cargo real.
                    </p>
                  </div>
                </div>
              )}

              {selectedMethod === 'transfer' && (
                <Card className="p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4">Datos para transferencia bancaria</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Banco</p>
                      <p className="font-semibold text-gray-900">Banco Nacional de Microcréditos</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Número de cuenta</p>
                      <p className="font-mono font-semibold text-gray-900">1234-5678-9012-3456</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Titular</p>
                      <p className="font-semibold text-gray-900">Sistema de Microcréditos S.A.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Concepto</p>
                      <p className="font-semibold text-gray-900">Cuota #{cuota.numero}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Realiza la transferencia y haz click en "Confirmar Pago" para registrar tu pago.
                    </p>
                  </div>
                </Card>
              )}

              {selectedMethod === 'qr' && (
                <div className="text-center">
                  <Card className="p-8 inline-block">
                    <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Escanea este código QR con tu app de pagos</p>
                    <p className="text-lg font-semibold text-gray-900">${cuota.monto.toFixed(2)}</p>
                  </Card>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Después de escanear y pagar, haz click en "Confirmar Pago".
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={paymentStatus === 'processing'}
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={paymentStatus === 'processing'}
              >
                {paymentStatus === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  selectedMethod === 'card' ? 'Procesar Pago' : 'Confirmar Pago'
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
