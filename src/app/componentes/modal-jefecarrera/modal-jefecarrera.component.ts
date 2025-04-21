import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../core/autenticacion/usuarios.service'; // Adjust path
import { CarrerasService } from '../../core/carreras/carreras.service'; // Adjust path

@Component({
  selector: 'app-modal-jefecarrera',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-jefecarrera.component.html',
  styleUrls: ['./modal-jefecarrera.component.css']
})
export class ModalJefecarreraComponent implements OnInit {

  @Output() cerrarModal: EventEmitter<void> = new EventEmitter();
  @Input() usuarioId: number | null = null;  // To receive the user ID (if updating)
  @Input() esActualizar: boolean = false;    // Flag for update mode

  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  carrera_id: number = 1; // Assuming the Head of Career has a career assigned
  carreras: any[] = []; // List of careers

  constructor(private carrerasService: CarrerasService, private usuariosService: UsuariosService) {}

  ngOnInit() {
    // Get careers list
    console.log('Iniciando la obtención de carreras...');
    this.carrerasService.obtenerCarreras().subscribe({
      next: (data) => {
        console.log('Carreras obtenidas:', data);
        this.carreras = data;
      },
      error: (err) => {
        console.error('Error al obtener las carreras:', err);
      }
    });

    // If updating, fetch the user data
    if (this.esActualizar && this.usuarioId) {
      this.usuariosService.obtenerUsuarioPorId(this.usuarioId).subscribe({
        next: (res) => {
          const usuario = res.usuario;
          this.nombre = usuario.nombre;
          this.correo = usuario.correo;
          this.carrera_id = usuario.carrera_id;
        },
        error: (err) => {
          console.error('Error al obtener los datos del usuario:', err);
        }
      });
    }
  }

  onCerrar() {
    this.cerrarModal.emit();
  }

  // Function to create or update Head of Career
  registrarOActualizarJefe() {
    const nuevoJefe = {
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena,
      carrera_id: this.carrera_id
    };

    if (this.esActualizar && this.usuarioId) {
      // Update Head of Career
      this.usuariosService.actualizarUsuario(this.usuarioId, nuevoJefe).subscribe({
        next: (res) => {
          console.log('Jefe de carrera actualizado exitosamente:', res);
          this.onCerrar();

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Jefe de carrera actualizado con éxito',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        },
        error: (err) => {
          console.error('Error al actualizar el jefe de carrera:', err);

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Error al actualizar el jefe de carrera',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        }
      });
    } else {
      // Create new Head of Career
      this.usuariosService.registrarJefeDeCarrera(nuevoJefe).subscribe({
        next: (res) => {
          console.log('Jefe de carrera registrado exitosamente:', res);
          this.onCerrar();

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Jefe de carrera registrado con éxito',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        },
        error: (err) => {
          console.error('Error al registrar el jefe de carrera:', err);

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Error al registrar el jefe de carrera',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        }
      });
    }
  }
}
