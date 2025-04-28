import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsignacionMateriasService {

  private apiUrl = 'http://localhost:4000/api/asignaciones';  // URL de la API

  constructor(private http: HttpClient) { }

  // Obtener todas las asignaciones
  obtenerAsignaciones(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.apiUrl, { headers });
  }

  // Crear una nueva asignación
  crearAsignacion(profesor_id: number, materia_id: number): Observable<any> {
    const headers = this.getHeaders();
    const body = { profesor_id, materia_id };
    return this.http.post(this.apiUrl, body, { headers });
  }

  // Actualizar una asignación existente
  actualizarAsignacion(id: number, profesor_id: number, materia_id: number): Observable<any> {
    const headers = this.getHeaders();
    const body = { profesor_id, materia_id };
    return this.http.put(`${this.apiUrl}/${id}`, body, { headers });
  }

  // Eliminar una asignación
  eliminarAsignacion(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  // Función privada para obtener los headers con el token de autenticación
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de autenticación no disponible');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
