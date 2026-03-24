import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from '../../aside-jefecarrera/aside-jefecarrera.component';
import { ModalUsuariosComponent } from '../modal-usuarios/modal-usuarios.component';
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
  selector: 'app-checadores',
  templateUrl: './checadores.component.html',
  styleUrls: ['./checadores.component.css']
})
export class ChecadoresComponent implements OnInit {
  checadores: any[] = [];
  checadoresFiltrados: any[] = [];
  usuarioIdParaEditar: number | null = null;
  modalVisible = false;

  // Paginación
  paginaActual: number = 1;
  registrosPorPagina: number = 10;

  // Búsqueda
  terminoBusqueda: string = '';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarChecadores();
  }

  cargarChecadores(): void {
    this.usuariosService.obtenerUsuariosNivelPermitido().subscribe({
      next: res => {
        // Filtrar solo Checadores (rol_id 2)
        this.checadores = res.usuarios.filter((u: any) => u.rol_id === 2);
        this.filtrarChecadores();
      },
      error: err => console.error('Error al cargar checadores:', err)
    });
  }

  filtrarChecadores(): void {
    if (!this.terminoBusqueda.trim()) {
      this.checadoresFiltrados = [...this.checadores];
    } else {
      const term = this.terminoBusqueda.toLowerCase().trim();
      this.checadoresFiltrados = this.checadores.filter((c) =>
        [c.nombre, c.carrera]
          .map((s: string) => (s || '').toLowerCase())
          .some((s: string) => s.includes(term))
      );
    }
    this.paginaActual = 1;
  }

  buscar(event: any): void {
    this.terminoBusqueda = event.target.value;
    this.filtrarChecadores();
  }

  onCambiarPagina(nuevaPagina: number): void {
    this.paginaActual = nuevaPagina;
  }

  totalPaginas(): number {
    return Math.ceil(this.checadoresFiltrados.length / this.registrosPorPagina) || 1;
  }

  get checadoresPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.checadoresFiltrados.slice(inicio, inicio + this.registrosPorPagina);
  }

  abrirModal(): void {
    this.usuarioIdParaEditar = null;
    this.modalVisible = true;
  }

  editar(user: any): void {
    this.usuarioIdParaEditar = user.id;
    this.modalVisible = true;
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este checador?')) return;
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        this.checadores = this.checadores.filter(u => u.id !== id);
        this.filtrarChecadores();
      },
      error: err => console.error('Error al eliminar checador:', err)
    });
  }

  onModalClosed(): void {
    this.modalVisible = false;
    this.usuarioIdParaEditar = null;
    this.cargarChecadores();
  }

  trackById(index: number, item: any): any {
    return item ? item.id : index;
  }
}
