import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideAdministradorComponent } from '../../administrador/aside-administrador/aside-administrador.component';
import { UsuariosService } from '../../core/autenticacion/usuarios.service';
import { EscuelasService, Escuela } from '../../core/escuelas/escuelas.service';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AsideAdministradorComponent],
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.css']
})
export class UsuariosAdminComponent implements OnInit {
  escuelas: Escuela[] = [];
  nuevoAdmin = {
    nombre: '',
    correo: '',
    contrasena: '',
    escuela_id: 0
  };
  
  cargando = false;
  mensaje = '';

  constructor(
    private usuariosService: UsuariosService,
    private escuelasService: EscuelasService
  ) {}

  ngOnInit(): void {
    this.cargarEscuelas();
  }

  cargarEscuelas(): void {
    this.escuelasService.verEscuelas().subscribe({
      next: (res) => {
        this.escuelas = res.escuelas;
      },
      error: (err) => console.error('Error al cargar escuelas', err)
    });
  }

  registrarAdmin(): void {
    if (!this.nuevoAdmin.escuela_id) {
        this.mensaje = 'Por favor selecciona una escuela';
        return;
    }
    
    this.cargando = true;
    this.usuariosService.registrarAdminEscuela(this.nuevoAdmin).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensaje = 'Administrador creado con éxito';
        this.nuevoAdmin = { nombre: '', correo: '', contrasena: '', escuela_id: 0 };
      },
      error: (err) => {
        this.cargando = false;
        this.mensaje = 'Error al crear administrador';
        console.error(err);
      }
    });
  }
}
