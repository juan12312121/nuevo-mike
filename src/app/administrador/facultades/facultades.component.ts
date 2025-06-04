import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Asegúrate de que FormsModule esté importado
import Swal from 'sweetalert2';

// Asumiendo que estas interfaces y servicios existen y son correctos
// Asegúrate de que la interfaz Facultad tiene una propiedad para el ID de la escuela (ej: escuela_id)
import { Escuela, EscuelasService } from '../../core/escuelas/escuelas.service';
import { Facultad, FacultadesService } from '../../core/facultad/facultades.service';

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
  // Propiedad para guardar la lista actual (completa o filtrada por texto/escuela)
  facultades: Facultad[] = [];

  // Lista de escuelas para el filtro (asumiendo que cargarEscuelas las obtiene correctamente)
  escuelas: Escuela[] = [];
  cargando = false;
  error: string | null = null;

  // Propiedad para el input de búsqueda de texto
  searchText = '';
  // Propiedad para el select de escuelas. Usamos `null` o `''` para representar "Todas las escuelas"
  selectedSchoolId: number | null = null; // <-- Nueva propiedad, usa number|null si los IDs son números

  // Control del modal
  showModal = false;
  facultadAEditar: Facultad | null = null;

  // Paginación
  paginatedFacultades: Facultad[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(
    private facultadesService: FacultadesService,
    private escuelasService: EscuelasService
  ) {}

  ngOnInit(): void {
    this.obtenerFacultades(); // Esto llamará a filterFacultades internamente
    this.cargarEscuelas();
  }

  private cargarEscuelas(): void {
    this.escuelasService.verEscuelas().subscribe({
      // Ajusta esto si el servicio retorna un formato diferente (ej: { escuelas: [...] })
      next: (list) => {
         if (Array.isArray(list)) {
            this.escuelas = list;
         } else if (list && Array.isArray((list as any).escuelas)) {
            this.escuelas = (list as any).escuelas;
         } else {
            console.error('Formato inesperado al cargar escuelas:', list);
            this.escuelas = [];
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
        // Inicializa la lista 'facultades' aplicando los filtros actuales (inicialmente vacíos/null)
        this.filterFacultades(); // <-- Llamada al método de filtrado general
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

  // Método único para aplicar TODOS los filtros
  filterFacultades(): void {
    let filteredFacultades = [...this.originalFacultades]; // Empezamos con la lista completa

    // 1. Aplicar filtro de texto si hay texto de búsqueda
    const searchTerm = this.searchText.toLowerCase().trim();
    if (searchTerm) {
      filteredFacultades = filteredFacultades.filter(facultad =>
        // Asegúrate de que las propiedades existen antes de llamar a toLowerCase() e includes()
        (facultad.nombre?.toLowerCase().includes(searchTerm)) ||
        (facultad.descripcion?.toLowerCase().includes(searchTerm)) ||
        (facultad.email_contacto?.toLowerCase().includes(searchTerm)) ||
        (facultad.telefono_contacto?.toLowerCase().includes(searchTerm)) ||
        (facultad.escuela_nombre?.toLowerCase().includes(searchTerm))
      );
    }

    // 2. Aplicar filtro de escuela si se ha seleccionado una escuela específica (no "Todas")
    if (this.selectedSchoolId != null) { // Compara con null para incluir el caso donde el ID 0 pueda ser válido, aunque null/'' es mejor para "Todas"
        // Asegúrate de que la facultad tiene la propiedad escuela_id y que es del mismo tipo que selectedSchoolId
        filteredFacultades = filteredFacultades.filter(facultad =>
            facultad.escuela_id === this.selectedSchoolId
        );
    }

    // El resultado de los filtros es la nueva lista 'facultades'
    this.facultades = filteredFacultades;

    // Siempre regresar a la primera página y actualizar la paginación después de filtrar
    this.currentPage = 1;
    this.updatePagination();
  }


  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    // paginatedFacultades ahora se basa en la lista 'facultades' (que es la filtrada por texto Y escuela)
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
        this.obtenerFacultades(); // Vuelve a cargar la lista completa y re-aplica filtros
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
              this.obtenerFacultades(); // Vuelve a cargar la lista completa y re-aplica filtros
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
