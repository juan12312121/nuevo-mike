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

  userId: number = 50;              // id del usuario

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
    this.obtenerAsistenciasPorUsuario(this.userId);
  }

  private obtenerAsistenciasPorUsuario(userId: number): void {
    this.asistenciaService.obtenerAsistenciasPorUsuario(userId)
      .subscribe({
        next: (response) => {
          this.asistencias = response;
          this.aplicarFiltros();
        },
        error: (err) => console.error('Error al obtener asistencias:', err)
      });
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.asistenciasFiltradas = this.asistencias.filter(a => {
      // filtro por estado
      const pasaEstado = this.asistio === '' || a.asistio === this.asistio;
      // filtro por búsqueda de materia
      const pasaBusqueda = this.searchTerm === '' ||
        a.materia_nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      // filtro por rango de fecha
      const fecha = new Date(a.fecha);
      const inicio = this.fechaInicio ? new Date(this.fechaInicio) : null;
      const fin    = this.fechaFin    ? new Date(this.fechaFin)    : null;
      const pasaInicio = !inicio || fecha >= inicio;
      const pasaFin    = !fin    || fecha <= fin;
      return pasaEstado && pasaBusqueda && pasaInicio && pasaFin;
    });
  }

  asistenciasPaginadas(): any[] {
    const start = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.asistenciasFiltradas.slice(start, start + this.registrosPorPagina);
  }

  totalPaginas(): number {
    return Math.ceil(this.asistenciasFiltradas.length / this.registrosPorPagina);
  }

  cambiarPagina(delta: number): void {
    const nueva = this.paginaActual + delta;
    if (nueva >= 1 && nueva <= this.totalPaginas()) {
      this.paginaActual = nueva;
    }
  }

  exportarExcel(): void {
    console.log('Implementa la exportación aquí');
  }
}
