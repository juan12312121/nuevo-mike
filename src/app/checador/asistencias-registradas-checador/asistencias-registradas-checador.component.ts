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
  id: number;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  tema?: {
    id: number;
    nombre: string;
  };
  alumno?: {
    id: number;
    nombre: string;
    apellidos?: string;
  };
  estado: string;
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
    console.log('[AsistenciasRegistradasChecador] ngOnInit start');
    const token = localStorage.getItem('token');
    console.log('[AsistenciasRegistradasChecador] token:', token);
    
    if (!token) {
      this.error = 'No hay token de sesión';
      this.cargando = false;
      console.warn('[AsistenciasRegistradasChecador] No token found');
      return;
    }
    
    const payload = decodeJwt<JwtPayload>(token);
    console.log('[AsistenciasRegistradasChecador] decoded payload:', payload);
    
    if (!payload?.id) {
      this.error = 'Token inválido o sin ID';
      this.cargando = false;
      console.error('[AsistenciasRegistradasChecador] Invalid payload, no id');
      return;
    }
    
    this.asistenciasSvc.obtenerAsistenciasPorUsuario(payload.id)
      .subscribe({
        next: (data: Asistencia[]) => {
          console.log('[AsistenciasRegistradasChecador] API response:', data);
          this.asistencias = data;
          this.asistenciasFiltradas = [...data];
          this.calcularTotalPaginas();
          this.cargando = false;
        },
        error: err => {
          console.error('[AsistenciasRegistradasChecador] API error:', err);
          this.error = err.error?.message || err.message || 'Error al cargar asistencias';
          this.cargando = false;
        }
      });
  }

  /**
   * Calcula el total de páginas basado en los elementos por página
   */
  calcularTotalPaginas(): void {
    this.totalPaginas = Math.ceil(this.asistenciasFiltradas.length / this.elementosPorPagina);
    if (this.totalPaginas === 0) this.totalPaginas = 1;
  }

  /**
   * Cambia a la página especificada
   */
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  /**
   * Filtra las asistencias por texto
   */
  filtrarAsistencias(event: Event): void {
    const valorBusqueda = (event.target as HTMLInputElement).value.toLowerCase();
    
    if (!valorBusqueda) {
      this.asistenciasFiltradas = [...this.asistencias];
    } else {
      this.asistenciasFiltradas = this.asistencias.filter(asistencia => 
        asistencia.tema?.nombre.toLowerCase().includes(valorBusqueda) ||
        asistencia.alumno?.nombre.toLowerCase().includes(valorBusqueda) ||
        asistencia.estado.toLowerCase().includes(valorBusqueda)
      );
    }
    
    this.calcularTotalPaginas();
    this.paginaActual = 1;
  }

  /**
   * Filtra las asistencias por fecha
   */
  filtrarPorFecha(event: Event): void {
    const fechaSeleccionada = (event.target as HTMLInputElement).value;
    
    if (!fechaSeleccionada) {
      this.asistenciasFiltradas = [...this.asistencias];
    } else {
      // Convertir la fecha seleccionada a formato YYYY-MM-DD para comparar
      this.asistenciasFiltradas = this.asistencias.filter(asistencia => {
        const fechaAsistencia = asistencia.fecha.split('T')[0]; // Asumiendo formato ISO
        return fechaAsistencia === fechaSeleccionada;
      });
    }
    
    this.calcularTotalPaginas();
    this.paginaActual = 1;
  }

  /**
   * Obtiene la clase CSS según el estado de la asistencia
   */
  getEstadoClase(estado: string): string {
    estado = estado.toLowerCase();
    if (estado === 'asistió' || estado === 'asistio' || estado === 'presente') {
      return 'estado-asistio';
    } else if (estado === 'falta' || estado === 'ausente') {
      return 'estado-falta';
    } else if (estado === 'retardo' || estado === 'tarde') {
      return 'estado-retardo';
    }
    return '';
  }

  /**
   * Navega a la vista de detalles de asistencia
   */
  verDetalles(id: number): void {
    this.router.navigate(['/checador/asistencia', id]);
  }

  /**
   * Navega a la vista de edición de asistencia
   */
  editarAsistencia(id: number): void {
    this.router.navigate(['/checador/editar-asistencia', id]);
  }
}

function decodeJwt<T = any>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('[decodeJwt] unexpected token format');
      return null;
    }
    
    let payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    // Añadir padding si hace falta
    switch (payload.length % 4) {
      case 2: payload += '=='; break;
      case 3: payload += '='; break;
    }
    
    const json = atob(payload);
    const obj = JSON.parse(json) as T;
    return obj;
  } catch (e) {
    console.error('[decodeJwt] error decoding JWT:', e);
    return null;
  }
}