import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  onCancel(): void {
    this.cancel.emit();
  }

  onSave(): void {
    this.saved.emit({
      asignacionId: this.asignacionId,
      fecha: this.fecha,
      asistio: this.asistio,
      tema: this.tema.trim() || undefined
    });
    this.temaAnterior = this.tema;
  }

  selectSuggestion(text: string): void {
    this.tema = text;
    this.updateCharCount();
  }

  setTemaAnterior(): void {
    this.tema = this.temaAnterior;
    this.updateCharCount();
  }

  updateCharCount(): void {
    this.charCount = this.tema.length;
  }

  format(command: 'bold' | 'italic' | 'list'): void {
    document.execCommand(command);
    this.updateCharCount();
  }
}
