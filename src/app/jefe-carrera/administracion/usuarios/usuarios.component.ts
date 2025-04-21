import { Component } from '@angular/core';
import { AsideJefecarreraComponent } from '../../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { PaginacionComponent } from "../../../componentes/paginacion/paginacion.component";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [AsideJefecarreraComponent, PaginacionComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

}
