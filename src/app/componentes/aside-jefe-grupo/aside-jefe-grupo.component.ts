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
    this.menuLinks.forEach(link => {
      this.renderer.listen(link.nativeElement, 'click', () => {
        this.menuLinks.forEach(l =>
          this.renderer.removeClass(l.nativeElement, 'active')
        );
        this.renderer.addClass(link.nativeElement, 'active');
      });
    });
  }

  navegar(ruta: string): void {
    this.router.navigate([ruta]);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
