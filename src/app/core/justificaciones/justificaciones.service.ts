import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

// Asegúrate de que esta sea la URL de tu API para crear una justificación
const API_URL = 'https://mi-back-2pbd.onrender.com/api/justificaciones';

@Injectable({
  providedIn: 'root'
})
export class JustificacionesService {

  constructor(private http: HttpClient) { }


  crearJustificacion(justificacion: any): Observable<any> {
    return this.http.post(API_URL, justificacion);
  }

  obtenerJustificacionPorAsistencia(asistencia_id: number): Observable<any> {
    console.log('Solicitando justificación para asistencia:', asistencia_id);
    console.log('URL completa:', `${API_URL}/${asistencia_id}`);
    
    return this.http.get(`${API_URL}/${asistencia_id}`).pipe(
      tap({
        next: (response) => console.log('Respuesta exitosa:', response),
        error: (error) => console.log('Error en la petición:', error)
      })
    );
  }
}
