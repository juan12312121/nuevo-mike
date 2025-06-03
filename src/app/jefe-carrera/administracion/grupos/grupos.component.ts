import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AsideJefecarreraComponent } from '../../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { ModalGruposComponent } from '../../../componentes/modal-grupos/modal-grupos.component';
import { PaginacionComponent } from '../../../componentes/paginacion/paginacion.component';
import { GruposService } from '../../../core/grupos/grupos.service';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    AsideJefecarreraComponent,
    PaginacionComponent,
    CommonModule,
    FormsModule,
    ModalGruposComponent
  ],
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {
  grupos: any[] = [];
  filtered: any[] = []; // Array filtrado para búsqueda
  modalOpen = false;
  grupoAEditar: any = null;
  modalVisible: boolean = false;
  paginaActual: number = 1;
  registrosPorPagina: number = 20; // Número de registros por página
  terminoBusqueda: string = ''; // Término de búsqueda

  constructor(private gruposService: GruposService) { }

  ngOnInit(): void {
    this.getGrupos();
  }

  getGrupos(): void {
    this.gruposService.getGrupos().subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta completa del backend:', response);

        // El servicio ya extrae response.data, así que response es directamente el array
        if (response && Array.isArray(response)) {
          this.grupos = response.map((g: any) => ({
            id: g.id,
            nombre: g.nombre,
            carrera_nombre: g.carrera?.nombre || 'Sin carrera',
            semestre: g.semestre
          }));
          
          // Inicializar el array filtrado
          this.filtered = [...this.grupos];
          this.paginaActual = 1; // Resetear a la primera página
          
          console.log('✅ Grupos mapeados:', this.grupos);
          console.table(this.grupos);
        } else {
          // Caso cuando no hay grupos disponibles
          console.warn('⚠️ No hay grupos disponibles');
          this.grupos = [];
          this.filtered = [];

          // Mostrar mensaje informativo al usuario
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'No hay grupos disponibles',
            showConfirmButton: false,
            timer: 3000
          });
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener grupos:', error);
        this.grupos = [];
        this.filtered = [];

        // Manejo de errores específicos
        if (error.status === 401) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Sesión expirada. Por favor, inicie sesión nuevamente.',
            showConfirmButton: false,
            timer: 3000
          });
        } else if (error.status === 403) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: 'No tiene permisos para ver grupos.',
            showConfirmButton: false,
            timer: 3000
          });
        } else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Error al cargar los grupos',
            showConfirmButton: false,
            timer: 3000
          });
        }
      }
    });
  }

  // Método para filtrar grupos basado en el término de búsqueda
  filtrarGrupos(): void {
    if (!this.terminoBusqueda.trim()) {
      this.filtered = [...this.grupos];
    } else {
      const termino = this.terminoBusqueda.toLowerCase();
      this.filtered = this.grupos.filter(grupo => 
        grupo.nombre.toLowerCase().includes(termino) ||
        grupo.carrera_nombre.toLowerCase().includes(termino) ||
        grupo.semestre.toString().includes(termino)
      );
    }
    this.paginaActual = 1; // Resetear a la primera página después del filtrado
  }

  // Método para obtener los grupos de la página actual
  get gruposPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.filtered.slice(inicio, fin);
  }

  eliminarGrupo(id: number): void {
    // 1) Toast tipo pregunta
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      title: '¿Eliminar este grupo?',
      icon: 'warning',
      timerProgressBar: true,
      width: 350,
      // Opcional: usa una clase custom para cambiar colores
      customClass: {
        popup: 'swal2-toast-question',
        confirmButton: 'swal2-confirm-button',
        cancelButton: 'swal2-cancel-button'
      }
    }).then((result) => {
      if (!result.isConfirmed) return;

      // 2) Si confirma, llamamos al servicio
      this.gruposService.eliminarGrupo(id).subscribe(
        () => {
          // 3a) Toast de éxito
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Grupo eliminado correctamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.getGrupos();
        },
        () => {
          // 3b) Toast de error
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'No se pudo eliminar el grupo',
            showConfirmButton: false,
            timer: 1500
          });
        }
      );
    });
  }

  abrirModalNuevo(): void {
    this.grupoAEditar = null;
    this.modalOpen = true;
    console.log('🟢 Modal abierto en modo "nuevo".');
  }

  editarGrupo(grupo: any): void {
    this.grupoAEditar = grupo;
    this.modalOpen = true;
    console.log('✏️ Modal abierto para editar el grupo:', grupo);
  }

  onModalClose(): void {
    this.modalOpen = false;
    console.log('❎ Modal cerrado. Refrescando lista de grupos...');
    this.getGrupos();
  }

  // Método para cambiar de página
  onCambiarPagina(nuevaPagina: number): void {
    this.paginaActual = nuevaPagina;
    console.log(`📄 Cambiando a página ${nuevaPagina}`);
  }

  get mostrarPaginacion(): boolean {
    return this.filtered.length > 0; // Mostrar solo si hay elementos
  }

  totalPaginas(): number {
    const total = Math.ceil(this.filtered.length / this.registrosPorPagina);
    return total === 0 ? 1 : total; // Siempre mostrar al menos 1 página
  }
}