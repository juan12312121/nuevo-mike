import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsistenciaTemaService } from '../../core/asistencia-tema/asistencia-tema.service';

export interface SaveEvent {
  asignacionId: number;
  fecha: string;
  asistio: 'Asistió' | 'No Asistió' | 'Justificado';
  tema?: string;
}

@Component({
  selector: 'app-modal-registrar-tema-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-registrar-tema-asistencia.component.html',
  styleUrls: ['./modal-registrar-tema-asistencia.component.css']
})
export class ModalRegistrarTemaAsistenciaComponent {
  @Input() asignacionId!: number;
  @Input() materia!: string;
  @Input() profesor!: string;
  @Input() fecha!: string;

  @Output() saved = new EventEmitter<SaveEvent>();
  @Output() cancel = new EventEmitter<void>();

  asistio: 'Asistió' | 'No Asistió' | 'Justificado' = 'Asistió';
  tema: string = '';
  temaAnterior: string = '';
  charCount: number = 0;
  showModal: boolean = true;

  mensaje: string = '';
  mensajeTipo: 'success' | 'error' = 'success';
  cargando: boolean = false;

  temaRequeridoError: boolean = false;  // Para el error de tema requerido

  constructor(private asistenciaService: AsistenciaTemaService) {}

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario')!);
    const registrado_por_id = usuario?.id;
  
    if (!registrado_por_id || !this.asignacionId) {
      this.mostrarMensaje('Error: datos incompletos.', 'error');
      return;
    }
  
    // Validación si el profesor asistió pero no ingresó el tema
    if (this.asistio === 'Asistió' && this.tema.trim() === '' && this.profesor) {
      this.temaRequeridoError = true;
      this.mostrarMensaje('Debes ingresar un tema si asististe como profesor.', 'error');
      return;
    } else {
      this.temaRequeridoError = false;
    }
  
    const payload = {
      asignacion_id: this.asignacionId,
      asistio: this.asistio,       // ← cambio aquí: envío la cadena directamente
      registrado_por_id,
      tema: this.tema.trim() || undefined
    };
  
    this.cargando = true;
    console.log('Enviando payload:', payload);
  
    this.asistenciaService.registrarAsistenciaYTema(payload).subscribe({
      next: response => {
        console.log('Respuesta del servidor:', response);
        this.mostrarMensaje('Registro exitoso.', 'success');
        this.saved.emit({
          asignacionId: this.asignacionId,
          fecha: this.fecha,
          asistio: this.asistio,
          tema: this.tema
        });
        this.temaAnterior = this.tema;
        setTimeout(() => {
          this.mensaje = '';
          this.showModal = false;
        }, 1500);
        this.cargando = false;
      },
      error: err => {
        console.error('Error al registrar:', err);
        this.mostrarMensaje('Error al registrar.', 'error');
        this.cargando = false;
      }
    });
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.mensaje = mensaje;
    this.mensajeTipo = tipo;
    setTimeout(() => this.mensaje = '', 3000);
  }

  updateCharCount(): void {
    this.charCount = this.tema.length;
  }
}
