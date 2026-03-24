import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Estadisticas {
  escuelas: number;
  facultades: number;
  jefes: number;
  carreras: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {

private apiUrl = `${environment.apiUrl}/estadisticas`;

  constructor(private http: HttpClient) { }

  getEstadisticas(): Observable<Estadisticas> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Estadisticas>(this.apiUrl, { headers });
  }
}
