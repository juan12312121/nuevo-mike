import { Component, OnInit } from '@angular/core';
import { AsideJefecarreraComponent } from '../../aside-jefecarrera/aside-jefecarrera.component';
import { ModalMateriasComponent } from '../modal-materias/modal-materias.component';

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
  materias: any[] = [];
  loading = true;
  errorMessage: string = '';
  filtered: any[] = []; // Array filtrado para búsqueda
  showModal = false;
  materiaEditando: any = null;
  paginaActual: number = 1;
  registrosPorPagina: number = 20;
  terminoBusqueda: string = '';

  constructor(private materiasService: MateriasService) { }

  ngOnInit(): void {
    this.obtenerMateriasPorUsuario();
  }

  onCambiarPagina(nuevaPagina: number): void {
    this.paginaActual = nuevaPagina;
    console.log(`📄 Cambiando a página ${nuevaPagina}`);
  }

  totalPaginas(): number {
    const total = Math.ceil(this.filtered.length / this.registrosPorPagina);
    return total === 0 ? 1 : total;
  }

  // Método para filtrar materias basado en el término de búsqueda
  filtrarMaterias(): void {
    if (!this.terminoBusqueda.trim()) {
      this.filtered = [...this.materias];
    } else {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.filtered = this.materias.filter(materia => 
        materia.nombre.toLowerCase().includes(termino) ||
        (materia.carrera?.nombre && materia.carrera.nombre.toLowerCase().includes(termino))
      );
    }
    // Resetear a la primera página cuando se filtra
    this.paginaActual = 1;
  }

  // Método que se ejecuta cuando cambia el término de búsqueda
  onBusquedaChange(): void {
    this.filtrarMaterias();
  }

  // Getter para obtener las materias de la página actual
  get materiasPaginadas(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.filtered.slice(inicio, fin);
  }

  obtenerMateriasPorUsuario(): void {
    this.loading = true;
    this.errorMessage = '';

    this.materiasService.obtenerMateriasPorUsuario().subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        if (response && response.data) {
          this.materias = response.data;
          this.filtered = [...this.materias]; // Inicializar array filtrado
        } else {
          this.materias = [];
          this.filtered = [];
          this.errorMessage = response.message || 'No se encontraron materias para tu carrera.';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Hubo un error al obtener las materias.';
        console.error('Error al obtener las materias:', error);
        this.loading = false;
        this.materias = [];
        this.filtered = [];
      }
    });
  }

  abrirModal(): void {
    this.materiaEditando = null; // Limpiar materia en edición para crear nueva
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.materiaEditando = null;
  }

  handleModalChange(isOpen: boolean): void {
    this.showModal = isOpen;
    if (!isOpen) {
      this.materiaEditando = null;
    }
  }

  agregarMateria(materia: any): void {
    const index = this.materias.findIndex(m => m.id === materia.id);
    if (index > -1) {
      this.materias[index] = materia;
    } else {
      this.materias.push(materia);
    }
    // Actualizar array filtrado después de agregar/editar
    this.filtrarMaterias();
  }

  editarMateria(materia: any): void {
    this.materiaEditando = { ...materia }; // Crear copia para evitar mutación directa
    this.showModal = true;
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
            this.filtrarMaterias(); // Actualizar array filtrado después de eliminar
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

  get mostrarPaginacion(): boolean {
    return this.filtered.length > 0;
  }
}