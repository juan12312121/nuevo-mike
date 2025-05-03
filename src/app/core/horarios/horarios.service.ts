// src/app/services/horarios.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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
}

export interface EnumsResponse {
  success: boolean;
  data: {
    diasSemana: string[];
    turnos: string[];
    tiposDuracion: string[];
  };
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
      .get<{ success: boolean; data: Horario[] }>(`${this.API_URL}/horarios/sql`)
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
      .post<{ success: boolean; data: Horario }>(`${this.API_URL}/horarios`, horario)
      .pipe(map(res => res.data));
  }

  /** Recupera los valores de los ENUMs (días, turnos y tipos de duración) */
  getEnums(): Observable<EnumsResponse> {
    return this.http
      .get<{ success: boolean; data: EnumsResponse }>(`${this.API_URL}/enums`)
      .pipe(map(res => res.data));
  }
}
