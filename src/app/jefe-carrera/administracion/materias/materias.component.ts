import { Component } from '@angular/core';
import { AsideJefecarreraComponent } from "../../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { PaginacionComponent } from "../../../componentes/paginacion/paginacion.component";

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [AsideJefecarreraComponent, PaginacionComponent],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.css'
})
export class MateriasComponent {

}
