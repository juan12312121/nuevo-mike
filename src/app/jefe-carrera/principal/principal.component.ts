import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AsideJefecarreraComponent } from '../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { DashboardGraficasComponent } from '../../componentes/graficas/graficas.component';
import { AsistenciaTemaService } from '../../core/asistencia-tema/asistencia-tema.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AsideJefecarreraComponent,
    DashboardGraficasComponent
  ],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  @ViewChild('tablaExport', { static: false }) tabla!: ElementRef<HTMLTableElement>;

  asistencias: any[] = [];
  asistenciasFiltradas: any[] = [];

  // Filtros
  tipoRegistroFilter = '';
  asistioFilter = '';
  fechaInicioFilter = '';
  fechaFinFilter = '';
  searchTerm = '';

  // Paginación
  paginaActual = 1;
  registrosPorPagina = 15;

  // Modo de visualización
  modoVisualizacion = 'tabla'; // 'tabla' o 'graficas'

  cargando = true;
  error: string | null = null;
  public Math = Math;

  constructor(private asistenciaService: AsistenciaTemaService) {}

  ngOnInit(): void {
    console.log('Inicializando PrincipalComponent...');
    this.asistenciaService.obtenerAsistencias().subscribe({
      next: datos => {
        console.log('Datos recibidos de servicio:', datos);
        this.asistencias = datos;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: err => {
        this.error = 'Error al cargar asistencias';
        this.cargando = false;
        console.error('Error al obtener asistencias:', err);
      }
    });
  }

  aplicarFiltros(): void {
    console.log('Aplicando filtros:', {
      tipoRegistro: this.tipoRegistroFilter,
      asistio: this.asistioFilter,
      fechaInicio: this.fechaInicioFilter,
      fechaFin: this.fechaFinFilter,
      searchTerm: this.searchTerm
    });
    let datos = this.asistencias;

    if (this.tipoRegistroFilter) {
      datos = datos.filter(a => a.tipo_registro === this.tipoRegistroFilter);
    }
    if (this.asistioFilter) {
      datos = datos.filter(a => a.asistio === this.asistioFilter);
    }
    if (this.fechaInicioFilter) {
      datos = datos.filter(a => a.fecha >= this.fechaInicioFilter);
    }
    if (this.fechaFinFilter) {
      datos = datos.filter(a => a.fecha <= this.fechaFinFilter);
    }
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      datos = datos.filter(a =>
        a.profesor_nombre.toLowerCase().includes(term) ||
        a.materia_nombre.toLowerCase().includes(term)
      );
    }

    this.paginaActual = 1;
    this.asistenciasFiltradas = datos;
    console.log('Datos filtrados:', this.asistenciasFiltradas);
  }

  obtenerRegistrosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const paginados = this.asistenciasFiltradas.slice(inicio, inicio + this.registrosPorPagina);
    console.log(`Obteniendo registros paginados [página ${this.paginaActual}]:`, paginados);
    return paginados;
  }

  totalPaginas(): number {
    const total = Math.ceil(this.asistenciasFiltradas.length / this.registrosPorPagina);
    console.log('Total de páginas calculado:', total);
    return total;
  }

  cambiarPagina(direccion: number): void {
    const nueva = this.paginaActual + direccion;
    console.log(`Cambiando página en dirección ${direccion}, nueva página: ${nueva}`);
    if (nueva > 0 && nueva <= this.totalPaginas()) {
      this.paginaActual = nueva;
    }
  }

  paginasVisibles(): number[] {
    const total = this.totalPaginas();
    const current = this.paginaActual;
    const maxVisibles = 5;
    let startPage: number;
    let endPage: number;

    if (total <= maxVisibles) {
      startPage = 1;
      endPage = total;
    } else {
      const before = Math.floor(maxVisibles / 2);
      const after = Math.ceil(maxVisibles / 2) - 1;

      if (current <= before) {
        startPage = 1;
        endPage = maxVisibles;
      } else if (current + after >= total) {
        startPage = total - maxVisibles + 1;
        endPage = total;
      } else {
        startPage = current - before;
        endPage = current + after;
      }
    }

    const visibles = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    console.log('Páginas visibles:', visibles);
    return visibles;
  }

  irAPagina(pagina: number): void {
    console.log('Ir a página:', pagina);
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  cambiarModo(modo: string): void {
    console.log('Cambiando modo de visualización a:', modo);
    this.modoVisualizacion = modo;
  }

  async exportarExcel() {
    console.log('Iniciando exportación a Excel');
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('Asistencias');

    const tabla = this.tabla.nativeElement as HTMLTableElement;
    const rows = Array.from(tabla.querySelectorAll('tr'));

    const headerCells = Array.from(rows[0].querySelectorAll('th')).map(th => th.textContent?.trim() || '');
    sheet.addRow(headerCells);
    console.log('Cabeceras para Excel:', headerCells);

    headerCells.forEach((_, col) => {
      const cell = sheet.getCell(1, col + 1);
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
    });
    sheet.autoFilter = { from: 'A1', to: 'H1' };

    rows.slice(1).forEach((rowElem, i) => {
      const values = Array.from(rowElem.querySelectorAll('td')).map(td => td.textContent?.trim() || '');
      console.log(`Fila ${i + 2} para Excel:`, values);
      const excelRow = sheet.addRow(values);

      const estadoCell = excelRow.getCell(6);
      const registroCell = excelRow.getCell(7);

      switch (values[5]) {
        case 'Asistió':
          estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
          break;
        case 'No Asistió':
          estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          break;
        case 'Justificado':
          estadoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF9C3' } };
          break;
      }
      switch (values[6]) {
        case 'Jefe de Grupo':
          registroCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
          break;
        case 'Checador':
          registroCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3E8FF' } };
          break;
        case 'Profesor':
          registroCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } };
          break;
      }
    });

    sheet.columns.forEach((col, i) => {
      const headerText = headerCells[i] || '';
      col.width = Math.max(headerText.length + 2, 15);
    });

    sheet.eachRow(row =>
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      })
    );

    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    fs.saveAs(blob, 'asistencias.xlsx');
    console.log('Exportación completa');
  }
}