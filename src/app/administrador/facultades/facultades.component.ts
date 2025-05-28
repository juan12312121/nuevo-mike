import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Asegúrate de que FormsModule esté importado
import Swal from 'sweetalert2';

// Asumiendo que estas interfaces y servicios existen y son correctos
import { Escuela, EscuelasService } from '../../core/escuelas/escuelas.service';
import { Facultad, FacultadesService } from '../../core/facultad/facultades.service'; // Asegúrate de que Facultad incluya las propiedades que quieres buscar (nombre, descripcion, escuela_nombre, etc.)

import { AsideAdministradorComponent } from '../../componentes/aside-administrador/aside-administrador.component';
import { ModalFacultadComponent } from '../../componentes/modal-facultad/modal-facultad.component';
import { PaginacionAdministradorComponent } from '../../componentes/paginacion-administrador/paginacion-administrador.component';

@Component({
  selector: 'app-facultades',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // <-- Asegúrate de que FormsModule esté aquí
    AsideAdministradorComponent,
    PaginacionAdministradorComponent,
    ModalFacultadComponent
  ],
  templateUrl: './facultades.component.html',
  styleUrls: ['./facultades.component.css']
})
export class FacultadesComponent implements OnInit {
  // Propiedad para guardar la lista original completa
  originalFacultades: Facultad[] = [];
  // Propiedad para guardar la lista actual (completa o filtrada)
  facultades: Facultad[] = [];

  escuelas: Escuela[] = []; // Esta es para el otro filtro de select, no para la búsqueda principal
  cargando = false;
  error: string | null = null;

  // Propiedad para el input de búsqueda
  searchText = ''; // <-- Nueva propiedad

  // Control del modal
  showModal = false;
  facultadAEditar: Facultad | null = null;

  // Paginación
  paginatedFacultades: Facultad[] = []; // Esta sigue siendo la porción que se muestra en la página actual
  currentPage = 1;
  pageSize = 8;

  constructor(
    private facultadesService: FacultadesService,
    private escuelasService: EscuelasService
  ) {}

  ngOnInit(): void {
    this.obtenerFacultades();
    this.cargarEscuelas();
  }

  private cargarEscuelas(): void {
    this.escuelasService.verEscuelas().subscribe({
      // Asumo que verEscuelas en este servicio retorna un array directamente.
      // Si retorna un objeto con una propiedad (ej: { escuelas: [] }), ajusta esto.
      next: (list) => {
        console.log('Escuelas cargadas:', list); // Log para depuración
         // Verifica si list es un array o un objeto con propiedad
         if (Array.isArray(list)) {
            this.escuelas = list;
         } else if (list && Array.isArray((list as any).escuelas)) {
            this.escuelas = (list as any).escuelas;
         } else {
            console.error('Formato inesperado al cargar escuelas:', list);
            this.escuelas = []; // Asegúrate de que sea un array vacío en caso de error/formato inesperado
         }
      },
      error: (err) => console.error('No se pudieron cargar escuelas', err)
    });
  }


  obtenerFacultades(): void {
    this.cargando = true;
    this.error = null;
    this.facultadesService.obtenerFacultades().subscribe({
      next: (data) => {
        this.originalFacultades = data; // Guarda la lista completa original
        this.facultades = [...this.originalFacultades]; // Inicializa la lista 'facultades' con la original
        this.currentPage = 1; // Reinicia la paginación
        this.updatePagination(); // Actualiza la vista paginada
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener facultades', err);
        this.error = 'No se pudieron cargar las facultades.';
        this.cargando = false;
        this.originalFacultades = []; // Asegúrate de que las listas estén vacías en caso de error
        this.facultades = [];
        this.updatePagination(); // Actualiza la paginación incluso con lista vacía
      }
    });
  }

  // Método para manejar la búsqueda
  searchFacultades(): void {
    const searchTerm = this.searchText.toLowerCase().trim();

    if (searchTerm) {
      // Filtra la lista original
      this.facultades = this.originalFacultades.filter(facultad =>
        // Puedes ajustar las propiedades por las que quieres buscar aquí
        facultad.nombre.toLowerCase().includes(searchTerm) ||
        (facultad.descripcion && facultad.descripcion.toLowerCase().includes(searchTerm)) || // Considera si descripcion puede ser nula/undefined
        (facultad.email_contacto && facultad.email_contacto.toLowerCase().includes(searchTerm)) || // Considera si email_contacto puede ser nulo/undefined
        (facultad.telefono_contacto && facultad.telefono_contacto.toLowerCase().includes(searchTerm)) || // Considera si telefono_contacto puede ser nulo/undefined
        (facultad.escuela_nombre && facultad.escuela_nombre.toLowerCase().includes(searchTerm)) // Considera si escuela_nombre puede ser nulo/undefined
      );
    } else {
      // Si el campo de búsqueda está vacío, restaura la lista original
      this.facultades = [...this.originalFacultades]; // Usa spread para crear una nueva referencia, importante para Angular change detection si originalFacultades no cambia
    }

    // Siempre regresa a la primera página y actualiza la paginación después de filtrar
    this.currentPage = 1;
    this.updatePagination();
  }


  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    // paginatedFacultades ahora se basa en la lista 'facultades' (que es la filtrada o completa)
    this.paginatedFacultades = this.facultades.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  // ... (resto de tus métodos openModal, editFacultad, handleClose, handleSave, eliminarFacultad)

   openModal(): void {
    this.facultadAEditar = null;
    this.showModal = true;
  }

  editFacultad(f: Facultad): void {
    this.facultadAEditar = { ...f }; // Clona el objeto para no modificar el original directamente
    this.showModal = true;
  }

  handleClose(): void {
    this.showModal = false;
  }

  handleSave(fac: Facultad): void {
    const operation = fac.id ? this.facultadesService.actualizarFacultad(fac) : this.facultadesService.crearFacultad(fac);
    const successMessage = fac.id ? 'Facultad actualizada con éxito' : 'Facultad creada con éxito';
    const errorMessage = fac.id ? 'Error al actualizar facultad' : 'Error al crear facultad';

    operation.subscribe({
      next: () => {
        this.handleClose();
        this.obtenerFacultades(); // Vuelve a cargar la lista completa (original) y aplica filtro si hay
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: successMessage,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      },
      error: (err) => {
        console.error(errorMessage, err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Ocurrió un error al intentar ${fac.id ? 'actualizar' : 'crear'} la facultad.`
        });
      }
    });
  }

  eliminarFacultad(facultad: Facultad): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: `¿Eliminar "${facultad.nombre}"?`,
      html: `
        <div style="margin-top: 10px;">
          <button id="confirmarEliminar" class="swal2-confirm swal2-styled" style="background-color:#d33; margin-right:5px;">Sí</button>
          <button id="cancelarEliminar" class="swal2-cancel swal2-styled" style="background-color:#3085d6;">No</button>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: false,
      timer: undefined,
      didOpen: () => {
        const confirmBtn = document.getElementById('confirmarEliminar');
        const cancelBtn = document.getElementById('cancelarEliminar');

        confirmBtn?.addEventListener('click', () => {
          Swal.close();
          this.facultadesService.eliminarFacultad(facultad.id!).subscribe({
            next: () => {
              this.obtenerFacultades(); // Vuelve a cargar la lista completa (original) y aplica filtro si hay
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Facultad eliminada con éxito',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
              });
            },
            error: (err) => {
              console.error('Error al eliminar facultad', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al intentar eliminar la facultad.'
              });
            }
          });
        });

        cancelBtn?.addEventListener('click', () => Swal.close());
      }
    });
  }

}
