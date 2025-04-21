import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
    FormsModule,
    AsideAdministradorComponent,
    PaginacionAdministradorComponent,
    ModalFacultadComponent
  ],
  templateUrl: './facultades.component.html',
  styleUrls: ['./facultades.component.css']
})
export class FacultadesComponent implements OnInit {
  facultades: Facultad[] = [];
  escuelas: Escuela[] = [];
  cargando = false;
  error: string | null = null;

  // Control del modal
  showModal = false;
  facultadAEditar: Facultad | null = null;

  // Paginación
  paginatedFacultades: Facultad[] = [];
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
      next: (list) => (this.escuelas = list),
      error: (err) => console.error('No se pudieron cargar escuelas', err)
    });
  }

  obtenerFacultades(): void {
    this.cargando = true;
    this.error = null;
    this.facultadesService.obtenerFacultades().subscribe({
      next: (data) => {
        this.facultades = data;
        this.currentPage = 1;
        this.updatePagination();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener facultades', err);
        this.error = 'No se pudieron cargar las facultades.';
        this.cargando = false;
      }
    });
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedFacultades = this.facultades.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  openModal(): void {
    this.facultadAEditar = null;
    this.showModal = true;
  }

  editFacultad(f: Facultad): void {
    this.facultadAEditar = { ...f };
    this.showModal = true;
  }

  handleClose(): void {
    this.showModal = false;
  }

  handleSave(fac: Facultad): void {
    if (fac.id) {
      // edición
      this.facultadesService.actualizarFacultad(fac).subscribe({
        next: () => {
          this.handleClose();
          this.obtenerFacultades();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Facultad actualizada con éxito',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        },
        error: (err) => console.error('Error al actualizar facultad', err)
      });
    } else {
      // creación
      this.facultadesService.crearFacultad(fac).subscribe({
        next: () => {
          this.handleClose();
          this.obtenerFacultades();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Facultad creada con éxito',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          });
        },
        error: (err) => console.error('Error al crear facultad', err)
      });
    }
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
      timer: undefined, // para que no se cierre automáticamente
      didOpen: () => {
        const confirmBtn = document.getElementById('confirmarEliminar');
        const cancelBtn = document.getElementById('cancelarEliminar');
  
        confirmBtn?.addEventListener('click', () => {
          Swal.close();
          this.facultadesService.eliminarFacultad(facultad.id!).subscribe({
            next: () => {
              this.obtenerFacultades();
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
