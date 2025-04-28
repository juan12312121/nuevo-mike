import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // <-- AQUÍ importas Router y RouterModule
import { AsideJefecarreraComponent } from "../../../componentes/aside-jefecarrera/aside-jefecarrera.component";

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [AsideJefecarreraComponent, RouterModule], // <-- Aquí lo usas
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css'
})
export class HorariosComponent {

  constructor(private router: Router) {}

  irACrearHorario() {
    this.router.navigate(['/crear-horario']);
  }
}
