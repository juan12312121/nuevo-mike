import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefeGrupoComponent } from '../../componentes/aside-jefe-grupo/aside-jefe-grupo.component';
import { AsistenciaTemaService } from '../../core/asistencia-tema/asistencia-tema.service';

@Component({
  selector: 'app-asistencia-registradas',
  standalone: true,
  imports: [AsideJefeGrupoComponent, CommonModule, FormsModule],
  templateUrl: './asistencia-registradas.component.html',
  styleUrls: ['./asistencia-registradas.component.css']
})
export class AsistenciaRegistradasComponent implements OnInit {

  public Math = Math;               // para usar Math en el template

  asistencias: any[] = [];          // datos originales
  asistenciasFiltradas: any[] = []; // tras aplicar filtros

  userId!: number;                  // ahora se asignará dinámicamente

  // Valores de los filtros
  searchTerm: string = '';
  asistio: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  // Paginación
  paginaActual: number = 1;
  registrosPorPagina: number = 15;

  constructor(private asistenciaService: AsistenciaTemaService) {}

  ngOnInit(): void {
    // 1. Intentamos leer el token del localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('[ngOnInit] No se encontró ningún token en localStorage.');
      // Aquí podrías redirigir al login o mostrar un mensaje
      return;
    }

    // 2. Decodificamos el JWT para extraer el payload
    const payload = this.decodePayloadFromJWT(token);
    if (!payload) {
      console.error('[ngOnInit] No se pudo decodificar el payload del token.');
      return;
    }

    // 3. Extraemos el ID del usuario (ajusta "id" por el campo real en tu payload)
    if (payload.id == null) {
      console.error('[ngOnInit] El payload del token no contiene la propiedad "id".', payload);
      return;
    }
    this.userId = payload.id;
    console.log('[ngOnInit] Usuario logueado. ID extraído del token =', this.userId);

    // 4. Llamamos al servicio con el userId dinámico
    this.obtenerAsistenciasPorUsuario(this.userId);
  }

  /**
   * Decodifica el payload de un JWT sin validar firma.
   * Devuelve el objeto JSON contenido en el payload, o null si falla.
   */
  private decodePayloadFromJWT(token: string): any | null {
    try {
      // Un JWT típico tiene la forma: header.payload.signature
      const partes = token.split('.');
      if (partes.length !== 3) {
        console.error('[decodePayloadFromJWT] Formato de token inválido.', token);
        return null;
      }
      // El payload está en la segunda parte, codificado en Base64Url
      const base64Url = partes[1];
      // Convertimos Base64Url a Base64 estándar:
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Decodificamos y parseamos a JSON
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('[decodePayloadFromJWT] Error al decodificar payload:', error);
      return null;
    }
  }

  private obtenerAsistenciasPorUsuario(userId: number): void {
    console.log(`[obtenerAsistenciasPorUsuario] Solicitando asistencias para userId ${userId}...`);
    this.asistenciaService.obtenerAsistenciasPorUsuario(userId)
      .subscribe({
        next: (response) => {
          console.log('[obtenerAsistenciasPorUsuario] Respuesta del backend:', response);
          this.asistencias = response;
          console.log('[obtenerAsistenciasPorUsuario] Asignando a this.asistencias:', this.asistencias);
          this.aplicarFiltros();
        },
        error: (err) => {
          console.error('[obtenerAsistenciasPorUsuario] Error al obtener asistencias:', err);
          // Aquí podrías notificar al usuario con un mensaje UI
        }
      });
  }

  aplicarFiltros(): void {
    console.log('[aplicarFiltros] Filtros actuales:', {
      searchTerm: this.searchTerm,
      asistio: this.asistio,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    });
    this.paginaActual = 1;
    console.log('[aplicarFiltros] Cantidad de registros antes de filtrar:', this.asistencias.length);

    this.asistenciasFiltradas = this.asistencias.filter(a => {
      // filtro por estado
      const pasaEstado = this.asistio === '' || a.asistio === this.asistio;

      // filtro por búsqueda de materia
      const pasaBusqueda = this.searchTerm === '' ||
        a.materia_nombre?.toLowerCase().includes(this.searchTerm.toLowerCase());

      // filtro por rango de fecha
      const fecha = new Date(a.fecha);
      const inicio = this.fechaInicio ? new Date(this.fechaInicio) : null;
      const fin    = this.fechaFin    ? new Date(this.fechaFin)    : null;
      const pasaInicio = !inicio || fecha >= inicio;
      const pasaFin    = !fin    || fecha <= fin;
      return pasaEstado && pasaBusqueda && pasaInicio && pasaFin;
    });

    console.log('[aplicarFiltros] Cantidad de registros después de filtrar:', this.asistenciasFiltradas.length);
  }

  asistenciasPaginadas(): any[] {
    const start = (this.paginaActual - 1) * this.registrosPorPagina;
    const end = start + this.registrosPorPagina;
    console.log(`[asistenciasPaginadas] Página ${this.paginaActual} (mostrando índices ${start} a ${end - 1})`);
    return this.asistenciasFiltradas.slice(start, end);
  }

  totalPaginas(): number {
    const total = Math.ceil(this.asistenciasFiltradas.length / this.registrosPorPagina);
    console.log('[totalPaginas] Total de páginas calculado:', total);
    return total;
  }

  cambiarPagina(delta: number): void {
    const nueva = this.paginaActual + delta;
    if (nueva >= 1 && nueva <= this.totalPaginas()) {
      console.log(`[cambiarPagina] Cambiando de página ${this.paginaActual} a ${nueva}`);
      this.paginaActual = nueva;
    } else {
      console.warn('[cambiarPagina] Intento de cambiar a página inválida:', nueva);
    }
  }

  exportarExcel(): void {
    console.log('[exportarExcel] Usuario solicitó exportar a Excel. Implementar aquí la lógica.');
    // Ejemplo: generar CSV/XLSX a partir de this.asistenciasFiltradas.
  }
}
