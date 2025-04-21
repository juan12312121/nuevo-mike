import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CarrerasService } from '../../core/carreras/carreras.service';
import { Facultad, FacultadesService } from '../../core/facultad/facultades.service';

@Component({
  selector: 'app-modal-carreras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-carreras.component.html',
  styleUrls: ['./modal-carreras.component.css']
})
export class ModalCarrerasComponent implements OnInit {
  @Input() carreraSeleccionada: any = null;  // Recibimos la carrera para editar
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() carreraGuardada = new EventEmitter<void>();
  facultades: Facultad[] = [];
  carreraForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private carrerasService: CarrerasService,
    private facultadesService: FacultadesService
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario
    this.carreraForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      facultad_id: ['', Validators.required]
    });

    // Cargar facultades
    this.facultadesService.obtenerFacultades().subscribe({
      next: fac => {
        this.facultades = fac;
        
        // Si estamos editando, cargamos los datos de la carrera en el formulario
        if (this.carreraSeleccionada) {
          this.carreraForm.patchValue({
            nombre: this.carreraSeleccionada.carrera_nombre,
            facultad_id: this.carreraSeleccionada.facultad_id // Asignamos la facultad seleccionada
          });
        }
      },
      error: err => console.error('Error cargando facultades:', err)
    });
  }

  cerrar(): void {
    this.cerrarModal.emit(); // Emitimos el evento de cerrar para que el componente padre cierre el modal
  }

  guardarCarrera(): void {
    if (this.carreraForm.invalid) return;

    const data = this.carreraForm.value;
    if (this.carreraSeleccionada) {
      // Si estamos editando, enviamos una actualización
      this.carrerasService.actualizarCarrera(this.carreraSeleccionada.carrera_id, data).subscribe({
        next: () => {
          this.carreraGuardada.emit();  // Emitimos el evento para notificar que la carrera ha sido guardada
          this.cerrar();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Carrera actualizada con éxito',
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
            title: 'Error al actualizar carrera',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        }
      });
    } else {
      // Si estamos creando, enviamos la creación
      this.carrerasService.crearCarrera(data).subscribe({
        next: () => {
          this.carreraGuardada.emit();  // Emitimos el evento para notificar que la carrera ha sido guardada
          this.cerrar();
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Carrera creada con éxito',
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
            title: 'Error al crear carrera',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        }
      });
    }
  }
}
