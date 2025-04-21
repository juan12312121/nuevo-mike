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
  @Input() data: any[] = [];  // Entrada de datos genérica
  @Input() pageSize: number = 8;  // Número de elementos por página
  @Input() dataLabel: string = 'elementos'; // Etiqueta dinámica para los elementos (escuelas, carreras, etc.)
  @Output() pageChanged = new EventEmitter<number>(); // Emitir el cambio de página
  
  currentPage: number = 1;  // Página actual
  paginatedData: any[] = [];  // Los datos que se mostrarán según la paginación
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.paginateData();  // Vuelve a calcular los elementos a mostrar
    }
  }

  paginateData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.data.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.data.length / this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChanged.emit(this.currentPage); // Emitir solo la página
    }
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

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
