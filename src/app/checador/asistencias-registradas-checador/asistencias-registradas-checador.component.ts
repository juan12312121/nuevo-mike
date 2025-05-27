// asistencias-registradas-checador.component.ts
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsideChecadorComponent } from '../../componentes/aside-checador/aside-checador.component';
import { AsistenciaTemaService } from '../../core/asistencia-tema/asistencia-tema.service';

interface JwtPayload {
  id: number;
  // … otros campos
}

interface Asistencia {
  asignacion_id: number;
  asistio: string;
  dia_semana: string;
  fecha: string;
  hora: string;
  id: number;
  materia_nombre: string;
  profesor_nombre: string;
  registrado_por_id: number;
  registrado_por_nombre: string;
  tipo_registro: string;
  // Campos opcionales antiguos
  horaEntrada?: string;
  horaSalida?: string;
  tema?: { id: number; nombre: string };
  alumno?: { id: number; nombre: string; apellidos?: string };
  estado?: string;
}

@Component({
  selector: 'app-asistencias-registradas-checador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AsideChecadorComponent,
    DatePipe
  ],
  templateUrl: './asistencias-registradas-checador.component.html',
  styleUrls: ['./asistencias-registradas-checador.component.css']
})
export class AsistenciasRegistradasChecadorComponent implements OnInit {
  asistencias: Asistencia[] = [];
  asistenciasFiltradas: Asistencia[] = [];
  cargando = true;
  error = '';
  
  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;
  totalPaginas = 1;

  constructor(
    private asistenciasSvc: AsistenciaTemaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'No hay token de sesión';
      this.cargando = false;
      return;
    }
    
    const payload = decodeJwt<JwtPayload>(token);
    if (!payload?.id) {
      this.error = 'Token inválido o sin ID';
      this.cargando = false;
      return;
    }
    
    this.asistenciasSvc.obtenerAsistenciasPorUsuario(payload.id)
      .subscribe({
        next: (data: Asistencia[]) => {
          this.asistencias = data;
          this.asistenciasFiltradas = [...data];
          this.calcularTotalPaginas();
          this.cargando = false;
        },
        error: err => {
          this.error = err.error?.message || err.message || 'Error al cargar asistencias';
          this.cargando = false;
        }
      });
  }

  calcularTotalPaginas(): void {
    this.totalPaginas = Math.ceil(this.asistenciasFiltradas.length / this.elementosPorPagina) || 1;
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  filtrarAsistencias(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.asistenciasFiltradas = valor
      ? this.asistencias.filter(a =>
          a.materia_nombre.toLowerCase().includes(valor) ||
          a.profesor_nombre.toLowerCase().includes(valor) ||
          a.asistio.toLowerCase().includes(valor)
        )
      : [...this.asistencias];
    this.calcularTotalPaginas();
    this.paginaActual = 1;
  }

  filtrarPorFecha(event: Event): void {
    const fechaSel = (event.target as HTMLInputElement).value;
    this.asistenciasFiltradas = fechaSel
      ? this.asistencias.filter(a => a.fecha.split('T')[0] === fechaSel)
      : [...this.asistencias];
    this.calcularTotalPaginas();
    this.paginaActual = 1;
  }

  getEstadoClase(estado = ''): string {
    estado = estado.toLowerCase();
    if (['asistió','asistio','presente'].includes(estado)) return 'estado-asistio';
    if (['falta','ausente'].includes(estado)) return 'estado-falta';
    if (['retardo','tarde'].includes(estado)) return 'estado-retardo';
    return '';
  }

  verDetalles(id: number): void {
    this.router.navigate(['/checador/asistencia', id]);
  }

  editarAsistencia(id: number): void {
    this.router.navigate(['/checador/editar-asistencia', id]);
  }
}

function decodeJwt<T = any>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4) payload += '=';
    return JSON.parse(atob(payload)) as T;
  } catch {
    return null;
  }
}
