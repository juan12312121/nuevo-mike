export interface Justificacion {
  id: number;
  asistencia_id: number;
  motivo: string;
  fecha_solicitud: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
}
