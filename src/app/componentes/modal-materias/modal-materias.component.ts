import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarrerasService } from '../../core/carreras/carreras.service';
import { MateriasService } from '../../core/materias/materias.service';

@Component({
  selector: 'app-modal-materias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-materias.component.html',
  styleUrls: ['./modal-materias.component.css']
})
export class ModalMateriasComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() materiaEditando: any = null;
  @Output() modalStatusChange = new EventEmitter<boolean>();
  @Output() materiaAgregada   = new EventEmitter<any>();

  materia: {
    nombre: string;
    carrera: { carrera_id: string; carrera_nombre: string } | null;
  } = { nombre: '', carrera: null };

  carreras: { carrera_id: string; carrera_nombre: string }[] = [];
  showSuccessMessage = false;
  showErrorMessage   = false;

  constructor(
    private materiasService: MateriasService,
    private carrerasService: CarrerasService
  ) {}

  ngOnInit(): void {
    this.carrerasService.obtenerCarreras()
      .subscribe({
        next: data => this.carreras = data,
        error: err => console.error('Error al obtener carreras:', err)
      });
  }

  ngOnChanges(): void {
    if (this.materiaEditando) {
      this.materia = {
        nombre: this.materiaEditando.nombre,
        carrera: {
          carrera_id: this.materiaEditando.carrera?.carrera_id,
          carrera_nombre: this.materiaEditando.carrera?.nombre
        }
      };
    } else {
      this.resetForm();
    }
  }

  close(): void {
    this.modalStatusChange.emit(false);
    this.resetForm();
    this.showSuccessMessage = false;
    this.showErrorMessage   = false;
  }

  guardarMateria(): void {
    if (!this.materia.nombre || !this.materia.carrera) return;
    this.showErrorMessage = false;

    const { carrera_id, carrera_nombre } = this.materia.carrera;

    const callback = (saved: any) => {
      const materiaCompleta = {
        id: saved.id ?? this.materiaEditando?.id,
        nombre: this.materia.nombre,
        semestre: saved.semestre ?? 1,
        carrera: {
          carrera_id,
          nombre: carrera_nombre
        }
      };
      this.materiaAgregada.emit(materiaCompleta);
      this.showSuccessMessage = true;
      setTimeout(() => this.close(), 1000);
    };

    if (this.materiaEditando) {
      this.materiasService.actualizarMateria(
        this.materiaEditando.id,
        this.materia.nombre,
        Number(carrera_id)
      ).subscribe({
        next: callback,
        error: err => {
          console.error('Error al actualizar materia:', err);
          this.showErrorMessage = true;
        }
      });
    } else {
      this.materiasService.crearMateria(this.materia.nombre, Number(carrera_id)).subscribe({
        next: callback,
        error: err => {
          console.error('Error al crear materia:', err);
          this.showErrorMessage = true;
        }
      });
    }
  }

  private resetForm(): void {
    this.materia = { nombre: '', carrera: null };
    this.materiaEditando = null;
  }
}
