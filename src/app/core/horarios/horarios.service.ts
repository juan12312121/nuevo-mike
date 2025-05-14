// src/app/services/horarios.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

export interface Horario {
  id: number;
  asignacion_id: number;
  dia_semana: string;  // Agregado de nuevo
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

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  private API_URL = 'http://localhost:4000/api/horarios'; // URL base de la API

  constructor(private http: HttpClient) { }

  /** Obtiene todos los horarios usando la consulta SQL (LEFT JOIN) */
  getHorariosSQL(): Observable<Horario[]> {
    return this.http
      .get<{ success: boolean; data: Horario[] }>(`${this.API_URL}/`)
      .pipe(map(res => res.data));
  }

  /** Obtiene todos los horarios usando Sequelize normal */
  getHorarios(): Observable<Horario[]> {
    return this.http
      .get<{ success: boolean; data: Horario[] }>(`${this.API_URL}/horarios`)
      .pipe(map(res => res.data));
  }

  /** Crea un nuevo horario */
  createHorario(horario: Partial<Horario>): Observable<Horario> {
    return this.http
      .post<{ success: boolean; data: Horario }>(`${this.API_URL}`, horario)
      .pipe(map(res => res.data));
  }

  /** Recupera los valores de los ENUMs (días, turnos y tipos de duración) */
  getEnums(): Observable<EnumsResponse> {
    return this.http
      .get<{ success: boolean; data: EnumsResponse }>(`${this.API_URL}/enums`)
      .pipe(map(res => res.data));
  }

  /** Obtiene los horarios por usuario */
  getHorariosPorUsuario(usuarioId: number): Observable<any> {
    return this.http
      .get<{ success: boolean; horarios: any }>(`${this.API_URL}/usuario/${usuarioId}`)
      .pipe(map(res => res.horarios));
  }
  

  /** Obtiene los horarios por grupo */
  getHorariosPorGrupo(grupoId: number): Observable<any> {
    return this.http
      .get<{ success: boolean; horarios: any }>(`${this.API_URL}/grupo/${grupoId}`)
      .pipe(
        map(res => res.horarios),
        catchError(error => {
          console.error('Error al obtener los horarios:', error);
          return of([]); // Retorna un array vacío en caso de error
        })
      );
  }

  getGruposPorChecador(usuarioId: number): Observable<GrupoHorarios[]> {
    return this.http
      .get<{ success: boolean; data: GrupoHorarios[] }>(`${this.API_URL}/checador/${usuarioId}`)
      .pipe(
        map(res => res.data),
        catchError(err => {
          console.error('Error al obtener grupos por checador:', err);
          return of([] as GrupoHorarios[]);
        })
      );
  }
  
  
}

