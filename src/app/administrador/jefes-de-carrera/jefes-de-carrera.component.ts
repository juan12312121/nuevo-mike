import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { AsideAdministradorComponent } from "../../componentes/aside-administrador/aside-administrador.component";
import { ModalJefecarreraComponent } from "../../componentes/modal-jefecarrera/modal-jefecarrera.component";
import { PaginacionAdministradorComponent } from "../../componentes/paginacion-administrador/paginacion-administrador.component";
import { UsuariosService } from '../../core/autenticacion/usuarios.service';

@Component({
  selector: 'app-jefes-de-carrera',
  standalone: true,
  imports: [
    AsideAdministradorComponent,
    PaginacionAdministradorComponent,
    CommonModule,
    ModalJefecarreraComponent
  ],
  templateUrl: './jefes-de-carrera.component.html',
  styleUrls: ['./jefes-de-carrera.component.css']
})
export class JefesDeCarreraComponent implements OnInit {
  jefes: any[] = [];
  mostrarModal: boolean = false;
  usuarioId: number | null = null; 
  esActualizar: boolean = false;

  // ↓↓↓ Propiedades de paginación ↓↓↓
  currentPage = 1;
  pageSize = 10;

  searchTerm: any;
  filtroEstado: any;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    console.log('Componente JefesDeCarrera inicializado');
    this.obtenerJefes();
  }

  obtenerJefes(): void {
    console.log('Llamando al servicio para obtener los jefes de carrera');
    this.usuariosService.obtenerJefesDeCarrera().subscribe({
      next: (res) => {
        console.log('Respuesta recibida de obtenerJefesDeCarrera:', res);
        if (res.jefes) {
          this.jefes = res.jefes;
          console.log('Jefes de carrera obtenidos:', this.jefes);
          // Reiniciamos la página cuando cargan los datos
          this.currentPage = 1;
        } else {
          console.error('La respuesta no contiene la propiedad "jefes":', res);
        }
      },
      error: (err) => {
        console.error('Error al obtener jefes de carrera:', err);
      }
    });
  }

  abrirModal(id: number | null = null): void {
    console.log('Abriendo modal');
    if (id) {
      this.usuarioId = id;
      this.esActualizar = true;
    } else {
      this.usuarioId = null;
      this.esActualizar = false;
    }
    this.mostrarModal = true;
  }

  eliminarJefe(jefe: any): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: `¿Eliminar a "${jefe.usuario_nombre}"?`,
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
          this.usuariosService.eliminarUsuario(jefe.usuario_id).subscribe({
            next: () => {
              this.obtenerJefes(); // Recargar la lista
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Jefe de carrera eliminado con éxito',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
              });
            },
            error: (err) => {
              console.error('Error al eliminar jefe de carrera:', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al intentar eliminar al jefe de carrera.'
              });
            }
          });
        });

        cancelBtn?.addEventListener('click', () => {
          Swal.close();
        });
      }
    });
  }

  cerrarModal() {
    console.log('Cerrando modal');
    this.mostrarModal = false;
    this.obtenerJefes(); // Refrescar datos tras cerrar el modal
  }

  // ↓↓↓ Handler para el evento pageChanged ↓↓↓
  onPageChange(page: number) {
    console.log('Página seleccionada:', page);
    this.currentPage = page;
  }

  // ↓↓↓ Getter que devuelve solo el slice de jefes según página actual ↓↓↓
  get paginatedJefes(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.jefes.slice(start, start + this.pageSize);
  }
}
