export interface User {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: "emprendedor" | "evaluador";
  departamento?: string;
  municipio?: string;
  dui?: string;
}
export interface Solicitud {
  id: string;
  emprendedorId: string;
  emprendedorNombre: string;
  estado: "borrador" | "enviado" | "en_evaluacion" | "aprobado" | "rechazado" | "devuelto";
  fechaCreacion: string;
  datosPersonales?: any;
  datosNegocio?: any;
  datosSolicitud?: any;
  documentos?: string[];
  scoreAutomatico?: number;
  cronogramaId?: string;
}
export interface Cronograma {
  id: string;
  solicitudId: string;
  cuotas: Cuota[];
  tasaInteres: number;
}
export interface Cuota {
  numero: number;
  fecha: string;
  capital: number;
  interes: number;
  total: number;
  saldo: number;
  pagado: boolean;
}
export type Page = "landing" | "login" | "register" | "dashboard" | "nueva-solicitud" | "admin" | "cronograma"| "funcionality";
