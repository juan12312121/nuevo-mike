import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

private apiUrl = 'https://mi-back-2pbd.onrender.com/api/estadisticas';

  constructor(private http: HttpClient) { }

  getEstadisticas(): Observable<Estadisticas> {
    return this.http.get<Estadisticas>(this.apiUrl);
  }
}
