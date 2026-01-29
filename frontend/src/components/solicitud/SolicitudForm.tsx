import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  User, Briefcase, DollarSign, Paperclip, 
  ChevronLeft, ChevronRight, Check, AlertCircle, Loader2 
} from 'lucide-react';
import type { User as UserType } from '../../types';
import { toast } from 'sonner';

interface SolicitudFormProps {
  user: UserType;
  onSubmit: (solicitudData: any) => Promise<void>;
  onCancel: () => void;
}

type Step = 1 | 2 | 3 | 4;

const tiposNegocio = [
  'Agricultura',
  'Ganadería',
  'Artesanía',
  'Comercio',
  'Servicios',
  'Manufactura',
  'Otro'
];

export function SolicitudForm({ user, onSubmit, onCancel }: SolicitudFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Paso 1: Datos Personales
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: user.nombre,
    cedula: '',
    telefono: user.telefono,
    direccion: '',
    departamento: user.departamento || '',
    municipio: user.municipio || '',
    dui: user.dui || '',
  });

  // Paso 2: Datos del Negocio
  const [datosNegocio, setDatosNegocio] = useState({
    tipo: '',
    descripcion: '',
    ingresoMensual: '',
    produccion: ''
  });

  // Paso 3: Datos de Solicitud
  const [datosSolicitud, setDatosSolicitud] = useState({
    monto: '',
    plazoMeses: '',
    motivo: ''
  });

  // Paso 4: Documentos
  const [documentos, setDocumentos] = useState<string[]>([]);

  const steps = [
    { number: 1, title: 'Datos Personales', icon: User },
    { number: 2, title: 'Datos del Negocio', icon: Briefcase },
    { number: 3, title: 'Monto y Plazo', icon: DollarSign },
    { number: 4, title: 'Documentos', icon: Paperclip }
  ];

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!datosPersonales.cedula) newErrors.cedula = 'La cédula es requerida';
      if (!datosPersonales.direccion) newErrors.direccion = 'La dirección es requerida';
      if (!datosPersonales.departamento) newErrors.departamento = 'El departamento es requerido';
      if (!datosPersonales.municipio) newErrors.municipio = 'El municipio es requerido';
    } else if (step === 2) {
      if (!datosNegocio.tipo) newErrors.tipo = 'El tipo de negocio es requerido';
      if (!datosNegocio.descripcion) newErrors.descripcion = 'La descripción es requerida';
      if (!datosNegocio.ingresoMensual || parseFloat(datosNegocio.ingresoMensual) <= 0) {
        newErrors.ingresoMensual = 'Ingresa un ingreso mensual válido';
      }
      if (!datosNegocio.produccion) newErrors.produccion = 'Describe tu producción';
    } else if (step === 3) {
      const monto = parseFloat(datosSolicitud.monto);
      const plazo = parseInt(datosSolicitud.plazoMeses);
      
      if (!datosSolicitud.monto || monto < 500 || monto > 10000) {
        newErrors.monto = 'El monto debe estar entre $500 y $10,000';
      }
      if (!datosSolicitud.plazoMeses || plazo < 3 || plazo > 24) {
        newErrors.plazoMeses = 'El plazo debe estar entre 3 y 24 meses';
      }
      if (!datosSolicitud.motivo) newErrors.motivo = 'Explica el motivo del crédito';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((currentStep + 1) as Step);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      setDocumentos(prev => [...prev, ...fileNames]);
      toast.success(`${fileNames.length} documento(s) agregado(s)`);
    }
  };

  const handleSubmit = async (asBorrador: boolean = false) => {
    if (!asBorrador && documentos.length === 0) {
      toast.error('Por favor adjunta al menos un documento');
      return;
    }

    setLoading(true);

    try {
      // Formato de datos para el backend
      const solicitudData = {
        datos_personales: datosPersonales,
        datos_negocio: {
          tipo: datosNegocio.tipo,
          descripcion: datosNegocio.descripcion,
          ingresoMensual: parseFloat(datosNegocio.ingresoMensual),
          produccion: datosNegocio.produccion
        },
        datos_solicitud: {
          monto: parseFloat(datosSolicitud.monto),
          plazoMeses: parseInt(datosSolicitud.plazoMeses),
          motivo: datosSolicitud.motivo
        },
        documentos: documentos,
        estado: asBorrador ? 'borrador' : 'enviado'
      };

      await onSubmit(solicitudData);
      // El toast de éxito y score se muestra en App.tsx
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar solicitud');
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onCancel} className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl mb-2 text-gray-900">Nueva Solicitud de Crédito</h1>
          <p className="text-gray-600">Completa los siguientes pasos para solicitar tu microcrédito</p>
        </div>

        {/* Progress */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Paso {currentStep} de 4</span>
              <span className="text-sm text-gray-600">{progress.toFixed(0)}% completado</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div 
                  key={step.number}
                  className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-green-50 border-2 border-green-500' : 
                    isCompleted ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isActive ? 'bg-green-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs text-center ${isActive ? 'text-green-700' : 'text-gray-600'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Form Content */}
        <Card className="p-8">
          {/* Step 1: Datos Personales */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2 text-gray-900">Datos Personales</h2>
                <p className="text-gray-600">Confirma y completa tu información personal</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={datosPersonales.nombre}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cedula">Dui</Label>
                  <Input
                    id="cedula"
                    value={datosPersonales.dui}
                    disabled
                    
                  />
                  {errors.cedula && <p className="text-sm text-red-600">{errors.cedula}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={datosPersonales.telefono}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    placeholder="Calle, número, zona"
                    value={datosPersonales.direccion}
                    onChange={(e) => setDatosPersonales(prev => ({ ...prev, direccion: e.target.value }))}
                    className={errors.direccion ? 'border-red-500' : ''}
                  />
                  {errors.direccion && <p className="text-sm text-red-600">{errors.direccion}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    value={datosPersonales.departamento}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="municipio">Municipio</Label>
                  <Input
                    id="municipio"
                    value={datosPersonales.municipio}
                    disabled
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Datos del Negocio */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2 text-gray-900">Datos del Negocio</h2>
                <p className="text-gray-600">Cuéntanos sobre tu emprendimiento o producción</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Negocio *</Label>
                  <Select 
                    value={datosNegocio.tipo} 
                    onValueChange={(value) => setDatosNegocio(prev => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger id="tipo" className={errors.tipo ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona el tipo de negocio" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposNegocio.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tipo && <p className="text-sm text-red-600">{errors.tipo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción del Negocio *</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Describe tu negocio, qué produces o vendes, desde cuándo..."
                    rows={4}
                    value={datosNegocio.descripcion}
                    onChange={(e) => setDatosNegocio(prev => ({ ...prev, descripcion: e.target.value }))}
                    className={errors.descripcion ? 'border-red-500' : ''}
                  />
                  {errors.descripcion && <p className="text-sm text-red-600">{errors.descripcion}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ingresoMensual">Ingreso Mensual Promedio ($) *</Label>
                    <Input
                      id="ingresoMensual"
                      type="number"
                      placeholder="2500"
                      value={datosNegocio.ingresoMensual}
                      onChange={(e) => setDatosNegocio(prev => ({ ...prev, ingresoMensual: e.target.value }))}
                      className={errors.ingresoMensual ? 'border-red-500' : ''}
                    />
                    {errors.ingresoMensual && <p className="text-sm text-red-600">{errors.ingresoMensual}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="produccion">Producción/Volumen *</Label>
                    <Input
                      id="produccion"
                      placeholder="ej: 500kg mensuales"
                      value={datosNegocio.produccion}
                      onChange={(e) => setDatosNegocio(prev => ({ ...prev, produccion: e.target.value }))}
                      className={errors.produccion ? 'border-red-500' : ''}
                    />
                    {errors.produccion && <p className="text-sm text-red-600">{errors.produccion}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Monto y Plazo */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2 text-gray-900">Monto y Plazo</h2>
                <p className="text-gray-600">Define cuánto necesitas y en qué plazo lo pagarás</p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="monto">Monto Solicitado ($) *</Label>
                    <Input
                      id="monto"
                      type="number"
                      placeholder="5000"
                      value={datosSolicitud.monto}
                      onChange={(e) => setDatosSolicitud(prev => ({ ...prev, monto: e.target.value }))}
                      className={errors.monto ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500">Rango: $500 - $10,000</p>
                    {errors.monto && <p className="text-sm text-red-600">{errors.monto}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plazoMeses">Plazo (meses) *</Label>
                    <Input
                      id="plazoMeses"
                      type="number"
                      placeholder="12"
                      value={datosSolicitud.plazoMeses}
                      onChange={(e) => setDatosSolicitud(prev => ({ ...prev, plazoMeses: e.target.value }))}
                      className={errors.plazoMeses ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500">Rango: 3 - 24 meses</p>
                    {errors.plazoMeses && <p className="text-sm text-red-600">{errors.plazoMeses}</p>}
                  </div>
                </div>

                {datosSolicitud.monto && datosSolicitud.plazoMeses && !errors.monto && !errors.plazoMeses && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="mb-1">Cuota mensual estimada: <strong>${((parseFloat(datosSolicitud.monto) * 1.12) / parseInt(datosSolicitud.plazoMeses)).toFixed(2)}</strong></p>
                      <p className="text-xs text-gray-600">Tasa de interés: 12% anual</p>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo del Crédito *</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Explica para qué utilizarás el crédito: compra de equipos, insumos, ampliación..."
                    rows={4}
                    value={datosSolicitud.motivo}
                    onChange={(e) => setDatosSolicitud(prev => ({ ...prev, motivo: e.target.value }))}
                    className={errors.motivo ? 'border-red-500' : ''}
                  />
                  {errors.motivo && <p className="text-sm text-red-600">{errors.motivo}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documentos */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl mb-2 text-gray-900">Documentos</h2>
                <p className="text-gray-600">Adjunta los documentos requeridos para tu solicitud</p>
              </div>

              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="mb-2">Documentos requeridos:</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Cédula de identidad (ambos lados)</li>
                      <li>Comprobantes de ingreso del negocio</li>
                      <li>Fotos del emprendimiento/producción</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                  <Paperclip className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-green-600 hover:text-green-700">Haz clic para subir archivos</span>
                    <span className="text-gray-600"> o arrastra y suelta</span>
                  </Label>
                  <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG hasta 10MB</p>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                {documentos.length > 0 && (
                  <div className="space-y-2">
                    <Label>Documentos adjuntos ({documentos.length})</Label>
                    <div className="space-y-2">
                      {documentos.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Paperclip className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-900 flex-1">{doc}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDocumentos(prev => prev.filter((_, i) => i !== idx))}
                          >
                            Eliminar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-700" />
                <AlertDescription className="text-yellow-700">
                  Puedes guardar la solicitud como borrador y completarla más tarde, o enviarla ahora para evaluación.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-3">
              {currentStep === 4 && (
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Borrador'
                  )}
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => handleSubmit(false)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Enviar Solicitud
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
