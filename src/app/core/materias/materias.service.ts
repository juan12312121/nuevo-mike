import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MateriasService {
  private apiUrl = 'http://localhost:4000/api/materias'; // URL de tu API backend

  constructor(private http: HttpClient) { }

  // Método para obtener los encabezados con el token de autorización
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Suponiendo que guardas el token aquí
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Método para crear una nueva materia
  crearMateria(nombre: string, carrera_id: number): Observable<any> {
    const materiaData = { nombre, carrera_id }; // Datos para la nueva materia
    return this.http.post(this.apiUrl, materiaData, { headers: this.getHeaders() });
  }

  obtenerMateriasPorUsuario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/por-usuario`, { headers: this.getHeaders() });
  }

  // Método para obtener todas las materias
  obtenerMaterias(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  actualizarMateria(id: number, nombre: string, carrera_id: number): Observable<any> {
    const materiaData = { nombre, carrera_id }; // Datos actualizados
    return this.http.put(`${this.apiUrl}/${id}`, materiaData, {
      headers: this.getHeaders()
    });
  }

  eliminarMateria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
