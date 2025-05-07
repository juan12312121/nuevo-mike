import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from "../../componentes/aside-jefecarrera/aside-jefecarrera.component"; // Importa el servicio
import { AsistenciaTemaService } from '../../core/asistencia-tema/asistencia-tema.service';


@Component({
  selector: 'app-temas-vistos',
  standalone: true,
  imports: [AsideJefecarreraComponent, CommonModule, FormsModule],
  templateUrl: './temas-vistos.component.html',
  styleUrls: ['./temas-vistos.component.css']
})
export class TemasVistosComponent implements OnInit {
  temasVistos: any[] = [];  // Arreglo para almacenar los temas vistos
  tipoRegistroFilter: string = ''; // Filtro para tipo de registro
  searchTerm: string = '';  // Término de búsqueda
  paginaActual: number = 1;  // Página actual para paginación

  constructor(private asistenciaTemaService: AsistenciaTemaService) {}

  ngOnInit(): void {
    this.obtenerTemasVistos();  // Llamar a la función cuando el componente se inicializa
  }

  // Función para obtener los temas vistos
  obtenerTemasVistos(): void {
    this.asistenciaTemaService.obtenerTemasVistos().subscribe(
      (data) => {
        this.temasVistos = data;  // Guardar los datos recibidos en el arreglo
        
        console.log('Temas vistos:', this.temasVistos);
      },
      (error) => {
        console.error('Error al obtener los temas vistos:', error);  // Manejar errores
      }
    );
  }


  // Función para cambiar la página
  cambiarPagina(direction: number): void {
    if (this.paginaActual + direction > 0 && this.paginaActual + direction <= this.totalPaginas()) {
      this.paginaActual += direction;
    }
  }

  // Función para obtener el total de páginas (según los temas por página)
  totalPaginas(): number {
    return Math.ceil(this.temasVistos.length / 10); // Se asume que hay 10 temas por página
  }

  // Función para obtener los temas actuales paginados
  obtenerTemasPaginados(): any[] {
    const startIndex = (this.paginaActual - 1) * 10; // Página actual multiplicada por los temas por página
    return this.temasVistos.slice(startIndex, startIndex + 10); // Retorna solo los temas de la página actual
  }
}
