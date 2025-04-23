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


  constructor(private gruposService: GruposService) {}

  ngOnInit(): void {
    this.getGrupos();
  }

  getGrupos(): void {
    this.gruposService.getGrupos().subscribe((data: any[]) => {
      this.grupos = data.map((g: any) => ({   // ← aquí
        id: g.id,
        nombre: g.grupo_nombre,
        carrera_nombre: g.carrera_nombre,
        semestre: g.semestre
      }));
      console.table(this.grupos);
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
