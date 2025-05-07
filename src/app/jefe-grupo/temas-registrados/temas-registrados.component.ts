import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefeGrupoComponent } from '../../componentes/aside-jefe-grupo/aside-jefe-grupo.component';
import { AsistenciaTemaService } from '../../core/asistencia-tema/asistencia-tema.service';

@Component({
  selector: 'app-temas-registrados',
  standalone: true,
  imports: [AsideJefeGrupoComponent, FormsModule,CommonModule],
  templateUrl: './temas-registrados.component.html',
  styleUrls: ['./temas-registrados.component.css']
})
export class TemasRegistradosComponent implements OnInit {
  usuarioId!: number;
  nombreUsuario = '';
  carreraNombre = '';
  temas: any[] = [];
  public Math = Math;              

  
  // Paginación
  paginaActual: number = 1;
  registrosPorPagina: number = 10;
  temasFiltrados: any[] = [];
  searchTerm: string = '';
  estadoTema: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  constructor(private asistenciaTemaService: AsistenciaTemaService) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.usuarioId = usuario.id;
    this.nombreUsuario = usuario.nombre;
    this.carreraNombre = `Carrera ID ${usuario.carrera_id}`;

    // Cargar los temas registrados por el usuario logueado
    this.asistenciaTemaService.obtenerTemasVistosPorUsuario(this.usuarioId)
      .subscribe({
        next: (data) => {
          this.temas = data;
          this.temasFiltrados = [...data];  // Inicia los temas filtrados con todos los temas
          console.log('✅ Temas cargados:', data);
        },
        error: (err) => console.error('❌ Error al cargar temas:', err)
      });
  }

  // Función para aplicar los filtros
  aplicarFiltros(): void {
    this.temasFiltrados = this.temas.filter(tema => {
      return (
        (this.estadoTema ? tema.estado === this.estadoTema : true) &&
        (this.fechaInicio ? new Date(tema.fecha) >= new Date(this.fechaInicio) : true) &&
        (this.fechaFin ? new Date(tema.fecha) <= new Date(this.fechaFin) : true) &&
        (this.searchTerm ? tema.nombre_tema.toLowerCase().includes(this.searchTerm.toLowerCase()) : true)
      );
    });
    this.paginaActual = 1;  // Resetear a la primera página al aplicar los filtros
  }

  // Función para manejar la paginación
  cambiarPagina(direccion: number): void {
    const nuevaPagina = this.paginaActual + direccion;
    if (nuevaPagina > 0 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual = nuevaPagina;
    }
  }

  // Obtener los temas paginados
  temasPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.temasFiltrados.slice(inicio, fin);
  }

  // Calcular el número total de páginas
  totalPaginas(): number {
    return Math.ceil(this.temasFiltrados.length / this.registrosPorPagina);
  }
}
