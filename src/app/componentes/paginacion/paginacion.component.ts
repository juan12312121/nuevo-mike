import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.css']
})
export class PaginacionComponent {
  
  @Input() paginaActual: number = 1;
  @Input() totalPaginas: number = 1;
  @Input() maxPaginasVisibles: number = 5;
  
  @Output() cambiarPagina = new EventEmitter<number>();
  
  irAPrimera(): void {
    if (this.paginaActual !== 1) {
      this.cambiarPagina.emit(1);
    }
  }
  
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.cambiarPagina.emit(this.paginaActual - 1);
    }
  }
  
  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.cambiarPagina.emit(this.paginaActual + 1);
    }
  }
  
  irAUltima(): void {
    if (this.paginaActual !== this.totalPaginas) {
      this.cambiarPagina.emit(this.totalPaginas);
    }
  }
  
  irAPagina(pagina: number): void {
    if (pagina !== this.paginaActual && pagina >= 1 && pagina <= this.totalPaginas) {
      this.cambiarPagina.emit(pagina);
    }
  }
  
  obtenerPaginasVisibles(): number[] {
    if (this.totalPaginas <= this.maxPaginasVisibles) {
      return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    }
    
    const mitad = Math.floor(this.maxPaginasVisibles / 2);
    let inicio = Math.max(1, this.paginaActual - mitad);
    let fin = Math.min(this.totalPaginas, inicio + this.maxPaginasVisibles - 1);
    
    if (fin - inicio + 1 < this.maxPaginasVisibles) {
      inicio = Math.max(1, fin - this.maxPaginasVisibles + 1);
    }
    
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  }
}