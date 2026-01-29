// Type definitions for API services
import type { Solicitud, Cronograma, Cuota } from '../types';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface SolicitudesService {
  getAll: (token: string) => Promise<ApiResponse<Solicitud[]>>;
  getById: (token: string, id: string) => Promise<ApiResponse<Solicitud>>;
  create: (token: string, data: any) => Promise<ApiResponse<Solicitud>>;
  update: (token: string, id: string, data: Partial<Solicitud>) => Promise<ApiResponse<Solicitud>>;
  aprobar: (token: string, id: string) => Promise<ApiResponse<Solicitud>>;
  rechazar: (token: string, id: string, motivo: string) => Promise<ApiResponse<Solicitud>>;
}

export interface CronogramasService {
  getBySolicitud: (token: string, solicitudId: string) => Promise<ApiResponse<Cronograma>>;
  marcarCuotaPagada: (token: string, cronogramaId: number, cuotaId: number) => Promise<ApiResponse<Cuota>>;
}

declare module '../../services/api' {
  export const solicitudesService: SolicitudesService;
  export const cronogramasService: CronogramasService;
}
