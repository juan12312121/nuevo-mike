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
  selector: 'app-jefes-grupo',
  templateUrl: './jefes-grupo.component.html',
  styleUrls: ['./jefes-grupo.component.css']
})
export class JefesGrupoComponent implements OnInit {
  jefes: any[] = [];
  jefesFiltrados: any[] = [];
  usuarioIdParaEditar: number|null = null;
  modalVisible = false;

  // Paginación
  paginaActual: number = 1;
  registrosPorPagina: number = 10;

  // Búsqueda
  terminoBusqueda: string = '';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarJefes();
  }

  cargarJefes(): void {
    this.usuariosService.obtenerUsuariosNivelPermitido().subscribe({
      next: res => {
        // Filtrar solo Jefes de Grupo (rol_id 3)
        this.jefes = res.usuarios.filter((u: any) => u.rol_id === 3);
        this.filtrarJefes();
      },
      error: err => console.error('Error al cargar jefes de grupo:', err)
    });
  }

  filtrarJefes(): void {
    if (!this.terminoBusqueda.trim()) {
      this.jefesFiltrados = [...this.jefes];
    } else {
      const term = this.terminoBusqueda.toLowerCase().trim();
      this.jefesFiltrados = this.jefes.filter((j) =>
        [j.nombre, j.carrera, j.grupo?.toString()]
          .map((s: string) => (s || '').toLowerCase())
          .some((s: string) => s.includes(term))
      );
    }
    this.paginaActual = 1;
  }

  buscar(event: any): void {
    this.terminoBusqueda = event.target.value;
    this.filtrarJefes();
  }

  onCambiarPagina(nuevaPagina: number): void {
    this.paginaActual = nuevaPagina;
  }

  totalPaginas(): number {
    return Math.ceil(this.jefesFiltrados.length / this.registrosPorPagina) || 1;
  }

  get jefesPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.jefesFiltrados.slice(inicio, inicio + this.registrosPorPagina);
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
    if (!confirm('¿Seguro que deseas eliminar este jefe de grupo?')) return;
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        this.jefes = this.jefes.filter(u => u.id !== id);
        this.filtrarJefes();
      },
      error: err => console.error('Error al eliminar jefe de grupo:', err)
    });
  }

  onModalClosed(): void {
    this.modalVisible = false;
    this.usuarioIdParaEditar = null;
    this.cargarJefes();
  }

  trackById(index: number, item: any): any {
    return item ? item.id : index;
  }
}
