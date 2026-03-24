import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Renderer2
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService, Usuario } from '../../core/autenticacion/usuarios.service';

@Component({
  selector: 'app-aside-jefecarrera',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aside-jefecarrera.component.html',
  styleUrls: ['./aside-jefecarrera.component.css']
})
export class AsideJefecarreraComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.usuario = this.usuariosService.getUsuario();
    // Inyecta Font Awesome si no lo has hecho en index.html
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(
      link,
      'href',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
    );
    this.renderer.appendChild(document.head, link);
  }

  logout(): void {
    this.usuariosService.logout();
    this.router.navigateByUrl('/login');
  }
}
