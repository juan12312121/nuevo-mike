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
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AsignacionMateriasService } from '../../../core/asignaciones/asignacion-materias.service';
import { UsuariosService } from '../../../core/autenticacion/usuarios.service';
import { MateriasService } from '../../../core/materias/materias.service';

@Component({
  selector: 'app-modal-asignar-materias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-asignar-materias.component.html',
  styleUrls: ['./modal-asignar-materias.component.css']
})
export class ModalAsignarMateriasComponent implements OnInit, OnChanges {
  /** Control de visibilidad */
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  /** Si se pasa, este objeto activa el modo edición */
  @Input() asignacion: { id: number; profesor_id: number; materia_id: number } | null = null;

  /** Emite al crear */
  @Output() asignar = new EventEmitter<{ profesor_id: number; materia_id: number }>();
  /** Emite al editar */
  @Output() editar = new EventEmitter<{ profesor_id: number; materia_id: number }>();

  /** Formulario */
  form = new FormGroup({
    profesorId: new FormControl<number | null>(null, Validators.required),
    materiaId: new FormControl<number | null>(null, Validators.required)
  });

  profesores: any[] = [];
  materias: any[] = [];
  isSaving = false; // Bandera para evitar doble envío
  isEditMode = false;
  private asignacionId: number | null = null;

  constructor(
    private asignService: AsignacionMateriasService,
    private usuariosService: UsuariosService,
    private materiasService: MateriasService
  ) {}

  ngOnInit(): void {
    this.obtenerProfesores();
    this.obtenerMaterias();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['asignacion']) {
      if (this.asignacion) {
        // Si hay asignación para editar
        this.isEditMode = true;
        this.asignacionId = this.asignacion.id;
        this.form.patchValue({
          profesorId: this.asignacion.profesor_id,
          materiaId: this.asignacion.materia_id
        });
      } else {
        // Si no hay asignación o está vacía, es modo creación
        this.isEditMode = false;
        this.asignacionId = null;
        this.form.reset();
      }
      // Resetea la bandera cuando cambia la asignación
      this.isSaving = false;
    }
  }

  /** Cierra el modal */
  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.form.reset();
    this.isEditMode = false;
    this.asignacionId = null;
    this.isSaving = false; // Asegura que se resetee la bandera
  }

 // En modal-asignar-materias.component.ts
// REEMPLAZA el método guardarAsignacion por este:

guardarAsignacion(): void {
  // Validaciones iniciales
  if (this.form.invalid) {
    this.marcarCamposComoTocados();
    return;
  }

  if (this.isSaving) {
    return; // Ya está en proceso de guardado
  }

  // Marca como "en proceso de guardado" INMEDIATAMENTE
  this.isSaving = true;

  const { profesorId, materiaId } = this.form.value as { profesorId: number; materiaId: number };

  if (this.isEditMode && this.asignacionId !== null) {
    // Modo edición - SIGUE llamando al servicio
    this.actualizarAsignacion(profesorId, materiaId);
  } else {
    // Modo creación - SOLO emite evento, NO llama al servicio
    console.log('🎯 Modal: Emitiendo evento de creación (SIN llamada al servicio)');
    this.asignar.emit({ profesor_id: profesorId, materia_id: materiaId });
    this.isSaving = false;
    this.close();
  }
}

// ELIMINA COMPLETAMENTE este método (si existe):
/*
private crearAsignacion(profesorId: number, materiaId: number): void {
  // ❌ ELIMINAR ESTE MÉTODO COMPLETO
}
*/

// El método actualizarAsignacion se mantiene igual

private crearAsignacion(profesorId: number, materiaId: number): void {
  this.asignService.crearAsignacion(profesorId, materiaId)  // ← Primera llamada al servicio
    .subscribe({
      next: (res) => {
        this.asignar.emit({ profesor_id: profesorId, materia_id: materiaId }); // ← Emite evento
        this.close();
      }
    });
}

  private actualizarAsignacion(profesorId: number, materiaId: number): void {
    if (this.asignacionId === null) {
      console.error('ID de asignación es null en modo edición');
      this.isSaving = false;
      return;
    }

    this.asignService.actualizarAsignacion(this.asignacionId, profesorId, materiaId)
      .subscribe({
        next: (res) => {
          console.log('Asignación actualizada exitosamente:', res);
          this.editar.emit({ profesor_id: profesorId, materia_id: materiaId });
          this.close();
        },
        error: (err) => {
          console.error('Error al actualizar la asignación:', err);
          this.isSaving = false;
        },
        complete: () => {
          this.isSaving = false;
        }
      });
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  private obtenerProfesores(): void {
    this.usuariosService.listarProfesores().subscribe({
      next: (r) => {
        if (r && r.profesores) {
          // Filtra solo los profesores (rol_id = 1)
          this.profesores = r.profesores.filter((usuario: any) => usuario.rol_id === 1);
        } else {
          console.error('La respuesta no contiene la propiedad "profesores"');
          this.profesores = [];
        }
      },
      error: (e) => {
        console.error('Error al cargar profesores:', e);
        this.profesores = [];
      }
    });
  }

  private obtenerMaterias(): void {
    this.materiasService.obtenerMaterias().subscribe({
      next: (r) => {
        this.materias = r.data || [];
      },
      error: (e) => {
        console.error('Error al cargar materias:', e);
        this.materias = [];
      }
    });
  }

  // Getter para validaciones en el template
  get profesorControl() {
    return this.form.get('profesorId');
  }

  get materiaControl() {
    return this.form.get('materiaId');
  }

  // Getter para verificar si el formulario es válido y no está guardando
  get puedeGuardar(): boolean {
    return this.form.valid && !this.isSaving;
  }
}