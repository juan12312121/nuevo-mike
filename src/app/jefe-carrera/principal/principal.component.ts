import { Component } from '@angular/core';
import { AsideJefecarreraComponent } from '../../componentes/aside-jefecarrera/aside-jefecarrera.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [AsideJefecarreraComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
