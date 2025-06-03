import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from "../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { PaginacionComponent } from "../../componentes/paginacion/paginacion.component";
import { AsistenciaTemaService } from '../../core/asistencia-tema/asistencia-tema.service';

@Component({
  selector: 'app-temas-vistos',
  standalone: true,
  imports: [
    AsideJefecarreraComponent,
    CommonModule,
    FormsModule,
    PaginacionComponent
  ],
  templateUrl: './temas-vistos.component.html',
  styleUrls: ['./temas-vistos.component.css']
})
export class TemasVistosComponent implements OnInit {
  temasVistos: any[] = [];
  tipoRegistroFilter: string = '';
  searchTerm: string = '';
  paginaActual: number = 1;

  // Definimos cuántos temas mostramos por página:
  registrosPorPagina: number = 10;

  constructor(private asistenciaTemaService: AsistenciaTemaService) {}

  ngOnInit(): void {
    this.obtenerTemasVistos();
  }

  // Función para obtener los temas vistos
  obtenerTemasVistos(): void {
    this.asistenciaTemaService.obtenerTemasVistos().subscribe(
      (data) => {
        this.temasVistos = data;
        console.log('Temas vistos:', this.temasVistos);
      },
      (error) => {
        console.error('Error al obtener los temas vistos:', error);
      }
    );
  }

  // Función para calcular el total de páginas, ahora usando 5 registros por página
  totalPaginas(): number {
    return Math.ceil(this.temasVistos.length / this.registrosPorPagina);
  }

  // Función para obtener los temas de la página actual (slice con 5 en vez de 10)
  obtenerTemasPaginados(): any[] {
    const startIndex = (this.paginaActual - 1) * this.registrosPorPagina;
    return this.temasVistos.slice(startIndex, startIndex + this.registrosPorPagina);
  }

  // Manejador cuando el componente de paginación emite el número de página seleccionado
  onCambiarPagina(nuevaPagina: number): void {
    console.log('Cambiando a página:', nuevaPagina);
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual = nuevaPagina;
    }
  }
}
