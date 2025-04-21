import { Component } from '@angular/core';
import { AsideJefecarreraComponent } from "../../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { PaginacionComponent } from "../../../componentes/paginacion/paginacion.component";

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [AsideJefecarreraComponent, PaginacionComponent],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})
export class GruposComponent {

}
