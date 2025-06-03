import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from "../../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { ModalUsuariosComponent } from "../../../componentes/modal-usuarios/modal-usuarios.component";
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { UsuariosService } from '../../../core/autenticacion/usuarios.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalUsuariosComponent,
    AsideJefecarreraComponent,
    PaginacionComponent
  ],
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  checadores: any[] = [];
  jefesGrupo: any[] = [];
  usuarioIdParaEditar: number | null = null;

  // Datos filtrados
  checadoresFiltrados: any[] = [];
  jefesGrupoFiltrados: any[] = [];

  activeTab: 'checadores' | 'jefes-grupo' = 'checadores';
  modalVisible = false;
  tipoModal: 'checador' | 'jefe' | null = null;

  // Paginación para checadores
  paginaActualChecadores: number = 1;
  registrosPorPaginaChecadores: number = 12;

  // Paginación para jefes de grupo
  paginaActualJefes: number = 1;
  registrosPorPaginaJefes: number = 12;

  // Términos de búsqueda
  terminoBusquedaChecadores: string = '';
  terminoBusquedaJefes: string = '';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.obtenerUsuariosNivelPermitido().subscribe({
      next: res => {
        this.usuarios = res.usuarios;
        this.checadores = this.usuarios.filter(u => u.rol_id === 2);
        this.jefesGrupo = this.usuarios.filter(u => u.rol_id === 3);
        this.filtrarChecadores();
        this.filtrarJefesGrupo();
      },
      error: err => console.error('Error al cargar usuarios:', err)
    });
  }

  setActiveTab(tab: 'checadores' | 'jefes-grupo'): void {
    this.activeTab = tab;
  }

  // -------- FILTROS --------
  filtrarChecadores(): void {
    if (!this.terminoBusquedaChecadores.trim()) {
      this.checadoresFiltrados = [...this.checadores];
    } else {
      const term = this.terminoBusquedaChecadores.toLowerCase().trim();
      this.checadoresFiltrados = this.checadores.filter((c) =>
        [c.nombre, c.carrera]
          .map((s: string) => (s || '').toLowerCase())
          .some((s: string) => s.includes(term))
      );
    }
    this.paginaActualChecadores = 1;
  }

  filtrarJefesGrupo(): void {
    if (!this.terminoBusquedaJefes.trim()) {
      this.jefesGrupoFiltrados = [...this.jefesGrupo];
    } else {
      const term = this.terminoBusquedaJefes.toLowerCase().trim();
      this.jefesGrupoFiltrados = this.jefesGrupo.filter((j) =>
        [j.nombre, j.carrera, j.grupo?.toString()]
          .map((s: string) => (s || '').toLowerCase())
          .some((s: string) => s.includes(term))
      );
    }
    this.paginaActualJefes = 1;
  }

  buscarChecador(event: any): void {
    this.terminoBusquedaChecadores = event.target.value;
    this.filtrarChecadores();
  }

  buscarJefe(event: any): void {
    this.terminoBusquedaJefes = event.target.value;
    this.filtrarJefesGrupo();
  }

  // -------- PAGINACIÓN CHECADORES --------
  onCambiarPaginaChecadores(nuevaPagina: number): void {
    this.paginaActualChecadores = nuevaPagina;
  }

  totalPaginasChecadores(): number {
    const total = Math.ceil(this.checadoresFiltrados.length / this.registrosPorPaginaChecadores);
    return total === 0 ? 1 : total;
  }

  get checadoresPaginados(): any[] {
    const inicio = (this.paginaActualChecadores - 1) * this.registrosPorPaginaChecadores;
    const fin = inicio + this.registrosPorPaginaChecadores;
    return this.checadoresFiltrados.slice(inicio, fin);
  }

  // -------- PAGINACIÓN JEFES DE GRUPO --------
  onCambiarPaginaJefes(nuevaPagina: number): void {
    this.paginaActualJefes = nuevaPagina;
  }

  totalPaginasJefes(): number {
    const total = Math.ceil(this.jefesGrupoFiltrados.length / this.registrosPorPaginaJefes);
    return total === 0 ? 1 : total;
  }

  get jefesGrupoPaginados(): any[] {
    const inicio = (this.paginaActualJefes - 1) * this.registrosPorPaginaJefes;
    const fin = inicio + this.registrosPorPaginaJefes;
    return this.jefesGrupoFiltrados.slice(inicio, fin);
  }

  // -------- MODAL Y CRUD --------
  abrirModal(tipo: 'checador' | 'jefe'): void {
    this.usuarioIdParaEditar = null;
    this.tipoModal = tipo;
    this.modalVisible = true;
  }

  editarUsuario(user: any): void {
    this.usuarioIdParaEditar = user.id;
    this.tipoModal = user.rol_id === 2 ? 'checador' : 'jefe';
    this.modalVisible = true;
  }

  eliminarUsuario(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        // Eliminamos localmente sin recargar todo
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.checadores = this.checadores.filter(u => u.id !== id);
        this.jefesGrupo = this.jefesGrupo.filter(u => u.id !== id);
        // Refiltrar después de eliminar
        this.filtrarChecadores();
        this.filtrarJefesGrupo();
      },
      error: err => console.error('Error al eliminar usuario:', err)
    });
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.tipoModal = null;
    this.usuarioIdParaEditar = null;
  }

  onModalClosed(): void {
    this.cerrarModal();
    this.cargarUsuarios();
  }

  // Track by para optimizar *ngFor
  trackById(index: number, item: any): any {
    return item && item.id != null ? item.id : index;
  }
}