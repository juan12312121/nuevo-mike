import { Component } from '@angular/core';
import { AsideJefecarreraComponent } from '../../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { PaginacionComponent } from "../../../componentes/paginacion/paginacion.component";


@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [AsideJefecarreraComponent, PaginacionComponent],
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.css'
})
export class ProfesoresComponent {

}
