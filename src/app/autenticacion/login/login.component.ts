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
        console.log('Usuario recibido:', usuario);
  
        if (!usuario || !usuario.rol_id) {
          this.errorMessage = 'La respuesta del servidor no es válida.';
          return;
        }
  
        // Redirección según el rol_id
        switch (usuario.rol_id) {
          case 5:
            this.router.navigate(['/administrador']);
            break;
          case 4:
            this.router.navigate(['/jefe-carrera']);
            break;
          case 3:
            this.router.navigate(['/jefe-grupo']); // Asegúrate que esta ruta existe
            break;
          case 2:
            this.router.navigate(['/registro-asistencia']);
            break;
          case 1:
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
