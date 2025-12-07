import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from '../Logo';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

interface LoginProps {
  onNavigate: (page: 'register' | 'landing' | 'dashboard' | 'admin') => void;
}

export function Login({ onNavigate }: LoginProps) {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!correo || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const result = await login(correo, password);
      
      if (result.success) {
        toast.success(`¡Bienvenido ${result.data.nombre}!`);
        // Navegar según el rol
        if (result.data.rol === 'emprendedor') {
          onNavigate('dashboard');
        } else {
          onNavigate('admin');
        }
      } else {
        setError(result.error || 'Credenciales incorrectas');
        toast.error('Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      toast.error('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryEmail) {
      toast.success('Se ha enviado un enlace de recuperación a tu correo');
      setShowRecovery(false);
      setRecoveryEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex mb-4">
            <div className="block sm:hidden">
              <Logo variant="icon" size="lg" />
            </div>
            <div className="hidden sm:block">
              <Logo variant="full" size="lg" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-gray-900">Iniciar Sesión</h1>
          <p className="text-sm sm:text-base text-gray-600">Ingresa a tu cuenta para continuar</p>
        </div>

        {!showRecovery ? (
          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowRecovery(true)}
                  className="text-sm text-green-600 hover:text-green-700"
                  disabled={loading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm sm:text-base text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className="text-green-600 hover:text-green-700"
                    disabled={loading}
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </form>
          </Card>
        ) : (
          <Card className="p-6 sm:p-8">
            <form onSubmit={handleRecovery} className="space-y-5 sm:space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl mb-2 text-gray-900">Recuperar Contraseña</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recovery-email">Correo Electrónico</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRecovery(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Enviar Enlace
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="text-center mt-4 sm:mt-6">
          <button
            onClick={() => onNavigate('landing')}
            className="text-sm sm:text-base text-gray-600 hover:text-gray-900"
            disabled={loading}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}