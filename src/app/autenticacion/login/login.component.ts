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
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    // Inicializar el formulario con las credenciales de desarrollo
    this.loginForm = this.fb.group({
      correo: ['admin@admin.com', [Validators.required, Validators.email]],
      contrasena: ['admin123', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit(): void {
    // Limpiar mensaje de error previo
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.showFormErrors();
      return;
    }

    this.isLoading = true;

    this.usuariosService.login(this.loginForm.value).subscribe({
      next: ({ token, usuario }) => {
        this.isLoading = false;
        console.log('Usuario recibido:', usuario);

        if (!usuario || !usuario.rol_id) {
          this.errorMessage = 'Error del servidor: Datos de usuario incompletos.';
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
            this.router.navigate(['/jefe-grupo']);
            break;
          case 2:
            this.router.navigate(['/checador']);
            break;
          case 1:
            this.router.navigate(['/profes-asignacion']);
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al hacer login', err);
        this.handleLoginError(err);
      }
    });
  }

  // Método para rellenar rápidamente las credenciales de administrador
  fillAdminCredentials(): void {
    this.loginForm.patchValue({
      correo: 'admin@admin.com',
      contrasena: 'admin123'
    });
    this.errorMessage = null;
  }

  // Método para limpiar el formulario
  clearForm(): void {
    this.loginForm.reset();
    this.errorMessage = null;
  }

  private showFormErrors(): void {
    const correoControl = this.loginForm.get('correo');
    const contrasenaControl = this.loginForm.get('contrasena');

    if (correoControl?.hasError('required')) {
      this.errorMessage = 'Por favor, ingrese su correo electrónico.';
    } else if (correoControl?.hasError('email')) {
      this.errorMessage = 'Por favor, ingrese un correo electrónico válido.';
    } else if (contrasenaControl?.hasError('required')) {
      this.errorMessage = 'Por favor, ingrese su contraseña.';
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }

  private handleLoginError(err: any): void {
    // Verificar diferentes tipos de errores de autenticación
    if (err.status === 401) {
      this.errorMessage = 'Credenciales incorrectas. Verifique su correo y contraseña.';
    } else if (err.status === 403) {
      this.errorMessage = 'Acceso denegado. Su cuenta puede estar desactivada.';
    } else if (err.status === 404) {
      this.errorMessage = 'Usuario no encontrado. Verifique su correo electrónico.';
    } else if (err.status === 422) {
      this.errorMessage = 'Datos inválidos. Verifique la información ingresada.';
    } else if (err.status === 0 || err.status >= 500) {
      this.errorMessage = 'Error de conexión. Intente nuevamente en unos momentos.';
    } else if (err.error?.message) {
      // Personalizar mensajes específicos del backend
      const serverMessage = err.error.message.toLowerCase();
      if (serverMessage.includes('password') || serverMessage.includes('contraseña')) {
        this.errorMessage = 'Contraseña incorrecta. Intente nuevamente.';
      } else if (serverMessage.includes('email') || serverMessage.includes('correo')) {
        this.errorMessage = 'Correo electrónico no registrado.';
      } else if (serverMessage.includes('credentials') || serverMessage.includes('credenciales')) {
        this.errorMessage = 'Credenciales incorrectas. Verifique su información.';
      } else {
        this.errorMessage = 'Error de autenticación. Verifique sus credenciales.';
      }
    } else {
      this.errorMessage = 'Error inesperado. Intente nuevamente.';
    }
  }

  // Método para limpiar errores cuando el usuario empiece a escribir
  onInputChange(): void {
    if (this.errorMessage) {
      this.errorMessage = null;
    }
  }
}