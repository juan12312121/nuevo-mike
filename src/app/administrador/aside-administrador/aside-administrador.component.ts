import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../core/autenticacion/usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside-administrador',
  standalone: true,
  imports: [RouterModule, CommonModule],    // <- Añadido CommonModule
  templateUrl: './aside-administrador.component.html',
  styleUrls: ['./aside-administrador.component.css']
})
export class AsideAdministradorComponent {
  constructor(
    public usuariosService: UsuariosService, // public para usar en el template
    private router: Router
  ) {}

  logout(): void {
    // Borra token + usuario de localStorage
    this.usuariosService.logout();

    // Redirige a /login
    this.router.navigate(['/login']);
  }
}
