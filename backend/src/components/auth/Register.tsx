import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Sprout, AlertCircle } from "lucide-react";
import type { User } from "../../App";
import { toast } from "sonner@2.0.3";

interface RegisterProps {
  onRegister: (user: User) => void;
  onNavigate: (page: "login" | "landing") => void;
}

const departamentos = [
  "La Paz",
  "Cochabamba",
  "Santa Cruz",
  "Oruro",
  "Potosí",
  "Chuquisaca",
  "Tarija",
  "Beni",
  "Pando",
];

const municipiosPorDepartamento: Record<string, string[]> = {
  "Santa Cruz": [
    "Santa Cruz de la Sierra",
    "Montero",
    "Warnes",
    "Cotoca",
    "La Guardia",
  ],
  "La Paz": [
    "La Paz",
    "El Alto",
    "Achocalla",
    "Viacha",
    "Copacabana",
  ],
  Cochabamba: [
    "Cochabamba",
    "Quillacollo",
    "Sacaba",
    "Tiquipaya",
    "Colcapirhua",
  ],
};

export function Register({
  onRegister,
  onNavigate,
}: RegisterProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    departamento: "",
    municipio: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (
      !formData.nombre ||
      !formData.correo ||
      !formData.telefono ||
      !formData.password ||
      !formData.departamento ||
      !formData.municipio
    ) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      setError("Por favor ingresa un correo válido");
      return;
    }

    const newUser: User = {
      id: `emp${Date.now()}`,
      nombre: formData.nombre,
      correo: formData.correo,
      telefono: formData.telefono,
      rol: "emprendedor",
      departamento: formData.departamento,
      municipio: formData.municipio,
    };

    toast.success("Cuenta creada exitosamente!");
    onRegister(newUser);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset municipio if departamento changes
      if (field === "departamento") {
        updated.municipio = "";
      }
      return updated;
    });
  };

  const municipiosDisponibles = formData.departamento
    ? municipiosPorDepartamento[formData.departamento] || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl text-green-700">
              VERMER
            </span>
          </div>
          <h1 className="text-3xl mb-2 text-gray-900">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Regístrate como emprendedor rural
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre Completo *
                </Label>
                <Input
                  id="nombre"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) =>
                    handleChange("nombre", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="555-0123"
                  value={formData.telefono}
                  onChange={(e) =>
                    handleChange("telefono", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">
                Correo Electrónico *
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="tu@correo.com"
                value={formData.correo}
                onChange={(e) =>
                  handleChange("correo", e.target.value)
                }
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="departamento">
                  Departamento *
                </Label>
                <Select
                  value={formData.departamento}
                  onValueChange={(value) =>
                    handleChange("departamento", value)
                  }
                >
                  <SelectTrigger id="departamento">
                    <SelectValue placeholder="Selecciona departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((dep) => (
                      <SelectItem key={dep} value={dep}>
                        {dep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipio">Municipio *</Label>
                <Select
                  value={formData.municipio}
                  onValueChange={(value) =>
                    handleChange("municipio", value)
                  }
                  disabled={!formData.departamento}
                >
                  <SelectTrigger id="municipio">
                    <SelectValue placeholder="Selecciona municipio" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipiosDisponibles.map((mun) => (
                      <SelectItem key={mun} value={mun}>
                        {mun}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmar Contraseña *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange(
                      "confirmPassword",
                      e.target.value,
                    )
                  }
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Al registrarte, aceptas nuestros{" "}
                <a
                  href="#"
                  className="text-green-600 hover:text-green-700"
                >
                  Términos y Condiciones
                </a>{" "}
                y{" "}
                <a
                  href="#"
                  className="text-green-600 hover:text-green-700"
                >
                  Política de Privacidad
                </a>
                .
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Crear Cuenta
            </Button>

            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="text-green-600 hover:text-green-700"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </form>
        </Card>

        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate("landing")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}