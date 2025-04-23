import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AsideJefecarreraComponent } from "../../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { ModalMateriasComponent } from "../../../componentes/modal-materias/modal-materias.component"; // Importa el servicio
import { PaginacionComponent } from "../../../componentes/paginacion/paginacion.component";
import { MateriasService } from '../../../core/materias/materias.service';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [AsideJefecarreraComponent, PaginacionComponent, ModalMateriasComponent, CommonModule],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']  // Cambié `styleUrl` a `styleUrls`
})
export class MateriasComponent implements OnInit {
  materias: any[] = [];  // Arreglo para almacenar las materias obtenidas
  errorMessage: string = '';  // Para manejar cualquier error

  constructor(private materiasService: MateriasService) {}

  ngOnInit(): void {
    this.obtenerMaterias();  // Llamamos a la función para obtener las materias cuando el componente se inicializa
  }

  // Método para obtener las materias
  obtenerMaterias(): void {
    this.materiasService.obtenerMaterias().subscribe(
      (response) => {
        // Acceder a la propiedad 'data' que contiene las materias
        if (response && response.data) {
          this.materias = response.data;  // Almacenamos las materias en el arreglo
          console.log('Materias obtenidas:', this.materias);  // Log de las materias obtenidas
        } else {
          this.errorMessage = 'No se encontraron materias.';  // Mensaje de error si no hay datos
        }
      },
      (error) => {
        this.errorMessage = 'Hubo un error al obtener las materias.';  // Manejo de errores
        console.error('Error al obtener las materias:', error);
      }
    );
  }
}
