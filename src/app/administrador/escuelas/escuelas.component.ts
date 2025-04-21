// src/app/features/escuelas/escuelas.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { AsideAdministradorComponent } from '../../componentes/aside-administrador/aside-administrador.component';
import { ModalEscuelasComponent } from '../../componentes/modal-escuelas/modal-escuelas.component';
import { PaginacionAdministradorComponent } from '../../componentes/paginacion-administrador/paginacion-administrador.component';
import { EscuelasService } from '../../core/escuelas/escuelas.service';

@Component({
  selector: 'app-escuelas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AsideAdministradorComponent,
    ModalEscuelasComponent,
    PaginacionAdministradorComponent
  ],
  templateUrl: './escuelas.component.html',
  styleUrls: ['./escuelas.component.css']
})
export class EscuelasComponent implements OnInit {
  isModalOpen = false;
  escuelaForm = { id: null as number|null, folio: '', nombre: '' };
  escuelas: any[] = [];
  searchText = '';

  // Paginación
  currentPage = 1;
  pageSize = 8;

  constructor(private escuelasService: EscuelasService) {}

  ngOnInit() {
    this.getEscuelas();
  }

  openModal() {
    this.escuelaForm = { id: null, folio: '', nombre: '' };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveEscuela(data: any) {
    if (data.id) {
      // → Actualización
      this.escuelasService.actualizarEscuela(data.id, data.folio, data.nombre)
        .subscribe({
          next: () => {
            this.closeModal();
            this.getEscuelas();
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Escuela actualizada con éxito',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true
            });
          },
          error: () => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Error al actualizar escuela',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true
            });
          }
        });
    } else {
      // → Creación
      this.escuelasService.crearEscuela(data.folio, data.nombre)
        .subscribe({
          next: () => {
            this.closeModal();
            this.getEscuelas();
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Escuela creada con éxito',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true
            });
          },
          error: () => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Error al crear escuela',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true
            });
          }
        });
    }
  }

  getEscuelas() {
    this.escuelasService.verEscuelas().subscribe({
      next: data => this.escuelas = data.escuelas,
      error: err => console.error('Error al obtener escuelas:', err)
    });
  }

  // Paginación
  onPageChange(page: number) {
    this.currentPage = page;
  }
  get paginatedEscuelas() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.escuelas.slice(start, start + this.pageSize);
  }

  searchSchools() {
    if (this.searchText.trim()) {
      this.escuelas = this.escuelas.filter(e =>
        e.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        e.folio.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.getEscuelas();
    }
  }

  editEscuela(escuela: any) {
    this.escuelaForm = { ...escuela };
    this.isModalOpen = true;
  }

  eliminarEscuela(escuela: any): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: `¿Eliminar "${escuela.nombre}"?`, // Cambié 'escuela_nombre' por 'nombre'
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
          // Llamada al servicio pasando el id de la escuela
          this.escuelasService.eliminarEscuela(escuela.id).subscribe({
            next: () => {
              this.getEscuelas();
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Escuela eliminada con éxito',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
              });
            },
            error: (err) => {
              console.error('Error al eliminar escuela', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al intentar eliminar la escuela.'
              });
            }
          });
        });
  
        cancelBtn?.addEventListener('click', () => Swal.close());
      }
    });
  }
  
  
}
