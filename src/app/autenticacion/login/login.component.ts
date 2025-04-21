import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../core/autenticacion/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  
    this.usuariosService.login(this.loginForm.value).subscribe({
      next: ({ token, usuario }) => {
        console.log('Usuario recibido:', usuario);  // Verifica la respuesta
  
        if (!usuario || !usuario.rol_id) {
          this.errorMessage = 'La respuesta del servidor no es válida.';
          return;
        }
  
        // Mapea el rol_id a un rol
        let rol: string;
        switch (usuario.rol_id) {
          case 5:
            rol = 'administrador';
            break;
          case 4:
            rol = 'jefe de carrera';
            break;
          case 3:
            rol = 'jefe de grupo';
            break;
          case 2:
            rol = 'checador';
            break;
          case 1:
            rol = 'profesor';
            break;
          default:
            rol = 'desconocido';
            break;
        }
  
        // Redirección según el rol
        switch (rol.toLowerCase()) {
          case 'administrador':
            this.router.navigate(['/administrador']);
            break;
          case 'jefe de carrera':
            this.router.navigate(['/jefe-carrera']);
            break;
          case 'jefe de grupo':
            this.router.navigate(['/grupos']);
            break;
          case 'checador':
            this.router.navigate(['/registro-asistencia']);
            break;
          case 'profesor':
            this.router.navigate(['/profes']);
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
      },
      error: (err) => {
        console.error('Error al hacer login', err);
        this.errorMessage = err.error.message || 'Usuario o contraseña incorrectos';
      }
    });
  }
  
}
