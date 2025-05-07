import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AsistenciaTemaService {
  private apiUrl = 'http://localhost:4000/api/asistencia-tema';

  constructor(private http: HttpClient) { }

  registrarAsistenciaYTema(datos: {
    asignacion_id: number;
    asistio: 'Asistió' | 'No Asistió' | 'Justificado';
    registrado_por_id: number;
    tema?: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }

  obtenerAsistencias(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 👇 Método para el nuevo endpoint:
  obtenerAsistenciasPorUsuario(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${userId}`);
  }

  obtenerTemasVistos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/temas-vistos`);  // Agregamos el endpoint específico para temas vistos
  }

  obtenerTemasVistosPorUsuario(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/temas-vistos/usuario/${userId}`);
  }
  
}
