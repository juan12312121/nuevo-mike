import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../core/autenticacion/usuarios.service'; // Ajusta la ruta según tu proyecto

@Component({
  selector: 'app-aside-administrador',
  standalone: true,
  imports: [RouterModule],    // <- Aquí va RouterModule (un NgModule), NO Router
  templateUrl: './aside-administrador.component.html',
  styleUrls: ['./aside-administrador.component.css']
})
export class AsideAdministradorComponent {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router        // <- Inyeción normal de la clase Router
  ) {}

  logout(): void {
    // Borra token + usuario de localStorage
    this.usuariosService.logout();

    // Redirige a /login
    this.router.navigate(['/login']);
  }
}
