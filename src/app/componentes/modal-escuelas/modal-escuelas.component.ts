import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-escuelas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-escuelas.component.html',
  styleUrls: ['./modal-escuelas.component.css']
})
export class ModalEscuelasComponent {
  @Input() isOpen: boolean = false;
  @Input() escuelaData: any = { id: null, folio: '', nombre: '' }; // Aseguramos que el ID sea parte del objeto
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  cerrarModal() {
    this.close.emit();
  }

  guardarEscuela() {
    if (!this.escuelaData.folio || !this.escuelaData.nombre) {
      alert('Por favor, complete todos los campos');
      return;
    }

    // Aquí se decide si es una creación o una actualización
    if (this.escuelaData.id) {
      // Si tiene ID, es una actualización
      this.save.emit({ ...this.escuelaData });
    } else {
      // Si no tiene ID, es una creación
      this.save.emit({ ...this.escuelaData });
    }
  }
}
