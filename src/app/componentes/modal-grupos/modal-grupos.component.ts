import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CarrerasService } from '../../core/carreras/carreras.service';
import { GruposService } from '../../core/grupos/grupos.service';


@Component({
  selector: 'app-modal-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-grupos.component.html',
  styleUrls: ['./modal-grupos.component.css']
})
export class ModalGruposComponent implements OnInit, OnChanges {
  nombre: string = '';
  carrera_id: number = 0;
  semestre: string = '';
  carreras: any[] = [];

  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() grupoActualizado = new EventEmitter<void>();

  // Nuevo input para recibir el grupo que vamos a editar
  @Input() grupoSeleccionado: any;

  editMode: boolean = false;
  private grupoId!: number;

  constructor(
    private carrerasService: CarrerasService,
    private gruposService: GruposService
  ) {}

  ngOnInit(): void {
    this.obtenerCarreras();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupoSeleccionado'] && this.grupoSeleccionado) {
      this.setGrupoEditar(this.grupoSeleccionado);
    }
  }

  obtenerCarreras(): void {
    this.carrerasService.obtenerCarreras().subscribe(
      (response) => (this.carreras = response),
      (error) => console.error('Error al obtener las carreras:', error)
    );
  }

  open(): void {
    this.isOpen = true;
    this.isOpenChange.emit(this.isOpen);
  }

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
    this.resetForm();
  }

  private resetForm(): void {
    this.nombre = '';
    this.carrera_id = 0;
    this.semestre = '';
    this.editMode = false;
    this.grupoId = 0;
  }

  private setGrupoEditar(grupo: any): void {
    this.nombre = grupo.nombre;
    this.carrera_id = grupo.carrera_id;
    this.semestre = grupo.semestre;
    this.grupoId = grupo.id;
    this.editMode = true;
    this.open();
  }

  guardarOActualizar(): void {
    const payload = {
      nombre: this.nombre,
      carrera_id: this.carrera_id,
      semestre: this.semestre
    };
  
    const accion = this.editMode ? 'actualizar' : 'crear';
    const obs = this.editMode
      ? this.gruposService.actualizarGrupo(this.grupoId, payload)
      : this.gruposService.crearGrupo(payload);
  
    obs.subscribe(
      () => {
        // Toast de éxito
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: this.editMode
            ? 'Grupo actualizado correctamente'
            : 'Grupo creado correctamente',
          showConfirmButton: false,
          timer: 1500
        });
        this.close();
        this.grupoActualizado.emit();
      },
      (error) => {
        console.error(`Error al ${accion} grupo:`, error);
        // Toast de error
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: this.editMode
            ? 'No se pudo actualizar el grupo'
            : 'No se pudo crear el grupo',
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }
  
}
