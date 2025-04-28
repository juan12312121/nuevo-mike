import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from '../../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { ModalAsignarMateriasComponent } from '../../../componentes/modal-asignar-materias/modal-asignar-materias.component';
import { ModalprofesoresComponent } from '../../../componentes/modalprofesores/modalprofesores.component';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { AsignacionMateriasService } from '../../../core/asignaciones/asignacion-materias.service';
import { UsuariosService } from '../../../core/autenticacion/usuarios.service';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalprofesoresComponent,
    PaginacionComponent,
    AsideJefecarreraComponent,
    ModalAsignarMateriasComponent
  ],
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css'],
})
export class ProfesoresComponent implements OnInit {
  // Profesores
  profesores: any[] = [];
  profesoresFiltrados: any[] = [];

  // Asignaciones
  asignaciones: any[] = [];
  asignacionesFiltradas: any[] = [];

  // Modal control
  modalVisible = false;
  showAsignModal = false;
  profesorToEdit: any = null;
  activeTab: string = 'profesores';

  asignacionToEdit: { id: number; profesor_id: number; materia_id: number } | null = null;

  // Flags to prevent duplicate submissions
  isSavingProfesor = false;
  isSavingAsignacion = false;

  constructor(
    private usuariosService: UsuariosService,
    private asignService: AsignacionMateriasService
  ) {}

  ngOnInit(): void {
    this.obtenerProfesores();
  }

  cambiarTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'asignaciones') {
      this.obtenerAsignaciones();
    }
  }

  // -------- Profesores --------
  obtenerProfesores(): void {
    this.usuariosService.listarProfesores().subscribe({
      next: (res) => {
        this.profesores = res.profesores;
        this.profesoresFiltrados = [...this.profesores];
      },
      error: (err) => console.error('Error al cargar profesores', err),
    });
  }

  buscarProfesor(event: any): void {
    const term = event.target.value.toLowerCase();
    this.profesoresFiltrados = this.profesores.filter((p) =>
      [p.nombre, p.correo, p.rol_nombre]
        .map((s: string) => (s || '').toLowerCase())
        .some((s: string) => s.includes(term))
    );
  }

  abrirModal(): void {
    this.profesorToEdit = null;
    this.modalVisible = true;
  }

  editarProfesor(profesor: any): void {
    this.profesorToEdit = { ...profesor };
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  actualizarListaProfesor(_: any): void {
    this.obtenerProfesores();
    this.modalVisible = false;
  }

  eliminarProfesor(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) return;
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        this.profesores = this.profesores.filter((p) => p.id !== id);
        this.profesoresFiltrados = this.profesoresFiltrados.filter((p) => p.id !== id);
        console.log(`Profesor con ID ${id} eliminado.`);
      },
      error: (err) => {
        console.error('Error al eliminar el profesor:', err);
        alert('Ocurrió un error al eliminar el profesor.');
      },
    });
  }

  // -------- Asignaciones --------
  obtenerAsignaciones(): void {
    this.asignService.obtenerAsignaciones().subscribe({
      next: (data) => {
        console.log('Asignaciones recibidas:', data);
        this.asignaciones = data;
        this.asignacionesFiltradas = [...this.asignaciones];
      },
      error: (err) => console.error('Error al cargar asignaciones', err),
    });
  }

  buscarAsignacion(event: any): void {
    const term = event.target.value.toLowerCase();
    this.asignacionesFiltradas = this.asignaciones.filter(
      (a) =>
        a.profesorNombre.toLowerCase().includes(term) ||
        a.materiaNombre.toLowerCase().includes(term)
    );
  }

  abrirModalAsignacion(): void {
    this.asignacionToEdit = null;
    this.showAsignModal = true;
  }

  crearAsignacion(profesor_id: number, materia_id: number): void {
    if (this.isSavingAsignacion) return; // Avoid duplicate submission
    this.isSavingAsignacion = true;

    this.asignService.crearAsignacion(profesor_id, materia_id).subscribe({
      next: () => {
        this.obtenerAsignaciones();
        this.isSavingAsignacion = false;
      },
      error: (err) => {
        console.error('Error al crear asignación', err);
        this.isSavingAsignacion = false;
      },
    });
  }

  actualizarAsignacion(profesor_id: number, materia_id: number): void {
    if (!this.asignacionToEdit || this.isSavingAsignacion) return;
    this.isSavingAsignacion = true;

    this.asignService
      .actualizarAsignacion(this.asignacionToEdit.id, profesor_id, materia_id)
      .subscribe({
        next: () => {
          this.obtenerAsignaciones();
          this.isSavingAsignacion = false;
        },
        error: (err) => {
          console.error('Error al actualizar asignación', err);
          this.isSavingAsignacion = false;
        },
      });
  }

  cerrarAsignModal(): void {
    this.showAsignModal = false;
    this.asignacionToEdit = null;
  }

  eliminarAsignacion(id: number): void {
    this.asignService.eliminarAsignacion(id).subscribe({
      next: () => this.obtenerAsignaciones(),
      error: (err) => console.error('Error al eliminar asignación', err),
    });
  }

  // Pista para *ngFor trackBy
  trackById(index: number, item: any): any {
    return item && item.id != null ? item.id : index;
  }

  editarAsignacion(asignacion: any): void {
    this.asignacionToEdit = {
      id:           asignacion.id,
      profesor_id:  asignacion.profesor_id,
      materia_id:   asignacion.materia_id
    };
    this.showAsignModal = true;
  }
}
