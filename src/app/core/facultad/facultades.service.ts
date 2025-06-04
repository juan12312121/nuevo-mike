// src/app/core/facultad/facultades.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Facultad {
  id?: number;
  nombre: string;
  descripcion?: string;
  email_contacto?: string;
  telefono_contacto?: string;
  escuela_id: number;
  escuela_nombre?: string;
}

@Injectable({ providedIn: 'root' })
export class FacultadesService {
private apiUrl = 'https://mi-back-2pbd.onrender.com/api/facultades';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerFacultades(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>(`${this.apiUrl}/facultades`, {
      headers: this.getAuthHeaders()
    });
  }

  crearFacultad(f: Facultad): Observable<Facultad> {
    return this.http.post<Facultad>(`${this.apiUrl}/facultad`, f, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarFacultad(facultad: Facultad): Observable<Facultad> {
    if (!facultad.id) {
      throw new Error('La facultad debe tener un ID para ser actualizada');
    }
    return this.http.put<Facultad>(
      `${this.apiUrl}/actualizar-facultad/${facultad.id}`,
      facultad,
      { headers: this.getAuthHeaders() }
    );
  }

  eliminarFacultad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar-facultad/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
