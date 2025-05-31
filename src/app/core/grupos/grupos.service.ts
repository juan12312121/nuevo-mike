import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { UsuariosService } from '../autenticacion/usuarios.service';



export interface RawGrupo {
  id: number;               // ID interno de base de datos
  grupo_id: number;         // ID real del grupo (por ejemplo, el que viene de la API)
  grupo_nombre: string;
  carrera_nombre: string;
  semestre: string;
}


export interface RawGrupoApi {
  grupo_id: number;
  grupo_nombre: string;
  carrera_nombre: string;
  grupo_semestre: string;
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

  constructor(private http: HttpClient, private usuariosService: UsuariosService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.usuariosService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  // Obtener todos los grupos
  getGrupos(): Observable<any> {
  console.log('🚀 Haciendo solicitud GET a: ', this.apiUrl);
  return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
    tap(
      (data) => {
        console.log('✅ Respuesta obtenida de getGrupos():', data);
      },
      (err: HttpErrorResponse) => {
        console.error('❌ Error al obtener los grupos:', err);
      }
    )
  );
  }

  // Obtener un grupo por ID
 getGrupoById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
}

  // Crear un nuevo grupo
 crearGrupo(grupo: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, grupo, { headers: this.getAuthHeaders() });
}

  // Actualizar un grupo
actualizarGrupo(id: number, grupo: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, grupo, { headers: this.getAuthHeaders() });
}

  // Eliminar un grupo
eliminarGrupo(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
}

  // grupos.service.ts
  getGruposPorUsuario(usuarioId: number): Observable<RawGrupo[]> {
    return this.http
      .get<{ success: boolean; data: RawGrupo[] }>(`${this.apiUrl}/usuario/${usuarioId}`)
      .pipe(
        map(res => res.data),     // <-- aquí extraes únicamente el array
        tap({
          next: data => console.log('✅ getGruposPorUsuario datos:', data),
          error: err => console.error('❌ Error:', err)
        })
      );
  }


}
