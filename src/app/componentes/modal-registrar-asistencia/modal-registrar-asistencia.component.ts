import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-registrar-asistencia',
  standalone: true,
  imports: [],                // si tu modal usa ngIf/ngFor etc. añade CommonModule
  templateUrl: './modal-registrar-asistencia.component.html',
  styleUrls: ['./modal-registrar-asistencia.component.css']
})
export class ModalRegistrarAsistenciaComponent {
  @Input() asignacionId!: number;
  @Input() materia!: string;
  @Input() profesor!: string;
  @Input() fecha!: Date;

  @Output() saved = new EventEmitter<{ asignacionId: number, status: string }>();
  @Output() cancel = new EventEmitter<void>();

  // método para emitir saved o cancel dentro de tu modal…
}
