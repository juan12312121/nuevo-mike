import { Component } from '@angular/core';
import { UsuariosService } from '../../core/autenticacion/usuarios.service'; // Ensure the correct import path

@Component({
  selector: 'app-aside-jefe-grupo',
  standalone: true,
  imports: [],
  templateUrl: './aside-jefe-grupo.component.html',
  styleUrl: './aside-jefe-grupo.component.css'
})
export class AsideJefeGrupoComponent {
  router: any;
  constructor(private authService: UsuariosService) {}

  cerrarSesion(): void {
    console.log('Método cerrarSesion() llamado');
    this.authService.logout();
    this.router.navigate(['/login']); // O usa window.location.href si no usas router
  }
  
}
