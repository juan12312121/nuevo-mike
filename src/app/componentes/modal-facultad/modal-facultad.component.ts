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
import { Escuela, EscuelasService } from '../../core/escuelas/escuelas.service';
import { Facultad } from '../../core/facultad/facultades.service';

// Tipo específico para el formulario, separado de la entidad Facultad
interface FacultadForm {
  nombre: string;
  escuela_id: number;
  descripcion: string;
  email_contacto: string;
  telefono_contacto: string;
}

@Component({
  selector: 'app-modal-facultad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-facultad.component.html',
  styleUrls: ['./modal-facultad.component.css']
})
export class ModalFacultadComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() facultadAEditar: Facultad | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Facultad>();

  escuelas: Escuela[] = [];
  nuevaFacultad: FacultadForm = this.resetForm();

  constructor(private escuelasService: EscuelasService) {}

  ngOnInit(): void {
    this.cargarEscuelas();
    if (this.facultadAEditar) {
      this.patchForm(this.facultadAEditar);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const cambioFacultad = changes['facultadAEditar'];
    if (cambioFacultad && cambioFacultad.currentValue) {
      this.patchForm(cambioFacultad.currentValue as Facultad);
    }
  }

  /**
   * Reinicia el formulario a valores por defecto
   */
  private resetForm(): FacultadForm {
    return { nombre: '', escuela_id: 0, descripcion: '', email_contacto: '', telefono_contacto: '' };
  }

  /**
   * Rellena el formulario con una Facultad existente
   */
  private patchForm(f: Facultad): void {
    this.nuevaFacultad = {
      nombre: f.nombre || '',
      escuela_id: f.escuela_id || 0,
      descripcion: f.descripcion ?? '',
      email_contacto: f.email_contacto ?? '',
      telefono_contacto: f.telefono_contacto ?? ''
    };
  }

  cargarEscuelas(): void {
    this.escuelasService.verEscuelas().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.escuelas = data;
        } else if (data && Array.isArray((data as any).escuelas)) {
          this.escuelas = (data as any).escuelas;
        } else {
          console.error('Respuesta inesperada de verEscuelas:', data);
        }
      },
      error: (err) => console.error('Error cargando escuelas:', err)
    });
  }

  onClose(): void {
    this.nuevaFacultad = this.resetForm();
    this.close.emit();
  }

  onSave(): void {
    // Validación básica
    if (!this.nuevaFacultad.nombre.trim() || this.nuevaFacultad.escuela_id === 0) {
      console.error('El nombre y la escuela son obligatorios.');
      return;
    }

    // Construimos el objeto Facultad garantizando strings definidos
    const facultadToSave: Facultad = {
      ...(this.facultadAEditar?.id !== undefined && { id: this.facultadAEditar.id }),
      nombre: this.nuevaFacultad.nombre.trim(),
      escuela_id: this.nuevaFacultad.escuela_id,
      descripcion: this.nuevaFacultad.descripcion.trim(),
      email_contacto: this.nuevaFacultad.email_contacto.trim(),
      telefono_contacto: this.nuevaFacultad.telefono_contacto.trim()
    } as Facultad;

    this.save.emit(facultadToSave);
    this.nuevaFacultad = this.resetForm();
  }
}
