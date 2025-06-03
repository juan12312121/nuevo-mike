// src/app/aulas/aulas.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsideJefecarreraComponent } from "../../componentes/aside-jefecarrera/aside-jefecarrera.component";
import { ModalaulasComponent } from "../../componentes/modalaulas/modalaulas.component";
import { PaginacionComponent } from "../../componentes/paginacion/paginacion.component";
import { AulasService } from '../../core/aulas/aulas.service';

@Component({
  selector: 'app-aulas',
  standalone: true,
  imports: [
    AsideJefecarreraComponent,
    CommonModule,
    FormsModule,
    ModalaulasComponent,
    PaginacionComponent
  ],
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  aulas: any[] = [];
  filteredAulas: any[] = [];
  aulasPaginadas: any[] = [];
  searchQuery = '';
  errorMessage = '';
  showModal = false;
  paginaActual: number = 1;
  registrosPorPagina: number = 20;

  constructor(private aulasService: AulasService) {}

  ngOnInit(): void {
    this.obtenerAulas();
  }

  obtenerAulas(): void {
    this.aulasService.obtenerAulas().subscribe({
      next: (resp: any) => {
        this.aulas = resp.data ?? resp;
        this.aplicarFiltrosYPaginacion();
      },
      error: err => {
        console.error('Error al obtener aulas:', err);
        this.errorMessage = 'Hubo un error al cargar las aulas';
      }
    });
  }

  totalPaginas(): number {
    const total = Math.ceil(this.filteredAulas.length / this.registrosPorPagina);
    return total === 0 ? 1 : total; // Siempre mostrar al menos 1 página
  }

  // Método unificado para aplicar filtros y paginación
  aplicarFiltrosYPaginacion(): void {
    // Primero aplicar filtros
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredAulas = [...this.aulas];
    } else {
      this.filteredAulas = this.aulas.filter(a =>
        a.id.toString().includes(q) ||
        a.nombre.toLowerCase().includes(q)
      );
    }

    // Ajustar página actual si es necesario
    const totalPaginas = this.totalPaginas();
    if (this.paginaActual > totalPaginas && totalPaginas > 0) {
      this.paginaActual = totalPaginas;
    }
    if (this.paginaActual < 1) {
      this.paginaActual = 1;
    }

    // Luego aplicar paginación
    this.aplicarPaginacion();
  }

  aplicarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    this.aulasPaginadas = this.filteredAulas.slice(inicio, fin);
  }

  buscarAulas(): void {
    // Resetear a la primera página al buscar
    this.paginaActual = 1;
    this.aplicarFiltrosYPaginacion();
  }

  abrirModal(): void {
    this.showModal = true;
  }

  onModalChange(open: boolean): void {
    this.showModal = open;
  }

  onAulaCreada(aula: any): void {
    this.aulas.push(aula);
    
    // Si hay una búsqueda activa, verificar si el nuevo aula debe aparecer en los resultados
    const q = this.searchQuery.trim().toLowerCase();
    const aulaCoincide = !q || 
      aula.id.toString().includes(q) || 
      aula.nombre.toLowerCase().includes(q);
    
    if (aulaCoincide) {
      this.filteredAulas.push(aula);
      
      // Ir a la última página donde aparece el nuevo elemento
      const totalPaginas = this.totalPaginas();
      this.paginaActual = totalPaginas;
      this.aplicarPaginacion();
    }
  }

  eliminarAula(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta aula?')) return;
    
    this.aulasService.eliminarAula(id).subscribe({
      next: () => {
        this.aulas = this.aulas.filter(a => a.id !== id);
        this.aplicarFiltrosYPaginacion();
        alert('Aula eliminada correctamente');
      },
      error: err => {
        console.error('Error al eliminar aula:', err);
        alert('No se pudo eliminar el aula');
      }
    });
  }

  onCambiarPagina(nuevaPagina: number): void {
    console.log('Cambiando a página:', nuevaPagina);
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual = nuevaPagina;
      this.aplicarPaginacion();
    }
  }

  obtenerUltimoRegistroMostrado(): number {
    const ultimo = this.paginaActual * this.registrosPorPagina;
    return ultimo > this.filteredAulas.length ? this.filteredAulas.length : ultimo;
  }

  // Métodos auxiliares para debugging
  get mostrarPaginacion(): boolean {
    return true; // Siempre mostrar paginación
  }

}