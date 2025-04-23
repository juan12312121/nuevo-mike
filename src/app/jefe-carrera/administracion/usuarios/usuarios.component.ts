// usuarios.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from "../../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { ModalUsuariosComponent } from "../../../componentes/modal-usuarios/modal-usuarios.component";
import { UsuariosService } from '../../../core/autenticacion/usuarios.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalUsuariosComponent,
    AsideJefecarreraComponent
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

  activeTab: 'checadores' | 'jefes-grupo' = 'checadores';
  modalVisible = false;
  tipoModal: 'checador' | 'jefe' | null = null;

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
      },
      error: err => console.error('Error al cargar usuarios:', err)
    });
  }

  setActiveTab(tab: 'checadores' | 'jefes-grupo'): void {
    this.activeTab = tab;
  }

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

  // <-- NUEVO: eliminar usuario
  eliminarUsuario(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        // Eliminamos localmente sin recargar todo
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.checadores = this.checadores.filter(u => u.id !== id);
        this.jefesGrupo = this.jefesGrupo.filter(u => u.id !== id);
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
}
