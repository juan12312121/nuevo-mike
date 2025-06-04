import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginacion-administrador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginacion-administrador.component.html',
  styleUrls: ['./paginacion-administrador.component.css']
})
export class PaginacionAdministradorComponent implements OnChanges {
  @Input() data: any[] = [];          // Lista completa de elementos
  @Input() pageSize: number = 8;      // Elementos por página
  @Input() dataLabel: string = 'elementos'; // Etiqueta para mostrar (“escuelas”, “carreras”, etc.)
  @Output() pageChanged = new EventEmitter<number>(); // Emite número de página al padre

  currentPage: number = 1;             // Página actual
  totalPages: number = 1;              // Total de páginas (se calcula)

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambian los datos, reiniciamos la página actual a 1 y recalculamos totalPages
    if (changes['data']) {
      this.currentPage = 1;
      this.updateTotalPages();
      this.emitCurrentPage();
    }
    // También si cambia pageSize
    if (changes['pageSize']) {
      this.updateTotalPages();
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
      this.emitCurrentPage();
    }
  }

  private updateTotalPages() {
    this.totalPages = Math.ceil(this.data.length / this.pageSize) || 1;
  }

  private emitCurrentPage() {
    this.pageChanged.emit(this.currentPage);
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.emitCurrentPage();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }

  // Array con índices de página [1, 2, 3, …]
  get pages(): number[] {
    const pagesArray: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  // Rango de elementos que se están mostrando (1–8, 9–16, etc.)
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  get endIndex(): number {
    const possibleEnd = this.currentPage * this.pageSize;
    return possibleEnd > this.data.length ? this.data.length : possibleEnd;
  }
}
