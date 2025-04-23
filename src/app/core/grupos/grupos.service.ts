import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';


export interface RawGrupo {
  id: number;
  grupo_nombre: string;
  carrera_nombre: string;
  semestre: string;
}

export interface Grupo {
  id: number;
  nombre: string;
  carrera_nombre: string;
  semestre: string;
}


@Injectable({ 
  providedIn: 'root'
})
export class GruposService {

  private apiUrl = 'http://localhost:4000/api/grupos'; // URL base de la API

  constructor(private http: HttpClient) { }

   // Obtener todos los grupos
   getGrupos(): Observable<any> {
    console.log('🚀 Haciendo solicitud GET a: ', this.apiUrl);  // Log antes de la solicitud
    return this.http.get<any>(this.apiUrl).pipe(
      tap(
        (data) => {
          console.log('✅ Respuesta obtenida de getGrupos():', data); // Log de la respuesta
        },
        (err: HttpErrorResponse) => {
          console.error('❌ Error al obtener los grupos:', err);  // Log de errores
        }
      )
    );
  }

  // Obtener un grupo por ID
  getGrupoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo grupo
  crearGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, grupo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Actualizar un grupo
  actualizarGrupo(id: number, grupo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, grupo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Eliminar un grupo
  eliminarGrupo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
