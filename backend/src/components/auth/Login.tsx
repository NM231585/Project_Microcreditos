import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Sprout, AlertCircle } from 'lucide-react';
import type { User } from '../../App';
import { toast } from 'sonner@2.0.3';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: (page: 'register' | 'landing') => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication
    if (!correo || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Simular usuarios de prueba
    if (correo === 'emprendedor@test.com' && password === 'test123') {
      onLogin({
        id: 'emp1',
        nombre: 'María González',
        correo: 'emprendedor@test.com',
        telefono: '555-0101',
        rol: 'emprendedor',
        departamento: 'Santa Cruz',
        municipio: 'Warnes'
      });
      toast.success('Bienvenida María!');
    } else if (correo === 'evaluador@test.com' && password === 'test123') {
      onLogin({
        id: 'eval1',
        nombre: 'Carlos Méndez',
        correo: 'evaluador@test.com',
        telefono: '555-0202',
        rol: 'evaluador'
      });
      toast.success('Bienvenido Carlos!');
    } else {
      setError('Credenciales incorrectas. Prueba: emprendedor@test.com / test123 o evaluador@test.com / test123');
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl text-green-700">VERMER</span>
          </div>
          <h1 className="text-3xl mb-2 text-gray-900">Iniciar Sesión</h1>
          <p className="text-gray-600">Ingresa a tu cuenta para continuar</p>
        </div>

        {!showRecovery ? (
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
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
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowRecovery(true)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Iniciar Sesión
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className="text-green-600 hover:text-green-700"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="text-blue-900 mb-2">Usuarios de prueba:</p>
                <p className="text-blue-700">Emprendedor: emprendedor@test.com / test123</p>
                <p className="text-blue-700">Evaluador: evaluador@test.com / test123</p>
              </div>
            </form>
          </Card>
        ) : (
          <Card className="p-8">
            <form onSubmit={handleRecovery} className="space-y-6">
              <div>
                <h2 className="text-xl mb-2 text-gray-900">Recuperar Contraseña</h2>
                <p className="text-gray-600">
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

        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('landing')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}