import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from '../../core/autenticacion/usuarios.service';

@Component({
  selector: 'app-aside-jefe-grupo',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './aside-jefe-grupo.component.html',
  styleUrls: ['./aside-jefe-grupo.component.css']
})
export class AsideJefeGrupoComponent implements AfterViewInit {
  @ViewChildren('menuLink', { read: ElementRef })
  menuLinks!: QueryList<ElementRef>;

  constructor(
    private authService: UsuariosService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    // Recorre cada enlace del menú para controlar la clase "active"
    this.menuLinks.forEach(link => {
      this.renderer.listen(link.nativeElement, 'click', () => {
        // Primero quita "active" de todos
        this.menuLinks.forEach(l =>
          this.renderer.removeClass(l.nativeElement, 'active')
        );
        // Luego añade "active" al enlace clickeado
        this.renderer.addClass(link.nativeElement, 'active');
      });
    });
  }

  /**
   * Navega a la ruta que se pase como parámetro.
   */
  navegar(ruta: string): void {
    this.router.navigate([ruta]);
  }

  /**
   * Cierra la sesión: elimina token y usuario de localStorage, y redirige a /login
   */
  cerrarSesion(): void {
    console.log('1️⃣ Antes de logout()');
    this.authService.logout(); // Borra token y usuario
    console.log('2️⃣ Después de logout(), intentando redirigir a /login');

    // Forzamos ruta absoluta para evitar ambigüedades:
    this.router.navigateByUrl('/login')
      .then((navegó) => {
        console.log('3️⃣ navigateByUrl("/login") devolvió:', navegó);
      })
      .catch((err) => {
        console.error('❌ Error en navigateByUrl("/login"):', err);
      });
  }
}
