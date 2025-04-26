import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AulasService } from '../../core/aulas/aulas.service';

@Component({
  selector: 'app-modalaulas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modalaulas.component.html',
  styleUrls: ['./modalaulas.component.css']
})
export class ModalaulasComponent {
  @Input() show = false;  
  @Output() showChange = new EventEmitter<boolean>();
  @Output() aulaCreada = new EventEmitter<any>();

  nombre: string = '';
  showSuccess = false;
  showError = false;

  constructor(private aulasService: AulasService) {}

  close() {
    this.show = false;
    this.showChange.emit(false);
    this.reset();
  }

 // src/componentes/modalaulas/modalaulas.component.ts
save() {
  if (!this.nombre.trim()) return;
  this.showError = false;
  this.aulasService.crearAula({ nombre: this.nombre }).subscribe({
    next: resp => {
      // ✂ Extraemos solo el objeto creado:
      const nuevaAula = resp.data ?? resp;
      this.aulaCreada.emit(nuevaAula);

      this.showSuccess = true;
      setTimeout(() => this.close(), 1000);
    },
    error: err => {
      console.error('Error al crear aula:', err);
      this.showError = true;
    }
  });
}


  private reset() {
    this.nombre = '';
    this.showSuccess = false;
    this.showError = false;
  }
}
