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
  modalOpen = false;
  grupoAEditar: any = null;
  modalVisible: boolean = false;


  constructor(private gruposService: GruposService) { }

  ngOnInit(): void {
    this.getGrupos();
  }

  getGrupos(): void {
    this.gruposService.getGrupos().subscribe({
      next: (response: any) => {
        console.log('📦 Respuesta completa del backend:', response);

        // El backend devuelve { message: string, data: Grupo[] }
        if (response.data && Array.isArray(response.data)) {
          this.grupos = response.data.map((g: any) => ({
            id: g.id,
            nombre: g.nombre, // Ya no es grupo_nombre, es nombre directamente
            carrera_nombre: g.carrera?.nombre || 'Sin carrera', // Acceder a carrera.nombre
            semestre: g.semestre
          }));
          console.log('✅ Grupos mapeados:', this.grupos);
          console.table(this.grupos);
        } else {
          // Caso cuando el usuario no tiene carrera asignada o no hay grupos
          console.warn('⚠️ No hay grupos disponibles:', response.message);
          this.grupos = [];

          // Mostrar mensaje informativo al usuario
          if (response.message) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'info',
              title: response.message,
              showConfirmButton: false,
              timer: 3000
            });
          }
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener grupos:', error);
        this.grupos = [];

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
}
