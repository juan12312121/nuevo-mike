import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Asegúrate de que esta sea la URL de tu API para crear una justificación
const API_URL = 'http://localhost:4000/api/justificaciones'; 

@Injectable({
  providedIn: 'root'
})
export class JustificacionesService {

  constructor(private http: HttpClient) { }

  /**
   * Método para crear una justificación.
   * @param justificacion - Datos de la justificación a crear
   * @returns Observable con la respuesta de la API
   */
  crearJustificacion(justificacion: any): Observable<any> {
    return this.http.post(API_URL, justificacion);
  }

  obtenerJustificacionPorAsistencia(asistencia_id: number): Observable<any> {
    return this.http.get(`${API_URL}/${asistencia_id}`);
  }
}
