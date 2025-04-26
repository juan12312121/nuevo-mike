import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Importamos para manejar errores

@Injectable({
  providedIn: 'root'
})
export class AulasService {

  private apiUrl = 'http://localhost:4000/api/aulas';  // URL base

  constructor(private http: HttpClient) { }

  // Crear un aula
  crearAula(aula: any): Observable<any> {
    console.log('Creando aula:', aula);  // Log del aula a crear
    return this.http.post<any>(this.apiUrl, aula).pipe(
      catchError(this.handleError('crearAula'))
    );
  }

  // Obtener todas las aulas
  obtenerAulas(): Observable<any[]> {
    console.log('Obteniendo todas las aulas...');
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError('obtenerAulas'))
    );
  }

  // Obtener un aula por su ID
  obtenerAulaPorId(id: number): Observable<any> {
    console.log(`Obteniendo aula con ID: ${id}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('obtenerAulaPorId'))
    );
  }

  // Actualizar un aula
  actualizarAula(id: number, aula: any): Observable<any> {
    console.log(`Actualizando aula con ID: ${id}`, aula);
    return this.http.put<any>(`${this.apiUrl}/${id}`, aula).pipe(
      catchError(this.handleError('actualizarAula'))
    );
  }

  // Eliminar un aula
  eliminarAula(id: number): Observable<any> {
    console.log(`Eliminando aula con ID: ${id}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('eliminarAula'))
    );
  }

  // Manejo de errores
  private handleError(operation: string) {
    return (error: any) => {
      console.error(`${operation} falló:`, error);
      throw error;  // Re-lanzamos el error
    };
  }
}
