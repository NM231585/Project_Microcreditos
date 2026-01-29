// Type definitions for useAuth hook
export interface User {
  id: string;
  nombre: string;
  correo: string;
  rol: 'emprendedor' | 'evaluador' | 'administrador';
  telefono?: string;
  direccion?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (correo: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface RegisterData {
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
  direccion: string;
  tipoNegocio: string;
  descripcionNegocio: string;
}

declare module '../../hooks/useAuth' {
  export function useAuth(): AuthContextType;
}
