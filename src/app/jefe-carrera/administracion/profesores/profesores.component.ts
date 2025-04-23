import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from '../../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { PaginacionComponent } from "../../../componentes/paginacion/paginacion.component";
import { UsuariosService } from '../../../core/autenticacion/usuarios.service';


@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [AsideJefecarreraComponent, PaginacionComponent,CommonModule,FormsModule],
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.css'
})
export class ProfesoresComponent implements OnInit {
editarProfesor(_t19: any) {
throw new Error('Method not implemented.');
}

  profesores: any[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerProfesores();
  }

  obtenerProfesores(): void {
    this.usuariosService.listarProfesores().subscribe({
      next: (res) => {
        this.profesores = res.profesores;
        console.log('Lista de profesores cargada en el componente:', this.profesores);
      },
      error: (err) => {
        console.error('Error al cargar profesores en el componente:', err);
      }
    });
  }

}
