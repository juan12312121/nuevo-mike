import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Escuela {
  id: number;
  folio: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class EscuelasService {
private baseUrl = 'https://mi-back-2pbd.onrender.com/api/escuelas';

  constructor(private http: HttpClient) { }

  // Obtener el token de localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Crear una nueva escuela
  crearEscuela(folio: string, nombre: string): Observable<any> {
    const token = this.getToken();
    
    // Si no hay token, se lanza un error
    if (!token) {
      throw new Error('No token found');
    }

    // Establecer los headers con el token de autorización
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Pasamos el token como Bearer
    });

    // Hacemos la petición POST para crear la escuela
    return this.http.post(`${this.baseUrl}/crear-escuela`, { folio, nombre }, { headers });
  }

  // Ver todas las escuelas
  verEscuelas(): Observable<any> {
    const token = this.getToken();
    
    // Si no hay token, se lanza un error
    if (!token) {
      throw new Error('No token found');
    }

    // Establecer los headers con el token de autorización
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Pasamos el token como Bearer
    });

    // Hacemos la petición GET para obtener las escuelas
    return this.http.get(`${this.baseUrl}/ver-escuelas`, { headers });
  }

  // Actualizar una escuela
  actualizarEscuela(id: number, folio: string, nombre: string): Observable<any> {
    const token = this.getToken();
  
    if (!token) {
      throw new Error('No token found');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.put(`${this.baseUrl}/${id}`, { folio, nombre }, { headers });
  }

  // Eliminar una escuela
  eliminarEscuela(id: number): Observable<any> {
    const token = this.getToken();
  
    if (!token) {
      throw new Error('No token found');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    // Hacemos la petición DELETE para eliminar la escuela
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }
}
