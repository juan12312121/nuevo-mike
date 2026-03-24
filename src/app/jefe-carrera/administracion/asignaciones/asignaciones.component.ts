import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from '../../aside-jefecarrera/aside-jefecarrera.component';
import { ModalAsignarMateriasComponent } from '../modal-asignar-materias/modal-asignar-materias.component';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { AsignacionMateriasService } from '../../../core/asignaciones/asignacion-materias.service';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginacionComponent,
    AsideJefecarreraComponent,
    ModalAsignarMateriasComponent
  ],
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.css']
})
export class AsignacionesComponent implements OnInit {
  // Asignaciones
  asignaciones: any[] = [];
  asignacionesFiltradas: any[] = [];

  // Modal control
  showAsignModal = false;
  asignacionToEdit: { id: number; profesor_id: number; materia_id: number } | null = null;

  // Paginación
  paginaActualAsignaciones: number = 1;
  registrosPorPaginaAsignaciones: number = 12;

  // Términos de búsqueda
  terminoBusquedaAsignaciones: string = '';

  // Flags to prevent duplicate submissions
  isSavingAsignacion = false;

  constructor(
    private asignService: AsignacionMateriasService
  ) {}

  ngOnInit(): void {
    this.obtenerAsignaciones();
  }

  obtenerAsignaciones(): void {
    console.log('🔄 Obteniendo asignaciones...');
    this.asignService.obtenerAsignaciones().subscribe({
      next: (data) => {
        console.log('✅ Asignaciones recibidas:', data);
        this.asignaciones = Array.isArray(data) ? data : [];
        this.filtrarAsignaciones();
      },
      error: (err) => {
        console.error('❌ Error al cargar asignaciones', err);
        this.asignaciones = [];
        this.asignacionesFiltradas = [];
      },
    });
  }

  filtrarAsignaciones(): void {
    if (!this.terminoBusquedaAsignaciones.trim()) {
      this.asignacionesFiltradas = [...this.asignaciones];
    } else {
      const term = this.terminoBusquedaAsignaciones.toLowerCase().trim();
      this.asignacionesFiltradas = this.asignaciones.filter(
        (a) =>
          (a.profesorNombre && a.profesorNombre.toLowerCase().includes(term)) ||
          (a.materiaNombre && a.materiaNombre.toLowerCase().includes(term))
      );
    }
    this.paginaActualAsignaciones = 1;
  }

  buscarAsignacion(event: any): void {
    this.terminoBusquedaAsignaciones = event.target.value;
    this.filtrarAsignaciones();
  }

  onCambiarPaginaAsignaciones(nuevaPagina: number): void {
    this.paginaActualAsignaciones = nuevaPagina;
  }

  totalPaginasAsignaciones(): number {
    const total = Math.ceil(this.asignacionesFiltradas.length / this.registrosPorPaginaAsignaciones);
    return total === 0 ? 1 : total;
  }

  get asignacionesPaginadas(): any[] {
    const inicio = (this.paginaActualAsignaciones - 1) * this.registrosPorPaginaAsignaciones;
    const fin = inicio + this.registrosPorPaginaAsignaciones;
    return this.asignacionesFiltradas.slice(inicio, fin);
  }

  get mostrarPaginacionAsignaciones(): boolean {
    return this.asignacionesFiltradas.length > this.registrosPorPaginaAsignaciones;
  }

  abrirModalAsignacion(): void {
    this.asignacionToEdit = null;
    this.showAsignModal = true;
  }

  crearAsignacion(profesor_id: number, materia_id: number): void {
    if (this.isSavingAsignacion) return;
    this.isSavingAsignacion = true;

    this.asignService.crearAsignacion(profesor_id, materia_id).subscribe({
      next: (response) => {
        console.log('✅ Asignación creada:', response);
        this.obtenerAsignaciones();
        this.isSavingAsignacion = false;
        this.showAsignModal = false;
      },
      error: (err) => {
        console.error('❌ Error al crear asignación:', err);
        this.isSavingAsignacion = false;
      }
    });
  }

  actualizarAsignacion(profesor_id: number, materia_id: number): void {
    if (!this.asignacionToEdit || this.isSavingAsignacion) return;
    this.isSavingAsignacion = true;

    this.asignService
      .actualizarAsignacion(this.asignacionToEdit.id, profesor_id, materia_id)
      .subscribe({
        next: (response) => {
          this.obtenerAsignaciones();
          this.isSavingAsignacion = false;
          this.showAsignModal = false;
        },
        error: (err) => {
          console.error('❌ Error al actualizar:', err);
          this.isSavingAsignacion = false;
        },
      });
  }

  eliminarAsignacion(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar esta asignación?')) return;
    
    this.asignService.eliminarAsignacion(id).subscribe({
      next: () => {
        this.obtenerAsignaciones();
      },
      error: (err) => console.error('Error al eliminar', err),
    });
  }

  editarAsignacion(asignacion: any): void {
    this.asignacionToEdit = {
      id: asignacion.id,
      profesor_id: asignacion.profesor_id,
      materia_id: asignacion.materia_id
    };
    this.showAsignModal = true;
  }

  trackById(index: number, item: any): any {
    return item && item.id != null ? item.id : index;
  }
}
