// src/app/profesores/profesores.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from '../../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { ModalprofesoresComponent } from '../../../componentes/modalprofesores/modalprofesores.component';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
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
  ],
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css'],
})
export class ProfesoresComponent implements OnInit {
  profesores: any[] = [];
  profesoresFiltrados: any[] = [];
  
  modalVisible = false;
  profesorToEdit: any = null;   // ← aquí guardamos si vamos a editar

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerProfesores();
  }

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
    this.profesorToEdit = null;   // creación
    this.modalVisible = true;
  }

  editarProfesor(profesor: any): void {
    this.profesorToEdit = { ...profesor };  // modo edición
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  /**
   * Se dispara tanto al crear como al editar:
   *  - recarga la lista desde el servidor
   *  - oculta el modal
   */
  actualizarListaProfesor(_: any): void {
    this.obtenerProfesores();
    this.modalVisible = false;
  }

  eliminarProfesor(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) return;
  
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        // Filtra localmente para actualizar la vista sin necesidad de recargar todo
        this.profesores = this.profesores.filter(p => p.id !== id);
        this.profesoresFiltrados = this.profesoresFiltrados.filter(p => p.id !== id);
        console.log(`Profesor con ID ${id} eliminado.`);
      },
      error: (err) => {
        console.error('Error al eliminar el profesor:', err);
        alert('Ocurrió un error al eliminar el profesor.');
      }
    });
  }
  

  trackById(index: number, item: any): any {
    return item && item.id != null ? item.id : index;
  }
}
