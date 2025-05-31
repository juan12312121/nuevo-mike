import { Component, OnInit } from '@angular/core';
import { AsideJefecarreraComponent } from "../../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { ModalMateriasComponent } from "../../../componentes/modal-materias/modal-materias.component";

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PaginacionComponent } from "../../../componentes/paginacion/paginacion.component";
import { MateriasService } from '../../../core/materias/materias.service';



@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [AsideJefecarreraComponent, PaginacionComponent, CommonModule, ModalMateriasComponent, FormsModule],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit {
  confirmDelete(_t19: any) {
    throw new Error('Method not implemented.');
  }
  materias: any[] = [];
  loading = true;
  errorMessage: string = '';
  showModal = false;
  materiaEditando: any = null;


  constructor(private materiasService: MateriasService) { }

  ngOnInit(): void {
    //this.obtenerMaterias();
      this.obtenerMateriasPorUsuario();

  }

  obtenerMaterias(): void {
    this.materiasService.obtenerMateriasPorUsuario().subscribe((response) => {
      if (response && response.data) {
        this.materias = response.data;
      } else {
        this.errorMessage = 'No se encontraron materias.';
      }
    },
      (error) => {
        this.errorMessage = 'Hubo un error al obtener las materias.';
        console.error('Error al obtener las materias:', error);
      }
    );
  }
  obtenerMateriasPorUsuario(): void {
    this.loading = true;
    this.errorMessage = '';

    this.materiasService.obtenerMateriasPorUsuario().subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        if (response && response.data) {
          this.materias = response.data;
        } else {
          this.materias = [];
          this.errorMessage = response.message || 'No se encontraron materias para tu carrera.';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Hubo un error al obtener las materias.';
        console.error('Error al obtener las materias:', error);
        this.loading = false;
      }
    });
  }

  abrirModal(): void {
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
  }

  handleModalChange(isOpen: boolean): void {
    this.showModal = isOpen;
  }

  // Método que recibe la nueva materia desde el modal y la agrega a la lista
  agregarMateria(materia: any): void {
    // Si es una nueva materia o editada, actualizamos la lista
    const index = this.materias.findIndex(m => m.id === materia.id);
    if (index > -1) {
      // Si la materia ya existía, la actualizamos en la lista
      this.materias[index] = materia;
    } else {
      // Si es una nueva materia, la agregamos al final
      this.materias.push(materia);
    }
  }

  editarMateria(materia: any): void {
    this.materiaEditando = materia;
    this.abrirModal();
    this.materiasService.actualizarMateria(materia.id, materia.nombre, materia.carrera.carrera_id)
      .subscribe({
        next: (response) => {
          // Si la materia se actualizó correctamente en el backend, actualizar localmente
          this.obtenerMaterias(); // Recarga la lista
          this.showModal = false; // Cierra el modal
        },
        error: (err) => console.error('Error al actualizar materia:', err),
      });
  }

  eliminarMateria(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.materiasService.eliminarMateria(id).subscribe({
          next: () => {
            this.materias = this.materias.filter(m => m.id !== id);
            Swal.fire('¡Eliminado!', 'La materia ha sido eliminada.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar la materia:', err);
            Swal.fire('Error', 'No se pudo eliminar la materia.', 'error');
          }
        });
      }
    });
  }

}



