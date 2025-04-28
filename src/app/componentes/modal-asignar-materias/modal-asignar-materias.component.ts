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

import { AsignacionMateriasService } from '../../core/asignaciones/asignacion-materias.service';
import { UsuariosService } from '../../core/autenticacion/usuarios.service';
import { MateriasService } from '../../core/materias/materias.service';

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
  @Output() editar  = new EventEmitter<{ profesor_id: number; materia_id: number }>();

  /** Formulario */
  form = new FormGroup({
    profesorId: new FormControl<number|null>(null, Validators.required),
    materiaId:  new FormControl<number|null>(null, Validators.required)
  });

  profesores: any[] = [];
  isSaving = false; // Bandera para evitar doble envío

  materias:   any[] = [];

  isEditMode = false;
  private asignacionId: number | null = null;

  constructor(
    private asignService:   AsignacionMateriasService,
    private usuariosService: UsuariosService,
    private materiasService: MateriasService
  ) {}

  ngOnInit(): void {
    this.obtenerProfesores();
    this.obtenerMaterias();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['asignacion'] && this.asignacion) {
      // Si hay asignación para editar
      this.isEditMode = true;
      this.asignacionId = this.asignacion.id; // Asignamos el id de la asignación
      this.form.patchValue({
        profesorId: this.asignacion.profesor_id,
        materiaId: this.asignacion.materia_id
      });
    } else {
      // Si no hay asignación o está vacía, es modo creación
      this.isEditMode = false;
      this.form.reset(); // Limpiamos el formulario
    }
  }
  

  /** Cierra el modal */
  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.form.reset();
    this.isEditMode = false;
    this.asignacionId = null;
  }
  
  guardarAsignacion(): void {
    if (this.form.invalid || this.isSaving) {
      console.error('Formulario inválido o ya está guardando', this.form.value);
      return;
    }
  
    // Marca como "en proceso de guardado"
    this.isSaving = true;
  
    const { profesorId, materiaId } = this.form.value as { profesorId: number; materiaId: number };
  
    if (this.isEditMode && this.asignacionId !== null) {
      // Si es modo edición
      this.asignService.actualizarAsignacion(this.asignacionId, profesorId, materiaId)
        .subscribe({
          next: res => {
            console.log('Asignación actualizada:', res);
            this.editar.emit({ profesor_id: profesorId, materia_id: materiaId });
            this.close(); // Cierra el modal
          },
          error: err => {
            console.error('Error al actualizar:', err);
            this.isSaving = false; // Permite enviar nuevamente si ocurre un error
          }
        });
    } else {
      // Si es creación
      this.asignService.crearAsignacion(profesorId, materiaId)
        .subscribe({
          next: res => {
            console.log('Asignación creada:', res);
            this.asignar.emit({ profesor_id: profesorId, materia_id: materiaId });
            this.close(); // Cierra el modal
          },
          error: err => {
            console.error('Error al crear:', err);
            this.isSaving = false; // Permite enviar nuevamente si ocurre un error
          }
        });
    }
  }
  

  private obtenerProfesores(): void {
    this.usuariosService.listarProfesores().subscribe({
      next: r => {
        // Asegúrate de que 'r' tenga la propiedad 'profesores'
        if (r && r.profesores) {
          // Filtra solo los profesores (rol_id = 1)
          this.profesores = r.profesores.filter((usuario: any) => usuario.rol_id === 1);
        } else {
          console.error('La respuesta no contiene la propiedad "profesores"');
        }
      },
      error: e => console.error('Error al cargar profesores:', e)
    });
  }
  

  private obtenerMaterias(): void {
    this.materiasService.obtenerMaterias().subscribe({
      next: r => this.materias = r.data,
      error: e => console.error('Error al cargar materias:', e)
    });
  }
}
