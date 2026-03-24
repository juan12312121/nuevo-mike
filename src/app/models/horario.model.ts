export interface Horario {
  id: number;
  asignacion_id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  grupo_id: number | null;
  grupo_nombre?: string;
  aula_id: number | null;
  aula_nombre?: string;
  turno: string;
  tipo_duracion: string;
  duracion_clase: number;
  tiempo_descanso?: number;
  profesor_nombre?: string;
  materia_nombre?: string;
}

export interface HorarioDetalle {
  horario_id: number;
  orden_dia: number;
  aula: string;
  carrera: string;
  checador: string;
  duracion_clase: number;
  facultad: string;
  hora_fin: string;
  hora_inicio: string;
  materia: string;
  profesor: string;
  tiempo_descanso_min: number;
  tipo_duracion: string;
  turno: string;
}

export interface DiaHorario {
  dia_semana?: string;
  horarios_del_dia: HorarioDetalle[];
}

export interface GrupoHorarios {
  grupo_id: number;
  grupo_nombre: string;
  horarios: DiaHorario[];
}

export interface HorarioDTO {
  horario_id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  turno: string;
  tipo_duracion: string;
  duracion_clase: number;
  tiempo_descanso_min: number;
  profesor: string;
  materia: string;
}

export interface EnumsResponse {
  diasSemana: string[];
  turnos: string[];
  tiposDuracion: string[];
}
