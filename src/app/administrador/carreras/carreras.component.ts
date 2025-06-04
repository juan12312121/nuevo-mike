import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AsideAdministradorComponent } from '../../componentes/aside-administrador/aside-administrador.component';
import { ModalCarrerasComponent } from '../../componentes/modal-carreras/modal-carreras.component';
import { PaginacionAdministradorComponent } from '../../componentes/paginacion-administrador/paginacion-administrador.component';
import { CarrerasService } from '../../core/carreras/carreras.service';

interface Carrera {
  carrera_id: number;
  carrera_nombre: string;
  facultad_nombre: string;
  escuela_nombre: string;
}

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [
    CommonModule,
    AsideAdministradorComponent,
    FormsModule,
    ModalCarrerasComponent,
    PaginacionAdministradorComponent
  ],
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit {
  carreras: Carrera[] = [];
  carrerasFiltradas: Carrera[] = [];
  busqueda: string = '';
  mostrarModal: boolean = false;
  carreraSeleccionada: Carrera | null = null;

  // ↓↓↓ Propiedades de paginación ↓↓↓
  currentPage = 1;
  pageSize = 10;

  constructor(private carrerasService: CarrerasService) {}

  ngOnInit(): void {
    this.obtenerCarreras();
  }

  obtenerCarreras(): void {
    this.carrerasService.obtenerCarreras().subscribe({
      next: (data: Carrera[]) => {
        this.carreras = data.map(c => ({
          carrera_id: c.carrera_id,
          carrera_nombre: c.carrera_nombre,
          facultad_nombre: c.facultad_nombre,
          escuela_nombre: c.escuela_nombre
        }));
        // Inicialmente mostramos todas las carreras
        this.filtrarCarreras();
        // Reiniciamos la página al recargar datos
        this.currentPage = 1;
      },
      error: (err: any) => console.error('Error al obtener carreras:', err)
    });
  }

  eliminarCarrera(carrera: Carrera): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: `¿Eliminar "${carrera.carrera_nombre}"?`,
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
          this.carrerasService.eliminarCarrera(carrera.carrera_id).subscribe({
            next: () => {
              this.obtenerCarreras();
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Carrera eliminada con éxito',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
              });
            },
            error: (err) => {
              console.error('Error al eliminar carrera', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al intentar eliminar la carrera.'
              });
            }
          });
        });
        
        cancelBtn?.addEventListener('click', () => Swal.close());
      }
    });
  }
  
  filtrarCarreras(): void {
    const busq = this.busqueda.trim().toLowerCase();
    if (!busq) {
      this.carrerasFiltradas = [...this.carreras];
    } else {
      this.carrerasFiltradas = this.carreras.filter(c =>
        c.carrera_nombre.toLowerCase().includes(busq) ||
        c.facultad_nombre.toLowerCase().includes(busq) ||
        c.escuela_nombre.toLowerCase().includes(busq)
      );
    }
    // Cada vez que filtras, reinicias la página a 1
    this.currentPage = 1;
  }

  abrirModal(carrera?: Carrera): void {
    if (carrera) {
      this.carreraSeleccionada = carrera;
    } else {
      this.carreraSeleccionada = null;
    }
    this.mostrarModal = true;
  }
  
  cerrarModal(): void {
    this.mostrarModal = false;
    this.carreraSeleccionada = null;
  }

  agregarCarrera(): void {
    // Después de crear o editar, recargamos el listado
    this.obtenerCarreras();
    this.cerrarModal();
  }

  // ↓↓↓ Método que recibe el cambio de página desde PaginacionAdministradorComponent ↓↓↓
  onPageChange(page: number) {
    this.currentPage = page;
  }

  // ↓↓↓ Getter que devuelve sólo el slice de carreras según página actual ↓↓↓
  get paginatedCarreras(): Carrera[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.carrerasFiltradas.slice(start, start + this.pageSize);
  }
}
