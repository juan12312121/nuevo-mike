import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AsideJefecarreraComponent } from '../../componentes/aside-jefecarrera/aside-jefecarrera.component';
import { DashboardGraficasComponent } from '../../componentes/graficas/graficas.component';
import { PaginacionComponent } from "../../componentes/paginacion/paginacion.component";
import { AsistenciaTemaService } from '../../core/asistencia-tema/asistencia-tema.service';
import { JustificacionesService } from '../../core/justificaciones/justificaciones.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AsideJefecarreraComponent,
    DashboardGraficasComponent,
    PaginacionComponent
  ],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  @ViewChild('tablaExport', { static: false }) tabla!: ElementRef<HTMLTableElement>;

  asistencias: any[] = [];

  isModalOpen = false;
  justificacionActual: any = null;

  // Paginación
  paginaActual = 1;
registrosPorPagina = 10;
  // Modo de visualización
  modoVisualizacion = 'tabla'; // 'tabla' o 'graficas'

  cargando = true;
  error: string | null = null;
  public Math = Math;

  constructor(
    private asistenciaService: AsistenciaTemaService,
    private justificacionesService: JustificacionesService
  ) {}

  ngOnInit(): void {
    console.log('Inicializando PrincipalComponent...');
    this.asistenciaService.obtenerAsistencias().subscribe({
      next: datos => {
        console.log('Datos recibidos de servicio:', datos);
        this.asistencias = datos;
        this.cargando = false;
      },
      error: err => {
        this.error = 'Error al cargar asistencias';
        this.cargando = false;
        console.error('Error al obtener asistencias:', err);
      }
    });
  }

  verJustificante(asistenciaId: number) {
    console.log('Iniciando solicitud de justificación:', {
      asistenciaId,
      timestamp: new Date().toISOString()
    });

    this.justificacionesService.obtenerJustificacionPorAsistencia(asistenciaId).subscribe({
      next: (response) => {
        console.log('Respuesta completa:', response);
        
        if (response) {
          this.justificacionActual = response;
          this.isModalOpen = true;
          console.log('Justificación cargada exitosamente:', {
            justificacionId: this.justificacionActual.justificacion_id,
            asistenciaId: this.justificacionActual.asistencia_id,
            fecha: this.justificacionActual.fecha_asistencia
          });
        } else {
          console.log('No se encontró la justificación:', {
            asistenciaId,
            response
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener justificación:', {
          asistenciaId,
          status: error.status,
          message: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.justificacionActual = null;
  }

  // Método para obtener registros paginados
  obtenerRegistrosPaginados(): any[] {
    if (this.cargando) return [];
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    const paginados = this.asistencias.slice(inicio, fin);
    console.log(`Obteniendo registros paginados [página ${this.paginaActual}]:`, paginados);
    return paginados;
  }

  // Método para calcular total de páginas
  totalPaginas(): number {
    const total = Math.ceil(this.asistencias.length / this.registrosPorPagina);
    console.log('Total de páginas calculado:', total);
    return total;
  }

  // Método que maneja el cambio de página desde el componente de paginación
  onCambiarPagina(nuevaPagina: number): void {
    console.log('Cambiando a página:', nuevaPagina);
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual = nuevaPagina;
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
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      })
    );

    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    fs.saveAs(blob, 'asistencias.xlsx');
    console.log('Exportación completa');
  }
}