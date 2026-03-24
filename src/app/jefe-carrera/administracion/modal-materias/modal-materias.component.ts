import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarrerasService } from '../../../core/carreras/carreras.service';
import { MateriasService } from '../../../core/materias/materias.service';
import { UsuariosService } from '../../../core/autenticacion/usuarios.service';

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
  esJefeCarrera      = false;
  jefeCarreraId: number | null = null;

  constructor(
    private materiasService: MateriasService,
    private carrerasService: CarrerasService,
    private usuariosService: UsuariosService
  ) {}

  private checkJefeCarrera() {
    const currentUser = this.usuariosService.getUsuario();
    if (currentUser && currentUser.rol_id === 4) {
      this.esJefeCarrera = true;
      this.jefeCarreraId = currentUser.carrera_id;
    }
  }

  ngOnInit(): void {
    this.checkJefeCarrera();
    this.carrerasService.obtenerCarreras()
      .subscribe({
        next: data => {
          this.carreras = data;
          this.autoSelectCarrera();
        },
        error: err => console.error('Error al obtener carreras:', err)
      });
  }

  private autoSelectCarrera() {
    if (this.esJefeCarrera && this.jefeCarreraId) {
      const carreraEncontrada = this.carreras.find(c => Number(c.carrera_id) === Number(this.jefeCarreraId));
      if (carreraEncontrada) {
        this.materia.carrera = { ...carreraEncontrada };
      } else if (!this.materia.carrera) {
        // Si no está en la lista pero sabemos el ID, lo asignamos directamente
        this.materia.carrera = { carrera_id: String(this.jefeCarreraId), carrera_nombre: '' };
      }
    }
  }

  ngOnChanges(): void {
    if (this.show) {
      this.checkJefeCarrera();
      if (this.materiaEditando) {
        this.materia = {
          nombre: this.materiaEditando.nombre,
          carrera: {
            carrera_id: this.materiaEditando.carrera_id,
            carrera_nombre: this.materiaEditando.carrera?.nombre
          }
        };
      } else {
        this.resetForm();
        if (this.carreras.length > 0) {
          this.autoSelectCarrera();
        }
      }
    }
  }

  close(): void {
    this.modalStatusChange.emit(false);
    this.resetForm();
    this.showSuccessMessage = false;
    this.showErrorMessage   = false;
  }

  guardarMateria(): void {
    console.log('🚀 Intentando guardar materia:', this.materia);
    if (!this.materia.nombre || !this.materia.carrera) {
      console.warn('⚠️ No se puede guardar: falta nombre o carrera', this.materia);
      return;
    }
    this.showErrorMessage = false;

    const carrera_id = this.materia.carrera.carrera_id;
    const carrera_nombre = this.materia.carrera.carrera_nombre;
    
    if (!carrera_id) {
        console.error('❌ Error: el objeto carrera no tiene carrera_id', this.materia.carrera);
        this.showErrorMessage = true;
        return;
    }

    console.log(`📤 Enviando datos: Nombre: ${this.materia.nombre}, CarreraID: ${carrera_id}`);

    const callback = (saved: any) => {
      console.log('✅ Materia guardada con éxito:', saved);
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
        next: (res: any) => callback(res.data || res),
        error: err => {
          console.error('Error al actualizar materia:', err);
          this.showErrorMessage = true;
        }
      });
    } else {
      this.materiasService.crearMateria(this.materia.nombre, Number(carrera_id)).subscribe({
        next: (res: any) => callback(res.data || res),
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
