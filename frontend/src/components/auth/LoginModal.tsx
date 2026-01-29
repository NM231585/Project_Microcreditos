import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Sprout } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export function LoginModal({ 
  open, 
  onOpenChange, 
  onLoginSuccess,
  onNavigateToRegister 
}: LoginModalProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.correo || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login(formData.correo, formData.password);
      toast.success('¡Bienvenido!');
      onOpenChange(false);
      onLoginSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      toast.error('Por favor ingresa tu correo electrónico');
      return;
    }

    // Simulación de envío de correo de recuperación
    toast.success('Se ha enviado un enlace de recuperación a tu correo');
    setShowForgotPassword(false);
    setForgotEmail('');
  };

  const handleClose = () => {
    setFormData({ correo: '', password: '', rememberMe: false });
    setShowForgotPassword(false);
    setForgotEmail('');
    onOpenChange(false);
  };

  const handleRegisterClick = () => {
    handleClose();
    onNavigateToRegister();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-green-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {showForgotPassword ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
            </span>
          </DialogTitle>
        </DialogHeader>

        {!showForgotPassword ? (
          <>
            <p className="text-sm text-gray-600 -mt-2">
              Accede a tu cuenta para gestionar tus microcréditos
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  disabled={loading}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, rememberMe: checked as boolean })
                    }
                    disabled={loading}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer select-none"
                  >
                    Recordar sesión
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                  disabled={loading}
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg shadow-green-200 transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={handleRegisterClick}
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                  disabled={loading}
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Forgot Password Form */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg -mt-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico
                </Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 h-12"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Enviar Enlace
                </Button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Nota:</strong> Esta es una función de demostración. En producción, se enviaría un correo real con un enlace de recuperación.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}