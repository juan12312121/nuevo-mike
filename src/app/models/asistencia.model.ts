export interface Asistencia {
  id: number;
  asignacion_id: number;
  fecha: string;
  asistio: 'Asistió' | 'No Asistió' | 'Justificado';
  registrado_por_id: number;
}

export interface Justificacion {
  id: number;
  asistencia_id: number;
  motivo: string;
  fecha_solicitud: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
}
