import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from '../../aside-jefecarrera/aside-jefecarrera.component';
import { ModalAsignarMateriasComponent } from '../modal-asignar-materias/modal-asignar-materias.component';
import { ModalprofesoresComponent } from '../modalprofesores/modalprofesores.component';
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

  // Paginación para profesores
  paginaActualProfesores: number = 1;
  registrosPorPaginaProfesores: number = 12; // 12 tarjetas por página

  // Paginación para asignaciones
  paginaActualAsignaciones: number = 1;
  registrosPorPaginaAsignaciones: number = 12;

  // Términos de búsqueda
  terminoBusquedaProfesores: string = '';
  terminoBusquedaAsignaciones: string = '';

  // Flags to prevent duplicate submissions
  isSavingProfesor = false;
  isSavingAsignacion = false;

  constructor(
    private usuariosService: UsuariosService,
    private asignService: AsignacionMateriasService
  ) {}

  ngOnInit(): void {
    this.obtenerProfesores();
    // Cargar asignaciones desde el inicio para que estén disponibles
    this.obtenerAsignaciones();
  }

  cambiarTab(tab: string): void {
    console.log(`🔄 Cambiando a tab: ${tab}`);
    this.activeTab = tab;
    if (tab === 'asignaciones' && this.asignaciones.length === 0) {
      this.obtenerAsignaciones();
    }
  }

  // -------- PROFESORES --------
  obtenerProfesores(): void {
    this.usuariosService.listarProfesores().subscribe({
      next: (res) => {
        this.profesores = res.profesores;
        this.filtrarProfesores();
      },
      error: (err) => console.error('Error al cargar profesores', err),
    });
  }

  filtrarProfesores(): void {
    if (!this.terminoBusquedaProfesores.trim()) {
      this.profesoresFiltrados = [...this.profesores];
    } else {
      const term = this.terminoBusquedaProfesores.toLowerCase().trim();
      this.profesoresFiltrados = this.profesores.filter((p) =>
        [p.nombre, p.correo, p.rol_nombre]
          .map((s: string) => (s || '').toLowerCase())
          .some((s: string) => s.includes(term))
      );
    }
    // Resetear a la primera página cuando se filtra
    this.paginaActualProfesores = 1;
  }

  buscarProfesor(event: any): void {
    this.terminoBusquedaProfesores = event.target.value;
    this.filtrarProfesores();
  }

  // Paginación para profesores
  onCambiarPaginaProfesores(nuevaPagina: number): void {
    this.paginaActualProfesores = nuevaPagina;
    console.log(`📄 Cambiando a página ${nuevaPagina} en profesores`);
  }

  totalPaginasProfesores(): number {
    const total = Math.ceil(this.profesoresFiltrados.length / this.registrosPorPaginaProfesores);
    return total === 0 ? 1 : total;
  }

  get profesoresPaginados(): any[] {
    const inicio = (this.paginaActualProfesores - 1) * this.registrosPorPaginaProfesores;
    const fin = inicio + this.registrosPorPaginaProfesores;
    return this.profesoresFiltrados.slice(inicio, fin);
  }

  get mostrarPaginacionProfesores(): boolean {
    return this.profesoresFiltrados.length > this.registrosPorPaginaProfesores;
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
        this.filtrarProfesores(); // Refiltrar después de eliminar
        console.log(`Profesor con ID ${id} eliminado.`);
      },
      error: (err) => {
        console.error('Error al eliminar el profesor:', err);
        alert('Ocurrió un error al eliminar el profesor.');
      },
    });
  }

  // -------- ASIGNACIONES --------
  obtenerAsignaciones(): void {
    console.log('🔄 Obteniendo asignaciones...');
    this.asignService.obtenerAsignaciones().subscribe({
      next: (data) => {
        console.log('✅ Asignaciones recibidas:', data);
        this.asignaciones = Array.isArray(data) ? data : [];
        this.filtrarAsignaciones();
        // Debug después de procesar los datos
        setTimeout(() => this.debugPaginacionAsignaciones(), 100);
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
    // Resetear a la primera página cuando se filtra
    this.paginaActualAsignaciones = 1;
    console.log(`🔍 Filtradas ${this.asignacionesFiltradas.length} asignaciones de ${this.asignaciones.length} totales`);
  }

  buscarAsignacion(event: any): void {
    this.terminoBusquedaAsignaciones = event.target.value;
    this.filtrarAsignaciones();
  }

  // Paginación para asignaciones
  onCambiarPaginaAsignaciones(nuevaPagina: number): void {
    this.paginaActualAsignaciones = nuevaPagina;
    console.log(`📄 Cambiando a página ${nuevaPagina} en asignaciones`);
  }

  totalPaginasAsignaciones(): number {
    const total = Math.ceil(this.asignacionesFiltradas.length / this.registrosPorPaginaAsignaciones);
    const resultado = total === 0 ? 1 : total;
    console.log(`📊 Total páginas asignaciones: ${resultado} (${this.asignacionesFiltradas.length} registros, ${this.registrosPorPaginaAsignaciones} por página)`);
    return resultado;
  }

  get asignacionesPaginadas(): any[] {
    const inicio = (this.paginaActualAsignaciones - 1) * this.registrosPorPaginaAsignaciones;
    const fin = inicio + this.registrosPorPaginaAsignaciones;
    const paginados = this.asignacionesFiltradas.slice(inicio, fin);
    console.log(`📋 Asignaciones paginadas: ${paginados.length} elementos (desde ${inicio} hasta ${fin})`);
    return paginados;
  }

  get mostrarPaginacionAsignaciones(): boolean {
    const mostrar = this.asignacionesFiltradas.length > this.registrosPorPaginaAsignaciones;
    console.log(`👁️ Mostrar paginación asignaciones: ${mostrar} (${this.asignacionesFiltradas.length} > ${this.registrosPorPaginaAsignaciones})`);
    return mostrar;
  }

  abrirModalAsignacion(): void {
    this.asignacionToEdit = null;
    this.showAsignModal = true;
  }

  // En profesores.component.ts
// REEMPLAZA el método crearAsignacion por este:

crearAsignacion(profesor_id: number, materia_id: number): void {
  console.log('🚀 Padre: Creando asignación', { profesor_id, materia_id });
  
  if (this.isSavingAsignacion) {
    console.log('⚠️ Ya está guardando, ignorando...');
    return;
  }
  
  this.isSavingAsignacion = true;

  this.asignService.crearAsignacion(profesor_id, materia_id).subscribe({
    next: (response) => {
      console.log('✅ Asignación creada exitosamente:', response);
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

// El método actualizarAsignacion se mantiene igual:
actualizarAsignacion(profesor_id: number, materia_id: number): void {
  console.log('🔄 Padre: Actualizando asignación', { profesor_id, materia_id });
  
  if (!this.asignacionToEdit || this.isSavingAsignacion) return;
  this.isSavingAsignacion = true;

  this.asignService
    .actualizarAsignacion(this.asignacionToEdit.id, profesor_id, materia_id)
    .subscribe({
      next: (response) => {
        console.log('✅ Asignación actualizada exitosamente:', response);
        this.obtenerAsignaciones();
        this.isSavingAsignacion = false;
        this.showAsignModal = false;
      },
      error: (err) => {
        console.error('❌ Error al actualizar asignación:', err);
        this.isSavingAsignacion = false;
      },
    });
}
  cerrarAsignModal(): void {
    this.showAsignModal = false;
    this.asignacionToEdit = null;
  }

  eliminarAsignacion(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar esta asignación?')) return;
    
    this.asignService.eliminarAsignacion(id).subscribe({
      next: () => {
        this.obtenerAsignaciones();
        console.log(`Asignación con ID ${id} eliminada.`);
      },
      error: (err) => console.error('Error al eliminar asignación', err),
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

  // Método de debugging para asignaciones
  debugPaginacionAsignaciones(): void {
    console.log('🐛 === DEBUG PAGINACIÓN ASIGNACIONES ===');
    console.log('📊 Total asignaciones:', this.asignaciones.length);
    console.log('🔍 Asignaciones filtradas:', this.asignacionesFiltradas.length);
    console.log('📄 Registros por página:', this.registrosPorPaginaAsignaciones);
    console.log('👁️ Mostrar paginación:', this.mostrarPaginacionAsignaciones);
    console.log('📈 Total páginas:', this.totalPaginasAsignaciones());
    console.log('📍 Página actual:', this.paginaActualAsignaciones);
    console.log('📋 Asignaciones paginadas:', this.asignacionesPaginadas.length);
    console.log('🔖 Tab activo:', this.activeTab);
  }

  // Pista para *ngFor trackBy
  trackById(index: number, item: any): any {
    return item && item.id != null ? item.id : index;
  }
}