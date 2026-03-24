import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AsistenciaTemaService {
private apiUrl = `${environment.apiUrl}/asistencia-tema`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  registrarAsistenciaYTema(datos: {
    asignacion_id: number;
    asistio: 'Asistió' | 'No Asistió' | 'Justificado';
    registrado_por_id: number;
    tema?: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, datos, { headers: this.getHeaders() });
  }

  obtenerAsistencias(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // 👇 Método para el nuevo endpoint:
  obtenerAsistenciasPorUsuario(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${userId}`, { headers: this.getHeaders() });
  }

  obtenerTemasVistos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/temas-vistos`, { headers: this.getHeaders() });  // Agregamos el endpoint específico para temas vistos
  }

  obtenerTemasVistosPorUsuario(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/temas-vistos/usuario/${userId}`, { headers: this.getHeaders() });
  }
  
}
