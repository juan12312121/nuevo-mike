import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../core/autenticacion/usuarios.service';

@Component({
  selector: 'app-modalprofesores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modalprofesores.component.html',
  styleUrls: ['./modalprofesores.component.css']
})
export class ModalprofesoresComponent implements OnChanges {
  @Input() modalVisible = false;
  @Input() profesorToEdit: any = null;  // Si viene un profesor, entramos en modo "editar"

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() registroExitoso = new EventEmitter<any>(); // Emite al padre tanto creaciones como actualizaciones

  usuario = {
    nombre: '',
    correo: '',
    contrasena: ''
  };

  constructor(private usuariosService: UsuariosService) {}

  ngOnChanges(changes: SimpleChanges) {
    // Cuando abra el modal, si recibimos profesorToEdit, precargamos los campos
    if (changes['modalVisible'] && this.modalVisible) {
      if (this.profesorToEdit) {
        // Prefill para editar
        this.usuario = {
          nombre: this.profesorToEdit.nombre,
          correo: this.profesorToEdit.correo,
          contrasena: ''  // dejar vacío para no exponer hash
        };
      } else {
        // Reset para creación
        this.usuario = { nombre: '', correo: '', contrasena: '' };
      }
    }
  }

  registrarOActualizar(): void {
    if (!this.usuario.nombre || !this.usuario.correo) {
      console.error('Nombre y correo son obligatorios');
      return;
    }

    // Distinguimos modo de creación vs edición
    if (this.profesorToEdit) {
      // Editar
      console.log('Actualizando profesor ID:', this.profesorToEdit.id, 'con datos:', this.usuario);
      const payload: any = {
        nombre: this.usuario.nombre,
        correo: this.usuario.correo
      };
      // Solo incluir contraseña si el usuario la cambió
      if (this.usuario.contrasena) {
        payload.contrasena = this.usuario.contrasena;
      }

      this.usuariosService.actualizarProfesor(this.profesorToEdit.id, payload)
        .subscribe({
          next: res => {
            console.log('Profesor actualizado:', res.profesor);
            this.registroExitoso.emit(res.profesor);
            this.cerrar();
          },
          error: err => console.error('Error actualizando profesor:', err)
        });

    } else {
      // Crear
      console.log('Registrando nuevo profesor:', this.usuario);
      this.usuariosService.registrarProfesor(this.usuario)
        .subscribe({
          next: res => {
            console.log('Profesor registrado:', res.profesor);
            this.registroExitoso.emit(res.profesor);
            this.cerrar();
          },
          error: err => console.error('Error registrando profesor:', err)
        });
    }
  }

  cerrar(): void {
    this.cerrarModal.emit();
  }
}